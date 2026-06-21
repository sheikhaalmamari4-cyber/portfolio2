/* ============================================================
   Wizarding Portfolio — interactions & magical effects
   Vanilla JavaScript only
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scrolled state ---------- */
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const hidden = mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex', !hidden);
      menuBtn.textContent = hidden ? '☰' : '✕';
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        menuBtn.textContent = '☰';
      });
    });
  }

  /* ---------- Marauder's Map scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- 3D Tilt on cards ---------- */
  if (!isTouch && !prefersReduced) {
    document.querySelectorAll('.tilt').forEach((card) => {
      const strength = 9;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) ` +
          `rotateY(${(px * strength).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Floating candles ---------- */
  (function spawnCandles() {
    if (prefersReduced) return;
    const wrap = document.getElementById('candles');
    if (!wrap) return;
    const count = window.innerWidth < 640 ? 7 : 14;
    for (let i = 0; i < count; i++) {
      const c = document.createElement('div');
      c.className = 'candle';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.top = (5 + Math.random() * 70) + 'vh';
      c.style.height = (18 + Math.random() * 30) + 'px';
      c.style.setProperty('--float', (6 + Math.random() * 6).toFixed(1) + 's');
      c.style.animationDelay = (-Math.random() * 6).toFixed(1) + 's';
      c.style.opacity = (0.5 + Math.random() * 0.45).toFixed(2);
      wrap.appendChild(c);
    }
  })();

  /* ---------- Starry night canvas ---------- */
  (function starryNight() {
    if (prefersReduced) return;
    const canvas = document.getElementById('night-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const density = Math.floor((w * h) / 9000);
      stars = [];
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          base: Math.random() * 0.5 + 0.25,
          tw: Math.random() * 0.02 + 0.004,
          phase: Math.random() * Math.PI * 2,
          gold: Math.random() > 0.78,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.phase += s.tw;
        const a = s.base + Math.sin(s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(245, 217, 122, ${a})`
          : `rgba(255, 255, 255, ${a})`;
        ctx.shadowBlur = s.gold ? 8 : 4;
        ctx.shadowColor = s.gold ? 'rgba(212,175,55,0.8)' : 'rgba(255,255,255,0.6)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  })();

  /* ---------- Custom wand cursor + golden spark trail ---------- */
  (function wandCursor() {
    if (isTouch || prefersReduced) return;
    const dot = document.getElementById('cursor-dot');
    const canvas = document.getElementById('spark-canvas');
    if (!dot || !canvas) return;
    const ctx = canvas.getContext('2d');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      // emit sparks
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 + 0.4,
          life: 1,
          size: Math.random() * 2.4 + 0.8,
        });
      }
      if (particles.length > 260) particles.splice(0, particles.length - 260);
    });

    document.addEventListener('mousedown', () => dot.classList.add('click'));
    document.addEventListener('mouseup', () => dot.classList.remove('click'));

    // Highlight interactive targets
    document.querySelectorAll('a, button, .spell-card, .card').forEach((el) => {
      el.addEventListener('mouseenter', () => dot.classList.add('hot'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hot'));
    });

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.life -= 0.025;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 217, 122, ${p.life})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.9)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(render);
    }
    render();
  })();

})();
