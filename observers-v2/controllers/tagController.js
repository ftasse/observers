const factory = require('./handlerFactory');
const Tag = require('../models/tagModel');

exports.getAllTags = factory.getAll(Tag);
exports.getTag = factory.getOne(Tag);
exports.createTag = factory.createOne(Tag);
exports.updateTag = factory.updateOne(Tag);
exports.deleteTag = factory.deleteOne(Tag);
