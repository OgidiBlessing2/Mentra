import { completeLessonService } from "../services/lesson.service.js";

export async function completeLesson(req, res) {
  try {
    const { id } = req.params;

    const lesson = await completeLessonService(id);

    return res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}