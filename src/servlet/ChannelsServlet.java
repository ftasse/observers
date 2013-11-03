package com.observers.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;

import static com.observers.model.OfyService.ofy;
import com.observers.model.Jsonifiable;
import com.observers.model.Topic;
import com.observers.model.User;
import com.observers.model.Channel;
import com.observers.model.TwitterAccount;
import com.observers.model.FacebookAccount;
import com.observers.model.Message;

import com.googlecode.objectify.NotFoundException;
import com.googlecode.objectify.cmd.Query;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

/**
 * Provides an API for working with Topics. This servlet provides the
 * /api/topics endpoint, and exposes the following operations:
 *
 *   GET /api/channels?topicId=1234(&channelId=1234)
 *   DELETE /api/channels?channelId=1234
 *
 * @author floratasse@gmail.com (Flora Tasse)
 */
public class ChannelsServlet extends JsonRestServlet {

/**
   * Exposed as `GET /api/channels`.
   *
   * Accepts the following request parameters.
   *
   * 'topicId': id of the topic of interest. 
   * 'channelId': id of the requested channel. Will return a single Channel.
   *
   * Returns the following JSON response representing a list of Channels.
   *
   * [
   *    {
   *      "id":0,
   *      "topicId":0,
   *      "source":"TWITTER",
   *      "account":{...}
   *   },
   *   	...
   * ]
   *
   * Issues the following errors along with corresponding HTTP response codes:
   *
   *
   * @see javax.servlet.http.HttpServlet#doGet(
   *     javax.servlet.http.HttpServletRequest,
   *     javax.servlet.http.HttpServletResponse)
   */
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
	try {
    if (req.getParameter("channelId") != null)
    {
        Long channelId = Long.parseLong(req.getParameter("channelId"));
        Channel channel = ofy().load().key(Channel.key(channelId)).safeGet();      
        if (channel == null) throw new NotFoundException();
        sendResponse(req, resp, channel);
    } else if (req.getParameter("topicId") != null)
    {
      Long topicId = Long.parseLong(req.getParameter("topicId"));
      Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
      Collection<Channel> channels = topic.getChannels();
      sendResponse(req, resp, channels, "observers#channels");
    } else
    throw new IOException(); 
    
	} catch (IOException e) {
    sendError(resp, 400, "Unable to read topic data from request body");
  }
}

 /**
   * Exposed as `DELETE /api/channels`.
   *
   * Accepts the following request parameters.
   *
   * 'channelId': id of the channel to delete.
   *
   * Returns the following JSON response representing success.
   * "Channel successfully deleted."
   *
   * Issues the following errors along with corresponding HTTP response codes:
   * 401: "Unauthorized request" (if certain parameters are present in the
   *      request)
   * 404: "Topic with given ID does not exist."
   *
   * @see javax.servlet.http.HttpServlet#doDelete(
   *     javax.servlet.http.HttpServletRequest,
   *     javax.servlet.http.HttpServletResponse)
   */
  @Override
  protected void doDelete(HttpServletRequest req, HttpServletResponse resp) {
    final String doesNotExist = "Topic with given ID does not exist.";
    try {
      checkAuthorization(req);
      Long userId = Long.parseLong(req.getSession()
          .getAttribute(CURRENT_USER_SESSION_KEY).toString());

      Long channelId = Long.parseLong(req.getParameter("channelId"));
      Channel channel = ofy().load().key(Channel.key(channelId)).safeGet();
      if (channel == null) throw new NotFoundException();

      Topic topic = ofy().load().key(Topic.key(channel.getTopicId())).safeGet();
      if (!userId.equals(topic.getOwnerUserId())) {
        throw new UserNotAuthorizedException();
      }

      channel.delete();

      sendResponse(req, resp, new Message("Channel successfully deleted"),
          "observers#message");
    } catch (NotFoundException nfe) {
      sendError(resp, 404, doesNotExist);
    } catch (NumberFormatException e) {
      sendError(resp, 404, doesNotExist);
    } catch (UserNotAuthorizedException e) {
      sendError(resp, 401,
          "Unauthorized request");
    }
  }

}