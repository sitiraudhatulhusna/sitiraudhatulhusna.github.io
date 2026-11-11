// ===== Change this to your real email =====
const EMAIL = "you@email.com";

document.documentElement.classList.add("js");

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();

// ----- Mobile menu -----
const toggle = document.querySelector(".nav__toggle");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => setMenu(false))
);

// ----- Reveal on scroll -----
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ----- Toast message -----
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 2200);
}

// ----- Right-click menu on the contact "desktop" -----
const desktop = document.getElementById("desktop");
const menu = document.getElementById("context-menu");

function openMenu(x, y) {
  menu.hidden = false;
  const { width, height } = menu.getBoundingClientRect();
  menu.style.left = Math.min(x, window.innerWidth - width - 8) + "px";
  menu.style.top = Math.min(y, window.innerHeight - height - 8) + "px";
  menu.querySelector("button, a").focus();
}

function closeMenu() {
  menu.hidden = true;
}

desktop.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  openMenu(event.clientX, event.clientY);
});

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("scroll", closeMenu, { passive: true });
window.addEventListener("resize", closeMenu);

menu.addEventListener("click", async (event) => {
  const item = event.target.closest("button, a");
  if (!item) return;
  const action = item.dataset.action;

  if (action === "copy-email") {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast("Email copied!");
    } catch {
      window.location.href = "mailto:" + EMAIL;
    }
  }

  if (action === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  closeMenu();
});
