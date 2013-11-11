package com.observers.servlet;

import static com.observers.model.OfyService.ofy;

import com.observers.model.Topic;
import com.observers.model.Report;
import com.observers.model.Message;

import com.googlecode.objectify.NotFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.visualization.datasource.DataSourceHelper;
import com.google.visualization.datasource.DataSourceRequest;
import com.google.visualization.datasource.base.DataSourceException;
import com.google.visualization.datasource.base.ReasonType;
import com.google.visualization.datasource.base.ResponseStatus;
import com.google.visualization.datasource.base.StatusType;
import com.google.visualization.datasource.base.TypeMismatchException;
import com.google.visualization.datasource.datatable.ColumnDescription;
import com.google.visualization.datasource.datatable.DataTable;
import com.google.visualization.datasource.datatable.value.ValueType;
import com.ibm.icu.util.GregorianCalendar;
import com.ibm.icu.util.TimeZone;

import java.lang.Number;
import java.util.List;
import java.util.ArrayList;
import java.util.logging.Logger;
import java.io.IOException;

/**
 *   GET /api/topics/locations
 *
 * @author floratasse@gmail.com (Flora Tasse)
 */
public class TopicAnalysisServlet extends JsonRestServlet {
  private static final Logger log = Logger.getLogger(TwilioReplyServlet.class.getName());
  
  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    // Create a data table.
    final String doesNotExist = "Topic with given ID does not exist.";
    DataSourceRequest dsRequest = null;

    try {
      Long topicId = Long.parseLong(req.getParameter("topicId"));
      Topic topic = ofy().load().key(Topic.key(topicId)).safeGet();
      List<Report> reports = ofy().load().type(Report.class).filter("topicId", topic.getId()).list();
      
      DataTable data = new DataTable();
      ArrayList<ColumnDescription> cd = new ArrayList<ColumnDescription>();
      cd.add(new ColumnDescription("reportId", ValueType.NUMBER, "Id"));
      cd.add(new ColumnDescription("latitude", ValueType.NUMBER, "Latitude"));
      cd.add(new ColumnDescription("longitude", ValueType.NUMBER, "Longitude"));
      cd.add(new ColumnDescription("content", ValueType.TEXT, "Content"));
      cd.add(new ColumnDescription("created", ValueType.DATE, "Creation date"));
      cd.add(new ColumnDescription("sentiment", ValueType.TEXT, "Sentiment"));
      data.addColumns(cd);

      // Fill the data table.
      try {
        for (Report report: reports){
          Number lat = null;
          Number lng = null;
          GregorianCalendar created = new GregorianCalendar();
          created.setTimeZone(TimeZone.getTimeZone("GMT"));
          created.setTime(report.getCreated());

          if (report.getLocation() != null)
          {
            lat = report.getLocation().getLatitude();
            lng = report.getLocation().getLongitude();
          }
            data.addRowFromValues(report.getId(), 
                                lat, 
                                lng,
                                report.getContent().getValue(),
                                created,
                                report.getMood().name());
        }
      } catch (TypeMismatchException e) {
        log.warning("Invalid type! " + e);
      }
      

      dsRequest = new DataSourceRequest(req);

      // NOTE: If you want to work in restricted mode, which means that only
      // requests from the same domain can access the data source, uncomment the following call.
      //
      // DataSourceHelper.verifyAccessApproved(dsRequest);

      // Apply the query to the data table.
      DataTable newData = DataSourceHelper.applyQuery(dsRequest.getQuery(), data,
          dsRequest.getUserLocale());

      // Set the response.
      DataSourceHelper.setServletResponse(newData, dsRequest, resp);

    } catch (NotFoundException nfe) {
      sendError(resp, 404, doesNotExist);
    } catch (NumberFormatException e) {
      sendError(resp, 404, doesNotExist);
    } catch (RuntimeException rte) {
      log.warning("A runtime exception has occured\n" + rte);
      ResponseStatus status = new ResponseStatus(StatusType.ERROR, ReasonType.INTERNAL_ERROR,
          rte.getMessage());
      if (dsRequest == null) {
        dsRequest = DataSourceRequest.getDefaultDataSourceRequest(req);
      }
      DataSourceHelper.setServletErrorResponse(status, dsRequest, resp);
    } catch (DataSourceException e) {
      if (dsRequest != null) {
        DataSourceHelper.setServletErrorResponse(e, dsRequest, resp);
      } else {
        DataSourceHelper.setServletErrorResponse(e, req, resp);
      }
    }
  }
}
