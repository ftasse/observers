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
public class TwitterAccount extends Jsonifiable {

    @Expose
    public static String kind = "observers#twitterchannel";
    
    public static Key<TwitterAccount> key(long id) {
        return Key.create(TwitterAccount.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;

    @Index
    @Getter
    @Setter
    @Expose
    private Long topicId;

    @Index
    @Getter
    @Setter
    @Expose
    private String twitterUserId;

    @Index
    @Getter
    @Setter
    @Expose
    private String name;	

    @Getter
    @Setter
    @Expose
    private String hashtag;

    @Getter
    @Setter
    private Long latestTweetId;

	@Getter
    @Setter
 	private String accessToken;

 	@Getter
    @Setter
 	private String accessTokenSecret;
}