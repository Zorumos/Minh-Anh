const cards = document.querySelectorAll(".year-card");

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    const target = card.getAttribute("href");

    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.4s ease";

    setTimeout(() => {
      window.location.href = target;
    }, 400);
  });
});
