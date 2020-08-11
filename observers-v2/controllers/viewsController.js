const Topic = require('../models/topicModel');
const catchAsync = require('../utils/catchAsync');
const QueryHelper = require('../utils/queryHelper');

exports.getOverview = catchAsync(async (req, res, next) => {
  const query = new QueryHelper(
    Topic.find().populate({ path: 'tags' }),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const topics = await query.query;

  res.status(200).render('overview', {
    title: 'Topics',
    topics
  });
});

exports.getTopic = (req, res, next) => {
  res.status(200).render('topic', {
    title: 'The consequences of deforestation in a region'
  });
};
