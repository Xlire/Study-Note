import React from 'react'
import type {Note} from "../types"
import { Trash2 } from 'lucide-react';

interface SidebarProps {
    notes: Note[];
    selectedNote: Note | undefined;
    originalTitle: string;
    originalContent: string;
    onSelectNote: (note: Note) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
}

const SideBar = ({ notes,
    selectedNote,
    originalTitle,
    originalContent,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
}: SidebarProps) => {
  return (
    <aside>
        <h1>AI Study Notes</h1>

                <button className="new-note-button" onClick={onCreateNote}>+ New Note</button>

                {notes.map(note =>(
                    <div className={(note._id === selectedNote?._id) ? "note-item-row note-item-row-selected" :"note-item-row"}>
                        <button key={note._id}
                        className={note._id === selectedNote?._id ?"note-item note-item-selected" : "note-item"}
                        onClick={() => 
                            {   
                                // Warning for unsaved changes
                                if(selectedNote &&
                                (
                                    selectedNote.title !== originalTitle ||
                                    selectedNote.content !== originalContent
                                ))
                                {
                                    if(!window.confirm(
                                        "You have unsaved changes. Are you sure you want to leave this note?"
                                    )) return
                                }

                                onSelectNote(note)
                            }
                        }>{note.title}
                        </button>

                        <button 
                            className=" note-delete-button"
                            aria-label={`Delete ${note.title}`}
                            title="Delete note"
                            onClick={() =>  {
                                onDeleteNote(note._id)
                            }
                            }
                        >
                            <Trash2 size={16}/>
                            </button>
                    </div>
                ))}
    </aside>
  )
}

export default SideBar
