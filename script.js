(function () {
  "use strict";

  // Animated radiating hero lines
  var reduceHero = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

    // Blinking cursor after reveal completes
    var cursor = document.createElement("span");
    cursor.className = "tagline-cursor";
    cursor.textContent = "|";
    tagline.appendChild(cursor);
    var cursorStart = 700 + words.length * 75 + 100;
    setTimeout(function () {
      cursor.style.animation = "none";
      cursor.style.transition = "opacity 0.55s ease";
      cursor.style.opacity = "0";
      setTimeout(function () { cursor.remove(); }, 650);
    }, cursorStart + 1900);
  }

  // Character scramble on hero h1
  var heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !reduceHero) {
    var SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz";

    function scrambleLine(container, text, startDelay) {
      var letters = text.split("");
      container.innerHTML = letters.map(function (c) {
        return '<span class="hc">' + (/[a-zA-Z]/.test(c) ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] : c) + "</span>";
      }).join("");
      Array.from(container.querySelectorAll(".hc")).forEach(function (span, i) {
        var target = letters[i];
        if (!/[a-zA-Z]/.test(target)) return;
        var timer;
        setTimeout(function () {
          timer = setInterval(function () {
            span.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }, 36);
          setTimeout(function () {
            clearInterval(timer);
            span.textContent = target;
          }, 260);
        }, startDelay + i * 55);
      });
    }

    var firstTextNode = heroH1.firstChild;
    if (firstTextNode && firstTextNode.nodeType === 3) {
      var line1 = document.createElement("span");
      line1.className = "h1-line1";
      firstTextNode.replaceWith(line1);
      scrambleLine(line1, "Bjorn", 420);
    }
    var h1Muted = heroH1.querySelector(".h1-muted");
    if (h1Muted) {
      var line2 = document.createElement("span");
      h1Muted.textContent = "";
      h1Muted.appendChild(line2);
      scrambleLine(line2, "Swanson.", 580);
    }
  }

  // Hero cursor spotlight
  var heroEl = document.querySelector(".hero");
  if (heroEl && !reduceHero) {
    heroEl.addEventListener("mousemove", function (e) {
      var rect = heroEl.getBoundingClientRect();
      heroEl.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + "%");
      heroEl.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + "%");
      heroEl.classList.add("spotlight-on");
    }, { passive: true });
    heroEl.addEventListener("mouseleave", function () {
      heroEl.classList.remove("spotlight-on");
    });
  }

  // Hero lines parallax on scroll
  var heroLinesEl = document.querySelector(".hero-lines");
  if (heroEl && heroLinesEl && !reduceHero) {
    var heroH = heroEl.offsetHeight;
    window.addEventListener("scroll", function () {
      var sy = window.scrollY;
      if (sy < heroH) {
        heroLinesEl.style.transform = "translateY(" + (sy * 0.18).toFixed(1) + "px)";
      }
    }, { passive: true });
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
            var kids = Array.from(entry.target.querySelectorAll(".project-card, .card, .timeline-ol > li"));
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
