const factory = require('./handlerFactory');
const Report = require('../models/reportModel');

exports.setTopicUserIds = (req, res, next) => {
  if (!req.body.topic) req.body.topic = req.params.topicId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReport = factory.getAll(Report);
exports.getReport = factory.getOne(Report);
exports.createReport = factory.createOne(Report);
exports.updateReport = factory.updateOne(Report);
exports.deleteReport = factory.deleteOne(Report);
