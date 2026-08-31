
const { useState: useStateG } = React;
const GROOM_PACKAGES = [
  {
    cat: "Puppy",
    key: "puppy-short",
    title: "Puppy Grooming | Short Hair",
    sub: "Gentle introductions for puppies below 3 months",
    price: "₹1,000",
    duration: "Gentle intro",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-puppy-short-hair-image.webp",
    includes: ["Eye & ear cleaning", "Teeth brushing", "Nail clipping", "Bath & coat conditioning", "Complete blow dry", "Coat brushing", "Paw & snout butter", "Organic leave-in conditioner"],
    note: "A calm first grooming experience that helps puppies get comfortable with handling, bathing, drying, and basic care routines."
  },
  {
    cat: "Puppy",
    key: "puppy-long",
    title: "Puppy Grooming | Long Hair",
    sub: "Extra coat care for long-coated puppies",
    price: "₹1,500",
    duration: "Long coat care",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-puppy-long-hair-image.webp",
    includes: ["Eye & ear cleaning", "Teeth brushing", "Nail clipping", "Bath & coat conditioning", "Complete blow dry", "Coat brushing & deshedding", "Hygiene clip", "Face trimming", "Paw & snout butter", "Organic leave-in conditioner"],
    note: "Designed for long-coated puppies who need additional brushing, deshedding support, and a patient introduction to coat maintenance."
  },
  {
    cat: "Dog",
    key: "dog-short",
    title: "Dog Grooming | Short Hair",
    sub: "Clean, comfortable care for short coats",
    price: "₹1,600",
    duration: "Coat care",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-dog-short-hair-image.webp",
    includes: ["Bath & coat conditioning", "Complete blow dry", "Coat brushing", "Eye & ear cleaning", "Nail clipping", "Paw care"],
    note: "A complete grooming reset for short-coated dogs, focused on skin health, hygiene, shedding control, and comfort."
  },
  {
    cat: "Dog",
    key: "dog-long",
    title: "Dog Grooming | Long Hair",
    sub: "Maintenance for longer coats",
    price: "₹2,000",
    duration: "Detailed coat care",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-gromming-long-hair-dog.webp",
    includes: ["Bath & conditioning", "Full blow dry", "Coat brushing", "Deshedding support", "Face trimming", "Hygiene clip"],
    note: "For dogs who need more detailed coat work, careful brushing, and slow handling so longer sessions remain comfortable."
  },
  {
    cat: "Styling",
    key: "dog-grooming-long-hair",
    title: "Dog Grooming Long Hair with haircut",
    sub: "Full styling session for long-coated dogs",
    price: "₹2,500",
    duration: "Styling session",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-dog-long-hair-haircut.webp",
    includes: ["Bath & Conditioning", "Coat trimming & scissoring", "Face and paw tidying", "Breed-aware styling", "Comfort breaks", "Deshedding support", "Finish & coat treatment"],
    note: "A complete styling session for long-coated dogs — balancing breed-specific shape, coat health, and your dog's comfort throughout."
  },
  {
    cat: "Care",
    key: "matted-dogs",
    title: "Matted Dogs",
    sub: "Careful support for tangled coats",
    price: "₹850",
    duration: "Assessment first",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-grooming-matted-dogs.webp",
    includes: ["Coat assessment", "Gentle dematting where possible", "Clip-down when needed", "Aftercare guidance"],
    note: "For coats with matting or tangles. We prioritise comfort and skin safety over cosmetic results."
  },
  {
    cat: "Cat",
    key: "cat-short",
    title: "Cat Grooming | Short Hair",
    sub: "Calm coat and hygiene care for short-haired cats",
    price: "₹1,500",
    duration: "Feline care",
    isCatOnly: true,
    petType: "Cat",
    img: "assets/img/pawpad/cat-grooming-short-hair.webp",
    includes: ["Coat brushing", "Eye & ear cleaning", "Nail clipping", "Gentle bath", "Hygiene check", "Low-stress handling"],
    note: "For cats who need careful coat maintenance, hygiene support, and patient handling in a quiet environment."
  },
  {
    cat: "Cat",
    key: "cat-long",
    title: "Cat Grooming | Long Hair",
    sub: "Extra support for long coats and tangles",
    price: "₹2,000",
    duration: "Detailed feline care",
    isCatOnly: true,
    petType: "Cat",
    img: "assets/img/pawpad/cat-grooming-long-hair.webp",
    includes: ["Coat brushing", "Mat assessment", "Gentle dematting where possible", "Sanitary trim", "Nail clipping", "Gentle bath", "Aftercare guidance"],
    note: "For long-haired cats who need detailed coat work, with comfort and consent guiding every step."
  },
  {
    cat: "Cat",
    key: "cat-haircut",
    title: "Cat Hair Cut",
    sub: "Complete haircut and hygiene care for cats",
    price: "₹1,500",
    duration: "Feline styling",
    isCatOnly: true,
    petType: "Cat",
    img: "assets/img/pawpad/cat-hair-cut.webp",
    includes: ["Nail clipping", "Hair cut", "Ear cleaning", "Eye cleaning"],
    note: "A complete haircut and gentle care session for cats, including nail clipping, hair cut, ear cleaning, and eye cleaning with patient handling."
  },
  {
    cat: "Care",
    key: "hygiene-clip",
    title: "Hygiene Clip",
    sub: "Focused hygiene maintenance",
    price: "₹850",
    duration: "Targeted care",
    allowPetTypeSelection: true,
    img: "assets/img/pawpad/grooming-page-grooming-hygine-clip.webp",
    includes: ["Sanitary trimming", "Paw tidying", "Comfort-led handling", "Coat check"],
    note: "A targeted service for pets who need hygiene-focused trimming without a full grooming session."
  },
  {
    cat: "Care",
    key: "nail-clipping",
    title: "Nail Clipping",
    sub: "Slow, gentle nail care",
    price: "₹250",
    duration: "Quick visit",
    allowPetTypeSelection: true,
    img: "assets/img/pawpad/grooming-nail-clipping-new.webp",
    includes: ["Nail trimming", "Paw handling support", "Breaks for anxious pets", "Comfort checks"],
    note: "Gentle nail care for pets who need a quick maintenance visit or extra patience around paw handling."
  },
  {
    cat: "Wellness",
    key: "massage",
    title: "Massage",
    sub: "Pre & post grooming wellness add-on",
    price: "₹1,500",
    duration: "Wellness add-on",
    allowPetTypeSelection: true,
    img: "assets/img/pawpad/grooming-page-grooming-massage.webp",
    includes: ["Gentle pre-grooming settling", "Grooming begins only when they're ready", "Post-grooming relaxation massage", "Led by your dog's comfort, never the clock"],
    note: "A quiet moment of care that helps your dog settle before grooming and gently unwind afterwards. Available exclusively as a pre and post grooming add-on."
  },
  {
    cat: "Care",
    key: "bath-brush-dogs",
    title: "Bath & Brush | Dogs",
    sub: "Essential Wash",
    price: "₹999",
    duration: "BATH & BRUSH",
    isDogOnly: true,
    petType: "Dog",
    img: "assets/img/pawpad/grooming-page-dog-long-hair-haircut.webp",
    includes: [
      "Bath",
      "Full blow dry",
      "Coat brushing"
    ],
    notIncludes: [
      "Nail trim, ear cleaning, or anal gland expression",
      "Hygiene clip, scissoring, or clipping",
      "Matted coats or dogs needing extra care"
    ],
    note: "A fast, no-fuss clean for dogs who don't need a full groom — just a wash, dry, and brush-out between full sessions."
  },
  {
    cat: "Care",
    key: "bath-brush-cats",
    title: "Bath & Brush | Cats",
    sub: "Essential Wash",
    price: "₹999",
    duration: "BATH & BRUSH",
    isCatOnly: true,
    petType: "Cat",
    img: "assets/img/pawpad/bath-brush-cats.webp",
    includes: [
      "Bath",
      "Full blow dry",
      "Coat brushing"
    ],
    notIncludes: [
      "Nail trim, ear cleaning, or anal gland expression",
      "Hygiene clip, scissoring, or clipping",
      "Matted coats or cats needing extra care"
    ],
    note: "A fast, no-fuss clean for cats who don't need a full groom — just a wash, dry, and brush-out between full sessions."
  },
  {
    cat: "Care",
    key: "bath-brush-subscription",
    title: "Bath & Brush Subscription package",
    sub: "Essential Wash",
    price: "₹3,496.50",
    priceNum: 3496.5,
    duration: "VALID 2 MONTHS",
    allowPetTypeSelection: true,
    img: "assets/img/pawpad/bath-brush-subscription.webp",
    includes: [
      "4 Bath & Brush sessions",
      "For dogs & cats",
      "Valid for 2 months from purchase",
      "Non-transferable"
    ],
    notIncludes: [
      "Nail trim, ear cleaning, or anal gland expression",
      "Hygiene clip, scissoring, or clipping",
      "Unused sessions do not roll over or qualify for a refund"
    ],
    note: "Keep your pet's coat consistently clean and healthy with regular bath-and-brush visits, spaced through the month."
  }
];
const ADD_ONS = [
  { name: "Deep deshedding (FURminator+)", price: "+ ₹500" },
  { name: "Hot oil & coat mask", price: "+ ₹400" },
  { name: "Anti-tick herbal bath", price: "+ ₹300" },
  { name: "Blueberry facial", price: "+ ₹250" },
  { name: "Teeth scaling (cosmetic)", price: "+ ₹350" },
  { name: "Pawpad signature pamper-pack", price: "+ ₹900" }
];
function GroomingHero({ onBook }) {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("grooming") : (window.PawpadContentStore ? window.PawpadContentStore.get("grooming") : {});
  return /* @__PURE__ */ React.createElement("section", { className: "g-hero" }, /* @__PURE__ */ React.createElement("div", { className: "container g-hero-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "eyebrow reveal in" }, cms.eyebrow || "Grooming services"), /* @__PURE__ */ React.createElement("h1", { className: "h-display reveal in", style: { marginTop: 24 } }, cms.title || "Stress-free ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "grooming")), /* @__PURE__ */ React.createElement("p", { className: "lead reveal in", style: { marginTop: 24, maxWidth: "54ch" } }, cms.lead || "Conscious pet grooming in Bangalore — built around coat health, hygiene, gentle handling, and emotional wellbeing. Every session is paced around your pet's comfort."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: onBook }, "Book a grooming session ", /* @__PURE__ */ React.createElement(Arrow, null)), /* @__PURE__ */ React.createElement("a", {
    href: "#packages", className: "btn btn-ghost", onClick: (e) => {
      var _a;
      e.preventDefault();
      (_a = document.getElementById("packages")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }
  }, "View packages ", /* @__PURE__ */ React.createElement(Arrow, null)))), /* @__PURE__ */ React.createElement("div", { className: "g-hero-img reveal in" }, /* @__PURE__ */ React.createElement("div", { className: "blob-1" }, /* @__PURE__ */ React.createElement("img", { src: cms.heroImage || "assets/img/pawpad/grooming-snapshot-new.webp", alt: "A dog being groomed", fetchpriority: "high", decoding: "async" })))), /* @__PURE__ */ React.createElement("style", null, `
        .g-hero { padding: 180px 0 60px; }
        .g-hero-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: center; }
        .g-hero-img .blob-1 {
          aspect-ratio: 1/1; overflow: hidden; background: var(--eagle);
          animation: morph 14s ease-in-out infinite alternate;
        }
        body[data-motion="still"] .g-hero-img .blob-1 { animation: none; }
        .g-hero-img img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 900px) {
          .g-hero-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `));
}
function getGroomingPackageSortScore(pkg) {
  if (!pkg) return 999;
  const key = String(pkg.key || "").toLowerCase().trim();
  const title = String(pkg.title || "").toLowerCase().trim();
  const cat = String(pkg.cat || "").toLowerCase().trim();
  const petType = String(pkg.petType || "").toLowerCase().trim();
  const isDog = pkg.isDogOnly === true || petType === "dog";
  const isCat = pkg.isCatOnly === true || petType === "cat";

  // Section 3: Care, Add-ons & Bath packages (exact live website order)
  // 3.1 Hygiene Clip
  if (key === "hygiene-clip" || title.includes("hygiene clip") || title.includes("sanitary clip") || title.includes("sanitary trim")) {
    return 301;
  }
  // 3.2 Nail Clipping
  if (key === "nail-clipping" || title.includes("nail clip") || title.includes("nail trimming") || title === "nail care") {
    return 302;
  }
  // 3.3 Massage
  if (key === "massage" || title.includes("massage") || title.includes("wellness add-on")) {
    return 303;
  }
  // 3.4 Bath & Brush | Dogs
  if ((key === "bath-brush-dogs" || (title.includes("bath") && title.includes("brush") && title.includes("dog"))) && !title.includes("subscription") && !title.includes("package")) {
    return 304;
  }
  // 3.5 Bath & Brush | Cats
  if ((key === "bath-brush-cats" || (title.includes("bath") && title.includes("brush") && title.includes("cat"))) && !title.includes("subscription") && !title.includes("package")) {
    return 305;
  }
  // 3.6 Bath & Brush Subscription package
  if (key === "bath-brush-subscription" || (title.includes("bath") && title.includes("brush") && (title.includes("subscription") || title.includes("package")))) {
    return 306;
  }

  // Section 1: Dog related services
  if (
    cat === "dog" ||
    cat === "puppy" ||
    cat === "styling" ||
    isDog ||
    key.includes("dog") ||
    key.includes("puppy") ||
    title.includes("dog") ||
    title.includes("puppy") ||
    title.includes("canine")
  ) {
    return 100;
  }

  // Section 2: Cat related services
  if (
    cat === "cat" ||
    isCat ||
    key.includes("cat") ||
    title.includes("cat") ||
    title.includes("kitten") ||
    title.includes("feline")
  ) {
    return 200;
  }

  // Section 4: General / Other future services
  return 400;
}

function sortGroomingPackages(packages) {
  if (!Array.isArray(packages)) return [];
  return packages
    .map((pkg, index) => ({ pkg, index, score: getGroomingPackageSortScore(pkg) }))
    .sort((a, b) => {
      if (a.score !== b.score) {
        return a.score - b.score;
      }
      return a.index - b.index;
    })
    .map((item) => item.pkg);
}

function GroomingPackages({ onBook, onAddToCart }) {
  const cats = ["Puppy", "Dog", "Cat", "Care", "Wellness", "Styling"];
  const [filter, setFilter] = useStateG("All");
  const [open, setOpen] = useStateG(null);
  const cms = (typeof useCmsContent === "function") ? useCmsContent("grooming") : (window.PawpadContentStore ? window.PawpadContentStore.get("grooming") : {});
  const rawPackages = (cms.packages && Array.isArray(cms.packages)) ? cms.packages : GROOM_PACKAGES;
  const packagesList = sortGroomingPackages(rawPackages);
  const filtered = filter === "All" ? packagesList : packagesList.filter((p) => p.cat === filter);

  const handleAddToCart = (p) => {
    const catalogItem = (typeof CART_CATALOG !== "undefined" ? CART_CATALOG : []).find((c) => c.id === p.key);
    let priceNum = p.priceNum;
    if (p.price) {
      const parsed = parseFloat(String(p.price).replace(/,/g, "").replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed > 0) {
        priceNum = parsed;
      }
    }
    if (priceNum === undefined) {
      if (catalogItem && catalogItem.price !== undefined) {
        priceNum = catalogItem.price;
      } else {
        priceNum = 1000;
      }
    }
    const cartItem = {
      id: p.key,
      title: p.title,
      category: "Grooming",
      price: priceNum,
      priceDisplay: p.price,
      desc: p.sub || p.note,
      img: p.img,
      requiresPetInfo: true,
      isDogOnly: !!p.isDogOnly,
      isCatOnly: !!p.isCatOnly,
      petType: p.petType,
      allowPetTypeSelection: !!p.allowPetTypeSelection
    };
    if (typeof onAddToCart === "function") {
      onAddToCart(cartItem);
    } else if (typeof window.addToCart === "function") {
      window.addToCart(cartItem);
    } else if (typeof onBook === "function") {
      onBook(p.key);
    }
  };

  return /* @__PURE__ */ React.createElement("section", { className: "g-packages", id: "packages" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "g-pkg-head reveal" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Grooming Categories"), /* @__PURE__ */ React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "16ch" } }, "Grooming care ", /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "for every coat"))), /* @__PURE__ */ React.createElement("div", { className: "g-pkg-filter" }, ["All", ...cats].map((c) => /* @__PURE__ */ React.createElement("button", { key: c, className: "g-filter-btn " + (filter === c ? "on" : ""), onClick: () => setFilter(c) }, c)))), /* @__PURE__ */ React.createElement("div", { className: "g-pkg-grid" }, filtered.map((p, i) => {
    const isOpen = open === p.key;
    const includesList = Array.isArray(p.includes) ? p.includes : [];
    const notIncludesList = Array.isArray(p.notIncludes) ? p.notIncludes : [];
    return /* @__PURE__ */ React.createElement("article", { key: p.key, className: "g-pkg-card " + (isOpen ? "open" : ""), style: { transitionDelay: `${i * 60}ms` } }, /* @__PURE__ */ React.createElement("div", { className: "g-pkg-img" }, /* @__PURE__ */ React.createElement("img", { src: p.img, alt: p.title }), /* @__PURE__ */ React.createElement("span", { className: "tag" }, p.cat)), /* @__PURE__ */ React.createElement("div", { className: "g-pkg-body" }, /* @__PURE__ */ React.createElement("div", { className: "g-pkg-top" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "h-3" }, p.title), /* @__PURE__ */ React.createElement("p", { className: "mute", style: { margin: "4px 0 0", fontSize: 13 } }, p.sub)), /* @__PURE__ */ React.createElement("div", { className: "g-pkg-price" }, /* @__PURE__ */ React.createElement("strong", null, p.price), /* @__PURE__ */ React.createElement("span", null, p.duration))), /* @__PURE__ */ React.createElement("p", { className: "g-pkg-note" }, p.note), /* @__PURE__ */ React.createElement("div", { className: "g-pkg-details" }, /* @__PURE__ */ React.createElement("h5", null, "Included"), /* @__PURE__ */ React.createElement("ul", null, includesList.map((inc) => /* @__PURE__ */ React.createElement("li", { key: inc }, /* @__PURE__ */ React.createElement(PawIcon, { size: 10, color: "var(--driftwood)" }), " ", inc))), notIncludesList.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h5", { style: { marginTop: 16 } }, "Not Included"), /* @__PURE__ */ React.createElement("ul", null, notIncludesList.map((ninc) => /* @__PURE__ */ React.createElement("li", { key: ninc, style: { color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--driftwood)", fontSize: 12, marginRight: 4, fontWeight: 700 } }, "—"), " ", ninc)))) : null), /* @__PURE__ */ React.createElement("div", { className: "g-pkg-actions" }, /* @__PURE__ */ React.createElement("button", { className: "g-pkg-toggle", onClick: () => setOpen(isOpen ? null : p.key) }, isOpen ? "Show less" : "Show more", " ", /* @__PURE__ */ React.createElement("span", { className: "g-pkg-arrow" }, isOpen ? "\u2212" : "+")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-sm", onClick: () => handleAddToCart(p) }, "Add to cart ", /* @__PURE__ */ React.createElement(Arrow, { size: 12 })))));
  })), /* @__PURE__ */ React.createElement("p", { className: "g-pkg-footnote reveal" }, /* @__PURE__ */ React.createElement(PawIcon, { size: 14, color: "var(--driftwood)" }), "Please refer to the notes below for grooming duration, appointment policies, and important grooming guidelines. Add-on services are available exclusively alongside a full grooming package.")), /* @__PURE__ */ React.createElement("style", null, `
        .g-packages { background: var(--cream-bg); padding-top: 0; padding-bottom: 24px; }
        .g-pkg-head {
          display: flex; justify-content: space-between; align-items: end; gap: 32px;
          flex-wrap: wrap; margin-bottom: 48px;
        }
        .g-pkg-filter {
          display: inline-flex; gap: 4px; padding: 6px;
          background: var(--white);
          border-radius: 999px;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          flex-wrap: wrap;
        }
        body[data-palette="dark"] .g-pkg-filter { background: color-mix(in oklab, var(--champagne), black 5%); }
        .g-filter-btn {
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: var(--ink-mute);
          transition: all var(--t-fast) var(--ease);
        }
        .g-filter-btn:hover { color: var(--ink); }
        .g-filter-btn.on { background: var(--ink); color: var(--cream-bg); }
        .g-pkg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .g-pkg-card {
          background: var(--white);
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          display: flex; flex-direction: column;
          transition: all var(--t-fast) var(--ease);
        }
        body[data-palette="dark"] .g-pkg-card { background: color-mix(in oklab, var(--champagne), black 5%); }
        .g-pkg-card:hover { transform: translateY(-4px); box-shadow: 0 30px 60px -40px color-mix(in oklab, var(--ink), transparent 60%); }
        .g-pkg-img { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--eagle-soft); }
        .g-pkg-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .9s var(--ease); }
        .g-pkg-card:hover .g-pkg-img img { transform: scale(1.05); }
        .g-pkg-img .tag {
          position: absolute; top: 16px; left: 16px;
          background: color-mix(in oklab, var(--cream-bg), transparent 12%);
          backdrop-filter: blur(8px);
        }
        .g-pkg-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 16px; flex: 1; }
        .g-pkg-top { display: flex; justify-content: space-between; align-items: start; gap: 18px; }
        .g-pkg-price { text-align: right; display: flex; flex-direction: column; gap: 2px; align-items: flex-end; }
        .g-pkg-price strong { font-family: var(--f-display); font-size: 28px; color: var(--driftwood); line-height: 1; }
        .g-pkg-price span { font-size: 11px; color: var(--ink-mute); letter-spacing: .12em; text-transform: uppercase; }
        .g-pkg-note { margin: 0; font-size: 14px; color: var(--ink-mute); line-height: 1.6; }
        .g-pkg-details {
          max-height: 0; overflow: hidden;
          transition: max-height var(--t-med) var(--ease), margin var(--t-med) var(--ease), padding var(--t-med) var(--ease);
          margin: 0 0 0;
        }
        .g-pkg-card.open .g-pkg-details { max-height: 800px; padding-top: 4px; }
        .g-pkg-details h5 {
          font-family: var(--f-body); font-size: 11px; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase;
          color: var(--ink-mute);
          margin: 0 0 14px;
        }
        .g-pkg-details ul {
          list-style: none; padding: 0; margin: 0;
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px;
          font-size: 13.5px;
        }
        .g-pkg-details li { display: flex; align-items: center; gap: 8px; }
        .g-pkg-actions {
          display: flex; justify-content: space-between; align-items: center; gap: 14px;
          flex-wrap: wrap; margin-top: auto; padding-top: 18px;
          border-top: 1px dashed color-mix(in oklab, var(--ink), transparent 80%);
        }
        .g-pkg-toggle {
          font-size: 13px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--ink);
        }
        .g-pkg-arrow {
          font-family: var(--f-body); font-size: 16px; font-weight: 600;
          width: 26px; height: 26px;
          background: var(--champagne);
          border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          line-height: 1;
        }
        .g-pkg-footnote {
          margin-top: 36px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: var(--ink-mute);
          padding: 14px 18px;
          background: var(--champagne-soft);
          border-radius: 12px;
          width: fit-content;
        }
        @media (max-width: 1000px) { .g-pkg-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) {
          .g-pkg-filter { border-radius: 18px; justify-content: flex-start; }
          .g-filter-btn { padding: 9px 14px; }
          .g-pkg-grid { grid-template-columns: 1fr; }
          .g-pkg-details ul { grid-template-columns: 1fr; }
        }
      `));
}
function AddOnsSection() {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("grooming") : (window.PawpadContentStore ? window.PawpadContentStore.get("grooming") : {});
  const addOnsList = (cms.addOns && Array.isArray(cms.addOns)) ? cms.addOns : ADD_ONS;
  return /* @__PURE__ */ React.createElement("section", { className: "addons" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "addons-head reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Add-ons"), /* @__PURE__ */ React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "18ch" } }, "Little extras ", /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "Big difference"))), /* @__PURE__ */ React.createElement("div", { className: "addons-grid reveal" }, addOnsList.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: a.name, className: "addon-row" }, /* @__PURE__ */ React.createElement(PawIcon, { size: 14, color: "var(--driftwood)" }), /* @__PURE__ */ React.createElement("span", { className: "addon-name" }, a.name), /* @__PURE__ */ React.createElement("span", { className: "addon-price" }, a.price)))), /* @__PURE__ */ React.createElement("p", { className: "addons-disclaimer reveal" }, /* @__PURE__ */ React.createElement(PawIcon, { size: 13, color: "var(--driftwood)" }), " Disclaimer: Add-on services are available exclusively alongside a full grooming session and cannot be booked as standalone treatments.")), /* @__PURE__ */ React.createElement("style", null, `
        .addons { background: var(--champagne-soft); }
        .addons-head { max-width: 720px; margin-bottom: 48px; }
        .addons-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .addon-row {
          display: grid; grid-template-columns: 24px 1fr auto; gap: 16px; align-items: center;
          padding: 22px 0;
          border-bottom: 1px solid color-mix(in oklab, var(--ink), transparent 88%);
          transition: padding var(--t-fast) var(--ease);
        }
        .addon-row:hover { padding-left: 8px; }
        .addon-name { font-size: 16px; }
        .addon-price { font-family: var(--f-display); font-size: 22px; color: var(--driftwood); }
        .addons-disclaimer {
          margin-top: 36px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; color: var(--ink-mute);
          padding: 14px 18px;
          background: color-mix(in oklab, var(--white), transparent 30%);
          border-radius: 12px;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 90%);
          width: fit-content;
        }
        body[data-palette="dark"] .addons-disclaimer {
          background: color-mix(in oklab, var(--champagne), black 8%);
        }
        @media (max-width: 700px) {
          .addons-grid { grid-template-columns: 1fr; }
        }
      `));
}
function GroomingNotes() {
  const notes = [
    { t: "Arrive 10 minutes early", d: "Your pet gets time to sniff the studio and meet the team before anything starts." },
    { t: "A calm, safe environment", d: "Cats should arrive in a secure carrier, while dogs remain on a leash. We carefully manage every arrival and keep pets separate at all times to ensure a relaxed, stress-free experience." },
    { t: "Skip food right before", d: "Light meals 2 hours before help avoid grooming-time tummy upset." },
    { t: "Tell us everything", d: "Past grooming trauma, ticklish spots, recent vet visits \u2014 all useful." },
    { t: "Mats need time", d: "Severe matting may need to be clipped down. Coats grow back; pain doesn't." },
    { t: "Cancellation", d: "Give us 24 hours where possible \u2014 we hold spots so other anxious pets get the long slots they need." }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "g-notes" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "g-notes-head reveal" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Before you book"), /* @__PURE__ */ React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "20ch" } }, "A few small things that ", /* @__PURE__ */ React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "help a lot"))), /* @__PURE__ */ React.createElement("div", { className: "g-notes-grid" }, notes.map((n, i) => /* @__PURE__ */ React.createElement("div", { key: n.t, className: "g-note-card reveal", style: { transitionDelay: `${i * 70}ms` } }, /* @__PURE__ */ React.createElement("div", { className: "g-note-no" }, "0", i + 1), /* @__PURE__ */ React.createElement("h4", { className: "h-3" }, n.t), /* @__PURE__ */ React.createElement("p", null, n.d))))), /* @__PURE__ */ React.createElement("style", null, `
        .g-notes { background: var(--cream-bg); padding-top: 24px; padding-bottom: 20px; }
        .g-notes-head { max-width: 720px; margin-bottom: 48px; }
        .g-notes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .g-note-card {
          background: var(--white);
          border-radius: 22px;
          padding: 32px 28px;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          transition: transform var(--t-fast) var(--ease);
        }
        body[data-palette="dark"] .g-note-card { background: color-mix(in oklab, var(--champagne), black 5%); }
        .g-note-card:hover { transform: translateY(-3px); }
        .g-note-no { font-family: var(--f-display); font-size: 14px; color: var(--driftwood); letter-spacing: .1em; }
        .g-note-card h4 { margin-top: 8px; }
        .g-note-card p { margin: 12px 0 0; font-size: 14.5px; line-height: 1.6; color: var(--ink-mute); }
        @media (max-width: 800px) {
          .g-notes-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 540px) {
          .g-notes-grid { grid-template-columns: 1fr; }
        }
      `));
}
function GroomingPage({ onBook, onAddToCart }) {
  useReveal();
  return /* @__PURE__ */ React.createElement("div", { className: "page-enter" }, /* @__PURE__ */ React.createElement(GroomingHero, { onBook }), /* @__PURE__ */ React.createElement(GroomingPackages, { onBook, onAddToCart }), /* @__PURE__ */ React.createElement(GroomingNotes, null));
}
Object.assign(window, { GroomingPage, sortGroomingPackages, GROOM_PACKAGES });
