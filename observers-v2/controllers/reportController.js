const factory = require('./handlerFactory');
const Report = require('../models/reportModel');

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
exports.createReport = factory.createOne(Report);
exports.updateReport = factory.updateOne(Report);
exports.deleteReport = factory.deleteOne(Report);
exports.getReportsWithin = (req, res, next) => {
  const filter = !req.body.topic ? {} : { topic: req.body.topic };
  factory.getAllWithin(Report, filter)(req, res, next);
};
