package com.observers.model;

import com.google.appengine.api.datastore.Key;

import java.util.List;
import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
    public class Category {
    @PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;

    @Persistent
	private String title;

    @Persistent
	private List<String> keywords;

    @Persistent
	Category parent;


    public Category(String title, List<String> keywords, Category parent) {
        this.title = title;
	this.keywords = keywords;
        this.parent = parent;
    }

    // Accessors for the fields. JDO doesn't use these, but your application does.

    public Key getKey() {
        return key;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getKeywords() {
	return keywords;
    }

    public void setKeywords(List<String> keywords) {
	this.keywords = keywords;
    }

    public Category getParent() {
        return parent;
    }

    public void setParent(Category parent) {
        this.parent = parent;
    }
}