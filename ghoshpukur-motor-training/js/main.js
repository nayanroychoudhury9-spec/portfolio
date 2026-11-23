/**
 * Ghoshpukur Motor Training School - Main Public Website Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initSiteSettings();
  initHeroSlider();
  initCourses();
  initAdmissionForm();
  initGallery();
  initFaqAccordion();
  initMobileMenu();
  initScrollNav();
});

/* ==========================================================================
   1. Site Settings & Dynamic Text Injection
   ========================================================================== */
function initSiteSettings() {
  const settings = GMTS_DB.getSettings();
  
  // Update contact links and text
  document.querySelectorAll('.school-name-text').forEach(el => el.textContent = settings.schoolName);
  document.querySelectorAll('.school-phone-text').forEach(el => el.textContent = settings.phone);
  document.querySelectorAll('.school-phone-link').forEach(el => el.href = `tel:${settings.phone.replace(/[^0-9+]/g, '')}`);
  document.querySelectorAll('.school-alt-phone-link').forEach(el => el.href = `tel:${settings.altPhone.replace(/[^0-9+]/g, '')}`);
  document.querySelectorAll('.school-whatsapp-link').forEach(el => el.href = `https://wa.me/${settings.whatsapp}?text=Hello%20Ghoshpukur%20Motor%20Training%20School,%20I%20am%20interested%20in%20learning%20driving.%20Please%20share%20course%20details.`);
  document.querySelectorAll('.school-email-text').forEach(el => el.textContent = settings.email);
  document.querySelectorAll('.school-email-link').forEach(el => el.href = `mailto:${settings.email}`);
  document.querySelectorAll('.school-address-text').forEach(el => el.textContent = settings.address);
  document.querySelectorAll('.school-hours-text').forEach(el => el.textContent = settings.hours);
  
  // Ticker announcement
  const tickerEl = document.getElementById('announcementText');
  if (tickerEl) {
    tickerEl.textContent = settings.announcement;
  }
}

/* ==========================================================================
   2. Hero Auto-Slideable Carousel
   ========================================================================== */
let sliderInterval = null;
let currentSlideIndex = 0;
let visibleSlides = [];

function initHeroSlider() {
  const container = document.getElementById('carouselSlidesContainer');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  if (!container) return;

  visibleSlides = GMTS_DB.getSlides(true);
  if (visibleSlides.length === 0) {
    visibleSlides = GMTS_DB.getSlides(); // fallback if all hidden
  }

  container.innerHTML = '';
  if (indicatorsContainer) indicatorsContainer.innerHTML = '';

  visibleSlides.forEach((slide, index) => {
    // Create Slide
    const slideDiv = document.createElement('div');
    slideDiv.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
    slideDiv.dataset.index = index;

    slideDiv.innerHTML = `
      <div class="slide-image-wrapper">
        <img src="${slide.imageUrl}" alt="${slide.title}" class="slide-img" onerror="this.src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80'">
        <div class="slide-overlay"></div>
      </div>
      <div class="container slide-content-container">
        <div class="slide-content">
          ${slide.badge ? `<span class="slide-badge"><i class="fa-solid fa-certificate"></i> ${escapeHtml(slide.badge)}</span>` : ''}
          <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
          <p class="slide-subtitle">${escapeHtml(slide.subtitle)}</p>
          <div class="slide-actions">
            ${slide.ctaText ? `<a href="${slide.ctaLink || '#admission-form'}" class="btn btn-primary btn-lg"><i class="fa-solid fa-steering-wheel"></i> ${escapeHtml(slide.ctaText)}</a>` : ''}
            ${slide.secondaryCtaText ? `<a href="${slide.secondaryCtaLink || '#courses'}" class="btn btn-outline btn-lg" style="color:white; border-color:rgba(255,255,255,0.4);"><i class="fa-solid fa-list-check"></i> ${escapeHtml(slide.secondaryCtaText)}</a>` : ''}
          </div>
        </div>
      </div>
    `;
    container.appendChild(slideDiv);

    // Create Indicator
    if (indicatorsContainer) {
      const dot = document.createElement('div');
      dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
      dot.dataset.index = index;
      dot.addEventListener('click', () => goToSlide(index));
      indicatorsContainer.appendChild(dot);
    }
  });

  // Slider buttons
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => prevSlide());
  if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());

  // Auto sliding
  startSliderAutoPlay();

  // Pause on hover
  const heroSection = document.getElementById('heroSliderSection');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    heroSection.addEventListener('mouseleave', () => startSliderAutoPlay());
  }
}

function startSliderAutoPlay() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.indicator-dot');
  if (!slides.length) return;

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  currentSlideIndex = (index + slides.length) % slides.length;
  slides[currentSlideIndex].classList.add('active');
  if (dots[currentSlideIndex]) {
    dots[currentSlideIndex].classList.add('active');
  }
}

function nextSlide() {
  goToSlide(currentSlideIndex + 1);
}

function prevSlide() {
  goToSlide(currentSlideIndex - 1);
}

/* ==========================================================================
   3. Course Details Section
   ========================================================================== */
function initCourses() {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  const courses = GMTS_DB.getCourses(true);
  renderCoursesList(courses);

  // Setup category filter buttons
  const filterBtns = document.querySelectorAll('.course-filter-bar .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const category = e.target.dataset.category;

      if (category === 'all') {
        renderCoursesList(courses);
      } else {
        const filtered = courses.filter(c => c.category === category);
        renderCoursesList(filtered);
      }
    });
  });
}

function renderCoursesList(courses) {
  const grid = document.getElementById('coursesGrid');
  if (!grid) return;

  if (courses.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 12px;">
        <i class="fa-solid fa-info-circle" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 1rem;"></i>
        <h3 style="color:#475569;">No courses currently available in this category</h3>
        <p style="color:#64748b;">Please select another tab or contact Ghoshpukur Motor Training School directly.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = courses.map(course => {
    const isFeatured = course.badge === 'Most Popular' || course.badge === 'Best for Beginners';
    const featuresList = (course.features || []).map(f => `
      <li><i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(f)}</span></li>
    `).join('');

    return `
      <div class="course-card ${isFeatured ? 'featured' : ''}" data-course-id="${course.id}">
        <div>
          ${course.badge ? `<div class="course-badge-corner"><span class="badge badge-${course.badgeColor || 'primary'}">${escapeHtml(course.badge)}</span></div>` : ''}
          <div class="course-category-tag"><i class="fa-solid fa-car-side"></i> ${escapeHtml(course.categoryName || course.category)}</div>
          <h3 class="course-title">${escapeHtml(course.title)}</h3>
          <p class="course-desc">${escapeHtml(course.description || '')}</p>
          
          <div class="course-meta-box">
            <div class="meta-item"><i class="fa-solid fa-clock"></i> <span>${escapeHtml(course.duration)}</span></div>
            <div class="meta-item"><i class="fa-solid fa-car"></i> <span>${escapeHtml(course.vehicle || 'Dual Control Car')}</span></div>
          </div>

          <ul class="course-features-list">
            ${featuresList}
          </ul>
        </div>

        <div class="course-pricing-action">
          <div class="course-price-wrap">
            ${course.originalPrice ? `<span class="price-original">₹${course.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            <span class="price-current">₹${Number(course.price).toLocaleString('en-IN')} <span>/ course</span></span>
          </div>
          <button class="btn btn-primary btn-sm enroll-course-btn" data-id="${course.id}" data-title="${escapeHtml(course.title)}">
            Enroll Now <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach enroll click handlers
  document.querySelectorAll('.enroll-course-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = e.currentTarget.dataset.id;
      const courseTitle = e.currentTarget.dataset.title;
      selectCourseInForm(courseId, courseTitle);
    });
  });
}

function selectCourseInForm(courseId, courseTitle) {
  const courseSelect = document.getElementById('applicantCourse');
  if (courseSelect && courseId) {
    courseSelect.value = courseId;
    courseSelect.dispatchEvent(new Event('change'));
  }
  openAdmissionModal();
}

function openAdmissionModal() {
  const modal = document.getElementById('admissionModal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeAdmissionModal() {
  const modal = document.getElementById('admissionModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

/* ==========================================================================
   4. Candidate Admission Form Handling
   ========================================================================== */
function initAdmissionForm() {
  const form = document.getElementById('motorTrainingAdmissionForm');
  const courseSelect = document.getElementById('applicantCourse');
  if (!form || !courseSelect) return;

  // Populate course dropdown dynamically
  const courses = GMTS_DB.getCourses(true);
  courseSelect.innerHTML = '<option value="">-- Select Training Course --</option>';
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.title} — ₹${Number(c.price).toLocaleString('en-IN')} (${c.duration})`;
    courseSelect.appendChild(opt);
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Extract form data
    const fullName = document.getElementById('applicantName').value.trim();
    const guardianName = document.getElementById('applicantGuardian').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    const email = document.getElementById('applicantEmail').value.trim();
    const dob = document.getElementById('applicantDob').value;
    const gender = document.querySelector('input[name="applicantGender"]:checked')?.value || 'Not Specified';
    const address = document.getElementById('applicantAddress').value.trim();
    const city = document.getElementById('applicantCity').value.trim() || 'Ghoshpukur';
    const pincode = document.getElementById('applicantPincode').value.trim();
    const courseId = courseSelect.value;
    const selectedCourse = courses.find(c => c.id === courseId);
    const vehicleType = document.getElementById('applicantVehicleType').value;
    const preferredSlot = document.getElementById('applicantSlot').value;
    const learnerLicenseStatus = document.getElementById('applicantLicenseStatus').value;
    const idProofType = document.getElementById('applicantIdProof').value;
    const notes = document.getElementById('applicantNotes').value.trim();

    // Validation
    if (!fullName || !phone || !courseId || !dob || !address) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Save to Database
    const newApplication = GMTS_DB.addApplication({
      fullName,
      guardianName,
      phone,
      email,
      dob,
      gender,
      address,
      city,
      pincode,
      courseId,
      courseTitle: selectedCourse ? selectedCourse.title : 'General Training',
      coursePrice: selectedCourse ? selectedCourse.price : 0,
      vehicleType,
      preferredSlot,
      learnerLicenseStatus,
      idProofType,
      notes
    });

    // Reset Form
    form.reset();

    // Close admission form popup screen
    closeAdmissionModal();

    // Show Success Modal with printable receipt
    showAdmissionSuccessModal(newApplication);
  });
}

function showAdmissionSuccessModal(app) {
  const modal = document.getElementById('admissionReceiptModal');
  const detailsContainer = document.getElementById('receiptDetails');
  if (!modal || !detailsContainer) return;

  const appliedDateFormatted = new Date(app.appliedDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  detailsContainer.innerHTML = `
    <div class="receipt-box" id="printableReceiptCard">
      <div class="receipt-header">
        <h4 style="color:var(--primary); font-size:1.2rem; margin-bottom:0.25rem;">GHOSHPUKUR MOTOR TRAINING SCHOOL</h4>
        <p style="font-size:0.8rem; color:#64748b;">Govt. Approved Driving Training School | Ghoshpukur, Siliguri</p>
        <span class="badge badge-success" style="margin-top:0.5rem;"><i class="fa-solid fa-check"></i> Admission Form Received</span>
      </div>

      <div class="receipt-row">
        <span style="color:#64748b;">Application Ref No:</span>
        <strong style="color:var(--accent); font-family:monospace; font-size:1rem;">${app.id}</strong>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Date & Time:</span>
        <span>${appliedDateFormatted}</span>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Candidate Name:</span>
        <strong>${escapeHtml(app.fullName)}</strong>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Contact Mobile:</span>
        <span>${escapeHtml(app.phone)}</span>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Selected Course:</span>
        <strong style="color:var(--primary-dark);">${escapeHtml(app.courseTitle)}</strong>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Vehicle Category:</span>
        <span>${escapeHtml(app.vehicleType)}</span>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Preferred Time Slot:</span>
        <span>${escapeHtml(app.preferredSlot)}</span>
      </div>
      <div class="receipt-row">
        <span style="color:#64748b;">Learner License:</span>
        <span>${escapeHtml(app.learnerLicenseStatus)}</span>
      </div>
      <div class="receipt-row total">
        <span>Estimated Course Fee:</span>
        <span>₹${Number(app.coursePrice || 0).toLocaleString('en-IN')}</span>
      </div>
    </div>
    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:0.85rem; font-size:0.85rem; color:#166534; margin-bottom:1rem;">
      <i class="fa-solid fa-circle-check"></i> Thank you! Our Ghoshpukur training coordinator will contact you shortly to schedule your batch start date and document verification.
    </div>

    <div style="text-align:center; margin-top:1.25rem;">
      <button type="button" class="btn btn-secondary modal-close-btn" id="receiptCardCloseBtn" style="background:#475569; color:white; padding:0.65rem 2rem; border-radius:8px; font-weight:600; font-size:0.95rem;">
        <i class="fa-solid fa-xmark"></i> Close Popup Window
      </button>
    </div>
  `;

  // Setup WhatsApp share button
  const waBtn = document.getElementById('receiptWhatsAppBtn');
  if (waBtn) {
    const textMsg = encodeURIComponent(
      `Hello Ghoshpukur Motor Training School, I have just submitted my admission application!\n` +
      `Application ID: ${app.id}\n` +
      `Name: ${app.fullName}\n` +
      `Course: ${app.courseTitle}\n` +
      `Slot: ${app.preferredSlot}`
    );
    waBtn.href = `https://wa.me/919832012345?text=${textMsg}`;
  }

  // Explicit close handlers for receipt buttons
  const receiptCloseBtn = document.getElementById('receiptCloseBtn');
  if (receiptCloseBtn) {
    receiptCloseBtn.onclick = () => modal.classList.remove('open');
  }
  const receiptCardCloseBtn = document.getElementById('receiptCardCloseBtn');
  if (receiptCardCloseBtn) {
    receiptCardCloseBtn.onclick = () => modal.classList.remove('open');
  }

  // Open modal
  modal.classList.add('open');
}

/* ==========================================================================
   5. Gallery Section & Lightbox
   ========================================================================== */
function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const galleryItems = GMTS_DB.getGallery(true);
  renderGalleryList(galleryItems);

  // Category filter
  const filterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.dataset.category;
      if (cat === 'all') {
        renderGalleryList(galleryItems);
      } else {
        const filtered = galleryItems.filter(g => g.category === cat);
        renderGalleryList(filtered);
      }
    });
  });
}

function renderGalleryList(items) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2.5rem; color: #64748b;">No photos available in this category.</div>`;
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="gallery-card" data-img="${item.imageUrl}" data-title="${escapeHtml(item.title)}" data-caption="${escapeHtml(item.caption || '')}">
      <img src="${item.imageUrl}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'">
      <div class="gallery-overlay">
        <span class="gallery-tag">${escapeHtml(item.categoryName || item.category)}</span>
        <h4 class="gallery-title">${escapeHtml(item.title)}</h4>
        <p class="gallery-caption">${escapeHtml(item.caption || '')}</p>
      </div>
    </div>
  `).join('');

  // Attach Lightbox click
  grid.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card.dataset.img, card.dataset.title, card.dataset.caption);
    });
  });
}

function openLightbox(imgUrl, title, caption) {
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  const capEl = document.getElementById('lightboxCaption');
  if (!modal || !imgEl) return;

  imgEl.src = imgUrl;
  if (capEl) capEl.innerHTML = `<strong>${title}</strong><br><span style="font-size:0.9rem; opacity:0.85;">${caption}</span>`;
  modal.classList.add('open');
}

/* ==========================================================================
   6. FAQ Accordion & Mobile Menu
   ========================================================================== */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isActive = parent.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('mainNavMenu');
  if (!btn || !navMenu) return;

  btn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}

function initScrollNav() {
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
      if (window.scrollY > 40) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
      }
    }
  });

  // Global click listener for opening admission modal
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-admission-modal-btn, a[href="#admissionModal"], a[href="#admission-form"]');
    if (trigger) {
      if (!trigger.closest('.admin-portal-modal')) {
        e.preventDefault();
        openAdmissionModal();
      }
    }

    // Global modal close button handler
    const closeBtn = e.target.closest('.modal-close-btn');
    if (closeBtn) {
      const parentModal = closeBtn.closest('.modal-backdrop');
      if (parentModal) {
        parentModal.classList.remove('open');
      }
    }
  });

  // Close modals when clicking directly on backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
}

// Utility: HTML escape
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
