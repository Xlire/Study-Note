import express from "express"
import { createNote, getNotes, getNoteById, updateNoteById, deleteNoteById } from "../controllers/noteController"

const router = express.Router()

router.get("/", getNotes)
router.get("/:id", getNoteById)
router.put("/:id", updateNoteById)
router.delete("/:id", deleteNoteById)
router.post("/", createNote)

export default router