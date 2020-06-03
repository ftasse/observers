const express = require('express');
const morgan = require('morgan');

const app = express();

// Add logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// BodyParser: Parses request's data into req.body
app.use(express.json());

module.exports = app;
