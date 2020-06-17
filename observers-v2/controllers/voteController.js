const factory = require('./handlerFactory');
const Vote = require('../models/voteModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVotes = factory.getAll(Vote);
exports.getVote = factory.getOne(Vote);
exports.createVote = factory.createOne(Vote);
exports.updateVote = catchAsync(async (req, res, next) => {
  const vote = await Vote.findOne({ _id: req.params.id, author: req.user.id });

  if (!vote) {
    return next(new AppError('Vote not found', 404));
  }
  vote.value = res.body.value === vote.value ? 0 : res.body.value;
  vote.save();

  res.status(200).json({
    status: 'success',
    data: {
      data: vote
    }
  });
});
exports.deleteVote = factory.deleteOne(Vote);
