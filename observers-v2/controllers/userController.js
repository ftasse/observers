const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  let updateObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) updateObj[el] = obj[el];
  });
  return updateObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This is route cannot be used for password update. Please /forgotPassword instead',
        403
      )
    );
  }

  const filteredObj = filterObj(req.body, 'name', 'email', 'thumbnail');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

exports.createUser = (req, res, next) => {
  res.status(403).json({
    status: 'failed',
    message: 'Please use /signup instead to register account.'
  });
};
