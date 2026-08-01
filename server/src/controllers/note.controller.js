import {
  createNoteService,
  getNotesService,
  getNoteService,
  updateNoteService,
  deleteNoteService,
} from "../services/note.service.js";

const TEST_USER_ID = "test-user-id";

export async function createNote(req, res) {
  try {
    const note = await createNoteService(TEST_USER_ID, req.body);

    res.status(201).json({
      success: true,
      note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getNotes(req, res) {
  try {
    const notes = await getNotesService(TEST_USER_ID);

    res.json({
      success: true,
      notes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getNote(req, res) {
  try {
    const note = await getNoteService(req.params.id);

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateNote(req, res) {
  try {
    const note = await updateNoteService(req.params.id, req.body);

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteNote(req, res) {
  try {
    const result = await deleteNoteService(req.params.id);

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