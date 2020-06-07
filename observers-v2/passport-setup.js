const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const authController = require('./controllers/authController');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/users/auth/google/callback'
    },
    authController.verifyGoogleStrategy
  )
);
