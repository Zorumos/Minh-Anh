document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease";

window.onload = () => {
  document.body.style.opacity = "1";

  // Load saved theme
  const saved = localStorage.getItem("theme");
  if (saved) document.body.className = saved;
};

function toggleTheme() {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  const next = current === "light" ? "dark" : "light";

  document.body.className = next;
  localStorage.setItem("theme", next);
}
function goToFarm() {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "99999";
  overlay.style.transition = "background 0.6s ease";

  document.body.appendChild(overlay);

  // Fade to black
  setTimeout(() => {
    overlay.style.background = "rgba(0,0,0,1)";
  }, 20);

  // Fullscreen GIF
  const img = document.createElement("img");
  img.src = "farm/media/loading screen.gif";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover"; // FULLSCREEN, NO SHRINK
  img.style.opacity = "0";
  img.style.transition = "opacity 0.8s ease";

  overlay.appendChild(img);

  // Progress bar container
  const barContainer = document.createElement("div");
  barContainer.style.width = "60%";
  barContainer.style.maxWidth = "400px";
  barContainer.style.height = "14px";
  barContainer.style.borderRadius = "10px";
  barContainer.style.background = "#333";
  barContainer.style.marginTop = "20px";
  barContainer.style.overflow = "hidden";
  barContainer.style.opacity = "0";
  barContainer.style.transition = "opacity 0.8s ease";

  overlay.appendChild(barContainer);

  // Progress bar fill
  const barFill = document.createElement("div");
  barFill.style.height = "100%";
  barFill.style.width = "0%";
  barFill.style.background = "#6aaa64";
  barFill.style.transition = "width 1.8s ease";

  barContainer.appendChild(barFill);

  // Animate GIF + progress bar after fade
  setTimeout(() => {
    img.style.opacity = "1";
    barContainer.style.opacity = "1";
    barFill.style.width = "100%";
  }, 600);

  // Redirect after animation
  setTimeout(() => {
    window.location.href = "farm/farm.html";
  }, 2600);
}
