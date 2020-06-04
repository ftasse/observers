const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('controllers/errorController');
const AppError = require('utils/appError');

const app = express();

// Add logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// BodyParser: Parses request's data into req.body
app.use(express.json());

// Handle unimplemented routes
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} could not be found on server.`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
