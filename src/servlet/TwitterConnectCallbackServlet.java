package com.observers.servlet;

import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.auth.RequestToken;
import twitter4j.auth.AccessToken;

import com.observers.model.TwitterAccount;
import com.observers.model.Channel;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.observers.model.OfyService.ofy;

public class TwitterConnectCallbackServlet extends JsonRestServlet {
    private static final long serialVersionUID = 1657390011452788111L;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Long topicId = (Long) req.getSession().getAttribute("topicId");
        Twitter twitter = (Twitter) req.getSession().getAttribute("twitter");
        RequestToken requestToken = (RequestToken) req.getSession().getAttribute("requestToken");
        String verifier = req.getParameter("oauth_verifier");
        try {
            AccessToken accessToken = twitter.getOAuthAccessToken(requestToken, verifier);
            req.getSession().removeAttribute("requestToken");
            req.getSession().removeAttribute("topicId");

            String twitterUserId = String.valueOf(twitter.verifyCredentials().getId());
            String screenName = twitter.showUser(twitter.verifyCredentials().getId()).getScreenName();
            String token = accessToken.getToken();
            String tokenSecret = accessToken.getTokenSecret();

            TwitterAccount account = ofy().load().type(TwitterAccount.class)
            .filter("twitterUserId", twitterUserId).filter("topicId", topicId).first().get();
            if (account == null) {
                account = new TwitterAccount();
                account.setTwitterUserId(twitterUserId);
                account.setName(screenName);
                account.setTopicId(topicId);
            }
            account.setAccessToken(token);
            account.setAccessTokenSecret(tokenSecret);
            ofy().save().entity(account).now();

            Channel channel = ofy().load().type(Channel.class)
            .filter("accountId", account.getId()).first().get();
            if (channel == null)
            {
                channel = new Channel();
                channel.setAccountId(account.getId());
                channel.setSource(Channel.Source.Twitter);
                channel.setTopicId(topicId);
                channel.setScreenName(account.getName());
                ofy().save().entity(channel).now();
            }
            sendResponse(req, resp, channel);

        } catch (TwitterException e) {
            throw new ServletException(e);
        }
        resp.sendRedirect(req.getContextPath() + "/");
    }
}