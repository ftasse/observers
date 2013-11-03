package com.observers.model;

import static com.observers.model.OfyService.ofy;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.EntitySubclass;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class FacebookAccount extends Jsonifiable {

    @Expose
    public static String kind = "observers#facebookchannel";
    
    public static Key<FacebookAccount> key(long id) {
        return Key.create(FacebookAccount.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;

    @Index
    @Getter
    @Setter
    @Expose
    private String facebookId;

    @Index
    @Getter
    @Setter
    @Expose
    private String name;

	@Getter
    @Setter
 	private String accesToken;

    @Getter
    @Setter
    private Long expiresAt;
}