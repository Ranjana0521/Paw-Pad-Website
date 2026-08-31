
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const DEFAULT_CERTS = [
  {
    name: "Certified Master Cat Groomer",
    org: "Professional Cat Groomers Association of America",
    body: "An internationally recognised certification focused specifically on feline grooming, behaviour, handling, and safety — ensuring cats are groomed with techniques designed around their unique coat, temperament, stress responses, and overall wellbeing."
  },
  {
    name: "PetCPR+ Certified",
    org: "Pet Emergency Education",
    body: "Emergency response knowledge including pet CPR, first aid, and recognising signs of distress. An extra layer of preparedness and safety while handling animals in a grooming environment."
  },
  {
    name: "Certified Canine Esthetician",
    org: "Advanced canine skin & coat training",
    body: "Advanced training focused on canine skin and coat health, specialised treatments, and holistic grooming care — addressing dryness, irritation, sensitivity, and overall skin wellness."
  },
  {
    name: "Certified Coat Expert",
    org: "Plush Puppy India",
    body: "Specialised education in coat textures, breed-specific coat care, maintenance techniques, and grooming products — creating grooming plans suited to each dog's individual coat type and long-term coat health."
  }
];

const DEFAULT_STORY_PARAGRAPHS = [
  "I always wanted to work with animals. I just took the long way to get here...",
  "For a long time, I was looking for something and didn't quite know what. I taught dance. I ran a clothing store. I got married and moved to London, where I worked at a bridal shop. Each thing was fine. None of it felt like mine.",
  "I grew up loving animals but had talked myself out of that path early — I was terrible at science, the formal routes felt out of reach, and so the dream stayed quietly in the background while I tried other things.",
  "Every morning on the way to work in London, I walked past a pet grooming studio. I'd slow down without meaning to, just watching the animals inside, the way someone was caring for them. Something about it stayed with me. I didn't do anything about it then. I just kept walking.",
  "I came back to Bangalore pregnant with my son, and somewhere between the anticipation of a new baby and the uncertainty of what came next, that old feeling returned — the one from the London window. When my son was a little older and started going to Green Pocket, I noticed a boarding space right next door called Petstepin. I walked in one afternoon. And that was that.",
  "I reached out to Ashita Mathew at Wags and Wiggles to do my certification. Balak, my husband, paid for the course without hesitation. He believed this was worth doing before I had fully convinced myself of it. When I was ready to start Pawpad in 2017, he funded that too. There would be no Pawpad without him, and I want to say that plainly.",
  "It was at Wags and Wiggles that I first met Sindhoor Pangal. She ran her dog behaviour practice from the studio above — and what began as proximity became something much more important. Sindhoor became a mentor. Not just in the technical sense, but in the deeper one — the kind of mentor who makes space for your fears, who lets you speak the things you're not sure of yet, and who doesn't rush you past the uncertainty. Her thinking on animal behaviour and what dogs are actually communicating has shaped how I see every single animal that comes through Pawpad's door.",
  "That relationship has continued. I went on to study Canine 101 with BHARCS — Sindhoor's organisation — and the community there has become genuinely important to me. These are people who take animal psychology seriously, who are always learning, and who hold each other to a standard of care that I find both challenging and grounding.",
  "I spent two years working at Cessna before going out on my own — learning not just technique, but how to read an animal. How to tell the difference between a dog that's coping and one that's shutting down. How to make the whole experience feel less like something being done to them."
];

function AboutHero() {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("about") : (window.PawpadContentStore ? window.PawpadContentStore.get("about") : {});
  const hero = cms.hero || {
    eyebrow: "About Pawpad",
    title: "Our story",
    lead: "Pawpad is a conscious pet care studio in Kalyan Nagar, Bengaluru. Founded in 2017 by Leena Munikempanna, we offer grooming, wellness therapy, boarding, and professional courses — all built around a single idea: every animal deserves to feel safe in our hands.",
    metaFounded: "2017",
    metaStudio: "Kalyan Nagar",
    metaRunBy: "Leena Munikempanna"
  };

  return /* @__PURE__ */ React.createElement("section", { className: "about-hero" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow reveal in" }, hero.eyebrow || "About Pawpad"), /* @__PURE__ */ React.createElement("h1", { className: "h-display reveal in", style: { marginTop: 24, maxWidth: "16ch" } }, hero.title || "Our story"), /* @__PURE__ */ React.createElement("div", { className: "about-hero-grid" }, /* @__PURE__ */ React.createElement("p", { className: "lead reveal", style: { maxWidth: "52ch" } }, hero.lead || "Pawpad is a conscious pet care studio in Kalyan Nagar, Bengaluru. Founded in 2017 by Leena Munikempanna, we offer grooming, wellness therapy, boarding, and professional courses — all built around a single idea: every animal deserves to feel safe in our hands."), /* @__PURE__ */ React.createElement("div", { className: "about-meta reveal" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "mute" }, "Founded"), /* @__PURE__ */ React.createElement("strong", null, hero.metaFounded || "2017")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "mute" }, "Studio"), /* @__PURE__ */ React.createElement("strong", null, hero.metaStudio || "Kalyan Nagar")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "mute" }, "Run by"), /* @__PURE__ */ React.createElement("strong", null, hero.metaRunBy || "Leena Munikempanna"))))), /* @__PURE__ */ React.createElement("style", null, `
        .about-hero { padding: 180px 0 0; }
        .about-hero-grid {
          margin-top: 56px; display: grid;
          grid-template-columns: 1.4fr 1fr; gap: 80px; align-items: end;
        }
        .about-meta { display: flex; flex-direction: column; gap: 18px; padding-left: 32px; border-left: 1px solid color-mix(in oklab, var(--ink), transparent 85%); }
        .about-meta div { display: flex; flex-direction: column; gap: 2px; }
        .about-meta span { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; }
        .about-meta strong { font-family: var(--f-display); font-size: 28px; }
        .about-hero-images { margin-top: 96px; padding-bottom: 0; }
        .ahi-row { display: grid; grid-template-columns: 1.3fr 1fr 1.1fr; gap: 18px; height: clamp(280px, 38vw, 460px); }
        .ahi { overflow: hidden; background: var(--eagle); }
        .ahi img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 900px) {
          .about-hero-grid { grid-template-columns: 1fr; gap: 36px; }
          .about-meta { padding-left: 0; border-left: 0; flex-direction: row; flex-wrap: wrap; gap: 32px; }
          .ahi-row { grid-template-columns: 1fr 1fr; height: auto; }
          .ahi-row .ahi:nth-child(3) { display: none; }
          .ahi { aspect-ratio: 1/1; }
        }
      `));
}

function FounderStory() {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("about") : (window.PawpadContentStore ? window.PawpadContentStore.get("about") : {});
  const founder = cms.founder || {};
  const paragraphs = Array.isArray(founder.paragraphs) && founder.paragraphs.length > 0 ? founder.paragraphs : DEFAULT_STORY_PARAGRAPHS;

  return /* @__PURE__ */ React.createElement("section", { className: "founder-story" }, /* @__PURE__ */ React.createElement("div", { className: "container founder-grid" }, /* @__PURE__ */ React.createElement("aside", { className: "founder-side reveal" }, /* @__PURE__ */ React.createElement("div", { className: "founder-portrait blob-2" }, /* @__PURE__ */ React.createElement("img", { src: founder.portrait || "assets/img/pawpad/leena-portrait.webp", alt: (founder.name || "Leena Munikempanna") + ", founder of Pawpad", loading: "lazy", decoding: "async" })), /* @__PURE__ */ React.createElement("div", { className: "founder-sig" }, /* @__PURE__ */ React.createElement("h4", { className: "h-3", style: { fontFamily: "var(--f-display)" } }, founder.name || "Leena Munikempanna"), /* @__PURE__ */ React.createElement("p", { className: "mute", style: { margin: 0, fontSize: 14 } }, founder.role || "Founder · Pawpad · since 2017")), /* @__PURE__ */ React.createElement("div", { className: "founder-quote" }, /* @__PURE__ */ React.createElement(PawIcon, { size: 22, color: "var(--driftwood)" }), /* @__PURE__ */ React.createElement("p", { className: "italic" }, founder.quote || '"Every animal deserves someone who stops. Who looks. Who stays."'))), /* @__PURE__ */ React.createElement("div", { className: "founder-main reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, founder.eyebrow || "Our story · told by Leena"), paragraphs.map((p, i) => /* @__PURE__ */ React.createElement("p", { key: i, className: i === 0 ? "first" : "" }, p)), /* @__PURE__ */ React.createElement("div", { className: "dew-callout" }, /* @__PURE__ */ React.createElement("div", { className: "dew-img blob-3" }, /* @__PURE__ */ React.createElement("img", { src: founder.dewImg || "assets/img/pawpad/about-puchki.webp", alt: "A dog who reminds us of Dew", loading: "lazy", decoding: "async" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "eyebrow", style: { color: "var(--driftwood)" } }, founder.dewEyebrow || "In memory of"), /* @__PURE__ */ React.createElement("h3", { className: "h-3", style: { marginTop: 8 } }, (founder.dewTitle || "Dew") + " ", /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)", fontSize: ".75em" } }, founder.dewSubtitle || "— Puchki —")), /* @__PURE__ */ React.createElement("p", { style: { marginTop: 8 } }, founder.dewText || "My Boxer, my heart dog. We also called her Puchki, for her punched-up face. She was with me for thirteen years, through every move, every chapter. She never judged, never asked for more than I could give, and was always, always there. She's the reason I understand in my bones what it means for an animal to fully trust a person. Everything I do at Pawpad, I measure against what she taught me."), /* @__PURE__ */ React.createElement("p", { style: { marginTop: 8, fontStyle: "italic", color: "var(--driftwood)" } }, founder.dewDedication || "— In memory of Dew (Puchki), the best girl."))), /* @__PURE__ */ React.createElement("p", null, founder.closingParagraph1 || "I have always had a deep connection with India's streeties. They live on the edges. Unloved by most, uncared for, existing just outside the boundary of where belonging is granted. And yet there is so much in them — such freedom, such joy in small things, such depth of feeling — that anyone who stops long enough to really look is met with a whirlwind of warmth and life."), /* @__PURE__ */ React.createElement("p", null, founder.closingParagraph2 || "I see myself in them. I know what it is to live a little outside, to carry more than people assume, to light up completely when someone finally takes the time to see you. That recognition is part of why I do this work. Every animal deserves someone who stops. Who looks. Who stays."), /* @__PURE__ */ React.createElement("p", { className: "closing" }, founder.closingParagraph3 || "Pawpad has been running out of Kalyan Nagar since 2017. We groom dogs and cats — and we do it with eight years of learning behind every session. We also run grooming courses and work with rescues. But the thing that hasn't changed across all of it is the question I show up with every day: ", /* @__PURE__ */ React.createElement("em", { className: "italic" }, "does this animal feel safe here?")), /* @__PURE__ */ React.createElement("div", { className: "signoff" }, founder.signoff || "— Leena, founder, Pawpad"))), /* @__PURE__ */ React.createElement("style", null, `
        .founder-story { background: var(--champagne-soft); }
        .founder-grid { display: grid; grid-template-columns: 360px 1fr; gap: 80px; align-items: start; }
        .founder-side { position: sticky; top: 120px; display: flex; flex-direction: column; gap: 24px; }
        .founder-portrait { aspect-ratio: 4/5; overflow: hidden; background: transparent; }
        .founder-portrait img { width: 100%; height: 100%; object-fit: contain; object-position: center top; }
        .founder-placeholder { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--eagle-soft), var(--champagne)); color: var(--driftwood-deep); }
        .founder-placeholder span { font-family: var(--f-display); font-size: clamp(48px, 5vw, 76px); }
        .founder-sig { padding-left: 6px; }
        .founder-quote {
          padding: 24px;
          background: var(--cream-bg);
          border-radius: 18px;
          display: flex; flex-direction: column; gap: 12px;
          border-left: 3px solid var(--driftwood);
        }
        .founder-quote p { font-family: var(--f-display); font-size: 22px; line-height: 1.3; color: var(--ink); margin:0; }
        .founder-main p { font-size: 17px; line-height: 1.75; margin: 0 0 22px; max-width: 64ch; }
        .founder-main p.first {
          font-family: var(--f-display);
          font-size: clamp(28px, 3vw, 44px);
          line-height: 1.15;
          color: var(--ink);
          margin: 24px 0 36px;
          max-width: 20ch;
        }
        .founder-main p.closing { font-style: italic; font-size: 19px; color: var(--ink); }
        .dew-callout {
          display: grid; grid-template-columns: 240px 1fr; gap: 32px;
          padding: 36px; border-radius: 24px;
          background: var(--white);
          margin: 36px 0;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
        }
        body[data-palette="dark"] .dew-callout { background: color-mix(in oklab, var(--champagne), black 5%); }
        .dew-img { aspect-ratio: 1/1; overflow: hidden; background: transparent; }
        .dew-img img { width: 100%; height: 100%; object-fit: cover; }
        .signoff {
          font-family: var(--f-display);
          font-size: 32px;
          color: var(--driftwood);
          margin-top: 12px;
        }
        @media (max-width: 900px) {
          .founder-grid { grid-template-columns: 1fr; gap: 48px; }
          .founder-side { position: static; }
          .dew-callout { grid-template-columns: 1fr; padding: 24px; }
        }
      `));
}

function Philosophy() {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("about") : (window.PawpadContentStore ? window.PawpadContentStore.get("about") : {});
  const phil = cms.philosophy || {};
  const defaultParagraphs = [
    "At Pawpad, we believe grooming is about far more than appearance. It is about comfort, trust, emotional wellbeing, and creating positive experiences that help pets feel safe in our care.",
    "Every animal is different. Some arrive curious and confident, while others may be anxious, sensitive, elderly, rescued, or completely new to grooming. Rather than following a fixed approach, we adapt each session to the individual animal in front of us — their temperament, coat condition, physical comfort, and emotional state.",
    "Our philosophy is rooted in listening. Dogs and cats communicate constantly through their body language, behaviour, and responses to handling. We pay close attention to these signals and adjust our pace accordingly. Sometimes that means taking extra time. Sometimes it means giving a pet a break. And sometimes it means doing less in a session so that trust can be built over time.",
    "We do not believe in rushed grooming, force-based handling, or prioritising cosmetic results over an animal's wellbeing. Instead, we focus on creating calm, low-stress experiences that support healthy skin, coat maintenance, hygiene, mobility, and emotional comfort.",
    "Years of working with pets, rescue animals, and community animals have reinforced one simple belief: every animal deserves to be treated with patience, compassion, and respect. That belief guides every decision we make, from the way appointments are scheduled to the way pets are handled throughout their visit.",
    "For us, successful grooming is not just about how a pet looks when they leave. It is about how they feel, and whether they leave more comfortable, more confident, and more willing to return the next time."
  ];
  const paragraphs = Array.isArray(phil.paragraphs) && phil.paragraphs.length > 0 ? phil.paragraphs : defaultParagraphs;
  const gallery = Array.isArray(phil.gallery) && phil.gallery.length > 0 ? phil.gallery : [
    "assets/img/pawpad/about-our-philosophy-collage.webp",
    "assets/img/pawpad/about-our-philosophy-collage-2.webp",
    "assets/img/pawpad/about-our-philosophy-collage-3.webp",
    "assets/img/pawpad/about-our-philosophy-collage-4.webp",
    "assets/img/pawpad/about-our-philosophy-collage-5.webp"
  ];

  return /* @__PURE__ */ React.createElement("section", { className: "philosophy" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "philosophy-head reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, phil.eyebrow || "Our philosophy"), /* @__PURE__ */ React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "18ch" } }, phil.title || "Our Philosophy")), /* @__PURE__ */ React.createElement("div", { className: "phil-grid" }, /* @__PURE__ */ React.createElement("div", { className: "phil-text reveal" }, /* @__PURE__ */ React.createElement("p", { className: "lead" }, phil.lead || paragraphs[0]), paragraphs.slice(1).map((p, idx) => /* @__PURE__ */ React.createElement("p", { key: idx }, p))), /* @__PURE__ */ React.createElement("div", { className: "phil-gallery reveal" }, gallery.map((img, gidx) => /* @__PURE__ */ React.createElement("div", { key: gidx, className: "phil-tile" }, /* @__PURE__ */ React.createElement("img", { src: img.startsWith("assets/") ? img : `assets/img/pawpad/${img}`, alt: "Pawpad philosophy", loading: "lazy" })))))), /* @__PURE__ */ React.createElement("style", null, `
        .philosophy { background: var(--cream-bg); padding-top: 48px; padding-bottom: 48px; }
        .philosophy-head { max-width: 720px; margin-bottom: 48px; }
        .phil-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .phil-text p { margin: 0 0 20px; font-size: 16px; line-height: 1.7; max-width: 56ch; }
        .phil-text strong { color: var(--ink); font-weight: 600; }
        .phil-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .phil-tile { aspect-ratio: 1; overflow: hidden; border-radius: 16px; background: var(--eagle); }
        .phil-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
        .phil-tile:hover img { transform: scale(1.06); }
        @media (max-width: 900px) {
          .phil-grid { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 520px) {
          .phil-gallery { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `));
}

function StudioStrip() {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("about") : (window.PawpadContentStore ? window.PawpadContentStore.get("about") : {});
  const studio = cms.studio || {};
  const defaultItems = [
    { img: "assets/img/pawpad/about-studio-ample-spacing.webp", caption: "Ample spacing" },
    { img: "assets/img/pawpad/about-studio-images-hygienic.webp", caption: "Hygienic setup" },
    { img: "assets/img/pawpad/experience-space-2.webp", caption: "Quiet studio" },
    { img: "assets/img/pawpad/experience-space-3.webp", caption: "Calm care area" }
  ];
  const items = Array.isArray(studio.items) && studio.items.length > 0 ? studio.items : defaultItems;

  return /* @__PURE__ */ React.createElement("section", { className: "studio" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "studio-head reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, studio.eyebrow || "The studio"), /* @__PURE__ */ React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "18ch" } }, (studio.title || "A cozy space ") + " ", /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, studio.titleAccent || "Oodles of patience")), /* @__PURE__ */ React.createElement("p", { className: "lead", style: { marginTop: 24, maxWidth: "56ch" } }, studio.lead || "Tucked into Kalyan Nagar, our studio is intentionally quiet — soft lighting, low chatter, no waiting-room crowds. Pets get time to settle before anything begins.")), /* @__PURE__ */ React.createElement("div", { className: "studio-strip reveal" }, items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "studio-cell", style: { transitionDelay: `${i * 100}ms` } }, /* @__PURE__ */ React.createElement("img", { src: item.img.startsWith("assets/") ? item.img : `assets/img/pawpad/${item.img}`, alt: `Pawpad studio ${i + 1}` }), /* @__PURE__ */ React.createElement("span", { className: "studio-caption" }, item.caption))))), /* @__PURE__ */ React.createElement("style", null, `
        .studio { background: var(--cream-bg); }
        .studio-head { max-width: 720px; margin-bottom: 56px; }
        .studio-strip { display: grid; grid-template-columns: 1.2fr .9fr .9fr 1fr; gap: 14px; height: clamp(320px, 40vw, 480px); }
        .studio-cell {
          position: relative; overflow: hidden; border-radius: 18px;
          background: var(--eagle); transition: flex var(--t-med) var(--ease);
        }
        .studio-cell img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s var(--ease); }
        .studio-cell:hover img { transform: scale(1.05); }
        .studio-caption {
          position: absolute; left: 16px; bottom: 16px;
          background: color-mix(in oklab, var(--cream-bg), transparent 12%);
          backdrop-filter: blur(8px);
          padding: 6px 12px; border-radius: 999px;
          font-size: 12px; font-weight: 600; letter-spacing: .04em;
          color: var(--ink);
        }
        @media (max-width: 800px) {
          .studio-strip { grid-template-columns: 1fr 1fr; height: auto; }
          .studio-cell { aspect-ratio: 4/3; }
        }
      `));
}

function Certifications() {
  const [open, setOpen] = useStateA(0);
  const cms = (typeof useCmsContent === "function") ? useCmsContent("about") : (window.PawpadContentStore ? window.PawpadContentStore.get("about") : {});
  const certsData = cms.certifications || {};
  const certsList = Array.isArray(certsData.certsList) && certsData.certsList.length > 0 ? certsData.certsList : DEFAULT_CERTS;

  return /* @__PURE__ */ React.createElement("section", { className: "certs" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "certs-head reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, certsData.eyebrow || "Certifications"), /* @__PURE__ */ React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "22ch" } }, certsData.title || "Professional education"), /* @__PURE__ */ React.createElement("p", { className: "lead", style: { marginTop: 24, maxWidth: "60ch" } }, certsData.lead || "Professional education plays an important role in how we care for animals. Leena continues to expand her knowledge through internationally recognised certifications in grooming, coat care, pet wellness, and emergency care.")), /* @__PURE__ */ React.createElement("div", { className: "certs-list reveal" }, certsList.map((c, i) => {
    const isOpen = open === i;
    return /* @__PURE__ */ React.createElement("button", { key: c.name || i, className: "cert-row " + (isOpen ? "open" : ""), onClick: () => setOpen(isOpen ? -1 : i) }, /* @__PURE__ */ React.createElement("div", { className: "cert-row-head" }, /* @__PURE__ */ React.createElement("span", { className: "cert-no" }, "0", i + 1), /* @__PURE__ */ React.createElement("div", { className: "cert-row-title" }, /* @__PURE__ */ React.createElement("h3", { className: "h-3" }, c.name), /* @__PURE__ */ React.createElement("span", { className: "cert-org" }, c.org)), /* @__PURE__ */ React.createElement("span", { className: "cert-plus", "aria-hidden": "true" }, isOpen ? "\u2212" : "+")), /* @__PURE__ */ React.createElement("div", { className: "cert-body" }, /* @__PURE__ */ React.createElement("p", null, c.body)));
  }))), /* @__PURE__ */ React.createElement("style", null, `
        .certs { background: var(--ink); color: var(--cream-bg); }
        .certs .eyebrow { color: var(--champagne); }
        .certs .eyebrow::before { background: var(--champagne); }
        .certs h2, .certs h3 { color: var(--cream-bg); }
        .certs p { color: color-mix(in oklab, var(--cream-bg), transparent 25%); }
        .certs-head { max-width: 760px; margin-bottom: 56px; }
        .certs-list { display: flex; flex-direction: column; gap: 0; border-top: 1px solid color-mix(in oklab, var(--cream-bg), transparent 86%); }
        .cert-row {
          width: 100%; text-align: left;
          padding: 32px 0;
          border-bottom: 1px solid color-mix(in oklab, var(--cream-bg), transparent 86%);
          color: var(--cream-bg);
          transition: padding var(--t-fast) var(--ease);
        }
        .cert-row:hover { padding-left: 12px; }
        .cert-row-head { display: grid; grid-template-columns: 60px 1fr 40px; gap: 24px; align-items: center; }
        .cert-no { font-family: var(--f-display); font-size: 28px; color: var(--driftwood); }
        .cert-row-title { display: flex; flex-direction: column; gap: 4px; }
        .cert-org { font-size: 13px; color: var(--eagle); letter-spacing: .04em; }
        .cert-plus {
          font-family: var(--f-display); font-size: 32px; color: var(--driftwood);
          transition: transform var(--t-fast) var(--ease);
          line-height: 1;
        }
        .cert-row.open .cert-plus { color: var(--cream-bg); }
        .cert-body {
          max-height: 0; overflow: hidden;
          transition: max-height var(--t-med) var(--ease), padding var(--t-med) var(--ease);
          padding-left: 84px;
        }
        .cert-row.open .cert-body { max-height: 240px; padding-top: 18px; }
        .cert-body p { max-width: 68ch; margin: 0; line-height: 1.65; }
        @media (max-width: 700px) {
          .cert-row-head { grid-template-columns: 40px 1fr 30px; gap: 16px; }
          .cert-no { font-size: 22px; }
          .cert-body { padding-left: 56px; }
        }
      `));
}

function AboutPage({ onBook }) {
  useReveal();
  return /* @__PURE__ */ React.createElement("div", { className: "page-enter" }, /* @__PURE__ */ React.createElement(AboutHero, null), /* @__PURE__ */ React.createElement(FounderStory, null), /* @__PURE__ */ React.createElement(Philosophy, null), /* @__PURE__ */ React.createElement(StudioStrip, null), /* @__PURE__ */ React.createElement(Certifications, null));
}

Object.assign(window, { AboutPage });
