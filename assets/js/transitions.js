/* Sainagesh Veeravalli — Portfolio
   Cross-page 3D transition engine. The veil's entry reveal is pure CSS
   (see .page-veil in style.css) so it works even if this script fails;
   this file only drives the exit: intercept internal navigation, play the
   fold-in animation, then navigate. */
(function () {
  "use strict";

  var EXIT_MS = 690; // veilClose (.45s) + longest stagger (.2s) + small buffer

  /* bfcache restore (back/forward): clear the exit state so the page
     isn't stuck behind a closed veil. */
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.documentElement.classList.remove("is-exiting");
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

    var html = document.documentElement;
    if (html.classList.contains("is-exiting")) return;       // already leaving
    html.classList.add("is-exiting");

    setTimeout(function () {
      window.location.href = url.href;
    }, EXIT_MS);
  });
})();
