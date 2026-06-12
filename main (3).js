/* ============================================
   ВІКТОРІЯ — Більярдний клуб  |  main.js v2
   ============================================ */

// ── PRELOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('done');
  }, 1400);
});

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CURSOR TRAIL ── */
  (function cursorTrail() {
    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    if (window.matchMedia('(pointer: coarse)').matches) { canvas.style.display = 'none'; return; }

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          size: Math.random() * 2.5 + 0.8,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5 - 0.25,
          life: 1
        });
      }
      if (particles.length > 120) particles.splice(0, particles.length - 120);
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX; p.y += p.speedY; p.life -= 0.018;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.life * 0.5})`;
        ctx.shadowColor = 'rgba(201,168,76,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ── 2. NAV SCROLL + ACTIVE LINKS ── */
  (function navScroll() {
    const nav = document.getElementById('main-nav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 30);
      let current = '';
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ── 3. MOBILE MENU ── */
  (function mobileMenu() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    menu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  })();

  /* ── 4. HERO PARTICLES ── */
  (function heroParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle';
      const size = Math.random() * 3 + 1;
      dot.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:${Math.random()*30}%;animation-duration:${Math.random()*4+4}s;animation-delay:${Math.random()*4}s`;
      container.appendChild(dot);
    }
  })();

  /* ── 5. SCROLL REVEAL ── */
  (function scrollReveal() {
    const targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.dataset.animate === 'stagger') {
            entry.target.querySelectorAll('[data-animate-item]').forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * 120);
            });
          }
          entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
          if (entry.target.matches('[data-count]')) animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    targets.forEach((el) => observer.observe(el));
  })();

  /* ── 6. COUNTERS ── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || el.dataset.counted) return;
    el.dataset.counted = 'true';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  document.querySelectorAll('[data-count]').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) animateCounter(el);
  });

  /* ── 7. WORKING HOURS ── */
  (function workingHours() {
    const statusEl = document.getElementById('open-status');
    const labelEl = document.getElementById('open-label');
    const rowEl = document.getElementById('open-status-row');
    if (!statusEl) return;

    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours() + now.getMinutes() / 60;
    const isWeekend = day === 0 || day === 6;
    const openTime = isWeekend ? 12 : 10;
    const closeTime = isWeekend ? 22 : 21;
    const isOpen = hours >= openTime && hours < closeTime;

    if (isOpen) {
      labelEl.textContent = 'Зараз відкрито';
      statusEl.textContent = `до ${closeTime}:00`;
      rowEl.classList.add('open-now');
    } else {
      labelEl.textContent = 'Зараз зачинено';
      const next = (day === 5 || day === 6) ? 'Сб–Нд з 12:00' : day === 0 ? 'Пн з 10:00' : `сьогодні з ${openTime}:00`;
      statusEl.textContent = next;
      rowEl.classList.add('closed-now');
    }
  })();

  /* ── 8. CONTACT FORM ── */
  (function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const successEl = document.getElementById('form-success');
    const errorEl = document.getElementById('form-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      successEl.style.display = 'none';
      errorEl.style.display = 'none';
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline';

      try {
        const response = await fetch(form.action, {
          method: 'POST', body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) { successEl.style.display = 'block'; form.reset(); }
        else errorEl.style.display = 'block';
      } catch { errorEl.style.display = 'block'; }
      finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
      }
    });
  })();

  /* ── 9. SMOOTH ANCHORS ── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('main-nav')?.offsetHeight || 70;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (navHeight - 1), behavior: 'smooth' });
    });
  });

  /* ── 10. CARD TILT ── */
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.querySelectorAll('.table-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -5;
        const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        card.style.boxShadow = '0 24px 48px rgba(0,0,0,0.4)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ── 11. HALL MAP HOVER ── */
  (function hallMapInteractive() {
    const svg = document.querySelector('.hall-map-svg');
    if (!svg) return;
    svg.querySelectorAll('text').forEach((text) => {
      const label = text.textContent.trim();
      if (/^[RA]\d+$/.test(label)) {
        let shape = text.previousElementSibling;
        while (shape && shape.tagName !== 'rect') shape = shape.previousElementSibling;
        if (!shape) return;
        const hoverIn = () => { shape.style.filter = 'drop-shadow(0 0 10px rgba(201,168,76,0.5))'; };
        const hoverOut = () => { shape.style.filter = ''; };
        [shape, text].forEach(el => {
          el.style.cursor = 'pointer';
          el.addEventListener('mouseenter', hoverIn);
          el.addEventListener('mouseleave', hoverOut);
          el.addEventListener('click', () => {
            document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
          });
        });
      }
    });
  })();

});
