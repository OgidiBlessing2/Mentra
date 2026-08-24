import {
  createBookmarkService,
  getBookmarksService,
  deleteBookmarkService,
} from "../services/bookmark.service.js";


// 🔖 Create bookmark
export async function createBookmark(req, res) {
  try {
    const userId = req.user.id;
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "lessonId is required",
      });
    }

    const bookmark = await createBookmarkService(
      userId,
      lessonId
    );

    res.status(201).json({
      success: true,
      bookmark,
    });

  } catch (error) {
    console.error(
      "❌ Failed to create bookmark:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// 📚 Get bookmarks
export async function getBookmarks(req, res) {
  try {
    const userId = req.user.id;

    const bookmarks =
      await getBookmarksService(userId);

    res.json({
      success: true,
      bookmarks,
    });

  } catch (error) {
    console.error(
      "❌ Failed to get bookmarks:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// ❌ Delete bookmark
export async function deleteBookmark(req, res) {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;

    const bookmark =
      await deleteBookmarkService(
        userId,
        lessonId
      );

    res.json({
      success: true,
      bookmark,
    });

  } catch (error) {
    console.error(
      "❌ Failed to delete bookmark:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}