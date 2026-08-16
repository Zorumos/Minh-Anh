function enterHouse() {
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
  img.src = "../media/loading screen.gif";
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
    window.location.href = "../house/inside.html";
  }, 2000);
}

function goBack() {
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
  img.src = "../media/loading screen.gif";
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
    window.location.href = "../farm.html";
  }, 2000);
}
