const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const createSendJWT = (res, user, statusCode) => {
  const id = user._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  const cookieOptions = {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    secure: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.httpOnly = true;

  res.cookie('jwt', `Bearer ${token}`, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, thumbnail, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    thumbnail,
    role
  });

  createSendJWT(res, user, 201);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 404));
  }

  createSendJWT(res, user, 200);
});
