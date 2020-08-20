const factory = require('./handlerFactory');
const Topic = require('../models/topicModel');
const Tag = require('../models/TagModel');

const catchAsync = require('../utils/catchAsync');
const Report = require('../models/reportModel');

exports.getTopicTags = catchAsync(async (req, res, next) => {
  if (req.body.tags) {
    let tags = [];

    for (const tagName of req.body.tags) {
      let t = await Tag.findOne({ name: new RegExp(tagName, 'i') });
      if (!t) {
        t = await Tag.create({ name: tagName });
      }
      tags.push(t._id);
    }
    req.body.tags = tags;
  }
  next();
});

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic, { path: 'reports' });
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);

exports.deleteTopic = catchAsync(async (req, res, next) => {
  await Report.deleteMany({ topic: req.params.id });
  await factory.deleteOne(Topic)(req, res, next);
});
exports.getTopicsWithin = factory.getAllWithin(Topic);
