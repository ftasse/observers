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

voteSchema.statics.calcLikes = async function(reportId, value = 0) {
  const stats = await this.aggregate([
    { $match: { report: mongoose.Types.ObjectId(reportId) } },
    {
      $group: {
        _id: '$report',
        numLikes: {
          $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] }
        },
        numDisLikes: {
          $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] }
        }
      }
    }
  ]);

  if (stats.length > 0) {
    await Report.findByIdAndUpdate(reportId, {
      numLikes: stats[0].numLikes,
      numDisLikes: stats[0].numDisLikes
    });
  } else {
    await Report.findByIdAndUpdate(reportId, {
      numLikes: 1 ? value === 1 : 0,
      numDisLikes: 1 ? value === -1 : 0
    });
  }
};

voteSchema.post('save', async function(doc) {
  await doc.constructor.calcLikes(doc.report, doc.value);
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
