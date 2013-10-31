package com.observers.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Arrays;
import java.math.BigInteger;
import java.security.SecureRandom;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpSession;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;

public class ConnectServlet extends JsonRestServlet {

@Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
  	throws IOException {
  	// Create a state token to prevent request forgery.
    // Store it in the session for later validation.
  	String state = new BigInteger(130, new SecureRandom()).toString(32);
  	HttpSession session = req.getSession();
  	session.setAttribute("state", state);

  	List<String> scopes = Arrays.asList(
  			"https://www.googleapis.com/auth/userinfo.email",
  			"https://www.googleapis.com/auth/userinfo.profile",
  			"https://www.googleapis.com/auth/plus.me");

  	String url =
  	new GoogleAuthorizationCodeRequestUrl(CLIENT_ID,
  		getConnectRedirectUri(req), scopes).setState(state).setAccessType("offline").build();
  	resp.sendRedirect(url);
  }
}