import express, { Router } from "express"
import login from "../controllers/loginController"
import { loginLimiter } from "../middleware/rateLimit"

const router = express.Router()

router.post("/", loginLimiter, login)

export default router