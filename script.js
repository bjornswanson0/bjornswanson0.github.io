(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Scroll progress bar
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.prepend(bar);
  window.addEventListener("scroll", function () {
    var ratio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = "scaleX(" + Math.min(ratio, 1) + ")";
  }, { passive: true });

  // Gentle reveal-on-scroll for sections (skipped for reduced motion)
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var sections = document.querySelectorAll(".section");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach(function (s) {
      s.classList.add("reveal");
      observer.observe(s);
    });
  }
})();
