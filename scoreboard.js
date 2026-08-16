async function loadScores() {
  const res = await fetch("https://jsonblob.com/api/jsonBlob/YOUR_BLOB_ID");
  const data = await res.json();

  const scores = document.getElementById("scores");
  scores.innerHTML = `
        <p><strong>${data.name}</strong></p>
        <p>Guesses: ${data.guesses}</p>
        <p>Last Guess: ${data.lastGuess}</p>
        <p>Updated: ${new Date(data.timestamp).toLocaleString()}</p>
    `;
}

loadScores();
