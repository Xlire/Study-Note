import { Request, Response } from "express"
import { summarizeText, explainText, chatAboutText } from "../services/gemini"

export const summarize = async (req: Request, res: Response) => {
    try{ 
        const {content} = req.body
        
        if(!content){
            return res.status(400).json({
                message: "Content is required"
            })
        }

        const summary = await summarizeText(content)
        
        return res.status(200).json({
            summary
        })
    } catch(error){
        console.error("Error summarizing note:", error)

        return res.status(500).json({
            message: "Failed to summarize note"
        })
    }
}

export const explain = async (req: Request, res: Response) => {
    try{ 
        const {content} = req.body
        
        if(!content){
            return res.status(400).json({
                message: "Content is required"
            })
        }

        const explain = await explainText(content)
        
        return res.status(200).json({
            explain
        })
    } catch(error){
        console.error("Error summarizing note:", error)

        return res.status(500).json({
            message: "Failed to explain note"
        })
    }
}

export const chat = async (req: Request, res: Response) => {
    try {
        const {noteContent, question, selectedText} = req.body

        if(!noteContent || !question){
            return res.status(400).json({
                message: "Note content and question are required"
            })
        }

        const answer = await chatAboutText(noteContent, question, selectedText)

        return res.status(200).json({
            answer
        })
    } catch(error) {
        console.error("Error chatting about text:", error)

        return res.status(500).json({
            message: "Failed to generate answer"
        })
    }
}