package com.observers.servlet;

import java.util.List;
import java.util.ArrayList;
import java.util.Calendar;

import com.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.TwilioRestException;
//import com.twilio.sdk.resource.factory.SmsFactory;
//import com.twilio.sdk.resource.instance.Sms;
import com.twilio.sdk.resource.list.SmsList;
import com.twilio.sdk.verbs.TwiMLResponse;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.Message;
import com.twilio.sdk.verbs.Sms;

import java.util.HashMap;
import java.util.Map;
import java.util.Date;
import java.util.logging.Logger;

import com.observers.model.TwilioAccount;
import com.observers.model.Channel;
import com.observers.model.Topic;
import com.observers.model.Report;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import com.observers.model.Jsonifiable;
import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Link;
import com.google.appengine.api.datastore.Text;
import com.googlecode.objectify.NotFoundException;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;

import static com.observers.model.OfyService.ofy;
import com.googlecode.objectify.NotFoundException;

public class TwilioReplyServlet extends JsonRestServlet {
    private static final Logger log = Logger.getLogger(TwilioReplyServlet.class.getName());

    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String message = "Invalid request to post a report!";
        TwilioAccount account = null;

        //https://www.twilio.com/docs/api/twiml/sms/twilio_request#request-parameters
        //try {
            String fromNumber = request.getParameter("From");
            String sentMessage = request.getParameter("Body");
            String sentMessageId = request.getParameter("MessageSid");
            int numMedia = Integer.valueOf(request.getParameter("NumMedia"));
            Date sentMessageDate = Calendar.getInstance().getTime();

            String twilioAccountId = request.getParameter("AccountSid");
            
            account = ofy().load().type(TwilioAccount.class)
            .filter("twilioAccountId", twilioAccountId).first().get();
            if (account == null)
            {
                message = "Sorry, but you cannot send reports to this number at the moment. Try again later.";
            }
            else
            {
                Channel channel = ofy().load().type(Channel.class)
                .filter("accountId", account.getId()).first().get();
                Report old_report = ofy().load().type(Report.class)
                .filter("channelId", channel.getId()).filter("authorId", fromNumber).first().get();

                if (old_report == null) {
                    // Use a generic message
                    message = "Thanks for your report! See other reports at ..." ;
                } else {
                    // Use the caller's name
                    message = "Thanks for another report! See other reports at ...";
                }
                Report report = new Report ();
                report.setAuthorId(fromNumber);
                report.setChannelId(channel.getId());
                report.setTopicId(channel.getTopicId());
                    report.setChannelReportId(sentMessageId); //SMS Id
                    report.setContent(new Text(sentMessage)); //SMS message

                    if (numMedia == 1)
                    {
                        report.addMediaUrl(request.getParameter("MediaUrl"));
                    } else
                    for (int i = 1; i <= numMedia; ++i)
                    {
                        String param_title = "MediaUrl" + i + "";
                        report.addMediaUrl(request.getParameter(param_title));
                    }

                    String city = request.getParameter("FromCity");
                    String state = request.getParameter("FromState");
                    String zip = request.getParameter("FromZip");
                    String country = request.getParameter("FromCountry");

                    if (country != null)
                    {
                        String address = city + " " + zip + ", " + state + ", " + country;
                        List<GeoPt> results  = geoLocationsFromString(address, "en");
                        if (results.size() > 0)
                        {
                            report.setLocation(results.get(0));
                        }
                    }

                    report.setCreated(sentMessageDate); //Date message was sent
                    report.setRetrieved(Calendar.getInstance().getTime());

                    account.setLatestMessageId(sentMessageId); //SMS Id
                    ofy().save().entity(report).now();
                    ofy().save().entity(account).now();
            }

            // Create a TwiML response and add our friendly message.
            TwiMLResponse twiml = new TwiMLResponse();

            //https://www.twilio.com/docs/api/twiml/sms/message
            /*Sms sms = new Sms(message);
            twiml.append(sms);*/
            log.info("Reply message: " + message);

            response.setContentType("application/xml");
            response.getWriter().print(twiml.toXML());

        /*} catch (TwiMLException e) {
            e.printStackTrace();
        } */
    }

}