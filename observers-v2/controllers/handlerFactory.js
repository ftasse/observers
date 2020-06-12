const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QueryHelper = require('../utils/queryHelper');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const query = new QueryHelper(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const data = await query.query;

    res.status(200).json({
      status: 'success',
      results: data.length,
      data: {
        data
      }
    });
  });

exports.getOne = (Model, ...populateFields) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    populateFields.forEach(el => query.populate(el));

    const doc = await query;

    if (!doc) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('Document not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    if (req.user) {
      req.body.author = req.user._id;
    }
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAllWithin = (Model, ...filterOptions) =>
  catchAsync(async (req, res, next) => {
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
    let filters = !filterOptions ? {} : { ...filterOptions };
    filters = Object.assign(filters, {
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    const docs = await Model.find(filters);

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });
