const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');

const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const upload = require('../utils/multerHelper');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'static/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`static/img/users/${req.file.filename}`);

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
    .upload(`static/img/users/${req.file.filename}`, {
      gzip: true,
      destination: req.file.filename,
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
  req.file.filename = `https://storage.googleapis.com/${process.env.PROJECT_BUCKET}/${req.file.filename}`;
  next();
});

const filterObj = (obj, ...allowedFields) => {
  let updateObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) updateObj[el] = obj[el];
  });
  return updateObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This is route cannot be used for password update. Please /forgotPassword instead',
        403
      )
    );
  }

  const filteredObj = filterObj(req.body, 'name', 'email');

  if (req.file) filteredObj.thumbnail = `${req.file.filename}`;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    message: 'Account successfully deleted',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(
  User,
  {
    path: 'topics',
    select: '-createdAt -mediaUrls -mediaUploads -description'
  },
  { path: 'reports' }
);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

exports.createUser = (req, res, next) => {
  res.status(403).json({
    status: 'failed',
    message: 'Please use /signup instead to register account.'
  });
};
