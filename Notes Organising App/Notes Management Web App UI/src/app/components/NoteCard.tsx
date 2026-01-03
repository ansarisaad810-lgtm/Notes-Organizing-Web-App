interface Note {
  id: number;
  text: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
}: NoteCardProps) {
  return (
    <div className="border-l-4 border-indigo-500 bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <p className="mb-4 text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
        {note.text}
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm hover:shadow transition-all"
          onClick={() => onEdit(note)}
        >
          Edit
        </button>
        <button
          className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm hover:shadow transition-all"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}