# Light / Minimal / Lavender Redesign — Design

## Goal

Rework the portfolio site (`index.html`, `projects.html`, `resume.html`) from the
dark "Ember" theme with three.js and 3D page transitions into a clean, minimal,
light design with a restrained lavender accent and only subtle motion.

## Scope

**In:** `assets/css/style.css`, `index.html`, `projects.html`, `resume.html`,
`assets/js/transitions.js`, `assets/js/effects.js`, `assets/js/hero-scene.js`,
`assets/js/main.js`. Delete stale template pages and vendor folders they alone use.

**Out:** content/copy rewrites, new pages, resume PDF, adding a build step or
framework, a dark-mode toggle.

## Design system

### Colour tokens (replace the dark palette in `:root`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#fbfbfd` | page background |
| `--bg-soft` | `#f4f3f8` | alternating sections, footer, CTA |
| `--surface` | `#ffffff` | cards |
| `--surface-2` | `#f7f6fb` | insets, tracks |
| `--border` | `#e6e4ee` | card borders |
| `--border-soft` | `#eeedf4` | hairline dividers |
| `--text` | `#1c1b22` | headings |
| `--text-soft` | `#45434f` | body |
| `--text-mute` | `#8a8797` | meta, eyebrows |
| `--accent` | `#7c6cf0` | lavender accent |
| `--accent-strong` | `#5d4fd0` | accent hover / active |
| `--accent-soft` | `rgba(124,108,240,0.10)` | tint wells, active nav, chips |
| `--shadow` | `0 10px 30px -14px rgba(28,27,34,0.12)` | card rest |
| `--shadow-sm` | `0 4px 14px -8px rgba(28,27,34,0.12)` | small |

- Remove `--grad`, `--glow`, `--paper*`, ember `--accent-2*`. Any `var(--grad)`
  fill becomes flat `var(--accent)`; any gradient-clipped text becomes
  `var(--text-mute)` uppercase (eyebrows) or `var(--accent)` (inline emphasis).
- `::selection` → `var(--accent-soft)` background, `var(--text)` text.
- Fonts unchanged (Inter body, Space Grotesk headings). Reduce oversized
  `letter-spacing` on eyebrows/labels to `0.14em`.
- `--radius` 14px, `--radius-sm` 10px (unchanged-ish).

### Motion

- **Page transitions:** delete `.page-veil` markup from all three pages and the
  veil / `pageEnter` / `pageExit` / `veil*` keyframes from CSS. Rewrite
  `transitions.js` as a cross-fade: on qualifying internal link click,
  `document.body` gets `.is-leaving` (opacity → 0, `translateY(6px)`, ~200ms),
  then navigate; on load, `main` fades up from `opacity:0 / translateY(8px)` over
  ~450ms via a CSS `@keyframes pageIn`. All gated behind
  `prefers-reduced-motion: reduce` (no transform, instant).
- **Hero:** remove `<canvas id="hero-canvas">`, the three.js CDN `<script>`, and
  the `hero-scene.js` `<script>` from `index.html`; delete `hero-scene.js`.
  `#hero` becomes a normal light section (`min-height` ~88vh, content left-aligned)
  with one faint `radial-gradient` lavender wash in `::before` and no `::after`
  fade-to-black.
- **effects.js:** delete the file and its `<script>` tags. Custom cursor, magnetic
  buttons, and 3D tilt/glare all go. Flip-card behaviour goes with it (see cards).
- **AOS:** kept. `main.js` init unchanged except `duration: 500`. Reveals stay
  short fade-up.
- Keep: `.scroll-progress` (lavender), `.back-to-top` (lavender solid),
  `.scroll-cue` chevron (muted, static — drop the bounce keyframe or keep it very
  subtle).

### Components

- **Buttons:** `.btn-primary` = solid `--accent`, white text, `--shadow-sm`,
  hover `--accent-strong` + `translateY(-1px)`. `.btn-outline` = 1px `--border`,
  `--text`, hover border `--accent` + text `--accent`. Remove `.magnetic`,
  `var(--glow)`, gradient backgrounds. Keep pill radius.
- **Header:** `rgba(255,255,255,0.7)` blur; `.scrolled` → opaque white +
  `--border-soft` bottom border. Active nav link → `--accent` text on
  `--accent-soft` pill. Brand image border → `--accent` 2px, no glow shadow.
- **Project cards → static.** Replace the `.flip-inner / .flip-front / .flip-back`
  markup in `index.html` (3 cards) and `projects.html` (7 cards) with a single
  static card: `.project-thumb` (image or `.no-image` icon) + `.project-body`
  (category chip, `<h4>`, one-line `<p>` description, `.tag-row`, `.project-links`).
  Card = `--surface`, 1px `--border`, `--shadow`; hover → `translateY(-4px)` +
  border `--accent`. Remove all flip/perspective/backface CSS. `data-category`
  stays on the wrapper; `.filter-btn` / `filtered-out` / `filtered-hidden` CSS and
  the `main.js` filter logic are unchanged and keep working. Drop `role="button"`
  / `tabindex="0"` / flip aria-labels from the wrappers (no longer interactive);
  keep the repo `<a>` as the focusable element.
- **Skills marquee → static strip.** Replace `.marquee` markup in `index.html`
  with a centered wrapped `.skills-strip` of `<span>` labels separated by a
  lavender dot. Remove `marqueeScroll` keyframe + `.marquee*` CSS.
- **CTA band:** `--bg-soft` background, 1px `--border`, no `::before` glow.
  Heading `--text`, body `--text-soft`. Primary button = accent (same as global).
  Remove the inverted-paper overrides.
- **Footer:** `--bg-soft`, top `--border` (remove gradient `::before` line),
  muted text, social icons 1px `--border` → hover `--accent`.
- **Timeline / skill bars / tags / cert cards / edu cards / icon cards:** reskin
  to the light tokens — lavender line & dots, flat lavender skillbar fill (no
  glow), white card surfaces, `--accent` hover borders. Structure unchanged.
- `<head>` of all three pages: `theme-color` → `#fbfbfd`, `color-scheme` → light,
  delete the `<style>html{background-color:#0a0807}</style>` line.

### Files to delete

- `GRU.html`, `inner-page-1.html`, `portfolio-details.html`
- `assets/js/hero-scene.js`, `assets/js/effects.js`
- `assets/vendor/`: `boxicons`, `glightbox`, `swiper`, `isotope-layout`,
  `php-email-form`, `purecounter`, `typed.js`, `waypoints` (referenced only by the
  deleted pages; the active pages load only `aos`, `bootstrap`, `bootstrap-icons`)

## Verification

Static site, no test runner. Serve locally and screenshot all three pages
(full-page, via the CDP script already in the scratchpad) plus a mobile width
(~390px). Check:

1. Light theme throughout, no dark flashes, no leftover orange.
2. Header scroll state, active nav, mobile nav toggle.
3. Projects page category filter still shows/hides the right cards.
4. Cross-fade on internal navigation; `prefers-reduced-motion` disables it and
   the page is fully visible.
5. Resume skill bars still animate on scroll into view.
6. No console errors (no missing three.js / effects.js).
7. `git grep` for `grad`, `ember`, `hero-canvas`, `page-veil`, `flip-`,
   `marquee`, `three.min` returns nothing in the three active pages / CSS / JS.
