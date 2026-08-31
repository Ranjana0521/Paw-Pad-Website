
const { useState, useEffect, useRef, useCallback, useLayoutEffect } = React;
const ROUTE_HREF = {
  home: "index.html",
  about: "about.html",
  experience: "experience.html",
  grooming: "grooming.html",
  courses: "courses.html",
  boarding: "boarding.html",
  myotherapy: "myotherapy.html",
  contact: "contact.html"
};
function hrefFor(key) {
  return ROUTE_HREF[key] || ROUTE_HREF.home;
}
const PawIcon = ({ size = 18, color = "currentColor", style }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 64 64", width: size, height: size, style, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("ellipse", { cx: "32", cy: "16", rx: "5.5", ry: "7.5", fill: color }), /* @__PURE__ */ React.createElement("ellipse", { cx: "20", cy: "24", rx: "6", ry: "8", fill: color }), /* @__PURE__ */ React.createElement("ellipse", { cx: "44", cy: "24", rx: "6", ry: "8", fill: color }), /* @__PURE__ */ React.createElement("ellipse", { cx: "11", cy: "38", rx: "5", ry: "6.5", fill: color }), /* @__PURE__ */ React.createElement("ellipse", { cx: "53", cy: "38", rx: "5", ry: "6.5", fill: color }), /* @__PURE__ */ React.createElement("ellipse", { cx: "32", cy: "46", rx: "13", ry: "11", fill: color }));
const Arrow = ({ size = 14 }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "arr" }, /* @__PURE__ */ React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), /* @__PURE__ */ React.createElement("polyline", { points: "13 6 19 12 13 18" }));
const InstagramIcon = ({ size = 16, color = "currentColor", style }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }), /* @__PURE__ */ React.createElement("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }), /* @__PURE__ */ React.createElement("line", { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" }));
const FacebookIcon = ({ size = 16, color = "currentColor", style }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: color, stroke: "none", style, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }));
const TwitterIcon = ({ size = 16, color = "currentColor", style }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: color, stroke: "none", style, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }));
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return void 0;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
function CursorTrail() {
  // Handled globally by assets/js/cursor.js for unified desktop cursor & paw trail across all pages & forms
  return null;
}
const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "grooming", label: "Grooming" },
  { key: "courses", label: "Courses" },
  { key: "boarding", label: "Boarding" },
  { key: "myotherapy", label: "Myotherapy" },
  { key: "contact", label: "Contact" }
];
function TopNav({ route, onBook, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      if (window.PawpadCartStore) {
        setCartCount(window.PawpadCartStore.getTotalCount());
      }
    };
    updateCount();
    window.addEventListener("pawpad-cart-updated", updateCount);
    return () => window.removeEventListener("pawpad-cart-updated", updateCount);
  }, []);

  const handleOpenCart = () => {
    if (onOpenCart) onOpenCart();
    else if (window.openCart) window.openCart();
  };

  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", { className: "nav " + (scrolled ? "scrolled" : "") }, /* @__PURE__ */ React.createElement("div", { className: "container nav-inner" }, /* @__PURE__ */ React.createElement("a", { href: hrefFor("home"), className: "nav-brand", "aria-label": "Pawpad home" }, /* @__PURE__ */ React.createElement("img", { src: "assets/img/logo-pawpad-new-transparent.webp", alt: "Pawpad" })), /* @__PURE__ */ React.createElement("nav", { className: "nav-links desktop-only", "aria-label": "Primary" }, NAV_ITEMS.map((item) => /* @__PURE__ */ React.createElement("a", { key: item.key, href: hrefFor(item.key), className: "nav-link " + (route === item.key ? "active" : "") }, item.label))), /* @__PURE__ */ React.createElement("div", { className: "nav-cta desktop-only" }, /* @__PURE__ */ React.createElement("button", { className: "nav-cart-btn", onClick: handleOpenCart, "aria-label": `Shopping cart with ${cartCount} items` }, /* @__PURE__ */ React.createElement(CartIcon, { size: 18 }), cartCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "nav-cart-badge" }, cartCount))), /* @__PURE__ */ React.createElement("div", { className: "mobile-nav-actions mobile-only" }, /* @__PURE__ */ React.createElement("button", { className: "nav-cart-btn mobile-cart-btn", onClick: handleOpenCart, "aria-label": `Shopping cart with ${cartCount} items` }, /* @__PURE__ */ React.createElement(CartIcon, { size: 18 }), cartCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "nav-cart-badge" }, cartCount)), /* @__PURE__ */ React.createElement("button", { className: "hamburger", onClick: () => setOpen(true), "aria-label": "Open menu" }, /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null))))), open && /* @__PURE__ */ React.createElement("div", { className: "mobile-menu", onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "mobile-menu-inner", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { className: "close", onClick: () => setOpen(false), "aria-label": "Close menu" }, "\xD7"), /* @__PURE__ */ React.createElement("div", { className: "mobile-links" }, NAV_ITEMS.map((item) => /* @__PURE__ */ React.createElement(
    "a",
    {
      key: item.key,
      href: hrefFor(item.key),
      onClick: () => setOpen(false),
      className: "m-link " + (route === item.key ? "active" : "")
    },
    /* @__PURE__ */ React.createElement("span", null, item.label),
    /* @__PURE__ */ React.createElement(Arrow, { size: 20 })
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 12 } }, /* @__PURE__ */ React.createElement("button", {
    className: "btn btn-ghost", onClick: () => {
      setOpen(false);
      handleOpenCart();
    }, style: { justifyContent: "center" }
  }, /* @__PURE__ */ React.createElement(CartIcon, { size: 16 }), " View Cart (", cartCount, ")")))), /* @__PURE__ */ React.createElement("style", null, `
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          transition: background var(--t-med) var(--ease), backdrop-filter var(--t-med) var(--ease), padding var(--t-fast) var(--ease);
          padding: 18px 0;
        }
        .nav.scrolled {
          background: color-mix(in oklab, var(--cream-bg), transparent 12%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 10px 0;
          border-bottom: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
        }
        .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .nav-brand { display: flex; align-items: center; flex-shrink: 0; }
        .nav-brand img {
          height: 140px;
          width: auto;
          max-width: min(46vw, 380px);
          object-fit: contain;
          transition: height var(--t-fast) var(--ease);
        }
        .nav.scrolled .nav-brand img { height: 105px; }
        .nav-links { display: flex; gap: 6px; align-items: center; }
        .nav-link {
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink);
          opacity: .78;
          transition: all var(--t-fast) var(--ease);
          position: relative;
        }
        .nav-link:hover { opacity: 1; background: color-mix(in oklab, var(--champagne), transparent 30%); }
        .nav-link.active { opacity: 1; color: var(--driftwood-deep); }
        .nav-link.active::after {
          content: ""; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; background: var(--driftwood); border-radius: 50%;
        }
        .nav-cta { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .nav-cart-btn {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: color-mix(in oklab, var(--champagne), transparent 40%);
          color: var(--ink);
          border: 1px solid color-mix(in oklab, var(--ink), transparent 85%);
          cursor: pointer;
          flex-shrink: 0;
          transition: all var(--t-fast) var(--ease);
        }
        .nav-cart-btn:hover {
          background: var(--ink);
          color: var(--cream-bg);
          transform: translateY(-1px);
        }
        .nav-cart-badge {
          position: absolute; top: -4px; right: -4px;
          min-width: 19px; height: 19px;
          border-radius: 999px;
          background: var(--driftwood);
          color: var(--white);
          font-size: 11px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          animation: badgePop .25s var(--ease) both;
        }
        @keyframes badgePop {
          0% { transform: scale(0.6); }
          80% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .mobile-nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        @media (min-width: 1025px) and (max-width: 1280px) {
          .nav-inner { gap: 12px; }
          .nav-brand img { height: 95px; }
          .nav.scrolled .nav-brand img { height: 75px; }
          .nav-links { gap: 2px; }
          .nav-link { padding: 8px 10px; font-size: 13px; }
        }
        @media (max-width: 1024px) {
          .nav { padding: 12px 0; }
          .nav.scrolled { padding: 8px 0; }
          .nav-brand img { height: 85px; max-width: min(50vw, 240px); }
          .nav.scrolled .nav-brand img { height: 68px; }
        }
        @media (max-width: 480px) {
          .nav-brand img { height: 72px; max-width: min(55vw, 190px); }
          .nav.scrolled .nav-brand img { height: 58px; }
        }
        .hamburger {
          display: flex; flex-direction: column; gap: 5px; padding: 10px;
        }
        .hamburger span {
          display: block; width: 22px; height: 1.5px; background: var(--ink); border-radius: 2px;
        }
        .mobile-menu {
          position: fixed; inset: 0; z-index: 90;
          background: color-mix(in oklab, var(--ink), transparent 40%);
          backdrop-filter: blur(8px);
          animation: fadeIn .25s var(--ease) both;
        }
        .mobile-menu-inner {
          position: absolute; top: 0; right: 0; bottom: 0; width: min(360px, 86%);
          background: var(--cream-bg);
          padding: 80px 32px 32px;
          display: flex; flex-direction: column; gap: 24px;
          animation: slideIn .35s var(--ease) both;
        }
        .mobile-menu-inner .close {
          position: absolute; top: 20px; right: 24px;
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--champagne); font-size: 24px; line-height: 1;
        }
        .mobile-links { display: flex; flex-direction: column; gap: 2px; }
        .m-link {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 0; border-bottom: 1px solid color-mix(in oklab, var(--ink), transparent 88%);
          font-family: var(--f-display); font-size: 28px;
        }
        .m-link.active { color: var(--driftwood); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `));
}
function Footer({ onBook }) {
  return /* @__PURE__ */ React.createElement("footer", { className: "site-footer" },
    /* @__PURE__ */ React.createElement("div", { className: "container" },
      /* @__PURE__ */ React.createElement("div", { className: "footer-top" },
        /* @__PURE__ */ React.createElement("div", { className: "footer-cta-block" },
          /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Ready when you are"),
          /* @__PURE__ */ React.createElement("h2", { className: "h-1" }, "Soft hands", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--white)" } }, "Calm pets")),
          /* @__PURE__ */ React.createElement("p", { className: "lead", style: { marginTop: 24 } }, "Walk in with anxiety, leave with a wagging tail. Sessions are spaced, never rushed — and we plan around your pet's temperament, not our calendar."),
          /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 } },
            /* @__PURE__ */ React.createElement("a", { href: hrefFor("about"), className: "btn btn-primary" }, "Read our story ", /* @__PURE__ */ React.createElement(Arrow, null))
          )
        ),
        /* @__PURE__ */ React.createElement("div", { className: "footer-grid" },
          /* @__PURE__ */ React.createElement("div", null,
            /* @__PURE__ */ React.createElement("h4", { className: "f-h" }, "Hours"),
            /* @__PURE__ */ React.createElement("p", null, "Weekdays: 11 AM - 8 PM", /* @__PURE__ */ React.createElement("br", null), "Weekends: 10 AM - 8 PM", /* @__PURE__ */ React.createElement("br", null), "Thursdays: Closed")
          ),
          /* @__PURE__ */ React.createElement("div", null,
            /* @__PURE__ */ React.createElement("h4", { className: "f-h" }, "Address"),
            /* @__PURE__ */ React.createElement("p", null, "#426, 5th Main Road,", /* @__PURE__ */ React.createElement("br", null), "HRBR 2nd Block, Kalyan Nagar", /* @__PURE__ */ React.createElement("br", null), "Bangalore - 560043 India"),
            /* @__PURE__ */ React.createElement("p", { style: { marginTop: 14 } }, "Ph: ", /* @__PURE__ */ React.createElement("a", { href: "tel:+919663077496" }, "9663077496")),
            /* @__PURE__ */ React.createElement("div", { className: "socials" },
              /* @__PURE__ */ React.createElement("a", { href: "https://www.instagram.com/pawpad_grooming_studio?igsi=MTRranltYzh1cnVuZw%3D%3D&utm_source=qr", "aria-label": "Instagram", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(InstagramIcon, { size: 16 })),
              /* @__PURE__ */ React.createElement("a", { href: "https://www.facebook.com/share/19KxDx35E5/?mibextid=wwXIfr", "aria-label": "Facebook", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(FacebookIcon, { size: 16 })),
              /* @__PURE__ */ React.createElement("a", { href: "https://x.com/Pawpad_Blore", "aria-label": "Twitter", target: "_blank", rel: "noopener noreferrer" }, /* @__PURE__ */ React.createElement(TwitterIcon, { size: 16 }))
            )
          ),
          /* @__PURE__ */ React.createElement("div", null,
            /* @__PURE__ */ React.createElement("h4", { className: "f-h" }, "Explore"),
            /* @__PURE__ */ React.createElement("ul", null,
              NAV_ITEMS.filter((i) => i.key !== "home").map((i) =>
                /* @__PURE__ */ React.createElement("li", { key: i.key },
                  /* @__PURE__ */ React.createElement("a", { href: hrefFor(i.key) }, i.label)
                )
              )
            )
          )
        )
      ),
      /* @__PURE__ */ React.createElement("div", { className: "footer-bottom" },
        /* @__PURE__ */ React.createElement("div", { className: "brand-mark" },
          /* @__PURE__ */ React.createElement("img", { src: "assets/img/logo-pawpad-03.webp", alt: "Pawpad" })
        ),
        /* @__PURE__ */ React.createElement("div", { className: "footer-bottom-meta" },
          /* @__PURE__ */ React.createElement("p", { className: "micro" }, "© 2017 Pawpad. All rights reserved."),
          /* @__PURE__ */ React.createElement("div", { className: "footer-legal" },
            /* @__PURE__ */ React.createElement("a", { href: "policies.html#privacy" }, "Privacy Policy"),
            /* @__PURE__ */ React.createElement("span", { className: "sep" }, "|"),
            /* @__PURE__ */ React.createElement("a", { href: "policies.html#terms" }, "Terms and Conditions"),
            /* @__PURE__ */ React.createElement("span", { className: "sep" }, "|"),
            /* @__PURE__ */ React.createElement("a", { href: "policies.html#refund" }, "Refund Policy")
          )
        )
      )
    ),
    /* @__PURE__ */ React.createElement("style", null, `
        .site-footer {
          background: #2e2e2e; color: var(--white);
          padding: 100px 0 36px; margin-top: 80px;
          position: relative; overflow: hidden;
        }
        .site-footer .eyebrow { color: var(--white); }
        .site-footer .eyebrow::before { background: var(--white); }
        .site-footer h2 { color: var(--white); }
        .site-footer p { color: color-mix(in oklab, var(--white), transparent 20%); }
        .site-footer a { color: var(--white); transition: color var(--t-fast) var(--ease); }
        .site-footer a:hover { color: var(--driftwood); }
        .footer-top { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; align-items: start; padding-bottom: 80px; }
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding-top: 12px; }
        .f-h { font-family: var(--f-body); font-size: 12px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--white); margin: 0 0 14px; }
        .footer-grid ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .footer-grid p { margin: 0; line-height: 1.6; }
        .socials { display: flex; gap: 8px; margin-top: 16px; }
        .socials a {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          background: color-mix(in oklab, var(--cream-bg), transparent 88%);
          color: var(--white);
          transition: background var(--t-fast) var(--ease), color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
        }
        .socials a:hover { background: var(--driftwood); color: var(--white); transform: translateY(-2px); }
        .socials a svg { display: block; }
        .footer-bottom {
          padding-top: 36px; border-top: 1px solid color-mix(in oklab, var(--cream-bg), transparent 88%);
          display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
        }
        .brand-mark img { height: 88px; width: auto; max-width: 360px; object-fit: contain; opacity: .98; }
        .footer-bottom-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .footer-bottom-meta .micro { margin: 0; font-size: 12px; letter-spacing: .04em; color: color-mix(in oklab, var(--white), transparent 25%); }
        .footer-legal { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; }
        .footer-legal a { color: color-mix(in oklab, var(--white), transparent 30%); font-size: 12px; text-decoration: none; transition: color var(--t-fast) var(--ease); }
        .footer-legal a:hover { color: var(--white); text-decoration: underline; }
        .footer-legal .sep { color: color-mix(in oklab, var(--white), transparent 65%); font-size: 11px; }
        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr; gap: 48px; padding-bottom: 48px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .nav-brand img { height: 76px; max-width: 220px; }
          .nav.scrolled .nav-brand img { height: 58px; }
          .brand-mark img { height: 64px; max-width: 240px; }
          .footer-bottom-meta { align-items: flex-start; }
        }
      `)
  );
}
const TESTIMONIALS = [
  {
    quote: "Thank you so much to you Leena and your incredible team for taking such good care of Maggie during her grooming session. Maggie is generally anxious during grooming and after trying several large chain groomers, Pawpad has been a saviour.",
    name: "Rithika Narayan",
    pet: "Maggie",
    img: "assets/img/8.webp"
  },
  {
    quote: "Leena is a very patient and considerate groomer who really cares for your pets. Talks to them soothingly and is very gentle with them. Small touches like covering pets ears with a small towel while blow drying make a world of difference. Highly recommend!",
    name: "Nisha Viswanathan",
    pet: "Cat grooming client",
    img: "assets/img/6.webp"
  },
  {
    quote: "We take care of an abandoned 13-year-old Indie\u2013Poodle mix named Pepsi who lives near our apartment. When we first started looking after her, her coat was in a terrible condition with severe matting, cuts, and rashes. We began taking her to Pawpad, run by Leena Munikempanna, and the experience has been incredible. Leena and her team handled Pepsi with so much patience and care, and over a few grooming sessions they completely brought her coat back to life. What touched us even more was Leena's kindness \u2014 she generously offered us a discount on grooming sessions so we could continue bringing Pepsi in regularly. It's rare to find businesses that care this deeply not just for pets, but also for community animals. Highly recommend Pawpad to anyone looking for thoughtful, skilled, and compassionate grooming for their pets. \u{1F43E}",
    name: "Koganti Jahnavi",
    pet: "Pepsi \xB7 Community dog"
  },
  {
    quote: "We have been taking my pet to Pawpad for over two years, and we have always been so happy with the care and service they provide. The team is consistently kind, welcoming, and genuinely caring, which makes every visit a positive experience. Their service level is excellent, and they always treat my pet with patience, gentleness, and professionalism. It is clear that they truly love animals and take pride in their work. Our dog always comes back looking great and well cared for.",
    name: "Cidella",
    pet: "Long-time grooming client"
  },
  {
    quote: "Theishing and Tamang did an excellent job during my large-breed Golden Retriever's grooming session. I've never seen my dog this comfortable with both the environment and the people. I highly recommend this place \u2014 they cared for my pet as if it were their own. The service exceeded my expectations and was worth every penny. Most importantly, my dog clearly enjoyed the experience.",
    name: "Karen Wilma",
    pet: "Golden Retriever"
  }
];
function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(t);
  }, [paused]);
  return /* @__PURE__ */ React.createElement("section", { className: "testi-section", onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "testi-head reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Word of paw"), /* @__PURE__ */ React.createElement("h2", { className: "h-1" }, "Trusted by humans ", /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "and their pets"))), /* @__PURE__ */ React.createElement("div", { className: "testi-stage reveal" }, TESTIMONIALS.map((t, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "testi-card " + (idx === i ? "active" : idx === (i + TESTIMONIALS.length - 1) % TESTIMONIALS.length ? "prev" : "next") }, /* @__PURE__ */ React.createElement("div", { className: "testi-body" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 32 24", width: "38", className: "testi-quote-mark", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "M0 24V14C0 6 4 1 12 0v6c-4 1-6 4-6 8h6v10H0zm20 0V14c0-8 4-13 12-14v6c-4 1-6 4-6 8h6v10H20z" })), /* @__PURE__ */ React.createElement("p", { className: "testi-quote" }, t.quote), /* @__PURE__ */ React.createElement("div", { className: "testi-who" }, /* @__PURE__ */ React.createElement("strong", null, t.name), /* @__PURE__ */ React.createElement("span", null, t.pet)))))), /* @__PURE__ */ React.createElement("div", { className: "testi-controls" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setI((i + TESTIMONIALS.length - 1) % TESTIMONIALS.length), "aria-label": "Previous testimonial" }, "\u2190"), /* @__PURE__ */ React.createElement("div", { className: "dots" }, TESTIMONIALS.map((_, idx) => /* @__PURE__ */ React.createElement("button", { key: idx, className: "dot " + (idx === i ? "on" : ""), onClick: () => setI(idx), "aria-label": `Testimonial ${idx + 1}` }))), /* @__PURE__ */ React.createElement("button", { onClick: () => setI((i + 1) % TESTIMONIALS.length), "aria-label": "Next testimonial" }, "\u2192"))), /* @__PURE__ */ React.createElement("style", null, `
        .testi-section { background: var(--champagne-soft); }
        .testi-head { margin-bottom: 64px; max-width: 720px; }
        .testi-stage { display: grid; }
        .testi-card {
          grid-area: 1 / 1;
          display: block;
          align-items: center;
          opacity: 0; transform: translateY(20px) scale(.98);
          transition: opacity .7s var(--ease), transform .7s var(--ease);
          pointer-events: none;
        }
        .testi-card.active { opacity: 1; transform: none; pointer-events: auto; }
        .testi-body { display: flex; flex-direction: column; gap: 24px; }
        .testi-quote-mark { color: var(--driftwood); opacity: .35; }
        .testi-quote {
          font-family: var(--f-display);
          font-size: clamp(24px, 2.4vw, 36px);
          line-height: 1.25;
          color: var(--ink);
          margin: 0;
        }
        .testi-who { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; font-size: 14px; }
        .testi-who strong { font-weight: 700; }
        .testi-who span { color: var(--ink-mute); }
        .testi-controls {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          margin-top: 40px;
        }
        .testi-controls button {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--white); display: inline-flex; align-items: center; justify-content: center;
          transition: all var(--t-fast) var(--ease);
          font-size: 18px;
        }
        .testi-controls button:hover { background: #2e2e2e; color: var(--white); }
        .dots { display: flex; gap: 8px; }
        .dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--ink); opacity: .2;
          transition: all var(--t-fast) var(--ease);
        }
        .dot.on { width: 28px; border-radius: 999px; opacity: 1; background: var(--driftwood); }
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 50% 60%; }
        }
        @media (max-width: 800px) {
          .testi-stage { min-height: 560px; }
        }
      `));
}
function Marquee({ items }) {
  return /* @__PURE__ */ React.createElement("div", { className: "marquee", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "m-track" }, [...items, ...items, ...items].map((it, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "m-item" }, /* @__PURE__ */ React.createElement("span", null, it), /* @__PURE__ */ React.createElement(PawIcon, { size: 14, color: "currentColor" })))), /* @__PURE__ */ React.createElement("style", null, `
        .marquee { overflow: hidden; padding: 28px 0; background: #2e2e2e; color: var(--white); border-top: 1px solid color-mix(in oklab, var(--cream-bg), transparent 88%); border-bottom: 1px solid color-mix(in oklab, var(--cream-bg), transparent 88%); }
        .m-track { display: flex; gap: 56px; white-space: nowrap; animation: scroll 38s linear infinite; }
        body[data-motion="still"] .m-track { animation: none; }
        .m-item { display: inline-flex; align-items: center; gap: 24px; font-family: var(--f-display); font-size: clamp(28px, 3vw, 44px); }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      `));
}
const WA_NUMBER = "918885349267";
const WA_MESSAGE = "Hello, I would like to know more about your services.";
function WhatsAppFloat() {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "wa-float hover-zone",
      "aria-label": "Chat with Pawpad on WhatsApp"
    },
    /* @__PURE__ */ React.createElement("img", { src: "assets/img/whatsapp-paw.webp", alt: "Chat with Pawpad on WhatsApp", draggable: "false" }),
    /* @__PURE__ */ React.createElement("span", { className: "wa-tip desktop-only" }, "Chat on WhatsApp")
  ), /* @__PURE__ */ React.createElement("style", null, `
        .wa-float {
          position: fixed;
          right: clamp(16px, 3vw, 28px);
          bottom: calc(clamp(16px, 3vw, 28px) + env(safe-area-inset-bottom, 0px));
          z-index: 40;
          width: 82px; height: 82px;
          display: inline-flex; align-items: center; justify-content: center;
          transition: transform var(--t-fast) var(--ease);
        }
        .wa-float:hover {
          transform: translateY(-3px);
        }
        .wa-float img { width: 100%; height: 100%; object-fit: contain; display: block; -webkit-user-drag: none; }
        .wa-tip {
          position: absolute; right: calc(100% + 12px); top: 50%;
          transform: translateY(-50%) translateX(6px);
          background: var(--ink); color: var(--cream-bg);
          padding: 8px 14px; border-radius: 999px;
          font-family: var(--f-body); font-size: 13px; font-weight: 600; white-space: nowrap;
          opacity: 0; pointer-events: none;
          transition: opacity var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
        }
        .wa-float:hover .wa-tip { opacity: 1; transform: translateY(-50%) translateX(0); }
        @media (max-width: 700px) {
          .wa-float { width: 56px; height: 56px; }
        }
      `));
}
function useCmsContent(pageKey, defaultData) {
  const [content, setContent] = useState(() => {
    if (window.PawpadContentStore) {
      return window.PawpadContentStore.get(pageKey);
    }
    return defaultData || {};
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (window.PawpadContentStore) {
        setContent({ ...window.PawpadContentStore.get(pageKey) });
      }
    };
    window.addEventListener("pawpad-content-updated", handleUpdate);
    return () => window.removeEventListener("pawpad-content-updated", handleUpdate);
  }, [pageKey]);

  return content;
}

Object.assign(window, {
  PawIcon,
  Arrow,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  useReveal,
  useCmsContent,
  hrefFor,
  ROUTE_HREF,
  CursorTrail,
  TopNav,
  Footer,
  Testimonials,
  Marquee,
  NAV_ITEMS,
  WhatsAppFloat
});

