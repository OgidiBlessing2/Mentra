import { generateQuizService } from "../services/quiz.service.js";

export async function generateQuiz(req, res) {
  try {
    const { lessonId } = req.params;

    const quiz = await generateQuizService(lessonId);

    res.json({
      success: true,
      quiz,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}