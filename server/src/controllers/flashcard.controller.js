import {
  createFlashcardService,
  getFlashcardsService,
  updateFlashcardService,
  deleteFlashcardService,
} from "../services/flashcard.service.js";


// 🧠 Create flashcard
export async function createFlashcard(req, res) {
  try {
    const userId = req.user.id;

    const {
      lessonId,
      question,
      answer,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "question and answer are required",
      });
    }

    const flashcard =
      await createFlashcardService(
        userId,
        {
          lessonId,
          question,
          answer,
        }
      );

    res.status(201).json({
      success: true,
      flashcard,
    });

  } catch (error) {
    console.error(
      "❌ Failed to create flashcard:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// 📚 Get user's flashcards
export async function getFlashcards(req, res) {
  try {
    const userId = req.user.id;

    const flashcards =
      await getFlashcardsService(userId);

    res.json({
      success: true,
      flashcards,
    });

  } catch (error) {
    console.error(
      "❌ Failed to get flashcards:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ✏️ Update flashcard
export async function updateFlashcard(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      lessonId,
      question,
      answer,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "question and answer are required",
      });
    }

    const flashcard =
      await updateFlashcardService(
        userId,
        id,
        {
          lessonId,
          question,
          answer,
        }
      );

    res.json({
      success: true,
      flashcard,
    });

  } catch (error) {
    console.error(
      "❌ Failed to update flashcard:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// 🗑️ Delete flashcard
export async function deleteFlashcard(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const flashcard =
      await deleteFlashcardService(
        userId,
        id
      );

    res.json({
      success: true,
      flashcard,
    });

  } catch (error) {
    console.error(
      "❌ Failed to delete flashcard:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}