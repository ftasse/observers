package com.observers.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;

import static com.observers.model.OfyService.ofy;
import com.observers.model.Jsonifiable;
import com.observers.model.Report;
import com.observers.model.Topic;
import com.observers.model.User;
import com.observers.model.Message;

import com.googlecode.objectify.NotFoundException;
import com.googlecode.objectify.cmd.Query;
/**
 * Provides an API for working with Reports. This servlet provides the
 * /api/reports endpoint, and exposes the following operations:
 *
 *   POST /api/reports?topicId=1234
 *   GET /api/reports?reportId=1234
 *   GET /api/reports?topicId=1234
 *   PUT /api/reports?reportId=1234
 *   DELETE /api/reports?reportId=1234
 *
 * @author floratasse@gmail.com (Flora Tasse)
 */
public class ReportsServlet extends JsonRestServlet {

 /**
   * Exposed as `POST /api/reports`.
   *
   * Takes the following payload in the request body.
   * {
   *   "content":"",
   *   "channelId":0,
   *   "channelReportId":""
   *   "categoryIds":[0, ...]
   *   "mediaUrl":"",
   *   "location":""
   *   "posted":...
   * }
   *
   * Returns the following JSON response representing the Report that was
   * created:
   * {
   *   "id":"",
   *   "content":"",
   *   "topicId":0,
   *   "channelId":0,
   *   "channelReportId":""
   *   "categoryIds":[0, ...]
   *   "mediaUrl":"",
   *   "location":"",
   *   "numVotes":"",
   *   "mood":"",
   *   "posted":...
   * }
   *
   * Issues the following errors along with corresponding HTTP response codes:
   *
   * 400: "Failed to read report data from the request body."
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
 		Long userId = (Long) req.getSession().getAttribute(CURRENT_USER_SESSION_KEY);
 		Report report = Jsonifiable.fromJson(req.getReader(), Report.class);

 		if (report == null || req.getParameter("topicId") == null)
 			throw new IOException();

    Long topicId = Long.parseLong(req.getParameter("topicId"));
    Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
    if (!userId.equals(topic.getOwnerUserId())) {
      throw new NotFoundException();
    }

 		report.setTopicId(topicId);
 		report.setNumVotes(0);
    report.setMood(Report.Mood.INDIFFERENT);

 		ofy().save().entity(report).now();
 		ofy().clear();
 		report = ofy().load().type(Report.class).id(report.getId()).get();
 		sendResponse(req, resp, report);
 	} catch (UserNotAuthorizedException e) {
 		sendError(resp, 401, "Unauthorized request");
 	} catch (IOException e) {
 		sendError(resp, 400, "Unable to read report data from request body");
 	}
 }


 /**
   * Exposed as `GET /api/reports`.
   *
   * Accepts the following request parameters.
   *
   * 'reportId': id of the requested report. Will return a single Report.
   * 'topicId': id of the topic of the report. Will return the collection of
   *           reports for that topic. Requires auth.
   *
   * Returns the following JSON response representing a list of Reports.
   *
   * [
   *  {
   *   "id":"",
   *   "content":"",
   *   "topicId":0,
   *   "channelId":0,
   *   "channelReportId":""
   *   "categoryIds":[0, ...]
   *   "mediaUrl":"",
   *   "location":"",
   *   "numVotes":"",
   *   "mood":"",
   *   "posted":...
   * },
   *    ...
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
    checkAuthorization(req);
    Long userId = Long.parseLong(req.getSession()
        .getAttribute(CURRENT_USER_SESSION_KEY).toString());

    String reportId = req.getParameter("reportId");
    String topicId = req.getParameter("topicId");

    Query<Report> q = ofy().load().type(Report.class);
    if (reportId != null) {
        // Get the report with the given ID and return it.
      Report report = q.filter("id", Long.parseLong(reportId)).first().get();
      Topic topic = ofy().load().key(Topic.key(Long.parseLong(topicId))).safeGet();
      if (!userId.equals(topic.getOwnerUserId())) {
        throw new UserNotAuthorizedException();
      }
      sendResponse(req, resp, report);
    } else {
      // Get all reports for the topic.
      Topic topic = ofy().load().key(Topic.key(Long.parseLong(topicId))).safeGet();
      if (!userId.equals(topic.getOwnerUserId())) {
        throw new UserNotAuthorizedException();
      }
      q = q.filter("topicId", topic.getId());
    }

    List<Report> reports = q.list();
    sendResponse(req, resp, reports, "observers#reports");
  } catch (UserNotAuthorizedException e) {
    sendError(resp, 401, "Unauthorized request");
  }
}

}
