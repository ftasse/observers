const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const globalErrorHandler = require('controllers/errorController');
const AppError = require('utils/appError');

const app = express();

// Add security HTTP headers to request
app.use(helmet());

// Add logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// BodyParser: Parses request's data into req.body
app.use(express.json());

// Data sanitization: Prevents against NoSQL code injection
app.use(mongoSanitize());

// Data sanitization: Prevents against cross-site scripting
app.use(xss());

// Handle unimplemented routes
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} could not be found on server.`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
