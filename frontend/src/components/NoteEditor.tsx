import type { Note } from "../types";
import { useState } from "react";
import ReactMarkdown from "react-markdown"

interface NoteEditorProps {
    selectedNote : Note | undefined;
    summary: string
    onTitleChange: (content:string) => void
    onContentChange: (content:string) => void
    originalContent: string
    originalTitle: string
    onSave: () => void
    onDelete: () => void
    onSummarize: () => void
    isSummarizing: boolean
    onExplain: () => void,
    explain: string,
    explaining: boolean,
    onAskAboutText: (text: string) => void,
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

// <input onChange={(e) => 
// onContentChange(e.targe.value)}>
// onContentChange()
const NoteEditor = ({
    selectedNote,
    summary,
    onTitleChange,
    onContentChange,
    originalContent,
    originalTitle,
    onSave,
    onDelete,
    onSummarize,
    isSummarizing,
    onExplain,
    explain,
    explaining,
    onAskAboutText,
    setIsChatOpen,
} : NoteEditorProps) =>
{
    const [currentSelection, setCurrentSelection] = useState("")
    return(
    <main>
        {selectedNote ? (
            <>
            {/*title and content*/}
            <input className="note-title" value={selectedNote.title} onChange={
                (e) => {
                    onTitleChange(e.target.value)
                }
            }/>
            <textarea className="note-content" value={selectedNote.content} onChange={(e) => {
                onContentChange(e.target.value)
            }}
            onSelect={(e) => {
                const textarea = e.currentTarget

                const selected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)

                setCurrentSelection(selected)
            }}
            onBlur={() => {
                setCurrentSelection("")
            }}
            onMouseUp={(e) => {
                const textarea = e.currentTarget

                if (textarea.selectionStart === textarea.selectionEnd) {
                    setCurrentSelection("")
                }
            }}
            />

            {currentSelection && (
                <button className="ask-text-button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                    onAskAboutText(currentSelection)
                    setCurrentSelection("")
                }}
                >
                    Ask about this text
                </button>
            )
            }

            {/*save, delete button*/}
            <div className="note-actions">
                <button 
                className="save-button" 
                disabled={selectedNote.content === originalContent && selectedNote.title === originalTitle} 
                onClick={onSave}
                >
                    Save
                </button>
                <button
                    className="delete-button" onClick={onDelete}
                >
                    Delete
                </button>
                <button className="summarize-button" onClick={onSummarize} disabled={isSummarizing || !selectedNote.content.trim()}>
                    {isSummarizing? "Summarizing..." : "Summarize note"}
                </button>
                <button className="summarize-button" onClick={onExplain} disabled={explaining || !selectedNote.content.trim()}>
                    {explaining? "Explaining..." : "Explain note"}
                </button>
                <button className="ai-button" onClick={() => (setIsChatOpen(prev => !prev))}>
                    Ask AI
                </button>
            </div>
            {summary && (
                    <div className="ai-summary">
                        <h3>AI Summary</h3>
                        <ReactMarkdown>
                            {summary}
                        </ReactMarkdown>
                    </div>
            )}
            {explain && (
                <div className="ai-summary">
                        <h3>AI Explain</h3> 
                        <ReactMarkdown>
                            {explain}
                        </ReactMarkdown>
                    </div>
            )
            }
            </>
        ) : (
            <p>Select a note</p>
        )}

    </main>)
}

export default NoteEditor