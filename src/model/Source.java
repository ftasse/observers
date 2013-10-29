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

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class Source extends Jsonifiable {
    
    @Expose
    public static String kind = "observers#source";
    
    public static Key<Source> key(long id) {
        return Key.create(Source.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;


    @Index
    @Getter
    @Setter
    @Expose
	private String vendor;

    @Index
    @Getter
    @Setter
    @Expose
	private String hashedId;

    @Index
    @Getter
    @Setter
    @Expose
    private String username;
}