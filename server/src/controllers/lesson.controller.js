
import {
  getLessonService,
  getCurrentLessonService,
  completeLessonService,
} from "../services/lesson.service.js";

// -----------------------------------------
// Get Single Lesson
// -----------------------------------------
export async function getLesson(req, res) {
  try {
    const { id } = req.params;

    const lesson = await getLessonService(id);

    return res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error("GET LESSON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get lesson",
    });
  }
}

// -----------------------------------------
// Get Current Lesson
// -----------------------------------------
export async function getCurrentLesson(req, res) {
  try {
    console.log("📚 CURRENT LESSON USER:", req.user.id);

    const lesson = await getCurrentLessonService(
      req.user.id
    );

    return res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error(
      "❌ GET CURRENT LESSON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get current lesson",
    });
  }
}

// -----------------------------------------
// Complete Lesson
// -----------------------------------------
export async function completeLesson(req, res) {
  try {
    const { id } = req.params;

    console.log(
      "✅ COMPLETING LESSON:",
      id
    );

    console.log(
      "👤 USER:",
      req.user.id
    );

    const lesson =
      await completeLessonService(
        id,
        req.user.id
      );

    return res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    console.error(
      "❌ COMPLETE LESSON ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to complete lesson",
    });
  }
}
