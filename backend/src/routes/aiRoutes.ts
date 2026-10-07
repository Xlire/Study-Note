import express from "express"
import { summarize, explain, chat} from "../controllers/aiController"
import { aiLimiter } from "../middleware/rateLimit"
import { validateString } from "../middleware/validateBody"

const router = express.Router()

router.post("/summarize", validateString("content", 100000), aiLimiter, summarize)
router.post("/explain", validateString("content", 100000), aiLimiter, explain)
router.post("/chat",
    validateString("noteContent", 100000),
    validateString("question", 5000),
    validateString("selectedText", 100000, false),aiLimiter,
     chat)

export default router