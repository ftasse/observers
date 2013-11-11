package com.observers.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;

import static com.observers.model.OfyService.ofy;
import com.observers.model.Jsonifiable;
import com.observers.model.Topic;
import com.observers.model.User;
import com.observers.model.Message;

import com.googlecode.objectify.NotFoundException;
import com.googlecode.objectify.cmd.Query;
/**
 * Provides an API for working with Topics. This servlet provides the
 * /api/topics endpoint, and exposes the following operations:
 *
 *   POST /api/topics
 *   GET /api/topics
 *   GET /api/topics?topicId=1234
 *   GET /api/topics?userId=me
 *   GET /api/topics?topicId=1234&userId=me
 *   PUT /api/topics?topicId=1234
 *   DELETE /api/topics?topicId=1234
 *
 * @author floratasse@gmail.com (Flora Tasse)
 */
public class TopicsServlet extends JsonRestServlet {

 /**
   * Exposed as `POST /api/topics`.
   *
   * Takes the following payload in the request body.
   * {
   *   "title":"",
   *   "shortDescription":"",
   *   "longDescription":""
   * }
   *
   * Returns the following JSON response representing the Topic that was
   * created:
   * {
   *   "id":0,
   *   "title":"",
   *   "ownerUserId":0,
   *   "shortDescription":"",
   *   "longDescription":"",
   *   "created":...
   * }
   *
   * Issues the following errors along with corresponding HTTP response codes:
   *
   * 400: "Failed to read topic data from the request body."
   * 401: "Unauthorized request" (if certain parameters are present in the
   *      request)
   *
   * @see javax.servlet.http.HttpServlet#doPost(
   *     javax.servlet.http.HttpServletRequest,
   *     javax.servlet.http.HttpServletResponse)
 */
 @Override
 protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
 	try {
 		checkAuthorization(req);
 		Long currentUserId = (Long) req.getSession().getAttribute(
 			CURRENT_USER_SESSION_KEY);
 		User author = ofy().load().type(User.class).id(currentUserId).get();

 		Topic topic = Jsonifiable.fromJson(req.getReader(), Topic.class);

 		if (topic == null)
 			throw new IOException();

 		topic.setOwnerUserId(author.getId());
 		topic.setCreated(Calendar.getInstance().getTime());

 		ofy().save().entity(topic).now();
 		ofy().clear();
 		topic = ofy().load().type(Topic.class).id(topic.getId()).get();
 		sendResponse(req, resp, topic);
 	} catch (UserNotAuthorizedException e) {
 		sendError(resp, 401, "Unauthorized request");
 	} catch (IOException e) {
 		sendError(resp, 400, "Unable to read topic data from request body");
 	}
 }


/**
   * Exposed as `GET /api/topics`.
   *
   * Accepts the following request parameters.
   *
   * 'topicId': id of the requested topic. Will return a single Topic.
   * 'userId': id of the owner of the topic. Will return the collection of
   *           topics for that user. The keyword ‘me’ can be used and will be
   *           converted to the logged in user. Requires auth.
   *
   * Returns the following JSON response representing a list of Topics.
   *
   * [
   *   	{
   *   		"id":0,
   *   		"title":"",
   *   		"ownerUserId":0,
   *   		"shortDescription":"",
   *   		"longDescription":"",
   *   		"created":...
   * 	},
   *   	...
   * ]
   *
   * Issues the following errors along with corresponding HTTP response codes:
   * 401: "Unauthorized request" (if certain parameters are present in the
   *      request)
   *
   * @see javax.servlet.http.HttpServlet#doGet(
   *     javax.servlet.http.HttpServletRequest,
   *     javax.servlet.http.HttpServletResponse)
   */
@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
	try {
		String topicId = req.getParameter("topicId");
		String userIdParam = req.getParameter("userId");
		Long userId;
		Long currentUserId = null;
		if(req.getSession().getAttribute(CURRENT_USER_SESSION_KEY) != null) {
			currentUserId = Long.parseLong(req.getSession()
				.getAttribute(CURRENT_USER_SESSION_KEY).toString());
		}
		Query<Topic> q = ofy().load().type(Topic.class);
		if (topicId != null) {
      	// Get the topic with the given ID and return it.
			Topic topic = q.filter("id", Long.parseLong(topicId)).first().get();
			sendResponse(req, resp, topic);
		} else {
			if (userIdParam != null) {
          // If the key word me is used, retrieve the current user from the session
          // The user needs to be authenticated to use 'me'
				if (userIdParam.equals("me")) {
					checkAuthorization(req);
					userId = currentUserId;
				} else {
					userId = Long.parseLong(userIdParam);
				}
            	// Get all topics for the user.
				q = q.filter("ownerUserId", userId);
			}

      List<Topic> topics = q.list();
      sendResponse(req, resp, topics, "observers#topics");
		}
	} catch (UserNotAuthorizedException e) {
		sendError(resp, 401, "Unauthorized request");
	}
}

 /**
   * Exposed as `PUT /api/topics`.
   *
   * Takes the following payload in the request body.
   * {
   *   "title":"",
   *   "shortDescription":"",
   *   "longDescription":""
   * }
   *
   * Returns the following JSON response representing the Topic that was
   * created:
   * {
   *   "id":0,
   *   "title":"",
   *   "ownerUserId":0,
   *   "shortDescription":"",
   *   "longDescription":"",
   *   "created":...
   * }
   *
   * Issues the following errors along with corresponding HTTP response codes:
   *
   * 400: "Failed to read topic data from the request body."
   * 401: "Unauthorized request" (if certain parameters are present in the
   *      request)
   *
   * @see javax.servlet.http.HttpServlet#doPost(
   *     javax.servlet.http.HttpServletRequest,
   *     javax.servlet.http.HttpServletResponse)
 */
 @Override
 protected void doPut(HttpServletRequest req, HttpServletResponse resp) {
 	try {
 		checkAuthorization(req);
 		Long topicId = Long.parseLong(req.getParameter("topicId"));
      	Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
      	Long userId = Long.parseLong(req.getSession()
          .getAttribute(CURRENT_USER_SESSION_KEY).toString());
      	if (!userId.equals(topic.getOwnerUserId())) {
        	throw new NotFoundException();
      	}

 		Topic new_topic = Jsonifiable.fromJson(req.getReader(), Topic.class);
 		topic.setTitle(new_topic.getTitle());
 		topic.setShortDescription(new_topic.getShortDescription());
 		topic.setLongDescription(new_topic.getLongDescription());

 		ofy().save().entity(topic).now();
 		sendResponse(req, resp, topic);
 	} catch (UserNotAuthorizedException e) {
 		sendError(resp, 401, "Unauthorized request");
 	} catch (IOException e) {
 		sendError(resp, 400, "Unable to read topic data from request body");
 	}
 }

   /**
   * Exposed as `DELETE /api/topics`.
   *
   * Accepts the following request parameters.
   *
   * 'topicId': id of the topic to delete.
   *
   * Returns the following JSON response representing success.
   * "Topic successfully deleted."
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
      Long topicId = Long.parseLong(req.getParameter("topicId"));
      Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
      Long userId = Long.parseLong(req.getSession()
          .getAttribute(CURRENT_USER_SESSION_KEY).toString());
      if (!userId.equals(topic.getOwnerUserId())) {
        throw new NotFoundException();
      }

      topic.delete();

      sendResponse(req, resp, new Message("Topic successfully deleted"),
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
