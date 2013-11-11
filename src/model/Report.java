package com.observers.model;

import static com.observers.model.OfyService.ofy;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.OnLoad;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Date;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Report extends Jsonifiable {

    public enum Mood {
        Sad, Happy, Indifferent, Unknown
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

    @OnLoad
    protected void setupMood() {
        if (mood == null)
            mood = Mood.Unknown;
    }

    @OnLoad
    protected void setupVoteNum() {
        List<Vote> votes = ofy().load().type(Vote.class)
        .filter("reportId", id)
        .list();
        numVotes = votes.size();
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
    List<Vote> votes = ofy().load().type(Vote.class).filter("reportId", id).list();
    ofy().delete().entities(votes);
    ofy().delete().entities(this).now();
  }
}