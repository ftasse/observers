package com.observers.servlet;

import java.util.*;
import java.io.IOException;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.lang.Math;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.logging.Logger;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonParser;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;

import com.google.api.client.util.store.DataStoreFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.appengine.api.appidentity.AppIdentityServiceFactory;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.extensions.appengine.auth.oauth2.AppIdentityCredential;
import com.google.api.client.http.HttpRequestInitializer;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;

import com.google.api.services.prediction.Prediction;
import com.google.api.services.prediction.model.Input;
import com.google.api.services.prediction.model.Output;
import com.google.api.services.prediction.PredictionScopes;

import  java.security.GeneralSecurityException;

public class PredictServlet extends JsonRestServlet {


  private static final String PROJECT_ID =  "907117162790";

/**
   * Global instance of the {@link DataStoreFactory}. The best practice is to make it a single
   * globally shared instance across your application.
   */
private static FileDataStoreFactory dataStoreFactory;


  @Override
  protected void doGet(HttpServletRequest req,
                       HttpServletResponse resp) throws ServletException, IOException 
  {
    String text = req.getParameter("query");
    System.out.println ("Query: " + text);

    String model_id = req.getParameter("query");


    try
    {
      if (text == null || model_id == null)
        throw new IOException();

      Output output = getPredictionOutput(text, model_id);

      sendResponse(req, resp, output, "observers#prediction");
    } catch(GeneralSecurityException e)
    {
      sendError(resp, 400, "Unable to authenticate service account: " + e);
    } catch (IOException e)
    {
      if (text == null) sendError(resp, 400, "Unable to read query data from request body");
      else  sendError(resp, 400, "Unable to run the prediction: " + e);
    }
  }

  public static Output getPredictionOutput(String text, String model_id) throws IOException, GeneralSecurityException
  {
    GoogleCredential credential = authorize();
      Prediction prediction = new Prediction.Builder(TRANSPORT, JSON_FACTORY, credential)
                              .setApplicationName(APP_ID).build();

      //Prediction prediction = new Prediction.Builder(TRANSPORT, JSON_FACTORY, getRequestInitializer()).setApplicationName(APP_ID).build();

      Input input = new Input();
      Input.InputInput inputInput = new Input.InputInput();
      inputInput.setCsvInstance(Collections.<Object>singletonList(text));
      input.setInput(inputInput);
     return prediction.trainedmodels().predict(PROJECT_ID, model_id, input).execute();
  }

  public static String getPredictionOutputLabel(String text, String model_id) throws IOException, GeneralSecurityException
  {
    Output output = PredictServlet.getPredictionOutput(text, model_id);
    List<Output.OutputMulti> multiOutputList =  output.getOutputMulti();
    Double avg = 1.0/multiOutputList.size();

    for (Output.OutputMulti multiOutput: multiOutputList)
    {
      if (multiOutput.getLabel().equals(output.getOutputLabel()))
      {
        Double score = Double.valueOf(multiOutput.getScore());
        if (Math.abs(score - avg) < avg*1e-1)
          return "neutral";
      } 
    }

    return output.getOutputLabel();
  }

  private static GoogleCredential authorize() throws IOException, GeneralSecurityException {
    GoogleCredential credential = new GoogleCredential.Builder()
      .setTransport(TRANSPORT)
      .setJsonFactory(JSON_FACTORY)
      .setServiceAccountId(SERVICE_ACCOUNT_EMAIL)
      .setServiceAccountScopes( Arrays.asList(new String[] {PredictionScopes.PREDICTION}) )
      .setServiceAccountPrivateKeyFromP12File(
          new java.io.File(SERVICE_ACCOUNT_PKCS12_FILE_PATH))
      .build();
      return credential;
  }

  private static HttpRequestInitializer getRequestInitializer() {
    if (System.getProperty("OAUTH_ACCESS_TOKEN") != null) {
      // Good for testing and localhost environments, where no AppIdentity is available.
      return new GoogleCredential().setAccessToken(System.getenv("OAUTH_ACCESS_TOKEN"));
    }
    return new AppIdentityCredential(Arrays.asList(new String[] {PredictionScopes.PREDICTION}));
  }
}
