package com.observers.servlet;

import java.io.IOException;
import javax.servlet.http.*;

public class DashboardServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws IOException {
	resp.setContentType("text/plain");
	resp.getWriter().println("Hello, world!");
    }
}

