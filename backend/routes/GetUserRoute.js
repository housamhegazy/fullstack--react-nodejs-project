// routes/userRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware"); // تأكد من المسار الصحيح
const User = require("../models/userModel"); // استيراد نموذج المستخدم (تأكد من اسمه الصحيح)

// دالة handleError (يمكنك وضعها في ملف منفصل واستيرادها)
const handleError = (
  res,
  error,
  statusCode = 500,
  defaultMessage = "An internal server error occurred."
) => {
  console.error("API Error:", error);
  // تأكد أن errorMessage هنا تُرسل بشكل صحيح
  res.status(statusCode).json({ message: error.message || defaultMessage });
};

// المسار لجلب المستخدم بواسطة ID
// هذا المسار سيتطابق مع طلبات مثل GET /user/60b8d295f1c9c3001c2b5d1a
router.get("/api/profile",isAuthenticated, async (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    // هذا السيناريو يجب ألا يحدث إذا كان `isAuthenticated` يعمل بشكل صحيح
    return res.status(404).json({ message: "بيانات الملف الشخصي غير موجودة." });
  }
  
});

module.exports = router;
