/**
 * Janudaya Kavinda Wijethunga - Professional Portfolio
 * Pure Modern Vanilla JavaScript (ES6+)
 * Modules: Theme Toggle, Navigation, Typewriter, Project Filter, Modal Lightbox,
 *          Stat Counters, Skill Bars, Form Validation, and Toast Feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initTheme();
  initNavigation();
  initTypewriter();
  initAnimatedCounters();
  initSkillBars();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initDynamicYear();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode with localStorage)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('janudaya_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme (default to dark if not set)
  const initialTheme = storedTheme ? storedTheme : (prefersDark ? 'dark' : 'dark');
  document.documentElement.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('janudaya_portfolio_theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Navigation, Sticky Header & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header elevation shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Scroll Spy using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. Dynamic Typewriter Effect for Hero
   ========================================================================== */
function initTypewriter() {
  const typewriterTarget = document.getElementById('typewriter-text');
  if (!typewriterTarget) return;

  const roles = [
    'Software Engineer',
    'Full-Stack Developer (React & Laravel)',
    'Mobile App Developer (React Native & Android)',
    'Creative Video Editor (Adobe Premiere Pro)',
    'IoT & Embedded Systems Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 85;
  const deletingSpeed = 45;
  const pauseDuration = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delta = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delta = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delta = 400;
    }

    setTimeout(type, delta);
  }

  type();
}

/* ==========================================================================
   4. Animated Stat Counters on Viewport Scroll
   ========================================================================== */
function initAnimatedCounters() {
  const statsContainer = document.querySelector('.hero-stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statsContainer || statNumbers.length === 0) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1600;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out cubic
            const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));

            el.textContent = `${currentCount}${suffix}`;

            if (frame === totalFrames) {
              clearInterval(counter);
              el.textContent = `${target}${suffix}`;
            }
          }, frameDuration);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsContainer);
}

/* ==========================================================================
   5. Interactive Skill Progress Bars
   ========================================================================== */
function initSkillBars() {
  const skillsSection = document.getElementById('skills');
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillsSection || skillBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const percent = bar.getAttribute('data-percentage') || '85%';
          bar.style.width = percent;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillsSection);
}

/* ==========================================================================
   6. Project Category Filter
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Interactive Project Case Study Lightbox Modal
   ========================================================================== */
const projectDatabase = {
  'patient-management': {
    title: 'Patient Management System (Real Client)',
    category: 'Full-Stack Web Application',
    client: 'Private Healthcare Clinic Client',
    role: 'Lead Full-Stack Developer',
    timeline: 'In Production Development (2026)',
    image: './assets/images/project-1.svg',
    summary: 'A secure, scalable clinical management system engineered for a private healthcare clinic. Designed to replace legacy paper logs with role-isolated medical registries, appointment scheduling, and automated clinical summaries.',
    architecture: 'React 18 frontend with component-driven state architecture, Laravel RESTful API backend, and MySQL database with optimized relational indexes.',
    features: [
      'Role-based access control (Doctor, Receptionist, Lab Specialist, Admin)',
      'Real-time appointment scheduler with conflict detection',
      'Electronic Health Records (EHR) with medical history tracking and prescription logs',
      'Encrypted diagnostic document uploads and PDF report generator',
      'Responsive design allowing doctor access via tablets in clinical rooms'
    ],
    tech: ['React.js', 'Laravel 10', 'PHP 8.2', 'MySQL', 'REST API', 'Tailwind CSS', 'JWT Auth'],
    githubUrl: 'https://github.com/Janudaya'
  },

  'react-native-chat': {
    title: 'React Native Realtime Chat Engine',
    category: 'Mobile Application',
    client: 'Open Source / Self-Initiated Project',
    role: 'Mobile Software Engineer',
    timeline: 'Published on GitHub',
    image: './assets/images/project-2.svg',
    summary: 'A high-performance cross-platform mobile messaging app designed for seamless real-time communication across Android and iOS devices, featuring end-to-end sync and offline message queues.',
    architecture: 'React Native with React Navigation and Firebase Realtime Database. Incorporates AsyncStorage for optimistic local UI caching.',
    features: [
      'Sub-50ms instant real-time message synchronization via Firebase listeners',
      'Presence detection showing live online/offline user states and typing indicators',
      'Local caching for fluid offline reading and auto-reconnection synchronization',
      'Interactive media attachments and push notification support',
      'Clean modular architectural pattern for scalable channel management'
    ],
    tech: ['React Native', 'Firebase Realtime DB', 'JavaScript (ES6+)', 'Mobile Sockets', 'AsyncStorage'],
    githubUrl: 'https://github.com/Janudaya'
  },

  'robot-car': {
    title: 'Obstacle-Avoiding Autonomous Robot Car',
    category: 'Embedded Systems & IoT Prototyping',
    client: 'Robotics Engineering Demonstration',
    role: 'Embedded Firmware & Hardware Engineer',
    timeline: 'Hardware Prototyping Complete',
    image: './assets/images/project-3.svg',
    summary: 'A fully autonomous robotic vehicular system capable of real-time spatial navigation and obstacle collision prevention using sensor fusion and microcontroller logic.',
    architecture: 'Arduino microcontroller, HC-SR04 ultrasonic transducer matrix, dual L298N H-bridge motor drivers, and low-level C++ firmware.',
    features: [
      'Autonomous spatial distance calculation via ultrasonic sonar pings',
      'Proactive obstacle detection and intelligent 3-way avoidance routing algorithm',
      'PWM-driven differential steering for smooth motor acceleration and decelerations',
      'Real-time serial telemetry diagnostics transmitting obstacle proximity',
      'Custom power distribution regulating dual Li-ion battery supplies'
    ],
    tech: ['Arduino ATmega328', 'Embedded C++', 'Ultrasonic Sensors', 'Hardware PWM', 'IoT Prototyping'],
    githubUrl: 'https://github.com/Janudaya'
  },

  'petcare-app': {
    title: 'PetCare Android Application',
    category: 'Native Mobile Application',
    client: 'Academic Capstone Project',
    role: 'Android Developer',
    timeline: 'Completed',
    image: './assets/images/project-4.svg',
    summary: 'An intelligent companion application for pet owners that consolidates vaccination schedules, activity tracking, and veterinary location lookup into an intuitive mobile interface.',
    architecture: 'Native Android Studio project in Java, integrated with Google Maps SDK and Firebase Cloud Firestore.',
    features: [
      'Interactive Google Maps API integration locating nearby 24/7 emergency veterinary clinics',
      'Device sensor integration (accelerometer step detection) to estimate pet walking distances',
      'Automated vaccination reminder notification engine with calendar sync',
      'Cloud profile synchronization for multi-pet medical and dietary histories',
      'Offline-first SQLite caching for rapid clinic phone directory access'
    ],
    tech: ['Java', 'Android Studio', 'Google Maps API', 'Firebase', 'Device Sensors', 'SQLite'],
    githubUrl: 'https://github.com/Janudaya'
  },

  'student-management': {
    title: 'Enterprise Student Management System',
    category: 'Desktop Software Application',
    client: 'University Faculty Administration',
    role: 'Desktop Software Engineer',
    timeline: 'Completed',
    image: './assets/images/project-5.svg',
    summary: 'A desktop administrative platform created to manage thousands of student academic records, course registrations, and automated grading reports with enterprise data integrity.',
    architecture: 'Java SE with JavaFX / Swing UI, utilizing JDBC connection pooling and MySQL Enterprise relational database.',
    features: [
      'Multi-tiered role authentication with encrypted credential storage',
      'Dynamic GPA calculation engine and automated transcript PDF generation',
      'Advanced multi-parameter search, student filtering, and CSV export utilities',
      'Transaction-safe database queries ensuring zero records corruption during enrollment rushes',
      'Intuitive administrative dashboard with visual enrollment statistics'
    ],
    tech: ['Java SE', 'JavaFX / Swing', 'MySQL Enterprise', 'JDBC', 'OOP Architecture', 'Reporting API'],
    githubUrl: 'https://github.com/Janudaya'
  },

  'ecommerce-web': {
    title: 'Full-Featured E-Commerce Web Platforms',
    category: 'Web Platforms',
    client: 'Dual Web Engineering Architectures',
    role: 'Full-Stack Developer',
    timeline: 'Completed',
    image: './assets/images/project-6.svg',
    summary: 'Designed and deployed two comprehensive e-commerce architectures: one built on modern PHP MVC principles, and another on enterprise Java EE servlets, showcasing architectural versatility.',
    architecture: 'PHP 8 MVC / Java EE Servlets, MySQL relational schema with 3NF normalization, and responsive JavaScript frontend.',
    features: [
      'Interactive product filtering by price, brand, categories, and customer ratings',
      'Persistent shopping cart engine supporting session restore across page reloads',
      'Secure checkout simulation with order confirmation email dispatches',
      'Admin inventory management portal with image uploading and stock alerts',
      'Fully responsive UI adapting seamlessly from desktop widescreen to mobile screens'
    ],
    tech: ['PHP MVC', 'Java EE', 'MySQL', 'JavaScript', 'CSS3 Flexbox/Grid', 'HTML5'],
    githubUrl: 'https://github.com/Janudaya'
  },

  'unity-game': {
    title: 'Interactive 2D/3D Game Prototype',
    category: 'Game Engineering',
    client: 'Independent Creative Project',
    role: 'Game Programmer & Asset Integrator',
    timeline: 'Completed',
    image: './assets/images/project-7.svg',
    summary: 'An engaging 2D/3D physics-based game developed using Unity Engine and C#, featuring responsive player controller physics, particle effects, and dynamic difficulty scaling.',
    architecture: 'Unity Engine with modular C# scripts following event-driven architecture and Unity Physics engine integration.',
    features: [
      'Precise physics simulation for character locomotion, jumping, and collision detection',
      'Dynamic camera tracking system with smooth damping and screen-shake feedback',
      'Particle visual effects for score combos, power-ups, and environmental impacts',
      'State machine driven enemy AI behavior (patrolling, alerting, pursuing)',
      'Spatial 3D audio mastering with positional sound cues'
    ],
    tech: ['Unity Engine', 'C#', 'Game Physics', 'Particle Systems', 'Vector Mathematics'],
    githubUrl: 'https://github.com/Janudaya'
  }
};

function initProjectModal() {
  const modalBackdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalTitle = document.getElementById('modal-title');
  const modalType = document.getElementById('modal-type');
  const modalClient = document.getElementById('modal-client');
  const modalRole = document.getElementById('modal-role');
  const modalTimeline = document.getElementById('modal-timeline');
  const modalSummary = document.getElementById('modal-summary');
  const modalArch = document.getElementById('modal-architecture');
  const modalFeaturesList = document.getElementById('modal-features');
  const modalTechStack = document.getElementById('modal-tech');
  const modalGithubLink = document.getElementById('modal-github-link');

  if (!modalBackdrop) return;

  function openModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalBadge.textContent = data.category;
    modalTitle.textContent = data.title;
    modalType.textContent = data.category;
    modalClient.textContent = data.client;
    modalRole.textContent = data.role;
    modalTimeline.textContent = data.timeline;
    modalSummary.textContent = data.summary;
    modalArch.textContent = data.architecture;

    // Render features
    modalFeaturesList.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.className = 'modal-feature-item';
      li.innerHTML = `<span class="modal-feature-bullet">✔</span><span>${feat}</span>`;
      modalFeaturesList.appendChild(li);
    });

    // Render tech stack tags
    modalTechStack.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      modalTechStack.appendChild(span);
    });

    modalGithubLink.href = data.githubUrl;

    // Show modal
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind clicks on view detail buttons
  document.querySelectorAll('[data-project-id]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = trigger.getAttribute('data-project-id');
      openModal(pId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Backdrop click to close
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Interactive Contact Form with Validation & Feedback Toast
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const toastContainer = document.getElementById('toast-container');
  if (!form) return;

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="font-size: 1.25rem;">${type === 'success' ? '🚀' : '⚠️'}</span>
      <div>
        <strong style="display:block; font-size: 0.9rem;">${type === 'success' ? 'Transmission Received!' : 'Error'}</strong>
        <span style="font-size: 0.85rem; color: var(--text-secondary);">${message}</span>
      </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function validateInput(input, condition, errorMsg) {
    let errorElem = input.parentElement.querySelector('.form-error-msg');
    if (!condition) {
      input.classList.add('error');
      if (errorElem) errorElem.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('error');
      return true;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isNameValid = validateInput(nameInput, nameInput.value.trim().length >= 2, 'Please enter your name (at least 2 characters).');
    const isEmailValid = validateInput(emailInput, emailRegex.test(emailInput.value.trim()), 'Please enter a valid email address.');
    const isSubjectValid = validateInput(subjectInput, subjectInput.value.trim().length >= 3, 'Please provide a subject line.');
    const isMessageValid = validateInput(messageInput, messageInput.value.trim().length >= 10, 'Message must be at least 10 characters.');

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      // Simulate submission with button state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending message...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();

        showToast(`Thank you, ${nameInput.value || 'friend'}! Your message has been transmitted successfully. Janudaya will reply soon.`);
      }, 1200);
    }
  });

  // Realtime clear errors on input
  [document.getElementById('contact-name'),
   document.getElementById('contact-email'),
   document.getElementById('contact-subject'),
   document.getElementById('contact-message')].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    }
  });
}

/* ==========================================================================
   9. Back to Top Smooth Scroller
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. Dynamic Current Year in Footer
   ========================================================================== */
function initDynamicYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
