(function () {
  const { useEffect } = React;

  function PoliciesPage() {
    if (typeof useReveal === "function") {
      useReveal();
    }

    useEffect(() => {
      // Handle scrolling to hash anchor on mount or change
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    }, []);

    const scrollToSection = (e, id) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        history.pushState(null, "", `#${id}`);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const handleBackHome = (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    };

    return /* @__PURE__ */ React.createElement("div", { className: "policies-page-wrapper" },
      /* @__PURE__ */ React.createElement("div", { className: "page policies-page container" },
        
        /* Back to Home button row on its own line */
        /* @__PURE__ */ React.createElement("div", { className: "back-nav" },
          /* @__PURE__ */ React.createElement("a", {
            href: "index.html",
            className: "back-btn",
            onClick: handleBackHome,
            "aria-label": "Back to Home page"
          }, "\u2190 Back to Home")
        ),

        /* Eyebrow and Page Title */
        /* @__PURE__ */ React.createElement("div", { className: "policy-eyebrow" }, "Studio Policies \xB7 Pawpad"),
        /* @__PURE__ */ React.createElement("h1", null, "Policies & Terms"),
        /* @__PURE__ */ React.createElement("p", { className: "sub" }, "Clear, transparent guidelines for our grooming studio, canine myotherapy, boarding, and academy programmes."),

        /* Navigation Pills */
        /* @__PURE__ */ React.createElement("div", { className: "nav-pills" },
          /* @__PURE__ */ React.createElement("a", { href: "#privacy", className: "nav-pill", onClick: (e) => scrollToSection(e, "privacy") }, "Privacy Policy \u2193"),
          /* @__PURE__ */ React.createElement("a", { href: "#terms", className: "nav-pill", onClick: (e) => scrollToSection(e, "terms") }, "Terms and Conditions \u2193"),
          /* @__PURE__ */ React.createElement("a", { href: "#refund", className: "nav-pill", onClick: (e) => scrollToSection(e, "refund") }, "Refund Policy \u2193")
        ),

        /* @__PURE__ */ React.createElement("hr", null),

        /* PRIVACY POLICY */
        /* @__PURE__ */ React.createElement("section", { id: "privacy", className: "policy-section" },
          /* @__PURE__ */ React.createElement("h2", null, "Privacy Policy"),
          /* @__PURE__ */ React.createElement("p", null, "At Pawpad, we respect the privacy of you and your companions. This policy explains what information we gather, why we need it, and how we protect it across our studio services and academy programmes."),

          /* @__PURE__ */ React.createElement("h3", null, "1. Information We Collect"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Guardian Details: "), "Name, phone number, email address, emergency contact, and city/address."),
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Pet Profile & Health History: "), "Breed, age, medical history, vaccination records, veterinarian contact, allergies, behavioral sensitivities, past grooming experiences, and temperament notes."),
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Academy Applicant Details: "), "Professional background, experience with animals, and physical readiness disclosures necessary for course safety.")
          ),

          /* @__PURE__ */ React.createElement("h3", null, "2. How We Use Your Information"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, "To plan and customize calm, stress-free grooming and wellness sessions around your pet\u2019s specific temperament and physical needs."),
            /* @__PURE__ */ React.createElement("li", null, "To confirm bookings, schedule academy assessments, and provide appointment updates or emergency veterinary notifications."),
            /* @__PURE__ */ React.createElement("li", null, "To maintain internal health and vaccination compliance for all animals visiting our studio.")
          ),

          /* @__PURE__ */ React.createElement("div", { className: "policy-box" },
            /* @__PURE__ */ React.createElement("strong", null, "Data Confidentiality: "),
            "We will never sell, rent, or trade your personal or pet information to third parties or marketing brokers. Information is strictly utilized for direct service delivery, animal safety, and studio communication."
          ),

          /* @__PURE__ */ React.createElement("h3", null, "3. Photos & Media"),
          /* @__PURE__ */ React.createElement("p", null, "We occasionally capture photos or short clips of our furry guests during grooming or training to share progress with pet guardians and celebrate our community. If you prefer your pet not be featured on our social channels, simply let us know during check-in or anytime via message.")
        ),

        /* @__PURE__ */ React.createElement("hr", null),

        /* TERMS AND CONDITIONS */
        /* @__PURE__ */ React.createElement("section", { id: "terms", className: "policy-section" },
          /* @__PURE__ */ React.createElement("h2", null, "Terms and Conditions"),
          /* @__PURE__ */ React.createElement("p", null, "By scheduling an appointment, boarding your companion, or enrolling in an academy course at Pawpad, you agree to the following terms designed to ensure safety, mutual respect, and animal welfare."),

          /* @__PURE__ */ React.createElement("h3", null, "1. Welfare-First & Stress-Free Care"),
          /* @__PURE__ */ React.createElement("p", null, "Pawpad operates on a low-stress, fear-free ethos. Sessions are spaced and never rushed. We prioritize animal emotional and physical comfort above purely cosmetic finishes."),
          /* @__PURE__ */ React.createElement("div", { className: "policy-box" },
            /* @__PURE__ */ React.createElement("strong", null, "Session Adjustments: "),
            "If a pet exhibits extreme distress, aggression, or medical instability, our groomers and practitioners reserve the right to modify, pause, or reschedule the service. Guardians will be charged only for the portion of the service completed."
          ),

          /* @__PURE__ */ React.createElement("h3", null, "2. Vaccination & Health Requirements"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, "All pets visiting Pawpad for grooming, myotherapy, or boarding must be up-to-date on mandatory core vaccinations (Rabies, DHPPiL for dogs; FPV/FCV/FHV for cats) and regular deworming."),
            /* @__PURE__ */ React.createElement("li", null, "Guardians must disclose any known medical conditions (e.g. cardiac murmurs, arthritis, recent surgeries, seizures, skin infections) prior to the appointment.")
          ),

          /* @__PURE__ */ React.createElement("h3", null, "3. Parasites & Severe Matting"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Fleas & Ticks: "), "If active parasites are detected, we may administer a mandatory gentle anti-parasite wash or treatment at guardian's cost to protect all studio guests."),
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Severe Matting: "), "De-matting severe pelted coats can cause skin discomfort. In humane practice, heavily matted coats may require a compassionate shave-down with guardian consent.")
          ),

          /* @__PURE__ */ React.createElement("h3", null, "4. Academy Courses & Certifications"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, "Admissions to Pawpad Grooming Certificate programmes follow our 4-stage process (Application \u2192 Conversation \u2192 Practical safety assessment \u2192 Acceptance)."),
            /* @__PURE__ */ React.createElement("li", null, "Students must adhere to studio safety protocols, animal ethics guidelines, and attendance requirements to be awarded certification.")
          )
        ),

        /* @__PURE__ */ React.createElement("hr", null),

        /* REFUND POLICY */
        /* @__PURE__ */ React.createElement("section", { id: "refund", className: "policy-section" },
          /* @__PURE__ */ React.createElement("h2", null, "Refund Policy"),
          /* @__PURE__ */ React.createElement("p", null, "We understand that schedules and circumstances change. Our refund and cancellation guidelines balance flexibility for guardians with the reserved time and small cohorts of our studio."),

          /* @__PURE__ */ React.createElement("h3", null, "1. Grooming & Myotherapy Appointments"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Notice Period: "), "Please give us at least ", /* @__PURE__ */ React.createElement("strong", null, "24 hours notice"), " if you need to cancel or reschedule a grooming or myotherapy session."),
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Late Cancellations & No-Shows: "), "Cancellations made with less than 24 hours notice or missed appointments may incur a rebooking fee or forfeiture of advance booking deposits.")
          ),

          /* @__PURE__ */ React.createElement("h3", null, "2. Boarding Stays"),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, "Boarding reservations require an advance confirmation deposit."),
            /* @__PURE__ */ React.createElement("li", null, "Cancellations made ", /* @__PURE__ */ React.createElement("strong", null, "7 or more days"), " prior to check-in are eligible for a full refund of the deposit."),
            /* @__PURE__ */ React.createElement("li", null, "Cancellations within 7 days of check-in are non-refundable due to strictly limited kennel-free boarding slots.")
          ),

          /* @__PURE__ */ React.createElement("h3", null, "3. Academy & Certificate Programmes"),
          /* @__PURE__ */ React.createElement("div", { className: "policy-box" },
            /* @__PURE__ */ React.createElement("strong", null, "Non-Refundable Seat Deposit: "),
            "Upon acceptance into any Pawpad certificate course (PCGEC, PFGEC, PCGPC, PFGPC, PCGFC), an admission deposit is due to lock your seat in our small cohort. This deposit is non-refundable."
          ),
          /* @__PURE__ */ React.createElement("ul", null,
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Course Balance: "), "The remaining course balance is due before Day 1 of the cohort."),
            /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "Withdrawals: "), "Written notice of withdrawal received at least 14 days before course commencement is eligible for a refund of tuition fees paid beyond the non-refundable seat deposit."),
            /* @__PURE__ */ React.createElement("li", null, "Withdrawals after cohort commencement are non-refundable, though seat deferral to a future cohort may be granted in verifiable compassionate circumstances at Pawpad's discretion.")
          ),

          /* @__PURE__ */ React.createElement("h3", null, "4. Refund Processing"),
          /* @__PURE__ */ React.createElement("p", null, "Approved refunds are processed via the original method of payment (bank transfer or payment gateway) within ", /* @__PURE__ */ React.createElement("strong", null, "5 to 7 business days"), ".")
        ),

        /* Note Section */
        /* @__PURE__ */ React.createElement("div", { className: "note" },
          /* @__PURE__ */ React.createElement("strong", null, "Have questions? "),
          "If you have any queries regarding our privacy practices, terms of service, or cancellation terms, please reach out to us at ",
          /* @__PURE__ */ React.createElement("a", { href: "mailto:care@pawpad.in" }, "care@pawpad.in"),
          ", call us at ",
          /* @__PURE__ */ React.createElement("a", { href: "tel:+919663077496" }, "+91 96630 77496"),
          " / ",
          /* @__PURE__ */ React.createElement("a", { href: "tel:+919148443330" }, "+91 91484 43330"),
          ", or visit us at #426, 5th Main Road, HRBR 2nd Block, Kalyan Nagar, Bengaluru - 560043."
        )
      ),

      /* Embedded Styles exactly matching third pic fonts, colors, and zero section padding */
      /* @__PURE__ */ React.createElement("style", null, `
        :root {
          --policy-bg: #F8F6EF;
          --policy-ink: #1C1B19;
          --policy-ink-soft: #5B5546;
          --policy-gold: #B08D4E;
          --policy-gold-deep: #96702E;
          --policy-rule: #E3DCC9;
          --policy-card-bg: #FDF8EC;
        }

        .policies-page-wrapper {
          padding-top: 180px;
          min-height: 80vh;
          font-family: "Source Serif 4", Georgia, serif !important;
          color: var(--policy-ink);
        }

        .policies-page {
          max-width: 740px !important;
          margin: 0 auto;
          padding-bottom: 60px;
          font-family: "Source Serif 4", Georgia, serif !important;
        }

        .policies-page .back-nav {
          display: block;
          margin-bottom: 24px;
        }

        .policies-page .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFEAD8;
          color: var(--policy-ink);
          font-family: "Source Serif 4", Georgia, serif !important;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 4px;
          transition: background .15s ease, color .15s ease;
          cursor: pointer;
        }

        .policies-page .back-btn:hover {
          background: #E3DCC9;
          color: var(--policy-ink);
        }

        .policies-page .policy-eyebrow {
          display: block !important;
          font-family: "Source Serif 4", Georgia, serif !important;
          font-size: 13px !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          color: var(--policy-gold-deep) !important;
          font-weight: 600 !important;
          margin-bottom: 14px !important;
        }

        .policies-page h1 {
          font-family: "Fraunces", Georgia, serif !important;
          font-weight: 500 !important;
          font-size: clamp(28px, 4vw, 38px) !important;
          line-height: 1.2 !important;
          margin: 0 0 12px !important;
          color: var(--policy-ink) !important;
        }

        .policies-page .sub {
          font-family: "Source Serif 4", Georgia, serif !important;
          color: var(--policy-ink-soft) !important;
          font-size: 16px !important;
          line-height: 1.65 !important;
          margin: 0 0 24px !important;
        }

        .policies-page .nav-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }

        .policies-page .nav-pill {
          display: inline-block;
          background: #FFFFFF;
          border: 1px solid var(--policy-rule);
          border-radius: 4px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: var(--policy-ink);
          font-family: "Source Serif 4", Georgia, serif !important;
          text-decoration: none;
          transition: all .15s ease;
          cursor: pointer;
        }

        .policies-page .nav-pill:hover {
          background: #F2ECE0;
          border-color: var(--policy-gold);
          color: var(--policy-gold-deep);
        }

        .policies-page hr {
          border: none !important;
          border-top: 1px solid var(--policy-rule) !important;
          margin: 32px 0 24px !important;
          height: 0 !important;
        }

        /* OVERRIDE global section padding and remove empty space */
        .policies-page section.policy-section {
          padding: 0 !important;
          margin: 0 !important;
          scroll-margin-top: 110px;
        }

        .policies-page h2 {
          font-family: "Fraunces", Georgia, serif !important;
          font-weight: 500 !important;
          font-size: 26px !important;
          line-height: 1.3 !important;
          margin: 0 0 16px !important;
          color: var(--policy-ink) !important;
        }

        .policies-page h3 {
          font-family: "Fraunces", Georgia, serif !important;
          font-weight: 500 !important;
          font-size: 19px !important;
          line-height: 1.35 !important;
          margin: 20px 0 10px !important;
          color: var(--policy-ink) !important;
        }

        .policies-page p {
          font-family: "Source Serif 4", Georgia, serif !important;
          font-size: 16px !important;
          line-height: 1.65 !important;
          color: var(--policy-ink) !important;
          margin: 0 0 16px !important;
        }

        .policies-page ul, .policies-page ol {
          font-family: "Source Serif 4", Georgia, serif !important;
          padding-left: 22px;
          margin: 0 0 20px;
        }

        .policies-page ul li, .policies-page ol li {
          font-family: "Source Serif 4", Georgia, serif !important;
          font-size: 16px !important;
          line-height: 1.65 !important;
          margin-bottom: 10px;
          padding-left: 4px;
          color: var(--policy-ink) !important;
        }

        .policies-page ul li::marker {
          color: var(--policy-gold);
        }

        .policies-page ol li::marker {
          color: var(--policy-gold-deep);
          font-weight: 600;
        }

        .policies-page li strong {
          font-weight: 600;
          color: var(--policy-ink);
        }

        .policies-page .policy-box {
          background: var(--policy-card-bg);
          border: 1px solid var(--policy-rule);
          border-radius: 6px;
          padding: 18px 20px;
          margin: 20px 0;
          font-family: "Source Serif 4", Georgia, serif !important;
          font-size: 16px;
          line-height: 1.65;
          color: var(--policy-ink);
        }

        .policies-page .policy-box p:last-child {
          margin-bottom: 0;
        }

        .policies-page .note {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--policy-rule);
          font-family: "Source Serif 4", Georgia, serif !important;
          font-size: 13.5px;
          color: var(--policy-ink-soft);
          line-height: 1.6;
        }

        .policies-page .note a {
          color: var(--policy-ink);
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .policies-page-wrapper { padding-top: 125px; }
          .policies-page section.policy-section { scroll-margin-top: 90px; }
        }

        @media (max-width: 768px) {
          .policies-page-wrapper { padding-top: 110px; }
          .policies-page { padding-left: 20px; padding-right: 20px; }
          .policies-page .nav-pills { flex-direction: column; gap: 8px; }
          .policies-page section.policy-section { scroll-margin-top: 80px; }
        }
      `)
    );
  }

  window.PoliciesPage = PoliciesPage;
})();
