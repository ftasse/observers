const Topic = require('../models/topicModel');
const Tag = require('../models/TagModel');
const categories = require('../models/topicCategories');

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
  const tags = await Tag.find();

  res.status(200).render('overview', {
    title: 'Topics',
    topics,
    tags,
    categories
  });
});

exports.getTopic = (req, res, next) => {
  res.status(200).render('topic', {
    title: 'The consequences of deforestation in a region'
  });
};

exports.login = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
