// Select DOM elements
const noteInput = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const notesList = document.getElementById('notes-list');
const errorMessage = document.getElementById('error-message');

// State to track if we are editing a note
let isEditing = false;
let currentEditId = null;

// Load notes from LocalStorage on startup
document.addEventListener('DOMContentLoaded', loadNotes);

// Event listener for adding/updating a note
addBtn.addEventListener('click', handleNoteSubmission);

function loadNotes() {
    const notes = getNotesFromStorage();
    notesList.innerHTML = ''; // Clear list

    // Check for empty state if desired, but for now just list
    if (notes.length === 0) {
        // Optional: create empty state like in design
        const emptyDiv = document.createElement('div');
        emptyDiv.className = "text-center bg-white rounded-lg shadow-md p-12";
        emptyDiv.innerHTML = `
            <div class="text-6xl mb-4">📝</div>
            <p class="text-gray-500">No notes yet. Add your first note above!</p>
        `;
        notesList.appendChild(emptyDiv);
        return;
    }

    // Sort notes by newest first
    notes.slice().reverse().forEach(note => {
        // Ensure note has an ID
        if (!note.id) note.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        createNoteElement(note);
    });
}

function getNotesFromStorage() {
    const notes = localStorage.getItem('myAppNotes');
    try {
        return notes ? JSON.parse(notes) : [];
    } catch (e) {
        console.error("Corrupt notes data", e);
        return [];
    }
}

function saveNotesToStorage(notes) {
    localStorage.setItem('myAppNotes', JSON.stringify(notes));
}

function handleNoteSubmission() {
    const noteText = noteInput.value.trim();

    if (noteText === '') {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');

    if (isEditing) {
        updateNote(noteText);
    } else {
        addNote(noteText);
    }

    // Reset input
    noteInput.value = '';
}

function addNote(text) {
    const notes = getNotesFromStorage();
    const newNote = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: text
    };

    notes.push(newNote);
    saveNotesToStorage(notes);
    loadNotes();
}

function updateNote(text) {
    const notes = getNotesFromStorage();
    // Loose comparison for ID to be safe
    const noteIndex = notes.findIndex(note => note.id == currentEditId);

    if (noteIndex !== -1) {
        notes[noteIndex].text = text;
        saveNotesToStorage(notes);
        loadNotes();
    }

    resetFormState();
}

function resetFormState() {
    isEditing = false;
    currentEditId = null;
    addBtn.textContent = 'Add Note';
    // Logic: Figma design uses same indigo color for both Add and Update
    // We just keep the class as is (Tailwind classes in HTML)
}

function createNoteElement(note) {
    // Design from NoteCard.tsx:
    // <div className="border-l-4 border-indigo-500 bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
    const div = document.createElement('div');
    div.className = "border-l-4 border-indigo-500 bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow";
    div.dataset.id = note.id;

    const p = document.createElement('p');
    p.className = "mb-4 text-gray-700 whitespace-pre-wrap break-words leading-relaxed";
    p.textContent = note.text;

    const actionDiv = document.createElement('div');
    actionDiv.className = "flex justify-end gap-3";

    const editBtn = document.createElement('button');
    // Design: bg-amber-500 text-white ...
    editBtn.className = "px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow-sm hover:shadow transition-all font-medium";
    editBtn.textContent = 'Edit';
    editBtn.onclick = function () { startEditing(note.id, note.text); };

    const deleteBtn = document.createElement('button');
    // Design: bg-red-500 text-white ...
    deleteBtn.className = "px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm hover:shadow transition-all font-medium";
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function () { deleteNote(note.id); };

    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);

    div.appendChild(p);
    div.appendChild(actionDiv);

    notesList.appendChild(div);
}

function deleteNote(id) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    let notes = getNotesFromStorage();
    const originalLength = notes.length;

    // Use loose strictness (==) to catch string vs number ID differences
    // or explicitly convert both to strings
    notes = notes.filter(note => String(note.id) !== String(id));

    if (notes.length === originalLength) {
        alert("Delete failed: Note ID not found. Try refreshing.");
        return;
    }

    saveNotesToStorage(notes);
    loadNotes();

    if (isEditing && currentEditId == id) {
        resetFormState();
        noteInput.value = '';
    }
}

function startEditing(id, text) {
    isEditing = true;
    currentEditId = id;

    noteInput.value = text;
    noteInput.focus();

    addBtn.textContent = 'Update Note';
    // Design stays indigo for Update too

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
