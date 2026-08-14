document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     ENABLE JS-DEPENDENT ANIMATIONS
     FIX: only after this class is added does CSS
     start the "hidden until revealed" behavior.
     If this script fails to run at all, content
     simply stays at its CSS default: visible.
     ========================================= */
  document.body.classList.add('js-ready');

  /* =========================================
     NAVBAR: scroll transform + active link
     ========================================= */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    backToTop.classList.toggle('show', window.scrollY > 700);

    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) currentId = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* =========================================
     MOBILE HAMBURGER MENU
     ========================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('mobile-open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('mobile-open');
    });
  });

  /* =========================================
     SMOOTH SCROLL
     ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================
     SCROLL REVEAL ANIMATIONS
     FIX: added a safety-net timeout that force-
     reveals everything if the observer ever
     misses an element, so nothing can stay
     permanently invisible.
     ========================================= */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Safety net: force-reveal anything still hidden after 2.5s
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
      el.classList.add('in-view');
    });
  }, 2500);

  /* =========================================
     ANIMATED COUNTERS
     ========================================= */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  /* =========================================
     MENU CATEGORY FILTERING
     ========================================= */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || filter === category;
        card.classList.toggle('hidden-card', !show);
      });
    });
  });

  /* =========================================
     RESERVATION FORM SUBMISSION
     ========================================= */
  const form = document.getElementById('reservationForm');
  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.classList.add('show');
    form.reset();
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  });

  /* =========================================
     BACK TO TOP
     ========================================= */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================
     FOOTER YEAR
     ========================================= */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* =========================================
     HERO PARTICLE FIELD (canvas)
     ========================================= */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    const count = window.innerWidth < 700 ? 40 : 90;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.4,
      speedY: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? '255,106,61' : '139,92,255'
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.hue}, 0.8)`;
      ctx.fill();
    });
    animationId = requestAnimationFrame(drawParticles);
  }

  function initParticles() {
    resizeCanvas();
    createParticles();
    cancelAnimationFrame(animationId);
    drawParticles();
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    initParticles();
  }

  window.addEventListener('resize', () => {
    if (!prefersReducedMotion) initParticles();
  });

});