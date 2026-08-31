/**
 * Pawpad Forms Handler
 * Automatically binds to course application forms and standard forms,
 * persisting submissions into PawpadApplicationsStore and coordinating success redirects.
 */

(function() {
  function initCourseForms() {
    const forms = document.querySelectorAll("form");
    if (!forms.length) return;

    forms.forEach((form) => {
      // Avoid attaching twice
      if (form.dataset.pawpadBound) return;
      form.dataset.pawpadBound = "true";

      form.addEventListener("submit", function(e) {
        // Extract course name from document title or h1
        const h1 = document.querySelector("h1");
        const eyebrow = document.querySelector(".eyebrow");
        const courseName = h1 ? h1.innerText.trim() : document.title.replace(" Application", "");
        const courseKey = (eyebrow ? eyebrow.innerText : document.title).toLowerCase().replace(/[^a-z0-9]/g, "-");
        
        // Extract course fee if present in sub heading
        const sub = document.querySelector(".sub");
        let courseFee = "₹95,000";
        if (sub && sub.innerText.includes("₹")) {
          const m = sub.innerText.match(/₹[\d,]+/);
          if (m) courseFee = m[0];
        }

        const formData = new FormData(form);
        const acks = {};
        const responses = {};

        formData.forEach((val, key) => {
          if (key.startsWith("ack_") || key.startsWith("ack")) {
            acks[key] = true;
          } else {
            responses[key] = val;
          }
        });

        const appData = {
          courseKey: courseKey,
          courseName: courseName,
          courseFee: courseFee,
          name: formData.get("name") || "",
          phone: formData.get("phone") || "",
          email: formData.get("email") || "",
          city: formData.get("city") || "",
          why: formData.get("why") || "",
          experience: formData.get("experience") || "",
          handling: formData.get("handling") || "",
          careerFit: formData.get("career_fit") || formData.get("careerFit") || "yes",
          healthDisclosure: formData.get("health_disclosure") || formData.get("health") || "",
          acknowledgments: acks
        };

        if (window.PawpadApplicationsStore) {
          const created = window.PawpadApplicationsStore.submitApplication(appData);
          console.log("Pawpad: Application captured successfully with ID:", created.id);
          
          // If the form points to Formsubmit or external service, we can allow graceful submission or show instant success
          const nextInput = form.querySelector('input[name="_next"]');
          if (nextInput && nextInput.value) {
            // Let the form proceed to success.html or handle redirect
            e.preventDefault();
            const dest = nextInput.value.includes("?") 
              ? `${nextInput.value}&app_id=${created.id}` 
              : `${nextInput.value}?app_id=${created.id}`;
            window.location.href = dest;
          }
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCourseForms);
  } else {
    initCourseForms();
  }
})();
