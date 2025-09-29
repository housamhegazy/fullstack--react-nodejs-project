
// خاص بتسجيل الدخول عن طريق جوجل 
const express = require('express');
const passport = require('passport');
const router = express.Router();

//step-1
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
); // بدء المصادقة
router.get(
  "/auth/google/callback",
passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);


module.exports = router;