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
public class Channel extends Jsonifiable {

    public enum Source { Twilio, Twitter, GooglePlus, Facebook, None}
    
    @Expose
    public static String kind = "observers#channel";
    
    public static Key<Channel> key(long id) {
        return Key.create(Channel.class, id);
    }

    @Id
    @Getter
    @Expose
    private Long id;

    @Getter
    @Setter
    @Expose
    protected Source source;

    @Index
    @Getter
    @Setter
    @Expose
    private Long topicId;

    @Getter
    @Setter
    @Expose
    private String screenName;

    @Index
    @Getter
    @Setter
    private Long accountId;

    public void delete()
    {
        if (accountId != null)
        {
            if (source == Source.Twitter)
                ofy().delete().entity(ofy().load().key(TwitterAccount.key(accountId)).safeGet()).now();
            else if (source == Source.Facebook)
                ofy().delete().entity(ofy().load().key(FacebookAccount.key(accountId)).safeGet()).now();
            else if (source == Source.Twilio)
                ofy().delete().entity(ofy().load().key(TwilioAccount.key(accountId)).safeGet()).now();
        }
        ofy().delete().entity(this).now();
    }
}