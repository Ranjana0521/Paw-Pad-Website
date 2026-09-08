/* home.jsx — Pawpad landing page */

const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

const SERVICES = [
  {
    key: "grooming",
    no: "01",
    title: "Conscious Pet Grooming",
    blurb: "Stress-free grooming for dogs and cats with a focus on coat health, gentle handling, and emotional comfort — never rushed, always mindful.",
    cta: "Book a Grooming Session",
    target: "grooming",
    price: "Gentle grooming",
    points: ["Dog and cat grooming", "Coat health", "Stress-free handling", "Emotional comfort"],
    img: "assets/img/pawpad/grooming-snapshot-new.jpg",
    accent: "champagne",
  },
  {
    key: "myotherapy",
    no: "02",
    title: "Canine Myotherapy & Wellness",
    blurb: "Support your dog's mobility, recovery, and overall wellbeing through gentle bodywork therapy designed to ease tension and improve comfort.",
    cta: "Coming Soon",
    target: "myotherapy",
    price: "Wellness support",
    points: ["Mobility support", "Recovery care", "Gentle bodywork", "Comfort-focused sessions"],
    img: "assets/img/pawpad/myotheraphy-snapshot.webp",
    accent: "eagle",
  },
  {
    key: "courses",
    no: "03",
    title: "Professional Grooming Courses",
    blurb: "Hands-on grooming education for aspiring professionals looking to build real-world skills in conscious dog and cat grooming.",
    cta: "View Course Details",
    target: "courses",
    price: "Hands-on training",
    points: ["Dog grooming", "Cat grooming", "Handling techniques", "Business fundamentals"],
    img: "assets/img/pawpad/courses-snapshot.webp",
    accent: "driftwood",
  },
  {
    key: "boarding",
    no: "04",
    title: "Boarding with Comfort in Mind",
    blurb: "Thoughtful pet boarding designed to help dogs feel secure, relaxed, and cared for while you're away.",
    cta: "Let's onboard your pet",
    target: "boarding",
    price: "Home like care",
    points: ["Comfort-led care", "Secure routines", "Relaxed environment", "Thoughtful attention"],
    img: "assets/img/pawpad/boarding-snapshot.webp",
    accent: "champagne",
  },
];

/* ---------- Hero ---------- */
function Hero({ onBook }) {
  const ref = useRefH(null);
  const [scrollY, setScrollY] = useStateH(0);
  useEffectH(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const motion = document.body.dataset.motion;
  const par = motion === "still" ? 0 : scrollY;

  return (
    <section className="hero" ref={ref}>
      <div className="hero-paws">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="paw-fl" style={{
            left: `${[12, 26, 42, 58, 74, 86, 92][i]}%`,
            top: `${[20, 60, 35, 78, 18, 50, 72][i]}%`,
            transform: `translateY(${par * (0.08 + i*0.03)}px) rotate(${[15,-25,30,-10,40,-30,10][i]}deg)`,
            opacity: 0.13,
          }}>
            <PawIcon size={[24,36,28,42,22,30,26][i]} color="var(--driftwood)" />
          </div>
        ))}
      </div>
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="eyebrow-pill reveal in"><PawIcon size={12} color="currentColor" /> Conscious pet care · Bengaluru · est. 2017</p>
          <h1 className="hero-title reveal in" style={{marginTop: 26}}>
            Conscious Pet<br/>
            Grooming<br/>
            <span className="hero-title-accent">& Holistic Petcare</span><br/>
            in Bangalore
          </h1>
          <p className="lead reveal in" style={{marginTop: 28}}>
            Calm, stress-free grooming, pet wellness therapy, boarding, and professional grooming courses — all designed with your pet's emotional wellbeing in mind.
          </p>
          <p className="hero-sub reveal in" style={{ marginTop: 18, maxWidth: "48ch" }}>{cms.heroSub || "Pawpad offers conscious pet grooming and wellness care designed around your pet's physical and emotional wellbeing. Instead of rushed grooming focused only on looks, we prioritise stress-free handling, coat health, skin care, and calm environments that support long-term comfort for dogs and cats alike."}</p>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-image blob-1" style={{ transform: `translateY(${par * -0.03}px) scale(1)` }}>
            <img
              src={(cms.heroImage && !cms.heroImage.includes("hero-cover-dog-cat")) ? cms.heroImage : "assets/img/pawpad/hero-cover-bernese-cat.webp"}
              alt="A Bernese Mountain Dog and fluffy cat resting together peacefully"
              fetchpriority="high"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "assets/img/pawpad/hero-cover-bernese-cat.webp";
              }}
            />
          </div>
        </div>
      </div>
      <div className="container hero-stats reveal in">
        {statsList.map((st, sidx) => (
          <div key={sidx}><strong>{st.strong}</strong><span>{st.label}</span></div>
        ))}
      </div>
      <style>{`
        .hero {
          padding: 160px 0 64px;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: stretch; justify-content: center;
          gap: 44px;
        }
        .hero-paws { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .paw-fl { position: absolute; transition: transform .15s linear; }
        .hero-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.32fr);
          gap: clamp(18px, 2.5vw, 36px); align-items: center;
        }
        .hero-text { position: relative; z-index: 2; max-width: 470px; }
        .eyebrow-pill {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-body); font-size: 12px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--driftwood-deep);
          background: color-mix(in oklab, var(--champagne), transparent 25%);
          border: 1px solid color-mix(in oklab, var(--driftwood), transparent 70%);
          padding: 8px 16px 8px 12px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .hero-title { font-family: var(--f-display); font-weight: 400; font-size: clamp(38px, 4.6vw, 68px); line-height: 1.04; letter-spacing: -.01em; color: var(--ink); margin: 0; }
        .hero-title-accent {
          background: linear-gradient(100deg, var(--driftwood) 0%, var(--driftwood-deep) 60%, var(--driftwood) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          display: inline-block;
          font-style: italic;
          padding-right: .12em;
          margin-right: -.12em;
        }
        .hero-sub { color: var(--ink-mute); }
        .hero-mobile-break { display: none; }
        .hero-stats {
          position: relative; z-index: 1;
          display: flex; flex-wrap: wrap; justify-content: space-between; gap: 28px;
          padding-top: 24px;
          border-top: 1px solid color-mix(in oklab, var(--ink), transparent 88%);
        }
        .hero-stats div { display: flex; flex-direction: column; gap: 2px; }
        .hero-stats strong {
          font-family: var(--f-display);
          font-size: 44px;
          color: var(--driftwood);
        }
        .hero-stats span {
          font-size: 12.5px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .hero-image-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        .hero-image {
          position: relative;
          width: 100%;
          max-width: clamp(540px, 56vw, 920px);
          height: auto;
          overflow: visible;
          background: transparent;
          animation: none;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        body[data-motion="still"] .hero-image { animation: none; }
        .hero-image img {
          width: 100%;
          max-width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 18px 36px rgba(45, 30, 20, 0.08));
          object-fit: contain;
          border-radius: 0;
          box-shadow: none;
          background: transparent;
          transform: none;
        }
        @media (max-width: 900px) {
          .hero { padding: 110px 0 36px; min-height: 0; gap: 32px; }
          .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 36px; width: 100%; }
          .hero-text {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            padding-right: 0;
            overflow-wrap: break-word;
          }
          .hero-title { max-width: 100%; font-size: clamp(38px, 8.5vw, 62px); }
          .hero-text .lead,
          .hero-text p {
            max-width: 100% !important;
          }
          .hero-image-wrap { height: auto; margin-top: 8px; justify-content: center; }
          .hero-image { width: 100%; max-width: min(100%, 680px); right: auto; top: auto; bottom: auto; margin: 0 auto; justify-content: center; }
          .hero-image img { transform: none; }
          .hero-stats { gap: 24px; }
          .hero-stats strong { font-size: 30px; }
        }
        @media (max-width: 520px) {
          .hero { overflow: hidden; }
          .hero .h-display span { display: inline; }
          .hero-image-wrap { max-width: 100%; }
          .hero-image { max-width: 100%; }
          .hero-image img { transform: none; }
          .hero-cta { flex-direction: column; }
          .hero-cta .btn { width: 100%; justify-content: center; padding-inline: 16px; }
          .hero-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
          .hero-stats span { font-size: 10px; letter-spacing: .08em; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Service cards (expanding hover) ---------- */
function ServiceCards({ navigate, onBook }) {
  const [open, setOpen] = useStateH(null);
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="services-head">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="h-1" style={{marginTop:18, maxWidth:"14ch"}}>
              Services snapshots
            </h2>
          </div>
          <p className="lead" style={{maxWidth:"40ch"}}>
            Each service is built on the same foundation — calm handling, physical comfort, and respect for what your pet is telling us. Tap or hover any card to look closer.
          </p>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, idx) => {
            const isOpen = open === s.key;
            return (
              <article
                key={s.key}
                className={"svc-card " + (isOpen ? "open" : "") + " accent-" + s.accent}
                onMouseEnter={() => setOpen(s.key)}
                onMouseLeave={() => setOpen(null)}
                onClick={() => setOpen(isOpen ? null : s.key)}
                style={{transitionDelay: `${idx * 70}ms`}}
              >
                <div className="svc-img">
                  <img src={s.img} alt={s.title} />
                  <span className="svc-no">{s.no}</span>
                </div>
                <div className="svc-body">
                  <h3 className="h-3">{s.title}</h3>
                  <p className="svc-blurb">{s.blurb}</p>
                  <div className="svc-detail">
                    <ul className="svc-points">
                      {s.points.map(p => <li key={p}><PawIcon size={11} color="var(--driftwood)" /> {p}</li>)}
                    </ul>
                    <div className="svc-foot">
                      <span className="svc-price">{s.price}</span>
                      <div className="svc-actions">
                        {s.key === "myotherapy" ? (
                          <span className="svc-link disabled">{s.cta}</span>
                        ) : (
                          <a href={"#/" + s.target} className="svc-link">{s.cta} <Arrow size={12} /></a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <style>{`
        .services-section { background: var(--cream-bg); padding-top: 0; }
        .services-head {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: end; margin-bottom: 64px;
        }
        .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .svc-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          background: var(--white);
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          cursor: pointer;
          transition: all var(--t-med) var(--ease);
          display: flex; flex-direction: column;
        }
        body[data-palette="dark"] .svc-card { background: color-mix(in oklab, var(--champagne), black 5%); }
        .svc-card.accent-champagne { --acc: var(--champagne-deep); }
        .svc-card.accent-eagle { --acc: var(--eagle); }
        .svc-card.accent-driftwood { --acc: var(--driftwood); }
        .svc-card:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -40px color-mix(in oklab, var(--ink), transparent 60%); }
        .svc-img {
          position: relative; aspect-ratio: 16/9; overflow: hidden;
          background: var(--eagle-soft);
        }
        .svc-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 1.1s var(--ease);
        }
        .svc-card:hover .svc-img img { transform: scale(1.06); }
        .svc-no {
          position: absolute; top: 18px; right: 22px;
          font-family: var(--f-display); font-size: 28px;
          color: var(--cream-bg);
          background: color-mix(in oklab, var(--ink), transparent 25%);
          backdrop-filter: blur(6px);
          padding: 4px 14px; border-radius: 999px;
          line-height: 1;
        }
        .svc-body {
          padding: 28px 32px 32px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .svc-blurb {
          margin: 0;
          font-size: 15px;
          line-height: 1.55;
          color: var(--ink-mute);
        }
        .svc-detail {
          max-height: 0; opacity: 0;
          overflow: hidden;
          transition: max-height var(--t-med) var(--ease), opacity var(--t-fast) var(--ease), margin var(--t-med) var(--ease);
          margin-top: 0;
        }
        .svc-card.open .svc-detail {
          max-height: 360px;
          opacity: 1;
          margin-top: 8px;
        }
        .svc-points {
          list-style: none; padding: 0; margin: 0 0 20px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px;
          font-size: 13.5px;
          color: var(--ink-soft);
        }
        .svc-points li { display: flex; align-items: center; gap: 8px; }
        .svc-foot {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; flex-wrap: nowrap;
          padding-top: 18px;
          border-top: 1px dashed color-mix(in oklab, var(--ink), transparent 80%);
        }
        .svc-price {
          font-family: var(--f-display);
          font-size: 22px;
          color: var(--acc, var(--driftwood));
          white-space: nowrap;
        }
        .svc-actions { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }
        .svc-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600;
          color: var(--ink);
          text-decoration: underline;
          text-decoration-color: color-mix(in oklab, var(--ink), transparent 70%);
          text-underline-offset: 4px;
          white-space: nowrap;
        }
        .svc-link:hover { color: var(--driftwood); }
        .svc-link.disabled { text-decoration: none; color: var(--ink-mute); cursor: default; }
        @media (max-width: 800px) {
          .services-head { grid-template-columns: 1fr; gap: 24px; }
          .services-grid { grid-template-columns: 1fr; }
          .svc-points { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .svc-body { padding: 22px 20px 24px; }
          .svc-price { font-size: 18px; }
          .svc-link { font-size: 12.5px; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Story tease ---------- */
function StoryTease() {
  return (
    <section className="story-tease">
      <div className="container story-grid">
        <div className="story-img-stack reveal">
          <div className="s-img s-img-1 blob-2">
            <img src="assets/img/3.jpg" alt="A dog being gently held" />
          </div>
          <div className="s-img s-img-2 blob-3">
            <img src="assets/img/8.jpg" alt="A relaxed dog at rest" />
          </div>
          <div className="s-floating-card">
            <span className="eyebrow">In memory of</span>
            <h4 className="h-3" style={{marginTop:6}}>Dew <em className="italic" style={{color:"var(--driftwood)", fontSize:".75em"}}>— Puchki —</em></h4>
            <p style={{fontSize:13, marginTop:6, color:"var(--ink-mute)"}}>Leena's Boxer, the heart dog whose unconditional trust shapes everything we do.</p>
          </div>
        </div>
        <div className="story-text reveal">
          <p className="eyebrow">Our story</p>
          <h2 className="h-1" style={{marginTop:18}}>
            "I always wanted <br/>
            to work with animals<br/>
            I just took the long <em className="italic" style={{color:"var(--driftwood)"}}>way</em> to get here"
          </h2>
          <p className="lead" style={{marginTop:28}}>
            Pawpad started in 2015 in a small studio in Kalyan Nagar. Ten years on, it's still the same question we show up with every day: <em className="italic">does this animal feel safe here?</em>
          </p>
          <p style={{marginTop:16, maxWidth:"56ch"}}>
            From rescue work with Bengaluru's streeties to international certifications in feline grooming and canine skin care — every choice we make is rooted in patience and respect for what each animal is telling us.
          </p>
          <a href="#/about" className="btn btn-primary" style={{marginTop:32}}>Read the full story <Arrow /></a>
        </div>
      </div>
      <style>{`
        .story-tease { background: var(--champagne); }
        .story-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .story-img-stack { position: relative; aspect-ratio: 1/1.05; }
        .s-img { position: absolute; overflow: hidden; }
        .s-img img { width: 100%; height: 100%; object-fit: cover; }
        .s-img-1 {
          left: 0; top: 0; width: 70%; height: 70%;
          background: var(--eagle);
          animation: morph 14s ease-in-out infinite alternate;
        }
        .s-img-2 {
          right: 0; bottom: 0; width: 58%; height: 56%;
          background: var(--driftwood);
          animation: morph2 16s ease-in-out infinite alternate;
          box-shadow: -20px 30px 50px -25px color-mix(in oklab, var(--ink), transparent 60%);
        }
        body[data-motion="still"] .s-img-1, body[data-motion="still"] .s-img-2 { animation: none; }
        .s-floating-card {
          position: absolute; left: 8%; bottom: 5%;
          background: var(--cream-bg);
          padding: 18px 22px;
          border-radius: 18px;
          max-width: 260px;
          box-shadow: 0 20px 40px -20px color-mix(in oklab, var(--ink), transparent 60%);
          z-index: 2;
        }
        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; gap: 48px; }
          .story-img-stack { aspect-ratio: 1.1/1; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Philosophy / values strip ---------- */
function ValuesStrip() {
  const items = [
    { title: "Never rushed", body: "We space appointments so every pet gets the time they need. Volume isn't the metric — comfort is." },
    { title: "Listen first", body: "We read body language before we read calendars. A flick of an ear, a sigh, a shift in weight — it all matters." },
    { title: "No sedation", body: "Ever. Some pets need three visits before we touch a clipper. That's care, not a setback." },
    { title: "Skilled with fearful & rescue dogs", body: "Years of rescue work mean we know how to meet fearful, overwhelmed, or unsocialised animals where they are." },
  ];
  return (
    <section className="values-section">
      <div className="container">
        <div className="values-head reveal text-center">
          <p className="eyebrow" style={{justifyContent:"center"}}>The Pawpad way</p>
          <h2 className="h-1" style={{marginTop:18, maxWidth:"22ch", marginInline:"auto"}}>
            Four quiet commitments that <em className="italic" style={{color:"var(--driftwood)"}}>change everything</em>
          </h2>
        </div>
        <div className="values-grid">
          {items.map((it, i) => (
            <div key={it.title} className="value-card reveal" style={{transitionDelay:`${i*100}ms`}}>
              <div className="v-num">0{i+1}</div>
              <h3 className="h-3">{it.title}</h3>
              <p>{it.body}</p>
              <PawIcon size={20} color="var(--eagle-deep)" style={{position:"absolute", bottom:24, right:24, opacity:.45}}/>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .values-section { background: var(--cream-bg); }
        .values-head { margin-bottom: 64px; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .value-card {
          background: var(--champagne-soft);
          border-radius: 24px;
          padding: 32px 28px;
          position: relative;
          min-height: 280px;
          display: flex; flex-direction: column; gap: 14px;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 94%);
          transition: all var(--t-med) var(--ease);
        }
        body[data-palette="dark"] .value-card { background: color-mix(in oklab, var(--champagne), black 5%); }
        .value-card:hover { transform: translateY(-6px); background: var(--white); }
        body[data-palette="dark"] .value-card:hover { background: color-mix(in oklab, var(--champagne), black 0%); }
        .v-num {
          font-family: var(--f-display);
          font-size: 14px;
          color: var(--driftwood);
          letter-spacing: .1em;
        }
        .value-card p { margin: 0; font-size: 14.5px; line-height: 1.6; }
        @media (max-width: 900px) {
          .values-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .values-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

/* ---------- Home page ---------- */
function HomePage({ onBook, navigate }) {
  useReveal();
  return (
    <div className="page-enter">
      <Hero onBook={onBook} />
      <ServiceCards navigate={navigate} onBook={onBook} />
      <Marquee items={["conscious grooming", "calm handling", "no sedation", "streetie-friendly", "kalyan nagar", "since 2015", "made with care"]} />
      <ValuesStrip />
      <Testimonials />
    </div>
  );
}

Object.assign(window, { HomePage, SERVICES });
