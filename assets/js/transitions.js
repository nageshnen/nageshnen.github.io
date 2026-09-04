/* Sainagesh Veeravalli — Portfolio
   Gentle cross-fade between pages: intercept qualifying internal navigation,
   fade the page out, then go. Entry fade-up is pure CSS (see @keyframes pageIn
   in style.css) so it works even if this script fails. */
(function () {
  "use strict";

  var EXIT_MS = 200; // keep in sync with body.is-leaving transition in style.css

  /* bfcache restore (back/forward): clear the leaving state */
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.remove("is-leaving");
  });

  document.addEventListener("click", function (e) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest && e.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;           // in-page anchor
    if (link.target && link.target !== "_self") return;    // new tab/window
    if (link.hasAttribute("download")) return;

    var url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;      // external
    if (url.pathname === window.location.pathname && url.hash) return; // same-page hash
    if (/\.pdf$/i.test(url.pathname)) return;                // document, not a page

    e.preventDefault();

    if (document.body.classList.contains("is-leaving")) return;
    document.body.classList.add("is-leaving");

    setTimeout(function () {
      window.location.href = url.href;
    }, EXIT_MS);
  });
})();
