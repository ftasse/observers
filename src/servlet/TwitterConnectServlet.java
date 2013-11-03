package com.observers.servlet;

import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.auth.RequestToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.observers.model.OfyService.ofy;
import com.observers.model.Topic;

import com.googlecode.objectify.NotFoundException;

public class TwitterConnectServlet extends JsonRestServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
        throws ServletException, IOException {
        try {

            if (req.getParameter("topicId") == null)
                throw new IOException();

            checkAuthorization(req);
            Long topicId = Long.parseLong(req.getParameter("topicId"));
            Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
            Long userId = Long.parseLong(req.getSession()
                .getAttribute(CURRENT_USER_SESSION_KEY).toString());
            if (!userId.equals(topic.getOwnerUserId())) {
                throw new NotFoundException();
            }

            Twitter twitter = TWITTER_FACTORY.getInstance();
            req.getSession().setAttribute("twitter", twitter);

            StringBuffer callbackURL = req.getRequestURL();
            int index = callbackURL.lastIndexOf("/");
            callbackURL.replace(index, callbackURL.length(), "").append("/callback");

            RequestToken requestToken = twitter.getOAuthRequestToken(callbackURL.toString());
            req.getSession().setAttribute("requestToken", requestToken);
            req.getSession().setAttribute("topicId", topicId);
            resp.sendRedirect(requestToken.getAuthenticationURL());

        } catch (TwitterException e) {
            throw new ServletException(e);
        } catch (IOException e) {
            sendError(resp, 400, "Unable to read topic data from request body");
        } catch (NotFoundException e) {
            sendError(resp, 400, "Unable to read topic data from request body");
        } catch (UserNotAuthorizedException e) {
            sendError(resp, 401, "Unauthorized request");
        }
    }
}