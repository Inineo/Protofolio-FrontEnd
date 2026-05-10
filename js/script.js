/* ══════════════════════════════════════════
   ININEO PORTFOLIO — script.js
   ══════════════════════════════════════════ */

'use strict';

/* ── 0. SPLASH PARALLAX ────────────────── */
const splashBgText = document.querySelector('.splash__bg-text');
const splashPhoto = document.querySelector('.splash__photo-wrap');

if (splashBgText) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    if (scrollY < vh) {
      const progress = scrollY / vh;
      // Background text moves up slowly
      splashBgText.style.transform =
        `translate(-50%, calc(-50% - ${progress * 40}px))`;
      // Photo fades out slightly as you scroll
      if (splashPhoto) {
        splashPhoto.style.opacity = 1 - progress * 0.6;
        splashPhoto.style.transform = `translateY(${progress * -20}px)`;
      }
    }
  }, { passive: true });
}

/* ── 1. CUSTOM CURSOR ───────────────────── */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth trail
(function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
})();

// Cursor grow on interactive elements
document.querySelectorAll('a, button, .proj-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    cursor.style.background = 'var(--clr-blue)';
    cursorTrail.style.opacity = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = 'var(--clr-yellow)';
    cursorTrail.style.opacity = '0.6';
  });
});

/* ── 2. HEADER SCROLL STATE ─────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── 3. HAMBURGER MENU ──────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on link click
mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── 4. INTERSECTION OBSERVER (fade-in) ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ── 5. COUNTER ANIMATION ───────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat__num').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statObserver.observe(heroStats);

/* ── 6. TERMINAL TYPEWRITER ─────────────── */
const terminalBody = document.getElementById('terminalBody');

const terminalLines = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'out', text: 'Figriaone — Frontend Dev, UI/UX designer, Game Developer'},
  { type: 'prompt', text: '$ ls skills/' },
  { type: 'highlight', text: 'HTML  CSS  JS  Figma Godot Unity AP AE' },
  { type: 'prompt', text: '$ cat mission.txt' },
  { type: 'out', text: 'Building creative product with functional, vibrant & aesthetic.' },
  { type: 'out', text: 'Clean code. Sharp design. No compromise.' },
  { type: 'prompt', text: '$ ./start_project.sh' },
  { type: 'success', text: '✓ Ready to build something great.' },
  { type: 'cursor', text: '' },
];

async function runTerminal() {
  for (let i = 0; i < terminalLines.length; i++) {
    const { type, text } = terminalLines[i];
    await sleep(i === 0 ? 800 : 420);

    const line = document.createElement('span');
    line.className = 'line';
    terminalBody.appendChild(line);

    if (type === 'cursor') {
      const c = document.createElement('span');
      c.className = 't-cursor';
      line.appendChild(c);
    } else if (type === 'prompt') {
      line.innerHTML = `<span class="prompt">$ </span><span class="cmd"></span>`;
      await typeText(line.querySelector('.cmd'), text.replace('$ ', ''));
    } else {
      line.className = `line ${type}`;
      await typeText(line, text, 18);
    }
  }
}

function typeText(el, text, speed = 35) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(interval); resolve(); }
    }, speed);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Start terminal after short delay
setTimeout(runTerminal, 600);

/* ── 7. PIXEL AVATAR ────────────────────── */
const pixelGrid = document.getElementById('pixelAvatar');
if (pixelGrid) {
  const palette = ['#080c10', '#1e6fff', '#0d1117', '#f5c518', '#111822'];
  // Hand-crafted 8x8 pattern (face-ish silhouette)
  const pattern = [
    0, 1, 1, 1, 1, 1, 1, 0,
    1, 2, 3, 2, 2, 3, 2, 1,
    1, 2, 0, 2, 2, 0, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 0, 2, 2, 0, 2, 1,
    1, 2, 2, 0, 0, 2, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 1,
    0, 1, 1, 1, 1, 1, 1, 0,
  ];
  pattern.forEach(c => {
    const pixel = document.createElement('div');
    pixel.className = 'pa__pixel';
    pixel.style.background = palette[c];
    pixelGrid.appendChild(pixel);
  });
}

/* ── 8. PROJECT CANVAS DECORATIONS ─────── */
function initCanvasDecorations(container = document) {
  container.querySelectorAll('.proj-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const shape = canvas.dataset.shape;
    const size = 6; // pixel size
    const cols = Math.floor(canvas.width / size);
    const rows = Math.floor(canvas.height / size);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30,111,255,0.25)';

    if (shape === 'grid') {
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          if ((r + c) % 4 === 0) ctx.fillRect(c * size, r * size, size, size);
        }
      }
    } else if (shape === 'wave') {
      for (let c = 0; c < cols; c++) {
        const r = Math.round((Math.sin(c * 0.4) + 1) * (rows / 2));
        for (let i = 0; i < 3; i++) {
          if ((r + i) < rows) ctx.fillRect(c * size, (r + i) * size, size, size);
        }
      }
    } else if (shape === 'cross') {
      const mx = Math.floor(cols / 2), my = Math.floor(rows / 2);
      for (let c = 0; c < cols; c++) ctx.fillRect(c * size, my * size, size, size);
      for (let r = 0; r < rows; r++) ctx.fillRect(mx * size, r * size, size, size);
    } else if (shape === 'diamond') {
      const cx = Math.floor(cols / 2), cy = Math.floor(rows / 2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.abs(c - cx) + Math.abs(r - cy) < 8) {
            ctx.fillRect(c * size, r * size, size, size);
          }
        }
      }
    }
  });
}

/* ── 9. CAROUSEL (Auto-scroll + Drag) ────── */
function initCarousel() {
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');

  if (!carousel || !track || track.children.length === 0) return;

  const originalCards = Array.from(track.children);
  const shouldLoop = originalCards.length > 3;

  if (shouldLoop) {
    // Clone cards for seamless infinite loop
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  } else {
    // Center it or just leave it static if few items
    track.style.justifyContent = 'center';
  }

  // Since we cloned the canvas elements, their drawing context is lost.
  // We need to redraw all canvases in the track.
  initCanvasDecorations(track);

  const cardWidth = () => {
    const c = track.querySelector('.proj-card');
    return c ? c.offsetWidth + 20 : 340; // card + gap
  };

  const totalOriginalWidth = () => cardWidth() * originalCards.length;

  // State
  let currentX = 0;      // current translate X
  let autoX = 0;      // running auto-scroll accumulator
  let velocity = 0.6;    // px per frame (auto)
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let idleTimer = null;
  let autoRunning = shouldLoop; // Hanya jalan jika di-loop
  let rafId = null;

  function setTranslate(x) {
    currentX = x;
    track.style.transform = `translateX(${x}px)`;
    updateProgress();
  }

  function normalizeX(x) {
    const total = totalOriginalWidth();
    if (total === 0) return 0;
    // Seamless wrap: when scrolled past one full set, reset
    if (-x >= total) x += total;
    if (-x < 0) x -= total;
    return x;
  }

  // Auto-scroll loop
  function autoScroll() {
    if (!isDragging && autoRunning) {
      autoX -= velocity;
      let nx = normalizeX(autoX);
      autoX = nx;
      setTranslate(nx);
    }
    rafId = requestAnimationFrame(autoScroll);
  }

  autoScroll();

  // Pause & resume
  function pauseAuto() {
    autoRunning = false;
    clearTimeout(idleTimer);
  }

  function scheduleResume() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      autoX = currentX; // sync accumulator
      autoRunning = true;
    }, 2000); // 2 sec idle → resume
  }

  // Progress bar
  function updateProgress() {
    const total = totalOriginalWidth();
    if (total === 0) return;
    const scrolled = ((-currentX) % total + total) % total;
    const pct = (scrolled / total) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
  }

  // ── DRAG (mouse) ────────────────────────
  carousel.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartScroll = currentX;
    carousel.classList.add('is-dragging');
    pauseAuto();
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const nx = normalizeX(dragStartScroll + dx);
    autoX = nx;
    setTranslate(nx);
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('is-dragging');
    scheduleResume();
  });

  // ── DRAG (touch) ─────────────────────────
  carousel.addEventListener('touchstart', e => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartScroll = currentX;
    pauseAuto();
  }, { passive: true });

  carousel.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - dragStartX;
    const nx = normalizeX(dragStartScroll + dx);
    autoX = nx;
    setTranslate(nx);
  }, { passive: true });

  carousel.addEventListener('touchend', () => {
    isDragging = false;
    scheduleResume();
  });

  // ── ARROW BUTTONS ────────────────────────
  function scrollBy(amount) {
    pauseAuto();
    const nx = normalizeX(currentX + amount);
    autoX = nx;
    // Smooth jump
    track.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
    setTranslate(nx);
    setTimeout(() => { track.style.transition = 'none'; }, 460);
    scheduleResume();
  }

  prevBtn.addEventListener('click', () => scrollBy(cardWidth()));
  nextBtn.addEventListener('click', () => scrollBy(-cardWidth()));

  // Stop RAF on visibility change (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      autoScroll();
    }
  });
}

/* ── 9.5. FETCH AND RENDER PORTFOLIO ────── */
(async function loadPortfolioCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  try {
    const res = await fetch('../neonly/api/projects.php');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    // ID Project yang ingin ditampilkan (Manual)
    const manualIds = [1, 2, 3]; // Ganti atau tambah angka di dalam kurung siku ini dengan ID project Anda

    // Filter berdasarkan manualIds dan batasi maksimal 9
    const projects = data.projects
      .filter(p => manualIds.includes(p.id))
      .slice(0, 9);

    if (projects.length === 0) {
      track.innerHTML = '<p style="color:var(--clr-gray); padding: 2rem;">No projects found.</p>';
      return;
    }

    const shapes = ['grid', 'wave', 'cross', 'diamond'];

    projects.forEach((p, index) => {
      const shape = shapes[index % shapes.length];
      const color = p.accentColor || '#1e6fff';

      let coverImgHtml = '';
      if (p.coverImage) {
        coverImgHtml = `<img src="../neonly/uploads/${p.coverImage}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 1;" />`;
      }

      const article = document.createElement('article');
      article.className = 'proj-card';
      article.innerHTML = `
        <div class="proj-card__img" style="--c:${color}">
          ${coverImgHtml}
          <div class="proj-card__pixel-deco" style="position: relative; z-index: 2;">
            <canvas class="proj-canvas" data-shape="${shape}" width="120" height="120"></canvas>
          </div>
          <span class="proj-card__year" style="position: relative; z-index: 2;">${p.year || ''}</span>
        </div>
        <div class="proj-card__body">
          <span class="proj-card__tag">${p.category || 'Project'}</span>
          <h3 class="proj-card__title">${p.title}</h3>
          <p class="proj-card__desc">${p.tagline || ''}</p>
          <a href="project-detail.html?id=${p.id}" class="proj-card__link">View Project →</a>
        </div>
      `;
      track.appendChild(article);
    });

    // Initialize canvas decorations on original elements
    initCanvasDecorations(track);

    // Wait a tick for DOM to render dimensions properly before carousel init
    setTimeout(() => {
      initCarousel();
    }, 50);

  } catch (err) {
    console.error('Error fetching projects:', err);
  }
})();

/* ── 10. CONTACT FORM ───────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const btn = contactForm.querySelector('button[type="submit"]');

    if (!email || !message) {
      formSuccess.style.color = '#ff5f56';
      formSuccess.textContent = '⚠ Mohon isi semua field yang diperlukan.';
      return;
    }

    // Simulate sending
    btn.disabled = true;
    btn.querySelector('.btn__text').textContent = 'Mengirim...';

    await sleep(1200);

    formSuccess.style.color = '#27c93f';
    formSuccess.textContent = '✓ Pesan terkirim! Saya akan membalas dalam 24 jam.';
    contactForm.reset();
    btn.disabled = false;
    btn.querySelector('.btn__text').textContent = 'Kirim Pesan';
  });
}

/* ── 11. NAV SMOOTH ACTIVE STATE ───────── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav__link');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--clr-white)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));
