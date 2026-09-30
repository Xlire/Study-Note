import mongoose, { SchemaTypeOptions } from "mongoose";
import { title } from "node:process";

const noteSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required : true
        },
        content : {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps : true,
    },
)

const Note = mongoose.model("Note", noteSchema)

export default Note