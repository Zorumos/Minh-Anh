document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease";

window.onload = () => {
  document.body.style.opacity = "1";
  loadCompare();
};

function loadCompare() {
  const days = JSON.parse(localStorage.getItem("wordle_history")) || [];
  const statsDiv = document.getElementById("compareStats");
  const table = document.getElementById("compareTable");

  if (days.length === 0) {
    statsDiv.innerHTML = `<p>No comparison data yet.</p>`;
    return;
  }

  // Compute stats
  const andrewAvg = avg(days.map((d) => d.andrew));
  const minhAvg = avg(days.map((d) => d.minh));

  const andrewBest = Math.min(...days.map((d) => d.andrew));
  const minhBest = Math.min(...days.map((d) => d.minh));

  const andrewWins = days.filter((d) => d.andrew < d.minh).length;
  const minhWins = days.filter((d) => d.minh < d.andrew).length;
  const ties = days.filter((d) => d.andrew === d.minh).length;

  // Winner
  let winner = "Tie";
  if (andrewWins > minhWins) winner = "Andrew";
  if (minhWins > andrewWins) winner = "Minh Anh";

  // Stats cards
  statsDiv.innerHTML = `
    <div class="stat-card">
      <h3>Andrew's Average Guesses</h3>
      <p>${andrewAvg.toFixed(2)}</p>
    </div>

    <div class="stat-card">
      <h3>Minh Anh's Average Guesses</h3>
      <p>${minhAvg.toFixed(2)}</p>
    </div>

    <div class="stat-card">
      <h3>Andrew's Best Score</h3>
      <p>${andrewBest} guesses</p>
    </div>

    <div class="stat-card">
      <h3>Minh Anh's Best Score</h3>
      <p>${minhBest} guesses</p>
    </div>

    <div class="stat-card">
      <h3>Head‑to‑Head Wins</h3>
      <p>Andrew: ${andrewWins}</p>
      <p>Minh Anh: ${minhWins}</p>
      <p>Ties: ${ties}</p>
    </div>

    <div class="stat-card">
      <h3>Overall Winner</h3>
      <p>${winner}</p>
    </div>
  `;

  // Comparison table
  table.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Word</th>
      <th>Andrew</th>
      <th>Minh Anh</th>
      <th>Winner</th>
    </tr>
  `;

  days.forEach((d) => {
    const winner =
      d.andrew < d.minh ? "Andrew" : d.minh < d.andrew ? "Minh Anh" : "Tie";

    table.innerHTML += `
      <tr>
        <td>${d.date}</td>
        <td>${d.word}</td>
        <td>${d.andrew}</td>
        <td>${d.minh}</td>
        <td>${winner}</td>
      </tr>
    `;
  });
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
