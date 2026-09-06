
import {
  chatWithGlobalMentor,
} from "../services/globalMentor.service.js";

export async function chatWithGlobalMentorController(
  req,
  res
) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result =
      await chatWithGlobalMentor(message);

    return res.status(200).json({
      success: true,
      answer: result.answer,
    });
  } catch (error) {
    console.error(
      "GLOBAL MENTOR ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate AI response",
    });
  }
}
