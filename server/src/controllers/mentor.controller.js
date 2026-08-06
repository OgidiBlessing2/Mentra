import { chatWithMentor } from "../services/mentor.service.js";

export async function chat(req, res) {
  try {
    const { lessonId, question } = req.body;

    if (!lessonId || !question) {
      return res.status(400).json({
        success: false,
        message: "lessonId and question are required",
      });
    }

    const result = await chatWithMentor(
      lessonId,
      question
    );

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
