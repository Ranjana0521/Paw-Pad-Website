/* contact.jsx — Contact Page */

const SparkleIcon = ({ size = 20, color = "var(--driftwood)", style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={style} aria-hidden="true">
    <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
  </svg>
);

const PinterestIcon = ({ size = 16, color = "currentColor", style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} stroke="none" style={style} aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.15 9.42 7.62 11.17-.11-.95-.2-2.4.04-3.44.22-.94 1.4-5.95 1.4-5.95s-.36-.72-.36-1.78c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.41 0-5.41 2.56-5.41 5.2 0 1.03.4 2.13.89 2.73.1.12.11.23.08.35-.09.37-.29 1.19-.33 1.35-.05.23-.18.28-.41.17-1.53-.71-2.49-2.94-2.49-4.73 0-3.86 2.81-7.4 8.09-7.4 4.25 0 7.55 3.03 7.55 7.08 0 4.22-2.66 7.62-6.36 7.62-1.24 0-2.41-.65-2.81-1.41l-.76 2.9c-.28 1.06-1.02 2.39-1.52 3.21 1.14.35 2.35.54 3.61.54 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
  </svg>
);

function ContactPage({ onBook }) {
  useReveal();

  return (
    <div className="contact-page-wrapper">
      {/* Top Banner / Say Hello */}
      <section className="contact-banner-section">
        <div className="container">
          <div className="banner-gold-dot-wrap">
            <div className="banner-gold-dot"></div>
          </div>
          <div className="contact-banner-grid reveal in">
            <div className="contact-banner-left">
              <p className="eyebrow">Contact Pawpad</p>
              <h1 className="h-display contact-main-headline">Come say hello.</h1>
              <p className="lead contact-banner-lead">
                Have a question about grooming, care, boarding or our services? Reach out to Pawpad. We would love to hear from you.
              </p>
            </div>
            <div className="contact-studio-badge">
              <span className="studio-label">STUDIO</span>
              <h3 className="studio-name">Kalyan Nagar</h3>
              <span className="studio-city">BENGALURU</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Content & Card Section */}
      <section className="contact-main-section">
        <div className="container contact-content-grid">
          {/* Left Column: Direct Info & Numbered Details */}
          <div className="contact-info-col reveal">
            <p className="eyebrow">Get in touch</p>
            <h2 className="h-1 contact-title">We are here for you.</h2>
            <p className="contact-subtext">
              Whether you are booking a grooming session, asking about our services, or simply want to know more about Pawpad, reach out to us.
            </p>

            {/* Numbered Detail List */}
            <div className="contact-details-list">
              {/* 01 EMAIL */}
              <div className="contact-detail-item">
                <div className="cd-num-label">
                  <span className="cd-num">01</span>
                  <span className="cd-label">EMAIL</span>
                </div>
                <div className="cd-content">
                  <a href="mailto:info@pawpad.in" className="cd-value-link cd-value-title">
                    info@pawpad.in
                  </a>
                </div>
              </div>

              {/* 02 PHONE */}
              <div className="contact-detail-item">
                <div className="cd-num-label">
                  <span className="cd-num">02</span>
                  <span className="cd-label">PHONE</span>
                </div>
                <div className="cd-content">
                  <a href="tel:+919663077496" className="cd-value-link cd-value-title">
                    9663077496
                  </a>
                </div>
              </div>

              {/* 03 ADDRESS */}
              <div className="contact-detail-item">
                <div className="cd-num-label">
                  <span className="cd-num">03</span>
                  <span className="cd-label">ADDRESS</span>
                </div>
                <div className="cd-content cd-text-block">
                  <p>#426, 5th Main Road,</p>
                  <p>HRBR 2nd Block, Kalyan Nagar</p>
                  <p>Bangalore - 560043 India</p>
                </div>
              </div>

              {/* 04 OPENING HOURS */}
              <div className="contact-detail-item">
                <div className="cd-num-label">
                  <span className="cd-num">04</span>
                  <span className="cd-label">OPENING HOURS</span>
                </div>
                <div className="cd-content cd-text-block">
                  <p>Weekdays: 11 AM - 8 PM</p>
                  <p>Weekends: 10 AM - 8 PM</p>
                  <p className="closed-accent">Thursdays: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Card */}
          <div className="contact-card-col reveal">
            <div className="contact-studio-card">
              <p className="eyebrow card-eyebrow">Pawpad Grooming Studio</p>
              <h2 className="card-title">
                Soft hands<br />
                <em className="italic card-italic">Calm pets.</em>
              </h2>
              <p className="card-desc">
                Sessions are spaced and never rushed. We plan around your pet's temperament, comfort and wellbeing.
              </p>
              <div className="card-actions">
                <button
                  className="btn btn-primary card-btn-book"
                  onClick={() => onBook && onBook("grooming")}
                >
                  Book a session <Arrow size={14} />
                </button>
                <a href="tel:+919663077496" className="btn btn-secondary card-btn-call">
                  Call us
                </a>
              </div>
              <div className="card-sparkle">
                <SparkleIcon size={24} color="var(--driftwood)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Connected Section */}
      <section className="contact-social-section">
        <div className="container">
          <div className="social-row-container reveal">
            <div>
              <p className="eyebrow">Follow Pawpad</p>
              <h2 className="h-1 social-section-title">Stay connected.</h2>
            </div>
            <div className="contact-social-pills">
              <a
                href="https://www.instagram.com/pawpad_grooming_studio?igsi=MTRranltYzh1cnVuZw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle-btn"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/19KxDx35E5/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle-btn"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
              <a
                href="https://x.com/Pawpad_Blore"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle-btn"
                aria-label="Twitter"
              >
                <TwitterIcon size={20} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-circle-btn"
                aria-label="Pinterest"
              >
                <PinterestIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Come Visit & Map Section */}
      <section className="contact-map-section">
        <div className="container">
          <div className="map-head reveal">
            <p className="eyebrow">Find us</p>
            <h2 className="h-1 map-section-title">Come visit.</h2>
          </div>
          <div className="contact-map-wrapper reveal">
            <iframe
              title="Pawpad Studio Kalyan Nagar Bangalore Location"
              className="contact-map-iframe"
              src="https://maps.google.com/maps?q=Pawpad%2C%20426%2C%205th%20Main%20Rd%2C%20HRBR%20Layout%202nd%20Block%2C%20Kalyan%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560043&t=&z=16&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
