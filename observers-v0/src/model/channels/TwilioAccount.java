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


import java.math.BigInteger;
import java.security.SecureRandom;

import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.TwilioRestException;
import com.twilio.sdk.resource.instance.Account;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import com.observers.servlet.JsonRestServlet;

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
    private String hashtag;

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

    public static String getValidHashtag(String new_hashtag)
    {
        /*if (!(new_hashtag.length() == 0) && new_hashtag.charAt(0) != '#')  new_hashtag = "#" + new_hashtag;

        while ((new_hashtag.length()==0) || ofy().load().type(TwilioAccount.class).filter("hashtag", new_hashtag).list().size() > 0 )
        {
          new_hashtag = '#' + (new BigInteger(16, new SecureRandom()).toString(32));
        }*/
        return new_hashtag.toLowerCase();
    }

    public void setValidHashtag(String new_hashtag) {
        
        hashtag = TwilioAccount.getValidHashtag(new_hashtag);
    }

    public void delete() {
        TwilioRestClient client = new TwilioRestClient(JsonRestServlet.MY_TWILIO_ACCOUNT_ID, JsonRestServlet.MY_TWILIO_AUTH_TOKEN);
        Account account = client.getAccount(twilioAccountId);
        System.out.println("TwilioAccount status" + account.getStatus());
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("Status", "closed"));

        try {
            account.update(params);
        } catch (TwilioRestException e) {
            System.out.println("Cannot close account: \n" + e);
        }

        ofy().delete().entity(this).now();
    }
}