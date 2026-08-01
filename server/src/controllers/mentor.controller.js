import {
  chatService,
  explainService,
  quizService,
  submitQuizService,
} from "../services/mentor.service.js";
export async function chat(req, res) {
  try {
    const { message } = req.body;

    const reply = await chatService(message);

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function explain(req, res) {
  try {
    const { topic } = req.body;

    const explanation = await explainService(topic);

    res.json({
      success: true,
      explanation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function quiz(req, res) {
  try {
    const { topic } = req.body;

    const quiz = await quizService(topic);

    res.json({
      success: true,
      quiz,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function submitQuiz(req, res) {
  try {
    const { questions, userAnswers } = req.body;

    const result = await submitQuizService(
      questions,
      userAnswers
    );

    res.json({
      success: true,
      ...result,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}