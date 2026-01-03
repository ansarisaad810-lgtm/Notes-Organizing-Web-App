const noteInput = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const notesList = document.getElementById('notes-list');
const errorMessage = document.getElementById('error-message');

let isEditing = false;
let currentEditId = null;

document.addEventListener('DOMContentLoaded', loadNotes);
addBtn.addEventListener('click', handleNoteSubmission);

/* =========================
   UTIL: Time Ago Function
========================= */
function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (let interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

/* =========================
   LOAD NOTES
========================= */
function loadNotes() {
    const notes = getNotesFromStorage();
    notesList.innerHTML = '';

    if (notes.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = "note-card text-center";
        emptyDiv.innerHTML = `
            <div style="font-size:48px">📝</div>
            <p>No notes yet. Add your first note above!</p>
        `;
        notesList.appendChild(emptyDiv);
        return;
    }

    notes.slice().reverse().forEach(note => createNoteElement(note));
}

/* =========================
   STORAGE
========================= */
function getNotesFromStorage() {
    const notes = localStorage.getItem('myAppNotes');
    return notes ? JSON.parse(notes) : [];
}

function saveNotesToStorage(notes) {
    localStorage.setItem('myAppNotes', JSON.stringify(notes));
}

/* =========================
   ADD / UPDATE NOTE
========================= */
function handleNoteSubmission() {
    const text = noteInput.value.trim();

    if (!text) {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');

    isEditing ? updateNote(text) : addNote(text);
    noteInput.value = '';
}

function addNote(text) {
    const notes = getNotesFromStorage();
    notes.push({
        id: Date.now(),
        text: text,
        createdAt: new Date().toISOString(),
        updatedAt: null
    });
    saveNotesToStorage(notes);
    loadNotes();
}

function updateNote(text) {
    const notes = getNotesFromStorage();
    const index = notes.findIndex(n => n.id === currentEditId);

    if (index !== -1) {
        notes[index].text = text;
        notes[index].updatedAt = new Date().toISOString();
    }

    saveNotesToStorage(notes);
    resetForm();
    loadNotes();
}

function resetForm() {
    isEditing = false;
    currentEditId = null;
    addBtn.textContent = "Add Note";
}

/* =========================
   CREATE NOTE CARD
========================= */
function createNoteElement(note) {
    const card = document.createElement('div');
    card.className = "note-card";

    const p = document.createElement('p');
    p.className = "note-text";
    p.textContent = note.text;

    const timeInfo = document.createElement('div');
    timeInfo.style.fontSize = "0.8rem";
    timeInfo.style.color = "#6b6258";
    timeInfo.style.marginBottom = "0.5rem";

    if (note.updatedAt) {
        timeInfo.textContent = `Created: ${new Date(note.createdAt).toLocaleString()} • Updated ${timeAgo(note.updatedAt)}`;
    } else {
        timeInfo.textContent = `Created: ${new Date(note.createdAt).toLocaleString()}`;
    }

    const actions = document.createElement('div');
    actions.className = "actions";

    const editBtn = document.createElement('button');
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => startEditing(note.id, note.text);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteNote(note.id);

    actions.append(editBtn, deleteBtn);
    card.append(p, timeInfo, actions);
    notesList.appendChild(card);
}

/* =========================
   DELETE & EDIT
========================= */
function deleteNote(id) {
    if (!confirm("Delete this note?")) return;
    const notes = getNotesFromStorage().filter(n => n.id !== id);
    saveNotesToStorage(notes);
    loadNotes();
}

function startEditing(id, text) {
    isEditing = true;
    currentEditId = id;
    noteInput.value = text;
    addBtn.textContent = "Update Note";
    noteInput.focus();
}
