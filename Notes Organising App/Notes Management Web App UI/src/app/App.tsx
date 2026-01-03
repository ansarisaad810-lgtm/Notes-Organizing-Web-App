import { useState } from "react";
import { NoteCard } from "./components/NoteCard";

interface Note {
  id: number;
  text: string;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (inputValue.trim() === "") {
      setShowError(true);
      return;
    }

    setShowError(false);

    if (editingId !== null) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingId ? { ...note, text: inputValue } : note
      ));
      setEditingId(null);
    } else {
      // Add new note
      const newNote: Note = {
        id: Date.now(),
        text: inputValue,
      };
      setNotes([...notes, newNote]);
    }

    setInputValue("");
  };

  const handleEdit = (note: Note) => {
    setInputValue(note.text);
    setEditingId(note.id);
    setShowError(false);
  };

  const handleDelete = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setInputValue("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl text-gray-800 mb-2">My Notes</h1>
          <p className="text-gray-600">Keep track of your thoughts and ideas</p>
        </header>

        {/* Note Input Section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <textarea
            className="w-full h-36 p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="Write your note here…"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (showError && e.target.value.trim() !== "") {
                setShowError(false);
              }
            }}
          />
          
          {showError && (
            <p className="text-red-500 mt-2 text-sm flex items-center gap-1">
              <span>⚠</span> Note cannot be empty
            </p>
          )}

          <button
            className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all"
            onClick={handleAddOrUpdate}
          >
            {editingId !== null ? "Update Note" : "Add Note"}
          </button>
        </div>

        {/* Notes List Section */}
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">No notes yet. Add your first note above!</p>
          </div>
        )}
      </div>
    </div>
  );
}