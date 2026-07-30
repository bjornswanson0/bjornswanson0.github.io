(function () {
  "use strict";

  var reduceHero = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Radiating hero lines draw-in
  if (!reduceHero) {
    var heroLines = document.querySelectorAll(".hero-line");
    heroLines.forEach(function (path, i) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len + " " + len;
      path.style.strokeDashoffset = len;
      setTimeout(function () {
        path.style.transition = "stroke-dashoffset " + (1.4 + i * 0.08) + "s cubic-bezier(0.4, 0, 0.2, 1)";
        path.style.strokeDashoffset = "0";
      }, 200 + i * 100);
    });

    // Parallax on scroll
    var heroEl = document.querySelector(".hero");
    var heroLinesEl = document.querySelector(".hero-lines");
    if (heroEl && heroLinesEl) {
      var heroH = heroEl.offsetHeight;
      window.addEventListener("scroll", function () {
        var sy = window.scrollY;
        if (sy < heroH) {
          heroLinesEl.style.transform = "translateY(" + (sy * 0.18).toFixed(1) + "px)";
        }
      }, { passive: true });
    }
  }

  // Letter-by-letter h1 reveal
  var nameEl = document.querySelector(".hero h1");
  if (nameEl && !reduceHero) {
    var charIdx = 0;
    var baseDelay = 0.2;
    var perChar = 0.046;

    function wrapLetters(node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split("").forEach(function (ch) {
          if (/\s/.test(ch)) { frag.appendChild(document.createTextNode(ch)); return; }
          var s = document.createElement("span");
          s.className = "h1-letter";
          s.textContent = ch;
          s.style.animationDelay = (baseDelay + charIdx++ * perChar).toFixed(3) + "s";
          frag.appendChild(s);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== "BR") {
        Array.from(node.childNodes).forEach(wrapLetters);
      }
    }

    Array.from(nameEl.childNodes).forEach(wrapLetters);
  }

  // Word-by-word tagline reveal
  var tagline = document.getElementById("hero-tagline");
  if (tagline && !reduceHero) {
    var words = tagline.textContent.trim().split(/\s+/);
    tagline.innerHTML = words.map(function (w) {
      return '<span class="word-reveal">' + w + " </span>";
    }).join("");
    var spans = tagline.querySelectorAll(".word-reveal");
    spans.forEach(function (span) {
      span.style.opacity = "0";
      span.style.filter = "blur(5px)";
    });
    spans.forEach(function (span, i) {
      setTimeout(function () {
        span.style.opacity = "1";
        span.style.filter = "none";
      }, 700 + i * 75);
    });

  }

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

  // Scroll progress bar + back-to-top button
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.prepend(bar);

  var backBtn = document.createElement("button");
  backBtn.className = "back-to-top";
  backBtn.setAttribute("aria-label", "Back to top");
  backBtn.innerHTML = "&#8593;";
  document.body.appendChild(backBtn);
  backBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  var header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    var ratio = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = "scaleX(" + Math.min(ratio, 1) + ")";
    backBtn.classList.toggle("is-visible", window.scrollY > 420);
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });

  // Nav scroll spy
  var navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  var spySections = Array.from(navLinks).map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if ("IntersectionObserver" in window && spySections.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          var match = document.querySelector('.site-nav a[href="#' + entry.target.id + '"]');
          if (match) match.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -65% 0px" });
    spySections.forEach(function (s) { spyObserver.observe(s); });
  }

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
            // Stagger child cards / list items
            var kids = Array.from(entry.target.querySelectorAll(".project-card, .card, .timeline > li, .quote-list blockquote"));
            kids.forEach(function (el, i) {
              setTimeout(function () { el.classList.add("child-in"); }, i * 90 + 80);
            });
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
