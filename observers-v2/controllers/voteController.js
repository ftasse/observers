const factory = require('./handlerFactory');
const Vote = require('../models/voteModel');

exports.getAllVotes = factory.getAll(Vote);
exports.getVote = factory.getOne(Vote);
exports.createVote = factory.createOne(Vote);
exports.updateVote = factory.updateOne(Vote);
exports.deleteVote = factory.deleteOne(Vote);
