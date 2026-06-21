(function () {
  "use strict";

  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const metricNumbers = [...document.querySelectorAll(".metric-number")];
  const year = document.querySelector("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      navToggle.innerHTML = isOpen ? '<i class="bi bi-x"></i>' : '<i class="bi bi-list"></i>';
    });

    nav.addEventListener("click", (event) => {
      const clickedLink = event.target.closest("a");
      if (!clickedLink) return;
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      navToggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const animateNumber = (element) => {
    const target = Number(element.dataset.count || 0);
    const hasDecimal = !Number.isInteger(target);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      element.textContent = hasDecimal ? current.toFixed(1) : Math.round(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = hasDecimal ? target.toFixed(1) : String(target);
      }
    };

    requestAnimationFrame(tick);
  };

  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        metricObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricNumbers.forEach((metric) => metricObserver.observe(metric));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, {
    rootMargin: "-38% 0px -52% 0px",
    threshold: 0
  });

  navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean)
    .forEach((section) => sectionObserver.observe(section));
})();
