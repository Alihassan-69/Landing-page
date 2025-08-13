// Theme: prefer stored value -> system -> default dark
(function initTheme() {
  const stored = localStorage.getItem("theme"); // "light" | "dark" | null
  const root = document.documentElement;
  if (stored === "light" || stored === "dark") {
    root.classList.remove("light", "dark");
    root.classList.add(stored);
  } else {
    // fallback to system preference (handled by CSS), but set an explicit class for consistency
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    root.classList.add(prefersLight ? "light" : "dark");
  }
})();

const $ = (s, ctx = document) => ctx.querySelector(s);

// Mobile nav toggle
const navToggle = $("#navToggle");
const primaryNav = $("#primaryNav");
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Close menu when clicking a link (mobile)
  primaryNav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => primaryNav.classList.remove("show"))
  );
}

// Theme toggle
const themeToggle = $("#themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const newTheme = root.classList.contains("light") ? "dark" : "light";
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.innerHTML = newTheme === "dark" ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>';
  });

  // Set correct icon on load
  const isDark = document.documentElement.classList.contains("dark");
  themeToggle.innerHTML = isDark ? '<i class="ri-moon-line"></i>' : '<i class="ri-sun-line"></i>';
}

// Smooth scroll for same-page links (accessibility-friendly)
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  const target = id && id.length > 1 ? document.querySelector(id) : null;
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    setTimeout(() => target.removeAttribute("tabindex"), 1000);
  }
});

// Testimonials carousel (basic)
(function testimonialsCarousel() {
  const track = $("#testimonialTrack");
  const prev = $("#prevTestimonial");
  const next = $("#nextTestimonial");
  if (!track || !prev || !next) return;

  const step = () => track.clientWidth; // one card per viewport
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));

  // Auto-advance every 6s; pause if user is interacting
  let auto = setInterval(() => next.click(), 6000);
  ["mouseenter", "mousedown", "touchstart", "focusin"].forEach(evt =>
    track.addEventListener(evt, () => { clearInterval(auto); auto = null; }, { once: true })
  );
})();

// CTA form (demo only)
const form = document.querySelector(".cta-form");
const email = $("#email");
const note = $("#formNote");
if (form) {
  form.addEventListener("submit", () => {
    if (email.checkValidity()) {
      note.textContent = "Thanks! We’ll reach out soon.";
      email.value = "";
    } else {
      note.textContent = "Please enter a valid email.";
    }
  });
}

// Footer year
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reduce motion respect
if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("*").forEach(el => {
    el.style.scrollBehavior = "auto";
    el.style.transition = "none";
    el.style.animation = "none";
  });
}
