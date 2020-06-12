const factory = require('./handlerFactory');
const Topic = require('../models/topicModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTopics = factory.getAll(Topic);
exports.getTopic = factory.getOne(Topic, { path: 'reports' });
exports.createTopic = factory.createOne(Topic);
exports.updateTopic = factory.updateOne(Topic);
exports.deleteOne = factory.deleteOne(Topic);

exports.getTopicsWithin = catchAsync(async (req, res, next) => {
  const { latLng, distance, unit } = req.params;
  const [lat, lng] = latLng.split(',');
  const radius = unit === 'km' ? distance / 6371 : distance / 3958.8;

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format: lat, lng.'
      ),
      400
    );
  }

  const topics = await Topic.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: topics.length,
    data: {
      topics
    }
  });
});
