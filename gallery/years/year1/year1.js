document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.6s ease";

window.onload = () => {
  document.body.style.opacity = "1";
};

function playSong(id) {
  const song = document.getElementById(id);

  document.querySelectorAll("audio").forEach((audio) => {
    if (audio !== song) audio.pause();
  });

  if (!song.paused) song.currentTime = 0;

  song.play();
}
