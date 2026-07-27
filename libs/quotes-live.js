// ============================================================================
// DOUG PRANK — inside joke, fully self-contained.
// To remove entirely: delete this file, then delete the one <script src=
// "libs/gravity-prank.js"> line that loads it. Nothing else references it.
//
// The joke: Doug used to click "Quotes" in the Automated Tasks list (right
// side) expecting to copy a price, instead of the actual copyable quotes in
// the Quotes of the Day panel (left side). This makes that specific click
// trigger a "Google Gravity" moment — a boom, then everything on the page
// crumbles apart and falls, bouncing off each other and the screen edges.
// ============================================================================
(function () {
  let fired = false;

  function triggerGravityPrank() {
    if (fired) return;
    fired = true;

    // ---- boom: quick white flash + screen shake ---------------------------
    const flash = document.createElement('div');
    flash.style.cssText =
      'position:fixed;inset:0;background:#fff;opacity:0;z-index:99999;' +
      'pointer-events:none;transition:opacity 70ms ease;';
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0.9'; });
    setTimeout(() => {
      flash.style.transition = 'opacity 220ms ease';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 260);
    }, 90);

    document.body.style.transition = 'transform 55ms ease';
    [[-9, 5], [11, -7], [-7, 8], [6, -4], [0, 0]].forEach((s, i) => {
      setTimeout(() => {
        document.body.style.transform = `translate(${s[0]}px, ${s[1]}px)`;
      }, i * 55);
    });

    setTimeout(loadMatterThenDrop, 300);
  }

  function loadMatterThenDrop() {
    if (window.Matter) { dropEverything(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    s.onload = dropEverything;
    document.head.appendChild(s);
  }

  function dropEverything() {
    document.body.style.overflow = 'hidden';
    const { Engine, Runner, Bodies, World, Body } = Matter;
    const engine = Engine.create();
    const runner = Runner.create();
    const W = window.innerWidth, H = window.innerHeight;

    const wallOpts = { isStatic: true, restitution: 0.6 };
    World.add(engine.world, [
      Bodies.rectangle(W / 2, H + 30, W * 2, 60, wallOpts),   // floor
      Bodies.rectangle(-30, H / 2, 60, H * 2, wallOpts),      // left wall
      Bodies.rectangle(W + 30, H / 2, 60, H * 2, wallOpts),   // right wall
    ]);

    // Row/item-level content only — the big panel frames are left alone so
    // they read as empty shells while everything inside tumbles out of them,
    // rather than the whole panel and its contents both falling separately
    // and visually doubling up.
    const selector = [
      'nav.links a', '.brand', '.nav-cta', '.ticker-item',
      '.task-compact', '.task-row', '.quote-row',
      '.diag-section-heading', '.coverage-pct', '.page-head', 'h1',
    ].join(', ');

    const targets = Array.from(document.querySelectorAll(selector)).filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < H;
    });

    const pairs = targets.map(el => {
      const r = el.getBoundingClientRect();
      el.style.position = 'fixed';
      el.style.left = r.left + 'px';
      el.style.top = r.top + 'px';
      el.style.width = r.width + 'px';
      el.style.height = r.height + 'px';
      el.style.margin = '0';
      el.style.zIndex = '9998';
      el.style.willChange = 'transform';

      const body = Bodies.rectangle(
        r.left + r.width / 2, r.top + r.height / 2, r.width, r.height,
        { restitution: 0.5, friction: 0.2 }
      );
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: 0 });
      World.add(engine.world, body);

      return { el, body, left: r.left, top: r.top, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });

    Runner.run(runner, engine);

    (function tick() {
      pairs.forEach(({ el, body, cx, cy }) => {
        el.style.transform =
          `translate(${body.position.x - cx}px, ${body.position.y - cy}px) rotate(${body.angle}rad)`;
      });
      requestAnimationFrame(tick);
    })();
  }

  // Delegated listener — works even though #task-list's rows are added later
  // via innerHTML once the workflows fetch resolves.
  const list = document.getElementById('task-list');
  if (list) {
    list.addEventListener('click', e => {
      const nameEl = e.target.closest('.task-name');
      if (!nameEl || nameEl.textContent.trim() !== 'Quotes') return;
      triggerGravityPrank();
    });
  }
})();
