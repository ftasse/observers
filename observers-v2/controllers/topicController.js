const factory = require('./handlerFactory');
const Topic = require('../models/topicModel');

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic);
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteOne = factory.deleteOne(Topic);
