/**
 * Pawpad Forms Handler
 * Automatically binds to course application forms and standard forms,
 * persisting submissions into PawpadApplicationsStore and coordinating FormSubmit email delivery.
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
        e.preventDefault();

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

        let createdId = "APP-" + Math.floor(100000 + Math.random() * 900000);
        if (window.PawpadApplicationsStore) {
          const created = window.PawpadApplicationsStore.submitApplication(appData);
          createdId = created ? created.id : createdId;
          console.log("Pawpad: Application captured in local store with ID:", createdId);
        }

        // Visual feedback on submit button
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          if (submitBtn.tagName === "BUTTON") {
            submitBtn.textContent = "Submitting Application...";
          } else {
            submitBtn.value = "Submitting Application...";
          }
        }

        const nextInput = form.querySelector('input[name="_next"]');
        const nextTarget = (nextInput && nextInput.value) ? nextInput.value : "success.html";
        const dest = nextTarget.includes("?") 
          ? `${nextTarget}&app_id=${createdId}` 
          : `${nextTarget}?app_id=${createdId}`;

        const actionUrl = form.action || "https://formsubmit.co/courses@pawpad.in";
        const isFormSubmit = actionUrl.includes("formsubmit.co");
        const ajaxUrl = isFormSubmit && !actionUrl.includes("/ajax/")
          ? actionUrl.replace("formsubmit.co/", "formsubmit.co/ajax/")
          : actionUrl;

        // If online and using FormSubmit or an external endpoint, submit via AJAX
        if (ajaxUrl && !ajaxUrl.startsWith("#") && !ajaxUrl.startsWith("javascript:")) {
          fetch(ajaxUrl, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: formData
          })
          .then((res) => {
            console.log("Pawpad: FormSubmit response status:", res.status);
          })
          .catch((err) => {
            console.warn("Pawpad: External submission notice:", err);
          })
          .finally(() => {
            window.location.href = dest;
          });
        } else {
          window.location.href = dest;
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
