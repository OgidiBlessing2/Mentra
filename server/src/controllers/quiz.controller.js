import {
  generateQuizService,
  submitQuizService,
} from "../services/quiz.service.js";

export async function generateQuiz(req, res) {
  try {
    const { lessonId } = req.params;

    const quiz = await generateQuizService(lessonId);

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("GENERATE QUIZ ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export async function submitQuiz(req, res) {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const userId = req.user.id;

    console.log("✅ SUBMIT QUIZ CONTROLLER");
    console.log("Quiz:", quizId);
    console.log("User:", userId);
    console.log("Answers:", answers);

   const result = await submitQuizService(
  quizId,
  userId,
  answers
);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("❌ SUBMIT QUIZ ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}