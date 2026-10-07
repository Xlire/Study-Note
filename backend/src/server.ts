import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import authenticate from "./middleware/authenticate";
import cookieParser from "cookie-parser";
import helmet from "helmet"

import connectDB from "./config/db";
import noteRoutes from "./routes/noteRoutes";
import registerRoutes from "./routes/registerRoutes";
import loginRoutes from "./routes/loginRoutes";
import refreshRoutes from "./routes/refreshRoutes";
import logoutRoutes from "./routes/logoutRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();
app.set("trust proxy", 1)
app.use(helmet())
const PORT = process.env.PORT || 5001;

const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ["RateLimit", "RateLimit-Policy"]
}))

app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({ message: "GET for AI Study working" });
});

app.use("/api/register", registerRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/refresh", refreshRoutes)
app.use("/api/logout", logoutRoutes)

app.use(authenticate)
app.use("/api/notes", noteRoutes) 
app.use("/api/ai", aiRoutes)

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 
})


