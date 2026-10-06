import express from "express"
import { summarize, explain, chat} from "../controllers/aiController"

const router = express.Router()

router.post("/summarize", summarize)
router.post("/explain", explain)
router.post("/chat", chat)

export default router