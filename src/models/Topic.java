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
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.User;

@PersistenceCapable
    public class Topic {
    @PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;

    @Persistent
	private User manager;

    @Persistent
	private List<Source> sources;

    @Persistent
	private List<Category> categories;

    @Persistent
	private String title;

    @Persistent
	private String shortDescription;

    @Persistent
	private Text longDescription;

    @Persistent
	private Date startDate;

    public Topic(User manager, String title, List<Source> sources, List<Category> categories,
		 String shortDescription, Text longDescription, Date startDate) {
        this.manager = manager;
	this.title = title;
	this.sources = sources;
	this.categories = categories;
	this.shortDescription = shortDescription;
	this.longDescription = longDescription;
	this.startDate = startDate;
    }

    // Accessors for the fields. JDO doesn't use these, but your application does.

    public Key getKey() {
        return key;
    }

    public User getManager() {
	return manager;
    }

    public String getTitle() {
	return title;
    }

    public void setTitle(String title) {
	this.title = title;
    }

    public List<Source> getSources() {
	return sources;
    }

    public void setSources(List<Source> sources) {
	this.sources = sources;
    }

    public List<Category> getCategories() {
	return categories;
    }

    public void setCategories(List<Category> categories) {
	this.categories = categories;
    }

    public String getShortDescription() {
	return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
	this.shortDescription = shortDescription;
    }

    public Text getLongDescription() {
	return longDescription;
    }

    public void setLongDescription(Text longDescription) {
	this.longDescription = longDescription;
    }

    public Date getStartDate() {
	return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
}