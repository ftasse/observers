package com.observers.model;

import static com.observers.model.OfyService.ofy;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Date;
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
	private Long managerUserId;

    @Getter
    @Setter
    @Expose
	private List<Long> sourceIds;

    @Getter
    @Setter
    @Expose
	private List<Long> categoryIds;

    @Index
    @Getter
    @Setter
    @Expose
	private String title;

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
	private Date startDate;
}