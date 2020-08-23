const AppError = require('../utils/appError');

const handleDuplicateFieldErrorDB = err => {
  const message = `Duplicate field value: ${
    Object.values(err.keyValue)[0]
  }. Please use another value!`;
  return new AppError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDevelopment = (err, res) => {
  if (err.statusCode === 404) {
    res.status(err.statusCode).render('404');
  } else if (err.statusCode === 401) {
    res.status(err.statusCode).render('401', {
      message: err.message
    });
  } else if (err.statusCode === 500) {
    res.status(err.statusCode).render('500', {
      message: err.message
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    if (err.statusCode === 404) {
      res.status(err.statusCode).render('404');
    } else if (err.statusCode === 401) {
      res.status(err.statusCode).render('401', {
        message: err.message
      });
    }
  } else {
    res.status(err.statusCode).render('500', {
      message: 'Something went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProduction(error, res);
  }
};
