//خاصه بتسجيل الدخول عن طريق جوجل
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy; // <--- إضافة هذا السطر
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require("../models/userModel");

//google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          if (profile.emails && profile.emails.length > 0) {
            user = await User.findOne({ email: profile.emails[0].value });
          }
          if (user) {
            // 3. إذا كان المستخدم موجوداً بالفعل (بواسطة البريد الإلكتروني)، اربط معرف فيسبوك بالحساب الحالي
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
          
          } else {
            // 4. إذا لم يكن المستخدم موجوداً على الإطلاق، قم بإنشاء حساب جديد
            user = await User.create({
              googleId: profile.id,
              fullName: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });
          }
        }
        user.lastLogin = new Date();
        await user.save();
        return cb(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return cb(error, null);
      }
    }
  )
);

// استراتيجية فيسبوك (الجديدة)
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID, // تأكد من إضافة هذا المتغير في ملف .env
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET, // تأكد من إضافته أيضًا
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"], // تحديد الحقول التي تريدها
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (!user) {
          // 2. إذا لم يتم العثور عليه، ابحث عن المستخدم ببريده الإلكتروني
          if (profile.emails && profile.emails.length > 0) {
            user = await User.findOne({ email: profile.emails[0].value });
          }
          if (user) {
            // 3. إذا كان المستخدم موجوداً بالفعل (بواسطة البريد الإلكتروني)، اربط معرف فيسبوك بالحساب الحالي
            user.facebookId = profile.id;
            user.avatar = profile.photos[0].value;
          
          } else {
            // 4. إذا لم يكن المستخدم موجوداً على الإطلاق، قم بإنشاء حساب جديد
            user = await User.create({
              facebookId: profile.id,
              fullName: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });
          }
        }
         // هذا السطر هو الحل: قم بتحديث lastLogin قبل الحفظ
        user.lastLogin = new Date();
          await user.save();
        return cb(null, user);
      } catch (error) {
        console.error("Error in Facebook Strategy:", error);
        return cb(error, null);
      }
    }
  )
);

// استراتيجية منصة X (تويتر)
passport.use(
    new TwitterStrategy(
        {
            consumerKey: process.env.X_CONSUMER_KEY,
            consumerSecret: process.env.X_CONSUMER_SECRET,
            callbackURL: '/auth/x/callback',
            userProfileURL: "https://api.x.com/1.1/account/verify_credentials.json?include_email=true"
        },
        async (token, tokenSecret, profile, cb) => {
            try {
                let user = await User.findOne({ xId: profile.id });
                if (!user) {
                    if (profile.emails && profile.emails.length > 0) {
                        user = await User.findOne({ email: profile.emails[0].value });
                        if (user) {
                            user.xId = profile.id;
                            user.avatar = profile.photos[0].value;
                        } else {
                            user = await User.create({
                                xId: profile.id,
                                fullName: profile.displayName,
                                email: profile.emails[0].value,
                                avatar: profile.photos[0].value,
                            });
                        }
                    } else {
                        return cb(new Error("No email provided by Twitter."), null);
                    }
                }
                user.lastLogin = new Date();
                await user.save();
                return cb(null, user);
            } catch (error) {
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
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
