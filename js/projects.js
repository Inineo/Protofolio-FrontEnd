/* ══════════════════════════════════════════
   ININEO — projects.js
   Shared: gallery + detail pages
   ══════════════════════════════════════════ */

'use strict';

/* ── CURSOR ─────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

if (cursor && cursorTrail) {
  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;
  let cursorScale = 1;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    cursor.style.display = 'none';
    cursorTrail.style.display = 'none';
  } else {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
    });

    (function animateTrail() {
      const dx = mouseX - trailX;
      const dy = mouseY - trailY;
      
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        trailX += dx * 0.12;
        trailY += dy * 0.12;
        cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      }
      
      requestAnimationFrame(animateTrail);
    })();

    // Cursor grow on interactive elements (Event Delegation)
    document.addEventListener('mouseover', e => {
      const el = e.target.closest('a, button, .proj-item, .filter-chip, .process-step');
      if (el) {
        cursorScale = 2.2;
        cursor.style.transform    = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
        cursor.style.background   = 'var(--clr-blue)';
        cursorTrail.style.opacity = '0.2';
      }
    });

    document.addEventListener('mouseout', e => {
      const el = e.target.closest('a, button, .proj-item, .filter-chip, .process-step');
      if (el) {
        cursorScale = 1;
        cursor.style.transform    = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
        cursor.style.background   = 'var(--clr-yellow)';
        cursorTrail.style.opacity = '0.6';
      }
    });
  }
}

/* ── HEADER SCROLL ──────────────────────── */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── HAMBURGER ──────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── INTERSECTION OBSERVER (fade-in) ────── */
// threshold rendah + rootMargin longgar agar card yang
// langsung dalam viewport saat load tetap terdeteksi
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.01,          // trigger lebih awal
  rootMargin: '0px 0px 0px 0px'
});

// Fungsi ini dipakai juga oleh filter & detail.js
function observeFadeIns() {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    io.observe(el);
  });
}

// Jalankan setelah DOM siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeFadeIns);
} else {
  observeFadeIns();
}

/* ══════════════════════════════════════════
   GALLERY PAGE — Filter logic
   ══════════════════════════════════════════ */
const filterChips    = document.getElementById('filterChips');
const projectsGrid   = document.getElementById('projectsGrid');
const filterCount    = document.getElementById('filterCount');
const emptyState     = document.getElementById('emptyState');
const resetFilterBtn = document.getElementById('resetFilter');

if (filterChips && projectsGrid) {
  let allProjects = [];
  let currentCategory = 'all';
  let currentPage = 1;
  const itemsPerPage = 10;
  
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  function renderMockup(proj) {
    if (proj.coverImage) {
      return `<img src="../neonly/uploads/${proj.coverImage}" alt="${proj.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0;" />`;
    }

    const type = proj.mockupType;
    const accentColor = proj.accentColor;

    if (type === 'phone' || type === 'mobile') {
      return `
        <div class="proj-item__mockup" style="--accent:${accentColor}">
          <div class="mockup-phone">
            <div class="mockup-phone__screen">
              <div class="mock-ui mock-ui--banking"></div>
            </div>
          </div>
        </div>`;
    } else if (type === 'desktop' || type === 'dashboard') {
       return `
        <div class="proj-item__mockup" style="--accent:${accentColor}">
          <div class="mockup-desktop">
            <div class="mockup-desktop__screen">
              <div class="mock-ui mock-ui--dashboard"></div>
            </div>
            <div class="mockup-desktop__stand"></div>
          </div>
        </div>`;
    } else if (type === 'brand' || type === 'branding') {
      return `
        <div class="proj-item__mockup" style="--accent:${accentColor}">
          <div class="mockup-brand">
            <div class="brand-logo-mock">
              <span class="brand-v" style="color:var(--accent)">V</span>
              <div class="brand-lines">
                <div></div><div></div><div></div>
              </div>
            </div>
          </div>
        </div>`;
    } else {
      return `
        <div class="proj-item__mockup" style="--accent:${accentColor}">
          <div class="mockup-browser">
            <div class="mockup-browser__bar">
              <span class="mb-dot"></span><span class="mb-dot"></span><span class="mb-dot"></span>
            </div>
            <div class="mockup-browser__screen">
              <div class="mock-ui mock-ui--learning"></div>
            </div>
          </div>
        </div>`;
    }
  }

  async function fetchProjects() {
    try {
      const response = await fetch('../neonly/api/projects.php');
      const data = await response.json();
      
      if (data.projects) {
        const loadingState = document.getElementById('projectsLoading');
        if (loadingState) loadingState.remove();

        allProjects = data.projects;
        if (allProjects.length === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        const categories = new Set();
        allProjects.forEach(proj => {
            categories.add(proj.category || 'uncategorized');
        });
        
        generateFilters(categories);
        renderGrid();
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      projectsGrid.innerHTML = '<p style="color:var(--clr-red); grid-column:1/-1; text-align:center;">Failed to load projects.</p>';
    }
  }

  function renderGrid() {
    // Filter projects
    const filteredProjects = allProjects.filter(proj => {
        return currentCategory === 'all' || (proj.category || 'uncategorized') === currentCategory;
    });

    // Pagination
    const maxVisible = currentPage * itemsPerPage;
    const visibleProjects = filteredProjects.slice(0, maxVisible);
    
    // Update Load More Button visibility
    if (loadMoreContainer) {
        if (filteredProjects.length > maxVisible) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }

    if (filteredProjects.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        projectsGrid.innerHTML = '';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        
        let html = '';
        visibleProjects.forEach((proj, idx) => {
            const delay = (idx % itemsPerPage) * 50;
            const catClass = proj.category || 'uncategorized';
            
            html += `
            <article class="proj-item fade-in" data-category="${catClass}" data-delay="${delay}">
              <a href="project-detail.html?id=${proj.id}" class="proj-item__link" aria-label="${proj.title}">
                <div class="proj-item__img">
                  ${renderMockup(proj)}
                  <div class="proj-item__overlay">
                    <span class="proj-item__cta">View Project →</span>
                  </div>
                  <span class="proj-item__year">${proj.year}</span>
                  <span class="proj-item__tag-badge" style="text-transform: capitalize;">${catClass}</span>
                </div>
                <div class="proj-item__body">
                  <h3 class="proj-item__title">${proj.title}</h3>
                  <p class="proj-item__desc">${proj.description || proj.tagline}</p>
                </div>
              </a>
            </article>
          `;
        });
        
        projectsGrid.innerHTML = html;
        setTimeout(observeFadeIns, 50);
    }

    // Update counter
    if (filterCount) {
        filterCount.innerHTML = `Showing <strong>${visibleProjects.length}</strong> of <strong>${filteredProjects.length}</strong> project${filteredProjects.length !== 1 ? 's' : ''}`;
    }
  }

  function generateFilters(categories) {
    let filterHtml = '<button class="filter-chip active" data-filter="all">All</button>';
    
    categories.forEach(cat => {
        if (cat === 'uncategorized') return;
        const displayCat = cat.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        filterHtml += `<button class="filter-chip" data-filter="${cat}">${displayCat}</button>`;
    });

    filterChips.innerHTML = filterHtml;
  }

  function applyFilter(category) {
    currentCategory = category;
    currentPage = 1; // reset page when filter changes
    renderGrid();
  }

  filterChips.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    filterChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyFilter(chip.dataset.filter);
  });

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      filterChips.querySelectorAll('.filter-chip').forEach((c, i) => {
        c.classList.toggle('active', i === 0);
      });
      applyFilter('all');
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderGrid();
    });
  }

  fetchProjects();
}
