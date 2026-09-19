import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import noteRoutes from "./routes/noteRoutes";
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "http://localhost:5173",
}))

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "GET for AI Study working" });
});

connectDB()

app.use("/api/notes", noteRoutes) 

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 