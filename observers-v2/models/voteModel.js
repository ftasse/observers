const mongoose = require('mongoose');

const Report = require('../models/reportModel');

const voteSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  value: {
    type: Number,
    default: 0,
    enum: [-1, 0, 1]
  }
});

voteSchema.index({ author: 1, report: 1 });

voteSchema.statics.calcLikes = async function(reportId) {
  const stats = await this.aggregate([
    { $match: { report: reportId } },
    {
      $group: {
        _id: '$report',
        numLikes: {
          $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] }
        },
        numDislikes: {
          $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] }
        }
      }
    }
  ]);

  if (stats.length > 0) {
    await Report.findByIdAndUpdate(reportId, {
      numLikes: stats[0].numLikes,
      numDislikes: stats[0].numDislikes
    });
  } else {
    await Report.findByIdAndUpdate(reportId, {
      numLikes: 0,
      numDislikes: 0
    });
  }
};

voteSchema.pre('save', async function(next) {
  await this.constructor.calcLikes(this.report);
  next();
});

voteSchema.pre(/^find(One|ById)And/, async function(next) {
  this.v = await this.findOne();
  next();
});

voteSchema.post(/^find(One|ById)And/, async function() {
  await this.v.constructor.calcLikes(this.r.report);
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
