import type {Note} from "../types"
import { Trash2 } from 'lucide-react';

interface SidebarProps {
    notes: Note[];
    selectedNote: Note | undefined;
    onSelectNote: (note: Note) => void;
    onCreateNote: () => void;
    onDeleteNote: (id: string) => void;
    onLogOut: () => void;
}

const SideBar = ({ notes,
    selectedNote,
    onSelectNote,
    onCreateNote,
    onDeleteNote,
    onLogOut
}: SidebarProps) => {
  return (
    <aside>
        <h1>AI Study Notes</h1>
            <button className="new-note-button" onClick={onCreateNote}>+ New Note</button>

            {notes.map(note =>(
                <div key={note._id} className={(note._id === selectedNote?._id) ? "note-item-row note-item-row-selected" :"note-item-row"}>
                    <button
                    className={note._id === selectedNote?._id ?"note-item note-item-selected" : "note-item"}
                    onClick={() => 
                        {   
                            onSelectNote(note)
                        }
                    }>{note.title}
                    </button>

                    <button 
                        className=" note-delete-button"
                        aria-label={`Delete ${note.title}`}
                        title="Delete note"
                        onClick={()=>onDeleteNote(note._id)}
                    >
                        <Trash2 size={16}/>
                        </button>
                </div>
            ))}
            <button className="log-out-button" onClick={onLogOut}>Log out</button>
    </aside>
  )
}

export default SideBar
