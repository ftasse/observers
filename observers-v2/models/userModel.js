const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
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
  passwordResetTokenExpires: Date
});

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

const User = mongoose.model('User', userSchema);

module.exports = User;
