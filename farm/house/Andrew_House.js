/* SHOW / HIDE MUSIC PLAYER */
function toggleMusic() {
  const player = document.getElementById("musicPlayer");
  player.style.display = player.style.display === "none" ? "block" : "none";
}

/* GO OUTSIDE */
function goOutside() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "99999";
  overlay.style.transition = "background 0.6s ease";
  document.body.appendChild(overlay);

  setTimeout(() => (overlay.style.background = "rgba(0,0,0,1)"), 20);

  const img = document.createElement("img");
  img.src = "../media/loading screen.gif";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.opacity = "0";
  img.style.transition = "opacity 0.8s ease";
  overlay.appendChild(img);

  setTimeout(() => (img.style.opacity = "1"), 600);

  setTimeout(() => {
    window.location.href = "../farms/Andrew.html";
  }, 2000);
}

/* GO HOME */
function goHome() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "99999";
  overlay.style.transition = "background 0.6s ease";
  document.body.appendChild(overlay);

  setTimeout(() => (overlay.style.background = "rgba(0,0,0,1)"), 20);

  const img = document.createElement("img");
  img.src = "../media/loading screen.gif";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.opacity = "0";
  img.style.transition = "opacity 0.8s ease";
  overlay.appendChild(img);

  setTimeout(() => (img.style.opacity = "1"), 600);

  setTimeout(() => {
    window.location.href = "../../index.html";
  }, 2000);
}
