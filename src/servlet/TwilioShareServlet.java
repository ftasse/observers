package com.observers.servlet;


import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.TwilioRestException;
import com.twilio.sdk.resource.instance.Account;
import com.twilio.sdk.resource.factory.SmsFactory;
import com.twilio.sdk.resource.instance.Sms;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.logging.Logger;

import com.observers.model.TwilioAccount;
import com.observers.model.Topic;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.observers.model.Jsonifiable;
import com.googlecode.objectify.NotFoundException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import static com.observers.model.OfyService.ofy;
import com.googlecode.objectify.NotFoundException;
import com.google.gson.annotations.Expose;

/*
{
    message: ...
    sender_name: ...
    recipients: [ {name:"Flora", phoneNumber:"+44 9090909090"}, ...]
}
*/
public class TwilioShareServlet extends JsonRestServlet {
    private static final Logger log = Logger.getLogger(TwilioShareServlet.class.getName());

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            checkAuthorization(request);

            if (request.getParameter("topicId") == null)
                throw new IOException();

            Long topicId = Long.parseLong(request.getParameter("topicId"));
            Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
            if (topic == null)
                throw new IOException();
            long numSmsShares = topic.getNumSmsShares();

            TwilioAccount account = ofy().load().type(TwilioAccount.class)
                    .filter("topicId", topic.getId()).first().get();

            if (account == null)
                throw new NotFoundException();

            if (account.getPhoneNumbers() == null || account.getPhoneNumbers().size() == 0)
                throw new NotFoundException();

            String fromNumber = account.getPhoneNumbers().get(0).getNumber();
            
            ShareViaSMS share = Jsonifiable.fromJson(request.getReader(), ShareViaSMS.class);
            if (share == null || share.sender_name == null || share.recipients == null || share.recipients.size()==0)
                throw new IOException();

            // Instantiate a new Twilio Rest Client 
            TwilioRestClient client = new TwilioRestClient(account.getTwilioAccountId(), account.getAuthToken());
            Account twilioAccount = client.getAccount();
            SmsFactory smsFactory = twilioAccount.getSmsFactory();

            String topic_url = "http://gcdc2013-observers.appspot.com/dashboard/?topicId=" + topic.getId(); 
            String generic_msg = "check out reports about the topic '" + topic.getTitle() + "' at " + topic_url + ".";
            generic_msg += "SMS your own reports to " + fromNumber + " .\n";
            generic_msg += "Sent by " + share.sender_name;

            List<Sms> sent_messages = new ArrayList<Sms>();

            // Iterate over all our recipients
            for (Recipient recipient : share.recipients) {
                 
                //build map of post parameters 
                Map<String,String> params = new HashMap<String,String>();
                params.put("From", fromNumber);
                params.put("To", recipient.phoneNumber);
                params.put("Body", "Hi " + recipient.name + ", " + generic_msg);
 
                // send an sms a call  
                // ( This makes a POST request to the SMS/Messages resource)
                //try
                {
                    //Sms sms = smsFactory.create(params);
                    //sent_messages.add(sms);
                    log.info("Sent Sms: " + params);
                    numSmsShares++;
                } /*catch (TwilioRestException e) {
                    log.severe("Failed to send sms: " + e);
                }*/
            }

            topic.setNumSmsShares(numSmsShares);
            ofy().save().entity(topic).now();
            
            Gson gson = new GsonBuilder().create();
            sendResponse(request, response, gson.toJson(sent_messages), "observers#smsshare");
        }   catch (UserNotAuthorizedException e) {
                sendError(response, 401, "Unauthorized request");
            } catch (IOException e) {
                sendError(response, 400, "Unable to read twilio account data from request body");
            } catch (NotFoundException e)
            {
                sendError(response, 404, "Topic with given ID does not exists");
            }
    }

    public class ShareViaSMS extends Jsonifiable {

        @Expose
        public String message;

        @Expose
        public String sender_name;

        @Expose
        public List<Recipient> recipients;
    }

    public class Recipient extends Jsonifiable {
        @Expose
        public String name;

        @Expose
        public String phoneNumber;
    }

}