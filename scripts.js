document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const progressBar = document.getElementById('progressBar');
  const cursor = document.getElementById('cursor');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const heroTitle = document.getElementById('heroTitle');
  const heroTagline = document.getElementById('heroTagline');
  const heroSubline = document.getElementById('heroSubline');
  const heroActions = document.getElementById('heroActions');

  const revealItems = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (nav) nav.classList.toggle('is-scrolled', scrollTop > 20);
  }

  function setActiveNav() {
    let current = sections[0]?.id || '';
    sections.forEach((section) => {
      const offset = section.offsetTop - 140;
      if (window.scrollY >= offset) {
        current = section.id;
      }
    });
    navAnchors.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === `#${current}`);
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target.querySelector('.value');
        if (!el || el.dataset.animated === 'true') return;
        const target = Number(el.dataset.target || 0);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = `${value}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
          else el.dataset.animated = 'true';
        };
        requestAnimationFrame(step);
        statObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach((card) => statObserver.observe(card));

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    setActiveNav();
  });

  window.addEventListener('load', () => {
    if (heroTitle) heroTitle.classList.add('is-ready');
    if (heroTagline) heroTagline.classList.add('is-ready');
    if (heroSubline) heroSubline.classList.add('is-ready');
    if (heroActions) heroActions.classList.add('is-ready');
    updateScrollProgress();
    setActiveNav();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.length > 1) {
        event.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
      }
    });
  });

  if (menuToggle) menuToggle.addEventListener('click', () => {
    if (navLinks) navLinks.classList.toggle('is-open');
  });

  document.addEventListener('click', (event) => {
    if (navLinks && menuToggle && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove('is-open');
    }
  });

  document.addEventListener('mousemove', (event) => {
    if (cursor) {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }
  });

  document.querySelectorAll('a, button, .project-card, .skill-card, input, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('is-hovered'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('is-hovered'));
  });

  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = form?.querySelector('.submit-btn');
  const submitLabel = form?.querySelector('.btn-label');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (submitBtn) submitBtn.classList.add('is-loading');
      if (submitLabel) submitLabel.innerHTML = '<span class="spinner"></span>';
      if (formStatus) formStatus.textContent = 'Sending…';
      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        if (submitLabel) submitLabel.textContent = 'Send Message';
        if (formStatus) formStatus.textContent = 'Thanks — your message has been queued for follow-up.';
        form.reset();
      }, 1200);
    });
  }
});
