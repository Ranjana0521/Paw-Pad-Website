/**
 * PawpadContentStore - Centralized CMS Store for Pawpad Website
 * Manages text, images, pricing, service packages, and application forms across all pages.
 * Supports localStorage persistence, live change broadcasting, import/export, and automatic WebP image conversion.
 */

(function(window) {
  const STORAGE_KEY = "pawpad_cms_content_v1";

  // Default content snapshot across all pages
  const DEFAULT_CONTENT = {
    branding: {
      siteName: "Pawpad",
      tagline: "Conscious Pet Grooming & Wellness in Bengaluru",
      phone: "+91 88853 49267",
      whatsapp: "918885349267",
      email: "hello@pawpad.in",
      coursesEmail: "courses@pawpad.in",
      location: "Kalyan Nagar, Bengaluru, Karnataka 560043",
      instagram: "https://instagram.com/pawpad.in",
      establishedYear: "2017",
      announcement: ""
    },
    home: {
      heroEyebrow: "Conscious pet care · Bengaluru · est. 2017",
      heroTitle1: "Conscious Pet",
      heroTitle2: "Grooming",
      heroTitleAccent: "& Holistic Petcare",
      heroTitleEnd: "in Bangalore",
      heroLead: "Calm, stress-free grooming, pet wellness therapy, boarding, and professional grooming courses — all designed with your pet's emotional wellbeing in mind.",
      heroSub: "Pawpad offers conscious pet grooming and wellness care designed around your pet's physical and emotional wellbeing. Instead of rushed grooming focused only on looks, we prioritise stress-free handling, coat health, skin care, and calm environments that support long-term comfort for dogs and cats alike.",
      heroImage: "assets/img/pawpad/hero-cover-dog-cat.webp",
      stats: [
        { strong: "8+", label: "years of conscious care" },
        { strong: "4,200+", label: "tails wagged" },
        { strong: "0", label: "sedation, ever" }
      ],
      services: [
        {
          key: "grooming",
          no: "01",
          title: "Conscious Pet Grooming",
          blurb: "Stress-free grooming for dogs and cats with a focus on coat health, gentle handling, and emotional comfort — never rushed, always mindful.",
          cta: "Book a Grooming Session",
          target: "grooming",
          price: "Gentle grooming",
          points: ["Dog and cat grooming", "Coat health", "Stress-free handling", "Emotional comfort"],
          img: "assets/img/pawpad/grooming-snapshot-new.webp",
          accent: "champagne"
        },
        {
          key: "myotherapy",
          no: "02",
          title: "Canine Myotherapy & Wellness",
          blurb: "Support your dog's mobility, recovery, and overall wellbeing through gentle bodywork therapy designed to ease tension and improve comfort.",
          cta: "Coming Soon",
          target: "myotherapy",
          price: "Wellness support",
          points: ["Mobility support", "Recovery care", "Gentle bodywork", "Comfort-focused sessions"],
          img: "assets/img/pawpad/myotheraphy-snapshot.webp",
          accent: "eagle"
        },
        {
          key: "courses",
          no: "03",
          title: "Professional Grooming Courses",
          blurb: "Hands-on grooming education for aspiring professionals looking to build real-world skills in conscious dog and cat grooming.",
          cta: "View Course Details",
          target: "courses",
          price: "Hands-on training",
          points: ["Dog grooming", "Cat grooming", "Handling techniques", "Business fundamentals"],
          img: "assets/img/pawpad/courses-snapshot.webp",
          accent: "driftwood"
        },
        {
          key: "boarding",
          no: "04",
          title: "Boarding with Comfort in Mind",
          blurb: "Thoughtful pet boarding designed to help dogs feel secure, relaxed, and cared for while you're away.",
          cta: "Let's onboard your pet",
          target: "boarding",
          price: "Home like care",
          points: ["Comfort-led care", "Secure routines", "Relaxed environment", "Thoughtful attention"],
          img: "assets/img/pawpad/boarding-snapshot.webp",
          accent: "champagne"
        }
      ],
      storyTease: {
        eyebrow: "Our story",
        titleLine1: '"I always wanted ',
        titleLine2: "to work with animals",
        titleLine3: "I just took the long ",
        titleAccent: "way",
        titleEnd: ' to get here"',
        lead: "Pawpad started in 2017 in a small studio in Kalyan Nagar. Eight years on, it's still the same question we show up with every day: does this animal feel safe here?",
        paragraph: "From rescue work with Bengaluru's streeties to international certifications in feline grooming and canine skin care — every choice we make is rooted in patience and respect for what each animal is telling us.",
        ctaText: "Read the full story",
        img1: "assets/img/3.webp",
        img2: "assets/img/8.webp",
        cardEyebrow: "In memory of",
        cardTitle: "Dew",
        cardSubtitle: "— Puchki —",
        cardText: "Leena's Boxer, the heart dog whose unconditional trust shapes everything we do."
      },
      values: {
        eyebrow: "The Pawpad way",
        title: "Four quiet commitments that ",
        titleAccent: "change everything",
        items: [
          { title: "Never rushed", body: "We space appointments so every pet gets the time they need. Volume isn't the metric — comfort is." },
          { title: "Listen first", body: "We read body language before we read calendars. A flick of an ear, a sigh, a shift in weight — it all matters." },
          { title: "No sedation", body: "Ever. Some pets need three visits before we touch a clipper. That's care, not a setback." },
          { title: "Skilled with fearful & rescue dogs", body: "Years of rescue work mean we know how to meet fearful, overwhelmed, or unsocialised animals where they are." }
        ]
      },
      marqueeItems: ["conscious grooming", "calm handling", "no sedation", "streetie-friendly", "kalyan nagar", "since 2017", "made with care"]
    },
    about: {
      hero: {
        eyebrow: "About Pawpad",
        title: "Our story",
        lead: "Pawpad is a conscious pet care studio in Kalyan Nagar, Bengaluru. Founded in 2017 by Leena Munikempanna, we offer grooming, wellness therapy, boarding, and professional courses — all built around a single idea: every animal deserves to feel safe in our hands.",
        metaFounded: "2017",
        metaStudio: "Kalyan Nagar",
        metaRunBy: "Leena Munikempanna"
      },
      founder: {
        eyebrow: "Our story · told by Leena",
        portrait: "assets/img/pawpad/leena-portrait.webp",
        name: "Leena Munikempanna",
        role: "Founder · Pawpad · since 2017",
        quote: '"Every animal deserves someone who stops. Who looks. Who stays."',
        paragraphs: [
          "I always wanted to work with animals. I just took the long way to get here...",
          "For a long time, I was looking for something and didn't quite know what. I taught dance. I ran a clothing store. I got married and moved to London, where I worked at a bridal shop. Each thing was fine. None of it felt like mine.",
          "I grew up loving animals but had talked myself out of that path early — I was terrible at science, the formal routes felt out of reach, and so the dream stayed quietly in the background while I tried other things.",
          "Every morning on the way to work in London, I walked past a pet grooming studio. I'd slow down without meaning to, just watching the animals inside, the way someone was caring for them. Something about it stayed with me. I didn't do anything about it then. I just kept walking.",
          "I came back to Bangalore pregnant with my son, and somewhere between the anticipation of a new baby and the uncertainty of what came next, that old feeling returned — the one from the London window. When my son was a little older and started going to Green Pocket, I noticed a boarding space right next door called Petstepin. I walked in one afternoon. And that was that.",
          "I reached out to Ashita Mathew at Wags and Wiggles to do my certification. Balak, my husband, paid for the course without hesitation. He believed this was worth doing before I had fully convinced myself of it. When I was ready to start Pawpad in 2017, he funded that too. There would be no Pawpad without him, and I want to say that plainly.",
          "It was at Wags and Wiggles that I first met Sindhoor Pangal. She ran her dog behaviour practice from the studio above — and what began as proximity became something much more important. Sindhoor became a mentor. Not just in the technical sense, but in the deeper one — the kind of mentor who makes space for your fears, who lets you speak the things you're not sure of yet, and who doesn't rush you past the uncertainty. Her thinking on animal behaviour and what dogs are actually communicating has shaped how I see every single animal that comes through Pawpad's door.",
          "That relationship has continued. I went on to study Canine 101 with BHARCS — Sindhoor's organisation — and the community there has become genuinely important to me. These are people who take animal psychology seriously, who are always learning, and who hold each other to a standard of care that I find both challenging and grounding.",
          "I spent two years working at Cessna before going out on my own — learning not just technique, but how to read an animal. How to tell the difference between a dog that's coping and one that's shutting down. How to make the whole experience feel less like something being done to them."
        ],
        dewImg: "assets/img/pawpad/about-puchki.webp",
        dewEyebrow: "In memory of",
        dewTitle: "Dew",
        dewSubtitle: "— Puchki —",
        dewText: "My Boxer, my heart dog. We also called her Puchki, for her punched-up face. She was with me for thirteen years, through every move, every chapter. She never judged, never asked for more than I could give, and was always, always there. She's the reason I understand in my bones what it means for an animal to fully trust a person. Everything I do at Pawpad, I measure against what she taught me.",
        dewDedication: "— In memory of Dew (Puchki), the best girl.",
        closingParagraph1: "I have always had a deep connection with India's streeties. They live on the edges. Unloved by most, uncared for, existing just outside the boundary of where belonging is granted. And yet there is so much in them — such freedom, such joy in small things, such depth of feeling — that anyone who stops long enough to really look is met with a whirlwind of warmth and life.",
        closingParagraph2: "I see myself in them. I know what it is to live a little outside, to carry more than people assume, to light up completely when someone finally takes the time to see you. That recognition is part of why I do this work. Every animal deserves someone who stops. Who looks. Who stays.",
        closingParagraph3: "Pawpad has been running out of Kalyan Nagar since 2017. We groom dogs and cats — and we do it with eight years of learning behind every session. We also run grooming courses and work with rescues. But the thing that hasn't changed across all of it is the question I show up with every day: does this animal feel safe here?",
        signoff: "— Leena, founder, Pawpad"
      },
      philosophy: {
        eyebrow: "Our philosophy",
        title: "Our Philosophy",
        lead: "At Pawpad, we believe grooming is about far more than appearance. It is about comfort, trust, emotional wellbeing, and creating positive experiences that help pets feel safe in our care.",
        paragraphs: [
          "Every animal is different. Some arrive curious and confident, while others may be anxious, sensitive, elderly, rescued, or completely new to grooming. Rather than following a fixed approach, we adapt each session to the individual animal in front of us — their temperament, coat condition, physical comfort, and emotional state.",
          "Our philosophy is rooted in listening. Dogs and cats communicate constantly through their body language, behaviour, and responses to handling. We pay close attention to these signals and adjust our pace accordingly. Sometimes that means taking extra time. Sometimes it means giving a pet a break. And sometimes it means doing less in a session so that trust can be built over time.",
          "We do not believe in rushed grooming, force-based handling, or prioritising cosmetic results over an animal's wellbeing. Instead, we focus on creating calm, low-stress experiences that support healthy skin, coat maintenance, hygiene, mobility, and emotional comfort.",
          "Years of working with pets, rescue animals, and community animals have reinforced one simple belief: every animal deserves to be treated with patience, compassion, and respect. That belief guides every decision we make, from the way appointments are scheduled to the way pets are handled throughout their visit.",
          "For us, successful grooming is not just about how a pet looks when they leave. It is about how they feel, and whether they leave more comfortable, more confident, and more willing to return the next time."
        ],
        gallery: [
          "assets/img/pawpad/about-our-philosophy-collage.webp",
          "assets/img/pawpad/about-our-philosophy-collage-2.webp",
          "assets/img/pawpad/about-our-philosophy-collage-3.webp",
          "assets/img/pawpad/about-our-philosophy-collage-4.webp",
          "assets/img/pawpad/about-our-philosophy-collage-5.webp"
        ]
      },
      studio: {
        eyebrow: "The studio",
        title: "A cozy space",
        titleAccent: "Oodles of patience",
        lead: "Tucked into Kalyan Nagar, our studio is intentionally quiet — soft lighting, low chatter, no waiting-room crowds. Pets get time to settle before anything begins.",
        items: [
          { img: "assets/img/pawpad/about-studio-ample-spacing.webp", caption: "Ample spacing" },
          { img: "assets/img/pawpad/about-studio-images-hygienic.webp", caption: "Hygienic setup" },
          { img: "assets/img/pawpad/experience-space-2.webp", caption: "Quiet studio" },
          { img: "assets/img/pawpad/experience-space-3.webp", caption: "Calm care area" }
        ]
      },
      certifications: {
        eyebrow: "Certifications",
        title: "Professional education",
        lead: "Professional education plays an important role in how we care for animals. Leena continues to expand her knowledge through internationally recognised certifications in grooming, coat care, pet wellness, and emergency care.",
        certsList: [
          {
            name: "Certified Master Cat Groomer",
            org: "Professional Cat Groomers Association of America",
            body: "An internationally recognised certification focused specifically on feline grooming, behaviour, handling, and safety — ensuring cats are groomed with techniques designed around their unique coat, temperament, stress responses, and overall wellbeing."
          },
          {
            name: "PetCPR+ Certified",
            org: "Pet Emergency Education",
            body: "Emergency response knowledge including pet CPR, first aid, and recognising signs of distress. An extra layer of preparedness and safety while handling animals in a grooming environment."
          },
          {
            name: "Certified Canine Esthetician",
            org: "Advanced canine skin & coat training",
            body: "Advanced training focused on canine skin and coat health, specialised treatments, and holistic grooming care — addressing dryness, irritation, sensitivity, and overall skin wellness."
          },
          {
            name: "Certified Coat Expert",
            org: "Plush Puppy India",
            body: "Specialised education in coat textures, breed-specific coat care, maintenance techniques, and grooming products — creating grooming plans suited to each dog's individual coat type and long-term coat health."
          }
        ]
      }
    },
    grooming: {
      eyebrow: "Grooming services",
      title: "Stress-free grooming",
      lead: "Conscious pet grooming in Bangalore — built around coat health, hygiene, gentle handling, and emotional wellbeing. Every session is paced around your pet's comfort.",
      heroImage: "assets/img/pawpad/grooming-snapshot-new.webp",
      packages: [
        {
          cat: "Puppy",
          key: "puppy-short",
          title: "Puppy Grooming | Short Hair",
          sub: "Gentle introductions for puppies below 3 months",
          price: "₹1,000",
          priceNum: 1000,
          duration: "Gentle intro",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-puppy-short-hair-image.webp",
          includes: ["Eye & ear cleaning", "Teeth brushing", "Nail clipping", "Bath & coat conditioning", "Complete blow dry", "Coat brushing", "Paw & snout butter", "Organic leave-in conditioner"],
          note: "A calm first grooming experience that helps puppies get comfortable with handling, bathing, drying, and basic care routines."
        },
        {
          cat: "Puppy",
          key: "puppy-long",
          title: "Puppy Grooming | Long Hair",
          sub: "Extra coat care for long-coated puppies",
          price: "₹1,500",
          priceNum: 1500,
          duration: "Long coat care",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-puppy-long-hair-image.webp",
          includes: ["Eye & ear cleaning", "Teeth brushing", "Nail clipping", "Bath & coat conditioning", "Complete blow dry", "Coat brushing & deshedding", "Hygiene clip", "Face trimming", "Paw & snout butter", "Organic leave-in conditioner"],
          note: "Designed for long-coated puppies who need additional brushing, deshedding support, and a patient introduction to coat maintenance."
        },
        {
          cat: "Dog",
          key: "dog-short",
          title: "Dog Grooming | Short Hair",
          sub: "Clean, comfortable care for short coats",
          price: "₹1,600",
          priceNum: 1600,
          duration: "Coat care",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-dog-short-hair-image.webp",
          includes: ["Bath & coat conditioning", "Complete blow dry", "Coat brushing", "Eye & ear cleaning", "Nail clipping", "Paw care"],
          note: "A complete grooming reset for short-coated dogs, focused on skin health, hygiene, shedding control, and comfort."
        },
        {
          cat: "Dog",
          key: "dog-long",
          title: "Dog Grooming | Long Hair",
          sub: "Maintenance for longer coats",
          price: "₹2,000",
          priceNum: 2000,
          duration: "Detailed coat care",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-gromming-long-hair-dog.webp",
          includes: ["Bath & conditioning", "Full blow dry", "Coat brushing", "Deshedding support", "Face trimming", "Hygiene clip"],
          note: "For dogs who need more detailed coat work, careful brushing, and slow handling so longer sessions remain comfortable."
        },
        {
          cat: "Styling",
          key: "dog-grooming-long-hair",
          title: "Dog Grooming Long Hair with haircut",
          sub: "Full styling session for long-coated dogs",
          price: "₹2,500",
          priceNum: 2500,
          duration: "Styling session",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-dog-long-hair-haircut.webp",
          includes: ["Bath & Conditioning", "Coat trimming & scissoring", "Face and paw tidying", "Breed-aware styling", "Comfort breaks", "Deshedding support", "Finish & coat treatment"],
          note: "A complete styling session for long-coated dogs — balancing breed-specific shape, coat health, and your dog's comfort throughout."
        },
        {
          cat: "Care",
          key: "matted-dogs",
          title: "Matted Dogs",
          sub: "Careful support for tangled coats",
          price: "₹850",
          priceNum: 850,
          duration: "Assessment first",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-grooming-matted-dogs.webp",
          includes: ["Coat assessment", "Gentle dematting where possible", "Clip-down when needed", "Aftercare guidance"],
          note: "For coats with matting or tangles. We prioritise comfort and skin safety over cosmetic results."
        },
        {
          cat: "Cat",
          key: "cat-short",
          title: "Cat Grooming | Short Hair",
          sub: "Calm coat and hygiene care for short-haired cats",
          price: "₹1,500",
          priceNum: 1500,
          duration: "Feline care",
          isCatOnly: true,
          petType: "Cat",
          img: "assets/img/pawpad/cat-grooming-short-hair.webp",
          includes: ["Coat brushing", "Eye & ear cleaning", "Nail clipping", "Gentle bath", "Hygiene check", "Low-stress handling"],
          note: "For cats who need careful coat maintenance, hygiene support, and patient handling in a quiet environment."
        },
        {
          cat: "Cat",
          key: "cat-long",
          title: "Cat Grooming | Long Hair",
          sub: "Extra support for long coats and tangles",
          price: "₹2,000",
          priceNum: 2000,
          duration: "Detailed feline care",
          isCatOnly: true,
          petType: "Cat",
          img: "assets/img/pawpad/cat-grooming-long-hair.webp",
          includes: ["Coat brushing", "Mat assessment", "Gentle dematting where possible", "Sanitary trim", "Nail clipping", "Gentle bath", "Aftercare guidance"],
          note: "For long-haired cats who need detailed coat work, with comfort and consent guiding every step."
        },
        {
          cat: "Cat",
          key: "cat-haircut",
          title: "Cat Hair Cut",
          sub: "Complete haircut and hygiene care for cats",
          price: "₹1,500",
          priceNum: 1500,
          duration: "Feline styling",
          isCatOnly: true,
          petType: "Cat",
          img: "assets/img/pawpad/cat-hair-cut.webp",
          includes: ["Nail clipping", "Hair cut", "Ear cleaning", "Eye cleaning"],
          note: "A complete haircut and gentle care session for cats, including nail clipping, hair cut, ear cleaning, and eye cleaning with patient handling."
        },
        {
          cat: "Care",
          key: "hygiene-clip",
          title: "Hygiene Clip",
          sub: "Focused hygiene maintenance",
          price: "₹850",
          priceNum: 850,
          duration: "Targeted care",
          allowPetTypeSelection: true,
          img: "assets/img/pawpad/grooming-page-grooming-hygine-clip.webp",
          includes: ["Sanitary trimming", "Paw tidying", "Comfort-led handling", "Coat check"],
          note: "A targeted service for pets who need hygiene-focused trimming without a full grooming session."
        },
        {
          cat: "Care",
          key: "nail-clipping",
          title: "Nail Clipping",
          sub: "Slow, gentle nail care",
          price: "₹250",
          priceNum: 250,
          duration: "Quick visit",
          allowPetTypeSelection: true,
          img: "assets/img/pawpad/grooming-nail-clipping-new.webp",
          includes: ["Nail trimming", "Paw handling support", "Breaks for anxious pets", "Comfort checks"],
          note: "Gentle nail care for pets who need a quick maintenance visit or extra patience around paw handling."
        },
        {
          cat: "Wellness",
          key: "massage",
          title: "Massage",
          sub: "Pre & post grooming wellness add-on",
          price: "₹1,500",
          priceNum: 1500,
          duration: "Wellness add-on",
          allowPetTypeSelection: true,
          img: "assets/img/pawpad/grooming-page-grooming-massage.webp",
          includes: ["Gentle pre-grooming settling", "Grooming begins only when they're ready", "Post-grooming relaxation massage", "Led by your dog's comfort, never the clock"],
          note: "A quiet moment of care that helps your dog settle before grooming and gently unwind afterwards. Available exclusively as a pre and post grooming add-on."
        },
        {
          cat: "Care",
          key: "bath-brush-dogs",
          title: "Bath & Brush | Dogs",
          sub: "Essential Wash",
          price: "₹999",
          priceNum: 999,
          duration: "BATH & BRUSH",
          isDogOnly: true,
          petType: "Dog",
          img: "assets/img/pawpad/grooming-page-dog-long-hair-haircut.webp",
          includes: ["Bath", "Full blow dry", "Coat brushing"],
          notIncludes: ["Nail trim, ear cleaning, or anal gland expression", "Hygiene clip, scissoring, or clipping", "Matted coats or dogs needing extra care"],
          note: "A fast, no-fuss clean for dogs who don't need a full groom — just a wash, dry, and brush-out between full sessions."
        },
        {
          cat: "Care",
          key: "bath-brush-cats",
          title: "Bath & Brush | Cats",
          sub: "Essential Wash",
          price: "₹999",
          priceNum: 999,
          duration: "BATH & BRUSH",
          isCatOnly: true,
          petType: "Cat",
          img: "assets/img/pawpad/bath-brush-cats.webp",
          includes: ["Bath", "Full blow dry", "Coat brushing"],
          notIncludes: ["Nail trim, ear cleaning, or anal gland expression", "Hygiene clip, scissoring, or clipping", "Matted coats or cats needing extra care"],
          note: "A fast, no-fuss clean for cats who don't need a full groom — just a wash, dry, and brush-out between full sessions."
        },
        {
          cat: "Care",
          key: "bath-brush-subscription",
          title: "Bath & Brush Subscription package",
          sub: "Essential Wash",
          price: "₹3,496.50",
          priceNum: 3496.5,
          duration: "VALID 2 MONTHS",
          allowPetTypeSelection: true,
          img: "assets/img/pawpad/bath-brush-subscription.webp",
          includes: ["4 Bath & Brush sessions", "For dogs & cats", "Valid for 2 months from purchase", "Non-transferable"],
          notIncludes: ["Nail trim, ear cleaning, or anal gland expression", "Hygiene clip, scissoring, or clipping", "Unused sessions do not roll over or qualify for a refund"],
          note: "Keep your pet's coat consistently clean and healthy with regular bath-and-brush visits, spaced through the month."
        }
      ],
      addOns: [
        { name: "Deep deshedding (FURminator+)", price: "+ ₹500" },
        { name: "Hot oil & coat mask", price: "+ ₹400" },
        { name: "Anti-tick herbal bath", price: "+ ₹300" },
        { name: "Blueberry facial", price: "+ ₹250" },
        { name: "Teeth scaling (cosmetic)", price: "+ ₹350" },
        { name: "Pawpad signature pamper-pack", price: "+ ₹900" }
      ]
    },
    courses: {
      eyebrow: "Professional Academy",
      title: "Learn Conscious Pet Grooming",
      lead: "Small cohorts (max 3 students), intensive hands-on practice on live dogs and cats, stress-free handling methods, and business mentoring.",
      heroImage: "assets/img/pawpad/courses-snapshot.webp",
      depositNotice: "A non-refundable deposit is required upon acceptance to secure your slot in the cohort.",
      allowSubmissions: true,
      admissionsNote: "Applications are evaluated in the order received. We schedule an interview with eligible applicants before offering admission.",
      courseList: [
        {
          key: "pacgc",
          cat: "Comprehensive Certification",
          title: "Pawpad Applied Canine & Feline Grooming Certification (PACGC)",
          price: "₹95,000",
          priceNum: 95000,
          deposit: "₹23,750",
          duration: "7 weeks · 3 students max",
          knowMoreUrl: "",
          enrollUrl: "course_forms/pawpad-application-pacgc.html",
          desc: "A 7-week comprehensive programme in conscious canine and feline grooming in Bengaluru. Small cohort of 3 students learning consent-based handling, anatomy, coat care, scissoring, and clipping without restraint.",
          includes: ["Live dog and cat handling", "Force-free coat styling & scissoring", "Skin & dermatology fundamentals", "Salon ergonomics & safety", "Business launch mentorship"],
          note: "Flagship practitioner certification for individuals looking to launch their own salon or lead conscious grooming practices."
        },
        {
          key: "pcgec",
          cat: "Essentials",
          title: "Pawpad Canine Grooming Essentials Certificate (PCGEC)",
          price: "₹30,000",
          priceNum: 30000,
          deposit: "₹7,500",
          duration: "5 days",
          knowMoreUrl: "course_forms/pawpad-essentials-dog-page.html",
          enrollUrl: "course_forms/pawpad-application-pcgec.html",
          desc: "A fast, 5-day hands-on introduction to professional dog grooming for complete beginners. Work directly with live dogs from day one under expert supervision to learn bathing, drying, brushing, ear cleaning, and coat-care fundamentals.",
          includes: ["Bathing & coat preparation", "High-velocity drying techniques", "Nail clipping & paw hygiene", "Canine body language basics"],
          note: "Perfect for pet parents, rescue volunteers, and aspiring salon assistants."
        },
        {
          key: "pcgpc",
          cat: "Practitioner",
          title: "Pawpad Canine Grooming Practitioner Certificate (PCGPC)",
          price: "₹50,000",
          priceNum: 50000,
          deposit: "₹12,500",
          duration: "3 weeks",
          knowMoreUrl: "course_forms/pawpad-practitioner-dog-page.html",
          enrollUrl: "course_forms/pawpad-application-pcgpc.html",
          desc: "A 3-week practitioner-level programme designed to build industry-ready technical grounding in canine grooming. Master bathing and coat care, advance to live-dog nail trimming and hygiene clipping, and practice full scissoring techniques on training models.",
          includes: ["Advanced clipping & blade selection", "Breed-specific head & body styling", "Handling nervous & senior dogs", "Hygiene trims & sanitary care"],
          note: "Intensive training for professionals seeking fast-track employment in pet care facilities."
        },
        {
          key: "pfgec",
          cat: "Essentials",
          title: "Pawpad Feline Grooming Essentials Certificate (PFGEC)",
          price: "₹30,000",
          priceNum: 30000,
          deposit: "₹7,500",
          duration: "5 days",
          knowMoreUrl: "course_forms/pawpad-essentials-cat-page.html",
          enrollUrl: "course_forms/pawpad-application-pfgec.html",
          desc: "A 5-day hands-on introductory course covering feline-specific grooming and handling techniques. Build entry-level competence in cat body language, bathing, drying, brushing, de-matting, and ear care under close instructor guidance.",
          includes: ["Feline body language & stress indicators", "Towel wrapping & calm handling", "Mat breakdown & safe combing", "Water & waterless bath methods"],
          note: "Dedicated strictly to feline physiology, hygiene routines, and emotional comfort."
        },
        {
          key: "pfgpc",
          cat: "Practitioner",
          title: "Pawpad Feline Grooming Practitioner Certificate (PFGPC)",
          price: "₹50,000",
          priceNum: 50000,
          deposit: "₹12,500",
          duration: "3 weeks",
          knowMoreUrl: "course_forms/pawpad-practitioner-cat-page.html",
          enrollUrl: "course_forms/pawpad-application-pfgpc.html",
          desc: "An intensive 3-week practitioner course providing hands-on feline grooming mastery. Progress from bathing and coat care to live nail trimming, hygiene clipping, and full haircuts performed directly on live cats.",
          includes: ["Full feline haircuts & sanitary clips", "Low-stress dematting without sedation", "Feline skin & parasite management", "Building feline-only appointments"],
          note: "One of India's few hands-on, live-cat conscious grooming practitioner certifications."
        },
        {
          key: "foundations",
          cat: "Foundations",
          title: "Pawpad Foundations — Behaviour-Led Grooming for Beginners",
          price: "₹95,000",
          priceNum: 95000,
          deposit: "₹23,750",
          duration: "7 weeks",
          knowMoreUrl: "course_forms/pawpad-foundations-page.html",
          enrollUrl: "course_forms/pawpad-application-pfbgb.html",
          desc: "A 7-week foundation-level grooming certification for complete beginners building toward a professional grooming career with both dogs and cats. Learn consent-based handling, anatomy, stress signals, bathing, coat care, scissoring, and clipping without restraint or force.",
          includes: ["Canine & feline comparative handling", "Tool mastery & scissor sharpening", "De-shedding & coat restoration", "Client communication & ethics"],
          note: "Comprehensive dual-species foundation for complete career changers."
        },
        {
          key: "studio-consulting-online",
          cat: "Mentorship",
          title: "Grooming Studio Setup — Option 1: Online Consultation",
          price: "₹20,000",
          priceNum: 20000,
          deposit: "₹5,000",
          duration: "2 Video Calls",
          knowMoreUrl: "course_forms/pawpad-studio-consulting-page.html",
          enrollUrl: "course_forms/pawpad-studio-consulting-page.html",
          enrollText: "Enroll / Book Now",
          desc: "Two video calls plus a written equipment and space brief based on your floor plan or photos. Ideal for remote guidance on budgets, layout, and essential gear.",
          includes: ["2 comprehensive video consultation calls", "Customized equipment & space brief", "Floor plan & tool recommendations"],
          note: "Ideal for remote guidance on budgets, layout, and essential gear."
        },
        {
          key: "studio-consulting-in-person",
          cat: "Mentorship",
          title: "Grooming Studio Setup — Option 2: In-Person Studio Visit",
          price: "₹35,000 / day",
          priceNum: 35000,
          deposit: "₹10,000",
          duration: "Full Day On-Site",
          knowMoreUrl: "course_forms/pawpad-studio-consulting-page.html",
          enrollUrl: "course_forms/pawpad-studio-consulting-page.html",
          enrollText: "Enroll / Book Now",
          desc: "A full day on-site assessing your actual space in person before providing customized equipment lists, space recommendations, and operational layout planning.",
          includes: ["Full-day in-person site assessment", "Customized equipment & supplier lists", "Acoustic, ventilation & layout blueprint"],
          note: "Hands-on site inspection and tailored spatial planning."
        }
      ]
    },
    boarding: {
      eyebrow: "PAWPAD · BOARDING",
      title: "Boarding, Reimagined",
      sub: "Trial Day & Overnight Stay — What's Included",
      lead: "Home-like, un-caged environment with personalized feeding schedules, direct human observation, and zero-stress routines for small dogs.",
      heroImage: "assets/img/pawpad/boarding-sleeping-puppy-toy.webp",
      trialDayFee: "₹850",
      overnightFee: "₹1,000 / night",
      policyNotice: "Currently open strictly to small dogs only. A mandatory Trial Day assessment must be successfully completed before any overnight booking is accepted.",
      whatsappNumber: "919663077496",
      packages: [
        {
          key: "trial-day",
          tag: "Step 1 · Mandatory Assessment",
          title: "Trial Day",
          price: "₹850",
          priceNum: 850,
          priceUnit: "per dog",
          img: "assets/img/pawpad/boarding-sleeping-puppy-toy.webp",
          desc: "A full day with us, so both you and we can see if it's a good fit before committing to an overnight stay. Currently open to small dogs only.",
          includes: [
            "Scheduled Feeding: Feeding on your dog's regular schedule with home-cooked meals (chicken, pumpkin, carrot, sweet potato, rice)",
            "Dedicated Quiet Space: Rest and quiet time in the same space used for overnight boarding",
            "Direct Observation: Direct observation from our team throughout the day",
            "Parent Consultation: A conversation with you at pickup on how the day went and next steps"
          ],
          note: "Trial days don't include walks — activity happens on-site, supervised, within the boarding space itself. Paid separately from any future boarding stay."
        },
        {
          key: "overnight",
          tag: "Step 2 · Overnight Stay",
          title: "Overnight Boarding",
          price: "₹1,000",
          priceNum: 1000,
          priceUnit: "per dog, per night",
          img: "assets/img/pawpad/boarding-dog-sleep-mask.webp",
          desc: "A calm, un-caged overnight stay in our home-like environment with personalized attention and peaceful sleep routines.",
          includes: [
            "Full Overnight Supervised Stay: Attentive supervision with regular bedtime and wake-up routines",
            "Custom Meal Schedule: Home-cooked balanced diet or parent-provided meals served on time",
            "Calm Play & Enrichment: On-site supervised activities tailored to your dog's energy level",
            "Daily Photo & Video Updates: Regular check-in messages so you always know how your dog is doing"
          ],
          note: "Requires successful completion of a Trial Day assessment prior to booking. Open to small dogs only."
        }
      ],
      standardsEyebrow: "Care Standards",
      standardsTitle: "What Daily Life Looks Like at Pawpad",
      standardsImg: "assets/img/pawpad/boarding-dachshund-sleep-mask.webp",
      standardsQuote: "“We treat every boarding dog like family — with cozy bedding, home-cooked food, and 24-hour presence.”",
      standardsAuthor: "— The Pawpad Team",
      pillars: [
        {
          icon: "🍲",
          title: "Fresh, Wholesome Home Cooking",
          desc: "Feeding on your dog's regular schedule with home-cooked meals of chicken, pumpkin, carrot, beans, sweet potato, and rice. Special diets or vet food strictly followed."
        },
        {
          icon: "🛡️",
          title: "Safe, Stress-Free On-Site Activity",
          desc: "Walks aren't included; all activity happens on-site and supervised within the boarding space to keep your dog secure, relaxed, and safe."
        },
        {
          icon: "🌙",
          title: "Overnight Human Supervision, Always",
          desc: "Overnight human supervision, always — dogs are never left alone, ensuring constant comfort, care, and peace of mind."
        }
      ],
      faqEyebrow: "Got Questions?",
      faqTitle: "Frequently Asked Questions",
      faqSub: "Everything you need to know about our boarding guidelines, routines, and policies.",
      faq: [
        {
          q: "Why is a Trial Day mandatory before overnight stays?",
          a: "A completed trial day is required before booking an overnight stay — it's how we make sure your dog is a good fit before an overnight commitment. It allows your dog to get familiar with our space, team, and cohort in a calm, stress-free setting."
        },
        {
          q: "What meals are provided, and can I send my dog's regular food?",
          a: "Our standard meals are home-cooked, with chicken, pumpkin, carrot, beans, sweet potato, and rice, fed on your dog's regular schedule. If your dog has any food allergies or is on vet-specified food, let us know in advance and provide it for the day."
        },
        {
          q: "Why are activities held on-site rather than walks?",
          a: "Trial days and stays don't include walks — activity happens on-site, supervised, within the boarding space itself to keep the environment calm, safe, and controlled."
        },
        {
          q: "Is there any minimum or maximum stay length?",
          a: "No minimum or maximum stay length. Stays are flexible based on your needs once the mandatory trial day is completed."
        }
      ],
      ctaEyebrow: "Ready to Plan Your Dog's Stay?",
      ctaTitle: "Give Your Pup a Calm, Loving Stay",
      ctaDesc: "Add a Trial Day to your cart to begin the onboarding process, or chat directly with Leena and the Pawpad team on WhatsApp.",
      ctaButtonText: "Book Trial Day (₹850)",
      ctaWhatsAppText: "Chat on WhatsApp"
    },
    myotherapy: {
      eyebrow: "PAWPAD · MYOTHERAPY",
      title: "Myotherapy – Coming Soon",
      lead: "Ever noticed a subtle change in how your dog moves — a slight shift in gait, a new hesitation before jumping onto the couch or into the car, needing a boost for stairs they used to take without a second thought? A calm, quiet dog isn't always a relaxed one, either. Sometimes it's a dog who's learned to move less, because moving hurts — and it's easy to miss, especially in a dog you already think of as \"chilled\" or \"lazy.\"",
      body1: "Myotherapy is gentle, hands-on bodywork for dogs — targeted massage and movement techniques that work with the whole body, not just wherever seems sore, to ease tension and support mobility. It's genuinely for every dog: keeping a dog feeling at their best, helping a puppy build good movement habits, supporting a senior through the slower years. But dogs with musculoskeletal issues — stiffness, old injuries, post-op recovery, arthritis, or a gait that just doesn't look quite right — are the ones who see the most benefit, often within just a few sessions.",
      body2Prefix: "Curious about the methodology? ",
      linkText: "Visit Galen Myotherapy",
      linkUrl: "https://www.galenmyotherapy.com",
      body2Suffix: ". Join the waitlist to be the first to know when sessions open.",
      note: "Pawpad · Details current as of this document's creation date.",
      heroImage: "assets/img/pawpad/myotheraphy-snapshot.webp"
    },
    contact: {
      bannerEyebrow: "Contact Pawpad",
      bannerTitle: "Come say hello.",
      bannerLead: "Have a question about grooming, care, boarding or our services? Reach out to Pawpad. We would love to hear from you.",
      studioBadgeLabel: "STUDIO",
      studioBadgeName: "Kalyan Nagar",
      studioBadgeCity: "BENGALURU",
      mainEyebrow: "Get in touch",
      mainTitle: "We are here for you.",
      mainSubtext: "Whether you are booking a grooming session, asking about our services, or simply want to know more about Pawpad, reach out to us.",
      email: "info@pawpad.in",
      phone: "9663077496",
      phoneDisplay: "9663077496",
      addressLines: [
        "#426, 5th Main Road,",
        "HRBR 2nd Block, Kalyan Nagar",
        "Bangalore - 560043 India"
      ],
      hoursWeekdays: "Weekdays: 11 AM - 8 PM",
      hoursWeekends: "Weekends: 10 AM - 8 PM",
      hoursClosed: "Thursdays: Closed",
      cardEyebrow: "Pawpad Grooming Studio",
      cardTitle: "Soft hands",
      cardTitleAccent: "Calm pets.",
      cardDesc: "Sessions are spaced and never rushed. We plan around your pet's temperament, comfort and wellbeing.",
      cardBtnBook: "Book a session",
      cardBtnCall: "Call us",
      cardCallPhone: "+919663077496",
      socialEyebrow: "Follow Pawpad",
      socialTitle: "Stay connected.",
      socials: {
        instagram: "https://www.instagram.com/pawpad_grooming_studio?igsi=MTRranltYzh1cnVuZw%3D%3D&utm_source=qr",
        facebook: "https://www.facebook.com/share/19KxDx35E5/?mibextid=wwXIfr",
        twitter: "https://twitter.com",
        pinterest: "https://pinterest.com"
      }
    },
    forms: {
      depositNotice: "A non-refundable deposit is required upon acceptance to secure your slot in the cohort.",
      pacgcFee: "₹95,000",
      pacgcDeposit: "₹23,750",
      pcgecFee: "₹30,000",
      pcgpcFee: "₹50,000",
      pfgecFee: "₹30,000",
      pfgpcFee: "₹50,000",
      allowSubmissions: true
    }
  };

  class ContentStore {
    constructor() {
      this.state = this._load();
    }

    _load() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.courses && Array.isArray(parsed.courses.courseList)) {
            parsed.courses.courseList = parsed.courses.courseList.filter(
              c => c && c.key !== "pgfc" && !(c.title && c.title.includes("Grooming Foundations Certificate (PGFC)"))
            );

            // If old generic 'consulting' exists, replace with Option 1 and Option 2
            const consultingIdx = parsed.courses.courseList.findIndex(c => c && c.key === "consulting");
            if (consultingIdx !== -1) {
              const onlineOption = {
                key: "studio-consulting-online",
                cat: "Mentorship",
                title: "Grooming Studio Setup — Option 1: Online Consultation",
                price: "₹20,000",
                priceNum: 20000,
                deposit: "₹5,000",
                duration: "2 Video Calls",
                knowMoreUrl: "course_forms/pawpad-studio-consulting-page.html",
                enrollUrl: "course_forms/pawpad-studio-consulting-page.html",
                enrollText: "Enroll / Book Now",
                desc: "Two video calls plus a written equipment and space brief based on your floor plan or photos. Ideal for remote guidance on budgets, layout, and essential gear.",
                includes: ["2 comprehensive video consultation calls", "Customized equipment & space brief", "Floor plan & tool recommendations"],
                note: "Ideal for remote guidance on budgets, layout, and essential gear."
              };
              const inPersonOption = {
                key: "studio-consulting-in-person",
                cat: "Mentorship",
                title: "Grooming Studio Setup — Option 2: In-Person Studio Visit",
                price: "₹35,000 / day",
                priceNum: 35000,
                deposit: "₹10,000",
                duration: "Full Day On-Site",
                knowMoreUrl: "course_forms/pawpad-studio-consulting-page.html",
                enrollUrl: "course_forms/pawpad-studio-consulting-page.html",
                enrollText: "Enroll / Book Now",
                desc: "A full day on-site assessing your actual space in person before providing customized equipment lists, space recommendations, and operational layout planning.",
                includes: ["Full-day in-person site assessment", "Customized equipment & supplier lists", "Acoustic, ventilation & layout blueprint"],
                note: "Hands-on site inspection and tailored spatial planning."
              };
              parsed.courses.courseList.splice(consultingIdx, 1, onlineOption, inPersonOption);
            }

            parsed.courses.courseList.forEach(course => {
              if (course.knowMoreUrl === "course_forms/pawpad-advanced-dog-page.html") {
                course.knowMoreUrl = "";
              }
              if (course.enrollUrl === "course_forms/pawpad-application-consulting.html") {
                course.enrollUrl = "course_forms/pawpad-studio-consulting-page.html";
              }
            });
          }
          return this._deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONTENT)), parsed);
        }
      } catch (err) {
        console.warn("PawpadContentStore: could not load overrides from localStorage", err);
      }
      return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
    }

    _save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        window.dispatchEvent(new CustomEvent("pawpad-content-updated", { detail: this.state }));
      } catch (err) {
        console.error("PawpadContentStore: failed to save to localStorage", err);
      }
    }

    _deepMerge(target, source) {
      if (!source || typeof source !== "object") return target;
      for (const key of Object.keys(source)) {
        const val = source[key];
        if (val !== undefined && val !== null) {
          if (typeof val === "object" && !Array.isArray(val)) {
            if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
              target[key] = {};
            }
            this._deepMerge(target[key], val);
          } else {
            target[key] = val;
          }
        }
      }
      return target;
    }

    get(pageKey) {
      if (!pageKey) return this.state;
      return this.state[pageKey] || DEFAULT_CONTENT[pageKey] || {};
    }

    getAll() {
      return this.state;
    }

    update(pageKey, newValues) {
      if (!this.state[pageKey]) {
        this.state[pageKey] = {};
      }
      if (typeof newValues === "object" && !Array.isArray(newValues)) {
        this.state[pageKey] = { ...this.state[pageKey], ...newValues };
      } else {
        this.state[pageKey] = newValues;
      }
      this._save();
      return this.state[pageKey];
    }

    updateField(pageKey, fieldPath, value) {
      const parts = fieldPath.split(".");
      let cur = this.state[pageKey] || (this.state[pageKey] = {});
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      this._save();
    }

    resetPage(pageKey) {
      if (DEFAULT_CONTENT[pageKey]) {
        this.state[pageKey] = JSON.parse(JSON.stringify(DEFAULT_CONTENT[pageKey]));
        this._save();
      }
    }

    resetAll() {
      this.state = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
      this._save();
    }

    exportJSON() {
      return JSON.stringify(this.state, null, 2);
    }

    importJSON(jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        this.state = this._deepMerge(JSON.parse(JSON.stringify(DEFAULT_CONTENT)), parsed);
        this._save();
        return true;
      } catch (err) {
        console.error("PawpadContentStore: Invalid JSON provided", err);
        return false;
      }
    }

    getOverrideCount() {
      let count = 0;
      const compare = (def, cur) => {
        if (typeof def !== typeof cur) return 1;
        if (typeof def === "object" && def !== null && !Array.isArray(def)) {
          let c = 0;
          for (const k of Object.keys(cur)) {
            if (def[k] === undefined) c++;
            else c += compare(def[k], cur[k]);
          }
          return c;
        }
        if (Array.isArray(def) && Array.isArray(cur)) {
          return JSON.stringify(def) !== JSON.stringify(cur) ? 1 : 0;
        }
        return def !== cur ? 1 : 0;
      };
      return compare(DEFAULT_CONTENT, this.state);
    }
  }

  // Image WebP Optimizer Utility
  // Automatically transforms uploaded images into high-performance .webp with compression & size stats
  const PawpadImageOptimizer = {
    convertToWebP: function(fileOrBlob, quality = 0.85, maxDimension = 1920) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = new Image();
          img.onload = function() {
            let width = img.width;
            let height = img.height;

            // Scale down if larger than maximum dimension
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to webp data URL
            const webpDataUrl = canvas.toDataURL("image/webp", quality);
            const originalSizeBytes = fileOrBlob.size || Math.round((event.target.result.length * 3) / 4);
            const webpSizeBytes = Math.round((webpDataUrl.length * 3) / 4);

            resolve({
              dataUrl: webpDataUrl,
              format: "image/webp",
              width: width,
              height: height,
              originalSizeBytes: originalSizeBytes,
              webpSizeBytes: webpSizeBytes,
              optimizedSize: webpSizeBytes,
              savedPercent: originalSizeBytes > 0 ? Math.max(0, Math.round(((originalSizeBytes - webpSizeBytes) / originalSizeBytes) * 100)) : 0
            });
          };
          img.onerror = reject;
          img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBlob);
      });
    },
    optimizeImage: function(fileOrBlob, quality = 0.85, maxDimension = 1920) {
      return this.convertToWebP(fileOrBlob, quality, maxDimension);
    }
  };

  const storeInstance = new ContentStore();

  window.PawpadContentStore = storeInstance;
  window.PawpadImageOptimizer = PawpadImageOptimizer;

})(window);
