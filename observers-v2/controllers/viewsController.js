const Topic = require('../models/topicModel');
const Tag = require('../models/TagModel');
const categories = require('../models/topicCategories');

const catchAsync = require('../utils/catchAsync');
const QueryHelper = require('../utils/queryHelper');

exports.getOverview = catchAsync(async (req, res, next) => {
  let tagsQuery;
  if (req.query && req.query.tags) {
    if (Array.isArray(req.query.tags))
      tagsQuery = req.query.tags.map(t => t.toLowerCase());
    else tagsQuery = req.query.tags.toLowerCase();
    delete req.query.tags;
  }
  const query = new QueryHelper(
    Topic.find().populate({ path: 'tags' }),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const _topics = await query.query;

  // Filter topics by tags
  let topics = [];
  if (tagsQuery) {
    _topics.forEach(topic => {
      let intersection = topic.tags.filter(v =>
        tagsQuery.includes(v.name.toLowerCase())
      );
      if (intersection.length > 0) {
        topics.push(topic);
      }
    });
  } else {
    topics = _topics;
  }

  const tags = await Tag.find();

  const mostPopularTopicsQuery = new QueryHelper(Topic.find(), {
    limit: 5,
    sort: '+reportCount',
    fields: 'title,category,createdAt,reportCount'
  })
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const mostPopularTopics = await mostPopularTopicsQuery.query;

  res.status(200).render('overview', {
    title: 'Topics',
    topics,
    tags,
    categories,
    mostPopularTopics
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

exports.signup = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Become an observer'
  });
};
