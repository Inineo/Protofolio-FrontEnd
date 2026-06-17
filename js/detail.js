/* ══════════════════════════════════════════
   ININEO — detail.js
   Project detail page — data & rendering
   ══════════════════════════════════════════ */

'use strict';
console.log("CAROUSEL & DETAIL FIXED - VERSI FINAL");

// Data will be fetched from API
let CURRENT_PROJECT = null;

/* ══════════════════════════════════════════
   RENDER HELPERS
   ══════════════════════════════════════════ */
function el(sel) { return document.getElementById(sel); }
function setText(id, txt) { const e = el(id); if (e) e.textContent = txt || '—'; }
function setHTML(id, html) { const e = el(id); if (e) e.innerHTML = html || ''; }

function renderMockup(type, accent, coverImage) {
  console.log("Rendering Mockup with image:", coverImage);
  const wrap = document.getElementById('previewMockup');
  if (!wrap) return;

  const imgPath = `../neonly/uploads/${coverImage}`;
  const imgHtml = coverImage
    ? `<img src="${imgPath}" alt="Cover" style="width:100%; height:auto; display:block; border-radius:inherit; min-height:100px;">`
    : '<p style="color:white; padding:20px; font-family:var(--font-mono); font-size:0.7rem;">[ No Preview Image ]</p>';

  if (type === 'phone') {
    wrap.innerHTML = `
      <div class="detail-phone" style="width:180px; height:auto; min-height:320px; box-shadow: 0 12px 40px rgba(0,0,0,0.6);">
        <div class="detail-phone__screen" style="background: #080c10; height:auto; display:block;">${imgHtml}</div>
      </div>`;
  } else {
    wrap.innerHTML = `
      <div class="detail-browser" style="width:100%; height:auto; display:block;">
        <div class="detail-browser__bar">
          <span class="mb-dot" style="background:#ff5f56"></span>
          <span class="mb-dot" style="background:#ffbd2e"></span>
          <span class="mb-dot" style="background:#27c93f"></span>
          <div class="mb-url">inineo.dev / preview</div>
        </div>
        <div class="detail-browser__screen" style="background: #080c10; height:auto; display:block;">${imgHtml}</div>
      </div>`;
  }
}

function renderShowcase(showcaseImages) {
  const block = document.getElementById('showcaseBlock');
  const grid = document.getElementById('showcaseGrid');
  if (!grid || !block) return;

  // If no showcase images, hide the entire section and collapse gap
  if (!showcaseImages || !Array.isArray(showcaseImages) || showcaseImages.length === 0) {
    block.style.display = 'none';
    block.style.margin = '0';
    block.style.padding = '0';
    return;
  }

  block.style.display = '';
  block.style.margin = '';
  block.style.padding = '';
  grid.innerHTML = '';
  // Render landscape images stacked vertically
  grid.style.display = 'flex';
  grid.style.flexDirection = 'column';
  grid.style.gap = '24px';

  showcaseImages.forEach((imgFile) => {
    const item = document.createElement('div');
    item.className = 'showcase-item';
    // Gunakan display: block agar kontainer mengikuti ukuran gambar di dalamnya
    item.style.cssText = 'width:100%; height:auto; border-radius:var(--radius-md,12px); overflow:hidden; border:1px solid var(--clr-border); display:block;';
    item.innerHTML = `
      <img src="../neonly/uploads/${imgFile}" 
           alt="Showcase" 
           style="width:100%; height:auto; display:block;" 
           loading="lazy" />
    `;
    grid.appendChild(item);
  });
}

/* ══════════════════════════════════════════
   MAIN RENDER
   ══════════════════════════════════════════ */
function renderProject(project) {
  const p = project;

  // --- ACTIONS BUTTONS LOGIC ---
  const githubBtn = el('detail-github-btn');
  if (githubBtn) {
    if (p.githubLink && p.githubLink !== '' && p.githubLink !== '#') {
      githubBtn.href = p.githubLink;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
    }
  }

  const liveBtn = el('detail-live-btn');
  if (liveBtn) {
    if (p.projectLink && p.projectLink !== '' && p.projectLink !== '#') {
      liveBtn.href = p.projectLink;
      liveBtn.style.display = 'inline-flex';
    } else {
      liveBtn.style.display = 'none';
    }
  }

  const caseBtn = el('detail-case-btn');
  if (caseBtn) {
    if (p.caseStudyLink && p.caseStudyLink !== '' && p.caseStudyLink !== '#') {
      caseBtn.href = p.caseStudyLink;
      caseBtn.style.display = 'inline-flex';
    } else {
      caseBtn.style.display = 'none';
    }
  }
  // -----------------------------

  document.title = `${p.title} — inineo`;

  // Breadcrumb
  const bc = document.querySelector('.breadcrumb__current');
  if (bc) bc.textContent = p.title.toLowerCase();

  // Hero
  setText('detail-num', String(p.id).padStart(2, '0'));
  setText('detail-category', (p.category || '').toLowerCase());
  setText('detail-title', p.title);
  setText('detail-tagline', p.tagline);

  // Tags
  const tagsWrap = el('detail-tags');
  if (tagsWrap) {
    const tags = (p.tags && p.tags.length) ? p.tags : [p.category || 'Design'];
    tagsWrap.innerHTML = tags.filter(Boolean).map(t => `<span class="detail-tag">${t}</span>`).join('');
  }

  // Meta bar
  setText('meta-client', p.client);
  setText('meta-timeline', p.timeline);
  setText('meta-role', p.role);
  const toolsStr = (p.tools && Array.isArray(p.tools)) ? p.tools.join(', ') : '—';
  setText('meta-tools', toolsStr);
  setText('meta-year', p.year);

  // Hero mockup
  renderMockup(p.mockupType, p.accentColor, p.coverImage);

  // Dynamic accent color
  document.documentElement.style.setProperty('--clr-accent-proj', p.accentColor);
  const heroBg = el('detailHeroBg');
  if (heroBg) {
    heroBg.style.background = `
      radial-gradient(ellipse at 70% 50%, ${p.accentColor}18, transparent 60%),
      linear-gradient(var(--clr-border) 1px, transparent 1px),
      linear-gradient(90deg, var(--clr-border) 1px, transparent 1px)`;
    heroBg.style.backgroundSize = '100% 100%, 48px 48px, 48px 48px';
  }

  // Content sections
  setText('content-overview-heading', `${p.title} — Project Overview`);
  setHTML('content-overview', p.overview || p.description || '');
  setHTML('content-problem', p.problem);
  setHTML('content-results', p.resultsBody);
  setHTML('content-learnings', p.learnings);

  // Hide empty content sections
  document.querySelectorAll('.content-block').forEach(block => {
    const body = block.querySelector('.content-block__body');
    if (body && (!body.innerHTML || body.innerHTML.trim() === '' || body.innerHTML.trim() === '—')) {
      block.style.display = 'none';
    }
  });

  // Process steps
  const stepsWrap = el('processSteps');
  if (stepsWrap) {
    const steps = (p.processSteps && Array.isArray(p.processSteps)) ? p.processSteps : [];
    if (steps.length > 0) {
      stepsWrap.innerHTML = steps.map((s, i) => `
        <div class="process-step">
          <div class="process-step__num">${String(i + 1).padStart(2, '0')}</div>
          <div>
            <div class="process-step__title">${s.title || ''}</div>
            <div class="process-step__desc">${s.desc || ''}</div>
          </div>
        </div>
      `).join('');
    } else {
      // Hide the parent section if no steps
      stepsWrap.closest('.content-block').style.display = 'none';
    }
  }

  // Results metrics
  const resultsWrap = el('resultsGrid');
  if (resultsWrap) {
    const results = (p.results && Array.isArray(p.results)) ? p.results : [];
    if (results.length > 0) {
      resultsWrap.innerHTML = results.map(r => `
        <div class="result-card">
          <span class="result-card__num">${r.num || ''}</span>
          <span class="result-card__label">${r.label || ''}</span>
        </div>
      `).join('');
    } else {
      resultsWrap.innerHTML = '';
    }
  }

  // Showcase images (landscape, vertical stack, hidden if empty)
  renderShowcase(p.showcaseImages);

  // Sidebar info — like the screenshot: Client, Timeline, Role, Year + custom info
  const sidebarInfo = el('sidebarInfo');
  if (sidebarInfo) {
    const rows = [];

    // Add standard fields (only if they have values)
    if (p.client) rows.push({ key: 'Client', val: p.client });
    if (p.timeline) rows.push({ key: 'Timeline', val: p.timeline });
    if (p.role) rows.push({ key: 'Role', val: p.role });
    if (p.year) rows.push({ key: 'Year', val: p.year });

    // Append custom sidebar info from admin (Industry, Platform, Team Size, Status, etc.)
    if (p.sidebarInfo && Array.isArray(p.sidebarInfo)) {
      p.sidebarInfo.forEach(s => {
        if (s.key && s.val) rows.push(s);
      });
    }

    if (rows.length > 0) {
      sidebarInfo.innerHTML = rows.map(r => `
        <div class="sidebar-row">
          <span class="sidebar-row__key">${r.key}</span>
          <span class="sidebar-row__val">${r.val}</span>
        </div>
      `).join('');
    } else {
      sidebarInfo.innerHTML = '<span style="color:var(--clr-grey);font-style:italic;">—</span>';
    }
  }

  // Sidebar tools
  const toolsWrap = el('sidebarTools');
  if (toolsWrap) {
    const tools = (p.tools && Array.isArray(p.tools)) ? p.tools : [];
    if (tools.length > 0) {
      toolsWrap.innerHTML = tools.map(t => `<span class="tool-chip">${t}</span>`).join('');
    } else {
      toolsWrap.innerHTML = '<span style="color:var(--clr-grey);font-style:italic;">—</span>';
    }
  }

  // Prev / Next navigation
  const prevId = p.id > 1 ? p.id - 1 : null;
  const nextId = p.id + 1;

  const prevBtn = el('prevProject');
  const nextBtn = el('nextProject');

  if (prevBtn) {
    if (prevId) {
      prevBtn.href = `project-detail.html?id=${prevId}`;
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
      el('prevName').textContent = 'Previous Project';
    } else {
      prevBtn.style.opacity = '0.3';
      prevBtn.style.pointerEvents = 'none';
    }
  }

  if (nextBtn) {
    nextBtn.href = `project-detail.html?id=${nextId}`;
    el('nextName').textContent = 'Next Project';
  }

  // Set page ready class for animations
  document.body.classList.add('page-ready');
}

/* ══════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════ */
async function boot() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10) || 1;

  try {
    const response = await fetch(`../neonly/api/project-detail.php?id=${id}`);
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      setText('detail-title', 'Project Not Found');
      setText('detail-tagline', 'The project you are looking for does not exist or has been removed.');
      return;
    }

    CURRENT_PROJECT = data;
    renderProject(data);

    // After render, mark all fade-in elements as visible immediately
    // (no observer re-run to prevent flash-then-disappear bug)
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });

  } catch (error) {
    console.error('Failed to fetch project:', error);
    setText('detail-title', 'Error Loading Project');
    setText('detail-tagline', 'Please check your connection and try again.');
  }
}

// Wait for DOM + shared script IO to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
