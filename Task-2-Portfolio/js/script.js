console.log("Portfolio Loaded");

const cards = document.querySelectorAll(
    ".skill-box, .project-card"
);

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.transition = "0.3s";
    });

});