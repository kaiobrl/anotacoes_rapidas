let notes = [];
let editingNoteId = null;

function loadNotes() {
    const savedNotes = localStorage.getItem('notasRapidas');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(event) {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // Edit existing note
        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }

    } else {
        // Add new note
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        });

    }

    closeNoteDialog();
    saveNotes();
    renderNotes();
}

function generateId() {
    return Date.now().toString();
}

function saveNotes() {
    localStorage.setItem('notasRapidas', JSON.stringify(notes));
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    if (notes.length === 0) {
        // show some fall back elements
        notesContainer.innerHTML = `
        <div class="empty-notes">
            <h2>Nenhuma nota ainda</h2>
            <p>Clique no botão abaixo para criar sua primeira nota.</p>
            <button class="btn" onclick="openNoteDialog()">+ adicione sua primeira nota</button>
        </div>
        `
        return
    }

    notesContainer.innerHTML = notes.map(note => `
     <div class="note-card">
       <h3 class="note-title">${note.title}</h3>
       <p class="note-content">${note.content}</p>
         <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
         </button>
         <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0l-1.83 1.83c-.39.39-.39 1.02 0 1.41L10.59 12l-6.71 6.71c-.39.39-.39 1.02 0 1.41l1.83 1.83c.39.39 1.02.39 1.41 0L12 13.41l4.88 4.88c.39.39 1.02.39 1.41 0l1.83-1.83c.39-.39.39-1.02 0-1.41L13.41 12l6.71-6.71c.39-.39.39-1.02 0-1.41z"/>
            </svg>
         </button> 
     </div>
     `).join('');
}
function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        // Edit Mode
        const noteToEdit = notes.find(note => note.id === noteId);
        editingNoteId = noteId;
        document.getElementById('dialogTitle').textContent = 'Editar Nota';
        titleInput.value = noteToEdit.title;
        contentInput.value = noteToEdit.content;
    }
    else {
        // Add Mode
        editingNoteId = null;
        document.getElementById('dialogTitle').textContent = 'Adicionar Nova Nota';
        titleInput.value = '';
        contentInput.value = '';
    }

    dialog.showModal();
    titleInput.focus();

}

function closeNoteDialog() {
    document.getElementById('noteDialog').close();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggleBtn').textContent = isDark ? '🌞' : '🌜';
}

function applyStoredTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggleBtn').textContent = '🌞'
    }

}

document.addEventListener('DOMContentLoaded', function () {
    applyStoredTheme();
    notes = loadNotes();
    renderNotes();

    document.getElementById('noteForm').addEventListener('submit', saveNote);
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    document.getElementById('noteDialog').addEventListener('click', function (event) {
        if (event.target === this) {
            closeNoteDialog();
        }
    });
});