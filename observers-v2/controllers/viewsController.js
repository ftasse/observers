exports.getOverview = (req, res, next) => {
  res.status(200).render('overview', {
    title: 'Topics'
  });
};

exports.getTopic = (req, res, next) => {
  res.status(200).render('topic', {
    title: 'The consequences of deforestation in a region'
  });
};
