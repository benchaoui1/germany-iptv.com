"use strict";
document.documentElement.classList.add("js");

// ── Scrolled header shadow ──
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile Nav ──
const toggle = document.querySelector(".nav-toggle");
const nav    = document.querySelector(".main-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  });
  document.addEventListener("click", e => {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menü öffnen");
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

// ── Scroll Reveal ──
const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
if (!reduced && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.07 });
  document.querySelectorAll(".reveal,.reveal-left,.reveal-scale").forEach(el => io.observe(el));
} else {
  document.querySelectorAll(".reveal,.reveal-left,.reveal-scale").forEach(el => el.classList.add("in"));
}

// ── Mouse parallax ambient gradient ──
if (!reduced && window.matchMedia("(pointer:fine)").matches) {
  let raf = false;
  window.addEventListener("pointermove", e => {
    if (raf) return; raf = true;
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
      raf = false;
    });
  }, { passive: true });
}

// ── Device frame 3D tilt ──
if (!reduced && window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".device-frame[data-tilt]").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left)  / r.width  - 0.5;
      const y = (e.clientY - r.top)   / r.height - 0.5;
      el.style.transform = `perspective(1100px)rotateY(${x * -10}deg)rotateX(${y * 6}deg)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

// ── Stat counter animation ──
if (!reduced && "IntersectionObserver" in window) {
  const statIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = el.textContent;
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.]/g, "");
        if (!isNaN(num) && num > 0 && num < 100000) {
          let start = 0;
          const dur = 1400;
          const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (num > 100 ? Math.floor(eased * num) : Math.round(eased * num * 10) / 10) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        statIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num").forEach(el => statIO.observe(el));
}

// ── Copy buttons ──
document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const val = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(val);
      const orig = btn.textContent;
      btn.textContent = "✓ Kopiert";
      setTimeout(() => { btn.textContent = orig; }, 1600);
    } catch { btn.textContent = val; }
  });
});

// ── FAQ keyboard ──
document.querySelectorAll(".faq-item summary").forEach(s => {
  s.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      s.parentElement.toggleAttribute("open");
    }
  });
});

// ── Lazy images ──
document.querySelectorAll("img:not([fetchpriority='high'])").forEach(img => {
  if (!img.hasAttribute("loading")) {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  }
});

// ── Stagger children ──
document.querySelectorAll(".stagger-children").forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 85}ms`;
  });
});

// ── Plan hover glow intensity ──
document.querySelectorAll(".plan").forEach(plan => {
  plan.addEventListener("mouseenter", () => {
    plan.querySelector(".plan-glow")?.style.setProperty("opacity", "1.2");
  });
  plan.addEventListener("mouseleave", () => {
    plan.querySelector(".plan-glow")?.style.setProperty("opacity", "");
  });
});
