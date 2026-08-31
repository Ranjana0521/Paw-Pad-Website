/**
 * PawpadApplicationsStore - Course Applications & Admissions Store
 * Handles storage, status lifecycle, notes, filtering, and export for student course applications.
 */

(function(window) {
  const STORAGE_KEY = "pawpad_course_applications_v1";

  const INITIAL_SEED_APPLICATIONS = [
    {
      id: "APP-829104",
      courseKey: "pacgc",
      courseName: "Pawpad Applied Canine & Feline Grooming Certification (PACGC)",
      courseFee: "₹95,000",
      createdAt: "2026-08-28T14:32:00.000Z",
      status: "pending_review", // pending_review | interview_scheduled | approved | rejected | enrolled
      interviewDate: "",
      applicant: {
        name: "Ananya Deshmukh",
        phone: "+91 98451 23456",
        email: "ananya.d@gmail.com",
        city: "Bengaluru (Indiranagar)"
      },
      responses: {
        why: "I have been rescuing street dogs for 4 years and want to open a dedicated fear-free grooming and rehabilitation sanctuary in East Bangalore. I want formal training in low-stress handling and cat scissoring.",
        experience: "Completed basic voluntary bathing at a rescue center; familiar with reactive dog cues.",
        handling: "I would never force or muzzle immediately. I pause, let the dog sniff the equipment, use high-value treats, and break the groom into short sessions.",
        careerFit: "yes",
        healthDisclosure: "None. Fit for lifting and extended standing."
      },
      acknowledgments: {
        bothSpecies: true,
        nailTrimDemo: true,
        catClipGate: true,
        foundationLevel: true,
        examOptional: true,
        feesDeposit: true
      },
      staffNotes: [
        {
          author: "System",
          date: "2026-08-28T14:32:00.000Z",
          text: "Application received via web portal."
        }
      ]
    },
    {
      id: "APP-740192",
      courseKey: "pcgpc",
      courseName: "Pawpad Canine Grooming Practitioner Certificate (PCGPC)",
      courseFee: "₹50,000",
      createdAt: "2026-08-25T10:15:00.000Z",
      status: "interview_scheduled",
      interviewDate: "2026-09-03T11:00",
      applicant: {
        name: "Rohan Varma",
        phone: "+91 97112 88990",
        email: "rohan.v@outlook.com",
        city: "Mysuru"
      },
      responses: {
        why: "Transitioning careers from digital marketing into professional grooming. Looking to master scissoring techniques and clipper work.",
        experience: "Completed Pawpad Canine Essentials introductory workshop last month.",
        handling: "Observe body language for whale eye or lip licking, ease off pressure, use desensitization techniques.",
        careerFit: "yes",
        healthDisclosure: "Slight dust allergy, manages well with mask."
      },
      acknowledgments: {
        bothSpecies: true,
        nailTrimDemo: true,
        catClipGate: true,
        foundationLevel: true,
        examOptional: true,
        feesDeposit: true
      },
      staffNotes: [
        {
          author: "Admin",
          date: "2026-08-26T09:30:00.000Z",
          text: "Strong background and completed Essentials course. Video interview scheduled for Sept 3."
        }
      ]
    }
  ];

  class ApplicationsStore {
    constructor() {
      this.applications = this._load();
    }

    _load() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn("PawpadApplicationsStore: Could not load applications", e);
      }
      return JSON.parse(JSON.stringify(INITIAL_SEED_APPLICATIONS));
    }

    _save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.applications));
        window.dispatchEvent(new CustomEvent("pawpad-applications-updated", { detail: this.applications }));
      } catch (e) {
        console.error("PawpadApplicationsStore: Failed to save applications", e);
      }
    }

    getAll() {
      return [...this.applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getById(id) {
      return this.applications.find((a) => a.id === id) || null;
    }

    submitApplication(formData) {
      const id = "APP-" + Math.floor(100000 + Math.random() * 900000);
      const newApp = {
        id: id,
        courseKey: formData.courseKey || "general",
        courseName: formData.courseName || "Pawpad Grooming Certification",
        courseFee: formData.courseFee || "₹95,000",
        createdAt: new Date().toISOString(),
        status: "pending_review",
        interviewDate: "",
        applicant: {
          name: formData.name || "",
          phone: formData.phone || "",
          email: formData.email || "",
          city: formData.city || ""
        },
        responses: {
          why: formData.why || "",
          experience: formData.experience || "",
          handling: formData.handling || "",
          careerFit: formData.careerFit || "yes",
          healthDisclosure: formData.healthDisclosure || ""
        },
        acknowledgments: formData.acknowledgments || {},
        staffNotes: [
          {
            author: "System",
            date: new Date().toISOString(),
            text: "Application submitted online."
          }
        ]
      };

      this.applications.unshift(newApp);
      this._save();
      return newApp;
    }

    updateStatus(id, newStatus, noteText = "", interviewDate = "") {
      const app = this.getById(id);
      if (!app) return null;

      const oldStatus = app.status;
      app.status = newStatus;

      if (interviewDate !== undefined) {
        app.interviewDate = interviewDate;
      }

      if (!app.staffNotes) app.staffNotes = [];

      const statusLabels = {
        pending_review: "Pending Review",
        interview_scheduled: "Interview Scheduled",
        approved: "Approved & Accepted",
        rejected: "Rejected / Declined",
        enrolled: "Enrolled & Deposit Confirmed"
      };

      const logText = `Status changed from '${statusLabels[oldStatus] || oldStatus}' to '${statusLabels[newStatus] || newStatus}'.` + (noteText ? ` Note: ${noteText}` : "");

      app.staffNotes.push({
        author: "Admin",
        date: new Date().toISOString(),
        text: logText
      });

      this._save();
      return app;
    }

    addNote(id, noteText, author = "Admin") {
      const app = this.getById(id);
      if (!app) return null;
      if (!app.staffNotes) app.staffNotes = [];
      app.staffNotes.push({
        author: author,
        date: new Date().toISOString(),
        text: noteText
      });
      this._save();
      return app;
    }

    deleteApplication(id) {
      this.applications = this.applications.filter((a) => a.id !== id);
      this._save();
      return true;
    }

    deleteMultiple(ids) {
      if (!Array.isArray(ids) || ids.length === 0) return true;
      const idSet = new Set(ids);
      this.applications = this.applications.filter((a) => !idSet.has(a.id));
      this._save();
      return true;
    }

    getStats() {
      const total = this.applications.length;
      const pending = this.applications.filter((a) => a.status === "pending_review").length;
      const interview = this.applications.filter((a) => a.status === "interview_scheduled").length;
      const approved = this.applications.filter((a) => a.status === "approved").length;
      const rejected = this.applications.filter((a) => a.status === "rejected").length;
      const enrolled = this.applications.filter((a) => a.status === "enrolled").length;

      return { total, pending, interview, approved, rejected, enrolled };
    }

    exportCSV() {
      const headers = ["Application ID", "Date", "Status", "Course", "Candidate Name", "Phone", "Email", "City", "Why Apply", "Experience", "Handling Philosophy"];
      const rows = this.getAll().map((app) => [
        `"${app.id}"`,
        `"${new Date(app.createdAt).toLocaleDateString()}"`,
        `"${app.status}"`,
        `"${(app.courseName || "").replace(/"/g, '""')}"`,
        `"${(app.applicant?.name || "").replace(/"/g, '""')}"`,
        `"${(app.applicant?.phone || "").replace(/"/g, '""')}"`,
        `"${(app.applicant?.email || "").replace(/"/g, '""')}"`,
        `"${(app.applicant?.city || "").replace(/"/g, '""')}"`,
        `"${(app.responses?.why || "").replace(/"/g, '""')}"`,
        `"${(app.responses?.experience || "").replace(/"/g, '""')}"`,
        `"${(app.responses?.handling || "").replace(/"/g, '""')}"`
      ]);

      return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }
  }

  window.PawpadApplicationsStore = new ApplicationsStore();

})(window);
