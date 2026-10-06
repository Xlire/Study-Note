import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
import express, { response } from "express"
dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export async function summarizeText(content: string) {
    const maxRetries = 3

    for (let attempt = 0; attempt < maxRetries; attempt++){
        try{
            const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `Summarize the following study notes clearly and concisely.

    Study notes:
    ${content}`
        })
            return response.text
        } catch(error: any){
             if (error.status === 503 && attempt < maxRetries - 1) {
                const delay = 2000 * Math.pow(2, attempt)

                console.log(
                    `Gemini unavailable. Retrying in ${delay / 1000} seconds...`
                )

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                )

                continue
            }

            throw error
        }
        }
        throw new Error("Failed to generate summary")
}

export async function explainText(content: string) {
    const maxRetries = 3

    for (let attempt = 0; attempt < maxRetries; attempt++){
        try{
            const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: `Explain the following study notes in a simple and easy-to-understand way.

    Study notes:
    ${content}`
        })
            return response.text
        } catch(error: any){
             if (error.status === 503 && attempt < maxRetries - 1) {
                const delay = 2000 * Math.pow(2, attempt)

                console.log(
                    `Gemini unavailable. Retrying in ${delay / 1000} seconds...`
                )

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                )

                continue
            }

            throw error
        }
        }
        throw new Error("Failed to generate explaination")
}

export async function chatAboutText(
    noteContent: string,
    question: string,
    selectedText?: string
) {
    const selectedTextContent = selectedText ? `The student specifically highlighted this part of the note:

"${selectedText}"`
        : "The student did not highlight any specific text."
    
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: `You are a helpful study assistant.

The student's current note is below, choose to use it or ignore it completely if the question is not relate to it:

"${noteContent}"

${selectedTextContent}

The student's question is:

${question}

Answer the student's question clearly and helpfully.
Use the current note as context ignore it completely if it's not related to the question.
If specific text was highlighted, pay particular attention to it.`
    })

    return response.text
}