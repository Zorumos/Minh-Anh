/* -----------------------------------------
   GLOBALS
----------------------------------------- */
const ROWS = 6;
const COLS = 5;

let currentRow = 0;
let currentCol = 0;
let gameOver = false;

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(""));

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

/* -----------------------------------------
   PLAYER
----------------------------------------- */
let player = localStorage.getItem("wordle_player");
if (!player) window.location.href = "../index.html";

document.getElementById("playerDisplay").textContent = `Playing as: ${player}`;

/* -----------------------------------------
   DAILY WORD
----------------------------------------- */
let answer = loadTodayWord().toLowerCase();

/* -----------------------------------------
   TODAY KEY
----------------------------------------- */
const TODAY = new Date().toDateString();
const TODAY_KEY = `wordle_guesses_${player}_${TODAY}`;
const OTHER_KEY =
  player === "Andrew"
    ? `wordle_guesses_Minh Anh_${TODAY}`
    : `wordle_guesses_Andrew_${TODAY}`;

/* -----------------------------------------
   THEME
----------------------------------------- */
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

/* -----------------------------------------
   BOARD
----------------------------------------- */
function initBoard() {
  board.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.row = r;
      tile.dataset.col = c;
      board.appendChild(tile);
    }
  }
}

/* -----------------------------------------
   KEYBOARD
----------------------------------------- */
const KEY_LAYOUT = [..."QWERTYUIOP", ..."ASDFGHJKL", ..."ZXCVBNM"];

function initKeyboard() {
  keyboard.innerHTML = "";

  KEY_LAYOUT.forEach((letter) => {
    const key = document.createElement("button");
    key.classList.add("key");
    key.textContent = letter;
    key.dataset.key = letter;
    key.onclick = () => handleKey(letter);
    keyboard.appendChild(key);
  });

  const enterKey = document.createElement("button");
  enterKey.classList.add("key");
  enterKey.textContent = "ENTER";
  enterKey.onclick = handleEnter;
  keyboard.appendChild(enterKey);

  const backKey = document.createElement("button");
  backKey.classList.add("key");
  backKey.textContent = "⌫";
  backKey.onclick = handleBackspace;
  keyboard.appendChild(backKey);
}

/* -----------------------------------------
   BOARD UPDATE
----------------------------------------- */
function updateBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tile = document.querySelector(
        `.tile[data-row="${r}"][data-col="${c}"]`,
      );
      tile.textContent = grid[r][c];
    }
  }
}

/* -----------------------------------------
   INPUT
----------------------------------------- */
function handleKey(letter) {
  if (gameOver) return;
  if (currentCol >= COLS) return;

  grid[currentRow][currentCol] = letter.toUpperCase();
  currentCol++;
  updateBoard();
}

function handleBackspace() {
  if (gameOver) return;
  if (currentCol === 0) return;

  currentCol--;
  grid[currentRow][currentCol] = "";
  updateBoard();
}

function handleEnter() {
  if (gameOver) return;

  if (currentCol < COLS) {
    showMessage("Not enough letters");
    shakeRow(currentRow);
    return;
  }

  const guessUpper = grid[currentRow].join("");
  const guessLower = guessUpper.toLowerCase();

  if (!isValidWord(guessLower)) {
    showMessage("Not in word list");
    shakeRow(currentRow);
    return;
  }

  revealRow(currentRow, guessLower, guessUpper);

  if (guessLower !== answer) {
    shakeRow(currentRow);
  }

  saveTodayGuess(guessUpper);

  if (guessLower === answer) {
    finishGame("win", currentRow + 1);
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === ROWS) {
    finishGame("lose", ROWS);
  }
}

/* -----------------------------------------
   VALIDATION
----------------------------------------- */
function isValidWord(word) {
  return WORD_LIST.includes(word.toLowerCase());
}

/* -----------------------------------------
   ANIMATIONS + COLORING
----------------------------------------- */
function shakeRow(row) {
  for (let c = 0; c < COLS; c++) {
    const tile = document.querySelector(
      `.tile[data-row="${row}"][data-col="${c}"]`,
    );
    tile.classList.add("shake");
    setTimeout(() => tile.classList.remove("shake"), 600);
  }
}

function revealRow(row, guessLower, guessUpper) {
  const answerArr = answer.split("");
  const guessArr = guessLower.split("");
  const keyboardGuessArr = guessUpper.split("");

  const result = Array(COLS).fill("absent");

  // Correct positions
  for (let i = 0; i < COLS; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      answerArr[i] = null;
    }
  }

  // Present letters
  for (let i = 0; i < COLS; i++) {
    if (result[i] === "correct") continue;
    const idx = answerArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = "present";
      answerArr[idx] = null;
    }
  }

  // Apply tile + keyboard colors
  for (let i = 0; i < COLS; i++) {
    const tile = document.querySelector(
      `.tile[data-row="${row}"][data-col="${i}"]`,
    );
    tile.classList.add("flip");

    setTimeout(() => {
      tile.classList.add(result[i]);
      tile.classList.add("bounce");
    }, i * 150);

    const key = document.querySelector(
      `.key[data-key="${keyboardGuessArr[i]}"]`,
    );
    if (key) {
      if (result[i] === "correct") key.classList.add("correct");
      else if (result[i] === "present" && !key.classList.contains("correct"))
        key.classList.add("present");
      else if (
        result[i] === "absent" &&
        !key.classList.contains("correct") &&
        !key.classList.contains("present")
      )
        key.classList.add("absent");
    }
  }
}

/* -----------------------------------------
   MESSAGES
----------------------------------------- */
function showMessage(msg) {
  messageEl.textContent = msg;
  setTimeout(() => {
    messageEl.textContent = "";
  }, 1500);
}

/* -----------------------------------------
   CONFETTI
----------------------------------------- */
let confettiPieces = [];

function launchConfetti() {
  confettiPieces = [];

  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 8 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 3 + 2,
    });
  }

  animateConfetti();
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((p) => {
    p.y += p.speed;
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(p.x, p.y, p.size, p.size);
  });

  requestAnimationFrame(animateConfetti);
}

/* -----------------------------------------
   SAVE TODAY'S GUESSES (PER-DAY STORAGE)
----------------------------------------- */
function saveTodayGuess(guess) {
  const guesses = JSON.parse(localStorage.getItem(TODAY_KEY)) || [];
  guesses.push(guess);
  localStorage.setItem(TODAY_KEY, JSON.stringify(guesses));
}

/* -----------------------------------------
   GAME FINISH
----------------------------------------- */
function finishGame(result, turns) {
  gameOver = true;

  localStorage.setItem(`wordle_result_${player}`, result);
  localStorage.setItem(`wordle_turns_${player}`, turns);

  if (result === "win") launchConfetti();

  showResultsModal(result);
}

/* -----------------------------------------
   RESULTS MODAL
----------------------------------------- */
function showResultsModal(result) {
  const todayGuesses = JSON.parse(localStorage.getItem(TODAY_KEY)) || [];

  const otherGuesses = JSON.parse(localStorage.getItem(OTHER_KEY)) || null;

  const yourTurns = localStorage.getItem(`wordle_turns_${player}`);
  const yourResult = localStorage.getItem(`wordle_result_${player}`);
  const otherTurns = localStorage.getItem(
    `wordle_turns_${player === "Andrew" ? "Minh Anh" : "Andrew"}`,
  );
  const otherResult = localStorage.getItem(
    `wordle_result_${player === "Andrew" ? "Minh Anh" : "Andrew"}`,
  );

  let text = "";

  text += `${player} ${
    yourResult === "win" ? "solved it" : "failed"
  } in ${yourTurns} turns.\n\n`;

  text += `Your guesses today:\n${todayGuesses.join("\n")}\n\n`;

  if (result === "lose") {
    text += `Correct word: ${answer.toUpperCase()}\n\n`;
  }

  if (!otherGuesses) {
    text += `${player === "Andrew" ? "Minh Anh" : "Andrew"} has not played yet.\n`;
  } else {
    text += `${player === "Andrew" ? "Minh Anh" : "Andrew"} ${
      otherResult === "win" ? "solved it" : "failed"
    } in ${otherTurns} turns.\n\n`;

    text += `${player === "Andrew" ? "Minh Anh" : "Andrew"}'s guesses today:\n${otherGuesses.join("\n")}\n`;

    if (otherResult === "lose") {
      text += `Correct word: ${answer.toUpperCase()}\n`;
    }
  }

  document.getElementById("resultsText").textContent = text;
  document.getElementById("resultsModal").style.display = "flex";
}

function closeResults() {
  document.getElementById("resultsModal").style.display = "none";
}

/* -----------------------------------------
   KEYBOARD EVENTS
----------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleEnter();
  else if (e.key === "Backspace") handleBackspace();
  else {
    const letter = e.key.toUpperCase();
    if (letter >= "A" && letter <= "Z") handleKey(letter);
  }
});

/* -----------------------------------------
   INIT
----------------------------------------- */
applyTheme();
initBoard();
initKeyboard();
updateBoard();
showMessage("Daily word loaded.");
