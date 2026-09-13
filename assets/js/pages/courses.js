
const { useState: useStateCourse } = React;

const COURSE_LIST = [
  {
    key: "pcgec",
    title: "Pawpad Canine Grooming Essentials Certificate (PCGEC)",
    price: "₹30,000",
    priceNum: 30000,
    duration: "5 days",
    knowMoreUrl: "course_forms/pawpad-essentials-dog-page.html",
    enrollUrl: "course_forms/pawpad-application-pcgec.html",
    desc: "A fast, 5-day hands-on introduction to professional dog grooming for complete beginners. Work directly with live dogs from day one under expert supervision to learn bathing, drying, brushing, ear cleaning, and coat-care fundamentals."
  },
  {
    key: "pfgec",
    title: "Pawpad Feline Grooming Essentials Certificate (PFGEC)",
    price: "₹30,000",
    priceNum: 30000,
    duration: "5 days",
    knowMoreUrl: "course_forms/pawpad-essentials-cat-page.html",
    enrollUrl: "course_forms/pawpad-application-pfgec.html",
    desc: "A 5-day hands-on introductory course covering feline-specific grooming and handling techniques. Build entry-level competence in cat body language, bathing, drying, brushing, de-matting, and ear care under close instructor guidance."
  },
  {
    key: "pcgpc",
    title: "Pawpad Canine Grooming Practitioner Certificate (PCGPC)",
    price: "₹50,000",
    priceNum: 50000,
    duration: "3 weeks",
    knowMoreUrl: "course_forms/pawpad-practitioner-dog-page.html",
    enrollUrl: "course_forms/pawpad-application-pcgpc.html",
    desc: "A 3-week practitioner-level programme designed to build industry-ready technical grounding in canine grooming. Master bathing and coat care, advance to live-dog nail trimming and hygiene clipping, and practice full scissoring techniques on training models."
  },
  {
    key: "pfgpc",
    title: "Pawpad Feline Grooming Practitioner Certificate (PFGPC)",
    price: "₹50,000",
    priceNum: 50000,
    duration: "3 weeks",
    knowMoreUrl: "course_forms/pawpad-practitioner-cat-page.html",
    enrollUrl: "course_forms/pawpad-application-pfgpc.html",
    desc: "An intensive 3-week practitioner course providing hands-on feline grooming mastery. Progress from bathing and coat care to live nail trimming, hygiene clipping, and full haircuts performed directly on live cats."
  },
  {
    key: "pacgc",
    title: "Pawpad Applied Canine & Feline Grooming Certification (PACGC)",
    price: "₹95,000",
    priceNum: 95000,
    duration: "7 weeks",
    knowMoreUrl: "course_forms/pawpad-foundations-page.html",
    enrollUrl: "course_forms/pawpad-application-pacgc.html",
    desc: "A 7-week comprehensive programme in conscious canine and feline grooming in Bengaluru. Small cohort of 3 students learning consent-based handling, anatomy, coat care, scissoring, and clipping without restraint."
  },
  {
    key: "studio-consulting-online",
    title: "Grooming Studio Setup — Option 1: Online Consultation",
    price: "₹20,000",
    priceNum: 20000,
    duration: "2 Video Calls",
    knowMoreUrl: "course_forms/pawpad-studio-consulting-page.html",
    enrollUrl: "course_forms/pawpad-studio-consulting-page.html",
    enrollText: "Book Now",
    desc: "Two video calls plus a written equipment and space brief based on your floor plan or photos. Ideal for remote guidance on budgets, layout, and essential gear."
  },
  {
    key: "studio-consulting-in-person",
    title: "Grooming Studio Setup — Option 2: In-Person Studio Visit",
    price: "₹35,000 / day",
    priceNum: 35000,
    duration: "Full Day On-Site",
    knowMoreUrl: "course_forms/pawpad-studio-consulting-page.html",
    enrollUrl: "course_forms/pawpad-studio-consulting-page.html",
    enrollText: "Book Now",
    desc: "A full day on-site assessing your actual space in person before providing customized equipment lists, space recommendations, and operational layout planning."
  }
];

function renderCoursesHeroTitle(cms) {
  if (cms.title1 && cms.titleAccent) {
    return React.createElement(React.Fragment, null,
      cms.title1,
      " ",
      React.createElement("em", { className: "italic c-title-accent", style: { color: "var(--driftwood)" } }, cms.titleAccent),
      cms.titleEnd ? ` ${cms.titleEnd}` : null
    );
  }
  const titleText = cms.title || "Learn Conscious Pet Grooming";
  if (typeof titleText === "string") {
    if (titleText.includes("Pet Grooming")) {
      const idx = titleText.indexOf("Pet Grooming");
      const before = titleText.substring(0, idx);
      const after = titleText.substring(idx + "Pet Grooming".length);
      return React.createElement(React.Fragment, null,
        before,
        React.createElement("em", { className: "italic c-title-accent", style: { color: "var(--driftwood)" } }, "Pet Grooming"),
        after || null
      );
    }
    if (titleText.includes("Pet Groomer")) {
      const idx = titleText.indexOf("Pet Groomer");
      const before = titleText.substring(0, idx);
      const after = titleText.substring(idx + "Pet Groomer".length);
      return React.createElement(React.Fragment, null,
        before,
        React.createElement("em", { className: "italic c-title-accent", style: { color: "var(--driftwood)" } }, "Pet Groomer"),
        after || null
      );
    }
    const words = titleText.trim().split(/\s+/);
    if (words.length > 2) {
      const first = words.slice(0, words.length - 2).join(" ");
      const accent = words.slice(words.length - 2).join(" ");
      return React.createElement(React.Fragment, null,
        first + " ",
        React.createElement("em", { className: "italic c-title-accent", style: { color: "var(--driftwood)" } }, accent)
      );
    } else if (words.length === 2) {
      return React.createElement(React.Fragment, null,
        words[0] + " ",
        React.createElement("em", { className: "italic c-title-accent", style: { color: "var(--driftwood)" } }, words[1])
      );
    }
    return titleText;
  }
  return React.createElement(React.Fragment, null,
    "Learn Conscious ",
    React.createElement("em", { className: "italic c-title-accent", style: { color: "var(--driftwood)" } }, "Pet Grooming")
  );
}

function CoursesHero() {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("courses") : (window.PawpadContentStore ? window.PawpadContentStore.get("courses") : {});
  return React.createElement("section", { className: "c-hero" },
    React.createElement("div", { className: "container c-hero-grid" },
      React.createElement("div", null,
        React.createElement("p", { className: "eyebrow reveal in" }, cms.eyebrow || "Professional Academy"),
        React.createElement("h1", { className: "h-display reveal in c-course-title", style: { marginTop: 24, maxWidth: "18ch" } },
          renderCoursesHeroTitle(cms)
        ),
        React.createElement("p", { className: "lead reveal in", style: { marginTop: 28, maxWidth: "58ch" } },
          cms.lead || "Understand dogs and cats in ways you have never thought of before as you learn the fine art of pet grooming through this structured and wholesome course. Your learning will take you through a journey of understanding the nervous system, musculoskeletal structure and emotional dynamics of the animal all of which are core essentials for ideal grooming."
        )
      ),
      React.createElement("div", { className: "c-hero-image reveal in" },
        React.createElement("img", {
          src: (cms.heroImage && !cms.heroImage.includes("courses-snapshot")) ? cms.heroImage : "assets/img/pawpad/courses-cover-new.webp",
          alt: "Pawpad grooming course",
          fetchpriority: "high",
          decoding: "async",
          onError: (e) => { if (window.handleImgError) window.handleImgError(e, "assets/img/pawpad/courses-cover-new.webp"); }
        })
      )
    ),
    React.createElement("style", null, `
      .c-hero { padding: 180px 0 60px; }
      .c-hero-grid { display: grid; grid-template-columns: 1.05fr .9fr; gap: 64px; align-items: center; }
      .c-hero-image { background: transparent; }
      .c-hero-image img { width: 100%; height: auto; display: block; object-fit: contain; }
      .c-course-title em, .c-course-title .c-title-accent {
        color: var(--driftwood);
        font-style: italic;
      }
      @media (max-width: 900px) { .c-hero-grid { grid-template-columns: 1fr; gap: 34px; } .c-course-title em { white-space: normal !important; } }
    `)
  );
}

function CourseCards({ onBook }) {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("courses") : (window.PawpadContentStore ? window.PawpadContentStore.get("courses") : {});
  const list = (cms.courseList && Array.isArray(cms.courseList)) ? cms.courseList : COURSE_LIST;

  return React.createElement(
    "section",
    { className: "course-cards" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "cc-head reveal" },
        React.createElement("p", { className: "eyebrow" }, cms.eyebrow || "COURSE OVERVIEW"),
        React.createElement(
          "h2",
          { className: "h-1", style: { marginTop: 18, maxWidth: "22ch" } },
          "Hands-on training in ",
          React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "conscious grooming")
        )
      ),
      React.createElement(
        "div",
        { className: "cc-grid" },
        list.map((c, i) => {
          const knowMoreUrl = c.knowMoreUrl || (c.key === "pacgc" || (c.title && c.title.includes("Applied Canine")) ? "course_forms/pawpad-foundations-page.html" : "");
          const enrollText = (c.enrollText && c.enrollText.includes("/")) ? "Book Now" : (c.enrollText || "Enroll Now");

          return React.createElement(
            "article",
            { key: c.key || i, className: "cc-card reveal", style: { transitionDelay: `${i * 50}ms` } },
            c.img && React.createElement("div", { className: "cc-card-img-wrap", style: { marginBottom: "16px", borderRadius: "14px", overflow: "hidden" } },
              React.createElement("img", {
                src: c.img,
                alt: c.title,
                style: { width: "100%", height: "160px", objectFit: "cover", display: "block" }
              })
            ),
            React.createElement("h3", { className: "cc-card-title" }, c.title),
            React.createElement("div", { className: "cc-card-price" }, c.price),
            React.createElement("p", { className: "cc-card-desc" }, c.desc),
            React.createElement(
              "div",
              { className: "cc-card-actions" },
              knowMoreUrl && React.createElement(
                "a",
                {
                  href: knowMoreUrl,
                  className: "btn-know-more"
                },
                "Know More"
              ),
              c.enrollUrl && React.createElement(
                "a",
                {
                  href: c.enrollUrl,
                  className: "btn-enroll-now"
                },
                enrollText,
                React.createElement("span", { className: "btn-arrow" }, " →")
              )
            )
          );
        })
      )
    ),
    React.createElement(
      "style",
      null,
      `
        .course-cards { background: var(--cream-bg); padding: 40px 0 80px; }
        .cc-head { margin-bottom: 48px; max-width: 720px; }
        .cc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .cc-card {
          background: var(--white);
          border-radius: 24px;
          padding: 36px 30px 32px;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          transition: transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
        }
        body[data-palette="dark"] .cc-card {
          background: color-mix(in oklab, var(--champagne), black 5%);
          border-color: color-mix(in oklab, var(--champagne), transparent 85%);
        }
        .cc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px -24px color-mix(in oklab, var(--ink), transparent 70%);
        }
        .cc-card-title {
          font-family: var(--f-display);
          font-size: 22px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.25;
          margin: 0 0 12px;
        }
        .cc-card-price {
          font-family: var(--f-display);
          font-size: 24px;
          color: var(--driftwood);
          font-weight: 400;
          margin: 0 0 20px;
        }
        .cc-card-desc {
          font-family: var(--f-body);
          font-size: 14px;
          line-height: 1.65;
          color: var(--ink-soft);
          margin: 0 0 32px;
          flex: 1;
        }
        .cc-card-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          width: 100%;
        }
        .btn-know-more,
        .btn-enroll-now {
          font-family: var(--f-body);
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          text-decoration: none;
          transition: all var(--t-fast) var(--ease);
          flex: 1 1 0px;
          min-width: 0;
          box-sizing: border-box;
        }
        .btn-know-more {
          background: transparent;
          color: var(--ink);
          border: 1.5px solid color-mix(in oklab, var(--ink), transparent 70%);
          cursor: pointer;
        }
        .btn-know-more:hover {
          background: var(--champagne-soft);
          border-color: var(--ink);
          color: var(--ink);
          text-decoration: none;
        }
        body[data-palette="dark"] .btn-know-more {
          border-color: color-mix(in oklab, var(--champagne), transparent 50%);
          color: var(--champagne);
        }
        body[data-palette="dark"] .btn-know-more:hover {
          background: color-mix(in oklab, var(--champagne), transparent 85%);
          border-color: var(--champagne);
          color: var(--champagne);
          text-decoration: none;
        }
        .btn-enroll-now {
          background: var(--ink);
          color: var(--white) !important;
          border: 1.5px solid var(--ink);
          cursor: pointer;
          gap: 6px;
        }
        .btn-enroll-now:hover {
          background: var(--driftwood);
          border-color: var(--driftwood);
          color: var(--white) !important;
          transform: translateY(-1px);
          text-decoration: none;
        }
        .btn-arrow {
          font-size: 14px;
          transition: transform var(--t-fast) var(--ease);
        }
        .btn-enroll-now:hover .btn-arrow {
          transform: translateX(3px);
        }
        @media (max-width: 1200px) and (min-width: 981px) {
          .cc-card { padding: 32px 22px 28px; }
          .btn-know-more,
          .btn-enroll-now {
            padding: 10px 10px;
            font-size: 12.5px;
            gap: 4px;
          }
        }
        @media (max-width: 980px) {
          .cc-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cc-grid { grid-template-columns: 1fr; }
          .cc-card { padding: 28px 22px 24px; }
          .cc-card-actions { flex-direction: row; gap: 8px; }
          .btn-know-more, .btn-enroll-now { padding: 10px 12px; font-size: 13px; }
        }
      `
    )
  );
}

function CredibilityStrip() {
  return React.createElement("section", { className: "cred" },
    React.createElement("div", { className: "container" },
      React.createElement("div", { className: "cred-grid" },
        React.createElement("div", { className: "cred-text reveal" },
          React.createElement("p", { className: "eyebrow" }, "Why Learn With Pawpad?"),
          React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "16ch" } },
            "Learn directly ",
            React.createElement("em", { className: "italic", style: { color: "var(--driftwood)" } }, "from Leena")
          ),
          React.createElement("p", { style: { marginTop: 28, maxWidth: "56ch" } },
            "Learn directly from Leena Munikempanna, founder of Pawpad and a professional groomer with over a decade of industry experience. Students benefit not only from technical grooming knowledge, but also from Pawpad's philosophy of behaviour-led, compassionate animal care."
          ),
          React.createElement("ul", { className: "cred-bullets" },
            React.createElement("li", null,
              React.createElement("strong", null, "Learn through real-world experience."),
              " Training combines theory with practical, hands-on grooming experience alongside professional groomers."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "Small batches, personalised attention."),
              " A maximum of two students at a time allows for focused guidance and personalised feedback."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "Train in both dogs and cats."),
              " Pawpad offers the opportunity to learn both canine and feline grooming for a broader professional skill set."
            ),
            React.createElement("li", null,
              React.createElement("strong", null, "Leena's qualifications."),
              " Certified Master Cat Groomer (PCGAA), PetCPR+ Certified, Certified Canine Esthetician, and Certified Coat Expert."
            )
          )
        ),
        React.createElement("div", { className: "cred-images reveal" },
          React.createElement("div", { className: "cred-portrait blob-1" },
            React.createElement("img", {
              src: "assets/img/pawpad/courses-learn-from-leena.webp",
              alt: "Leena Munikempanna, founder of Pawpad",
              loading: "lazy",
              decoding: "async"
            })
          )
        )
      )
    ),
    React.createElement("style", null, `
      .cred { background: var(--champagne-soft); }
      .cred-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
      .cred-bullets { list-style: none; padding: 0; margin: 28px 0 0; display: flex; flex-direction: column; gap: 14px; }
      .cred-bullets li { padding-left: 24px; position: relative; font-size: 15px; line-height: 1.65; }
      .cred-bullets li::before { content: ""; position: absolute; left: 0; top: 11px; width: 12px; height: 1px; background: var(--driftwood); }
      .cred-bullets strong { color: var(--ink); font-weight: 600; }
      .cred-images { position: relative; display: flex; align-items: center; }
      .cred-portrait { width: 100%; }
      .cred-portrait img { width: 100%; height: auto; display: block; object-fit: contain; }
      @media (max-width: 900px) { .cred-grid { grid-template-columns: 1fr; gap: 36px; } }
    `)
  );
}

function StudentTestimonials() {
  const testimonials = [
    {
      name: "Bhavya Srinivas",
      studio: "Woof Magic Spa",
      quote: "Thank you so much Leena for the great experience you gave me on my new journey. I feel very confident in the fundamental work and I learned so much about handling pets with different temperaments, especially cats."
    },
    {
      name: "Clare Pachuau",
      studio: "A Tiny Groomer",
      quote: "I highly recommend the Pawpad Grooming Studio Academy to all prospective groomers. The instructor's knowledge, skills, experience, and expertise gave me a curriculum that exceeded my expectations."
    },
    {
      name: "Deeksha Shetty",
      studio: "The Purple Pawlor",
      quote: "Leena's approach to pet grooming is always comfort and well-being first. Working with Pawpad helped me understand animal body language and shaped the way I care for every pet in my own business."
    },
    {
      name: "Sanchari Mukherjee",
      studio: "The Bubble Bath",
      quote: "Training under Leena was a transformative experience. She taught grooming techniques while always stressing the comfort and well-being of the pets under our care."
    },
    {
      name: "Renjitha",
      studio: "Earthy Paws",
      quote: "Magic happened here and my life changed forever. Pawpad is highly recommended for anyone interested in starting their career as a groomer."
    }
  ];
  return React.createElement("section", { className: "student-testimonials" },
    React.createElement("div", { className: "container" },
      React.createElement("div", { className: "st-head reveal" },
        React.createElement("p", { className: "eyebrow" }, "Student Testimonials"),
        React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "18ch" } }, "What students carry forward")
      ),
      React.createElement("div", { className: "st-grid" },
        testimonials.map((item, i) =>
          React.createElement("article", { key: item.name, className: "st-card reveal", style: { transitionDelay: `${i * 60}ms` } },
            React.createElement("p", null, item.quote),
            React.createElement("div", null,
              React.createElement("strong", null, item.name),
              React.createElement("span", null, item.studio)
            )
          )
        )
      )
    ),
    React.createElement("style", null, `
      .student-testimonials { background: var(--cream-bg); }
      .st-head { margin-bottom: 44px; }
      .st-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
      .st-card {
        background: var(--white);
        border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
        border-radius: 18px;
        padding: 28px;
        display: flex;
        flex-direction: column;
        gap: 22px;
        min-height: 280px;
      }
      .st-card p { margin: 0; font-size: 16px; line-height: 1.7; color: var(--ink-soft); }
      .st-card strong { display: block; color: var(--ink); }
      .st-card span { display: block; margin-top: 4px; color: var(--driftwood); font-size: 14px; }
      @media (max-width: 1000px) { .st-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 680px) { .st-grid { grid-template-columns: 1fr; } }
    `)
  );
}

function CourseCTA({ onBook }) {
  const cms = (typeof useCmsContent === "function") ? useCmsContent("courses") : (window.PawpadContentStore ? window.PawpadContentStore.get("courses") : {});
  const courseList = (cms.courseList && Array.isArray(cms.courseList)) ? cms.courseList : COURSE_LIST;
  const [form, setForm] = useStateCourse({ name: "", email: "", phone: "", course: "All Courses / General Enquiry" });
  const [status, setStatus] = useStateCourse("idle");
  const [errorMessage, setErrorMessage] = useStateCourse("");

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const emailTarget = cms.courseEnquiryEmail || "courses@pawpad.in";
  const defaultSubject = cms.courseEnquirySubject || "Course Enquiry - Pawpad Academy";

  // Access key check: check courses settings first, fallback to myotherapy or default placeholder
  const accessKey = (cms.web3FormsAccessKey && cms.web3FormsAccessKey !== "YOUR_ACCESS_KEY_HERE")
    ? cms.web3FormsAccessKey
    : ((window.PawpadContentStore && window.PawpadContentStore.get("myotherapy")?.web3FormsAccessKey && window.PawpadContentStore.get("myotherapy")?.web3FormsAccessKey !== "YOUR_ACCESS_KEY_HERE")
      ? window.PawpadContentStore.get("myotherapy").web3FormsAccessKey
      : "a9a21b4b-47ee-4889-b709-9f101c59874d");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || (!form.email && !form.phone)) {
      setStatus("error");
      setErrorMessage("Please fill in your name and at least an email or phone number.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const selectedCourseName = form.course || "All Courses / General Enquiry";
      const subject = (selectedCourseName && selectedCourseName !== "All Courses / General Enquiry")
        ? `Course Enquiry: ${selectedCourseName}`
        : defaultSubject;

      const payload = {
        access_key: accessKey,
        subject: subject,
        from_name: "Pawpad Academy - Course Enquiry",
        name: form.name,
        email: form.email || "Not provided",
        phone: form.phone || "Not provided",
        course_selected: selectedCourseName,
        enquiry_type: "Professional Grooming Courses",
        message: `Course Interested In: ${selectedCourseName}`,
        botcheck: ""
      };

      if (window.hsSubmit) {
        try { window.hsSubmit("courses", { ...form, course: selectedCourseName }); } catch (_) {}
      }

      if (accessKey === "YOUR_ACCESS_KEY_HERE") {
        setTimeout(() => {
          setStatus("success");
        }, 500);
        return;
      }

      const fd = new FormData();
      Object.keys(payload).forEach((k) => fd.append(k, payload[k]));

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Unable to submit right now. Please email us directly at " + emailTarget);
      }
    } catch (err) {
      if (accessKey === "YOUR_ACCESS_KEY_HERE") {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("Network error occurred. Please reach out to us at " + emailTarget + ".");
      }
    }
  };

  return React.createElement("section", { className: "course-cta" },
    React.createElement("div", { className: "container" },
      React.createElement("div", { className: "course-cta-inner reveal" },
        React.createElement("div", null,
          React.createElement("p", { className: "eyebrow" }, cms.ctaEyebrow || "Course Enquiry"),
          React.createElement("h2", { className: "h-1", style: { marginTop: 18, maxWidth: "18ch" } }, cms.ctaTitle || "Ready to Start Your Grooming Journey?"),
          React.createElement("p", { className: "lead", style: { marginTop: 24, maxWidth: "58ch" } }, cms.ctaLead || "Courses run on a rolling basis throughout the year. Leave your details and we'll help you find the right start date for your training.")
        ),
        status === "success" ? React.createElement("div", { className: "course-form-sent" },
          React.createElement(window.PawIcon, { size: 44, color: "var(--driftwood)" }),
          React.createElement("h3", { className: "h-2", style: { margin: "16px 0 8px" } }, "We'll be in touch soon"),
          React.createElement("p", { style: { margin: "0 0 16px", color: "var(--ink-mute)", fontSize: 15, lineHeight: 1.6 } },
            "Thank you, " + (form.name || "friend") + "! We have received your interest in " + (form.course || "our courses") + ". The Pawpad team will reach out with upcoming dates and batch availability."
          ),
          React.createElement("button", {
            className: "btn btn-outline btn-sm",
            style: { alignSelf: "flex-start", marginTop: "8px", fontSize: "13px" },
            onClick: () => {
              setForm({ name: "", email: "", phone: "", course: "All Courses / General Enquiry" });
              setStatus("idle");
            }
          }, "Submit Another Enquiry")
        ) : React.createElement("form", { className: "course-form", onSubmit: handleSubmit },
          React.createElement("div", { className: "field" },
            React.createElement("label", null, "Select Course"),
            React.createElement("select", {
              value: form.course,
              onChange: upd("course")
            },
              React.createElement("option", { value: "All Courses / General Enquiry" }, "All Courses / General Enquiry"),
              courseList.map((c, idx) =>
                React.createElement("option", { key: c.key || idx, value: c.title }, c.title)
              )
            )
          ),
          React.createElement("div", { className: "field" },
            React.createElement("label", null, "Name"),
            React.createElement("input", { required: true, value: form.name, onChange: upd("name"), placeholder: "Your name" })
          ),
          React.createElement("div", { className: "course-form-row" },
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Email"),
              React.createElement("input", { type: "email", value: form.email, onChange: upd("email"), placeholder: "you@example.com" })
            ),
            React.createElement("div", { className: "field" },
              React.createElement("label", null, "Phone"),
              React.createElement("input", { type: "tel", value: form.phone, onChange: upd("phone"), placeholder: "96630 77496" })
            )
          ),
          errorMessage && React.createElement("div", { className: "course-form-error" }, errorMessage),
          React.createElement("button", {
            className: "btn btn-primary",
            type: "submit",
            disabled: status === "submitting"
          },
            status === "submitting" ? "Registering interest..." : "Register interest ",
            status !== "submitting" && React.createElement(window.Arrow, null)
          )
        )
      )
    ),
    React.createElement("style", null, `
      .course-cta { background: var(--cream-bg); padding: 40px 0 80px; }
      .course-cta-inner {
        padding: 48px;
        border-radius: 24px;
        background: var(--champagne-soft);
        border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
        display: grid;
        grid-template-columns: 1.1fr minmax(320px, 460px);
        gap: 48px;
        align-items: center;
        box-sizing: border-box;
      }
      .course-form { display: flex; flex-direction: column; gap: 14px; width: 100%; }
      .course-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .course-form .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .course-form .field label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--ink-mute);
      }
      .course-form input,
      .course-form select {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid color-mix(in oklab, var(--ink), transparent 80%);
        background: var(--white);
        font-family: var(--f-body, inherit);
        font-size: 14px;
        color: var(--ink);
        transition: border-color var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
      }
      .course-form select {
        cursor: pointer;
      }
      .course-form input:focus,
      .course-form select:focus {
        outline: none;
        border-color: var(--driftwood);
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--driftwood), transparent 80%);
      }
      .course-form-error {
        color: #dc2626;
        font-size: 13px;
        line-height: 1.4;
        background: rgba(220, 38, 38, 0.08);
        padding: 8px 12px;
        border-radius: 8px;
      }
      .course-form .btn { margin-top: 4px; justify-content: center; width: 100%; }
      .course-form-sent { display: flex; flex-direction: column; }
      @media (max-width: 960px) {
        .course-cta-inner { grid-template-columns: 1fr; padding: 36px 24px; gap: 32px; }
      }
      @media (max-width: 540px) {
        .course-form-row { grid-template-columns: 1fr; gap: 14px; }
        .course-cta-inner { padding: 28px 18px; }
      }
    `)
  );
}

function CoursesPage({ onBook }) {
  window.useReveal && window.useReveal();
  return React.createElement("div", { className: "page-enter" },
    React.createElement(CoursesHero, null),
    React.createElement(CourseCards, { onBook }),
    React.createElement(CredibilityStrip, null),
    React.createElement(StudentTestimonials, null),
    React.createElement(CourseCTA, { onBook })
  );
}

Object.assign(window, { CoursesPage, COURSE_LIST });
