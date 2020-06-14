const factory = require('./handlerFactory');
const Topic = require('../models/topicModel');
const catchAsync = require('../utils/catchAsync');
const Report = require('../models/reportModel');

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic, { path: 'reports' });
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteTopic = catchAsync(async (req, res, next) => {
  await Report.deleteMany({ topic: req.params.id });
  await factory.deleteOne(Topic)(req, res, next);
});
exports.getTopicsWithin = factory.getAllWithin(Topic);
