const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const topicCategories = require('./topicCategories');

const topicSchema = new mongoose.Schema(
  {
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
    category: {
      type: String,
      enum: topicCategories,
      required: [true, 'A topic must have a category']
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    averageSentimentScore: {
      type: Number,
      default: 0
    },
    averageMood: {
      type: String,
      default: 'Neutral'
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now()
    },
    imageCover: String,
    mediaUploads: [String],
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
        enum: 'Point'
      },
      coordinates: [Number],
      address: String
    },
    moderated: {
      type: Boolean,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

topicSchema.index({ category: 1 });
topicSchema.index({ tags: 1 });
topicSchema.index({ slug: 1 });
topicSchema.index({ location: '2dsphere' });
topicSchema.index({ description: 'text' });
topicSchema.index({ title: 'text' });

topicSchema.virtual('reports', {
  ref: 'Report',
  foreignField: 'topic',
  localField: '_id'
});

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
