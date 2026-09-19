import type { Note } from "../types";

interface NoteEditorProps {
    selectedNote : Note | undefined;
    onTitleChange: (content:string) => void
    onContentChange: (content:string) => void
    originalContent: string
    originalTitle: string
    onSave: () => void
    onDelete: (id : string) => void
}

// <input onChange={(e) => 
// onContentChange(e.targe.value)}>
// onContentChange()
const NoteEditor = ({
    selectedNote,
    onTitleChange,
    onContentChange,
    originalContent,
    originalTitle,
    onSave,
    onDelete
} : NoteEditorProps) =>
{
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
            }}/>

            {/*save, delete button*/}
            <div className="note-actions">
                <button 
                className="save-button" 
                disabled={
                    selectedNote.content === originalContent && selectedNote.title === originalTitle
                    } 
                onClick={onSave}
                >
                    Save
                </button>
                <button
                    className="delete-button" onClick={() =>
                        onDelete(selectedNote._id)}
                >
                    Delete
                </button>
            </div>
            </>
        ) : (
            <p>Select a note</p>
        )}

    </main>)
}

export default NoteEditor