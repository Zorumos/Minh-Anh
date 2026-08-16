document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease";

window.onload = () => {
  document.body.style.opacity = "1";
  loadAchievements();
};

function loadAchievements() {
  const container = document.getElementById("achList");
  const days = JSON.parse(localStorage.getItem("wordle_history")) || [];

  if (days.length === 0) {
    container.innerHTML = `<p>No achievements yet — play today's Wordle!</p>`;
    return;
  }

  const andrewScores = days.map((d) => Number(d.andrew));
  const minhScores = days.map((d) => Number(d.minh));

  const achievements = [];

  // Perfect Guess
  if (andrewScores.includes(1) || minhScores.includes(1)) {
    achievements.push({
      title: "Perfect Guess",
      desc: "Someone guessed the word in 1 try!",
    });
  }

  // Under 3 Club
  if (andrewScores.some((s) => s <= 2) || minhScores.some((s) => s <= 2)) {
    achievements.push({
      title: "Under 3 Club",
      desc: "A player solved the Wordle in 2 guesses or less.",
    });
  }

  // Streaks
  const streaks = computeStreaks(days);
  if (streaks >= 3) {
    achievements.push({
      title: "3‑Streak",
      desc: "Three wins in a row!",
    });
  }
  if (streaks >= 5) {
    achievements.push({
      title: "5‑Streak",
      desc: "Five wins in a row!",
    });
  }

  // Head-to-head wins
  const andrewWins = days.filter((d) => d.andrew < d.minh).length;
  const minhWins = days.filter((d) => d.minh < d.andrew).length;

  if (andrewWins > minhWins) {
    achievements.push({
      title: "Andrew Leads",
      desc: "Andrew has more head‑to‑head wins.",
    });
  } else if (minhWins > andrewWins) {
    achievements.push({
      title: "Minh Anh Leads",
      desc: "Minh Anh has more head‑to‑head wins.",
    });
  } else {
    achievements.push({
      title: "Tie Master",
      desc: "Both players are evenly matched.",
    });
  }

  // Games played milestones
  if (days.length >= 10) {
    achievements.push({
      title: "10 Games Played",
      desc: "You've played 10 Wordle games!",
    });
  }
  if (days.length >= 25) {
    achievements.push({
      title: "25 Games Played",
      desc: "You've played 25 Wordle games!",
    });
  }
  if (days.length >= 50) {
    achievements.push({
      title: "50 Games Played",
      desc: "You've played 50 Wordle games!",
    });
  }

  // Render achievements
  achievements.forEach((a) => {
    const div = document.createElement("div");
    div.classList.add("badge");

    div.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
    `;

    container.appendChild(div);
  });
}

function computeStreaks(days) {
  let streak = 0;
  let bestStreak = 0;

  days.forEach((d) => {
    const winner =
      d.andrew < d.minh ? "andrew" : d.minh < d.andrew ? "minh" : "tie";

    if (winner !== "tie") {
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
    }
  });

  return bestStreak;
}
