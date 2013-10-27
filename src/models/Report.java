package com.observers.model;

import com.google.appengine.api.datastore.Key;

import java.util.List;
import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.observers.model.Category;
import com.observers.model.Source;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;

@PersistenceCapable
    public class Report {
    @PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;

    @Persistent
	private String content;


    @Persistent
	private Source source;

    @Persistent
	private List<Category> categories;

    @Persistent
	private Link mediaUrl;

    @Persistent
	private long numLikes;

    @Persistent
	private String mood;

    @Persistent
	private GeoPt location;

    @Persistent
	private Date postDate;

    public Report(String content, Source source, List<Category> categories, Link mediaUrl, 
		  GeoPt location, long numLikes, String mood, Date postDate) {
        this.content = content;
	this.source = source;
	this.categories = categories;
        this.mediaUrl = mediaUrl;
	this.location = location;
	this.numLikes = numLikes;
	this.mood = mood;
        this.postDate = postDate;
    }

    // Accessors for the fields. JDO doesn't use these, but your application does.

    public Key getKey() {
        return key;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Category> getCategories() {
	return categories;
    }

    public void setCategories(List<Category> categories) {
	this.categories = categories;
    }

    public Link getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(Link mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public Source getSource() {
	return source;
    }

    public void setSource(Source source) {
	this.source = source;
    }

    public GeoPt getLocation() {
	return location;
    }

    public void setLocation(GeoPt location) {
	this.location = location;
    }

    public long getNumLikes() {
	return numLikes;
    }

    public void setNumLikes(long numLikes) {
	this.numLikes = numLikes;
    }

    public String getMood() {
	return mood;
    }

    public void setMood(String mood) {
	this.mood = mood;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
    }
}