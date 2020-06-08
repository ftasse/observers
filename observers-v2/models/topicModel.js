const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const topicTags = require('./topicTags');

const topicSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // channels: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Channel'
  //   }
  // ],
  title: {
    type: String,
    required: [true, 'A topic must have a title'],
    minLength: [10, "A topic's title must be at least 10 characters long"],
    maxLength: [120, "A topic's title must be at most 120 characters long"],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'A topic must have a description'],
    trim: true
  },
  tags: {
    type: [
      {
        type: String,
        enum: topicTags
      }
    ],
    validate: {
      validator: function(val) {
        return val.length <= 3;
      },
      message: 'A topic can only have a maximum of 3 tags'
    }
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  imageCover: String,
  supportingDocs: [String],
  supportingLinks: [
    { type: String, validate: [validator.isURL, 'Please provide a valid URL'] }
  ],
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: 'Point'
    },
    coordinates: [Number],
    address: String
  },
  moderated: {
    type: Boolean,
    select: false
  }
});

topicSchema.index({ slug: 1 });
topicSchema.index({ location: '2dsphere' });

topicSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

topicSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select:
      '-__v -passwordChangedAt -googleUserId -twitterUserId -facebookUserId'
  });
  next();
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
