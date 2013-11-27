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

import com.google.gson.JsonElement;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Date;
import java.lang.Iterable;
import com.google.appengine.api.datastore.Text;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Topic extends Jsonifiable {
    
    @Expose
    public static String kind = "observers#topic";
    
    public static Key<Topic> key(long id) {
        return Key.create(Topic.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;

    @Index
    @Getter
    @Setter
    @Expose
	private Long ownerUserId;

    @Index
    @Getter
    @Setter
    @Expose
	private String title;

    @Index
    @Getter
    @Setter
    @Expose
    private long numSmsShares;

    @Index
    @Getter
    @Setter
    @Expose
    private long numReports;

    @Index
    @Getter
    @Setter
    private String trainedSentimentModelId;

    @Getter
    @Setter
    @Expose
    private boolean supportsSms;

    @Getter
    @Setter
    @Expose
	private String shortDescription;

    @Getter
    @Setter
    @Expose
	private Text longDescription;

    @Index
    @Getter
    @Setter
    @Expose
	private Date created;

    @OnLoad
    protected void setupSupportsSms() {
        TwilioAccount account = ofy().load().type(TwilioAccount.class)
        .filter("topicId", getId())
        .first().get();
        supportsSms = (account != null);
  }

    @OnLoad
    protected void setupNumReports() {
        if (numReports == 0)
        {
            numReports = ofy().load().type(Report.class).filter("topicId", id).count();
            if (numReports > 0) {
             ofy().save().entity(this).now();
             ofy().clear();
            }
        }
  }

    public Collection<Channel> getChannels() {
        return ofy().load().type(Channel.class).filter("topicId", getId()).list();
    }

    public Collection<Category> getCategories() {
        return ofy().load().type(Category.class).filter("topicId", getId()).list();
    }

    public void delete()
    {
      ofy().delete().entities(getCategories()).now();

      Collection<Channel> channels = getChannels();
      for (Channel channel: channels)
        channel.delete();

      List<Report> topicReports = ofy().load().type(Report.class)
      .filter("topicId", id).list();
      for (Report report: topicReports)
        report.delete();

      ofy().delete().entity(this).now();
    }

    public DefaultWebAccount getDefaultAccount()
    {
        DefaultWebAccount account = ofy().load().type(DefaultWebAccount.class).filter("topicId", getId())
        .first().get();

        if (account == null)
        {
            account = new DefaultWebAccount();
            account.setTopicId(getId()); 
            ofy().save().entity(account).now();
    
            Channel channel = new Channel ();
            channel.setSource(Channel.Source.None);
            channel.setTopicId(getId());
            channel.setAccountId(account.getId());
            channel.setScreenName("web_form_channel");
            ofy().save().entity(channel).now();
        } 
        return account;
    }
}
