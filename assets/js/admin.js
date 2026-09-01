/**
 * Pawpad Management Suite — Admin Control Application
 * Features:
 * - Secure PIN Authentication Gate
 * - Omnichannel Website Content Editor (Home, About, Grooming, Courses, Boarding, Forms, etc.)
 * - Course Applications Review & Approval Workflow
 * - Automatic WebP Image Optimizer & Slot Assigning
 * - JSON Export / Import & Factory Reset
 */

(function () {
  const { useState, useEffect, useRef, useMemo } = React;

  const DEFAULT_WHITELIST = ["tharunsn04@gmail.com", "ranjanah0521@gmail.com", "test@test.com"];
  const WHITELIST_STORAGE_KEY = "pawpad_admin_whitelist";
  const GOOGLE_CLIENT_ID_KEY = "pawpad_admin_google_client_id";
  const GOOGLE_CLIENT_ID = "1057951951261-m9vj6tc6lkbr68rg5nb91pjt2f5tqf25.apps.googleusercontent.com";
  const AUTH_USER_STORAGE_KEY = "pawpad_admin_user";
  const AUTH_STORAGE_KEY = "pawpad_admin_auth_session";

  // Helper: Retrieve whitelist
  function getWhitelistedEmails() {
    try {
      const stored = localStorage.getItem(WHITELIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(e => (typeof e === 'string' ? e.trim().toLowerCase() : '')).filter(Boolean);
        }
      }
    } catch (e) { }
    return DEFAULT_WHITELIST.map(e => e.toLowerCase());
  }

  // Helper: Check authorization
  function isEmailAuthorized(email) {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return getWhitelistedEmails().includes(clean);
  }

  // Helper: Decode JWT
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  // Icons Helper
  const Icons = {
    Dashboard: () => React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("rect", { x: 3, y: 3, width: 7, height: 7 }), React.createElement("rect", { x: 14, y: 3, width: 7, height: 7 }), React.createElement("rect", { x: 14, y: 14, width: 7, height: 7 }), React.createElement("rect", { x: 3, y: 14, width: 7, height: 7 })),
    Applications: () => React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), React.createElement("polyline", { points: "14 2 14 8 20 8" }), React.createElement("line", { x1: 16, y1: 13, x2: 8, y2: 13 }), React.createElement("line", { x1: 16, y1: 17, x2: 8, y2: 17 }), React.createElement("polyline", { points: "10 9 9 9 8 9" })),
    Content: () => React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), React.createElement("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })),
    Media: () => React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("rect", { x: 3, y: 3, width: 18, height: 18, rx: 2, ry: 2 }), React.createElement("circle", { cx: 8.5, cy: 8.5, r: 1.5 }), React.createElement("polyline", { points: "21 15 16 10 5 21" })),
    Settings: () => React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("circle", { cx: 12, cy: 12, r: 3 }), React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })),
    Check: () => React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("polyline", { points: "20 6 9 17 4 12" })),
    Close: () => React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("line", { x1: 18, y1: 6, x2: 6, y2: 18 }), React.createElement("line", { x1: 6, y1: 6, x2: 18, y2: 18 })),
    External: () => React.createElement("svg", { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), React.createElement("polyline", { points: "15 3 21 3 21 9" }), React.createElement("line", { x1: 10, y1: 14, x2: 21, y2: 3 })),
    Paw: () => React.createElement("svg", { viewBox: "0 0 64 64", width: 22, height: 22, fill: "var(--admin-gold)" }, React.createElement("ellipse", { cx: "32", cy: "16", rx: "5.5", ry: "7.5" }), React.createElement("ellipse", { cx: "20", cy: "24", rx: "6", ry: "8" }), React.createElement("ellipse", { cx: "44", cy: "24", rx: "6", ry: "8" }), React.createElement("ellipse", { cx: "11", cy: "38", rx: "5", ry: "6.5" }), React.createElement("ellipse", { cx: "53", cy: "38", rx: "5", ry: "6.5" }), React.createElement("ellipse", { cx: "32", cy: "46", rx: "13", ry: "11" })),
    Google: () => React.createElement("svg", { width: 18, height: 18, viewBox: "0 0 24 24" }, React.createElement("path", { fill: "#EA4335", d: "M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" }), React.createElement("path", { fill: "#4285F4", d: "M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" }), React.createElement("path", { fill: "#FBBC05", d: "M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" }), React.createElement("path", { fill: "#34A853", d: "M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" })),
    Shield: () => React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })),
    User: () => React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), React.createElement("circle", { cx: 12, cy: 7, r: "4" })),
    Sun: () => React.createElement("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("circle", { cx: 12, cy: 12, r: 5 }), React.createElement("line", { x1: 12, y1: 1, x2: 12, y2: 3 }), React.createElement("line", { x1: 12, y1: 21, x2: 12, y2: 23 }), React.createElement("line", { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 }), React.createElement("line", { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 }), React.createElement("line", { x1: 1, y1: 12, x2: 3, y2: 12 }), React.createElement("line", { x1: 21, y1: 12, x2: 23, y2: 12 }), React.createElement("line", { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 }), React.createElement("line", { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 })),
    Moon: () => React.createElement("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })),
    Trash: () => React.createElement("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("polyline", { points: "3 6 5 6 21 6" }), React.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), React.createElement("line", { x1: "10", y1: "11", x2: "10", y2: "17" }), React.createElement("line", { x1: "14", y1: "11", x2: "14", y2: "17" }))
  };

  // AUTHENTICATION GATE (GOOGLE OAUTH & WHITELIST + EMERGENCY PIN)
  function AuthGate({ onAuthenticated }) {
    const [error, setError] = useState("");
    const [gisLoaded, setGisLoaded] = useState(false);
    const [showPinAuth, setShowPinAuth] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinEmail, setPinEmail] = useState("tharunsn04@gmail.com");
    const googleBtnRef = useRef(null);

    const whitelist = useMemo(() => getWhitelistedEmails(), []);

    const handleCredentialResponse = (response) => {
      setError("");
      if (!response || !response.credential) {
        setError("No Google credential token received.");
        return;
      }
      const payload = parseJwt(response.credential);
      if (!payload || !payload.email) {
        setError("Unable to read email from Google ID token.");
        return;
      }

      const email = payload.email.toLowerCase();
      if (isEmailAuthorized(email)) {
        const userData = {
          email: payload.email,
          name: payload.name || email.split("@")[0],
          picture: payload.picture || null,
          authenticatedAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userData));
        onAuthenticated(userData);
      } else {
        setError(`Access Denied: (${payload.email}) is not authorized to access this administration console.`);
      }
    };

    const handlePinSubmit = (e) => {
      e.preventDefault();
      setError("");
      const cleanEmail = (pinEmail || "").trim().toLowerCase();
      const enteredPin = (pinInput || "").trim();

      if (!isEmailAuthorized(cleanEmail)) {
        setError(`Email '${cleanEmail}' is not on the administrator whitelist.`);
        return;
      }

      const validPins = ["2017", "pawpad2017", "admin2017"];
      const customPin = localStorage.getItem("pawpad_admin_passcode");
      if (customPin) validPins.push(customPin);

      if (validPins.includes(enteredPin)) {
        const userData = {
          email: cleanEmail,
          name: cleanEmail.split("@")[0],
          picture: null,
          authenticatedAt: new Date().toISOString(),
          authMethod: "pin_passcode"
        };
        localStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userData));
        onAuthenticated(userData);
      } else {
        setError("Invalid administrator PIN or passcode.");
      }
    };

    // Detect Google Identity Services library
    useEffect(() => {
      let count = 0;
      const checkGis = () => {
        if (window.google?.accounts?.id) {
          setGisLoaded(true);
        } else if (count < 60) {
          count++;
          setTimeout(checkGis, 100);
        }
      };
      checkGis();
    }, []);

    // Render Google Sign In Button
    useEffect(() => {
      if (gisLoaded && googleBtnRef.current && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID.trim(),
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });
          googleBtnRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(
            googleBtnRef.current,
            {
              type: "standard",
              theme: "filled_black",
              size: "large",
              shape: "pill",
              text: "signin_with",
              logo_alignment: "left",
              width: 300
            }
          );
        } catch (err) {
          console.warn("GIS initialization notice:", err);
        }
      }
    }, [gisLoaded]);

    const handleCustomGoogleClick = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.prompt();
        } catch (e) {
          console.error(e);
        }
      }
    };

    return React.createElement(
      "div",
      {
        style: {
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at center, var(--admin-card-hover) 0%, var(--admin-bg) 100%)",
          padding: "24px"
        }
      },
      React.createElement(
        "div",
        {
          className: "card",
          style: {
            maxWidth: "440px",
            width: "100%",
            textAlign: "center",
            padding: "48px 36px",
            boxShadow: "0 20px 50px rgba(46,46,46,0.08)",
            border: "1px solid var(--admin-border)",
            position: "relative"
          }
        },
        React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: "16px" } }, React.createElement(Icons.Paw, null)),
        React.createElement("h1", { style: { fontFamily: "var(--font-display)", fontSize: "26px", color: "var(--admin-text)", marginBottom: "8px" } }, "Pawpad Admin Portal"),
        React.createElement("p", { style: { color: "var(--admin-text-muted)", fontSize: "14px", marginBottom: "28px" } }, "Authorized staff only. Sign in to unlock management controls."),

        // Error message
        error && React.createElement(
          "div",
          { style: { color: "var(--admin-danger)", background: "rgba(248, 113, 113, 0.12)", border: "1px solid rgba(248, 113, 113, 0.3)", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", marginBottom: "20px", textAlign: "left", lineHeight: "1.4" } },
          "⚠️ ", error
        ),

        // Primary Google Sign In
        !showPinAuth && React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50px", marginBottom: "12px" } },
          React.createElement("div", { ref: googleBtnRef, style: { minHeight: "44px", display: "flex", justifyContent: "center" } }),
          !gisLoaded && React.createElement(
            "button",
            {
              type: "button",
              onClick: handleCustomGoogleClick,
              className: "btn-admin btn-admin-primary",
              style: {
                width: "280px",
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "14px",
                borderRadius: "30px"
              }
            },
            React.createElement(Icons.Google, null),
            "Sign in with Google"
          )
        ),

        // Fallback PIN / Passcode form
        showPinAuth && React.createElement(
          "form",
          { onSubmit: handlePinSubmit, style: { display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" } },
          React.createElement("div", null,
            React.createElement("label", { style: { fontSize: "12px", fontWeight: "600", color: "var(--admin-text-muted)" } }, "Staff Whitelist Email"),
            React.createElement("input", {
              type: "email",
              className: "input-field",
              required: true,
              value: pinEmail,
              onChange: (e) => setPinEmail(e.target.value),
              placeholder: "Enter your Email"
            })
          ),
          React.createElement("div", null,
            React.createElement("label", { style: { fontSize: "12px", fontWeight: "600", color: "var(--admin-text-muted)" } }, "Admin PIN / Passcode"),
            React.createElement("input", {
              type: "password",
              className: "input-field",
              required: true,
              value: pinInput,
              onChange: (e) => setPinInput(e.target.value),
              placeholder: "Enter 4-digit PIN"
            })
          ),
          React.createElement(
            "button",
            { type: "submit", className: "btn-admin btn-admin-primary", style: { marginTop: "6px" } },
            "Authenticate with Passcode"
          )
        ),

        // Toggle PIN / Google Auth
        React.createElement(
          "button",
          {
            type: "button",
            onClick: () => {
              setShowPinAuth(!showPinAuth);
              setError("");
            },
            style: {
              background: "none",
              border: "none",
              color: "var(--admin-gold)",
              fontSize: "12.5px",
              cursor: "pointer",
              marginTop: "16px",
              textDecoration: "underline"
            }
          },
          showPinAuth ? "← Use Google Sign-In" : "Staff Passcode / Emergency Sign-In →"
        ),

        React.createElement(
          "div",
          { style: { marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--admin-border-subtle)", fontSize: "12px", color: "var(--admin-text-faint)" } },
          "Protected by Google Identity Services & Strict Whitelist"
        )
      )
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD OVERVIEW TAB
  // -------------------------------------------------------------
  function DashboardTab({ stats, setActiveTab, applications }) {
    const recentApps = applications.slice(0, 5);
    const overridesCount = window.PawpadContentStore ? window.PawpadContentStore.getOverrideCount() : 0;

    return React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "28px" } },

      // Welcome banner
      React.createElement(
        "div",
        { className: "card admin-banner", style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" } },
        React.createElement(
          "div",
          null,
          React.createElement("h2", { style: { fontFamily: "var(--font-display)", fontSize: "24px", marginBottom: "6px" } }, "Welcome to Pawpad Control Center"),
          React.createElement("p", { style: { fontSize: "14px" } }, "Manage live website contents, approve course applications, and optimize WebP images across all pages.")
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: "10px" } },
          React.createElement("button", { className: "btn-admin btn-admin-secondary", onClick: () => setActiveTab("content") }, "Edit Website Copy"),
          React.createElement("button", { className: "btn-admin btn-admin-primary", onClick: () => setActiveTab("applications") }, "View Applications (", stats.pending, ")")
        )
      ),

      // Metrics Tiles
      React.createElement(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" } },

        React.createElement(
          "div",
          { className: "card", style: { cursor: "pointer" }, onClick: () => setActiveTab("applications") },
          React.createElement("div", { style: { fontSize: "13px", color: "var(--admin-text-muted)", marginBottom: "8px" } }, "Pending Course Admissions"),
          React.createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: stats.pending > 0 ? "var(--admin-warning)" : "var(--admin-text)" } }, stats.pending),
          React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-faint)", marginTop: "6px" } }, "Requires staff review & action")
        ),

        React.createElement(
          "div",
          { className: "card", style: { cursor: "pointer" }, onClick: () => setActiveTab("applications") },
          React.createElement("div", { style: { fontSize: "13px", color: "var(--admin-text-muted)", marginBottom: "8px" } }, "Approved / Enrolled Students"),
          React.createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: "var(--admin-success)" } }, (stats.approved || 0) + (stats.enrolled || 0)),
          React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-faint)", marginTop: "6px" } }, `${stats.approved || 0} approved, ${stats.enrolled || 0} enrolled`)
        ),

        React.createElement(
          "div",
          { className: "card", style: { cursor: "pointer" }, onClick: () => setActiveTab("content") },
          React.createElement("div", { style: { fontSize: "13px", color: "var(--admin-text-muted)", marginBottom: "8px" } }, "Active CMS Customizations"),
          React.createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: "var(--admin-gold)" } }, overridesCount),
          React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-faint)", marginTop: "6px" } }, "Live overrides synced to pages")
        ),

        React.createElement(
          "div",
          { className: "card", style: { cursor: "pointer" }, onClick: () => setActiveTab("media") },
          React.createElement("div", { style: { fontSize: "13px", color: "var(--admin-text-muted)", marginBottom: "8px" } }, "WebP Image Converter"),
          React.createElement("div", { style: { fontSize: "32px", fontWeight: "700", color: "var(--admin-info)" } }, "Ready"),
          React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-faint)", marginTop: "6px" } }, "Auto-compress & update slots")
        )
      ),

      // Recent Applications Table Card
      React.createElement(
        "div",
        { className: "card" },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" } },
          React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--admin-text)" } }, "Recent Course Application Requests"),
          React.createElement("button", { className: "btn-admin btn-admin-secondary", style: { padding: "6px 12px", fontSize: "13px" }, onClick: () => setActiveTab("applications") }, "View All →")
        ),

        recentApps.length === 0
          ? React.createElement("div", { style: { padding: "30px", textAlign: "center", color: "var(--admin-text-muted)" } }, "No applications submitted yet.")
          : React.createElement(
            "div",
            { style: { overflowX: "auto" } },
            React.createElement(
              "table",
              { style: { width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" } },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  { style: { borderBottom: "1px solid var(--admin-border)", color: "var(--admin-text-muted)" } },
                  React.createElement("th", { style: { padding: "12px" } }, "ID"),
                  React.createElement("th", { style: { padding: "12px" } }, "Candidate"),
                  React.createElement("th", { style: { padding: "12px" } }, "Course"),
                  React.createElement("th", { style: { padding: "12px" } }, "Date"),
                  React.createElement("th", { style: { padding: "12px" } }, "Status"),
                  React.createElement("th", { style: { padding: "12px", textAlign: "right" } }, "Action")
                )
              ),
              React.createElement(
                "tbody",
                null,
                recentApps.map((app) =>
                  React.createElement(
                    "tr",
                    { key: app.id, style: { borderBottom: "1px solid var(--admin-border-subtle)" } },
                    React.createElement("td", { style: { padding: "12px", fontFamily: "monospace", color: "var(--admin-gold)" } }, app.id),
                    React.createElement("td", { style: { padding: "12px", fontWeight: "600" } }, app.applicant?.name || "Anonymous"),
                    React.createElement("td", { style: { padding: "12px", color: "var(--admin-text-muted)" } }, app.courseName || "Certification"),
                    React.createElement("td", { style: { padding: "12px", color: "var(--admin-text-faint)", fontSize: "13px" } }, new Date(app.createdAt).toLocaleDateString()),
                    React.createElement(
                      "td",
                      { style: { padding: "12px" } },
                      React.createElement("span", { className: `badge badge-${app.status === "pending_review" ? "pending" : app.status === "approved" ? "approved" : app.status === "rejected" ? "rejected" : app.status === "interview_scheduled" ? "interview" : "enrolled"}` },
                        app.status === "pending_review" ? "Pending Review" : app.status === "approved" ? "Approved" : app.status === "rejected" ? "Declined" : app.status === "interview_scheduled" ? "Interview Set" : "Enrolled"
                      )
                    ),
                    React.createElement(
                      "td",
                      { style: { padding: "12px", textAlign: "right" } },
                      React.createElement("button", { className: "btn-admin btn-admin-secondary", style: { padding: "4px 10px", fontSize: "12px" }, onClick: () => setActiveTab("applications") }, "Review")
                    )
                  )
                )
              )
            )
          )
      )
    );
  }

  // -------------------------------------------------------------
  // COURSE APPLICATIONS APPROVAL SUBPAGE
  // -------------------------------------------------------------
  function ApplicationsTab({ applications, onUpdate }) {
    const [selectedApp, setSelectedApp] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [newNote, setNewNote] = useState("");
    const [interviewInput, setInterviewInput] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);

    const filtered = useMemo(() => {
      return applications.filter((app) => {
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          (app.applicant?.name && app.applicant.name.toLowerCase().includes(q)) ||
          (app.applicant?.email && app.applicant.email.toLowerCase().includes(q)) ||
          (app.applicant?.phone && app.applicant.phone.toLowerCase().includes(q)) ||
          (app.id && app.id.toLowerCase().includes(q)) ||
          (app.courseName && app.courseName.toLowerCase().includes(q));
        return matchesStatus && matchesSearch;
      });
    }, [applications, statusFilter, searchQuery]);

    const visibleDeclined = useMemo(() => {
      return filtered.filter((a) => a.status === "rejected");
    }, [filtered]);

    const selectedDeclinedCount = useMemo(() => {
      return selectedIds.filter((id) => applications.some((a) => a.id === id && a.status === "rejected")).length;
    }, [selectedIds, applications]);

    const allVisibleDeclinedSelected =
      visibleDeclined.length > 0 && visibleDeclined.every((a) => selectedIds.includes(a.id));

    const toggleSelectRow = (id) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const toggleSelectAllVisibleDeclined = () => {
      if (allVisibleDeclinedSelected) {
        const visibleIds = visibleDeclined.map((a) => a.id);
        setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      } else {
        const visibleIds = visibleDeclined.map((a) => a.id);
        setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
      }
    };

    const handleDelete = (app) => {
      if (!app || app.status !== "rejected") return;
      const candidateName = app.applicant?.name ? `${app.applicant.name} (${app.id})` : app.id;
      if (window.confirm(`Are you sure you want to permanently delete declined application ${candidateName}?`)) {
        if (window.PawpadApplicationsStore) {
          window.PawpadApplicationsStore.deleteApplication(app.id);
          if (selectedApp && selectedApp.id === app.id) {
            setSelectedApp(null);
          }
          setSelectedIds((prev) => prev.filter((id) => id !== app.id));
          onUpdate();
        }
      }
    };

    const handleBulkDelete = () => {
      const declinedSelected = selectedIds.filter((id) => {
        const found = applications.find((a) => a.id === id);
        return found && found.status === "rejected";
      });

      if (declinedSelected.length === 0) {
        alert("Please select at least one declined application to delete.");
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to permanently delete ${declinedSelected.length} declined application(s)? This action cannot be undone.`
        )
      ) {
        if (window.PawpadApplicationsStore) {
          if (typeof window.PawpadApplicationsStore.deleteMultiple === "function") {
            window.PawpadApplicationsStore.deleteMultiple(declinedSelected);
          } else {
            declinedSelected.forEach((id) => window.PawpadApplicationsStore.deleteApplication(id));
          }
          if (selectedApp && declinedSelected.includes(selectedApp.id)) {
            setSelectedApp(null);
          }
          setSelectedIds((prev) => prev.filter((id) => !declinedSelected.includes(id)));
          onUpdate();
        }
      }
    };

    const handleStatusChange = (id, newStatus, note = "", interviewDate = "") => {
      if (window.PawpadApplicationsStore) {
        window.PawpadApplicationsStore.updateStatus(id, newStatus, note, interviewDate);
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(window.PawpadApplicationsStore.getById(id));
        }
        onUpdate();
      }
    };

    const handleAddNote = (id) => {
      if (!newNote.trim()) return;
      if (window.PawpadApplicationsStore) {
        window.PawpadApplicationsStore.addNote(id, newNote.trim(), "Admin");
        setNewNote("");
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(window.PawpadApplicationsStore.getById(id));
        }
        onUpdate();
      }
    };

    const handleExport = () => {
      if (window.PawpadApplicationsStore) {
        const csv = window.PawpadApplicationsStore.exportCSV();
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `pawpad-course-applications-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
      }
    };

    const isDeclinedFilter = statusFilter === "rejected";

    return React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "24px" } },

      // Top Controls
      React.createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        React.createElement(
          "div",
          { className: "card", style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" } },

          // Status Filter Buttons
          React.createElement(
            "div",
            { style: { display: "flex", gap: "8px", flexWrap: "wrap" } },
            [
              { id: "all", label: "All Requests" },
              { id: "pending_review", label: "Pending Review" },
              { id: "interview_scheduled", label: "Interview Scheduled" },
              { id: "approved", label: "Approved" },
              { id: "enrolled", label: "Enrolled" },
              { id: "rejected", label: "Declined" }
            ].map((tab) =>
              React.createElement(
                "button",
                {
                  key: tab.id,
                  className: `btn-admin ${statusFilter === tab.id ? "btn-admin-primary" : "btn-admin-secondary"}`,
                  style: { padding: "6px 14px", fontSize: "13px" },
                  onClick: () => setStatusFilter(tab.id)
                },
                tab.label,
                tab.id !== "all" && ` (${applications.filter((a) => a.status === tab.id).length})`
              )
            )
          ),

          // Actions
          React.createElement(
            "div",
            { style: { display: "flex", gap: "10px", alignItems: "center" } },
            React.createElement("input", {
              type: "text",
              className: "input-field",
              placeholder: "Search candidate, phone, email...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              style: { width: "240px", padding: "8px 12px", fontSize: "13px" }
            }),
            React.createElement(
              "button",
              { className: "btn-admin btn-admin-secondary", style: { padding: "8px 14px", fontSize: "13px" }, onClick: handleExport },
              "Export CSV"
            )
          )
        ),

        // Bulk Selection & Delete Bar in Decline Filter
        isDeclinedFilter &&
        React.createElement(
          "div",
          {
            className: "card card-danger",
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              padding: "12px 20px"
            }
          },
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" } },
            React.createElement(
              "label",
              {
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer"
                }
              },
              React.createElement("input", {
                type: "checkbox",
                checked: allVisibleDeclinedSelected,
                onChange: toggleSelectAllVisibleDeclined,
                disabled: visibleDeclined.length === 0,
                style: { width: "16px", height: "16px", cursor: "pointer" }
              }),
              "Select All Visible Declined"
            ),
            React.createElement(
              "span",
              { style: { fontSize: "13px", color: "var(--admin-text-muted)" } },
              selectedDeclinedCount > 0
                ? `(${selectedDeclinedCount} of ${visibleDeclined.length} selected)`
                : `(${visibleDeclined.length} declined total)`
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex", gap: "10px", alignItems: "center" } },
            selectedDeclinedCount > 0 &&
            React.createElement(
              "button",
              {
                className: "btn-admin btn-admin-secondary",
                style: { padding: "6px 12px", fontSize: "12px" },
                onClick: () => setSelectedIds([])
              },
              "Clear Selection"
            ),
            React.createElement(
              "button",
              {
                className: "btn-admin btn-admin-danger",
                style: {
                  padding: "8px 16px",
                  fontSize: "13px",
                  opacity: selectedDeclinedCount === 0 ? 0.6 : 1
                },
                disabled: selectedDeclinedCount === 0,
                onClick: handleBulkDelete
              },
              React.createElement(Icons.Trash, null),
              ` Delete Selected${selectedDeclinedCount > 0 ? ` (${selectedDeclinedCount})` : ""}`
            )
          )
        )
      ),

      // Applications Table
      React.createElement(
        "div",
        { className: "card", style: { padding: "0" } },
        filtered.length === 0
          ? React.createElement("div", { style: { padding: "48px", textAlign: "center", color: "var(--admin-text-muted)" } }, "No matching course applications found.")
          : React.createElement(
            "div",
            { style: { overflowX: "auto" } },
            React.createElement(
              "table",
              { style: { width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" } },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  { style: { borderBottom: "1px solid var(--admin-border)", background: "var(--admin-sidebar)", color: "var(--admin-text-muted)" } },
                  isDeclinedFilter &&
                  React.createElement(
                    "th",
                    { style: { padding: "16px 8px 16px 16px", width: "42px", textAlign: "center" } },
                    React.createElement("input", {
                      type: "checkbox",
                      checked: allVisibleDeclinedSelected,
                      onChange: toggleSelectAllVisibleDeclined,
                      title: "Select All Visible Declined",
                      style: { width: "16px", height: "16px", cursor: "pointer" }
                    })
                  ),
                  React.createElement("th", { style: { padding: "16px" } }, "Application ID"),
                  React.createElement("th", { style: { padding: "16px" } }, "Candidate"),
                  React.createElement("th", { style: { padding: "16px" } }, "Target Course"),
                  React.createElement("th", { style: { padding: "16px" } }, "Location"),
                  React.createElement("th", { style: { padding: "16px" } }, "Date Applied"),
                  React.createElement("th", { style: { padding: "16px" } }, "Status"),
                  React.createElement("th", { style: { padding: "16px", textAlign: "right" } }, "Actions")
                )
              ),
              React.createElement(
                "tbody",
                null,
                filtered.map((app) => {
                  const isDeclined = app.status === "rejected";
                  const isChecked = selectedIds.includes(app.id);

                  return React.createElement(
                    "tr",
                    {
                      key: app.id,
                      style: {
                        borderBottom: "1px solid var(--admin-border-subtle)",
                        transition: "background 0.1s ease",
                        background: isChecked ? "rgba(239, 68, 68, 0.06)" : "transparent"
                      },
                      onMouseEnter: (e) => {
                        if (!isChecked) e.currentTarget.style.background = "rgba(177, 141, 78, 0.05)";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.background = isChecked ? "rgba(239, 68, 68, 0.06)" : "transparent";
                      }
                    },
                    isDeclinedFilter &&
                    React.createElement(
                      "td",
                      { style: { padding: "16px 8px 16px 16px", width: "42px", textAlign: "center" } },
                      React.createElement("input", {
                        type: "checkbox",
                        checked: isChecked,
                        onChange: () => toggleSelectRow(app.id),
                        style: { width: "16px", height: "16px", cursor: "pointer" }
                      })
                    ),
                    React.createElement("td", { style: { padding: "16px", fontFamily: "monospace", color: "var(--admin-gold)", fontWeight: "600" } }, app.id),
                    React.createElement(
                      "td",
                      { style: { padding: "16px" } },
                      React.createElement("div", { style: { fontWeight: "600" } }, app.applicant?.name || "Unnamed Candidate"),
                      React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, app.applicant?.phone || "", app.applicant?.email ? ` · ${app.applicant.email}` : "")
                    ),
                    React.createElement(
                      "td",
                      { style: { padding: "16px" } },
                      React.createElement("div", { style: { color: "var(--admin-text)" } }, app.courseName),
                      React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-gold-light)" } }, app.courseFee)
                    ),
                    React.createElement("td", { style: { padding: "16px", color: "var(--admin-text-muted)" } }, app.applicant?.city || "Bengaluru"),
                    React.createElement("td", { style: { padding: "16px", color: "var(--admin-text-faint)", fontSize: "13px" } }, new Date(app.createdAt).toLocaleDateString()),
                    React.createElement(
                      "td",
                      { style: { padding: "16px" } },
                      React.createElement("span", { className: `badge badge-${app.status === "pending_review" ? "pending" : app.status === "approved" ? "approved" : app.status === "rejected" ? "rejected" : app.status === "interview_scheduled" ? "interview" : "enrolled"}` },
                        app.status === "pending_review" ? "Pending Review" : app.status === "approved" ? "Approved" : app.status === "rejected" ? "Declined" : app.status === "interview_scheduled" ? "Interview Set" : "Enrolled"
                      )
                    ),
                    React.createElement(
                      "td",
                      { style: { padding: "16px", textAlign: "right" } },
                      React.createElement(
                        "div",
                        { style: { display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" } },
                        React.createElement(
                          "button",
                          {
                            className: "btn-admin btn-admin-primary",
                            style: { padding: "6px 14px", fontSize: "13px" },
                            onClick: () => {
                              setSelectedApp(app);
                              setInterviewInput(app.interviewDate || "");
                            }
                          },
                          "Inspect & Approve"
                        ),
                        isDeclined &&
                        React.createElement(
                          "button",
                          {
                            className: "btn-admin btn-admin-danger",
                            style: { padding: "6px 12px", fontSize: "13px" },
                            title: "Delete this declined record",
                            onClick: (e) => {
                              e.stopPropagation();
                              handleDelete(app);
                            }
                          },
                          React.createElement(Icons.Trash, null),
                          " Delete"
                        )
                      )
                    )
                  );
                })
              )
            )
          )
      ),

      // Detailed Modal for Application Approval
      selectedApp &&
      React.createElement(
        "div",
        { className: "modal-overlay", onClick: () => setSelectedApp(null) },
        React.createElement(
          "div",
          { className: "modal-card", onClick: (e) => e.stopPropagation() },

          // Modal Header
          React.createElement(
            "div",
            { style: { padding: "20px 28px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" } },
            React.createElement(
              "div",
              null,
              React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
                React.createElement("h2", { style: { fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--admin-text)" } }, "Application ", selectedApp.id),
                React.createElement("span", { className: `badge badge-${selectedApp.status === "pending_review" ? "pending" : selectedApp.status === "approved" ? "approved" : selectedApp.status === "rejected" ? "rejected" : selectedApp.status === "interview_scheduled" ? "interview" : "enrolled"}` },
                  selectedApp.status === "pending_review" ? "Pending Review" : selectedApp.status === "approved" ? "Approved" : selectedApp.status === "rejected" ? "Declined" : selectedApp.status === "interview_scheduled" ? "Interview Set" : "Enrolled"
                )
              ),
              React.createElement("div", { style: { fontSize: "13px", color: "var(--admin-text-muted)", marginTop: "4px" } }, selectedApp.courseName, " (", selectedApp.courseFee, ")")
            ),
            React.createElement("button", { className: "btn-admin btn-admin-secondary", style: { padding: "8px" }, onClick: () => setSelectedApp(null) }, React.createElement(Icons.Close, null))
          ),

          // Modal Body Content (Scrollable)
          React.createElement(
            "div",
            { style: { padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" } },

            // Candidate Profile Strip
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", background: "var(--admin-bg)", padding: "16px", borderRadius: "10px", border: "1px solid var(--admin-border)" } },
              React.createElement("div", null, React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "NAME"), React.createElement("div", { style: { fontWeight: "600" } }, selectedApp.applicant?.name)),
              React.createElement("div", null, React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "PHONE"), React.createElement("div", { style: { fontWeight: "600" } }, React.createElement("a", { href: `https://wa.me/${(selectedApp.applicant?.phone || "").replace(/[^0-9]/g, "")}`, target: "_blank", style: { color: "var(--admin-gold-light)", textDecoration: "none" } }, selectedApp.applicant?.phone, " ↗"))),
              React.createElement("div", null, React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "EMAIL"), React.createElement("div", { style: { fontWeight: "600" } }, selectedApp.applicant?.email || "—")),
              React.createElement("div", null, React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "CITY / LOCATION"), React.createElement("div", { style: { fontWeight: "600" } }, selectedApp.applicant?.city || "Bengaluru"))
            ),

            // Questionnaire Responses
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "14px" } },
              React.createElement("h4", { style: { fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-gold)" } }, "Candidate Questionnaire"),

              React.createElement(
                "div",
                { style: { background: "var(--admin-bg)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)" } },
                React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-muted)", marginBottom: "4px" } }, "Why do you want to take this course?"),
                React.createElement("p", { style: { fontSize: "14px", lineHeight: "1.6" } }, selectedApp.responses?.why || "—")
              ),

              React.createElement(
                "div",
                { style: { background: "var(--admin-bg)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)" } },
                React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-muted)", marginBottom: "4px" } }, "Prior handling & grooming experience:"),
                React.createElement("p", { style: { fontSize: "14px", lineHeight: "1.6" } }, selectedApp.responses?.experience || "None specified")
              ),

              React.createElement(
                "div",
                { style: { background: "var(--admin-bg)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)" } },
                React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-muted)", marginBottom: "4px" } }, "How would you handle a dog/cat that is resisting or struggling?"),
                React.createElement("p", { style: { fontSize: "14px", lineHeight: "1.6" } }, selectedApp.responses?.handling || "—")
              ),

              selectedApp.responses?.healthDisclosure &&
              React.createElement(
                "div",
                { style: { background: "var(--admin-bg)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)" } },
                React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-text-muted)", marginBottom: "4px" } }, "Health & Physical Readiness Disclosure:"),
                React.createElement("p", { style: { fontSize: "14px", lineHeight: "1.6" } }, selectedApp.responses.healthDisclosure)
              )
            ),

            // Staff Notes and Audit Trail
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "12px" } },
              React.createElement("h4", { style: { fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--admin-gold)" } }, "Staff Notes & Admissions Log"),

              React.createElement(
                "div",
                { style: { maxHeight: "140px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" } },
                (selectedApp.staffNotes || []).map((note, idx) =>
                  React.createElement(
                    "div",
                    { key: idx, style: { fontSize: "13px", padding: "8px 12px", background: "var(--admin-bg)", borderRadius: "6px", border: "1px solid var(--admin-border-subtle)" } },
                    React.createElement("span", { style: { color: "var(--admin-gold-light)", fontWeight: "600" } }, note.author, " "),
                    React.createElement("span", { style: { color: "var(--admin-text-faint)", fontSize: "11px" } }, "· ", new Date(note.date).toLocaleString(), ": "),
                    React.createElement("span", null, note.text)
                  )
                )
              ),

              React.createElement(
                "div",
                { style: { display: "flex", gap: "8px" } },
                React.createElement("input", {
                  type: "text",
                  className: "input-field",
                  placeholder: "Add private internal staff note...",
                  value: newNote,
                  onChange: (e) => setNewNote(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") handleAddNote(selectedApp.id);
                  }
                }),
                React.createElement("button", { className: "btn-admin btn-admin-secondary", onClick: () => handleAddNote(selectedApp.id) }, "Add Note")
              )
            )
          ),

          // Modal Footer Actions (Approve / Schedule / Reject / Delete)
          React.createElement(
            "div",
            { style: { padding: "18px 28px", borderTop: "1px solid var(--admin-border)", background: "var(--admin-sidebar)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" } },

            React.createElement(
              "div",
              { style: { display: "flex", gap: "8px", alignItems: "center" } },
              React.createElement("span", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Interview Date:"),
              React.createElement("input", {
                type: "datetime-local",
                className: "input-field",
                style: { width: "210px", padding: "6px 10px", fontSize: "12px" },
                value: interviewInput,
                onChange: (e) => setInterviewInput(e.target.value)
              }),
              React.createElement(
                "button",
                {
                  className: "btn-admin btn-admin-secondary",
                  style: { padding: "6px 12px", fontSize: "13px" },
                  onClick: () => handleStatusChange(selectedApp.id, "interview_scheduled", `Interview set for ${interviewInput}`, interviewInput)
                },
                "Schedule Interview"
              )
            ),

            React.createElement(
              "div",
              { style: { display: "flex", gap: "10px", alignItems: "center" } },
              selectedApp.status === "rejected" &&
              React.createElement(
                "button",
                {
                  className: "btn-admin btn-admin-danger",
                  style: { padding: "10px 18px", display: "flex", alignItems: "center", gap: "6px" },
                  onClick: () => handleDelete(selectedApp)
                },
                React.createElement(Icons.Trash, null),
                " Delete Application"
              ),
              selectedApp.status !== "rejected" &&
              React.createElement(
                "button",
                {
                  className: "btn-admin btn-admin-danger",
                  onClick: () => handleStatusChange(selectedApp.id, "rejected", "Application declined by admissions committee.")
                },
                "Decline"
              ),
              React.createElement(
                "button",
                {
                  className: "btn-admin btn-admin-success",
                  style: { padding: "10px 20px" },
                  onClick: () => handleStatusChange(selectedApp.id, "approved", "Application formally approved. Deposit request initiated.")
                },
                "✓ Approve Application"
              ),
              selectedApp.status === "approved" &&
              React.createElement(
                "button",
                {
                  className: "btn-admin btn-admin-primary",
                  onClick: () => handleStatusChange(selectedApp.id, "enrolled", "Deposit received. Student successfully enrolled.")
                },
                "Confirm Enrolled"
              )
            )
          )
        )
      )
    );
  }

  // -------------------------------------------------------------
  // COURSE DOCUMENT UPLOAD & LINK WIDGET
  // -------------------------------------------------------------
  function CourseDocUploadWidget({ label, currentUrl, onSelectUrl, acceptTypes = ".html,.htm,.pdf" }) {
    const [existingFiles, setExistingFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState("");
    const fileInputRef = React.useRef(null);

    const refreshFiles = () => {
      fetch("/api/list-forms")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.files)) {
            setExistingFiles(data.files);
          }
        })
        .catch(() => { });
    };

    useEffect(() => {
      refreshFiles();
    }, []);

    const handleFileUpload = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      setUploading(true);
      setUploadSuccess("");
      const isHtml = file.name.endsWith(".html") || file.name.endsWith(".htm");
      const reader = new FileReader();

      if (isHtml) {
        reader.onload = (evt) => {
          const textContent = evt.target.result;
          fetch("/api/upload-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              content: textContent,
              isBase64: false
            })
          })
            .then((res) => res.json())
            .then((data) => {
              setUploading(false);
              if (data.success) {
                onSelectUrl(data.path);
                setUploadSuccess(`Uploaded & linked '${data.filename}'`);
                refreshFiles();
              } else {
                onSelectUrl(`course_forms/${file.name}`);
              }
              setTimeout(() => setUploadSuccess(""), 4000);
            })
            .catch(() => {
              setUploading(false);
              onSelectUrl(`course_forms/${file.name}`);
            });
        };
        reader.readAsText(file);
      } else {
        reader.onload = (evt) => {
          const base64Data = (evt.target.result || "").split(",")[1];
          fetch("/api/upload-form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              content: base64Data,
              isBase64: true
            })
          })
            .then((res) => res.json())
            .then((data) => {
              setUploading(false);
              if (data.success) {
                onSelectUrl(data.path);
                setUploadSuccess(`Uploaded & linked '${data.filename}'`);
                refreshFiles();
              } else {
                onSelectUrl(`course_forms/${file.name}`);
              }
              setTimeout(() => setUploadSuccess(""), 4000);
            })
            .catch(() => {
              setUploading(false);
              onSelectUrl(`course_forms/${file.name}`);
            });
        };
        reader.readAsDataURL(file);
      }
    };

    const cleanFilename = currentUrl ? currentUrl.replace(/^\/?course_forms\//, "") : "";
    const previewHref = currentUrl
      ? (currentUrl.startsWith("http://") || currentUrl.startsWith("https://") || currentUrl.startsWith("/")
        ? currentUrl
        : `/${currentUrl}`)
      : "";

    return React.createElement(
      "div",
      { style: { background: "var(--admin-bg)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "10px" } },

      // Top Label & Preview Link
      React.createElement(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" } },
        React.createElement("label", { style: { fontSize: "12px", fontWeight: "600", color: "var(--admin-gold-light)" } }, label),
        currentUrl &&
        React.createElement(
          "a",
          {
            href: previewHref,
            target: "_blank",
            rel: "noopener noreferrer",
            style: { fontSize: "11px", color: "var(--admin-gold)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }
          },
          "Preview File ↗"
        )
      ),

      // Status Pill & Action Buttons
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } },
        React.createElement(
          "div",
          {
            style: {
              flex: "1",
              minWidth: "140px",
              background: "var(--admin-card)",
              padding: "7px 10px",
              borderRadius: "6px",
              border: "1px solid var(--admin-border)",
              fontSize: "12px",
              color: currentUrl ? "var(--admin-text)" : "var(--admin-text-faint)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }
          },
          currentUrl ? `📄 ${cleanFilename}` : "No document linked"
        ),
        React.createElement(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            accept: acceptTypes,
            style: { display: "none" },
            onChange: handleFileUpload
          }
        ),
        React.createElement(
          "button",
          {
            type: "button",
            className: "btn-admin btn-admin-primary",
            style: { padding: "6px 12px", fontSize: "11px" },
            disabled: uploading,
            onClick: () => fileInputRef.current && fileInputRef.current.click()
          },
          uploading ? "Uploading..." : "📁 Upload File"
        ),
        currentUrl &&
        React.createElement(
          "button",
          {
            type: "button",
            className: "btn-admin btn-admin-secondary",
            style: { padding: "6px 8px", fontSize: "11px", color: "var(--admin-danger)" },
            onClick: () => onSelectUrl("")
          },
          "Unlink"
        )
      ),

      uploadSuccess &&
      React.createElement("span", { style: { color: "var(--admin-success)", fontSize: "11px", fontWeight: "600" } }, uploadSuccess),

      // Quick Select from course_forms/ directory
      existingFiles.length > 0 &&
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "8px" } },
        React.createElement("span", { style: { fontSize: "11px", color: "var(--admin-text-muted)", whiteSpace: "nowrap" } }, "Or select existing:"),
        React.createElement(
          "select",
          {
            className: "input-field",
            style: { padding: "5px 8px", fontSize: "11px", flex: "1" },
            value: cleanFilename,
            onChange: (e) => {
              if (e.target.value) {
                onSelectUrl(`course_forms/${e.target.value}`);
              }
            }
          },
          React.createElement("option", { value: "" }, "-- Choose from course_forms/ --"),
          existingFiles.map((fname) =>
            React.createElement("option", { key: fname, value: fname }, fname)
          )
        )
      )
    );
  }

  // -------------------------------------------------------------
  // IMAGE UPLOAD & WEBP OPTIMIZATION WIDGET
  // -------------------------------------------------------------
  function ImageUploadWidget({ label, currentUrl, onSelectUrl }) {
    const [uploading, setUploading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const fileInputRef = React.useRef(null);

    const handleImageUpload = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      setUploading(true);
      setStatusMsg("Optimizing & converting to WebP...");

      let webpDataUrl = "";
      let originalBytes = file.size || 0;
      let webpBytes = 0;
      let isAlreadyWebp = file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");

      try {
        // Convert / optimize via PawpadImageOptimizer or direct Canvas
        if (window.PawpadImageOptimizer && (window.PawpadImageOptimizer.convertToWebP || window.PawpadImageOptimizer.optimizeImage)) {
          const fn = window.PawpadImageOptimizer.convertToWebP || window.PawpadImageOptimizer.optimizeImage;
          const result = await fn.call(window.PawpadImageOptimizer, file, 0.85, 1200);
          webpDataUrl = result.dataUrl;
          webpBytes = result.webpSizeBytes || result.optimizedSize || 0;
          if (result.originalSizeBytes) originalBytes = result.originalSizeBytes;
        } else {
          webpDataUrl = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/webp", 0.85));
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
          webpBytes = Math.round((webpDataUrl.length * 3) / 4);
        }

        // Try posting converted WebP to server endpoint if backend is available
        const cleanBaseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_.-]/g, "-").toLowerCase();
        const webpFileName = `${cleanBaseName}-${Date.now().toString().slice(-4)}.webp`;

        let uploadedServerPath = null;
        try {
          const resp = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: webpFileName,
              content: webpDataUrl
            })
          });
          if (resp.ok) {
            const resData = await resp.json();
            if (resData && resData.success && resData.path) {
              uploadedServerPath = resData.path;
            }
          }
        } catch (netErr) {
          console.warn("Backend upload endpoint unreachable, falling back to local WebP data URL:", netErr);
        }

        const savedPct = originalBytes && webpBytes ? Math.round(((originalBytes - webpBytes) / originalBytes) * 100) : 0;

        if (uploadedServerPath) {
          onSelectUrl(uploadedServerPath);
          if (isAlreadyWebp) {
            setStatusMsg(`✓ Verified .webp format${savedPct > 0 ? ` (Optimized -${savedPct}%)` : ""}`);
          } else {
            setStatusMsg(`✓ Saved to server as .webp${savedPct > 0 ? ` (Saved ${savedPct}%)` : ""}`);
          }
        } else if (webpDataUrl) {
          onSelectUrl(webpDataUrl);
          setStatusMsg(isAlreadyWebp ? `✓ Verified .webp format` : `✓ Converted to .webp (Optimized)`);
        }
      } catch (err) {
        console.error("Image upload/convert error:", err);
        if (webpDataUrl) {
          onSelectUrl(webpDataUrl);
          setStatusMsg("✓ Converted to .webp (Local preview)");
        } else {
          setStatusMsg("Failed to convert image. Please check format.");
        }
      } finally {
        setUploading(false);
        setTimeout(() => setStatusMsg(""), 6000);
      }
    };

    return React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "6px" } },
      label && React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, label),
      React.createElement(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },

        // Live Thumbnail
        currentUrl &&
        React.createElement("img", {
          src: currentUrl,
          alt: "Preview",
          style: { width: "38px", height: "38px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--admin-border)" }
        }),

        // Hidden input & Button
        React.createElement("input", {
          type: "file",
          ref: fileInputRef,
          accept: "image/*",
          style: { display: "none" },
          onChange: handleImageUpload
        }),
        React.createElement(
          "button",
          {
            type: "button",
            className: "btn-admin btn-admin-primary",
            style: { padding: "7px 12px", fontSize: "12px" },
            disabled: uploading,
            onClick: () => fileInputRef.current && fileInputRef.current.click()
          },
          uploading ? "Converting..." : "📷 Upload & Convert to WebP"
        ),

        // Text input for direct path / slot reference
        React.createElement("input", {
          className: "input-field",
          style: { flex: "1", minWidth: "160px", padding: "7px 10px", fontSize: "12px" },
          placeholder: "assets/img/pawpad/...webp",
          value: currentUrl || "",
          onChange: (e) => onSelectUrl(e.target.value)
        })
      ),
      statusMsg &&
      React.createElement("span", { style: { color: "var(--admin-success)", fontSize: "11px", fontWeight: "600" } }, statusMsg)
    );
  }

  const GroomingImageUploadWidget = ImageUploadWidget;

  // -------------------------------------------------------------
  // REUSABLE CONFIRMATION MODAL (YES / NO)
  // -------------------------------------------------------------
  function ConfirmModal({ isOpen, title, message, confirmText, cancelText, confirmStyle, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return React.createElement(
      "div",
      { className: "modal-overlay", onClick: onCancel },
      React.createElement(
        "div",
        { className: "modal-card", style: { maxWidth: "500px", padding: "28px" }, onClick: (e) => e.stopPropagation() },
        React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--admin-gold)", marginBottom: "12px" } }, title || "Confirm Action"),
        React.createElement("p", { style: { fontSize: "14px", color: "var(--admin-text)", lineHeight: "1.6", marginBottom: "24px" } }, message),
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", gap: "12px" } },
          React.createElement("button", { type: "button", className: "btn-admin btn-admin-secondary", onClick: onCancel }, cancelText || "No, Cancel"),
          React.createElement("button", { type: "button", className: `btn-admin ${confirmStyle || "btn-admin-primary"}`, onClick: onConfirm }, confirmText || "Yes, Proceed")
        )
      )
    );
  }

  // -------------------------------------------------------------
  // WEBSITE CONTENT CMS EDITOR TAB
  // -------------------------------------------------------------
  function ContentEditorTab() {
    const [selectedPage, setSelectedPage] = useState("home");
    const [formData, setFormData] = useState({});
    const [toastMessage, setToastMessage] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    const pages = [
      { id: "home", label: "Home Page" },
      { id: "about", label: "About Page" },
      { id: "grooming", label: "Grooming Service" },
      { id: "courses", label: "Courses & Academy" },
      { id: "boarding", label: "Boarding Service" },
      { id: "myotherapy", label: "Myotherapy & Wellness" },
      { id: "contact", label: "Contact & Timings" }
    ];

    useEffect(() => {
      if (window.PawpadContentStore) {
        setFormData(JSON.parse(JSON.stringify(window.PawpadContentStore.get(selectedPage))));
      }
    }, [selectedPage]);

    const handleSave = () => {
      const pageLabel = pages.find((p) => p.id === selectedPage)?.label || selectedPage;
      setConfirmModal({
        isOpen: true,
        title: "Save Live Changes",
        message: `Are you sure you want to save and publish your modifications to "${pageLabel}"? This will update the live website immediately.`,
        confirmText: "Yes, Save Changes",
        cancelText: "No, Keep Editing",
        confirmStyle: "btn-admin-primary",
        onConfirm: () => {
          setConfirmModal({ isOpen: false });
          if (window.PawpadContentStore) {
            window.PawpadContentStore.update(selectedPage, formData);
            setToastMessage(`✓ Saved updates to ${selectedPage} page successfully!`);
            setTimeout(() => setToastMessage(""), 3500);
          }
        }
      });
    };

    const handleResetPage = () => {
      const pageLabel = pages.find((p) => p.id === selectedPage)?.label || selectedPage;
      setConfirmModal({
        isOpen: true,
        title: "Reset to Default",
        message: `Are you sure you want to reset all modifications on the "${pageLabel}" page to factory defaults? All custom text, images, and pricing for this page will revert to standard defaults.`,
        confirmText: "Yes, Reset to Default",
        cancelText: "No, Cancel",
        confirmStyle: "btn-admin-danger",
        onConfirm: () => {
          setConfirmModal({ isOpen: false });
          if (window.PawpadContentStore) {
            window.PawpadContentStore.resetPage(selectedPage);
            setFormData(JSON.parse(JSON.stringify(window.PawpadContentStore.get(selectedPage))));
            setToastMessage(`Reset ${selectedPage} page to factory defaults.`);
            setTimeout(() => setToastMessage(""), 3500);
          }
        }
      });
    };

    const updateField = (field, val) => {
      setFormData((prev) => ({ ...prev, [field]: val }));
    };

    return React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "24px" } },

      // Confirmation Modal (Yes/No)
      React.createElement(ConfirmModal, {
        ...confirmModal,
        onCancel: () => setConfirmModal({ isOpen: false })
      }),

      // Page Selector Bar
      React.createElement(
        "div",
        { className: "card", style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" } },

        React.createElement(
          "div",
          { style: { display: "flex", gap: "6px", flexWrap: "wrap" } },
          pages.map((p) =>
            React.createElement(
              "button",
              {
                key: p.id,
                className: `btn-admin ${selectedPage === p.id ? "btn-admin-primary" : "btn-admin-secondary"}`,
                style: { padding: "8px 14px", fontSize: "13px" },
                onClick: () => setSelectedPage(p.id)
              },
              p.label
            )
          )
        ),

        React.createElement(
          "div",
          { style: { display: "flex", gap: "10px", alignItems: "center" } },
          toastMessage && React.createElement("span", { style: { color: "var(--admin-success)", fontSize: "13px", fontWeight: "600" } }, toastMessage),
          React.createElement("button", { type: "button", className: "btn-admin btn-admin-secondary", onClick: handleResetPage }, "Reset to Default"),
          React.createElement("button", { type: "button", className: "btn-admin btn-admin-primary", onClick: handleSave }, "Save Live Changes")
        )
      ),

      // Page Form Fields
      React.createElement(
        "div",
        { className: "card", style: { display: "flex", flexDirection: "column", gap: "20px" } },
        React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--admin-gold)" } }, `Editing: ${pages.find((p) => p.id === selectedPage)?.label}`),

        // Dynamically Render Page Form Controls
        selectedPage === "home" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // 1. Hero Section
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Hero Header & Cover"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Hero Eyebrow Pill"), React.createElement("input", { className: "input-field", value: formData.heroEyebrow || "", onChange: (e) => updateField("heroEyebrow", e.target.value) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title Line 1"), React.createElement("input", { className: "input-field", value: formData.heroTitle1 || "", onChange: (e) => updateField("heroTitle1", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title Line 2"), React.createElement("input", { className: "input-field", value: formData.heroTitle2 || "", onChange: (e) => updateField("heroTitle2", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title Accent (Italics)"), React.createElement("input", { className: "input-field", value: formData.heroTitleAccent || "", onChange: (e) => updateField("heroTitleAccent", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title End"), React.createElement("input", { className: "input-field", value: formData.heroTitleEnd || "", onChange: (e) => updateField("heroTitleEnd", e.target.value) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Hero Lead Paragraph"), React.createElement("textarea", { className: "input-field", value: formData.heroLead || "", onChange: (e) => updateField("heroLead", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Hero Secondary Subtext"), React.createElement("textarea", { className: "input-field", value: formData.heroSub || "", onChange: (e) => updateField("heroSub", e.target.value) })),
            React.createElement(ImageUploadWidget, {
              label: "Hero Cover Image (WebP Auto-Converted)",
              currentUrl: formData.heroImage || "",
              onSelectUrl: (newUrl) => updateField("heroImage", newUrl)
            }),

            // Hero Stats
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" } },
              React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "13.5px" } }, "Hero Highlight Statistics"),
              React.createElement(
                "div",
                { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
                (formData.stats || [{ strong: "8+", label: "years of conscious care" }, { strong: "4,200+", label: "tails wagged" }, { strong: "0", label: "sedation, ever" }]).map((st, sidx) =>
                  React.createElement(
                    "div",
                    { key: sidx, style: { background: "var(--admin-card)", padding: "12px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "6px" } },
                    React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, `Stat #${sidx + 1} Value`),
                    React.createElement("input", {
                      className: "input-field",
                      value: st.strong || "",
                      onChange: (e) => {
                        const list = [...(formData.stats || [{ strong: "8+", label: "years of conscious care" }, { strong: "4,200+", label: "tails wagged" }, { strong: "0", label: "sedation, ever" }])];
                        list[sidx] = { ...list[sidx], strong: e.target.value };
                        updateField("stats", list);
                      }
                    }),
                    React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, `Stat #${sidx + 1} Label`),
                    React.createElement("input", {
                      className: "input-field",
                      value: st.label || "",
                      onChange: (e) => {
                        const list = [...(formData.stats || [{ strong: "8+", label: "years of conscious care" }, { strong: "4,200+", label: "tails wagged" }, { strong: "0", label: "sedation, ever" }])];
                        list[sidx] = { ...list[sidx], label: e.target.value };
                        updateField("stats", list);
                      }
                    })
                  )
                )
              )
            )
          ),

          // 2. Services Snapshot Cards
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Services Snapshot Cards (Homepage Grid)"),
            (formData.services || []).map((svc, idx) =>
              React.createElement(
                "div",
                {
                  key: svc.key || idx,
                  style: { background: "var(--admin-card)", padding: "16px", borderRadius: "10px", border: "1px solid var(--admin-border)", display: "flex", flexDirection: "column", gap: "12px" }
                },
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--admin-border-subtle)", paddingBottom: "8px" } },
                  React.createElement("span", { style: { fontWeight: "700", fontSize: "14px", color: "var(--admin-text)" } }, `${svc.no || "0" + (idx + 1)} — ${svc.title || "Service"}`),
                  React.createElement("span", { className: "badge badge-approved", style: { fontSize: "11px" } }, `Key: ${svc.key || ""}`)
                ),
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" } },
                  React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title"), React.createElement("input", { className: "input-field", value: svc.title || "", onChange: (e) => { const list = [...formData.services]; list[idx].title = e.target.value; updateField("services", list); } })),
                  React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Price Text"), React.createElement("input", { className: "input-field", value: svc.price || "", onChange: (e) => { const list = [...formData.services]; list[idx].price = e.target.value; updateField("services", list); } })),
                  React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "CTA Button Text"), React.createElement("input", { className: "input-field", value: svc.cta || "", onChange: (e) => { const list = [...formData.services]; list[idx].cta = e.target.value; updateField("services", list); } })),
                  React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Target Page"), React.createElement("input", { className: "input-field", value: svc.target || "", onChange: (e) => { const list = [...formData.services]; list[idx].target = e.target.value; updateField("services", list); } }))
                ),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Blurb / Short Description"), React.createElement("textarea", { className: "input-field", style: { minHeight: "60px" }, value: svc.blurb || "", onChange: (e) => { const list = [...formData.services]; list[idx].blurb = e.target.value; updateField("services", list); } })),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Bullet Points (One per line)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "70px" }, value: Array.isArray(svc.points) ? svc.points.join("\n") : (svc.points || ""), onChange: (e) => { const list = [...formData.services]; list[idx].points = e.target.value.split("\n").filter((p) => p.trim().length > 0); updateField("services", list); } })),
                React.createElement(ImageUploadWidget, {
                  label: "Card Image (WebP Auto-Converted)",
                  currentUrl: svc.img || "",
                  onSelectUrl: (newUrl) => { const list = [...formData.services]; list[idx].img = newUrl; updateField("services", list); }
                })
              )
            )
          ),

          // 3. Story Tease Section
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Our Story Tease Section"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.eyebrow) || "Our story", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), eyebrow: e.target.value }) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "10px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Part 1"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.titleLine1) || '"I always wanted ', onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), titleLine1: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Part 2"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.titleLine2) || "to work with animals", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), titleLine2: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Part 3"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.titleLine3) || "I just took the long ", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), titleLine3: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Accent Word"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.titleAccent) || "way", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), titleAccent: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline End"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.titleEnd) || ' to get here"', onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), titleEnd: e.target.value }) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Lead Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: (formData.storyTease && formData.storyTease.lead) || "", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), lead: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Secondary Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: (formData.storyTease && formData.storyTease.paragraph) || "", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), paragraph: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Button Text"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.ctaText) || "Read the full story", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), ctaText: e.target.value }) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement(ImageUploadWidget, {
                label: "Story Stack Image 1 (WebP Auto-Converted)",
                currentUrl: (formData.storyTease && formData.storyTease.img1) || "assets/img/3.webp",
                onSelectUrl: (newUrl) => updateField("storyTease", { ...(formData.storyTease || {}), img1: newUrl })
              }),
              React.createElement(ImageUploadWidget, {
                label: "Story Stack Image 2 (WebP Auto-Converted)",
                currentUrl: (formData.storyTease && formData.storyTease.img2) || "assets/img/8.webp",
                onSelectUrl: (newUrl) => updateField("storyTease", { ...(formData.storyTease || {}), img2: newUrl })
              })
            ),
            React.createElement(
              "div",
              { style: { background: "var(--admin-card)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "10px" } },
              React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "13.5px" } }, "Floating Memory Card (Dew / Puchki)"),
              React.createElement(
                "div",
                { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" } },
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Card Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.cardEyebrow) || "In memory of", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), cardEyebrow: e.target.value }) })),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Pet Name"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.cardTitle) || "Dew", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), cardTitle: e.target.value }) })),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Subtitle"), React.createElement("input", { className: "input-field", value: (formData.storyTease && formData.storyTease.cardSubtitle) || "— Puchki —", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), cardSubtitle: e.target.value }) }))
              ),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Memory Description"), React.createElement("textarea", { className: "input-field", style: { minHeight: "55px" }, value: (formData.storyTease && formData.storyTease.cardText) || "", onChange: (e) => updateField("storyTease", { ...(formData.storyTease || {}), cardText: e.target.value }) }))
            )
          ),

          // 4. Values Strip Section
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Core Values Section"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.values && formData.values.eyebrow) || "The Pawpad way", onChange: (e) => updateField("values", { ...(formData.values || {}), eyebrow: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: (formData.values && formData.values.title) || "Four quiet commitments that ", onChange: (e) => updateField("values", { ...(formData.values || {}), title: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title Accent (Italics)"), React.createElement("input", { className: "input-field", value: (formData.values && formData.values.titleAccent) || "change everything", onChange: (e) => updateField("values", { ...(formData.values || {}), titleAccent: e.target.value }) }))
            ),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              ((formData.values && formData.values.items) || [
                { title: "Never rushed", body: "We space appointments so every pet gets the time they need." },
                { title: "Listen first", body: "We read body language before we read calendars." },
                { title: "No sedation", body: "Ever. Some pets need three visits before we touch a clipper." },
                { title: "Skilled with fearful & rescue dogs", body: "Years of rescue work mean we know how to meet fearful animals." }
              ]).map((valItem, vidx) =>
                React.createElement(
                  "div",
                  { key: vidx, style: { background: "var(--admin-card)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "8px" } },
                  React.createElement("label", { style: { fontSize: "12px", fontWeight: "600", color: "var(--admin-gold-light)" } }, `Value #${vidx + 1}`),
                  React.createElement("input", {
                    className: "input-field",
                    placeholder: "Title",
                    value: valItem.title || "",
                    onChange: (e) => {
                      const items = [...((formData.values && formData.values.items) || [])];
                      items[vidx] = { ...(items[vidx] || {}), title: e.target.value };
                      updateField("values", { ...(formData.values || {}), items });
                    }
                  }),
                  React.createElement("textarea", {
                    className: "input-field",
                    style: { minHeight: "65px", fontSize: "13px" },
                    placeholder: "Description",
                    value: valItem.body || "",
                    onChange: (e) => {
                      const items = [...((formData.values && formData.values.items) || [])];
                      items[vidx] = { ...(items[vidx] || {}), body: e.target.value };
                      updateField("values", { ...(formData.values || {}), items });
                    }
                  })
                )
              )
            )
          ),

          // 5. Marquee Ticker
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "10px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Marquee Scrolling Ticker"),
            React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Ticker phrases (One per line)"),
            React.createElement("textarea", {
              className: "input-field",
              style: { minHeight: "75px" },
              value: Array.isArray(formData.marqueeItems) ? formData.marqueeItems.join("\n") : (formData.marqueeItems || ""),
              onChange: (e) => updateField("marqueeItems", e.target.value.split("\n").filter((l) => l.trim().length > 0))
            })
          )
        ),

        selectedPage === "courses" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // Header Settings
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Page Header & Hero"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: formData.eyebrow || "", onChange: (e) => updateField("eyebrow", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: formData.title || "", onChange: (e) => updateField("title", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Lead Text"), React.createElement("textarea", { className: "input-field", value: formData.lead || "", onChange: (e) => updateField("lead", e.target.value) })),
            React.createElement(ImageUploadWidget, {
              label: "Hero Snapshot Image (WebP Auto-Converted)",
              currentUrl: formData.heroImage || "",
              onSelectUrl: (newUrl) => updateField("heroImage", newUrl)
            })
          ),

          // Global Admissions & Application Form Settings
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Admissions & Application Form Policies"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } },
              React.createElement(
                "div",
                { style: { gridColumn: "1 / -1" } },
                React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Cohort Deposit Requirement Notice"),
                React.createElement("textarea", {
                  className: "input-field",
                  style: { minHeight: "65px" },
                  value: formData.depositNotice || "",
                  onChange: (e) => updateField("depositNotice", e.target.value)
                })
              ),
              React.createElement(
                "div",
                { style: { gridColumn: "1 / -1" } },
                React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Admissions Review Note"),
                React.createElement("textarea", {
                  className: "input-field",
                  style: { minHeight: "65px" },
                  value: formData.admissionsNote || "",
                  onChange: (e) => updateField("admissionsNote", e.target.value)
                })
              ),
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" } },
                React.createElement("input", {
                  type: "checkbox",
                  id: "allowSubmissionsCheck",
                  checked: formData.allowSubmissions !== false,
                  onChange: (e) => updateField("allowSubmissions", e.target.checked)
                }),
                React.createElement("label", { htmlFor: "allowSubmissionsCheck", style: { fontSize: "13px", color: "var(--admin-text)", cursor: "pointer" } }, "Accept New Candidate Applications Online")
              )
            )
          ),

          // Course Offerings & Programs List
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },
            React.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" } },
              React.createElement(
                "div",
                null,
                React.createElement("h4", { style: { color: "var(--admin-gold-light)", fontSize: "17px", fontFamily: "var(--font-display)" } }, "Academy Programs & Courses (", (formData.courseList || []).length, ")"),
                React.createElement("p", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Configure curriculum tracks, course fees, deposit requirements, syllabus links, and application forms.")
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn-admin btn-admin-primary",
                  style: { padding: "8px 16px", fontSize: "13px" },
                  onClick: () => {
                    const list = formData.courseList && Array.isArray(formData.courseList) ? [...formData.courseList] : [];
                    list.unshift({
                      key: "course-" + Date.now(),
                      cat: "Certification",
                      title: "New Academy Course",
                      price: "₹35,000",
                      priceNum: 35000,
                      deposit: "₹8,750",
                      duration: "2 weeks",
                      img: "assets/img/pawpad/courses-cover-new.webp",
                      knowMoreUrl: "",
                      enrollUrl: "course_forms/pawpad-application-pacgc.html",
                      desc: "Hands-on professional grooming training with live handling practice.",
                      includes: ["Practical handling sessions", "Skin & coat care", "Tool safety"],
                      note: "Admission criteria and guidelines for this course."
                    });
                    updateField("courseList", list);
                  }
                },
                "+ Add New Course / Academy Program"
              )
            ),

            // Individual Course Cards
            (formData.courseList || []).map((course, idx) =>
              React.createElement(
                "div",
                {
                  key: course.key || idx,
                  style: {
                    background: "var(--admin-bg)",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid var(--admin-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }
                },

                // Top Title / Category Bar
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--admin-border-subtle)", paddingBottom: "12px" } },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "10px" } },
                    React.createElement("span", { style: { fontWeight: "700", fontSize: "15px", color: "var(--admin-text)" } }, `#${idx + 1} ${course.title || "Untitled Course"}`),
                    React.createElement("span", { className: "badge badge-approved", style: { fontSize: "11px" } }, course.cat || "Academy")
                  ),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "btn-admin btn-admin-danger",
                      style: { padding: "4px 10px", fontSize: "12px" },
                      onClick: () => {
                        if (confirm(`Remove '${course.title}' course offering?`)) {
                          const list = [...formData.courseList];
                          list.splice(idx, 1);
                          updateField("courseList", list);
                        }
                      }
                    },
                    "Delete Course"
                  )
                ),

                // Fields Grid
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr", gap: "12px" } },

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Course Name"),
                    React.createElement("input", {
                      className: "input-field",
                      value: course.title || "",
                      onChange: (e) => {
                        const list = [...formData.courseList];
                        list[idx].title = e.target.value;
                        updateField("courseList", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Course Code / Key"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. pacgc",
                      value: course.key || "",
                      onChange: (e) => {
                        const list = [...formData.courseList];
                        list[idx].key = e.target.value;
                        updateField("courseList", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Program Track"),
                    React.createElement(
                      "select",
                      {
                        className: "input-field",
                        value: course.cat || "Certification",
                        onChange: (e) => {
                          const list = [...formData.courseList];
                          list[idx].cat = e.target.value;
                          updateField("courseList", list);
                        }
                      },
                      ["Comprehensive Certification", "Essentials", "Practitioner", "Foundations", "Mentorship", "Masterclass"].map((c) =>
                        React.createElement("option", { key: c, value: c }, c)
                      )
                    )
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Total Fee Display"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. ₹95,000",
                      value: course.price || "",
                      onChange: (e) => {
                        const val = e.target.value;
                        const num = parseFloat(String(val).replace(/,/g, "").replace(/[^0-9.]/g, "")) || 0;
                        const list = [...formData.courseList];
                        list[idx].price = val;
                        list[idx].priceNum = num;
                        updateField("courseList", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Required Deposit"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. ₹23,750",
                      value: course.deposit || "",
                      onChange: (e) => {
                        const list = [...formData.courseList];
                        list[idx].deposit = e.target.value;
                        updateField("courseList", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Duration / Cohort"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. 7 weeks",
                      value: course.duration || "",
                      onChange: (e) => {
                        const list = [...formData.courseList];
                        list[idx].duration = e.target.value;
                        updateField("courseList", list);
                      }
                    })
                  )
                ),

                // Image & Document Upload Widgets
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", alignItems: "start" } },
                  React.createElement(ImageUploadWidget, {
                    label: "Course Cover Image (WebP Auto-Converted)",
                    currentUrl: course.img || "",
                    onSelectUrl: (newUrl) => {
                      const list = [...formData.courseList];
                      list[idx].img = newUrl;
                      updateField("courseList", list);
                    }
                  }),
                  React.createElement(CourseDocUploadWidget, {
                    label: "Syllabus Details Document (Know More)",
                    currentUrl: course.knowMoreUrl || "",
                    acceptTypes: ".html,.htm,.pdf",
                    onSelectUrl: (newUrl) => {
                      const list = [...formData.courseList];
                      list[idx].knowMoreUrl = newUrl;
                      updateField("courseList", list);
                    }
                  }),
                  React.createElement(CourseDocUploadWidget, {
                    label: "Course Application Form Document (Apply Now)",
                    currentUrl: course.enrollUrl || "",
                    acceptTypes: ".html,.htm",
                    onSelectUrl: (newUrl) => {
                      const list = [...formData.courseList];
                      list[idx].enrollUrl = newUrl;
                      updateField("courseList", list);
                    }
                  })
                ),

                // Description, Included Modules, Guidelines
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Course Overview / Curriculum Summary"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "85px", fontSize: "13px" },
                      value: course.desc || "",
                      onChange: (e) => {
                        const list = [...formData.courseList];
                        list[idx].desc = e.target.value;
                        updateField("courseList", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Included Highlights / Modules (One per line)"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "85px", fontSize: "13px" },
                      value: Array.isArray(course.includes) ? course.includes.join("\n") : (course.includes || ""),
                      onChange: (e) => {
                        const list = [...formData.courseList];
                        list[idx].includes = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                        updateField("courseList", list);
                      }
                    })
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eligibility & Admissions Notes"),
                  React.createElement("input", {
                    className: "input-field",
                    placeholder: "e.g. Flagship practitioner certification for individuals looking to launch their own salon...",
                    value: course.note || "",
                    onChange: (e) => {
                      const list = [...formData.courseList];
                      list[idx].note = e.target.value;
                      updateField("courseList", list);
                    }
                  })
                )
              )
            )
          )
        ),

        selectedPage === "grooming" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // Header Settings
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Page Header & Hero"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: formData.eyebrow || "", onChange: (e) => updateField("eyebrow", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: formData.title || "", onChange: (e) => updateField("title", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Lead Text"), React.createElement("textarea", { className: "input-field", value: formData.lead || "", onChange: (e) => updateField("lead", e.target.value) })),
            React.createElement(GroomingImageUploadWidget, {
              label: "Hero Snapshot Image (WebP Auto-Converted)",
              currentUrl: formData.heroImage || "",
              onSelectUrl: (newUrl) => updateField("heroImage", newUrl)
            })
          ),

          // Packages & Services List
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },
            React.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" } },
              React.createElement(
                "div",
                null,
                React.createElement("h4", { style: { color: "var(--admin-gold-light)", fontSize: "17px", fontFamily: "var(--font-display)" } }, "Grooming Services & Packages (", (formData.packages || []).length, ")"),
                React.createElement("p", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Add, edit, or customize pricing and details. New services go to the top (#1) in admin and are organized on the live site by species and care sections.")
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn-admin btn-admin-primary",
                  style: { padding: "8px 16px", fontSize: "13px" },
                  onClick: () => {
                    const list = formData.packages && Array.isArray(formData.packages) ? [...formData.packages] : [];
                    list.unshift({
                      cat: "Dog",
                      key: "new-service-" + Date.now(),
                      title: "New Grooming Service",
                      sub: "Gentle coat care",
                      price: "₹1,500",
                      priceNum: 1500,
                      duration: "60 mins",
                      isDogOnly: true,
                      petType: "Dog",
                      img: "assets/img/pawpad/grooming-snapshot-new.webp",
                      includes: ["Bath & conditioning", "Blow dry", "Nail clipping"],
                      note: "Description for this new grooming service."
                    });
                    updateField("packages", list);
                  }
                },
                "+ Add New Grooming Package"
              )
            ),

            // Individual Package Cards
            (formData.packages || []).map((pkg, idx) => {
              const catLower = String(pkg.cat || "").toLowerCase();
              const isCat = pkg.isCatOnly === true || pkg.petType === "Cat" || catLower === "cat";
              const isCare = ["nail-clipping", "massage", "hygiene-clip", "bath-brush-dogs", "bath-brush-cats", "bath-brush-subscription"].includes(pkg.key);
              const sectionLabel = isCare ? "🛁 Care & Bath" : isCat ? "🐱 Cat Services" : "🐶 Dog Services";

              return React.createElement(
                "div",
                {
                  key: pkg.key || idx,
                  style: {
                    background: "var(--admin-bg)",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid var(--admin-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }
                },

                // Top Title / Category Bar
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--admin-border-subtle)", paddingBottom: "12px" } },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
                    React.createElement("span", { style: { fontWeight: "700", fontSize: "15px", color: "var(--admin-text)" } }, `#${idx + 1} ${pkg.title || "Untitled Service"}`),
                    React.createElement("span", { className: "badge badge-approved", style: { fontSize: "11px" } }, pkg.cat || "General"),
                    React.createElement("span", { style: { fontSize: "11px", color: "var(--admin-gold)", background: "rgba(201, 168, 106, 0.12)", padding: "2px 8px", borderRadius: "6px" } }, sectionLabel)
                  ),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "btn-admin btn-admin-danger",
                      style: { padding: "4px 10px", fontSize: "12px" },
                      onClick: () => {
                        if (confirm(`Remove '${pkg.title}' grooming package?`)) {
                          const list = [...formData.packages];
                          list.splice(idx, 1);
                          updateField("packages", list);
                        }
                      }
                    },
                    "Delete Package"
                  )
                ),

                // Fields Grid
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "12px" } },

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Service Name"),
                    React.createElement("input", {
                      className: "input-field",
                      value: pkg.title || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].title = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Category"),
                    React.createElement(
                      "select",
                      {
                        className: "input-field",
                        value: pkg.cat || "Dog",
                        onChange: (e) => {
                          const list = [...formData.packages];
                          const newCat = e.target.value;
                          list[idx].cat = newCat;
                          if (newCat === "Cat") {
                            list[idx].petType = "Cat";
                            list[idx].isCatOnly = true;
                            list[idx].isDogOnly = false;
                          } else if (newCat === "Dog" || newCat === "Puppy" || newCat === "Styling") {
                            list[idx].petType = "Dog";
                            list[idx].isDogOnly = true;
                            list[idx].isCatOnly = false;
                          }
                          updateField("packages", list);
                        }
                      },
                      ["Puppy", "Dog", "Cat", "Care", "Wellness", "Styling"].map((c) =>
                        React.createElement("option", { key: c, value: c }, c)
                      )
                    )
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Price Display"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. ₹1,600",
                      value: pkg.price || "",
                      onChange: (e) => {
                        const val = e.target.value;
                        const num = parseFloat(String(val).replace(/,/g, "").replace(/[^0-9.]/g, "")) || 0;
                        const list = [...formData.packages];
                        list[idx].price = val;
                        list[idx].priceNum = num;
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Duration / Badge"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. Coat care",
                      value: pkg.duration || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].duration = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  )
                ),

                // Subtitle & Image Widget
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "end" } },
                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Subtitle / Short Hook"),
                    React.createElement("input", {
                      className: "input-field",
                      value: pkg.sub || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].sub = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  ),
                  React.createElement(GroomingImageUploadWidget, {
                    label: "Service Image (WebP Auto-Converted)",
                    currentUrl: pkg.img || "",
                    onSelectUrl: (newUrl) => {
                      const list = [...formData.packages];
                      list[idx].img = newUrl;
                      updateField("packages", list);
                    }
                  })
                ),

                // Included Features & Notes
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Included Services (One per line)"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "80px", fontSize: "13px" },
                      value: Array.isArray(pkg.includes) ? pkg.includes.join("\n") : (pkg.includes || ""),
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].includes = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Package Description / Notes"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "80px", fontSize: "13px" },
                      value: pkg.note || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].note = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  )
                )
              );
            })
          ),

          // Add-ons Manager
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
              React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Grooming Add-ons (", (formData.addOns || []).length, ")"),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn-admin btn-admin-secondary",
                  style: { padding: "6px 12px", fontSize: "12px" },
                  onClick: () => {
                    const list = formData.addOns && Array.isArray(formData.addOns) ? [...formData.addOns] : [];
                    list.push({ name: "New Add-on Treatment", price: "+ ₹300" });
                    updateField("addOns", list);
                  }
                },
                "+ Add Add-on"
              )
            ),
            (formData.addOns || []).map((addon, aidx) =>
              React.createElement(
                "div",
                { key: aidx, style: { display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "10px", alignItems: "center" } },
                React.createElement("input", {
                  className: "input-field",
                  placeholder: "Treatment Name",
                  value: addon.name || "",
                  onChange: (e) => {
                    const list = [...formData.addOns];
                    list[aidx].name = e.target.value;
                    updateField("addOns", list);
                  }
                }),
                React.createElement("input", {
                  className: "input-field",
                  placeholder: "+ ₹400",
                  value: addon.price || "",
                  onChange: (e) => {
                    const list = [...formData.addOns];
                    list[aidx].price = e.target.value;
                    updateField("addOns", list);
                  }
                }),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "btn-admin btn-admin-danger",
                    style: { padding: "8px 12px", fontSize: "12px" },
                    onClick: () => {
                      const list = [...formData.addOns];
                      list.splice(aidx, 1);
                      updateField("addOns", list);
                    }
                  },
                  "×"
                )
              )
            )
          )
        ),

        selectedPage === "boarding" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // 1. Header & Hero Settings
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Page Header & Hero"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: formData.eyebrow || "", onChange: (e) => updateField("eyebrow", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: formData.title || "", onChange: (e) => updateField("title", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Section Subtitle"), React.createElement("input", { className: "input-field", value: formData.sub || "", onChange: (e) => updateField("sub", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Lead Text"), React.createElement("textarea", { className: "input-field", value: formData.lead || "", onChange: (e) => updateField("lead", e.target.value) })),
            React.createElement(ImageUploadWidget, {
              label: "Hero Snapshot Image (WebP Auto-Converted)",
              currentUrl: formData.heroImage || "",
              onSelectUrl: (newUrl) => updateField("heroImage", newUrl)
            })
          ),

          // 2. Policy Notice & Guidelines
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Boarding Policy, Eligibility & Contact Rules"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Mandatory Policy & Small Dog Disclosure"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: formData.policyNotice || "", onChange: (e) => updateField("policyNotice", e.target.value) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Standard Trial Day Fee"), React.createElement("input", { className: "input-field", value: formData.trialDayFee || "", onChange: (e) => updateField("trialDayFee", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Standard Overnight Fee"), React.createElement("input", { className: "input-field", value: formData.overnightFee || "", onChange: (e) => updateField("overnightFee", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "WhatsApp Booking Number"), React.createElement("input", { className: "input-field", placeholder: "e.g. 919663077496", value: formData.whatsappNumber || "", onChange: (e) => updateField("whatsappNumber", e.target.value) }))
            )
          ),

          // 3. Boarding Services & Packages List (Similar format to Grooming)
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },
            React.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" } },
              React.createElement(
                "div",
                null,
                React.createElement("h4", { style: { color: "var(--admin-gold-light)", fontSize: "17px", fontFamily: "var(--font-display)" } }, "Boarding Services & Packages (", (formData.packages || []).length, ")"),
                React.createElement("p", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Add, edit, or customize stay packages, pricing, images, and routine inclusions. New services go to the top (#1) in admin.")
              ),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn-admin btn-admin-primary",
                  style: { padding: "8px 16px", fontSize: "13px" },
                  onClick: () => {
                    const list = formData.packages && Array.isArray(formData.packages) ? [...formData.packages] : [];
                    list.unshift({
                      key: "boarding-" + Date.now(),
                      tag: "Boarding Tier",
                      title: "New Boarding Package",
                      price: "₹1,000",
                      priceNum: 1000,
                      priceUnit: "per dog, per night",
                      img: "assets/img/pawpad/boarding-sleeping-puppy-toy.webp",
                      desc: "Personalized home-like boarding care with continuous supervision.",
                      includes: ["Supervised quiet rest", "Scheduled home-cooked feeding", "Care report at checkout"],
                      note: "Important guidelines and prerequisites for this boarding stay."
                    });
                    updateField("packages", list);
                  }
                },
                "+ Add New Boarding Package"
              )
            ),

            // Individual Package Cards
            (formData.packages || []).map((pkg, idx) =>
              React.createElement(
                "div",
                {
                  key: pkg.key || idx,
                  style: {
                    background: "var(--admin-bg)",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid var(--admin-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px"
                  }
                },

                // Top Title / Tag Bar
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--admin-border-subtle)", paddingBottom: "12px" } },
                  React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
                    React.createElement("span", { style: { fontWeight: "700", fontSize: "15px", color: "var(--admin-text)" } }, `#${idx + 1} ${pkg.title || "Untitled Package"}`),
                    React.createElement("span", { className: "badge badge-approved", style: { fontSize: "11px" } }, pkg.tag || "Boarding"),
                    React.createElement("span", { style: { fontSize: "11px", color: "var(--admin-gold)", background: "rgba(201, 168, 106, 0.12)", padding: "2px 8px", borderRadius: "6px" } }, `Key: ${pkg.key || "custom"}`)
                  ),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "btn-admin btn-admin-danger",
                      style: { padding: "4px 10px", fontSize: "12px" },
                      onClick: () => {
                        if (confirm(`Remove '${pkg.title}' boarding package?`)) {
                          const list = [...formData.packages];
                          list.splice(idx, 1);
                          updateField("packages", list);
                        }
                      }
                    },
                    "Delete Package"
                  )
                ),

                // Fields Grid
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", gap: "12px" } },

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Package Title"),
                    React.createElement("input", {
                      className: "input-field",
                      value: pkg.title || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].title = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Step / Tag Badge"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. Step 1 · Mandatory Assessment",
                      value: pkg.tag || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].tag = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Price Display"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. ₹850",
                      value: pkg.price || "",
                      onChange: (e) => {
                        const val = e.target.value;
                        const num = parseFloat(String(val).replace(/,/g, "").replace(/[^0-9.]/g, "")) || 0;
                        const list = [...formData.packages];
                        list[idx].price = val;
                        list[idx].priceNum = num;
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Price Unit"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. per dog, per night",
                      value: pkg.priceUnit || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].priceUnit = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Option Key / ID"),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "e.g. trial-day",
                      value: pkg.key || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].key = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  )
                ),

                // Subtitle & Image Widget (Same format as Grooming)
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "end" } },
                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Subtitle / Short Hook Description"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "80px", fontSize: "13px" },
                      value: pkg.desc || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].desc = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  ),
                  React.createElement(ImageUploadWidget, {
                    label: "Package Image (WebP Auto-Converted)",
                    currentUrl: pkg.img || "",
                    onSelectUrl: (newUrl) => {
                      const list = [...formData.packages];
                      list[idx].img = newUrl;
                      updateField("packages", list);
                    }
                  })
                ),

                // Included Features & Notes
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Included Services & Routine (One per line)"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "85px", fontSize: "13px" },
                      value: Array.isArray(pkg.includes) ? pkg.includes.join("\n") : (pkg.includes || ""),
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].includes = e.target.value.split("\n").filter((l) => l.trim().length > 0);
                        updateField("packages", list);
                      }
                    })
                  ),

                  React.createElement(
                    "div",
                    null,
                    React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Package Description / Prerequisites Notes"),
                    React.createElement("textarea", {
                      className: "input-field",
                      style: { minHeight: "85px", fontSize: "13px" },
                      value: pkg.note || "",
                      onChange: (e) => {
                        const list = [...formData.packages];
                        list[idx].note = e.target.value;
                        updateField("packages", list);
                      }
                    })
                  )
                )
              )
            )
          ),

          // 4. Daily Life & Care Standards (Visual & Pillars)
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Daily Routine & Care Standards Section"),

            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Standards Eyebrow"), React.createElement("input", { className: "input-field", value: formData.standardsEyebrow || "", onChange: (e) => updateField("standardsEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Standards Headline Title"), React.createElement("input", { className: "input-field", value: formData.standardsTitle || "", onChange: (e) => updateField("standardsTitle", e.target.value) }))
            ),

            // Visual Image & Quote Card
            React.createElement(
              "div",
              { style: { background: "var(--admin-card)", padding: "16px", borderRadius: "8px", border: "1px solid var(--admin-border)", display: "flex", flexDirection: "column", gap: "12px" } },
              React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "14px" } }, "Standards Visual & Quote Card"),
              React.createElement(ImageUploadWidget, {
                label: "Care Standards Photo (WebP Auto-Converted)",
                currentUrl: formData.standardsImg || "",
                onSelectUrl: (newUrl) => updateField("standardsImg", newUrl)
              }),
              React.createElement(
                "div",
                { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" } },
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Quote Overlay Text"), React.createElement("textarea", { className: "input-field", style: { minHeight: "55px" }, value: formData.standardsQuote || "", onChange: (e) => updateField("standardsQuote", e.target.value) })),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Quote Attribution / Author"), React.createElement("input", { className: "input-field", value: formData.standardsAuthor || "", onChange: (e) => updateField("standardsAuthor", e.target.value) }))
              )
            ),

            // Care Routine Pillars List
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "6px" } },
              React.createElement(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "14px" } }, "Care Routine Pillars (", (formData.pillars || []).length, ")"),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "btn-admin btn-admin-secondary",
                    style: { padding: "6px 12px", fontSize: "12px" },
                    onClick: () => {
                      const list = formData.pillars && Array.isArray(formData.pillars) ? [...formData.pillars] : [];
                      list.push({ icon: "🐾", title: "New Care Pillar", desc: "Detailed description of this care standard routine." });
                      updateField("pillars", list);
                    }
                  },
                  "+ Add Care Pillar"
                )
              ),
              (formData.pillars || []).map((pillar, pidx) =>
                React.createElement(
                  "div",
                  { key: pidx, style: { background: "var(--admin-card)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "10px" } },
                  React.createElement(
                    "div",
                    { style: { display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "10px", alignItems: "center" } },
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "🍲",
                      value: pillar.icon || "",
                      onChange: (e) => {
                        const list = [...formData.pillars];
                        list[pidx].icon = e.target.value;
                        updateField("pillars", list);
                      }
                    }),
                    React.createElement("input", {
                      className: "input-field",
                      placeholder: "Pillar Title",
                      value: pillar.title || "",
                      onChange: (e) => {
                        const list = [...formData.pillars];
                        list[pidx].title = e.target.value;
                        updateField("pillars", list);
                      }
                    }),
                    React.createElement(
                      "button",
                      {
                        type: "button",
                        className: "btn-admin btn-admin-danger",
                        style: { padding: "8px 12px", fontSize: "12px" },
                        onClick: () => {
                          const list = [...formData.pillars];
                          list.splice(pidx, 1);
                          updateField("pillars", list);
                        }
                      },
                      "Delete"
                    )
                  ),
                  React.createElement("textarea", {
                    className: "input-field",
                    style: { minHeight: "55px", fontSize: "13px" },
                    placeholder: "Pillar description text",
                    value: pillar.desc || "",
                    onChange: (e) => {
                      const list = [...formData.pillars];
                      list[pidx].desc = e.target.value;
                      updateField("pillars", list);
                    }
                  })
                )
              )
            )
          ),

          // 5. Boarding FAQs Manager
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "14px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
              React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Boarding FAQs (", (formData.faq || []).length, ")"),
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "btn-admin btn-admin-primary",
                  style: { padding: "6px 14px", fontSize: "12px" },
                  onClick: () => {
                    const list = formData.faq && Array.isArray(formData.faq) ? [...formData.faq] : [];
                    list.unshift({ q: "New Boarding Question?", a: "Detailed explanation and policy answer goes here." });
                    updateField("faq", list);
                  }
                },
                "+ Add FAQ Question"
              )
            ),

            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "FAQ Eyebrow"), React.createElement("input", { className: "input-field", value: formData.faqEyebrow || "", onChange: (e) => updateField("faqEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "FAQ Section Title"), React.createElement("input", { className: "input-field", value: formData.faqTitle || "", onChange: (e) => updateField("faqTitle", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "FAQ Subtitle"), React.createElement("input", { className: "input-field", value: formData.faqSub || "", onChange: (e) => updateField("faqSub", e.target.value) }))
            ),

            (formData.faq || []).map((faqItem, fidx) =>
              React.createElement(
                "div",
                { key: fidx, style: { display: "flex", flexDirection: "column", gap: "8px", background: "var(--admin-card)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)" } },
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  React.createElement("label", { style: { fontSize: "12px", fontWeight: "600", color: "var(--admin-gold-light)" } }, `Question #${fidx + 1}`),
                  React.createElement(
                    "button",
                    {
                      type: "button",
                      className: "btn-admin btn-admin-danger",
                      style: { padding: "3px 8px", fontSize: "11px" },
                      onClick: () => {
                        const list = [...formData.faq];
                        list.splice(fidx, 1);
                        updateField("faq", list);
                      }
                    },
                    "Delete FAQ"
                  )
                ),
                React.createElement("input", {
                  className: "input-field",
                  placeholder: "Question text",
                  value: faqItem.q || "",
                  onChange: (e) => {
                    const list = [...formData.faq];
                    list[fidx].q = e.target.value;
                    updateField("faq", list);
                  }
                }),
                React.createElement("textarea", {
                  className: "input-field",
                  style: { minHeight: "65px", fontSize: "13px" },
                  placeholder: "Answer text",
                  value: faqItem.a || "",
                  onChange: (e) => {
                    const list = [...formData.faq];
                    list[fidx].a = e.target.value;
                    updateField("faq", list);
                  }
                })
              )
            )
          ),

          // 6. Bottom Call to Action (CTA) Banner
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Bottom Call-To-Action (CTA) Banner"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "CTA Eyebrow"), React.createElement("input", { className: "input-field", value: formData.ctaEyebrow || "", onChange: (e) => updateField("ctaEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "CTA Headline Title"), React.createElement("input", { className: "input-field", value: formData.ctaTitle || "", onChange: (e) => updateField("ctaTitle", e.target.value) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "CTA Description Text"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: formData.ctaDesc || "", onChange: (e) => updateField("ctaDesc", e.target.value) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Primary Cart Button Text"), React.createElement("input", { className: "input-field", placeholder: "Book Trial Day (₹850)", value: formData.ctaButtonText || "", onChange: (e) => updateField("ctaButtonText", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "WhatsApp Button Text"), React.createElement("input", { className: "input-field", placeholder: "Chat on WhatsApp", value: formData.ctaWhatsAppText || "", onChange: (e) => updateField("ctaWhatsAppText", e.target.value) }))
            )
          )
        ),

        selectedPage === "about" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // 1. Hero & Studio Meta
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Page Header & Studio Meta"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.hero && formData.hero.eyebrow) || "About Pawpad", onChange: (e) => updateField("hero", { ...(formData.hero || {}), eyebrow: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: (formData.hero && formData.hero.title) || "Our story", onChange: (e) => updateField("hero", { ...(formData.hero || {}), title: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Lead Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "75px" }, value: (formData.hero && formData.hero.lead) || "", onChange: (e) => updateField("hero", { ...(formData.hero || {}), lead: e.target.value }) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Founded Year"), React.createElement("input", { className: "input-field", value: (formData.hero && formData.hero.metaFounded) || "2017", onChange: (e) => updateField("hero", { ...(formData.hero || {}), metaFounded: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Studio Location"), React.createElement("input", { className: "input-field", value: (formData.hero && formData.hero.metaStudio) || "Kalyan Nagar", onChange: (e) => updateField("hero", { ...(formData.hero || {}), metaStudio: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Run By"), React.createElement("input", { className: "input-field", value: (formData.hero && formData.hero.metaRunBy) || "Leena Munikempanna", onChange: (e) => updateField("hero", { ...(formData.hero || {}), metaRunBy: e.target.value }) }))
            )
          ),

          // 2. Founder's Story & Puchki Memory
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Founder's Story & Puchki Memory"),
            React.createElement(ImageUploadWidget, {
              label: "Founder Portrait Photo (WebP Auto-Converted)",
              currentUrl: (formData.founder && formData.founder.portrait) || "assets/img/pawpad/leena-portrait.webp",
              onSelectUrl: (newUrl) => updateField("founder", { ...(formData.founder || {}), portrait: newUrl })
            }),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Founder Name"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.name) || "Leena Munikempanna", onChange: (e) => updateField("founder", { ...(formData.founder || {}), name: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Role Subtitle"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.role) || "Founder · Pawpad · since 2017", onChange: (e) => updateField("founder", { ...(formData.founder || {}), role: e.target.value }) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Founder Quote (Sidebar)"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.quote) || '"Every animal deserves someone who stops. Who looks. Who stays."', onChange: (e) => updateField("founder", { ...(formData.founder || {}), quote: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Main Story Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.eyebrow) || "Our story · told by Leena", onChange: (e) => updateField("founder", { ...(formData.founder || {}), eyebrow: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Story Paragraphs (One per line)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "140px", lineHeight: "1.5" }, value: Array.isArray(formData.founder && formData.founder.paragraphs) ? formData.founder.paragraphs.join("\n\n") : ((formData.founder && formData.founder.paragraphs) || ""), onChange: (e) => updateField("founder", { ...(formData.founder || {}), paragraphs: e.target.value.split("\n\n").map((p) => p.trim()).filter((p) => p.length > 0) }) })),

            // Dew / Puchki Callout
            React.createElement(
              "div",
              { style: { background: "var(--admin-card)", padding: "16px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "12px" } },
              React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "13.5px" } }, "In Memory of Dew (Puchki) Callout"),
              React.createElement(ImageUploadWidget, {
                label: "Dew / Puchki Image (WebP Auto-Converted)",
                currentUrl: (formData.founder && formData.founder.dewImg) || "assets/img/pawpad/about-puchki.webp",
                onSelectUrl: (newUrl) => updateField("founder", { ...(formData.founder || {}), dewImg: newUrl })
              }),
              React.createElement(
                "div",
                { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" } },
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.dewEyebrow) || "In memory of", onChange: (e) => updateField("founder", { ...(formData.founder || {}), dewEyebrow: e.target.value }) })),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Title"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.dewTitle) || "Dew", onChange: (e) => updateField("founder", { ...(formData.founder || {}), dewTitle: e.target.value }) })),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Subtitle Accent"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.dewSubtitle) || "— Puchki —", onChange: (e) => updateField("founder", { ...(formData.founder || {}), dewSubtitle: e.target.value }) }))
              ),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Memory Narrative"), React.createElement("textarea", { className: "input-field", style: { minHeight: "75px" }, value: (formData.founder && formData.founder.dewText) || "", onChange: (e) => updateField("founder", { ...(formData.founder || {}), dewText: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Dedication Line"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.dewDedication) || "— In memory of Dew (Puchki), the best girl.", onChange: (e) => updateField("founder", { ...(formData.founder || {}), dewDedication: e.target.value }) }))
            ),

            // Closing Paragraphs & Signoff
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Closing Paragraph 1 (Streeties connection)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "60px" }, value: (formData.founder && formData.founder.closingParagraph1) || "", onChange: (e) => updateField("founder", { ...(formData.founder || {}), closingParagraph1: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Closing Paragraph 2 (Recognition)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "60px" }, value: (formData.founder && formData.founder.closingParagraph2) || "", onChange: (e) => updateField("founder", { ...(formData.founder || {}), closingParagraph2: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Closing Paragraph 3 (Since 2017 & safety)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "60px" }, value: (formData.founder && formData.founder.closingParagraph3) || "", onChange: (e) => updateField("founder", { ...(formData.founder || {}), closingParagraph3: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Sign-off"), React.createElement("input", { className: "input-field", value: (formData.founder && formData.founder.signoff) || "— Leena, founder, Pawpad", onChange: (e) => updateField("founder", { ...(formData.founder || {}), signoff: e.target.value }) }))
          ),

          // 3. Our Philosophy & Collage Gallery
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Our Philosophy & Collage Gallery"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.philosophy && formData.philosophy.eyebrow) || "Our philosophy", onChange: (e) => updateField("philosophy", { ...(formData.philosophy || {}), eyebrow: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: (formData.philosophy && formData.philosophy.title) || "Our Philosophy", onChange: (e) => updateField("philosophy", { ...(formData.philosophy || {}), title: e.target.value }) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Lead Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: (formData.philosophy && formData.philosophy.lead) || "", onChange: (e) => updateField("philosophy", { ...(formData.philosophy || {}), lead: e.target.value }) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Body Paragraphs (Separated by blank line)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "120px" }, value: Array.isArray(formData.philosophy && formData.philosophy.paragraphs) ? formData.philosophy.paragraphs.join("\n\n") : ((formData.philosophy && formData.philosophy.paragraphs) || ""), onChange: (e) => updateField("philosophy", { ...(formData.philosophy || {}), paragraphs: e.target.value.split("\n\n").map((p) => p.trim()).filter((p) => p.length > 0) }) })),

            // 5 Philosophy Collage Images
            React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "13.5px", marginTop: "8px" } }, "Philosophy Collage Images (5 Grid Tiles)"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              [0, 1, 2, 3, 4].map((gidx) => {
                const gallery = (formData.philosophy && formData.philosophy.gallery) || [
                  "assets/img/pawpad/about-our-philosophy-collage.webp",
                  "assets/img/pawpad/about-our-philosophy-collage-2.webp",
                  "assets/img/pawpad/about-our-philosophy-collage-3.webp",
                  "assets/img/pawpad/about-our-philosophy-collage-4.webp",
                  "assets/img/pawpad/about-our-philosophy-collage-5.webp"
                ];
                return React.createElement(ImageUploadWidget, {
                  key: gidx,
                  label: `Collage Tile #${gidx + 1} (WebP Auto-Converted)`,
                  currentUrl: gallery[gidx] || "",
                  onSelectUrl: (newUrl) => {
                    const list = [...gallery];
                    list[gidx] = newUrl;
                    updateField("philosophy", { ...(formData.philosophy || {}), gallery: list });
                  }
                });
              })
            )
          ),

          // 4. The Studio Space Gallery
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "The Studio Space Gallery"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.studio && formData.studio.eyebrow) || "The studio", onChange: (e) => updateField("studio", { ...(formData.studio || {}), eyebrow: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title"), React.createElement("input", { className: "input-field", value: (formData.studio && formData.studio.title) || "A cozy space", onChange: (e) => updateField("studio", { ...(formData.studio || {}), title: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Title Accent (Italics)"), React.createElement("input", { className: "input-field", value: (formData.studio && formData.studio.titleAccent) || "Oodles of patience", onChange: (e) => updateField("studio", { ...(formData.studio || {}), titleAccent: e.target.value }) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Lead Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: (formData.studio && formData.studio.lead) || "", onChange: (e) => updateField("studio", { ...(formData.studio || {}), lead: e.target.value }) })),

            // 4 Studio Images with Captions
            React.createElement("h5", { style: { color: "var(--admin-gold-light)", fontSize: "13.5px", marginTop: "6px" } }, "Studio Space Photos & Captions"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" } },
              [0, 1, 2, 3].map((sidx) => {
                const items = (formData.studio && formData.studio.items) || [
                  { img: "assets/img/pawpad/about-studio-ample-spacing.webp", caption: "Ample spacing" },
                  { img: "assets/img/pawpad/about-studio-images-hygienic.webp", caption: "Hygienic setup" },
                  { img: "assets/img/pawpad/experience-space-2.webp", caption: "Quiet studio" },
                  { img: "assets/img/pawpad/experience-space-3.webp", caption: "Calm care area" }
                ];
                const item = items[sidx] || {};
                return React.createElement(
                  "div",
                  { key: sidx, style: { background: "var(--admin-card)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "8px" } },
                  React.createElement(ImageUploadWidget, {
                    label: `Studio Photo #${sidx + 1}`,
                    currentUrl: item.img || "",
                    onSelectUrl: (newUrl) => {
                      const list = [...items];
                      list[sidx] = { ...list[sidx], img: newUrl };
                      updateField("studio", { ...(formData.studio || {}), items: list });
                    }
                  }),
                  React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Pill Caption Overlay"),
                  React.createElement("input", {
                    className: "input-field",
                    placeholder: "e.g. Quiet studio",
                    value: item.caption || "",
                    onChange: (e) => {
                      const list = [...items];
                      list[sidx] = { ...list[sidx], caption: e.target.value };
                      updateField("studio", { ...(formData.studio || {}), items: list });
                    }
                  })
                );
              })
            )
          ),

          // 5. Professional Certifications
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Professional Certifications Accordion"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: (formData.certifications && formData.certifications.eyebrow) || "Certifications", onChange: (e) => updateField("certifications", { ...(formData.certifications || {}), eyebrow: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: (formData.certifications && formData.certifications.title) || "Professional education", onChange: (e) => updateField("certifications", { ...(formData.certifications || {}), title: e.target.value }) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Lead Text"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: (formData.certifications && formData.certifications.lead) || "", onChange: (e) => updateField("certifications", { ...(formData.certifications || {}), lead: e.target.value }) })),

            // Cert list
            ((formData.certifications && formData.certifications.certsList) || []).map((c, cidx) =>
              React.createElement(
                "div",
                { key: cidx, style: { background: "var(--admin-card)", padding: "14px", borderRadius: "8px", border: "1px solid var(--admin-border-subtle)", display: "flex", flexDirection: "column", gap: "8px" } },
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                  React.createElement("label", { style: { fontSize: "12px", fontWeight: "600", color: "var(--admin-gold-light)" } }, `Certification #${cidx + 1}`),
                  React.createElement("button", {
                    type: "button",
                    className: "btn-admin btn-admin-danger",
                    style: { padding: "3px 8px", fontSize: "11px" },
                    onClick: () => {
                      const list = [...((formData.certifications && formData.certifications.certsList) || [])];
                      list.splice(cidx, 1);
                      updateField("certifications", { ...(formData.certifications || {}), certsList: list });
                    }
                  }, "Delete")
                ),
                React.createElement(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } },
                  React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Certification Name"), React.createElement("input", { className: "input-field", value: c.name || "", onChange: (e) => { const list = [...((formData.certifications && formData.certifications.certsList) || [])]; list[cidx].name = e.target.value; updateField("certifications", { ...(formData.certifications || {}), certsList: list }); } })),
                  React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Issuing Body / Organization"), React.createElement("input", { className: "input-field", value: c.org || "", onChange: (e) => { const list = [...((formData.certifications && formData.certifications.certsList) || [])]; list[cidx].org = e.target.value; updateField("certifications", { ...(formData.certifications || {}), certsList: list }); } }))
                ),
                React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Description Body"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: c.body || "", onChange: (e) => { const list = [...((formData.certifications && formData.certifications.certsList) || [])]; list[cidx].body = e.target.value; updateField("certifications", { ...(formData.certifications || {}), certsList: list }); } }))
              )
            ),
            React.createElement("button", {
              type: "button",
              className: "btn-admin btn-admin-secondary",
              style: { alignSelf: "flex-start", marginTop: "4px" },
              onClick: () => {
                const list = [...((formData.certifications && formData.certifications.certsList) || [])];
                list.push({ name: "New Certification", org: "Organization Name", body: "Description of the curriculum and qualification..." });
                updateField("certifications", { ...(formData.certifications || {}), certsList: list });
              }
            }, "+ Add Certification")
          )
        ),

        selectedPage === "myotherapy" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // 1. Header & Hero
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Page Header & Hero"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Eyebrow"), React.createElement("input", { className: "input-field", value: formData.eyebrow || "PAWPAD · MYOTHERAPY", onChange: (e) => updateField("eyebrow", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: formData.title || "Myotherapy – Coming Soon", onChange: (e) => updateField("title", e.target.value) })),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Editorial Lead Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "85px" }, value: formData.lead || "", onChange: (e) => updateField("lead", e.target.value) })),
            React.createElement(ImageUploadWidget, {
              label: "Myotherapy Banner Cover Image (WebP Auto-Converted)",
              currentUrl: formData.heroImage || "",
              onSelectUrl: (newUrl) => updateField("heroImage", newUrl)
            })
          ),

          // 2. Editorial Content & Methodology
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Editorial Body & Methodology"),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Body Paragraph 1 (Gentle hands-on bodywork)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "95px" }, value: formData.body1 || "", onChange: (e) => updateField("body1", e.target.value) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr", gap: "10px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Link Prefix"), React.createElement("input", { className: "input-field", value: formData.body2Prefix !== undefined ? formData.body2Prefix : "Curious about the methodology? ", onChange: (e) => updateField("body2Prefix", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Link Text"), React.createElement("input", { className: "input-field", value: formData.linkText || "Visit Galen Myotherapy", onChange: (e) => updateField("linkText", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Link URL"), React.createElement("input", { className: "input-field", value: formData.linkUrl || "https://www.galenmyotherapy.com", onChange: (e) => updateField("linkUrl", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "Link Suffix"), React.createElement("input", { className: "input-field", value: formData.body2Suffix !== undefined ? formData.body2Suffix : ". Join the waitlist to be the first to know when sessions open.", onChange: (e) => updateField("body2Suffix", e.target.value) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Editorial Note / Footer Text"), React.createElement("input", { className: "input-field", value: formData.note || "Pawpad · Details current as of this document's creation date.", onChange: (e) => updateField("note", e.target.value) }))
          )
        ),

        selectedPage === "contact" &&
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "24px" } },

          // 1. Top Banner
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Top Banner Header"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Banner Eyebrow"), React.createElement("input", { className: "input-field", value: formData.bannerEyebrow || "Contact Pawpad", onChange: (e) => updateField("bannerEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Headline Title"), React.createElement("input", { className: "input-field", value: formData.bannerTitle || "Come say hello.", onChange: (e) => updateField("bannerTitle", e.target.value) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Banner Lead Paragraph"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: formData.bannerLead || "", onChange: (e) => updateField("bannerLead", e.target.value) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Studio Badge Top Label"), React.createElement("input", { className: "input-field", value: formData.studioBadgeLabel || "STUDIO", onChange: (e) => updateField("studioBadgeLabel", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Studio Badge Name"), React.createElement("input", { className: "input-field", value: formData.studioBadgeName || "Kalyan Nagar", onChange: (e) => updateField("studioBadgeName", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Studio Badge City"), React.createElement("input", { className: "input-field", value: formData.studioBadgeCity || "BENGALURU", onChange: (e) => updateField("studioBadgeCity", e.target.value) }))
            )
          ),

          // 2. Get in Touch Details
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Get In Touch & Numbered Details"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Section Eyebrow"), React.createElement("input", { className: "input-field", value: formData.mainEyebrow || "Get in touch", onChange: (e) => updateField("mainEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Section Title"), React.createElement("input", { className: "input-field", value: formData.mainTitle || "We are here for you.", onChange: (e) => updateField("mainTitle", e.target.value) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Subtext Description"), React.createElement("textarea", { className: "input-field", style: { minHeight: "60px" }, value: formData.mainSubtext || "", onChange: (e) => updateField("mainSubtext", e.target.value) })),

            // 01 Email & 02 Phone
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "01 Email Address"), React.createElement("input", { className: "input-field", value: formData.email || "info@pawpad.in", onChange: (e) => updateField("email", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "02 Phone (Dial Digits)"), React.createElement("input", { className: "input-field", value: formData.phone || "9663077496", onChange: (e) => updateField("phone", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "02 Phone Display Format"), React.createElement("input", { className: "input-field", value: formData.phoneDisplay || "9663077496", onChange: (e) => updateField("phoneDisplay", e.target.value) }))
            ),

            // 03 Address
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "03 Address Lines (One per line)"), React.createElement("textarea", { className: "input-field", style: { minHeight: "75px" }, value: Array.isArray(formData.addressLines) ? formData.addressLines.join("\n") : (formData.addressLines || ""), onChange: (e) => updateField("addressLines", e.target.value.split("\n").filter((l) => l.trim().length > 0)) })),

            // 04 Opening Hours
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Weekdays Hours"), React.createElement("input", { className: "input-field", value: formData.hoursWeekdays || "Weekdays: 11 AM - 8 PM", onChange: (e) => updateField("hoursWeekdays", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Weekends Hours"), React.createElement("input", { className: "input-field", value: formData.hoursWeekends || "Weekends: 10 AM - 8 PM", onChange: (e) => updateField("hoursWeekends", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Closed Accent Text"), React.createElement("input", { className: "input-field", value: formData.hoursClosed || "Thursdays: Closed", onChange: (e) => updateField("hoursClosed", e.target.value) }))
            )
          ),

          // 3. Studio Promo Card
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Studio Promo Card (Right Column)"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Card Eyebrow"), React.createElement("input", { className: "input-field", value: formData.cardEyebrow || "Pawpad Grooming Studio", onChange: (e) => updateField("cardEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Card Title Line 1"), React.createElement("input", { className: "input-field", value: formData.cardTitle || "Soft hands", onChange: (e) => updateField("cardTitle", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Card Title Accent (Italics)"), React.createElement("input", { className: "input-field", value: formData.cardTitleAccent || "Calm pets.", onChange: (e) => updateField("cardTitleAccent", e.target.value) }))
            ),
            React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Card Description"), React.createElement("textarea", { className: "input-field", style: { minHeight: "65px" }, value: formData.cardDesc || "", onChange: (e) => updateField("cardDesc", e.target.value) })),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Book Button Text"), React.createElement("input", { className: "input-field", value: formData.cardBtnBook || "Book a session", onChange: (e) => updateField("cardBtnBook", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Call Button Text"), React.createElement("input", { className: "input-field", value: formData.cardBtnCall || "Call us", onChange: (e) => updateField("cardBtnCall", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Call Phone Link"), React.createElement("input", { className: "input-field", value: formData.cardCallPhone || "+919663077496", onChange: (e) => updateField("cardCallPhone", e.target.value) }))
            )
          ),

          // 4. Social Media Links
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px", background: "var(--admin-bg)", padding: "18px", borderRadius: "10px", border: "1px solid var(--admin-border-subtle)" } },
            React.createElement("h4", { style: { color: "var(--admin-gold)", fontSize: "15px" } }, "Social Media & Stay Connected Links"),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Social Eyebrow"), React.createElement("input", { className: "input-field", value: formData.socialEyebrow || "Follow Pawpad", onChange: (e) => updateField("socialEyebrow", e.target.value) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Social Headline Title"), React.createElement("input", { className: "input-field", value: formData.socialTitle || "Stay connected.", onChange: (e) => updateField("socialTitle", e.target.value) }))
            ),
            React.createElement(
              "div",
              { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Instagram URL"), React.createElement("input", { className: "input-field", value: (formData.socials && formData.socials.instagram) || "", onChange: (e) => updateField("socials", { ...(formData.socials || {}), instagram: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Facebook URL"), React.createElement("input", { className: "input-field", value: (formData.socials && formData.socials.facebook) || "", onChange: (e) => updateField("socials", { ...(formData.socials || {}), facebook: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Twitter / X URL"), React.createElement("input", { className: "input-field", value: (formData.socials && formData.socials.twitter) || "", onChange: (e) => updateField("socials", { ...(formData.socials || {}), twitter: e.target.value }) })),
              React.createElement("div", null, React.createElement("label", { style: { fontSize: "12px", color: "var(--admin-text-muted)" } }, "Pinterest URL"), React.createElement("input", { className: "input-field", value: (formData.socials && formData.socials.pinterest) || "", onChange: (e) => updateField("socials", { ...(formData.socials || {}), pinterest: e.target.value }) }))
            )
          )
        )
      )
    );
  }

  // -------------------------------------------------------------
  // MEDIA & WEBP OPTIMIZER TAB
  // -------------------------------------------------------------
  function MediaManagerTab() {
    const [optimizedImage, setOptimizedImage] = useState(null);
    const [quality, setQuality] = useState(0.85);
    const [isConverting, setIsConverting] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("home.heroImage");
    const [assignNotice, setAssignNotice] = useState("");
    const fileInputRef = useRef(null);

    const imageSlots = [
      { id: "home.heroImage", page: "home", field: "heroImage", label: "Home Page — Hero Cover Photo" },
      { id: "grooming.heroImage", page: "grooming", field: "heroImage", label: "Grooming Page — Banner Cover" },
      { id: "courses.heroImage", page: "courses", field: "heroImage", label: "Courses Page — Academy Banner" },
      { id: "about.founder.portrait", page: "about", field: "founder.portrait", label: "About Page — Founder Portrait Photo" },
      { id: "about.founder.dewImg", page: "about", field: "founder.dewImg", label: "About Page — Puchki Memory Photo" },
      { id: "boarding.heroImage", page: "boarding", field: "heroImage", label: "Boarding Page — Cover Photo" },
      { id: "boarding.standardsImg", page: "boarding", field: "standardsImg", label: "Boarding Page — Care Standards Photo" },
      { id: "myotherapy.heroImage", page: "myotherapy", field: "heroImage", label: "Myotherapy Page — Cover Photo" }
    ];

    const processFile = async (file) => {
      if (!file) return;
      setIsConverting(true);
      try {
        if (window.PawpadImageOptimizer) {
          const res = await window.PawpadImageOptimizer.convertToWebP(file, quality);
          setOptimizedImage({ ...res, originalFile: file, fileName: file.name.replace(/\.[^/.]+$/, "") + ".webp" });
        }
      } catch (err) {
        console.error("WebP Optimization error:", err);
        alert("Failed to convert image to WebP format. Please check file.");
      } finally {
        setIsConverting(false);
      }
    };

    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      processFile(file);
    };

    const handleAssignSlot = () => {
      if (!optimizedImage) return;
      const slot = imageSlots.find((s) => s.id === selectedSlot);
      if (slot && window.PawpadContentStore) {
        window.PawpadContentStore.updateField(slot.page, slot.field, optimizedImage.dataUrl);
        setAssignNotice(`✓ Successfully applied WebP image to '${slot.label}'!`);
        setTimeout(() => setAssignNotice(""), 4000);
      }
    };

    const handleDownloadWebp = () => {
      if (!optimizedImage) return;
      const a = document.createElement("a");
      a.href = optimizedImage.dataUrl;
      a.download = optimizedImage.fileName || "optimized-pawpad.webp";
      a.click();
    };

    const formatBytes = (bytes) => {
      if (bytes < 1024) return bytes + " B";
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
      else return (bytes / 1048576).toFixed(2) + " MB";
    };

    return React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "24px" } },

      React.createElement(
        "div",
        { className: "card admin-banner" },
        React.createElement("h2", { style: { fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "6px" } }, "Automatic WebP Image Performance Engine"),
        React.createElement("p", { style: { fontSize: "14px" } }, "Upload any image (PNG, JPG, HEIC, GIF). The system automatically compresses it to high-efficiency .webp format to keep your website lightning fast.")
      ),

      // Upload Zone
      React.createElement(
        "div",
        {
          className: "card",
          style: {
            border: "2px dashed var(--admin-border)",
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: "var(--admin-card-hover)"
          },
          onClick: () => fileInputRef.current && fileInputRef.current.click(),
          onDragOver: (e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "var(--admin-gold)";
          },
          onDragLeave: (e) => {
            e.currentTarget.style.borderColor = "var(--admin-border)";
          },
          onDrop: (e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "var(--admin-border)";
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processFile(e.dataTransfer.files[0]);
            }
          }
        },
        React.createElement("input", {
          type: "file",
          ref: fileInputRef,
          style: { display: "none" },
          accept: "image/*",
          onChange: handleFileSelect
        }),
        React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: "12px" } }, React.createElement(Icons.Media, null)),
        React.createElement("div", { style: { fontSize: "16px", fontWeight: "600", color: "var(--admin-text)", marginBottom: "6px" } }, isConverting ? "Compressing & Converting to WebP..." : "Click or drag & drop an image to optimize"),
        React.createElement("div", { style: { fontSize: "13px", color: "var(--admin-text-faint)" } }, "Supports PNG, JPEG, SVG, WebP · Automatically creates high-compression .webp")
      ),

      // Conversion Result Card
      optimizedImage &&
      React.createElement(
        "div",
        { className: "card", style: { display: "flex", flexDirection: "column", gap: "20px" } },
        React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--admin-gold)" } }, "WebP Optimization Result"),

        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "minmax(240px, 320px) 1fr", gap: "24px", alignItems: "center" } },

          // Image Preview Frame
          React.createElement(
            "div",
            { style: { background: "var(--admin-bg)", padding: "8px", borderRadius: "12px", border: "1px solid var(--admin-border)", textAlign: "center" } },
            React.createElement("img", {
              src: optimizedImage.dataUrl,
              alt: "Optimized WebP Preview",
              style: { width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }
            }),
            React.createElement("div", { style: { fontSize: "12px", color: "var(--admin-gold-light)", marginTop: "6px", fontFamily: "monospace" } }, `${optimizedImage.width} × ${optimizedImage.height} px · .webp`)
          ),

          // Metrics & Slot Assigning
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "16px" } },

            // Stats
            React.createElement(
              "div",
              { style: { display: "flex", gap: "16px", flexWrap: "wrap" } },
              React.createElement(
                "div",
                { style: { background: "var(--admin-bg)", padding: "12px 18px", borderRadius: "8px", border: "1px solid var(--admin-border)" } },
                React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "ORIGINAL SIZE"),
                React.createElement("div", { style: { fontSize: "18px", fontWeight: "700" } }, formatBytes(optimizedImage.originalSizeBytes))
              ),
              React.createElement(
                "div",
                { style: { background: "var(--admin-bg)", padding: "12px 18px", borderRadius: "8px", border: "1px solid var(--admin-border)" } },
                React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-muted)" } }, "WEBP OPTIMIZED"),
                React.createElement("div", { style: { fontSize: "18px", fontWeight: "700", color: "var(--admin-success)" } }, formatBytes(optimizedImage.webpSizeBytes))
              ),
              React.createElement(
                "div",
                { style: { background: "var(--admin-success-bg)", padding: "12px 18px", borderRadius: "8px", border: "1px solid #86efac" } },
                React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-success)" } }, "SAVINGS"),
                React.createElement("div", { style: { fontSize: "18px", fontWeight: "700", color: "var(--admin-success)" } }, `-${optimizedImage.savedPercent}%`)
              )
            ),

            // Slot Destination Select
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "6px" } },
              React.createElement("label", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } }, "Assign Directly to Website Page Slot:"),
              React.createElement(
                "select",
                {
                  className: "input-field",
                  value: selectedSlot,
                  onChange: (e) => setSelectedSlot(e.target.value)
                },
                imageSlots.map((s) => React.createElement("option", { key: s.id, value: s.id }, s.label))
              )
            ),

            // Action Buttons
            React.createElement(
              "div",
              { style: { display: "flex", gap: "10px", alignItems: "center" } },
              React.createElement(
                "button",
                { className: "btn-admin btn-admin-primary", onClick: handleAssignSlot },
                "Apply WebP Image to Slot"
              ),
              React.createElement(
                "button",
                { className: "btn-admin btn-admin-secondary", onClick: handleDownloadWebp },
                "Download .webp File"
              ),
              assignNotice && React.createElement("span", { style: { color: "var(--admin-success)", fontSize: "13px", fontWeight: "600" } }, assignNotice)
            )
          )
        )
      )
    );
  }

  // -------------------------------------------------------------
  // SYSTEM SETTINGS & BACKUPS TAB
  // -------------------------------------------------------------
  function SettingsTab() {
    const [whitelist, setWhitelist] = useState(() => getWhitelistedEmails());
    const [newEmail, setNewEmail] = useState("");
    const [whitelistNotice, setWhitelistNotice] = useState("");
    const [backupNotice, setBackupNotice] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });
    const importInputRef = useRef(null);

    const handleAddEmail = (e) => {
      e.preventDefault();
      const clean = newEmail.trim().toLowerCase();
      if (!clean || !clean.includes("@")) return;
      if (whitelist.includes(clean)) {
        setWhitelistNotice("⚠️ Email is already in whitelist.");
        return;
      }
      const updated = [...whitelist, clean];
      localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(updated));
      setWhitelist(updated);
      setNewEmail("");
      setWhitelistNotice("✓ Administrator email added to whitelist!");
      setTimeout(() => setWhitelistNotice(""), 3500);
    };

    const handleRemoveEmail = (emailToRemove) => {
      if (whitelist.length <= 1) {
        alert("At least one administrator email must remain in the whitelist.");
        return;
      }
      setConfirmModal({
        isOpen: true,
        title: "Remove Administrator",
        message: `Are you sure you want to remove ${emailToRemove} from administrator access?`,
        confirmText: "Yes, Remove",
        cancelText: "No, Cancel",
        confirmStyle: "btn-admin-danger",
        onConfirm: () => {
          setConfirmModal({ isOpen: false });
          const updated = whitelist.filter((e) => e !== emailToRemove);
          localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(updated));
          setWhitelist(updated);
        }
      });
    };

    const handleExportBackup = () => {
      if (window.PawpadContentStore) {
        const json = window.PawpadContentStore.exportJSON();
        const blob = new Blob([json], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `pawpad-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      }
    };

    const handleImportBackup = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (window.PawpadContentStore && window.PawpadContentStore.importJSON(evt.target.result)) {
          setBackupNotice("✓ Backup restored successfully!");
          setTimeout(() => setBackupNotice(""), 4000);
        } else {
          alert("Invalid backup file. Please provide a valid JSON export.");
        }
      };
      reader.readAsText(file);
    };

    const handleFactoryReset = () => {
      setConfirmModal({
        isOpen: true,
        title: "⚠️ Factory Reset Entire Website",
        message: "Are you sure you want to reset ALL pages, images, packages, services, and pricing across the entire website back to original factory defaults? This action cannot be undone.",
        confirmText: "Yes, Reset Everything",
        cancelText: "No, Cancel",
        confirmStyle: "btn-admin-danger",
        onConfirm: () => {
          setConfirmModal({ isOpen: false });
          if (window.PawpadContentStore) {
            window.PawpadContentStore.resetAll();
            alert("Website content successfully reset to factory defaults.");
            window.location.reload();
          }
        }
      });
    };

    return React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" } },

      // Confirmation Modal (Yes/No)
      React.createElement(ConfirmModal, {
        ...confirmModal,
        onCancel: () => setConfirmModal({ isOpen: false })
      }),

      // Google OAuth Email Whitelist
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" } },
          React.createElement(Icons.Shield, null),
          React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--admin-gold)" } }, "Authorized Administrator Whitelist")
        ),
        React.createElement("p", { style: { color: "var(--admin-text-muted)", fontSize: "13px", marginBottom: "16px" } },
          "Only users who sign in with these verified Google account email addresses can access the admin control center."
        ),

        // Email list
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" } },
          whitelist.map((email) =>
            React.createElement(
              "div",
              {
                key: email,
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--admin-bg)",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--admin-border)"
                }
              },
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "10px" } },
                React.createElement(Icons.Google, null),
                React.createElement("span", { style: { fontSize: "14px", fontWeight: "600", color: "var(--admin-text)" } }, email),
                email === "tharunsn04@gmail.com" && React.createElement("span", { className: "badge badge-approved", style: { fontSize: "11px" } }, "Primary Owner")
              ),
              whitelist.length > 1 && React.createElement(
                "button",
                {
                  onClick: () => handleRemoveEmail(email),
                  className: "btn-admin btn-admin-danger",
                  style: { padding: "4px 10px", fontSize: "12px" }
                },
                "Remove"
              )
            )
          )
        ),

        // Add email form
        React.createElement(
          "form",
          { onSubmit: handleAddEmail, style: { display: "flex", gap: "10px", alignItems: "center" } },
          React.createElement("input", {
            type: "email",
            className: "input-field",
            placeholder: "Add staff email (e.g. staff@gmail.com)",
            value: newEmail,
            onChange: (e) => setNewEmail(e.target.value),
            style: { flex: 1 }
          }),
          React.createElement("button", { type: "submit", className: "btn-admin btn-admin-primary" }, "Add to Whitelist")
        ),
        whitelistNotice && React.createElement("div", { style: { color: "var(--admin-success)", fontSize: "13px", fontWeight: "600", marginTop: "8px" } }, whitelistNotice)
      ),

      // Backup & Restore
      React.createElement(
        "div",
        { className: "card" },
        React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--admin-gold)", marginBottom: "10px" } }, "Backup & JSON Migration"),
        React.createElement("p", { style: { color: "var(--admin-text-muted)", fontSize: "13px", marginBottom: "16px" } }, "Download a full copy of your customized website copy and image slots to migrate or restore at any time."),

        React.createElement(
          "div",
          { style: { display: "flex", gap: "10px", alignItems: "center" } },
          React.createElement("button", { className: "btn-admin btn-admin-secondary", onClick: handleExportBackup }, "Download JSON Backup"),
          React.createElement("button", { className: "btn-admin btn-admin-secondary", onClick: () => importInputRef.current && importInputRef.current.click() }, "Restore from JSON"),
          React.createElement("input", {
            type: "file",
            ref: importInputRef,
            style: { display: "none" },
            accept: ".json",
            onChange: handleImportBackup
          }),
          backupNotice && React.createElement("span", { style: { color: "var(--admin-success)", fontSize: "13px", fontWeight: "600" } }, backupNotice)
        )
      ),

      // Factory Reset
      React.createElement(
        "div",
        { className: "card card-danger" },
        React.createElement("h3", { style: { fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "10px" } }, "Factory Reset Site Content"),
        React.createElement("p", { style: { fontSize: "13px", marginBottom: "16px" } }, "Clears all overrides from localStorage and reverts the website back to its default clean code templates."),
        React.createElement("button", { className: "btn-admin btn-admin-danger", onClick: handleFactoryReset }, "Revert All Pages to Factory Defaults")
      )
    );
  }

  // -------------------------------------------------------------
  // MAIN ADMIN APP ROOT COMPONENT
  // -------------------------------------------------------------
  function AdminApp() {
    const [theme, setTheme] = useState(() => localStorage.getItem("pawpad_admin_theme") || "light");
    const [isAuthenticated, setIsAuthenticated] = useState(
      localStorage.getItem(AUTH_STORAGE_KEY) === "authenticated"
    );
    const [currentUser, setCurrentUser] = useState(() => {
      try {
        const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { email: "tharunsn04@gmail.com", name: "Tharun", picture: null };
      } catch (e) {
        return { email: "tharunsn04@gmail.com", name: "Tharun", picture: null };
      }
    });

    const [activeTab, setActiveTab] = useState("dashboard");
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, enrolled: 0 });

    useEffect(() => {
      document.body.setAttribute("data-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("pawpad_admin_theme", theme);
    }, [theme]);

    const toggleTheme = () => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const refreshData = () => {
      if (window.PawpadApplicationsStore) {
        setApplications(window.PawpadApplicationsStore.getAll());
        setStats(window.PawpadApplicationsStore.getStats());
      }
    };

    useEffect(() => {
      refreshData();
      window.addEventListener("pawpad-applications-updated", refreshData);
      return () => window.removeEventListener("pawpad-applications-updated", refreshData);
    }, []);

    const handleLogout = () => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.disableAutoSelect();
        } catch (e) { }
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
    };

    if (!isAuthenticated) {
      return React.createElement(AuthGate, {
        onAuthenticated: (userData) => {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      });
    }

    const navigationItems = [
      { id: "dashboard", label: "Dashboard", icon: Icons.Dashboard },
      { id: "applications", label: "Course Applications", icon: Icons.Applications, badge: stats.pending > 0 ? stats.pending : null },
      { id: "content", label: "Website Content CMS", icon: Icons.Content },
      { id: "media", label: "WebP Media Manager", icon: Icons.Media },
      { id: "settings", label: "Settings & Backups", icon: Icons.Settings }
    ];

    return React.createElement(
      "div",
      { className: "admin-app" },

      // Sidebar
      React.createElement(
        "aside",
        { className: "admin-sidebar" },

        // Brand Title & User Profile
        React.createElement(
          "div",
          { style: { padding: "20px", borderBottom: "1px solid var(--admin-border)", display: "flex", flexDirection: "column", gap: "14px" } },
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "10px" } },
            React.createElement(Icons.Paw, null),
            React.createElement(
              "div",
              null,
              React.createElement("div", { style: { fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "600", color: "var(--admin-text)" } }, "Pawpad Admin"),
              React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-text-faint)" } }, "Management Suite v2.0")
            )
          ),

          // User info capsule
          React.createElement(
            "div",
            {
              className: "admin-user-capsule",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px"
              }
            },
            currentUser?.picture ? (
              React.createElement("img", {
                src: currentUser.picture,
                alt: currentUser.name || "Admin",
                style: { width: "28px", height: "28px", borderRadius: "50%", border: "1px solid var(--admin-gold)" }
              })
            ) : (
              React.createElement(
                "div",
                { style: { width: "28px", height: "28px", borderRadius: "50%", background: "var(--admin-card-hover)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-gold)" } },
                React.createElement(Icons.User, null)
              )
            ),
            React.createElement(
              "div",
              { style: { overflow: "hidden" } },
              React.createElement("div", { style: { fontSize: "13px", fontWeight: "600", color: "var(--admin-text)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" } }, currentUser?.name || "Admin User"),
              React.createElement("div", { style: { fontSize: "11px", color: "var(--admin-gold)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" } }, currentUser?.email || "tharunsn04@gmail.com")
            )
          )
        ),

        // Navigation Links
        React.createElement(
          "nav",
          { style: { padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" } },
          navigationItems.map((item) =>
            React.createElement(
              "button",
              {
                key: item.id,
                onClick: () => setActiveTab(item.id),
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "999px",
                  background: activeTab === item.id ? "var(--admin-champagne)" : "transparent",
                  color: activeTab === item.id ? "var(--admin-text)" : "var(--admin-text-muted)",
                  border: activeTab === item.id ? "1px solid var(--admin-border)" : "1px solid transparent",
                  fontSize: "14px",
                  fontWeight: activeTab === item.id ? "600" : "500",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease"
                }
              },
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "12px" } },
                React.createElement(item.icon, null),
                item.label
              ),
              item.badge &&
              React.createElement(
                "span",
                { className: "badge badge-pending", style: { fontSize: "11px", padding: "2px 8px" } },
                item.badge
              )
            )
          )
        ),

        // Footer Actions
        React.createElement(
          "div",
          { style: { padding: "16px 20px", borderTop: "1px solid var(--admin-border)", display: "flex", flexDirection: "column", gap: "10px" } },
          React.createElement(
            "a",
            { href: "index.html", target: "_blank", className: "btn-admin btn-admin-secondary", style: { fontSize: "13px", width: "100%" } },
            "Open Live Website ",
            React.createElement(Icons.External, null)
          ),
          React.createElement(
            "button",
            { onClick: handleLogout, className: "btn-admin btn-admin-danger", style: { fontSize: "13px", width: "100%" } },
            "Sign Out"
          )
        )
      ),

      // Main Content Area
      React.createElement(
        "main",
        { className: "admin-main" },

        // Header
        React.createElement(
          "header",
          { className: "admin-header" },
          React.createElement(
            "div",
            null,
            React.createElement("h1", { style: { fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--admin-text)" } },
              activeTab === "dashboard" && "Overview & Admissions Dashboard",
              activeTab === "applications" && "Course Applications & Admissions",
              activeTab === "content" && "Omnichannel Content Management",
              activeTab === "media" && "Media Manager & WebP Optimization",
              activeTab === "settings" && "System Settings & Backups"
            ),
            React.createElement("p", { style: { fontSize: "13px", color: "var(--admin-text-muted)" } },
              activeTab === "dashboard" && "Key metrics and real-time site activity",
              activeTab === "applications" && "Review candidate responses and manage course approval lifecycle",
              activeTab === "content" && "Live updates to text, headlines, pricing, and packages",
              activeTab === "media" && "Automated compression to WebP and live asset slot replacement",
              activeTab === "settings" && "Manage Google OAuth credentials, email whitelist, and export data backups"
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "12px" } },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: toggleTheme,
                className: "btn-admin btn-admin-secondary",
                style: {
                  padding: "8px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  borderRadius: "999px",
                  cursor: "pointer"
                },
                title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
              },
              theme === "dark" ? React.createElement(Icons.Sun, null) : React.createElement(Icons.Moon, null),
              theme === "dark" ? "Light Mode" : "Dark Mode"
            )
          )
        ),

        // Subpage Tab View Content
        React.createElement(
          "div",
          { className: "admin-content" },
          activeTab === "dashboard" && React.createElement(DashboardTab, { stats, setActiveTab, applications }),
          activeTab === "applications" && React.createElement(ApplicationsTab, { applications, onUpdate: refreshData }),
          activeTab === "content" && React.createElement(ContentEditorTab, null),
          activeTab === "media" && React.createElement(MediaManagerTab, null),
          activeTab === "settings" && React.createElement(SettingsTab, null)
        )
      )
    );
  }

  // Mount Admin Panel
  const rootEl = document.getElementById("admin-root");
  if (rootEl) {
    ReactDOM.render(React.createElement(AdminApp, null), rootEl);
  }

})();
