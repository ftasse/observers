package com.observers.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;

import java.net.MalformedURLException;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.ProtocolException;

import static com.observers.model.OfyService.ofy;
import com.observers.model.Jsonifiable;
import com.observers.model.Topic;
import com.observers.model.User;
import com.observers.model.Channel;
import com.observers.model.TwitterAccount;
import com.observers.model.TwilioAccount;
import com.observers.model.FacebookAccount;
import com.observers.model.Message;

import com.googlecode.objectify.NotFoundException;
import com.googlecode.objectify.cmd.Query;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import com.google.gson.annotations.Expose;

import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;
import com.google.gson.JsonObject;


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

@Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
    final String doesNotExist = "Topic with given ID does not exist. or Channel with given ID does not exists";

    try {
      checkAuthorization(req);

      List<ChannelData> channelDataList = new ArrayList<ChannelData> ();
      Type listType = new TypeToken<ArrayList<ChannelData>>() { }.getType();
      channelDataList = Jsonifiable.GSON.fromJson(req.getReader(), listType);

      if (channelDataList.size() == 0 || req.getParameter("topicId") == null)
        throw new IOException();

      Long userId = Long.parseLong(req.getSession()
          .getAttribute(CURRENT_USER_SESSION_KEY).toString());
      Long topicId = Long.valueOf(req.getParameter("topicId"));
      Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();

      if (!topic.getOwnerUserId().equals(userId))
        throw new NotFoundException();

      for (ChannelData data: channelDataList)
      {
        Channel channel = null;
        if (data.id != null)
        {
          channel = ofy().load().key(Channel.key(data.id)).safeGet();
          if (channel == null)
            throw new NotFoundException ();

          if (data.source == Channel.Source.Twitter)
          {
            TwitterAccount account = ofy().load().key(TwitterAccount.key(channel.getAccountId())).safeGet();
            if (account != null && (!account.getName().equals(data.account.name) || !account.getHashtag().equals(data.account.hashtag))) {
              account.setName(data.account.name);
              account.setHashtag(data.account.hashtag);
              ofy().save().entity(account).now();
            }
          } else if (data.source == Channel.Source.Twilio)
          {
            String hashtag = data.account.hashtag;
            //if (!(hashtag.length()==0)) 
            {
              TwilioAccount account = ofy().load().key(TwilioAccount.key(channel.getAccountId())).safeGet();
              if (account != null && !account.getHashtag().equals(hashtag))
              {
                account.setValidHashtag(hashtag);
                ofy().save().entity(account).now();
              }
             
            }
          }
        } else
        {
          if (data.source == Channel.Source.None)
            topic.getDefaultAccount();
          else if (data.source == Channel.Source.Twitter)
          {
            String name = data.account.name;
            String hashtag = data.account.hashtag;
            channel = createNewTwitterChannel(topicId, name, hashtag, getHostURL(req), req.getRequestedSessionId());
          } else if (data.source == Channel.Source.Twilio)
          {
            String hashtag = data.account.hashtag;
            channel = createNewTwilioChannel(topicId, hashtag, getHostURL(req), req.getRequestedSessionId());
          }
        }
      }

      Collection<Channel> channels = topic.getChannels();
      sendResponse(req, resp, channels, "observers#channels");

    } catch (NotFoundException nfe) {
      sendError(resp, 404, doesNotExist);
    } catch (NumberFormatException e) {
      sendError(resp, 404, doesNotExist);
    } catch (UserNotAuthorizedException e) {
      sendError(resp, 401,
          "Unauthorized request");
    } catch (IOException e)
    {
      sendError(resp, 404, "Could not process your request body");
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

  protected Channel createNewTwitterChannel(Long topicId, String name, String hashtag, String host_url, String sessionid)
    throws IOException
  {
    Channel channel = null;

    try {
      URL url = new URL(host_url + "/api/twitter?topicId=" + topicId);    
      String payload = String.format("{\"name\":\"%1$s\",\"hashtag\":\"%2$s\"}", name, hashtag);
      HttpURLConnection connection = createURLConnection(url, "POST", payload, sessionid);
      
      if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
          BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
          channel = Jsonifiable.GSON.fromJson(reader, Channel.class);
          if (channel != null)
          {
            channel  = ofy().load().key(Channel.key(channel.getId())).safeGet();
          }
          reader.close();
          return channel;
      } else {
          throw new IOException();
      }
      
    } catch (MalformedURLException e) {
      return null;
    } 
  }

  protected Channel createNewTwilioChannel(Long topicId, String hashtag, String host_url, String sessionid) 
      throws IOException
  {

    hashtag = TwilioAccount.getValidHashtag(hashtag);
    Channel channel = null;

    try {
      URL url = new URL(host_url + "/api/twilio?topicId=" + topicId + "&hashtag=" + hashtag);
      HttpURLConnection connection = createURLConnection(url, "POST", "", sessionid);
      
      if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
          BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
          channel = Jsonifiable.GSON.fromJson(reader, Channel.class);
          if (channel != null)
          {
            channel  = ofy().load().key(Channel.key(channel.getId())).safeGet();
          }
          reader.close();
          return channel;
      } else {
          throw new IOException();
      }
    } catch (MalformedURLException e) {
        return null;
    }
  }

  protected HttpURLConnection  createURLConnection(URL url, String method, String params, String sessionid)
    throws IOException, ProtocolException
  {
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setDoOutput(true);
    connection.setRequestMethod(method);

    connection.setRequestProperty("Content-Type", "application/json");
    connection.setRequestProperty("Accept", "application/json");
    connection.setRequestProperty("Cookie", "JSESSIONID=" + sessionid);
    OutputStreamWriter osw = new OutputStreamWriter(connection.getOutputStream());
    osw.write(params);
    osw.flush();
    osw.close();
        
    return connection;
  }

  public static class AccountData extends Jsonifiable {
    public static String kind = "observers#channelaccountdata";

    @Expose
    public Long id;

    @Expose
    public String name;

    @Expose
    public String hashtag; 
  }

  public static class ChannelData extends Jsonifiable {
    public static String kind = "observers#topichanneldata";

    @Expose
    public Long id;

    @Expose
    public Channel.Source source;

    @Expose
    public AccountData account; 
  }

}
