import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { NetConnectOpts } from "node:net";

const validateNoteId = (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id

    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({
            message : "Invalid note ID"
        })
    }

    next()
}

export default validateNoteId