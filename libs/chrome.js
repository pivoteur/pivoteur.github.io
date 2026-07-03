/* ==========================================================================
   Pivot Protocol — Chrome injector
   Renders the top ticker + nav bar into placeholder divs so markup isn't
   duplicated across every page. Expects:
     <div id="app-ticker"></div>
     <div id="app-nav"></div>
   ========================================================================== */

(function () {
  const NAV_LINKS = [
    { label: 'Dashboard',      href: 'index.html' },
    { label: 'Distributions',  href: 'distributions.html' },
    { label: 'Pools',          href: 'pools.html' },
    { label: 'Treasury',       href: 'treasury.html' },
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
        <div class="brand">
          <img class="brand-mark" src="imgs/cropped-pivot-logo.png" alt="Pivot Technologies">
          <span class="brand-name">Pivot Technologies, LLC</span>
        </div>
        <nav class="links">${links}</nav>
        <div class="nav-right">
          <button class="nav-cta" onclick="location.href='login.html'">Profile</button>
        </div>
      </div>`;
  }

  function fmtPrice(v) {
    if (v < 0.01) return v.toFixed(6);
    if (v < 1) return v.toFixed(4);
    if (v >= 1000) return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return v.toFixed(2);
  }

  function renderTicker(qdata) {
    const el = document.getElementById('app-ticker');
    if (!el) return;
    const quotes = qdata.quotes || {};
    // Render every token present in the payload — no whitelist.
    const tokens = Object.keys(quotes);
    if (tokens.length === 0) {
      el.innerHTML = '';
      return;
    }
    const items = tokens.map(t =>
      `<span class="ticker-item"><span class="sym">${t}</span><span class="price num">$${fmtPrice(quotes[t])}</span></span>`
    ).join('');
    // duplicated once for a seamless scroll loop
    el.innerHTML = `<div class="ticker-wrap"><div class="ticker-track">${items}${items}</div></div>`;
  }

  renderNav();

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
