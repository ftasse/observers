const mongoose = require('mongoose');
const validator = require('validator');

const sentimentAnalyzer = require('../utils/sentimentAnalyzer');
const Topic = require('../models/topicModel');

const reportSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A report must have an author']
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'A report must be for a topic']
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
    createdAt: {
      type: Date,
      default: Date.now()
    },
    numLikes: {
      type: Number,
      default: 0
    },
    numDisLikes: {
      type: Number,
      default: 0
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reportSchema.virtual('votes', {
  ref: 'Vote',
  foreignField: 'report',
  localField: '_id'
});

reportSchema.index({ content: 'text' });
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

  let avgSentiment, avgMood;
  if (stats.length > 0) {
    avgSentiment = stats[0].averageSentiment;
    avgMood = sentimentAnalyzer.getMood(stats[0].averageSentiment);
  } else {
    avgSentiment = 0;
    avgMood = 'Neutral';
  }

  await Topic.findByIdAndUpdate(topicId, {
    averageSentimentScore: avgSentiment,
    averageMood: avgMood
  });
};

reportSchema.post('save', async function() {
  await Topic.findByIdAndUpdate(this.topic, {
    $inc: { reportCount: -1 }
  });
  await this.constructor.calcAverageSentiment(this.topic);
});

// Hack to access document after query has been executed
reportSchema.pre(/^find(One|ById)And/, async function(next) {
  this.r = await this.findOne();
  next();
});

reportSchema.post(/^find(One|ById)And/, async function() {
  await this.r.constructor.calcAverageSentiment(this.r.topic);
});

reportSchema.pre(/^delete/, async function(next) {
  await Topic.findByIdAndUpdate(this.topic, {
    $inc: { reportCount: -1 }
  });
  next();
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
