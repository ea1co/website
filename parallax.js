(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── HERO PARALLAX (homepage) ──
  var heroLeft = document.querySelector('.hero-left');

  // ── WORK-HERO BG PARALLAX (case-study pages) ──
  var workHeroBg = document.querySelector('.work-hero-bg');

  // ── PAGE-HEADER PARALLAX (team page only — not work-index, to avoid gap with work-items) ──
  var pageHeader = document.querySelector('.page-header');

  var hasMotion = heroLeft || workHeroBg || pageHeader;

  if (hasMotion) {
    var ticking = false;

    function update() {
      var y  = window.scrollY;
      var wh = window.innerHeight;

      // Homepage hero — text drifts slightly
      if (heroLeft) heroLeft.style.transform  = 'translateY(' + (y * 0.12).toFixed(1) + 'px)';

      // Case-study hero BG
      if (workHeroBg) {
        workHeroBg.style.transform = 'translateY(' + (y * 0.22).toFixed(1) + 'px)';
      }

      // Page header text scrolls away slightly faster → "peeling off" feel
      if (pageHeader && y < wh) {
        pageHeader.style.transform = 'translateY(' + (y * -0.08).toFixed(1) + 'px)';
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  // ── SCROLL REVEAL ──
  var sel = [
    // Homepage
    '.approach-card', '.section-heading', '.section-subhead',
    '.work-card', '.clients-label',
    // Team page
    '.team-card', '.support-card',
    // Work index (reveal inner text, not the container — avoids gaps between items)
    '.work-item-label', '.work-item-title', '.work-item-tagline', '.work-item-cta',
    // Case-study pages
    '.work-hero-content', '.work-body-left', '.work-stats-box',
    '.work-services-inline',
    // Shared
    '.section-label', '.section-link',
    '.page-eyebrow', '.page-title', '.page-desc',
    '.work-back-wrap'
  ].join(', ');

  var els = Array.from(document.querySelectorAll(sel));
  els.forEach(function (el) { el.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  els.forEach(function (el) { io.observe(el); });

  // Footer is injected by footer.js — watch for it via MutationObserver
  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (node.nodeName === 'FOOTER') {
          node.classList.add('reveal');
          io.observe(node);
          mo.disconnect();
        }
      });
    });
  });
  mo.observe(document.body, { childList: true });

})();
