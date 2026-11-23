/**
 * Nayan Roy Choudhury - Executive Portfolio Scripts
 * Handles: Typing animation, 3D card tilt, stat counters,
 * timeline filtering, interactive contact form, theme toggling, and sound feedback.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light) with LocalStorage persistence
  // ---------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('nrc_portfolio_theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('nrc_portfolio_theme', newTheme);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Typing Effect for Hero Subtitle
  // ---------------------------------------------------------------------------
  const typingElement = document.getElementById('typingElement');
  const roles = [
    "IT Project Coordinator – Softynex",
    "Software Delivery & Operations Lead",
    "Real Estate Sales & Relations Specialist",
    "Dispatch & Logistics Operations Head"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRole() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of word
      isDeleting = true;
      typingSpeed = 1600;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(typeRole, typingSpeed);
  }

  typeRole();

  // ---------------------------------------------------------------------------
  // 3. Interactive 3D Card Tilt Effect (Hero Profile Card)
  // ---------------------------------------------------------------------------
  const cardWrap = document.getElementById('profileCardWrap');
  const profileCard = document.getElementById('profileCard');

  if (cardWrap && profileCard) {
    cardWrap.addEventListener('mousemove', (e) => {
      const rect = cardWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
      const rotateY = ((x - centerX) / centerX) * 12;

      profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    cardWrap.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Subtle Cursor Follower Glow
  // ---------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Animated Number Counters (Hero Stats)
  // ---------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const countUp = () => {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      const isPercent = stat.textContent.includes('%');
      const isPlus = stat.textContent.includes('+');
      let current = 0;
      const duration = 1800;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target + (isPercent ? '%' : (isPlus ? '+' : ''));
          clearInterval(timer);
        } else {
          stat.textContent = Math.ceil(current) + (isPercent ? '%' : (isPlus ? '+' : ''));
        }
      }, stepTime);
    });
  };

  // Trigger counters with IntersectionObserver
  const statsSection = document.querySelector('.hero-stats-strip');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          countUp();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // ---------------------------------------------------------------------------
  // 6. Experience Timeline Filtering
  // ---------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Header Scroll Shadow & Active Nav Link Spy
  // ---------------------------------------------------------------------------
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id], main[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    // Header scrolled state
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Mobile Navigation Drawer
  // ---------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ---------------------------------------------------------------------------
  // 9. Back To Top Button
  // ---------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 10. Contact Form Submission (Mailto + WhatsApp auto-link launcher)
  // ---------------------------------------------------------------------------
  window.handleFormSubmit = function(event) {
    event.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const phone = document.getElementById('senderPhone').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('subjectSelect').value;
    const message = document.getElementById('messageBody').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return false;
    }

    const toast = document.getElementById('formSuccessToast');
    const toastMsg = document.getElementById('toastMessage');
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Dispatch...';

    // Construct email subject and body
    const emailSubject = encodeURIComponent(`Portfolio Inquiry: ${subject} from ${name}`);
    const emailBody = encodeURIComponent(
      `Hello Nayan,\n\nI reached out via your Portfolio Website.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Topic: ${subject}\n\n` +
      `Message:\n${message}\n\n` +
      `Best regards,\n${name}`
    );

    // Construct WhatsApp message
    const waText = encodeURIComponent(
      `*New Portfolio Inquiry*\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Topic:* ${subject}\n` +
      `*Message:* ${message}`
    );

    setTimeout(() => {
      toast.classList.remove('hidden');
      toastMsg.innerHTML = `Thank you <strong>${name}</strong>! Opening your email client to send to <strong>nayanroychoudhury9@gmail.com</strong>. You can also message Nayan directly on WhatsApp!`;
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Inquiry Ready!';

      // Launch email client
      window.location.href = `mailto:nayanroychoudhury9@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      // Open WhatsApp in a background tab if user prefers WhatsApp
      const openWhatsAppPrompt = confirm("Would you also like to open WhatsApp to send this message directly to Nayan (+91 8768081380)?");
      if (openWhatsAppPrompt) {
        window.open(`https://wa.me/918768081380?text=${waText}`, '_blank');
      }
    }, 700);

    return false;
  };

  // ---------------------------------------------------------------------------
  // 11. Language Circle Animation on Scroll
  // ---------------------------------------------------------------------------
  const langCircles = document.querySelectorAll('.lang-circle-progress');
  if (langCircles.length > 0) {
    const langObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const circle = entry.target.querySelector('.fg-circle');
          const percent = entry.target.getAttribute('data-percent');
          if (circle && percent) {
            const circumference = 264; // 2 * pi * 42 ~= 263.89
            const offset = circumference - (circumference * percent / 100);
            circle.style.strokeDashoffset = offset;
          }
        }
      });
    }, { threshold: 0.4 });

    langCircles.forEach(c => langObserver.observe(c));
  }

});
