function loadFavorites() {
  return JSON.parse(localStorage.getItem("favorite_notes")) || [];
}

function loadNotes() {
  return JSON.parse(localStorage.getItem("notes_data")) || [];
}

function applyTheme() {
  const theme = localStorage.getItem("wordle_theme") || "light";
  document.body.className = theme;
}

const favList = document.getElementById("favList");

function renderFavorites() {
  const favorites = loadFavorites();
  const notes = loadNotes();

  favList.innerHTML = "";

  favorites.forEach((num) => {
    const note = notes.find((n) => n.number === num);

    const card = document.createElement("div");
    card.classList.add("fav-card");

    card.innerHTML = `
            <h2>Note #${note.number}</h2>
            <p>${note.text}</p>
            <span class="tag">${note.category}</span>
        `;

    favList.appendChild(card);
  });
}

applyTheme();
renderFavorites();
