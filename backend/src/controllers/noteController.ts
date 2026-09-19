import Note from "../models/Note"
import { Request, Response } from "express"

interface NoteBody{
    title: string,
    content: string
}

export const getNotes = async(req : Request, res : Response ) => {
    try{
        const notes = await Note.find()


        res.status(200).json(notes)
    }
    catch(error){
        console.error("Error geting notes:",error)
        res.status(500).json({message: "Fail to get notes"})
    }
}

export const getNoteById = async (req : Request<{id: string}>, res : Response) => {
    try{
        const id = req.params.id

        const note = await Note.findById(id)
        if (!note){
            return res.status(404).json({message : "Note not found"})
        }
        
        return res.status(200).json(note)
    }
    catch(error){
        console.error("Error in find note by id:", error)
        res.status(500).json({message: "Failed to get note"})
    }
}

export const updateNoteById = async (req : Request<{id: string},{},NoteBody>, res : Response) => {
    try{
        const id = req.params.id
        const {title, content} = req.body
        if(!title || title.trim() === ""){
            return res.status(400).json({message: "Title must be provided"})
        }
        const updatedNote = await Note.findByIdAndUpdate(id, {
            title,
            content
        },
        { new: true })
        if (!updatedNote){
            return res.status(404).json({message : "Note not found"})
        }
        
        return res.status(200).json(updatedNote)
    }
    catch(error){
        console.error("Error in update note note:", error)
        res.status(500).json({message: "Failed to update note"})
    }
}

export const deleteNoteById = async (req : Request<{id: string}>, res : Response) => {
    try{
        const id = req.params.id
        const deletedNote = await Note.findByIdAndDelete(id)
        if (!deletedNote){
            return res.status(404).json({message : "Note not found"})
        }
        
        return res.status(200).json(deletedNote)
    }
    catch(error){
        console.error("Error in delete note note:", error)
        res.status(500).json({message: "Failed to delete note"})
    }
}

export const createNote = async (
    req: Request<{},{}, NoteBody>,
    res: Response
) => {
    try {
        const {title, content} = req.body

        const note = await Note.create({
            title,
            content,
        })

        res.status(201).json(note)
    }
    catch(error){
        console.error("Error creating note:", error)
        res.status(500).json({message: "Fail to create note"})
    }
}