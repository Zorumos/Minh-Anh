function selectFarm(name) {
  // Smooth transition overlay
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

  // Fade to black
  setTimeout(() => {
    overlay.style.background = "rgba(0,0,0,1)";
  }, 20);

  // Loading GIF
  const img = document.createElement("img");
  img.src = "media/loading screen.gif"; // stays inside farm/media/
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.opacity = "0";
  img.style.transition = "opacity 0.8s ease";

  overlay.appendChild(img);

  setTimeout(() => {
    img.style.opacity = "1";
  }, 600);

  // Redirect based on selection
  setTimeout(() => {
    if (name === "Andrew") {
      window.location.href = "farms/Andrew.html";
    } else {
      window.location.href = "farms/Minh_Anh.html";
    }
  }, 2000);
}

/* Smooth transition back to home */
function goBackHome() {
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

  setTimeout(() => {
    overlay.style.background = "rgba(0,0,0,1)";
  }, 20);

  const img = document.createElement("img");
  img.src = "media/loading screen.gif";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.opacity = "0";
  img.style.transition = "opacity 0.8s ease";

  overlay.appendChild(img);

  setTimeout(() => {
    img.style.opacity = "1";
  }, 600);

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}
