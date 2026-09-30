import express from "express"
import { createNote, getNotes, getNoteById, updateNoteById, deleteNoteById } from "../controllers/noteController"
import validateNoteId from "../middleware/validateNoteId"

const router = express.Router()

router.get("/", getNotes)
router.get("/:id", validateNoteId, getNoteById)
router.put("/:id", validateNoteId, updateNoteById)
router.delete("/:id", validateNoteId, deleteNoteById)
router.post("/", createNote)

export default router