(function () {
  const { useState, useEffect } = React;

  const SparkleIcon = ({ size = 20, color = "var(--driftwood)", style }) => /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: color,
    style,
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z"
  }));

  const PinterestIcon = ({ size = 16, color = "currentColor", style }) => /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: color,
    stroke: "none",
    style,
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M12 0C5.37 0 0 5.37 0 12c0 5.08 3.15 9.42 7.62 11.17-.11-.95-.2-2.4.04-3.44.22-.94 1.4-5.95 1.4-5.95s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.41 0-5.41 2.56-5.41 5.2 0 1.03.4 2.13.89 2.73.1.12.11.23.08.35-.09.37-.29 1.19-.33 1.35-.05.23-.18.28-.41.17-1.53-.71-2.49-2.94-2.49-4.73 0-3.86 2.81-7.4 8.09-7.4 4.25 0 7.55 3.03 7.55 7.08 0 4.22-2.66 7.62-6.36 7.62-1.24 0-2.41-.65-2.81-1.41l-.76 2.9c-.28 1.06-1.02 2.39-1.52 3.21 1.14.35 2.35.54 3.61.54 6.63 0 12-5.37 12-12S18.63 0 12 0z"
  }));

  function ContactPage({ onBook }) {
    if (typeof useReveal === "function") {
      useReveal();
    }

    return /* @__PURE__ */ React.createElement("div", { className: "contact-page-wrapper" },
      
      /* SECTION 1: Top Banner / Come say hello (Cream Background) */
      /* @__PURE__ */ React.createElement("section", { className: "contact-banner-section" },
        /* @__PURE__ */ React.createElement("div", { className: "container" },
          /* @__PURE__ */ React.createElement("div", { className: "contact-banner-grid reveal in" },
            /* @__PURE__ */ React.createElement("div", { className: "contact-banner-left" },
              /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Contact Pawpad"),
              /* @__PURE__ */ React.createElement("h1", { className: "h-display contact-main-headline" }, "Come say hello."),
              /* @__PURE__ */ React.createElement("p", { className: "lead contact-banner-lead" },
                "Have a question about grooming, care, boarding or our services? Reach out to Pawpad. We would love to hear from you."
              )
            ),
            /* @__PURE__ */ React.createElement("div", { className: "contact-studio-badge" },
              /* @__PURE__ */ React.createElement("span", { className: "studio-label" }, "STUDIO"),
              /* @__PURE__ */ React.createElement("h3", { className: "studio-name" }, "Kalyan Nagar"),
              /* @__PURE__ */ React.createElement("span", { className: "studio-city" }, "BENGALURU")
            )
          ),
          /* @__PURE__ */ React.createElement("div", { className: "banner-gold-dot-row" },
            /* @__PURE__ */ React.createElement("div", { className: "floating-gold-dot" })
          )
        )
      ),

      /* SECTION 2: Get in Touch & Studio Card (Warm Champagne Background) */
      /* @__PURE__ */ React.createElement("section", { className: "contact-main-section" },
        /* @__PURE__ */ React.createElement("div", { className: "container contact-content-grid" },
          
          /* Left Column: Direct Info & Numbered Details */
          /* @__PURE__ */ React.createElement("div", { className: "contact-info-col reveal" },
            /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Get in touch"),
            /* @__PURE__ */ React.createElement("h2", { className: "h-1 contact-title" },
              "We are here for you."
            ),
            /* @__PURE__ */ React.createElement("p", { className: "contact-subtext" },
              "Whether you are booking a grooming session, asking about our services, or simply want to know more about Pawpad, reach out to us."
            ),

            /* Numbered Detail List */
            /* @__PURE__ */ React.createElement("div", { className: "contact-details-list" },
              
              /* 01 EMAIL */
              /* @__PURE__ */ React.createElement("div", { className: "contact-detail-item" },
                /* @__PURE__ */ React.createElement("div", { className: "cd-num-label" },
                  /* @__PURE__ */ React.createElement("span", { className: "cd-num" }, "01"),
                  /* @__PURE__ */ React.createElement("span", { className: "cd-label" }, "EMAIL")
                ),
                /* @__PURE__ */ React.createElement("div", { className: "cd-content" },
                  /* @__PURE__ */ React.createElement("a", { href: "mailto:info@pawpad.in", className: "cd-value-link cd-value-title" },
                    "info@pawpad.in"
                  )
                )
              ),

              /* 02 PHONE */
              /* @__PURE__ */ React.createElement("div", { className: "contact-detail-item" },
                /* @__PURE__ */ React.createElement("div", { className: "cd-num-label" },
                  /* @__PURE__ */ React.createElement("span", { className: "cd-num" }, "02"),
                  /* @__PURE__ */ React.createElement("span", { className: "cd-label" }, "PHONE")
                ),
                /* @__PURE__ */ React.createElement("div", { className: "cd-content" },
                  /* @__PURE__ */ React.createElement("a", { href: "tel:+919663077496", className: "cd-value-link cd-value-title" },
                    "9663077496"
                  )
                )
              ),

              /* 03 ADDRESS */
              /* @__PURE__ */ React.createElement("div", { className: "contact-detail-item" },
                /* @__PURE__ */ React.createElement("div", { className: "cd-num-label" },
                  /* @__PURE__ */ React.createElement("span", { className: "cd-num" }, "03"),
                  /* @__PURE__ */ React.createElement("span", { className: "cd-label" }, "ADDRESS")
                ),
                /* @__PURE__ */ React.createElement("div", { className: "cd-content cd-text-block" },
                  /* @__PURE__ */ React.createElement("p", null, "#426, 5th Main Road,"),
                  /* @__PURE__ */ React.createElement("p", null, "HRBR 2nd Block, Kalyan Nagar"),
                  /* @__PURE__ */ React.createElement("p", null, "Bangalore - 560043 India")
                )
              ),

              /* 04 OPENING HOURS */
              /* @__PURE__ */ React.createElement("div", { className: "contact-detail-item" },
                /* @__PURE__ */ React.createElement("div", { className: "cd-num-label" },
                  /* @__PURE__ */ React.createElement("span", { className: "cd-num" }, "04"),
                  /* @__PURE__ */ React.createElement("span", { className: "cd-label" }, "OPENING HOURS")
                ),
                /* @__PURE__ */ React.createElement("div", { className: "cd-content cd-text-block" },
                  /* @__PURE__ */ React.createElement("p", null, "Weekdays: 11 AM - 8 PM"),
                  /* @__PURE__ */ React.createElement("p", null, "Weekends: 10 AM - 8 PM"),
                  /* @__PURE__ */ React.createElement("p", { className: "closed-accent" }, "Thursdays: Closed")
                )
              )
            )
          ),

          /* Right Column: Studio Card */
          /* @__PURE__ */ React.createElement("div", { className: "contact-card-col reveal" },
            /* @__PURE__ */ React.createElement("div", { className: "contact-studio-card" },
              /* @__PURE__ */ React.createElement("p", { className: "eyebrow card-eyebrow" }, "Pawpad Grooming Studio"),
              /* @__PURE__ */ React.createElement("h2", { className: "card-title" },
                "Soft hands",
                /* @__PURE__ */ React.createElement("br", null),
                /* @__PURE__ */ React.createElement("em", { className: "italic card-italic" }, "Calm pets.")
              ),
              /* @__PURE__ */ React.createElement("p", { className: "card-desc" },
                "Sessions are spaced and never rushed. We plan around your pet's temperament, comfort and wellbeing."
              ),
              /* @__PURE__ */ React.createElement("div", { className: "card-actions" },
                /* @__PURE__ */ React.createElement("button", {
                  className: "btn btn-primary card-btn-book",
                  onClick: () => onBook && onBook("grooming")
                }, "Book a session ", /* @__PURE__ */ React.createElement(Arrow, { size: 14 })),
                /* @__PURE__ */ React.createElement("a", {
                  href: "tel:+919663077496",
                  className: "btn btn-secondary card-btn-call"
                }, "Call us")
              ),
              /* @__PURE__ */ React.createElement("div", { className: "card-accents-corner" },
                /* @__PURE__ */ React.createElement(SparkleIcon, { size: 18, color: "var(--driftwood)" }),
                /* @__PURE__ */ React.createElement("span", { className: "card-gold-dot" })
              )
            )
          )
        )
      ),

      /* SECTION 3: Stay Connected & Follow Pawpad (Cream Background) */
      /* @__PURE__ */ React.createElement("section", { className: "contact-social-section" },
        /* @__PURE__ */ React.createElement("div", { className: "container" },
          /* @__PURE__ */ React.createElement("div", { className: "social-row-container reveal" },
            /* @__PURE__ */ React.createElement("div", null,
              /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Follow Pawpad"),
              /* @__PURE__ */ React.createElement("h2", { className: "h-1 social-section-title" }, "Stay connected.")
            ),
            /* @__PURE__ */ React.createElement("div", { className: "contact-social-pills" },
              /* @__PURE__ */ React.createElement("a", {
                href: "https://www.instagram.com/pawpad_grooming_studio?igsi=MTRranltYzh1cnVuZw%3D%3D&utm_source=qr",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "social-circle-btn",
                "aria-label": "Instagram"
              }, /* @__PURE__ */ React.createElement(InstagramIcon, { size: 20 })),
              /* @__PURE__ */ React.createElement("a", {
                href: "https://www.facebook.com/share/19KxDx35E5/?mibextid=wwXIfr",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "social-circle-btn",
                "aria-label": "Facebook"
              }, /* @__PURE__ */ React.createElement(FacebookIcon, { size: 20 })),
              /* @__PURE__ */ React.createElement("a", {
                href: "https://x.com/Pawpad_Blore",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "social-circle-btn",
                "aria-label": "Twitter"
              }, /* @__PURE__ */ React.createElement(TwitterIcon, { size: 20 })),
              /* @__PURE__ */ React.createElement("a", {
                href: "https://pinterest.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "social-circle-btn",
                "aria-label": "Pinterest"
              }, /* @__PURE__ */ React.createElement(PinterestIcon, { size: 20 }))
            )
          )
        )
      ),

      /* SECTION 4: Find Us & Interactive Map (Cream Background) */
      /* @__PURE__ */ React.createElement("section", { className: "contact-map-section" },
        /* @__PURE__ */ React.createElement("div", { className: "container" },
          /* @__PURE__ */ React.createElement("div", { className: "map-head reveal" },
            /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, "Find us"),
            /* @__PURE__ */ React.createElement("h2", { className: "h-1 map-section-title" }, "Come visit.")
          ),
          /* @__PURE__ */ React.createElement("div", { className: "contact-map-wrapper reveal" },
            /* @__PURE__ */ React.createElement("iframe", {
              title: "Pawpad Studio Kalyan Nagar Bangalore Location",
              className: "contact-map-iframe",
              src: "https://maps.google.com/maps?q=Pawpad%2C%20426%2C%205th%20Main%20Rd%2C%20HRBR%20Layout%202nd%20Block%2C%20Kalyan%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560043&t=&z=16&ie=UTF8&iwloc=&output=embed",
              loading: "lazy",
              allowFullScreen: true,
              referrerPolicy: "no-referrer-when-downgrade"
            })
          )
        )
      ),

      /* Page Styles */
      /* @__PURE__ */ React.createElement("style", null, `
        .contact-page-wrapper {
          padding-top: 130px;
          background: var(--cream-bg);
        }

        /* Banner Section (Top) */
        .contact-banner-section {
          padding: 50px 0 60px;
          position: relative;
          background: var(--cream-bg);
        }
        .contact-banner-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 60px;
          align-items: end;
        }
        .contact-main-headline {
          margin-top: 20px;
          font-size: clamp(56px, 7.5vw, 120px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .contact-banner-lead {
          margin-top: 24px;
          font-size: 18px;
          line-height: 1.6;
          max-width: 52ch;
          color: var(--ink-soft);
        }
        .contact-studio-badge {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-left: 40px;
          border-left: 1px solid color-mix(in oklab, var(--ink), transparent 85%);
        }
        .studio-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .studio-name {
          font-family: var(--f-display);
          font-size: clamp(32px, 3.6vw, 48px);
          line-height: 1.1;
          color: var(--ink);
          margin: 0;
        }
        .studio-city {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .banner-gold-dot-row {
          display: flex;
          justify-content: flex-end;
          padding-right: 30%;
          margin-top: 20px;
        }
        .floating-gold-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--driftwood);
          opacity: 0.85;
        }

        /* Main Content Section (Champagne Background) */
        .contact-main-section {
          padding: 70px 0 100px;
          background: var(--champagne-soft);
          border-top: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          border-bottom: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
        }
        .contact-content-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 64px;
          align-items: start;
        }
        .contact-info-col {
          display: flex;
          flex-direction: column;
        }
        .contact-title {
          margin-top: 20px;
          font-size: clamp(48px, 6vw, 92px);
          line-height: 1.0;
          letter-spacing: -0.015em;
        }
        .contact-subtext {
          margin-top: 26px;
          font-size: 17px;
          line-height: 1.65;
          max-width: 48ch;
          color: var(--ink-soft);
        }

        /* Details List */
        .contact-details-list {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
        }
        .contact-detail-item {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 20px;
          align-items: baseline;
          padding: 26px 0;
          border-top: 1px solid color-mix(in oklab, var(--ink), transparent 86%);
        }
        .contact-detail-item:last-child {
          border-bottom: 1px solid color-mix(in oklab, var(--ink), transparent 86%);
        }
        .cd-num-label {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cd-num {
          font-size: 14px;
          font-weight: 500;
          color: var(--driftwood);
        }
        .cd-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-mute);
        }
        .cd-content p {
          margin: 0 0 4px;
          font-size: 16px;
          line-height: 1.55;
          color: var(--ink-soft);
        }
        .cd-content p:last-child {
          margin-bottom: 0;
        }
        .cd-value-title {
          font-family: var(--f-display);
          font-size: clamp(18px, 1.35vw, 21px);
          line-height: 1.3;
          color: var(--ink);
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .cd-value-link {
          text-decoration: none;
          display: inline-block;
          transition: color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease);
        }
        .cd-value-link:hover {
          color: var(--driftwood-deep);
          transform: translateX(4px);
        }
        .closed-accent {
          color: var(--driftwood-deep) !important;
          font-weight: 600;
        }

        /* Right Column: Studio Card */
        .contact-card-col {
          position: sticky;
          top: 120px;
        }
        .contact-studio-card {
          background: var(--white);
          border-radius: 44px;
          padding: clamp(38px, 5vw, 56px);
          position: relative;
          box-shadow: 0 20px 48px -12px rgba(46, 46, 46, 0.08);
          border: 1px solid color-mix(in oklab, var(--ink), transparent 92%);
          transition: transform var(--t-med) var(--ease), box-shadow var(--t-med) var(--ease);
        }
        .contact-studio-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 56px -12px rgba(46, 46, 46, 0.14);
        }
        body[data-palette="dark"] .contact-studio-card {
          background: color-mix(in oklab, var(--champagne), black 5%);
          box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.4);
        }
        .card-eyebrow {
          margin-bottom: 24px;
        }
        .card-title {
          font-size: clamp(44px, 5.2vw, 76px);
          line-height: 1.02;
          color: var(--ink);
          margin-bottom: 24px;
          letter-spacing: -0.015em;
        }
        .card-italic {
          color: var(--driftwood);
          font-style: italic;
        }
        .card-desc {
          font-size: 16px;
          line-height: 1.65;
          color: var(--ink-soft);
          margin-bottom: 36px;
          max-width: 38ch;
        }
        .card-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        .card-btn-book {
          padding: 14px 30px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 999px;
        }
        .card-btn-call {
          padding: 14px 30px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 999px;
          background: transparent;
          color: var(--ink);
          border: 1.5px solid color-mix(in oklab, var(--ink), transparent 80%);
          transition: all var(--t-fast) var(--ease);
        }
        .card-btn-call:hover {
          background: var(--ink);
          color: var(--white);
          border-color: var(--ink);
        }
        .card-accents-corner {
          position: absolute;
          bottom: 34px;
          right: 36px;
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0.8;
          pointer-events: none;
        }
        .card-gold-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--driftwood);
        }

        /* Social Section */
        .contact-social-section {
          padding: 70px 0 50px;
          background: var(--cream-bg);
        }
        .social-row-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 32px;
        }
        .social-section-title {
          margin-top: 16px;
          font-size: clamp(42px, 5vw, 72px);
          letter-spacing: -0.015em;
        }
        .contact-social-pills {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .social-circle-btn {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--champagne);
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all var(--t-fast) var(--ease);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .social-circle-btn:hover {
          background: var(--ink);
          color: var(--white);
          transform: translateY(-3px) scale(1.06);
        }

        /* Map Section */
        .contact-map-section {
          padding: 40px 0 90px;
          background: var(--cream-bg);
        }
        .map-head {
          margin-bottom: 36px;
        }
        .map-section-title {
          margin-top: 16px;
          font-size: clamp(42px, 5vw, 72px);
          letter-spacing: -0.015em;
        }
        .contact-map-wrapper {
          width: 100%;
          height: clamp(380px, 48vw, 560px);
          border-radius: 36px;
          overflow: hidden;
          border: 1px solid color-mix(in oklab, var(--ink), transparent 88%);
          box-shadow: 0 24px 48px -16px rgba(0,0,0,0.08);
        }
        .contact-map-iframe {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        /* Responsive Rules */
        @media (max-width: 960px) {
          .contact-page-wrapper {
            padding-top: 110px;
          }
          .contact-banner-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .contact-studio-badge {
            padding-left: 0;
            border-left: none;
            padding-top: 20px;
            border-top: 1px solid color-mix(in oklab, var(--ink), transparent 85%);
          }
          .contact-content-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .contact-card-col {
            position: static;
          }
          .banner-gold-dot-row {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .contact-detail-item {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .social-row-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .contact-studio-card {
            border-radius: 28px;
            padding: 32px 22px;
          }
          .contact-map-wrapper {
            border-radius: 24px;
            height: 340px;
          }
        }
      `)
    );
  }

  window.ContactPage = ContactPage;
})();
