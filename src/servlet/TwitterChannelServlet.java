package com.observers.servlet;

import java.util.List;
import java.util.ArrayList;
import java.util.Calendar;

import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.Paging;
import twitter4j.Status;
import twitter4j.GeoLocation;
import twitter4j.URLEntity;
import twitter4j.TwitterException;
import twitter4j.auth.RequestToken;
import twitter4j.auth.AccessToken;
import twitter4j.json.DataObjectFactory;

import com.observers.model.TwitterAccount;
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

import static com.observers.model.OfyService.ofy;

import com.observers.tools.Iso2Phone;

public class TwitterChannelServlet extends JsonRestServlet {
    private static final long serialVersionUID = 1657390011452788111L;

    private String ACCESS_TOKEN="***REMOVED***";
    private String ACCESS_TOKEN_SECRET="***REMOVED***";

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            checkAuthorization(req);
            Long userId = (Long) req.getSession().getAttribute(CURRENT_USER_SESSION_KEY);
            TwitterAccount account = Jsonifiable.fromJson(req.getReader(), TwitterAccount.class);

            if (account == null || account.getName() == null || req.getParameter("topicId") == null)
                throw new IOException();

            Long topicId = Long.parseLong(req.getParameter("topicId"));
            Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
            if (!userId.equals(topic.getOwnerUserId())) {
              throw new NotFoundException();
            }

            if (account.getAccessToken() == null || account.getAccessTokenSecret() == null)
            {
                account.setAccessToken(ACCESS_TOKEN);
                account.setAccessTokenSecret(ACCESS_TOKEN_SECRET);
            }
            account.setTopicId(topicId);
            ofy().save().entity(account).now();

            Channel channel = new Channel();
            channel.setAccountId(account.getId());
            channel.setSource(Channel.Source.Twitter);
            channel.setTopicId(topicId);
            channel.setScreenName(account.getName());
            ofy().save().entity(channel).now();

            
            ofy().clear();
            channel = ofy().load().type(Channel.class).id(channel.getId()).get();
            sendResponse(req, resp, channel);
        } catch (UserNotAuthorizedException e) {
            sendError(resp, 401, "Unauthorized request");
        } catch (IOException e) {
            sendError(resp, 400, "Unable to read report data from request body");
        } catch (NotFoundException e)
        {
            sendError(resp, 404, "Topic with given ID does not exists");
        }
    }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
    throws IOException {
    
    try {
            if (req.getParameter("topicId") == null)
                throw new IOException();

            checkAuthorization(req);
            Long userId = (Long) req.getSession().getAttribute(CURRENT_USER_SESSION_KEY);
            Long topicId = Long.parseLong(req.getParameter("topicId"));
            Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
            if (!userId.equals(topic.getOwnerUserId())) {
              throw new NotFoundException();
            }

            List<Report> added_reports = new ArrayList<Report>();
            TwitterFactory factory = new TwitterFactory();
            Twitter twitter = factory.getInstance();
                
            List<TwitterAccount> accounts = ofy().load().type(TwitterAccount.class)
            .filter("topicId", topicId).list();
            for (TwitterAccount account: accounts)
            {
                AccessToken accessToken = new AccessToken(account.getAccessToken(), account.getAccessTokenSecret());
                //twitter.setOAuthConsumerKey("[consumer key]", "[consumer secret]");
                twitter.setOAuthAccessToken(accessToken);
                Paging paging = new Paging(1, 100);
                if (account.getLatestTweetId() !=null)
                    paging.setSinceId(Long.parseLong(account.getLatestTweetId()));
                List<Status> statuses = twitter.getUserTimeline(account.getName(), paging);
                if (statuses.size() > 0)
                {
                    account.setLatestTweetId(String.valueOf(statuses.get(0).getId()));
                    ofy().save().entity(account).now();
                }

                Channel channel = ofy().load().type(Channel.class)
                    .filter("accountId", account.getId()).filter("topicId", topicId).first().get();
                for (Status status: statuses)
                {
                    Long tweetId = status.getId();
                    Report report = ofy().load().type(Report.class)
                    .filter("channelId", channel.getId())
                    .filter("channelReportId", tweetId)
                    .filter("topicId", topicId).first().get();

                    if (report == null)
                    {
                        report = new Report();
                        report.setChannelReportId(String.valueOf(tweetId));
                        report.setChannelId(channel.getId());
                        report.setTopicId(topicId);
                        report.setContent(new Text(status.getText()));
                        report.setNumChannelLikes(Long.valueOf(status.getFavoriteCount()));


                        String authorId = String.valueOf(status.getUser().getId());
                        report.setAuthorId(authorId);

                        GeoLocation location = status.getGeoLocation();
                        if (location != null)
                            report.setLocation(new GeoPt((float)location.getLatitude(), (float)location.getLongitude()));

                        List<Link> mediaUrls = new ArrayList<Link>();
                        URLEntity[] urls = status.getURLEntities();
                        for(URLEntity url : urls){
                            mediaUrls.add(new Link(url.getURL()));
                        }
                        if (mediaUrls.size()>0)
                            report.setMediaUrls(mediaUrls);
                        
                        report.setCreated(status.getCreatedAt());
                        report.setRetrieved(Calendar.getInstance().getTime());

                        ofy().save().entity(report).now();
                        added_reports.add(report);
                    }
                }
            }


            ofy().clear();
            sendResponse(req, resp, added_reports, "observers#reports");
        } catch (TwitterException te) {
            te.printStackTrace();
            //throw new ServletException();
        } catch (NotFoundException e)
        {
            sendError(resp, 404, "Topic with given ID does not exists");
        } catch (UserNotAuthorizedException e) {
            sendError(resp, 401, "Unauthorized request");
        } 
    }

}