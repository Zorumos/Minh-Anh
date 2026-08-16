function goTo(page) {
  window.location.href = page;
}

// Example of saving progress globally
function saveProgress(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadProgress(key) {
  return JSON.parse(localStorage.getItem(key));
}
