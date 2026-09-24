import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { updateUserProfile } from "../services/user.service.js";

const router = express.Router();

/**
 * Get the authenticated user's Mentra profile
 */
router.get("/profile", protect, async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("❌ GET PROFILE ROUTE ERROR");
    console.error(error);

    return res.status(500).json({
      message: "Failed to load profile",
    });
  }
});

/**
 * Update the authenticated user's Mentra profile
 */
router.put("/profile", protect, async (req, res) => {
  try {
    const { username, bio } = req.body;

    const updatedUser = await updateUserProfile(
      req.user.id,
      {
        username,
        bio,
      }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ UPDATE PROFILE ROUTE ERROR");
    console.error(error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      message:
        error.message ||
        "Failed to update profile",
    });
  }
});

export default router;