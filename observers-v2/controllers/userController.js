const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

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
