export interface Note{
    _id: string,
    title: string,
    content: string,
    createdAt: string,
    updateAt: string
}

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