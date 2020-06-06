const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'moderator']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Passwords are not matched'
    }
  },
  thumbnail: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  active: {
    type: Boolean,
    default: true
  },
  googleUserId: {
    type: String,
    unique: true
  },
  twitterUserId: {
    type: String,
    unique: true
  },
  facebookUserId: {
    type: String,
    unique: true
  }
});

userSchema.index(
  { googleUserId: 1 },
  {
    partialFilterExpression: {
      googleUserId: { $exists: true }
    }
  }
);
userSchema.index(
  { twitterUserId: 1 },
  {
    partialFilterExpression: {
      twitterUserId: { $exists: true }
    }
  }
);
userSchema.index(
  { facebookUserId: 1 },
  {
    partialFilterExpression: {
      facebookUserId: { $exists: true }
    }
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  password
) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.passwordChangedAfter = function(JWTTimeStamp) {
  if (!this.passwordChangedAt) return false;

  return parseInt(this.passwordChangedAt.getTime() / 1000, 10) > JWTTimeStamp;
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
