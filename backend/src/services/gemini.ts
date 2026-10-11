import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
import express, { response } from "express"
dotenv.config()

export interface QuizQuestion {
    question: string
    options: {
        A: string
        B: string
        C: string
    }
    correctAnswer: "A" | "B" | "C"
    explanation: string
}

export interface GeneratedQuiz {
    questions: QuizQuestion[]
}

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

export async function generateQuiz(content: string): Promise<GeneratedQuiz> {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        config: {
            responseMimeType: "application/json"
        },
        contents: `Generate exactly 3 multiple-choice questions based on the following study notes.

Requirements:
- Each question must test understanding of the notes.
- Each question must have exactly 3 answer options, labeled A, B, and C.
- Exactly one option must be correct for each question.
- Incorrect options should be plausible but clearly incorrect based on the notes.
- Include a short explanation of why the correct answer is correct.
- Use only information supported by the notes. Do not invent facts.
- Return valid JSON only, following this structure:

{
  "questions": [
    {
      "question": "Question text",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option"
      },
      "correctAnswer": "A",
      "explanation": "Explanation of the correct answer"
    }
  ]
}

The questions array must contain exactly 3 questions.
The correctAnswer field must be "A", "B", or "C".

Study notes:
${content}`
    })

    const text = response.text

    if(!text){
         throw new Error("Gemini returned an empty quiz response")
    }

    const quiz: GeneratedQuiz = JSON.parse(text)

    if(
        !Array.isArray(quiz.questions) || quiz.questions.length !== 3
    ) {
        throw new Error("Invalid quiz: expected exactly 3 questions")
    }

    for (const question of quiz.questions) {
        if (
            typeof question.question !== "string" ||
            typeof question.options?.A !== "string" ||
            typeof question.options?.B !== "string" ||
            typeof question.options?.C !== "string" ||
            !["A", "B", "C"].includes(question.correctAnswer) ||
            typeof question.explanation !== "string"
        ) {
            throw new Error("Invalid quiz question structure")
        }
    }

    return quiz
}