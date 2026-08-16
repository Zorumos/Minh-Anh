// dailyWord.js
// Daily Wordle word generator (12:00 AM EST)

function getDailyWord() {
  const EST_OFFSET = -5; // EST = UTC-5
  const now = new Date();

  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const estDate = new Date(utc + 3600000 * EST_OFFSET);

  const startDate = new Date("2024-01-01T00:00:00-05:00");

  const diffTime = estDate - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const index = diffDays % WORD_LIST.length;

  return WORD_LIST[index].toLowerCase();
}

function loadTodayWord() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("today_date");
  const savedWord = localStorage.getItem("today_word");

  if (savedWord && savedDate === today) {
    return savedWord.toLowerCase();
  }

  const newWord = getDailyWord().toLowerCase();
  localStorage.setItem("today_word", newWord);
  localStorage.setItem("today_date", today);

  return newWord;
}
