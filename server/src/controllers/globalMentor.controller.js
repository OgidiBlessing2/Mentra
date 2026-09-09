import {
  chatWithGlobalMentor,
  generateMentorImage,
} from "../services/globalMentor.service.js";

// -----------------------------------------
// Normal AI Mentor chat
// -----------------------------------------

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

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const result = await chatWithGlobalMentor(
      message,
      userId
    );

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

// -----------------------------------------
// Generate AI Mentor image
// -----------------------------------------

export async function generateMentorImageController(
  req,
  res
) {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Image prompt is required",
      });
    }

    console.log(
      "🎨 Generating Mentor image..."
    );

    const result =
      await generateMentorImage(prompt);

    return res.status(200).json({
      success: true,
      image: result.data,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error(
      "GLOBAL MENTOR IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate AI image",
    });
  }
}