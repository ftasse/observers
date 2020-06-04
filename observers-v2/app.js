const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const globalErrorHandler = require('controllers/errorController');
const AppError = require('utils/appError');
const topicRouter = require('routes/topicRoutes');

const app = express();
const apiEndpoint = '/api/v1';

// Add security HTTP headers to request
app.use(helmet());

// Add logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit api requests per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(apiEndpoint, apiLimiter);

// BodyParser: Parses request's data into req.body
app.use(express.json());

// Data sanitization: Prevents against NoSQL code injection
app.use(mongoSanitize());

// Data sanitization: Prevents against cross-site scripting
app.use(xss());

// Routes
app.use(`${apiEndpoint}/topics`, topicRouter);

// Handle unimplemented routes
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} could not be found on server.`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
