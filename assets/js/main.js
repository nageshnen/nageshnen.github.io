/* Sainagesh Veeravalli — Portfolio main script */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* Sticky header shadow/background on scroll */
    var header = document.getElementById("header");
    var progressBar = document.getElementById("scroll-progress");
    function onScroll() {
      if (header) {
        if (window.scrollY > 12) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }

      var backToTop = document.querySelector(".back-to-top");
      if (backToTop) {
        if (window.scrollY > 400) backToTop.classList.add("show");
        else backToTop.classList.remove("show");
      }

      if (progressBar) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progressBar.style.width = pct + "%";
      }
    }
    window.addEventListener("scroll", onScroll);
    onScroll();

    /* Mobile nav toggle */
    var toggle = document.querySelector(".mobile-nav-toggle");
    var navbar = document.getElementById("navbar");
    if (toggle && navbar) {
      toggle.addEventListener("click", function () {
        navbar.classList.toggle("open");
        toggle.classList.toggle("bi-list");
        toggle.classList.toggle("bi-x-lg");
      });
      navbar.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          navbar.classList.remove("open");
        });
      });
    }

    /* Active nav link based on current page */
    var path = window.location.pathname.split("/").pop() || "index.html";
    var isHome = path === "index.html" || path === "";
    document.querySelectorAll("#navbar a").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var linkPage = href.split("#")[0] || "index.html";
      var isHashLink = href.indexOf("#") !== -1 && linkPage === "index.html";
      if (!isHome && linkPage === path) {
        link.classList.add("active");
      } else if (isHome && linkPage === "index.html" && !isHashLink) {
        link.classList.add("active");
      }
    });

    /* Scrollspy: swap Home <-> About active state as the About section enters view */
    if (isHome) {
      var aboutSection = document.getElementById("about");
      var homeLink = document.querySelector('#navbar a[href="index.html"]');
      var aboutLink = document.querySelector('#navbar a[href="index.html#about"]');
      if (aboutSection && homeLink && aboutLink && window.IntersectionObserver) {
        var spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              homeLink.classList.remove("active");
              aboutLink.classList.add("active");
            } else if (entry.boundingClientRect.top > 0) {
              aboutLink.classList.remove("active");
              homeLink.classList.add("active");
            }
          });
        }, { rootMargin: "-90px 0px -70% 0px", threshold: 0 });
        spy.observe(aboutSection);
      }
    }

    /* Smooth scroll for in-page anchors */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length > 1) {
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (target.hasAttribute("tabindex")) {
              target.focus({ preventScroll: true });
            }
          }
        }
      });
    });

    /* AOS init */
    if (window.AOS) {
      window.AOS.init({
        duration: 600,
        easing: "ease-out-cubic",
        once: true,
        offset: 40
      });
    }

    /* Project category filter (projects page) */
    var filterBar = document.querySelector(".filter-bar");
    if (filterBar) {
      var filterBtns = filterBar.querySelectorAll(".filter-btn");
      var filterCards = document.querySelectorAll(".project-grid .project-card");
      filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          filterBtns.forEach(function (b) {
            b.classList.toggle("active", b === btn);
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          var filter = btn.getAttribute("data-filter");
          filterCards.forEach(function (card) {
            var match = filter === "all" || card.getAttribute("data-category") === filter;
            if (match) {
              card.classList.remove("filtered-hidden");
              /* double rAF: let display:none clear before animating back in */
              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  card.classList.remove("filtered-out");
                });
              });
            } else {
              card.classList.add("filtered-out");
              setTimeout(function () {
                if (card.classList.contains("filtered-out")) {
                  card.classList.add("filtered-hidden");
                }
              }, 300);
            }
          });
          /* grid reflow moves cards into view without a scroll event, so
             AOS-revealed cards would stay invisible — recalc after settle */
          setTimeout(function () {
            if (window.AOS) window.AOS.refresh();
          }, 340);
        });
      });
    }

    /* Animated skill bars (resume page) */
    var skillFills = document.querySelectorAll(".skillbar-fill");
    if (skillFills.length) {
      if (window.IntersectionObserver) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              el.style.width = (el.getAttribute("data-percent") || 0) + "%";
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.4 });
        skillFills.forEach(function (el) { observer.observe(el); });
      } else {
        skillFills.forEach(function (el) {
          el.style.width = (el.getAttribute("data-percent") || 0) + "%";
        });
      }
    }

  });
})();
