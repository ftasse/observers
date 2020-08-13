package com.observers.model;

import static com.observers.model.OfyService.ofy;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.OnLoad;
import com.googlecode.objectify.annotation.OnSave;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import java.util.logging.Logger;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;

import com.observers.servlet.PredictServlet;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Report extends Jsonifiable {

    private static final Logger log = Logger.getLogger(Report.class.getName());
    private static final String MODEL_ID = "sentiment_identifier";


    public enum Mood {
        Negative, Positive, Neutral, Unknown
    }

    public static Mood computeMood(String text, String modelId)
    {
        if (modelId == null)
            modelId = MODEL_ID;

        try
            {
                Mood mood;
                String label = PredictServlet.getPredictionOutputLabel(text, modelId);
                if (label.equals("positive") || label.equals("1"))
                {
                    mood = Mood.Positive;
                } else if (label.equals("negative") || label.equals("0"))
                {
                    mood = Mood.Negative;
                } else if (label.equals("neutral"))
                {
                    mood = Mood.Neutral;
                }
                else
                    mood = Mood.Unknown;
                return mood;
            } catch (Exception e)
            {
                log.warning("An error occured:" + e);
            }
            return null;
    }
    
    @Expose
    public static String kind = "observers#report";
    
    public static Key<Report> key(long id) {
        return Key.create(Report.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;

    @Getter
    @Setter
    @Expose
	private Text content;


    @Index
    @Getter
    @Setter
    @Expose
	private Long topicId;

    @Index
    @Getter
    @Setter
    @Expose
	private Long channelId;

    @Index
    @Getter
    @Setter
    @Expose
    private String channelReportId;

    @Index
    @Getter
    @Setter
    @Expose
    private String authorId;

    @Index
    @Getter
    @Setter
    @Expose
    private Long numChannelLikes;


    @Getter
    @Setter
    @Expose
    private List<Long> categoryIds;

    @Getter
    @Setter
    @Expose
	private List<Link> mediaUrls;

    @Index
    @Getter
    @Setter
    @Expose
	private long numVotes;

    @Index
    @Getter
    @Setter
    @Expose
	private Mood mood;

    @Index
    @Getter
    @Setter
    @Expose
	private GeoPt location;

    @Index
    @Getter
    @Setter
    @Expose
	private Date created;

    @Index
    @Getter
    @Setter
    @Expose
    private Date retrieved;

    @OnSave
    protected void setupMood() {
        if (content.getValue() != null && (mood == null || mood == Mood.Unknown))
        {
            Topic topic = ofy().load().type(Topic.class).id(topicId).get();
            String modelId = topic.getTrainedSentimentModelId();

            Mood computedMood = computeMood(content.getValue(), modelId);
            if (computedMood == null)
            {
                computedMood = Mood.Unknown;
            }
            mood = computedMood;
            ofy().save().entity(this).now();
        }            
    }

    @OnLoad
    protected void setupVoteNum() {
        List<Vote> votes = ofy().load().type(Vote.class)
        .filter("reportId", id)
        .list();
        numVotes = votes.size();
    }

  @OnSave
  protected void updateTopicReportCount()
  {
    if (id == null)
    {
        Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
        topic.updateNumReports();
    }
  }

  public void addCategoryId(Long categoryId)
  {
    if (categoryIds == null)
        categoryIds = new ArrayList<Long> ();
    categoryIds.add(categoryId);
  }

  public void addMediaUrl(Link link)
  {
    if (mediaUrls == null)  mediaUrls = new ArrayList<Link>();
    mediaUrls.add(link);
  }

  public void addMediaUrl(String url)
  {
    addMediaUrl(new Link(url));
  }

  public void delete()
  {
    Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();

    List<Vote> votes = ofy().load().type(Vote.class).filter("reportId", id).list();
    ofy().delete().entities(votes);
    ofy().delete().entities(this).now();

    topic.updateNumReports();
    ofy().save().entity(topic).now();
  }
}