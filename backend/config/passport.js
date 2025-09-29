const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log('Google Profile:', profile); // تسجيل بيانات الملف الشخصي
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
          console.log('New user created:', user);
        } else {
          console.log('Existing user found:', user);
        }
        return cb(null, user);
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});