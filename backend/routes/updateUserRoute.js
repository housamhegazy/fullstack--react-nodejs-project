const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { upload, cloudinary } = require("../config/cloudinaryConfig"); // Import multer config
const isAuthenticated = require("../middleware/authMiddleware"); // Your auth middleware

// PUT route to update user profile (name, email, image)
router.put(
  "/update-profile",
  isAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const userId = req.user._id; // From auth middleware
      const { fullName, email } = req.body;

      // Validate required fields
      if (!fullName || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Prepare update object
      const updateData = {
        fullName,
        email,
      };

      // Handle image upload
      if (req.file) {
        if (req.user.avatar) {
          const publicId = req.user.avatar.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
        }
        updateData.avatar = req.file.path; // Update avatar with new Cloudinary URL
      }
      // Update user in DB
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true } // Return updated doc, validate
      ).select("-password"); // Exclude password

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  }
);

module.exports = router;
