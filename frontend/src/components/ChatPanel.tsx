import { useState, useEffect, useRef } from "react"
import api, {getAiUsesRemaining} from "../lib/api"
import ReactMarkdown from "react-markdown"
import { BeatLoader } from "react-spinners"
import toast from "react-hot-toast"

interface ChatPanelProps {
    noteContent: string,
    selectedText: string,
    setSelectedText: React.Dispatch<React.SetStateAction<string>>,
    onClose: () => void,
}

interface ChatMessage {
    role: "user" | "ai"
    content: string
}

function ChatPanel({
    noteContent,
    selectedText,
    setSelectedText,
    onClose,
}: ChatPanelProps) {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isSendingChat, setIsSendingChat] = useState(false)
    const [aiUsesRemaining, setAiUsesRemaining] = useState<number | null>(
        getAiUsesRemaining()
    ) 

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
    })
    }, [messages, isSendingChat])

    const handleSend = async () => {
        if(!message.trim() || isSendingChat) return

        const userMessage : ChatMessage = {
            role: "user",
            content: message.trim()
        }

        setMessages(prev => [...prev, userMessage])
        setMessage("")
        setIsSendingChat(true)

        try{
            const response = await api.post("/ai/chat", {
                noteContent,
                selectedText,
                question : message
            })

            setAiUsesRemaining(getAiUsesRemaining())

            const aiMessage: ChatMessage = {
                role: "ai",
                content: response.data.answer
            }

            setMessages(prev => [...prev, aiMessage])
            setSelectedText("")
        } catch (error: any) {
            console.error("Error chatting with AI:", error)

            if (error.response?.status === 429) {
                toast.error("You've reached your AI usage limit. Please try again later.")
                return
            }

            const errorMessage: ChatMessage = {
                role: "ai",
                content: "Sorry, I couldn't get a response right now. Please try again."
            }

            setMessages(prev => [...prev, errorMessage])
            } finally{
                setIsSendingChat(false)
            }
    }

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h2>Study Assistant</h2>
                
                {aiUsesRemaining !== null && (
                    <div className="ai-usage">
                        AI uses left: {aiUsesRemaining} / 20
                    </div>
                )}
                <button onClick={onClose}>
                    ×
                </button>
            </div>

            <div className="chat-content" >
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.role}`}
                        >
                            <ReactMarkdown>
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    ))}
                </div>

                {selectedText !== "" && (
                    <div className="selected-text">
                    <p>{selectedText}</p>    
                </div>
                )}

                {isSendingChat && (
                    <div className="chat-message assistant">
                        <BeatLoader size={8} color="#7c3aed" />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                    }
                }}
                placeholder="Ask me anything"
                />

                <button 
                    disabled={!message.trim() || isSendingChat}
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatPanel