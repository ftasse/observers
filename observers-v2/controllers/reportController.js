const factory = require('./handlerFactory');
const Report = require('../models/reportModel');
const Topic = require('../models/topicModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setTopicId = (req, res, next) => {
  if (!req.body.topic) req.body.topic = req.params.topicId;

  next();
};

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReport = factory.getAll(Report);
exports.getReport = factory.getOne(Report);
exports.createReport = catchAsync(async (req, res, next) => {
  const topic = await Topic.findById(req.body.topic);
  if (!topic) {
    return next(
      new AppError(
        'Attempt to report on a topic that does not exist. Operation can not be performed',
        404
      )
    );
  }
  await factory.createOne(Report)(req, res, next);
});
exports.updateReport = factory.updateOne(Report);
exports.deleteReport = factory.deleteOne(Report);
exports.getReportsWithin = factory.getAllWithin(Report);
