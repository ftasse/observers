const mongoose = require('mongoose');
const validator = require('validator');

const sentimentAnalyzer = require('../utils/sentimentAnalyzer');
const Topic = require('../models/topicModel');

const reportSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  content: {
    type: String,
    required: [true, 'A report must have a description']
  },
  sentimentScore: Number,
  mood: String,
  mediaUrls: [
    {
      type: String,
      validate: [validator.isURL, 'Please provide a valid URL']
    }
  ],
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    description: String
  },
  numLikes: Number,
  numDisLikes: Number
});

reportSchema.index({ location: '2dsphere' });

reportSchema.pre('save', function(next) {
  this.sentimentScore = sentimentAnalyzer.analyze(this.content);
  this.mood = sentimentAnalyzer.getMood(this.sentimentScore);
  next();
});

reportSchema.statics.calcAverageSentiment = async function(topicId) {
  const stats = await this.aggregate([
    { $match: { topic: topicId } },
    { $group: { _id: '$topic', averageSentiment: { $avg: '$sentimentScore' } } }
  ]);

  if (stats.length > 0) {
    await Topic.findByIdAndUpdate(topicId, {
      averageSentimentScore: stats[0].averageSentiment,
      averageMood: sentimentAnalyzer.getMood(stats[0].averageSentiment)
    });
  } else {
    await Topic.findByIdAndUpdate(topicId, {
      averageSentimentScore: 0,
      averageMood: 'Neutral'
    });
  }
};

reportSchema.post('save', async function() {
  await this.constructor.calcAverageSentiment(this.topic);
});

// Hack to access document after query has been executed
reportSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reportSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageSentiment(this.r.topic);
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
