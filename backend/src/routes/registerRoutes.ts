import express, { Router } from "express"
import register from "../controllers/registerController"

const router = express.Router()

router.post("/", register)

export default router