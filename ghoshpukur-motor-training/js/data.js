/**
 * Ghoshpukur Motor Training School - Data Management Service
 * Provides local storage persistence and default mock data.
 */

const STORAGE_KEYS = {
  SETTINGS: 'gmts_settings',
  SLIDES: 'gmts_slides',
  COURSES: 'gmts_courses',
  GALLERY: 'gmts_gallery',
  APPLICATIONS: 'gmts_applications',
  AUTH: 'gmts_auth'
};

// Default Settings
const defaultSettings = {
  schoolName: "Ghoshpukur Motor Training School",
  tagline: "Govt. Approved & Recognized Motor Driving Training School",
  regNo: "Govt. Reg. No: WB/DAR/MTS/2018/042",
  phone: "+91 98320 12345",
  altPhone: "+91 70012 34567",
  whatsapp: "919832012345",
  email: "contact@ghoshpukurmotortraining.com",
  address: "NH 31 Highway, Near Ghoshpukur Bus Stand & Toll Plaza, Ghoshpukur, Siliguri, Dist. Darjeeling, West Bengal - 734434",
  hours: "Monday to Sunday: 6:00 AM – 7:00 PM",
  rtoCode: "WB-74 / WB-73 (Darjeeling & Siliguri RTO)",
  announcement: "📢 Admissions Open for Upcoming Month Batches! Special 15% Combo Discount on 2-Wheeler + 4-Wheeler Training. Female instructors available for ladies!"
};

// Default Carousel Slides
const defaultSlides = [
  {
    id: "slide_1",
    title: "Master the Road with Complete Confidence",
    subtitle: "Govt. Approved Driving Training with Dual-Control Safety Vehicles and Experienced Govt-Certified Instructors in Ghoshpukur.",
    badge: "100% Practical Training",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Enroll for Training",
    ctaLink: "#admission-form",
    secondaryCtaText: "Explore Courses",
    secondaryCtaLink: "#courses",
    isVisible: true,
    order: 1
  },
  {
    id: "slide_2",
    title: "Dual-Control Hatchbacks & Modern Fleet",
    subtitle: "Train on modern Maruti Swift, WagonR & Alto equipped with co-driver clutch and brake for 100% safety during learning.",
    badge: "Safety Guaranteed",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80",
    ctaText: "View Our Fleet",
    ctaLink: "#gallery",
    secondaryCtaText: "Apply Online",
    secondaryCtaLink: "#admission-form",
    isVisible: true,
    order: 2
  },
  {
    id: "slide_3",
    title: "RTO Driving License Assistance Guaranteed",
    subtitle: "End-to-end guidance from Learner's License (LL) test preparation to 8-shape & H-track practical test at Siliguri RTO.",
    badge: "RTO Approved Guidance",
    imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Get Your License",
    ctaLink: "#admission-form",
    secondaryCtaText: "Check Syllabus",
    secondaryCtaLink: "#courses",
    isVisible: true,
    order: 3
  },
  {
    id: "slide_4",
    title: "Special Ladies Batches with Lady Instructors",
    subtitle: "Comfortable, patient, and dedicated female trainer batches with flexible morning and evening timings.",
    badge: "Women Empowerment",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=80",
    ctaText: "Book Free Demo Session",
    ctaLink: "#admission-form",
    secondaryCtaText: "Call Us Now",
    secondaryCtaLink: "tel:+919832012345",
    isVisible: true,
    order: 4
  }
];

// Default Courses
const defaultCourses = [
  {
    id: "course_4w_basic",
    title: "4-Wheeler Basic Learner's Course",
    category: "4w",
    categoryName: "Four Wheeler",
    duration: "21 Days (Daily 40 Mins)",
    price: 4500,
    originalPrice: 5500,
    vehicle: "Maruti Swift / WagonR (Dual Control)",
    badge: "Best for Beginners",
    badgeColor: "success",
    description: "Comprehensive step-by-step driving course designed for absolute beginners. Covers vehicle fundamentals, clutch control, gear shifting, steering mastery, and local road driving.",
    features: [
      "21 Days Practical Driving (Daily 40 Mins)",
      "Dual-Control Safety Car (Co-driver brake/clutch)",
      "Clutch, Gear, Steering & Braking coordination",
      "Reverse & Parallel Parking practice on poles",
      "Slope / Incline start without rollback",
      "Traffic rules, road signs & basic theory class",
      "Siliguri RTO Track (8 & H Track) simulation"
    ],
    isVisible: true
  },
  {
    id: "course_4w_pro",
    title: "4-Wheeler Highway & Advance Driving",
    category: "4w",
    categoryName: "Four Wheeler",
    duration: "30 Days (Daily 45 Mins)",
    price: 6500,
    originalPrice: 7999,
    vehicle: "Swift / Dzire / Baleno",
    badge: "Most Popular",
    badgeColor: "primary",
    description: "Complete driving mastery program including intensive highway driving on NH 31, crowded city markets, night driving, bad weather handling, and emergency braking.",
    features: [
      "30 Days In-depth Practical Training",
      "NH 31 & Asian Highway Driving sessions",
      "Heavy Traffic & Market driving maneuvers",
      "Night driving with headlight beam discipline",
      "Tyre puncture changing & basic engine troubleshooting",
      "Rain & fog driving safety instructions",
      "Free RTO Driving Test mock session"
    ],
    isVisible: true
  },
  {
    id: "course_combo_vip",
    title: "VIP Combo (2-Wheeler + 4-Wheeler)",
    category: "combo",
    categoryName: "Combo Package",
    duration: "30 Days Comprehensive",
    price: 7500,
    originalPrice: 9500,
    vehicle: "Car + Geared Bike / Scooter",
    badge: "Maximum Value",
    badgeColor: "warning",
    description: "Dual license training package! Learn both two-wheeler (scooter/motorcycle) and four-wheeler in one bundled program at a discounted combo fee.",
    features: [
      "Both Bike/Scooter and Car practical training",
      "Separate slots for 2W and 4W practice",
      "Dual License (MCWG + LMV) documentation support",
      "Balance & lane discipline for two-wheelers",
      "Full Four-Wheeler basic to highway course",
      "Complete Highway Code and safety guidelines",
      "Dedicated senior mentor assigned"
    ],
    isVisible: true
  },
  {
    id: "course_2w_training",
    title: "Two-Wheeler Driving Course (Bike & Scooter)",
    category: "2w",
    categoryName: "Two Wheeler",
    duration: "15 Days (Daily 30 Mins)",
    price: 2400,
    originalPrice: 3000,
    vehicle: "Hero Splendor (Geared) / Honda Activa (Automatic)",
    badge: "Quick Learner",
    badgeColor: "info",
    description: "Ideal for riders seeking complete balance confidence, clutch & gear management for motorcycles, or hassle-free automatic scooter driving.",
    features: [
      "15 Days Balance & Riding Sessions",
      "Choice of Geared Motorcycle or Gearless Scooter",
      "Foot brake and hand brake synchronization",
      "Slalom & Zig-Zag cone maneuvering",
      "RTO 8-Shape track practice for license test",
      "Pillion rider balance and heavy traffic handling"
    ],
    isVisible: true
  },
  {
    id: "course_crash_refresher",
    title: "7-Day Crash / Refresher Course",
    category: "refresher",
    categoryName: "Refresher",
    duration: "7 Days (Daily 60 Mins Intensive)",
    price: 2800,
    originalPrice: 3500,
    vehicle: "Candidate's Own Car or School Car",
    badge: "Fast Track",
    badgeColor: "secondary",
    description: "For individuals who already hold a driving license or have basic driving knowledge but lack confidence in crowded traffic, highways, or tight parking.",
    features: [
      "7 Days Intensive 1-Hour Driving daily",
      "Confidence building in Siliguri & Ghoshpukur traffic",
      "Tight alleyway & basement parking mastery",
      "Option to train in your own family car with trainer",
      "Flyover and hill incline control techniques",
      "Customized focus on your personal weak spots"
    ],
    isVisible: true
  },
  {
    id: "course_commercial",
    title: "Commercial & Transport Driver Program",
    category: "commercial",
    categoryName: "Commercial / LMV-TR",
    duration: "45 Days Professional",
    price: 9500,
    originalPrice: 12000,
    vehicle: "Bolero / Pickup / Tata Ace",
    badge: "Career Oriented",
    badgeColor: "danger",
    description: "Professional training for candidates aiming for commercial driving careers, transport operations, defensive driving protocols, and logbook compliance.",
    features: [
      "45 Days Heavy commercial road training",
      "Load balancing and cargo safety principles",
      "Highway night transport navigation",
      "GPS and modern digital navigation usage",
      "Mechanical upkeep, oil check & coolant maintenance",
      "Commercial RTO badge endorsement assistance"
    ],
    isVisible: true
  }
];

// Default Gallery
const defaultGallery = [
  {
    id: "gal_1",
    title: "Dual-Control Training Fleet",
    category: "fleet",
    categoryName: "Training Fleet",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    caption: "Our modern Maruti Swift and Alto fleet fitted with certified dual control braking systems.",
    isVisible: true
  },
  {
    id: "gal_2",
    title: "Ghoshpukur Practical Practice Ground",
    category: "ground",
    categoryName: "Training Ground",
    imageUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    caption: "Spacious private ground for parallel parking, reverse S-bend, and cone slalom practice.",
    isVisible: true
  },
  {
    id: "gal_3",
    title: "Hands-on Steering & Highway Training",
    category: "training",
    categoryName: "Practical Classes",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
    caption: "Instructor giving live real-time guidance on NH 31 highway driving lanes.",
    isVisible: true
  },
  {
    id: "gal_4",
    title: "Proud Student Receiving Driving License",
    category: "students",
    categoryName: "Successful Students",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    caption: "Student successfully passed the RTO driving trial on her first attempt!",
    isVisible: true
  },
  {
    id: "gal_5",
    title: "Classroom Traffic Rules & Signs Session",
    category: "training",
    categoryName: "Practical Classes",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    caption: "Weekly theory sessions on Motor Vehicle Act, mandatory sign boards, and safe overtaking.",
    isVisible: true
  },
  {
    id: "gal_6",
    title: "Two-Wheeler Balance & 8-Track Session",
    category: "training",
    categoryName: "Practical Classes",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    caption: "Trainee practicing figure-8 balance test required for Siliguri RTO two-wheeler test.",
    isVisible: true
  },
  {
    id: "gal_7",
    title: "Car Engine Inspection & Maintenance Class",
    category: "training",
    categoryName: "Practical Classes",
    imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
    caption: "Learning engine oil check, battery terminals, brake fluid, and radiator maintenance.",
    isVisible: true
  },
  {
    id: "gal_8",
    title: "Batch Graduation & Certification Ceremony",
    category: "students",
    categoryName: "Successful Students",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    caption: "Our enthusiastic weekend batch completing their 30-day training course.",
    isVisible: true
  }
];

// Default Applications (Seed data so Admin panel looks lively right away)
const defaultApplications = [
  {
    id: "GMTS-2026-101",
    appliedDate: "2026-11-20T10:15:00",
    fullName: "Sourav Ganguly",
    guardianName: "B. K. Ganguly",
    phone: "9832109876",
    email: "sourav.g@gmail.com",
    dob: "2002-04-14",
    gender: "Male",
    address: "Ghoshpukur Bazar, Near Post Office",
    city: "Ghoshpukur",
    pincode: "734434",
    courseId: "course_4w_basic",
    courseTitle: "4-Wheeler Basic Learner's Course",
    vehicleType: "Manual Car (Swift/Alto)",
    preferredSlot: "Morning (8:00 AM - 11:00 AM)",
    learnerLicenseStatus: "Need School assistance to apply",
    idProofType: "Aadhaar Card",
    notes: "I want early morning batch if possible on weekends.",
    status: "New",
    adminRemarks: "Called candidate. Scheduled for batch starting Monday."
  },
  {
    id: "GMTS-2026-102",
    appliedDate: "2026-11-21T14:30:00",
    fullName: "Priyanka Roy",
    guardianName: "Sunil Roy",
    phone: "7001456789",
    email: "priyanka.roy98@yahoo.com",
    dob: "1999-09-22",
    gender: "Female",
    address: "Phansidewa Road, Ghoshpukur",
    city: "Siliguri Sub-div",
    pincode: "734434",
    courseId: "course_combo_vip",
    courseTitle: "VIP Combo (2-Wheeler + 4-Wheeler)",
    vehicleType: "Both 2W + 4W",
    preferredSlot: "Evening (4:00 PM - 7:00 PM)",
    learnerLicenseStatus: "Already have Learner License",
    idProofType: "Voter ID",
    notes: "Prefer female instructor if available.",
    status: "Enrolled",
    adminRemarks: "Assigned to Madam Sunita for Evening 4:30 PM slot. First fee installment received."
  },
  {
    id: "GMTS-2026-103",
    appliedDate: "2026-11-22T16:45:00",
    fullName: "Amitabh Barman",
    guardianName: "Ranjit Barman",
    phone: "9434055123",
    email: "amitabh.b@outlook.com",
    dob: "1995-12-05",
    gender: "Male",
    address: "Bidhannagar Road, Bagdogra Side",
    city: "Ghoshpukur",
    pincode: "734426",
    courseId: "course_4w_pro",
    courseTitle: "4-Wheeler Highway & Advance Driving",
    vehicleType: "Manual Car (Swift/Alto)",
    preferredSlot: "Early Morning (6:00 AM - 8:00 AM)",
    learnerLicenseStatus: "Already have Learner License",
    idProofType: "Aadhaar Card",
    notes: "Highway driving practice needed specifically.",
    status: "Contacted",
    adminRemarks: "Trial drive confirmed for tomorrow at 7:00 AM."
  }
];

// Admin Credentials
const defaultAuth = {
  username: "admin",
  password: "admin123",
  schoolTitle: "Ghoshpukur Motor Training School"
};

// Storage Service Object
const GMTS_DB = {
  // Initialize storage if empty
  init: function() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SLIDES)) {
      localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(defaultSlides));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(defaultGallery));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(defaultApplications));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(defaultAuth));
    }
  },

  // Settings
  getSettings: function() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  },
  saveSettings: function(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // Slides (Auto-slideable pictures)
  getSlides: function(onlyVisible = false) {
    this.init();
    try {
      const slides = JSON.parse(localStorage.getItem(STORAGE_KEYS.SLIDES)) || defaultSlides;
      if (onlyVisible) {
        return slides.filter(s => s.isVisible !== false);
      }
      return slides;
    } catch (e) {
      return defaultSlides;
    }
  },
  saveSlides: function(slides) {
    localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
    return slides;
  },
  addSlide: function(slide) {
    const slides = this.getSlides();
    slide.id = 'slide_' + Date.now();
    if (slide.isVisible === undefined) slide.isVisible = true;
    slides.push(slide);
    this.saveSlides(slides);
    return slide;
  },
  updateSlide: function(id, updatedFields) {
    const slides = this.getSlides();
    const index = slides.findIndex(s => s.id === id);
    if (index !== -1) {
      slides[index] = { ...slides[index], ...updatedFields };
      this.saveSlides(slides);
      return slides[index];
    }
    return null;
  },
  toggleSlideVisibility: function(id) {
    const slides = this.getSlides();
    const slide = slides.find(s => s.id === id);
    if (slide) {
      slide.isVisible = !slide.isVisible;
      this.saveSlides(slides);
      return slide.isVisible;
    }
    return null;
  },
  deleteSlide: function(id) {
    let slides = this.getSlides();
    slides = slides.filter(s => s.id !== id);
    this.saveSlides(slides);
    return true;
  },

  // Courses
  getCourses: function(onlyVisible = false) {
    this.init();
    try {
      const courses = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES)) || defaultCourses;
      if (onlyVisible) {
        return courses.filter(c => c.isVisible !== false);
      }
      return courses;
    } catch (e) {
      return defaultCourses;
    }
  },
  saveCourses: function(courses) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    return courses;
  },
  addCourse: function(course) {
    const courses = this.getCourses();
    course.id = 'course_' + Date.now();
    if (course.isVisible === undefined) course.isVisible = true;
    courses.push(course);
    this.saveCourses(courses);
    return course;
  },
  updateCourse: function(id, updatedFields) {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updatedFields };
      this.saveCourses(courses);
      return courses[index];
    }
    return null;
  },
  toggleCourseVisibility: function(id) {
    const courses = this.getCourses();
    const course = courses.find(c => c.id === id);
    if (course) {
      course.isVisible = !course.isVisible;
      this.saveCourses(courses);
      return course.isVisible;
    }
    return null;
  },
  deleteCourse: function(id) {
    let courses = this.getCourses();
    courses = courses.filter(c => c.id !== id);
    this.saveCourses(courses);
    return true;
  },

  // Gallery
  getGallery: function(onlyVisible = false) {
    this.init();
    try {
      const gallery = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY)) || defaultGallery;
      if (onlyVisible) {
        return gallery.filter(g => g.isVisible !== false);
      }
      return gallery;
    } catch (e) {
      return defaultGallery;
    }
  },
  saveGallery: function(gallery) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  },
  addGalleryItem: function(item) {
    const gallery = this.getGallery();
    item.id = 'gal_' + Date.now();
    if (item.isVisible === undefined) item.isVisible = true;
    gallery.unshift(item); // Add newest on top
    this.saveGallery(gallery);
    return item;
  },
  updateGalleryItem: function(id, updatedFields) {
    const gallery = this.getGallery();
    const index = gallery.findIndex(g => g.id === id);
    if (index !== -1) {
      gallery[index] = { ...gallery[index], ...updatedFields };
      this.saveGallery(gallery);
      return gallery[index];
    }
    return null;
  },
  toggleGalleryVisibility: function(id) {
    const gallery = this.getGallery();
    const item = gallery.find(g => g.id === id);
    if (item) {
      item.isVisible = !item.isVisible;
      this.saveGallery(gallery);
      return item.isVisible;
    }
    return null;
  },
  deleteGalleryItem: function(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    this.saveGallery(gallery);
    return true;
  },

  // Applications
  getApplications: function() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || defaultApplications;
    } catch (e) {
      return defaultApplications;
    }
  },
  saveApplications: function(apps) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return apps;
  },
  addApplication: function(formData) {
    const apps = this.getApplications();
    const now = new Date();
    const appNumber = (apps.length + 101).toString().padStart(3, '0');
    const newApp = {
      id: `GMTS-${now.getFullYear()}-${appNumber}`,
      appliedDate: now.toISOString(),
      status: 'New',
      adminRemarks: '',
      ...formData
    };
    apps.unshift(newApp); // Add to beginning
    this.saveApplications(apps);
    return newApp;
  },
  updateApplicationStatus: function(id, status, remarks) {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === id);
    if (app) {
      app.status = status;
      if (remarks !== undefined) app.adminRemarks = remarks;
      this.saveApplications(apps);
      return app;
    }
    return null;
  },
  deleteApplication: function(id) {
    let apps = this.getApplications();
    apps = apps.filter(a => a.id !== id);
    this.saveApplications(apps);
    return true;
  },

  // Authentication
  getAuth: function() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || defaultAuth;
    } catch (e) {
      return defaultAuth;
    }
  },
  verifyCredentials: function(username, password) {
    const auth = this.getAuth();
    return auth.username === username.trim() && auth.password === password;
  },
  updateAuth: function(newUsername, newPassword) {
    const auth = this.getAuth();
    auth.username = newUsername.trim();
    if (newPassword) auth.password = newPassword;
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    return true;
  },

  // Reset to default data
  resetDefaults: function() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(defaultSlides));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(defaultGallery));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(defaultApplications));
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(defaultAuth));
    return true;
  },

  // Export all database
  exportDatabaseJSON: function() {
    return JSON.stringify({
      settings: this.getSettings(),
      slides: this.getSlides(),
      courses: this.getCourses(),
      gallery: this.getGallery(),
      applications: this.getApplications(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  },

  // Import database
  importDatabaseJSON: function(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.slides) localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(data.slides));
      if (data.courses) localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(data.courses));
      if (data.gallery) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
      if (data.applications) localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(data.applications));
      return true;
    } catch (e) {
      console.error("Invalid database JSON import", e);
      return false;
    }
  }
};

// Auto initialize on load
GMTS_DB.init();
