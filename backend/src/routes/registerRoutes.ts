import express, { Router } from "express"
import register from "../controllers/registerController"
import { registerLimiter } from "../middleware/rateLimit"

const router = express.Router()

router.post("/", registerLimiter, register)

export default router