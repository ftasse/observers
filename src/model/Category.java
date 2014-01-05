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

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Category extends Jsonifiable {
    
    @Expose
    public static String kind = "observers#category";
	
    public static Key<Category> key(long id) {
        return Key.create(Category.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;

    @Index
    @Getter
    @Setter
    @Expose
	private String title;

    @Getter
    @Setter
    @Expose
	private List<String> keywords;

    @Index
    @Getter
    @Setter
    @Expose
	Long parentId;

    @Index
    @Getter
    @Setter
    @Expose
    Long topicId;
}