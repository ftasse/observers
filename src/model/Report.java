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

import java.util.List;
import java.util.Date;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Report extends Jsonifiable {
    
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
	private Long sourceId;

    @Getter
    @Setter
    @Expose
	private List<Long> categoryIds;

    @Getter
    @Setter
    @Expose
	private Link mediaUrl;

    @Index
    @Getter
    @Setter
    @Expose
	private long numVotes;

    @Index
    @Getter
    @Setter
    @Expose
	private String mood;

    @Index
    @Getter
    @Setter
    @Expose
	private GeoPt location;

    @Index
    @Getter
    @Setter
    @Expose
	private Date postDate;

      @OnLoad
    protected void setupVoteNum() {
        List<Vote> votes = ofy().load().type(Vote.class)
        .filter("reportId", id)
        .list();
        numVotes = votes.size();
  }
}