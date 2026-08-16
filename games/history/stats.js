document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease";

window.onload = () => {
  document.body.style.opacity = "1";
  loadStats();
};

function loadStats() {
  const container = document.getElementById("statsCards");
  const days = JSON.parse(localStorage.getItem("wordle_history")) || [];

  if (days.length === 0) {
    container.innerHTML = `
      <p style="opacity:0.7; font-size:1.1rem;">
        No stats yet — play today's Wordle!
      </p>
    `;
    return;
  }

  // Convert values to numbers safely
  const andrewScores = days.map((d) => Number(d.andrew));
  const minhScores = days.map((d) => Number(d.minh));

  // Compute stats safely
  const totalGames = days.length;
  const avgAndrew = average(andrewScores);
  const avgMinh = average(minhScores);

  const bestAndrew = Math.min(...andrewScores);
  const bestMinh = Math.min(...minhScores);

  const worstAndrew = Math.max(...andrewScores);
  const worstMinh = Math.max(...minhScores);

  container.innerHTML = `
    <div class="stat-card">
      <h3>Total Games Played</h3>
      <p>${totalGames}</p>
    </div>

    <div class="stat-card">
      <h3>Andrew's Average Guesses</h3>
      <p>${avgAndrew.toFixed(2)}</p>
    </div>

    <div class="stat-card">
      <h3>Minh Anh's Average Guesses</h3>
      <p>${avgMinh.toFixed(2)}</p>
    </div>

    <div class="stat-card">
      <h3>Andrew's Best Score</h3>
      <p>${bestAndrew} guesses</p>
    </div>

    <div class="stat-card">
      <h3>Minh Anh's Best Score</h3>
      <p>${bestMinh} guesses</p>
    </div>

    <div class="stat-card">
      <h3>Andrew's Worst Score</h3>
      <p>${worstAndrew} guesses</p>
    </div>

    <div class="stat-card">
      <h3>Minh Anh's Worst Score</h3>
      <p>${worstMinh} guesses</p>
    </div>
  `;
}

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
