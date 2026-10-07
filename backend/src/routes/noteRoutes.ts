import express from "express"
import { createNote, getNotes, getNoteById, updateNoteById, deleteNoteById } from "../controllers/noteController"
import validateNoteId from "../middleware/validateNoteId"
import { validateString } from "../middleware/validateBody"

const router = express.Router()

router.get("/", getNotes)
router.get("/:id", validateNoteId, getNoteById)
router.put("/:id", validateString("title", 200), validateString("content", 100000), validateNoteId, updateNoteById)
router.delete("/:id", validateNoteId, deleteNoteById)
router.post("/", validateString("title", 200), validateString("content", 100000), createNote)

export default router