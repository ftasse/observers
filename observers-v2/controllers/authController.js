const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

const createJWT = (res, user) => {
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
  return token;
};

const createSendJWT = (res, user, statusCode) => {
  const token = createJWT(res, user);

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

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(user, url).sendWelcome();

  createSendJWT(res, user, 201);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
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

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodedToken = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decodedToken.id);

      if (!currentUser) return next();
      if (currentUser.passwordChangedAfter(decodedToken.iat)) return next();

      res.locals.user = currentUser;

      return next();
    } catch {
      return next();
    }
  }
  return next();
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission. Operation forbidden', 403)
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

  try {
    const url = `${req.protocol}://${req.get(
      'host'
    )}/users/resetPassword/${resetToken}`;

    await new Email(user, url).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const passwordResetToken = await crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

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
  createJWT(res, req.user);
  res.redirect('/');
};
