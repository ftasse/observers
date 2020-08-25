const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');

const factory = require('./handlerFactory');
const Topic = require('../models/topicModel');
const Tag = require('../models/tagModel');

const catchAsync = require('../utils/catchAsync');
const Report = require('../models/reportModel');

const upload = require('../utils/multerHelper');

exports.uploadTopicCoverImage = upload.single('imageCover');

exports.resizeImageCover = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `topic-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .toFile(`static/img/topics/${req.file.filename}`);

  const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID2
    }
  });
  await storage
    .bucket(process.env.PROJECT_BUCKET)
    .upload(`static/img/topics/${req.file.filename}`, {
      gzip: true,
      destination: req.file.filename,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
  req.file.filename = `https://storage.googleapis.com/${process.env.PROJECT_BUCKET}/${req.file.filename}`;
  next();
});

exports.setLocationAndImageCover = (req, res, next) => {
  if (req.file) {
    req.body.imageCover = `${req.file.filename}`;
  } else {
    delete req.body.imageCover;
  }
  req.body.location = JSON.parse(req.body.location);

  next();
};

exports.getTopicTags = catchAsync(async (req, res, next) => {
  if (req.body.tags) {
    let tags = [];
    for (const tagName of req.body.tags.split(',')) {
      let t = await Tag.findOne({ name: new RegExp(tagName, 'i') });
      if (!t) {
        t = await Tag.create({ name: tagName });
      }
      tags.push(t._id);
    }
    req.body.tags = tags;
  } else {
    req.body.tags = [];
  }
  if (req.body.mediaUrls) {
    req.body.mediaUrls = req.body.mediaUrls.split(',');
  } else {
    req.body.mediaUrls = [];
  }
  next();
});

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic, { path: 'reports' });
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);

exports.deleteTopic = catchAsync(async (req, res, next) => {
  await Report.deleteMany({ topic: req.params.id });
  await factory.deleteOne(Topic)(req, res, next);
});
exports.getTopicsWithin = factory.getAllWithin(Topic);
