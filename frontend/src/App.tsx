import { useState, useEffect } from "react";
import api, { refreshAccessToken, setApiAccessToken, setAuthExpiredHandler } from "./lib/api";
import type {Note} from "./types"
import toast, {Toaster} from 'react-hot-toast'

import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor"
import Login from "./components/Login";


function App() {
    const [notes, setNotes] = useState<Note[]>([])
    const [selectedNote, setSelectedNote] = useState<Note>()
    const [originalContent, setOriginalContent] = useState("")
    const [originalTitle, setOriginalTitle] = useState("")
    const [accessToken, setAccessToken] = useState<string | null>(null)
    
    useEffect(() => {
        const restoreSession = async () => {
        try{   
            const token = await refreshAccessToken()
            setAccessToken(token)
        } catch(error){
        console.log("No existing session")
        }}

        restoreSession()
    },[])

    useEffect(() => {
        setAuthExpiredHandler(() =>{
            setAccessToken(null)
            toast.error("Your session has expired. Please log in again")
        })

        return () => {
            setAuthExpiredHandler(null)
        }
    },[])

    useEffect(()=>{
        
        if(!accessToken) return

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
    }, [accessToken])

    const handleSave = async () => {
        if(!selectedNote) return

        if(selectedNote.title.trim() === ""){
            toast.error("Title can't be empty")
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
        // console.log(response.data)
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
                content : "abc"
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

        if(!window.confirm("Are you sure to delete this?")) return

        try{
            await api.delete<Note>(`/notes/${id}`)
            setNotes(notes.filter(note => note._id !== id))
            if(selectedNote?._id === id){
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

    const handleDeleteSelectedNote = () => {
        console.log("handleDeleteSelectedNote")
        if (!selectedNote) return
        handleDelete(selectedNote._id)
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

    const handleTitleChange = (title:string) => {
        if(!selectedNote) return

        setSelectedNote({
        ...selectedNote,
        title,
        })
    }

    const handleContentChange = (content : string) =>{
        if(!selectedNote) return

        setSelectedNote({...selectedNote, content})
    }

    const handleLogOut = async () =>{
        try{
            await api.post("/logout")
            setAccessToken(null)
            setApiAccessToken(null)
        } catch(error){
            console.error("Error in log out:", error)
            toast.error("Failed to log out")
        }
    }

    const isLoggedIn = accessToken !== null

    return (
        <>
        <Toaster/>
        {!isLoggedIn ? (<Login
            onLogin={setAccessToken}
        />) : (
        <div className="app">
            <Sidebar
                notes={notes}
                selectedNote={selectedNote}
                onSelectNote={handleSelectNote}
                onCreateNote={handleCreateNote}
                onDeleteNote={handleDelete}
                onLogOut={handleLogOut}
            />
            <NoteEditor
                selectedNote={selectedNote}
                onTitleChange={handleTitleChange}
                onContentChange={handleContentChange}
                originalContent={originalContent}
                originalTitle={originalTitle    }
                onSave={handleSave}
                onDelete={handleDeleteSelectedNote}
            />
            
        </div>)
        }
        </>
    );
}

export default App;