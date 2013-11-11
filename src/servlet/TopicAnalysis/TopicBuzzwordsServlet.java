package com.observers.servlet;

import static com.observers.model.OfyService.ofy;

import com.observers.model.Topic;
import com.observers.model.Message;

import com.googlecode.objectify.NotFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *   GET /api/topics/buzzwords
 *
 * @author floratasse@gmail.com (Flora Tasse)
 */
public class TopicBuzzwordsServlet extends JsonRestServlet {
  
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
     final String doesNotExist = "Topic with given ID does not exist.";
    
    try {
      Long topicId = Long.parseLong(req.getParameter("topicId"));
      Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
      
      sendResponse(req, resp, new Message("Topic successfully accessed. TODO: return buzzwords"),
          "observers#message");
    } catch (NotFoundException nfe) {
      sendError(resp, 404, doesNotExist);
    } catch (NumberFormatException e) {
      sendError(resp, 404, doesNotExist);
    }
  }
}
