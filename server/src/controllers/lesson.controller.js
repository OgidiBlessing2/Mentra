import {
  getLessonService,
  getCurrentLessonService,
  completeLessonService,
} from "../services/lesson.service.js";
export async function getLesson(req, res) {
  try {
    const { id } = req.params;

    const lesson = await getLessonService(id);

    res.json({
      success: true,
      lesson,
    });

  } catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
}

export async function getCurrentLesson(req, res) {
  try {
    const lesson = await getCurrentLessonService(req.user.id);

    res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function completeLesson(req, res) {
  try {
    const { id } = req.params;

    const lesson = await completeLessonService(id);

    res.json({
      success: true,
      lesson,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}