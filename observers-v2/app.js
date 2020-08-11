const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const viewRouter = require('./routes/viewRoutes');
const reportRouter = require('./routes/reportRoutes');
const topicRouter = require('./routes/topicRoutes');
const userRouter = require('./routes/userRoutes');
const voteRouter = require('./routes/voteRoutes');
const tagRouter = require('./routes/tagRoutes');

const passportSetup = require('./passport-setup');
const passport = require('passport');

const app = express();
const apiEndpoint = '/api/v1';

// Setup view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Server static files
app.use(express.static(path.join(__dirname, 'static')));

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

// CookieParser: Parses cookies into req.cookies
app.use(cookieParser());

// Data sanitization: Prevents against NoSQL code injection
app.use(mongoSanitize());

// Data sanitization: Prevents against cross-site scripting
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'title',
      'description',
      'tags',
      'category',
      'averageMood',
      'content',
      'mood'
    ]
  })
);

app.use(passport.initialize());
// Routes
app.use('/', viewRouter);
app.use(`${apiEndpoint}/tags`, tagRouter);
app.use(`${apiEndpoint}/votes`, voteRouter);
app.use(`${apiEndpoint}/reports`, reportRouter);
app.use(`${apiEndpoint}/topics`, topicRouter);
app.use(`${apiEndpoint}/users`, userRouter);

// Handle unimplemented routes
app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} could not be found on server.`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
