import express from "express"
import refresh from '../controllers/refreshController'

const router = express.Router()

router.post("/", refresh)

export default router