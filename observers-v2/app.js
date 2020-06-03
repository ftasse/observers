const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('controllers/errorController');

const app = express();

// Add logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// BodyParser: Parses request's data into req.body
app.use(express.json());

//Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
