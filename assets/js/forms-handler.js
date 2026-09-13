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

        const storeCoursesKey = window.PawpadContentStore && window.PawpadContentStore.get("courses")?.web3FormsAccessKey;
        const web3Key = (storeCoursesKey && storeCoursesKey !== "YOUR_ACCESS_KEY_HERE" && storeCoursesKey !== "ce70cafb-d84c-42f7-b57e-d320ff768866") 
          ? storeCoursesKey 
          : "a9a21b4b-47ee-4889-b709-9f101c59874d";

        const web3FormData = new FormData();
        web3FormData.append("access_key", web3Key);
        web3FormData.append("subject", `New Application: ${courseName} - ${appData.name || "Applicant"} (${createdId})`);
        web3FormData.append("from_name", "Pawpad Academy Applications");
        web3FormData.append("application_id", createdId);
        web3FormData.append("course", courseName);
        web3FormData.append("fee", courseFee);
        web3FormData.append("name", appData.name);
        web3FormData.append("email", appData.email);
        web3FormData.append("phone", appData.phone);
        web3FormData.append("city", appData.city);
        web3FormData.append("why_apply", appData.why);
        web3FormData.append("experience", appData.experience);
        web3FormData.append("handling_comfort", appData.handling);
        web3FormData.append("career_fit", appData.careerFit);
        web3FormData.append("health_disclosure", appData.healthDisclosure);
        web3FormData.append("acknowledgments", Object.keys(acks).join(", ") || "Confirmed");
        web3FormData.append("botcheck", "");

        // Submit to Web3Forms API
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: web3FormData
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Web3Forms response status: " + res.status);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Pawpad: Web3Forms submission result:", data);
        })
        .catch((err) => {
          console.warn("Pawpad: Web3Forms submit notice, attempting email fallback:", err);
          // Fallback to FormSubmit to guarantee email delivery
          const fallbackUrl = "https://formsubmit.co/ajax/courses@pawpad.in";
          return fetch(fallbackUrl, {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: formData
          }).catch((fErr) => {
            console.warn("Pawpad: Fallback submit warning:", fErr);
          });
        })
        .finally(() => {
          window.location.href = dest;
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCourseForms);
  } else {
    initCourseForms();
  }
})();
