const { promisify } = require('util');
const crypto = require('crypto');
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
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

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

exports.signout = (req, res, next) => {
  res.cookie('jwt', 'sign-out', {
    maxAge: 10 * 1000,
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.authorization && req.authorization.startsWith('Bearer')) {
    token = req.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const freshUser = await User.findById(decodedToken.id);

  if (!freshUser) {
    return next(
      new AppError('No user associated with the provided token', 404)
    );
  }

  if (freshUser.passwordChangedAfter(decodedToken.iat)) {
    return next(
      new AppError('User recently updated password. Please login again.', 401)
    );
  }

  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("You do not have permission. Operation forbidden", 403)
    );
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO: Send reset token to user

  res.status(200).json({
    status: 'success',
    message: 'Password reset token sent to email'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const passwordResetToken = await crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  console.log(passwordResetToken);

  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createSendJWT(res, user, 200);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Invalid password. Please try again', 403));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendJWT(res, user, 200);
});

exports.verifyGoogleStrategy = async function(
  accessToken,
  refreshToken,
  profile,
  done
) {
  try {
    let user = await User.findOne({ googleUserId: profile.id });

    if (!user) {
      const password = await crypto.randomBytes(12).toString('hex');

      // TODO: Send password to newly created user's password via email

      user = await User.create({
        email: profile._json.email,
        name: profile.displayName,
        googleUserId: profile.id,
        thumbnail: profile._json.picture,
        password,
        passwordConfirm: password
      });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
};

exports.signinOAuth2 = (req, res, next) => {
  createSendJWT(res, req.user, 200);
};
