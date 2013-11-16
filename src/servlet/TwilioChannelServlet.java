package com.observers.servlet;

import java.util.List;
import java.util.ArrayList;
import java.util.Calendar;

import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.TwilioRestException;
import com.twilio.sdk.resource.instance.Account;

import com.twilio.sdk.TwilioRestException;
import com.twilio.sdk.resource.factory.AccountFactory;
import com.twilio.sdk.resource.factory.SmsFactory;
import com.twilio.sdk.resource.instance.Message;
import com.twilio.sdk.resource.instance.Media;
import com.twilio.sdk.resource.instance.IncomingPhoneNumber;
import com.twilio.sdk.resource.instance.AvailablePhoneNumber;
import com.twilio.sdk.resource.list.MessageList;
import com.twilio.sdk.resource.list.MediaList;
import com.twilio.sdk.resource.list.IncomingPhoneNumberList;
import com.twilio.sdk.resource.list.AvailablePhoneNumberList;
import com.twilio.sdk.resource.list.AccountList;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import java.util.HashMap;
import java.util.Map;
import java.util.Locale;

import com.observers.model.TwilioAccount;
import com.observers.model.Channel;
import com.observers.model.Topic;
import com.observers.model.Report;
import com.observers.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.observers.model.Jsonifiable;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.datastore.PhoneNumber;
import com.googlecode.objectify.NotFoundException;
import com.google.gson.annotations.Expose;

import static com.observers.model.OfyService.ofy;

import com.observers.tools.Iso2Phone;

public class TwilioChannelServlet extends JsonRestServlet {
    private static final long serialVersionUID = 1657390011452788111L;

    private String MY_TWILIO_ACCOUNT_ID="***REMOVED***";
    private String MY_TWILIO_AUTH_TOKEN="***REMOVED***";

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            checkAuthorization(req);
            Long userId = (Long) req.getSession().getAttribute(CURRENT_USER_SESSION_KEY);

            if (req.getParameter("topicId") == null)
                throw new NotFoundException();

            Long topicId = Long.parseLong(req.getParameter("topicId"));
            Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
            if (!userId.equals(topic.getOwnerUserId())) {
              throw new NotFoundException();
            }

            TwilioAccount account = null;
            TwilioTokenData accountDetails = Jsonifiable.fromJson(req.getReader(), TwilioTokenData.class);
            
            Channel channel = null;

            if (accountDetails != null)
            {

                if (accountDetails.authToken == null || accountDetails.twilioAccountId == null)
                {
                    throw new IOException();
                }
                else
                {
                    account = new TwilioAccount();
                    account.setTwilioAccountId(accountDetails.twilioAccountId);
                    account.setAuthToken(accountDetails.authToken);

                    //Check if Twilio account is valid
                    TwilioRestClient client = new TwilioRestClient(MY_TWILIO_ACCOUNT_ID, MY_TWILIO_AUTH_TOKEN);
                    Account twilioAccount = client.getAccount();
                    account.setName(twilioAccount.getFriendlyName());
                    IncomingPhoneNumberList phoneNumbers = twilioAccount.getIncomingPhoneNumbers();
                    for (IncomingPhoneNumber phoneNumber: phoneNumbers)
                    {
                        account.addPhoneNumber(new PhoneNumber(phoneNumber.getPhoneNumber()));
                    }
                }
            } else
            {
                account = ofy().load().type(TwilioAccount.class).filter("topicId", topicId).first().get();
                if (account != null)
                {
                    channel = ofy().load().type(Channel.class).filter("accountId", account.getId()).first().get();
                    sendResponse(req, resp, channel);
                } else
                {
                    //Create a Twilio subaccount
                    TwilioRestClient client = new TwilioRestClient(MY_TWILIO_ACCOUNT_ID, MY_TWILIO_AUTH_TOKEN);
                    User user = ofy().load().type(User.class).id(userId).get();
                    String friendlyName = user.getGoogleDisplayName()+"|"+topic.getId();

                    // Build a filter for the AccountList
                    List<NameValuePair> params = new ArrayList<NameValuePair>();
                    params.add(new BasicNameValuePair("FriendlyName", friendlyName));
                    AccountFactory accountFactory = client.getAccountFactory();

                    final Map<String, String> params1 = new HashMap<String, String>();
                    params1.put("FriendlyName", friendlyName);
                    AccountList subaccountList = client.getAccounts(params1);
                    List<Account> subaccounts;

                    Account subaccount = null;
                    if (subaccountList != null && (subaccounts = subaccountList.getPageData()).size()>0 )
                        subaccount = subaccounts.get(0);
                    else
                        subaccount = accountFactory.create(params);


                    account = new TwilioAccount();
                    account.setName(subaccount.getFriendlyName());
                    account.setTwilioAccountId(subaccount.getSid());
                    account.setAuthToken(subaccount.getAuthToken());

                    Locale locale = req.getLocale();
                    String countryPhoneCode = Iso2Phone.getPhone(locale.getISO3Country());
                    
                    IncomingPhoneNumberList phoneNumberList = subaccount.getIncomingPhoneNumbers();
                    if (phoneNumberList != null)
                    {
                        List<IncomingPhoneNumber> phoneNumbers = phoneNumberList.getPageData();
                        for (IncomingPhoneNumber phoneNumber: phoneNumbers)
                        {
                            account.addPhoneNumber(new PhoneNumber(phoneNumber.getPhoneNumber()));
                        }
                    }
                    else
                    {
                        client = new TwilioRestClient(subaccount.getSid(), subaccount.getAuthToken());
                        final AvailablePhoneNumberList availPhoneNumbers = subaccount.getAvailablePhoneNumbers();
                        final List<AvailablePhoneNumber> list = availPhoneNumbers.getPageData();
                        // Buy the first number returned
                        final Map<String, String> params2 = new HashMap<String, String>();
                        params2.put("PhoneNumber", list.get(0).getPhoneNumber());
                        params2.put("VoiceUrl", "http://demo.twilio.com/welcome/voice/");
                        params2.put("SmsUrl", "http://demo.twilio.com/welcome/voice/");
                        IncomingPhoneNumber number = subaccount.getIncomingPhoneNumberFactory().create(params2);
                        account.addPhoneNumber(new PhoneNumber (number.getPhoneNumber()));
                    }
                    
                }
            }

            if (channel == null)
            {
                account.setTopicId(topicId);
                ofy().save().entity(account).now();

                channel = new Channel();
                channel.setAccountId(account.getId());
                channel.setSource(Channel.Source.Twilio);
                channel.setTopicId(topicId);
                channel.setScreenName(account.getName());
                ofy().save().entity(channel).now();

                ofy().clear();
                channel = ofy().load().type(Channel.class).id(channel.getId()).get();
            }

            
            sendResponse(req, resp, channel);
        } catch (UserNotAuthorizedException e) {
            sendError(resp, 401, "Unauthorized request");
        } catch (IOException e) {
            sendError(resp, 400, "Unable to read twilio account data from request body");
        } catch (NotFoundException e)
        {
            sendError(resp, 404, "Topic with given ID does not exists");
        } catch (TwilioRestException e) {
            sendError(resp, 404, "Twilio Rest Exception\n" + e);
        }
    }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
    throws IOException {
    
    try {
            if (req.getParameter("topicId") == null)
                throw new NotFoundException();

            checkAuthorization(req);
            Long userId = (Long) req.getSession().getAttribute(CURRENT_USER_SESSION_KEY);
            Long topicId = Long.parseLong(req.getParameter("topicId"));
            Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
            if (!userId.equals(topic.getOwnerUserId())) {
              throw new NotFoundException();
            }

            List<Report> added_reports = new ArrayList<Report>();

            List<TwilioAccount> accounts = ofy().load().type(TwilioAccount.class)
            .filter("topicId", topicId).list();
            for (TwilioAccount account: accounts)
            {
                TwilioRestClient client = new TwilioRestClient(account.getTwilioAccountId(), account.getAuthToken());
 
                //http://www.twilio.com/docs/api/rest/message
                final Map<String, String> filters = new HashMap<String, String>();
                filters.put("To", "");
                //filters.put("DateSent", ">=2013-11-06");
                    
                MessageList messages = client.getAccount().getMessages(filters);
                Channel channel = ofy().load().type(Channel.class)
                    .filter("accountId", account.getId()).filter("topicId", topicId).first().get();

                // Loop over messages and print out a property for each one.
                for (Message message : messages) {
                    if (!message.getStatus().equals("received"))
                        continue;

                    //http://twilio.github.io/twilio-java/com/twilio/sdk/resource/instance/Message.html
                
                    String messageId = message.getSid();
                    Report report = ofy().load().type(Report.class)
                    .filter("channelId", channel.getId())
                    .filter("topicId", topicId)
                    .filter("channelReportId", messageId).first().get();

                    if (report == null)
                    {
                        report = new Report();
                        report.setChannelReportId(messageId);
                        report.setChannelId(channel.getId());
                        report.setTopicId(topicId);
                        report.setAuthorId(message.getFrom());
                        report.setContent(new Text(message.getBody()));
                        report.setNumChannelLikes(Long.valueOf(0));

                        report.setMood(Report.computeMood(message.getBody(), topic.getTrainedSentimentModelId()));
                        
                        /*GeoLocation location = status.getGeoLocation();
                        if (location != null)
                            report.setLocation(new GeoPt((float)location.getLatitude(), (float)location.getLongitude()));
                        */

                        MediaList mediaList = message.getMedia();
                        try 
                        {
                           
                            if (mediaList != null) {
                                List<Media> medias = mediaList.getPageData();
                                for(Media media : medias){
                                    report.addMediaUrl(media.getUri());
                                }
                            }
                        }  catch (RuntimeException e) {
                            //sendError(resp, 404, "Twilio Rest Exception\n" + e);
                        }
                        
                        report.setCreated(message.getDateSent());
                        report.setRetrieved(Calendar.getInstance().getTime());

                        ofy().save().entity(report).now();
                        added_reports.add(report);

                        account.setLatestMessageId(messageId);                
                    }
                }
                ofy().save().entity(account).now();
            }

            ofy().clear();
            sendResponse(req, resp, added_reports, "observers#reports");
        } /*catch (TwilioRestException te) {
            te.printStackTrace();
            //throw new ServletException();
        }*/ catch (NotFoundException e)
        {
            sendError(resp, 404, "Topic with given ID does not exists");
        } catch (UserNotAuthorizedException e) {
            sendError(resp, 401, "Unauthorized request");
        }
    }


    public static class TwilioTokenData extends Jsonifiable {
        public static String kind = "observers#twiliotokendata";

        @Expose
        public String twilioAccountId;

        @Expose
        public String authToken;
    }

}