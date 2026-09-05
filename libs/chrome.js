/* ==========================================================================
   Pivot Protocol — Chrome injector
   Renders the top ticker + nav bar into placeholder divs so markup isn't
   duplicated across every page. Expects:
     <div id="app-ticker"></div>
     <div id="app-nav"></div>
   ========================================================================== */

(function () {
  const PROTOCOL_VERSION = 37;

  const NAV_LINKS = [
    { label: 'Dashboard',      href: 'index.html' },
    { label: 'Distributions',  href: 'distributions.html' },
    { label: 'Pools',          href: 'pools.html' },
    { label: 'DIY Charts',     href: 'diy.html' },
    { label: '$UNDEAD',        href: 'undead.html' },
    { label: 'Diagnostics',    href: 'diagnostics.html' },
  ];

  function currentPage() {
    const path = location.pathname.split('/').pop();
    return path === '' ? 'index.html' : path;
  }

  function renderNav() {
    const el = document.getElementById('app-nav');
    if (!el) return;
    const here = currentPage();
    const links = NAV_LINKS.map(l =>
      `<a href="${l.href}"${l.href === here ? ' class="active"' : ''}>${l.label}</a>`
    ).join('');
    el.innerHTML = `
      <div class="topnav">
        <a class="brand" href="index.html">
          <img class="brand-mark" src="imgs/pivot-logo-sillo.png" alt="Pivot Technologies">
          <span class="brand-name">Pivot Technologies, LLC</span>
        </a>
        <nav class="links">
          ${links}
          <svg class="nav-light" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="navLightGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="0">
                <stop offset="0%" stop-color="#4FD9BE"/>
                <stop offset="100%" stop-color="#8FA6C4"/>
              </linearGradient>
            </defs>
            <line id="navLightCore" x1="0" y1="0" x2="0" y2="0" stroke="url(#navLightGrad)" stroke-linecap="round"/>
          </svg>
        </nav>
        <div class="nav-right">
          <a class="nav-cta" href="login.html">Profile</a>
        </div>
      </div>`;
    initNavLight(el.querySelector('nav.links'));
  }

  /* -----------------------------------------------------------------------
     Nav-light indicator: two independent springs, one per end of the rod.
     Since these are real page links (not SPA tabs), "switching tabs" here
     means hovering -- the rod rests as a tight ring under the current page
     and stretches over to whatever's hovered, snapping back on mouse-leave.

     ONE spring per end. The gap between them IS the animation:
       - leading edge: fixed brisk spring (K=235, C=22), always chases its
         own target directly.
       - trailing edge: starts soft (KB=62) and stiffens toward KB=217 as
         ITS OWN remaining distance closes -- not the leading edge's state --
         so it lags at first (stretch) then snaps taut right at the end.
     ----------------------------------------------------------------------- */
  function initNavLight(navEl) {
    if (!navEl) return;
    const svg = navEl.querySelector('.nav-light');
    const core = navEl.querySelector('#navLightCore');
    const grad = navEl.querySelector('#navLightGrad');
    const linkEls = Array.from(navEl.querySelectorAll('a'));
    const activeEl = navEl.querySelector('a.active') || linkEls[0];
    if (!activeEl) return;

    const HEAD_K = 235, HEAD_C = 22;
    const TAIL_UNDERDAMP = 0.72; // same underdamped ratio as the head spring
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const rectOf = a => {
      const r = a.getBoundingClientRect();
      const n = navEl.getBoundingClientRect();
      return { left: r.left - n.left, right: r.right - n.left };
    };

    const left = { x: 0, v: 0, targetX: 0, tripStart: 0, trip: 1, lead: false };
    const right = { x: 0, v: 0, targetX: 0, tripStart: 0, trip: 1, lead: true };
    let laneY = 0;

    const layout = () => {
      const n = navEl.getBoundingClientRect();
      svg.setAttribute('width', n.width);
      svg.setAttribute('height', n.height);
      svg.setAttribute('viewBox', `0 0 ${n.width} ${n.height}`);
      // Fixed to the nav bar's own width, not the rod's span, so color always
      // reflects physical left-right position -- teal at Dashboard's end,
      // shading to the silvery --chrome by Diagnostics' end, regardless of
      // where the rod currently sits.
      grad.setAttribute('x1', 0);
      grad.setAttribute('x2', n.width);
      laneY = n.height - 2; // same baseline the old underline sat on
    };

    const setTarget = (targetEl, snap) => {
      const { left: l, right: r } = rectOf(targetEl);
      const movingRight = (l + r) >= (left.x + right.x);
      left.tripStart = left.x;
      right.tripStart = right.x;
      left.targetX = l;
      right.targetX = r;
      left.trip = Math.max(1, Math.abs(l - left.tripStart));
      right.trip = Math.max(1, Math.abs(r - right.tripStart));
      left.lead = !movingRight;  // left edge leads when sliding left
      right.lead = movingRight;  // right edge leads when sliding right
      if (snap) {
        left.x = l; left.v = 0;
        right.x = r; right.v = 0;
      }
    };

    const step = (edge, h) => {
      if (edge.lead) {
        edge.v += (-HEAD_K * (edge.x - edge.targetX) - HEAD_C * edge.v) * h;
      } else {
        const d = Math.abs(edge.targetX - edge.x);
        const home = 1 - easeOutCubic(Math.min(1, d / edge.trip));
        const KB = 62 + 155 * home;
        const CB = TAIL_UNDERDAMP * 2 * Math.sqrt(KB);
        edge.v += (-KB * (edge.x - edge.targetX) - CB * edge.v) * h;
      }
      edge.x += edge.v * h;
    };

    layout();
    setTarget(activeEl, true);
    // Re-snap once webfonts settle, in case text metrics shift the initial
    // link widths out from under us.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { layout(); setTarget(activeEl, true); });
    }

    let last = null;
    const frame = t => {
      if (last === null) last = t;
      const h = Math.min(0.05, (t - last) / 1000);
      last = t;

      step(left, h);
      step(right, h);

      // Stretched-thin reads dimmer -- so weight goes up while the rod is
      // actively opening or closing, back to a base 2px at rest.
      const speed = Math.min(1, (Math.abs(left.v) + Math.abs(right.v)) / 1400);
      svg.style.setProperty('--speed', speed.toFixed(3));

      core.setAttribute('x1', left.x);
      core.setAttribute('x2', right.x);
      core.setAttribute('y1', laneY);
      core.setAttribute('y2', laneY);

      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    linkEls.forEach(a => {
      a.addEventListener('mouseenter', () => setTarget(a, false));
      a.addEventListener('focus', () => setTarget(a, false));
    });
    navEl.addEventListener('mouseleave', () => setTarget(activeEl, false));
    navEl.addEventListener('focusout', e => {
      if (!navEl.contains(e.relatedTarget)) setTarget(activeEl, false);
    });
    window.addEventListener('resize', () => { layout(); setTarget(activeEl, true); });
  }

  function renderVersionBadge() {
    const badge = document.createElement('div');
    badge.className = 'pre-alpha-badge';
    badge.textContent = `pre-α, version ${PROTOCOL_VERSION}`;
    document.body.appendChild(badge);
  }

  function fmtPrice(v) {
    if (v < 0.01) return v.toFixed(6);
    if (v < 1) return v.toFixed(4);
    if (v >= 1000) return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return v.toFixed(2);
  }

  function getTickerTokens(quotes) {
    const ALWAYS_SHOW = ['SAVAX'];
    if (typeof poolAssets === 'undefined' || !poolAssets.assets) {
      console.warn('Pivot ticker: pool-assets.js not found, showing all quoted tokens.');
      return Object.keys(quotes);
    }
    const seen = new Set();
    poolAssets.assets.forEach(pair => pair.forEach(t => seen.add(t)));
    ALWAYS_SHOW.forEach(t => seen.add(t));
    return Array.from(seen);
  }

  function renderTicker(qdata) {
    const el = document.getElementById('app-ticker');
    if (!el) return;
    const quotes = qdata.quotes || {};
    const tokens = getTickerTokens(quotes).filter(t => t in quotes);
    if (tokens.length === 0) {
      el.innerHTML = '';
      return;
    }
    const unitHtml = tokens.map(t =>
      `<span class="ticker-item"><span class="sym">${t}</span><span class="price num">$${fmtPrice(quotes[t])}</span></span>`
    ).join('');

    el.innerHTML = `<div class="ticker-wrap"><div class="ticker-track">${unitHtml}</div></div>`;
    const track = el.querySelector('.ticker-track');
    const unitWidth = track.scrollWidth;
    const viewportWidth = el.clientWidth || window.innerWidth;
    const repeats = unitWidth > 0 ? Math.max(1, Math.ceil(viewportWidth / unitWidth)) : 1;
    const fullUnitHtml = unitHtml.repeat(repeats);
    track.innerHTML = fullUnitHtml + fullUnitHtml;
  }

  renderNav();
  renderVersionBadge();
  fetch('libs/quotes.json')
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(renderTicker)
    .catch(err => {
      const el = document.getElementById('app-ticker');
      if (el) el.innerHTML =
        `<div class="ticker-wrap"><div class="ticker-item" style="color:var(--red);">
          Ticker unavailable: could not load libs/quotes.json (${err.message})
        </div></div>`;
      console.error('Pivot ticker load failed:', err);
    });
})();
