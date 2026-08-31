/* shared.jsx — Pawpad nav, footer, cursor trail, helpers */

const { useState, useEffect, useRef, useCallback, useLayoutEffect } = React;

/* ---------- Icons ---------- */
const PawIcon = ({ size = 18, color = "currentColor", style }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={style} aria-hidden="true">
    <ellipse cx="32" cy="16" rx="5.5" ry="7.5" fill={color} />
    <ellipse cx="20" cy="24" rx="6" ry="8" fill={color} />
    <ellipse cx="44" cy="24" rx="6" ry="8" fill={color} />
    <ellipse cx="11" cy="38" rx="5" ry="6.5" fill={color} />
    <ellipse cx="53" cy="38" rx="5" ry="6.5" fill={color} />
    <ellipse cx="32" cy="46" rx="13" ry="11" fill={color} />
  </svg>
);

const Arrow = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arr">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

const InstagramIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} stroke="none" style={style} aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} stroke="none" style={style} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ---------- Routing ---------- */
function useRoute() {
  const get = () => {
    const h = window.location.hash.replace("#/", "").replace("#", "");
    return h || "home";
  };
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const onHash = () => { setRoute(get()); window.scrollTo({ top: 0, behavior: "instant" }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [route, (r) => { window.location.hash = "/" + r; }];
}

/* ---------- Scroll reveal ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in"));
      return undefined;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------- Cursor + paw trail ---------- */
function CursorTrail() {
  const dotRef = useRef(null);
  const trailRef = useRef(null);
  const stateRef = useRef({ lastX: -100, lastY: -100, lastStamp: 0, alt: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    let raf;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;

    function onMove(e) {
      mx = e.clientX; my = e.clientY;
      const t = e.target;
      if (t.closest && t.closest("a, button, .hover-zone")) dot.classList.add("hover");
      else dot.classList.remove("hover");

      const s = stateRef.current;
      const dist = Math.hypot(mx - s.lastX, my - s.lastY);
      const now = performance.now();
      if (dist > 70 && now - s.lastStamp > 60) {
        s.lastX = mx; s.lastY = my; s.lastStamp = now;
        const paw = document.createElement("div");
        const angle = Math.atan2(my - dy, mx - dx) * 180 / Math.PI + 90;
        const side = s.alt ? -10 : 10;
        s.alt = 1 - s.alt;
        const offX = Math.cos((angle - 90) * Math.PI / 180 + Math.PI / 2) * side;
        const offY = Math.sin((angle - 90) * Math.PI / 180 + Math.PI / 2) * side;
        paw.className = "paw-print";
        paw.style.cssText = `
          position:absolute; left:${mx + offX}px; top:${my + offY}px;
          width:22px; height:22px; transform:translate(-50%,-50%) rotate(${angle}deg);
          opacity:.42; transition:opacity 1.4s ease, transform 1.4s ease;
          pointer-events:none;
        `;
        paw.innerHTML = `<svg viewBox="0 0 64 64" width="22" height="22">
          <ellipse cx="32" cy="16" rx="5.5" ry="7.5" fill="#B18D4E"/>
          <ellipse cx="20" cy="24" rx="6" ry="8" fill="#B18D4E"/>
          <ellipse cx="44" cy="24" rx="6" ry="8" fill="#B18D4E"/>
          <ellipse cx="11" cy="38" rx="5" ry="6.5" fill="#B18D4E"/>
          <ellipse cx="53" cy="38" rx="5" ry="6.5" fill="#B18D4E"/>
          <ellipse cx="32" cy="46" rx="13" ry="11" fill="#B18D4E"/>
        </svg>`;
        trail.appendChild(paw);
        requestAnimationFrame(() => {
          paw.style.opacity = "0";
          paw.style.transform += " scale(1.2)";
        });
        setTimeout(() => paw.remove(), 1500);
      }
    }

    function tick() {
      dx += (mx - dx) * 0.22;
      dy += (my - dy) * 0.22;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="paw-trail" ref={trailRef}></div>
      <div className="cursor-dot" ref={dotRef}></div>
    </>
  );
}

/* ---------- Top nav ---------- */
const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "grooming", label: "Grooming" },
  { key: "courses", label: "Courses" },
  { key: "boarding", label: "Boarding" },
  { key: "myotherapy", label: "Myotherapy" },
  { key: "contact", label: "Contact" },
];

function TopNav({ route, onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={"nav " + (scrolled ? "scrolled" : "")}>
        <div className="container nav-inner">
          <a href="#/home" className="nav-brand" aria-label="Pawpad home">
            <img src="assets/img/logo-pawpad-text-transparent.png" alt="Pawpad" />
          </a>
          <nav className="nav-links desktop-only" aria-label="Primary">
            {NAV_ITEMS.map(item => (
              <a key={item.key} href={"#/" + item.key} className={"nav-link " + (route === item.key ? "active" : "")}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-cta desktop-only">
            <button className="btn btn-primary" onClick={onBook}>
              Book a session <Arrow />
            </button>
          </div>
          <button className="hamburger mobile-only" onClick={() => setOpen(true)} aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu" onClick={() => setOpen(false)}>
          <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
            <div className="mobile-links">
              {NAV_ITEMS.map(item => (
                <a key={item.key} href={"#/" + item.key} onClick={() => setOpen(false)}
                   className={"m-link " + (route === item.key ? "active" : "")}>
                  <span>{item.label}</span>
                  <Arrow size={20} />
                </a>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => { setOpen(false); onBook(); }}>
              Book a session
            </button>
          </div>
        </div>
      )}
      <style>{`
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
        .nav-brand img {
          height: 84px;
          width: auto;
          max-width: min(42vw, 320px);
          object-fit: contain;
          transition: height var(--t-fast) var(--ease);
        }
        .nav.scrolled .nav-brand img { height: 64px; }
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
      `}</style>
    </>
  );
}

/* ---------- Footer ---------- */
function Footer({ onBook }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-cta-block">
            <p className="eyebrow">Ready when you are</p>
            <h2 className="h-1">Soft hands<br/><em className="italic" style={{color:"var(--white)"}}>Calm pets</em></h2>
            <p className="lead" style={{marginTop:24}}>Walk in with anxiety, leave with a wagging tail. Sessions are spaced, never rushed — and we plan around your pet's temperament, not our calendar.</p>
            <div style={{display:"flex", gap:14, flexWrap:"wrap", marginTop:32}}>
              <button className="btn btn-primary" onClick={onBook}>Book a session <Arrow /></button>
              <a href="#/about" className="btn btn-ghost">Read our story <Arrow /></a>
            </div>
          </div>
          <div className="footer-grid">
            <div>
              <h4 className="f-h">Hours</h4>
              <p>Weekdays: 11 AM - 8 PM<br/>Weekends: 10 AM - 8 PM<br/>Thursdays: Closed</p>
            </div>
            <div>
              <h4 className="f-h">Address</h4>
              <p>#426, 5th Main Road,<br/>HRBR 2nd Block, Kalyan Nagar<br/>Bangalore - 560043 India</p>
              <p style={{marginTop:14}}>Ph: <a href="tel:+919663077496">9663077496</a></p>
              <div className="socials">
                <a href="#" aria-label="Instagram"><InstagramIcon size={16} /></a>
                <a href="#" aria-label="Facebook"><FacebookIcon size={16} /></a>
                <a href="https://x.com/Pawpad_Blore" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><TwitterIcon size={16} /></a>
              </div>
            </div>
            <div>
              <h4 className="f-h">Explore</h4>
              <ul>
                {NAV_ITEMS.filter(i=>i.key!=="home").map(i => (
                  <li key={i.key}><a href={"#/"+i.key}>{i.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="brand-mark">
            <img src="assets/img/logo-pawpad-03.png" alt="Pawpad" />
          </div>
          <div className="footer-bottom-meta">
            <p className="micro">© 2017 Pawpad. All rights reserved.</p>
            <div className="footer-legal">
              <a href="policies.html#privacy">Privacy Policy</a>
              <span className="sep">|</span>
              <a href="policies.html#terms">Terms and Conditions</a>
              <span className="sep">|</span>
              <a href="policies.html#refund">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
      <style>{`
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
      `}</style>
    </footer>
  );
}

/* ---------- Testimonials carousel ---------- */
const TESTIMONIALS = [
  {
    quote: "Thank you so much to you Leena and your incredible team for taking such good care of Maggie during her grooming session. Maggie is generally anxious during grooming and after trying several large chain groomers, Pawpad has been a saviour.",
    name: "Rithika Narayan",
    pet: "Maggie",
    img: "assets/img/8.jpg",
  },
  {
    quote: "Leena is a very patient and considerate groomer who really cares for your pets. Talks to them soothingly and is very gentle with them. Small touches like covering pets ears with a small towel while blow drying make a world of difference. Highly recommend!",
    name: "Nisha Viswanathan",
    pet: "Cat grooming client",
    img: "assets/img/6.jpg",
  },
  {
    quote: "We take care of an abandoned 13-year-old Indie–Poodle mix named Pepsi who lives near our apartment. When we first started looking after her, her coat was in a terrible condition with severe matting, cuts, and rashes. We began taking her to Pawpad, run by Leena Munikempanna, and the experience has been incredible. Leena and her team handled Pepsi with so much patience and care, and over a few grooming sessions they completely brought her coat back to life. What touched us even more was Leena’s kindness — she generously offered us a discount on grooming sessions so we could continue bringing Pepsi in regularly. It’s rare to find businesses that care this deeply not just for pets, but also for community animals. Highly recommend Pawpad to anyone looking for thoughtful, skilled, and compassionate grooming for their pets. 🐾",
    name: "Koganti Jahnavi",
    pet: "Pepsi · Community dog",
  },
  {
    quote: "We have been taking my pet to Pawpad for over two years, and we have always been so happy with the care and service they provide. The team is consistently kind, welcoming, and genuinely caring, which makes every visit a positive experience. Their service level is excellent, and they always treat my pet with patience, gentleness, and professionalism. It is clear that they truly love animals and take pride in their work. Our dog always comes back looking great and well cared for.",
    name: "Cidella",
    pet: "Long-time grooming client",
  },
  {
    quote: "Theishing and Tamang did an excellent job during my large-breed Golden Retriever’s grooming session. I’ve never seen my dog this comfortable with both the environment and the people. I highly recommend this place — they cared for my pet as if it were their own. The service exceeded my expectations and was worth every penny. Most importantly, my dog clearly enjoyed the experience.",
    name: "Karen Wilma",
    pet: "Golden Retriever",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI(v => (v + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="testi-section" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container">
        <div className="testi-head reveal">
          <p className="eyebrow">Word of paw</p>
          <h2 className="h-1">Trusted by humans <em className="italic" style={{color:"var(--driftwood)"}}>and their pets</em></h2>
        </div>
        <div className="testi-stage reveal">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className={"testi-card " + (idx === i ? "active" : idx === (i + TESTIMONIALS.length - 1) % TESTIMONIALS.length ? "prev" : "next")}>
              <div className="testi-body">
                <svg viewBox="0 0 32 24" width="38" className="testi-quote-mark" aria-hidden="true">
                  <path fill="currentColor" d="M0 24V14C0 6 4 1 12 0v6c-4 1-6 4-6 8h6v10H0zm20 0V14c0-8 4-13 12-14v6c-4 1-6 4-6 8h6v10H20z"/>
                </svg>
                <p className="testi-quote">{t.quote}</p>
                <div className="testi-who">
                  <strong>{t.name}</strong>
                  <span>{t.pet}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testi-controls">
          <button onClick={() => setI((i + TESTIMONIALS.length - 1) % TESTIMONIALS.length)} aria-label="Previous testimonial">←</button>
          <div className="dots">
            {TESTIMONIALS.map((_, idx) => (
              <button key={idx} className={"dot " + (idx === i ? "on" : "")} onClick={() => setI(idx)} aria-label={`Testimonial ${idx+1}`} />
            ))}
          </div>
          <button onClick={() => setI((i + 1) % TESTIMONIALS.length)} aria-label="Next testimonial">→</button>
        </div>
      </div>
      <style>{`
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
      `}</style>
    </section>
  );
}

/* ---------- Marquee strip ---------- */
function Marquee({ items }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="m-track">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="m-item">
            <span>{it}</span>
            <PawIcon size={14} color="currentColor" />
          </span>
        ))}
      </div>
      <style>{`
        .marquee { overflow: hidden; padding: 28px 0; background: #2e2e2e; color: var(--white); border-top: 1px solid color-mix(in oklab, var(--cream-bg), transparent 88%); border-bottom: 1px solid color-mix(in oklab, var(--cream-bg), transparent 88%); }
        .m-track { display: flex; gap: 56px; white-space: nowrap; animation: scroll 38s linear infinite; }
        body[data-motion="still"] .m-track { animation: none; }
        .m-item { display: inline-flex; align-items: center; gap: 24px; font-family: var(--f-display); font-size: clamp(28px, 3vw, 44px); }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
      `}</style>
    </div>
  );
}

Object.assign(window, {
  PawIcon, Arrow, useRoute, useReveal,
  CursorTrail, TopNav, Footer, Testimonials, Marquee,
  NAV_ITEMS,
});
