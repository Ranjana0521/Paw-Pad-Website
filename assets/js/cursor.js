/**
 * Pawpad Global Cursor & Paw Trail
 * Provides the interactive custom cursor dot and animated paw trail on all pages.
 */
(function () {
  if (typeof window === "undefined") return;
  if (window.__pawpad_cursor_initialized) return;
  window.__pawpad_cursor_initialized = true;

  function initCursor() {
    if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches) return;

    // Inject self-contained cursor styles to guarantee visibility on all pages & forms
    if (!document.getElementById("pawpad-cursor-styles")) {
      var style = document.createElement("style");
      style.id = "pawpad-cursor-styles";
      style.textContent = `
        @media (pointer: fine) {
          body, a, button, input, select, textarea, label, [role="button"],
          .nav-link, .m-link, .btn, .nav-cart-btn, .hamburger, .hover-zone,
          .back-link, .nav-pill, .chip-btn, .cta, summary {
            cursor: none !important;
          }
          .cursor-dot {
            position: fixed;
            top: 0;
            left: 0;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #b18d4e !important;
            pointer-events: none;
            z-index: 999999;
            transform: translate(-50%, -50%);
            mix-blend-mode: multiply;
            transition: transform .12s cubic-bezier(.2,.7,.2,1), width .2s ease, height .2s ease, opacity .2s ease;
          }
          .cursor-dot.hover {
            width: 48px;
            height: 48px;
            background: #b18d4e !important;
            opacity: 0.28;
          }
          .paw-trail {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999998;
          }
        }
        @media (hover: none), (pointer: coarse) {
          .cursor-dot, .paw-trail {
            display: none !important;
          }
          body, a, button, input, select, textarea, label {
            cursor: auto !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    var trail = document.querySelector(".paw-trail");
    if (!trail) {
      trail = document.createElement("div");
      trail.className = "paw-trail";
      document.body.appendChild(trail);
    }

    var dot = document.querySelector(".cursor-dot");
    if (!dot) {
      dot = document.createElement("div");
      dot.className = "cursor-dot";
      document.body.appendChild(dot);
    }

    var lastX = -100,
      lastY = -100,
      lastStamp = 0,
      alt = 0;
    var mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    var dx = mx,
      dy = my;
    var raf;

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
      var t = e.target;
      if (
        t &&
        t.closest &&
        t.closest(
          "a, button, .hover-zone, input, select, textarea, label, [role='button'], .nav-cart-btn, .hamburger, .m-link, .nav-link, .btn, .chip-btn, .back-link, .nav-pill, .cta, summary"
        )
      ) {
        dot.classList.add("hover");
      } else {
        dot.classList.remove("hover");
      }

      var dist = Math.hypot(mx - lastX, my - lastY);
      var now = performance.now();
      if (dist > 65 && now - lastStamp > 55) {
        lastX = mx;
        lastY = my;
        lastStamp = now;
        var paw = document.createElement("div");
        var angle = (Math.atan2(my - dy, mx - dx) * 180) / Math.PI + 90;
        var side = alt ? -10 : 10;
        alt = 1 - alt;
        var offX = Math.cos(((angle - 90) * Math.PI) / 180 + Math.PI / 2) * side;
        var offY = Math.sin(((angle - 90) * Math.PI) / 180 + Math.PI / 2) * side;
        paw.className = "paw-print";
        paw.style.cssText =
          "position:fixed; left:" +
          (mx + offX) +
          "px; top:" +
          (my + offY) +
          "px; width:22px; height:22px; transform:translate(-50%,-50%) rotate(" +
          angle +
          "deg); opacity:.42; transition:opacity 1.4s ease, transform 1.4s ease; pointer-events:none; z-index:999998;";
        paw.innerHTML =
          '<svg viewBox="0 0 64 64" width="22" height="22" style="display:block;"><ellipse cx="32" cy="16" rx="5.5" ry="7.5" fill="#B18D4E"/><ellipse cx="20" cy="24" rx="6" ry="8" fill="#B18D4E"/><ellipse cx="44" cy="24" rx="6" ry="8" fill="#B18D4E"/><ellipse cx="11" cy="38" rx="5" ry="6.5" fill="#B18D4E"/><ellipse cx="53" cy="38" rx="5" ry="6.5" fill="#B18D4E"/><ellipse cx="32" cy="46" rx="13" ry="11" fill="#B18D4E"/></svg>';
        trail.appendChild(paw);
        requestAnimationFrame(function () {
          paw.style.opacity = "0";
          paw.style.transform += " scale(1.2)";
        });
        setTimeout(function () {
          paw.remove();
        }, 1500);
      }
    }

    function tick() {
      dx += (mx - dx) * 0.22;
      dy += (my - dy) * 0.22;
      dot.style.transform = "translate(" + dx + "px, " + dy + "px) translate(-50%,-50%)";
      raf = requestAnimationFrame(tick);
    }

    function onLeave() {
      dot.style.opacity = "0";
    }

    function onEnter() {
      dot.style.opacity = "";
    }

    tick();
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
  }

  // Guard against running in admin panel
  if (typeof window !== "undefined" && window.location.pathname.includes("admin.html")) {
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCursor);
  } else {
    initCursor();
  }
})();

