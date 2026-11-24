console.log("Landing Page Loaded");

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
});

// Link click ke baad menu band ho jaye
menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
    });
});

/* ---------- Fade-in on scroll ---------- */
const revealItems = document.querySelectorAll(".card, section h2, #about p, #testimonials p");
revealItems.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach((el) => observer.observe(el));
} else {
    revealItems.forEach((el) => el.classList.add("visible"));
}

/* ---------- Contact form validation ---------- */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    status.className = "";
    if (!name || !email || !message) {
        status.textContent = "Please fill in all the fields.";
        status.classList.add("error");
    } else if (!emailOk) {
        status.textContent = "Please enter a valid email address.";
        status.classList.add("error");
    } else {
        status.textContent = "Thanks " + name + "! Your message has been sent.";
        status.classList.add("success");
        form.reset();
    }
});