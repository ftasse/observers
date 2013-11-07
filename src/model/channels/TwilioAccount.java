package com.observers.model;

import static com.observers.model.OfyService.ofy;

import com.google.gson.annotations.Expose;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.EntitySubclass;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import com.google.appengine.api.datastore.PhoneNumber;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Entity
@Cache
@EqualsAndHashCode(of="id", callSuper=false)
public class TwilioAccount extends Jsonifiable {

    @Expose
    public static String kind = "observers#twiliochannel";
    
    public static Key<TwilioAccount> key(long id) {
        return Key.create(TwilioAccount.class, id);
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
    private String name;

    @Index
    @Getter
    @Setter
    @Expose
    private String twilioAccountId;

    @Getter
    @Setter
    @Expose
    private List<PhoneNumber> phoneNumbers;

    @Index
    @Getter
    @Setter
    private String latestMessageId;

	@Getter
    @Setter
 	private String authToken;

    public void addPhoneNumber(PhoneNumber phoneNumber)
    {
        if (phoneNumbers == null) phoneNumbers = new ArrayList<PhoneNumber>();
        phoneNumbers.add(phoneNumber);
    }
}