import {
  createNoteService,
  getNotesService,
  getNoteService,
  updateNoteService,
  deleteNoteService,
} from "../services/note.service.js";

export async function createNote(req, res) {
  try {
    const userId = req.user.id;

    const note = await createNoteService(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      note,
    });
  } catch (err) {
    console.error("❌ CREATE NOTE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getNotes(req, res) {
  try {
    const notes = await getNotesService(req.user.id);

    res.json({
      success: true,
      notes,
    });
  } catch (err) {
    console.error("❌ GET NOTES ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getNote(req, res) {
  try {
    const userId = req.auth.userId;

    const note = await getNoteService(
      req.params.id,
      userId
    );

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    console.error("GET NOTE ERROR:", err);

    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateNote(req, res) {
  try {
    const userId = req.auth.userId;

    const note = await updateNoteService(
      req.params.id,
      userId,
      req.body
    );

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    console.error("UPDATE NOTE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
export async function deleteNote(req, res) {
  try {
    const userId = req.user.id;

    console.log("🗑️ DELETE NOTE");
    console.log("Note:", req.params.id);
    console.log("User:", userId);

    const result = await deleteNoteService(
      req.params.id,
      userId
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("❌ DELETE NOTE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}