# Status & remaining work

Tracking against the 4-week plan agreed with Pawpad. Updated 12 Aug 2026.

## Done (Week 1 pass)

- [x] Repo scaffolded as a plain static site: no build step, no JSX, no
      bundler. `.gitignore`, GitHub Actions auto-deploy workflow (optional,
      see README), `CNAME` for pawpad.in
- [x] Hash-routed single-page app converted to 7 real static HTML pages, each
      with its own title/meta description/Open Graph tags (a head start on
      the Week 4 SEO task, done now since the page-template work was already
      in progress)
- [x] All original JSX converted once to plain JavaScript
      (`React.createElement(...)`, no JSX syntax anywhere in the shipped
      site) — edit the files under `assets/js/` directly going forward
- [x] "Omelette" edit-mode builder panel (`tweaks-panel.jsx`) removed
      entirely — not carried into `assets/js/` at all
- [x] Unreferenced/orphaned images (Asset 1/2@2x.png, logo.png, logo-gold.png,
      docx-image1/2/3.png, hero-cover.jpg, and five other unused root-level
      images) dropped — never copied into `assets/img/`
- [x] Four oversized photos compressed for web (resized to a sensible max
      width, re-encoded): `cat-grooming-long-hair.jpg` 4.98MB → 385KB,
      `cat-grooming-short-hair.jpg` 2.8MB → 355KB,
      `grooming-snapshot-new.jpg` 5.0MB → 368KB,
      `hero-cover-bernese-cat.png` 1.4MB → 980KB
- [x] Booking confirmation screen's WhatsApp link corrected to the real
      studio number (was a mismatched placeholder); footer WhatsApp icon
      now links to the real number too (was `href="#"`)
- [x] All internal navigation (`nav`, footer, home page service links)
      switched from `#/route` hash links to real `.html` hrefs
- [x] Every page verified in a real browser (Playwright): zero console
      errors on all 7 pages, and the full multi-step booking modal flow
      (service → pet → when → you → done) tested end-to-end — matches the
      original design pixel-for-pixel

## Not done yet — needs your input before it can be finished

- [ ] **Fixed pricing for grooming/boarding items.** You confirmed the
      client wants some "Enquire"-priced services moved to fixed pricing for
      the Razorpay checkout — need the actual list (which services, what
      price) before Week 3's checkout can be built correctly.
- [ ] **Web3Forms.** Needs an account + Access Key created for Pawpad before
      `assets/js/hubspot.js` can be replaced. It's untouched and still live
      for now so lead capture isn't broken in the meantime.
- [ ] **Razorpay Key ID.** Needed for the checkout build in Week 3.
- [x] **Logo/favicon files.** Comprehensive favicon assets, SVG, Apple Touch Icons, Web App Manifest, and head links added across all pages.
- [ ] **Instagram/Facebook URLs.** Footer icons are marked with a
      `TODO(RIED)` comment in `assets/js/shared.js` and still point at `#` —
      real client accounts not yet provided.
- [x] **GitHub repo target.** Active repository: `https://github.com/Ranjana0521/Paw-Pad-Website.git` on `main`.

## Weeks 2–4

- [x] Full CSS/responsive fix pass & brand typography consistency
- [x] Favicon/icon set generation & manifest integration
- [x] WhatsApp floating click-to-chat widget across all pages (integrated in `assets/js/shared.js` & `page-shell.js` with WebP asset optimization)
- [ ] Web3Forms integration replacing `assets/js/hubspot.js`
- [x] Cart/checkout page and drawer with Razorpay links & full validation (`assets/js/cart.js`)
- [ ] Security hardening: Cloudflare in front of GitHub Pages (headers/WAF/HTTPS)
- [x] sitemap.xml, robots.txt, schema.org LocalBusiness markup
- [x] Privacy Policy / Terms / Refund & Cancellation Policy pages ([policies.html](policies.html)) with links in footer
- [ ] Cross-browser/device QA pass, Razorpay test-mode run-through, form
      delivery test
- [ ] DNS cutover (pawpad.in → GitHub Pages) and go-live

## A note on the React CDN tags

`*.html` still loads React 18.3.1's **development** build from unpkg, with the exact
same Subresource Integrity hash the vendor's original site used and had already
verified working. Swapping to the smaller `production.min.js` build is a reasonable
future optimization, but do **not** guess the SRI hash for it — a mismatch silently
blocks the script and blanks the entire page. Compute it for real
(`openssl dgst -sha384 -binary react.production.min.js | openssl base64 -A`) before
changing this.

## A note on why there's no JSX

Earlier drafts of this rebuild used a build step (esbuild) to compile JSX at build
time rather than in the browser. That's been dropped: every file under `assets/js/`
is now plain JavaScript you can edit and deploy directly, with zero compilation step
required at any point. If you'd rather write new pages/components in JSX going
forward, you'd need to reintroduce a build step (or run JSX through esbuild/Babel by
hand before committing) — this repo intentionally doesn't do that.
