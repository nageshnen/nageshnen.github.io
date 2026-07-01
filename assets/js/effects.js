/* Sainagesh Veeravalli — Portfolio
   Interaction effects: 3D flip cards (all devices), plus custom cursor,
   magnetic buttons, and 3D tilt cards — the latter three are skipped on
   touch devices and when the user prefers reduced motion. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initFlipCards();

    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canHover || reduceMotion) return;

    initCustomCursor();
    initMagnetic();
    initTilt();
  });

  function initFlipCards() {
    var cards = document.querySelectorAll(".project-card");
    cards.forEach(function (card) {
      card.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest("a")) return;
        card.classList.toggle("flipped");
      });
      card.addEventListener("keydown", function (e) {
        if (e.target.closest && e.target.closest("a")) return;
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          card.classList.toggle("flipped");
        }
      });
    });
  }

  function initCustomCursor() {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add("custom-cursor");

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    var visible = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
      if (!visible) {
        dot.style.opacity = "1";
        ring.style.opacity = "0.55";
        visible = true;
      }
    });
    document.addEventListener("mouseleave", function () {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      visible = false;
    });

    function raf() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
      requestAnimationFrame(raf);
    }
    raf();

    var hoverSelector = "a, button, .btn, .project-card, .icon-card, .cert-card, .edu-card, .about-photo-frame, .tag, .tag-pill";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) ring.classList.add("hovered");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) ring.classList.remove("hovered");
    });
  }

  function initMagnetic() {
    var els = document.querySelectorAll(".btn");
    els.forEach(function (el) {
      el.classList.add("magnetic");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + (x * 0.25).toFixed(1) + "px," + (y * 0.35).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  function initTilt() {
    var cards = document.querySelectorAll(".icon-card, .cert-card, .edu-card, .about-photo-frame");
    cards.forEach(function (card) {
      card.classList.add("tilt");
      var glare = document.createElement("div");
      glare.className = "tilt-glare";
      card.appendChild(glare);

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 9;
        var ry = (px - 0.5) * 11;
        card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateZ(2px)";
        glare.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        glare.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }
})();
