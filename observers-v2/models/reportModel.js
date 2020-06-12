const mongoose = require('mongoose');
const validator = require('validator');
const sentimentAnalyzer = require('../utils/sentimentAnalyzer');

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

reportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select:
      '-__v -passwordChangedAt -googleUserId -twitterUserId -facebookUserId'
  }).populate({
    path: 'topic',
    select: 'title slug'
  });
  next();
});
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
