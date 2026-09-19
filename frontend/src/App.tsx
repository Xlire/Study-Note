import { useState, useEffect } from "react";
import api from "./lib/api";
import type {Note} from "./types"
import toast, {Toaster} from 'react-hot-toast'

import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor"


function App() {
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedNote, setSelectedNote] = useState<Note>()
    const [originalContent, setOriginalContent] = useState("")
    const [originalTitle, setOriginalTitle] = useState("")

    useEffect(()=>{
        const fetchNotes = async () => {
            try {
            const response = await api.get<Note[]>("/notes")
            setNotes(response.data)
            }
            catch(error){
                console.error("Error fetching notes:", error)
            }
        }  
        fetchNotes() 
    }, [])

    const handleSave = async () => {
        if(!selectedNote) return

        if(selectedNote.title.trim() === ""){
            toast.error("Title can't be empty")
            console.log(originalTitle)
            setSelectedNote({
                ...selectedNote,
                title : originalTitle
            })
            return
        }
        
        try{
            const response = await api.put<Note>(`/notes/${selectedNote._id}`,
            {
                title : selectedNote.title,
                content : selectedNote.content,
            })
        

        setSelectedNote(response.data)
        setOriginalTitle(response.data.title)
        setOriginalContent(response.data.content)
        setNotes(prev => 
            prev.map(note =>
                 note._id === response.data._id ? response.data : note
                ))
        toast.success("Note saved!")
        console.log(response.data)
        }

        catch(error){
            console.error("Error in saving note:", error)
            toast.error("Fail to save note")
        }
    }

    const handleCreateNote = async () => {
        
        try{
            const response = await api.post<Note>("/notes",
            {
                title : "Untitled note",
                content : ""
            }
            )

            setNotes(prev => [ ...prev, response.data])
            setSelectedNote(response.data)
            setOriginalTitle("Untitled note")
            setOriginalContent("")
            toast.success(" create new page")
        }
        catch(error){
            console.error("Error in create new page:", error)
            toast.error("Failed to create new page")
        }
    }

    const handleDelete = async (id : string) => {
        if (!selectedNote) return

        if(!window.confirm("Are you sure to delete this?")) return

        try{
            api.delete<Note>(`/notes/${id}`)
            setNotes(notes.filter(note => note._id !== id))
            if(selectedNote._id === id){
                setSelectedNote(undefined)
            }
            console.log("Note with id:",id,"deleted")
            toast.success("Success delete note")
        }
        catch(error){
            console.error("Error in delete page:", error)
            toast.error("Failed to delete page")
        }
    }

    const handleSelectNote = (note: Note) => {
        const hasUnsavedChanges = (selectedNote &&
                                    (
                                        selectedNote.title !== originalTitle ||
                                        selectedNote.content !== originalContent
                                    )
                                )
        if(hasUnsavedChanges){
            if(!window.confirm(
                "You have unsaved changes. Are you sure you want to leave this note?"
            )) 
            return
        }
        setSelectedNote(note)
        setOriginalTitle(note.title)
        setOriginalContent(note.content)
    }

    return (
        <>
        <Toaster/>
        <div className="app">
            <Sidebar
                notes={notes}
                selectedNote={selectedNote}
                originalTitle={originalTitle}
                originalContent={originalContent}
                onSelectNote={handleSelectNote}
                onCreateNote={handleCreateNote}
                onDeleteNote={handleDelete}
            />
            <NoteEditor
                selectedNote={selectedNote}
                onTitleChange={(title) => {
                    if(!selectedNote) return

                    setSelectedNote({
                    ...selectedNote,
                    title,
                    })
                }
                }
                onContentChange={(content) =>{
                    if(!selectedNote) return

                    setSelectedNote({...selectedNote, content})
                }}
                originalContent={originalContent}
                originalTitle={originalTitle    }
                onSave={handleSave}
                onDelete={handleDelete}
            />
            
        </div>
        </>
    );
}

export default App;