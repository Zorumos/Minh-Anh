/* INITIAL NOTES (100 notes) */
let NOTES = Array.from({ length: 100 }, (_, i) => ({
  number: i + 1,
  text: "",
}));

/* LOCAL STORAGE WITH AUTO‑RESET */
function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("notes_data"));

  // AUTO‑RESET: If old 365-note data exists, wipe it
  if (saved && saved.length !== 100) {
    localStorage.removeItem("notes_data");
    return NOTES;
  }

  return saved || NOTES;
}

function saveNotes(arr) {
  localStorage.setItem("notes_data", JSON.stringify(arr));
}

const loadClicked = () =>
  JSON.parse(localStorage.getItem("clicked_notes")) || [];

const saveClicked = (arr) =>
  localStorage.setItem("clicked_notes", JSON.stringify(arr));

const loadFavorites = () =>
  JSON.parse(localStorage.getItem("favorite_notes")) || [];

const saveFavorites = (arr) =>
  localStorage.setItem("favorite_notes", JSON.stringify(arr));

const loadLastClicked = () =>
  JSON.parse(localStorage.getItem("last_clicked_note")) || null;

const saveLastClicked = (note) =>
  localStorage.setItem("last_clicked_note", JSON.stringify(note));

/* ELEMENTS */
const grid = document.getElementById("notesGrid");
const modal = document.getElementById("noteModal");
const modalNumber = document.getElementById("modalNumber");
const modalEdit = document.getElementById("modalEdit");
const favoriteBtn = document.getElementById("favoriteBtn");
const closeModal = document.getElementById("closeModal");
const lastClickedCard = document.getElementById("lastClickedCard");
const saveEditBtn = document.getElementById("saveEditBtn");

/* PROGRESS BAR */
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

/* UPDATE PROGRESS BAR */
function updateProgress() {
  const clicked = loadClicked();
  const count = clicked.length;

  const percent = (count / 100) * 100;
  progressFill.style.width = `${percent}%`;

  progressText.textContent = `${count} / 100 read`;
}

/* RENDER GRID */
function renderGrid() {
  grid.innerHTML = "";
  const clicked = loadClicked();
  NOTES = loadNotes();

  NOTES.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("note-number");
    div.textContent = note.number;

    if (clicked.includes(note.number)) {
      div.classList.add("clicked");
    }

    div.onclick = () => {
      div.classList.add("animate");
      setTimeout(() => div.classList.remove("animate"), 350);
      openNote(note);
    };

    grid.appendChild(div);
  });

  updateProgress();
}

/* SHOW LAST CLICKED NOTE */
function showLastClicked(note) {
  lastClickedCard.style.display = "block";
  lastClickedCard.innerHTML = `
    <h2>Note #${note.number}</h2>
    <p>${note.text || "(empty note)"}</p>
  `;
}

/* OPEN NOTE */
function openNote(note) {
  modal.style.display = "flex";

  modalNumber.textContent = `Note #${note.number}`;
  modalEdit.value = note.text;

  const clicked = loadClicked();
  if (!clicked.includes(note.number)) {
    clicked.push(note.number);
    saveClicked(clicked);
  }

  saveLastClicked(note);
  showLastClicked(note);
  renderGrid();

  const favorites = loadFavorites();
  favoriteBtn.style.opacity = favorites.includes(note.number) ? "1" : "0.4";

  favoriteBtn.onclick = () => toggleFavorite(note.number);
  saveEditBtn.onclick = () => saveEdit(note.number);
}

/* SAVE EDIT */
function saveEdit(num) {
  NOTES = loadNotes();
  const note = NOTES.find((n) => n.number === num);
  if (!note) return;

  note.text = modalEdit.value;
  saveNotes(NOTES);

  showLastClicked(note);
  modal.style.display = "none";
}

/* FAVORITES */
function toggleFavorite(num) {
  let favorites = loadFavorites();

  if (favorites.includes(num)) {
    favorites = favorites.filter((n) => n !== num);
  } else {
    favorites.push(num);
  }

  saveFavorites(favorites);
  favoriteBtn.style.opacity = favorites.includes(num) ? "1" : "0.4";
}

/* CLOSE MODAL */
closeModal.onclick = () => {
  modal.style.display = "none";
};

/* RESET DIMMED */
document.getElementById("resetBtn").onclick = () => {
  localStorage.setItem("clicked_backup", JSON.stringify(loadClicked()));
  saveClicked([]);
  renderGrid();
};

/* UNDO RESET */
document.getElementById("undoBtn").onclick = () => {
  const backup = JSON.parse(localStorage.getItem("clicked_backup")) || [];
  saveClicked(backup);
  renderGrid();
};

/* DARK MODE */
function applyTheme() {
  const theme = localStorage.getItem("wordle_theme") || "light";
  document.body.className = theme;
}

document.getElementById("themeToggle").onclick = () => {
  const current = localStorage.getItem("wordle_theme") || "light";
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem("wordle_theme", next);
  applyTheme();
};

/* INIT */
applyTheme();
renderGrid();
updateProgress();
