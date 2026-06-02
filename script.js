/**
 * script.js  —  Nirere Evangeline Portfolio
 * Single-page application: index.html
 * Sections: #home | #about | #projects | #skills | #contact
 */

(function () {
  'use strict';

  /* ================================================== */
  /* 1. LOADING SCREEN                                   */
  /* ================================================== */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 1800);
  });

  /* ================================================== */
  /* 2. NAVBAR — scroll effect + active link + mobile   */
  /* ================================================== */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.querySelector('.nav-links');

  // Frosted background on scroll
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  });

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Highlight nav link matching current scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // Inject hamburger animation styles
  const hamStyle = document.createElement('style');
  hamStyle.textContent = `
    .hamburger.active span:nth-child(1){transform:translateY(7px) rotate(45deg);}
    .hamburger.active span:nth-child(2){opacity:0;}
    .hamburger.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
    .hamburger span{display:block;transition:transform .3s ease,opacity .3s ease;}
  `;
  document.head.appendChild(hamStyle);

  /* ================================================== */
  /* 3. SMOOTH SCROLL for anchor links                  */
  /* ================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ================================================== */
  /* 4. SCROLL REVEAL — IntersectionObserver            */
  /* ================================================== */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Stagger delays for grid children
  function stagger(containerSel, itemSel) {
    document.querySelectorAll(containerSel).forEach(c => {
      c.querySelectorAll(itemSel).forEach((el, i) => { el.dataset.delay = i * 90; });
    });
  }
  stagger('.projects-grid',   '.project-card');
  stagger('.skills-grid',     '.skill-item');
  stagger('.info-cards-grid', '.info-card');
  stagger('.tools-grid',      '.tool-badge');

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ================================================== */
  /* 5. ANIMATED PROGRESS BARS                          */
  /* ================================================== */
  const skillsWrapper = document.getElementById('skills-wrapper');
  if (skillsWrapper) {
    const barObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.progress-fill').forEach(fill => {
              setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 350);
            });
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillsWrapper.querySelectorAll('.skill-item').forEach(item => barObserver.observe(item));
  }

  /* ================================================== */
  /* 6. TYPING EFFECT                                    */
  /* ================================================== */
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const phrases = [
      'IT Student',
      'Web Developer',
      'Three.js Developer',
      'UI/UX Designer',
      'Full-Stack Enthusiast',
    ];
    let pi = 0, ci = 0, del = false, delay = 120;

    function type() {
      const p = phrases[pi];
      typingEl.textContent = del ? p.slice(0, ci - 1) : p.slice(0, ci + 1);
      del ? ci-- : ci++;

      if (!del && ci === p.length)     { del = true;  delay = 1800; }
      else if (del && ci === 0)        { del = false; pi = (pi + 1) % phrases.length; delay = 400; }
      else                             { delay = del ? 55 : 110 + Math.random() * 40; }

      setTimeout(type, delay);
    }
    setTimeout(type, 2000);
  }

  /* ================================================== */
  /* 7. PROJECT CARD 3D TILT ON HOVER                   */
  /* ================================================== */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      const ry = ((e.clientX - r.left) / r.width  - 0.5) *  10;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ================================================== */
  /* 8. CONTACT FORM                                    */
  /* ================================================== */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled    = true;

      // Simulate async submit — replace with real EmailJS / fetch() call
      setTimeout(() => {
        if (success) success.style.display = 'block';
        form.reset();
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.disabled  = false;
        setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
      }, 1400);
    });
  }

})();
