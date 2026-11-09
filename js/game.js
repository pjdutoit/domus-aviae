/* Domus Aviae — the game engine: map rendering, tap-to-walk, the Smarties trail. */
(function () {
  'use strict';

  const M = window.VillaMap, A = window.Art, S = window.Sprites;
  const TILE = M.TILE;
  const SPEED = 58;                         // logical px per second
  const SAVE_KEY = 'domusAviae.v1';
  const SMARTIES = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#ec407a', '#8e24aa', '#6d4c41'];
  const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]];

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  let dpr = 1, zoom = 4, cssW = 0, cssH = 0;
  let staticMap = null;
  let running = false, last = 0, time = 0;

  const state = {
    found: new Set(), unlocked: false, doorOpen: 0, finaleSeen: false,
    lang: 'la', paused: true, busy: false
  };
  const player = { tx: M.START[0], ty: M.START[1], x: 0, y: 0, path: [], facing: 'up', walkT: 0, moving: false, pending: null };
  const cam = { x: 0, y: 0, init: false };
  let trail = [], trailSet = new Set(), particles = [], tapMark = null, currentRoom = null;
  let procession = [];

  // ------------------------------------------------------------ save / load
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        found: Array.from(state.found), finale: state.finaleSeen, lang: state.lang, pos: [player.tx, player.ty]
      }));
    } catch (e) { /* storage unavailable: the game still works */ }
  }
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!d) return false;
      (d.found || []).forEach(id => { if (window.MEMORIES.some(m => m.id === id)) state.found.add(id); });
      state.finaleSeen = !!d.finale;
      if (d.lang === 'en' || d.lang === 'la') state.lang = d.lang;
      if (d.pos && M.walkable(d.pos[0], d.pos[1], true)) { player.tx = d.pos[0]; player.ty = d.pos[1]; }
      return state.found.size > 0;
    } catch (e) { return false; }
  }
  function resetSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  }

  // ------------------------------------------------------------ pathfinding (8-way BFS, no corner cutting)
  function bfs(sx, sy, tx, ty) {
    const W = M.W, H = M.H;
    if (sx === tx && sy === ty) return [];
    const prev = new Int32Array(W * H).fill(-1);
    const start = sy * W + sx;
    prev[start] = start;
    const q = [start];
    let head = 0;
    const target = ty * W + tx;
    while (head < q.length) {
      const cur = q[head++];
      if (cur === target) break;
      const cx = cur % W, cy = (cur / W) | 0;
      for (let k = 0; k < 8; k++) {
        const dx = DIRS[k][0], dy = DIRS[k][1];
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (prev[ni] !== -1) continue;
        if (!M.walkable(nx, ny, state.unlocked)) continue;
        if (dx && dy && (!M.walkable(cx + dx, cy, state.unlocked) || !M.walkable(cx, cy + dy, state.unlocked))) continue;
        prev[ni] = cur;
        q.push(ni);
      }
    }
    if (prev[target] === -1) return null;
    const path = [];
    for (let c = target; c !== start; c = prev[c]) path.push([c % W, (c / W) | 0]);
    return path.reverse();
  }

  function nearestWalkable(tx, ty) {
    if (M.walkable(tx, ty, state.unlocked)) return [tx, ty];
    for (let r = 1; r < 4; r++) {
      let best = null, bd = 1e9;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = tx + dx, y = ty + dy;
        if (!M.walkable(x, y, state.unlocked)) continue;
        const d = Math.hypot(dx, dy * 1.2);
        if (d < bd) { bd = d; best = [x, y]; }
      }
      if (best) return best;
    }
    return null;
  }

  // ------------------------------------------------------------ trail
  function nextTarget() {
    for (const m of window.MEMORIES) if (!state.found.has(m.id)) return m.id;
    if (state.unlocked && !state.finaleSeen) return 'finale';
    return null;
  }
  function computeTrail() {
    trail = []; trailSet = new Set();
    const id = nextTarget();
    if (!id) return;
    const s = M.STANDS[id];
    const p = bfs(player.tx, player.ty, s[0], s[1]);
    if (!p) return;
    trail = p;
    p.forEach(([x, y]) => trailSet.add(x + ',' + y));
  }

  // ------------------------------------------------------------ movement
  function feet(tx, ty) { return [tx * TILE + 8, ty * TILE + 12]; }

  function walkTo(x, y, pending) {
    const p = bfs(player.tx, player.ty, x, y);
    if (p === null) return false;
    player.path = p;
    player.pending = pending || null;
    tapMark = { x: x * TILE + 8, y: y * TILE + 11, t: 0 };
    if (!p.length) arrive();
    return true;
  }

  function enterTile(x, y) {
    player.tx = x; player.ty = y;
    const key = x + ',' + y;
    if (trailSet.has(key)) {
      popSmartie(x * TILE + 8, y * TILE + 10, key);
      trailSet.delete(key);
    }
    const room = M.roomAt(x, y);
    if (room && room !== currentRoom) {
      currentRoom = room;
      const n = window.ROOM_NAMES[room];
      if (n && !state.paused) window.UI.toast(romanCaps(n.la), n.en, true);
    }
  }

  function arrive() {
    const id = player.pending;
    player.pending = null;
    computeTrail();
    if (id === 'finale' || (!id && state.unlocked && atStand('finale'))) {
      if (state.unlocked) startFinale();
      return;
    }
    if (id) { openMemory(id); return; }
    // walking onto the spot of a memory not yet found also opens it
    for (const m of window.MEMORIES) {
      if (!state.found.has(m.id) && atStand(m.id)) { openMemory(m.id); return; }
    }
  }
  function atStand(id) { const s = M.STANDS[id]; return s && s[0] === player.tx && s[1] === player.ty; }

  function update(dt) {
    time += dt;
    if (player.path.length) {
      const [nx, ny] = player.path[0];
      const [gx, gy] = feet(nx, ny);
      const dx = gx - player.x, dy = gy - player.y;
      const d = Math.hypot(dx, dy);
      const step = SPEED * dt;
      if (Math.abs(dx) > Math.abs(dy) + 0.5) player.facing = dx > 0 ? 'right' : 'left';
      else if (Math.abs(dy) > 0.5) player.facing = dy > 0 ? 'down' : 'up';
      if (d <= step) {
        player.x = gx; player.y = gy;
        player.path.shift();
        enterTile(nx, ny);
        if (!player.path.length) arrive();
      } else {
        player.x += dx / d * step; player.y += dy / d * step;
      }
      player.walkT += dt;
      player.moving = true;
    } else {
      player.moving = false;
      player.walkT = 0;
    }

    if (state.unlocked && state.doorOpen < 1) state.doorOpen = Math.min(1, state.doorOpen + dt * 0.8);

    particles.forEach(p => { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 140 * dt; });
    particles = particles.filter(p => p.t < p.life);
    if (tapMark) { tapMark.t += dt; if (tapMark.t > 0.6) tapMark = null; }
    updateProcession(dt);
    updateCamera(dt);
  }

  // ------------------------------------------------------------ Aardklop procession (cousins following Avia)
  function setupProcession() {
    const C = window.CHARACTERS;
    const loop = [[15.5, 32.2], [21.4, 32.2], [21.4, 34.4], [15.5, 34.4]];
    let total = 0;
    const segs = loop.map((p, i) => { const q = loop[(i + 1) % loop.length]; const l = Math.hypot(q[0] - p[0], q[1] - p[1]); total += l; return { p, q, l }; });
    const walkers = [C.avia, C.me.child].concat(C.cousins);
    procession = walkers.map((spec, i) => ({ spec, off: -i * 0.85 + (i % 2 ? 0.25 : 0), side: i === 0 ? 0 : (i % 2 ? 0.45 : -0.2), segs, total, x: 0, y: 0, facing: 'right', t: i * 0.13 }));
  }
  function updateProcession(dt) {
    procession.forEach(w => {
      w.t += dt;
      let d = ((time * 0.9 + w.off) % w.total + w.total) % w.total;
      for (const s of w.segs) {
        if (d <= s.l) {
          const k = d / s.l;
          const x = s.p[0] + (s.q[0] - s.p[0]) * k, y = s.p[1] + (s.q[1] - s.p[1]) * k;
          const dx = s.q[0] - s.p[0], dy = s.q[1] - s.p[1];
          w.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
          const nx = -dy / s.l, ny = dx / s.l;      // sideways offset: "behind and beside"
          w.x = (x + nx * w.side) * TILE; w.y = (y + ny * w.side) * TILE;
          break;
        }
        d -= s.l;
      }
    });
  }

  // ------------------------------------------------------------ camera & sizing
  function resize() {
    const r = canvas.getBoundingClientRect();
    cssW = Math.max(1, r.width); cssH = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    const tilesAcross = Math.min(cssW, cssH) > 600 ? 13 : 11;
    zoom = Math.max(1, Math.round(Math.min(canvas.width, canvas.height) / (TILE * tilesAcross)));
    ctx.imageSmoothingEnabled = false;
    cam.init = false;
  }
  function updateCamera(dt) {
    const vw = canvas.width / zoom, vh = canvas.height / zoom;
    const mw = M.W * TILE, mh = M.H * TILE;
    let tx = player.x - vw / 2, ty = player.y - 8 - vh / 2;
    tx = mw <= vw ? (mw - vw) / 2 : Math.max(0, Math.min(mw - vw, tx));
    ty = mh <= vh ? (mh - vh) / 2 : Math.max(0, Math.min(mh - vh, ty));
    if (!cam.init) { cam.x = tx; cam.y = ty; cam.init = true; return; }
    const k = 1 - Math.exp(-dt * 5);
    cam.x += (tx - cam.x) * k; cam.y += (ty - cam.y) * k;
  }

  // ------------------------------------------------------------ input
  function onPointer(e) {
    if (state.paused || state.busy) return;
    e.preventDefault();
    window.GameAudio.unlock();
    const r = canvas.getBoundingClientRect();
    const lx = (e.clientX - r.left) * dpr / zoom + Math.round(cam.x * zoom) / zoom;
    const ly = (e.clientY - r.top) * dpr / zoom + Math.round(cam.y * zoom) / zoom;
    const tx = Math.floor(lx / TILE), ty = Math.floor(ly / TILE);
    handleTileTap(tx, ty, ly - ty * TILE);
  }

  function handleTileTap(tx, ty, fy) {
    // memory props (also accept a tap on the upper part of the tile below tall props)
    const hs = M.hotspotAt(tx, ty) || M.hotspotAt(tx, ty + 1);
    if (hs) {
      if (hs.finale) {
        if (!state.unlocked) { lockedToast(); return; }
        walkTo(M.STANDS.finale[0], M.STANDS.finale[1], 'finale');
        return;
      }
      const s = M.STANDS[hs.memory];
      walkTo(s[0], s[1], hs.memory);
      return;
    }
    // the locked study door
    const D = M.TABLINUM_DOOR;
    if (!state.unlocked && tx === D[0] && (ty === D[1] || ty === D[1] - 1)) {
      lockedToast();
      walkTo(D[0], D[1] + 1, null);
      return;
    }
    if (!state.unlocked && M.roomAt(tx, ty) === 'tablinum') { lockedToast(); return; }
    const t = nearestWalkable(tx, ty);
    if (t) walkTo(t[0], t[1], null);
  }

  function lockedToast() { window.UI.toast(window.TEXTS.lockedLa, window.TEXTS.lockedEn); window.GameAudio.knock(); }

  window.addEventListener('keydown', e => {
    if (state.paused || state.busy) return;
    const k = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
    if (!k) return;
    e.preventDefault();
    if (player.path.length > 1) return;
    const nx = player.tx + k[0], ny = player.ty + k[1];
    if (M.walkable(nx, ny, state.unlocked)) walkTo(nx, ny, null);
    else handleTileTap(nx, ny, 8);
  });

  // ------------------------------------------------------------ memories & finale
  function openMemory(id) {
    const isNew = !state.found.has(id);
    if (isNew) { state.found.add(id); save(); }
    state.busy = true;
    window.GameAudio.chime(isNew);
    window.UI.updateCounter(state.found.size);
    window.UI.openCard(id, isNew, () => {
      state.busy = false;
      if (state.found.size === window.MEMORIES.length && !state.unlocked) unlock();
      computeTrail();
    });
  }

  function unlock() {
    state.unlocked = true;
    window.GameAudio.door();
    setTimeout(() => window.UI.toast(window.TEXTS.unlockedLa, window.TEXTS.unlockedEn), 250);
    computeTrail();
    save();
  }

  function startFinale() {
    state.busy = true;
    player.facing = 'up';
    window.UI.openFinale(() => {
      state.finaleSeen = true;
      state.busy = false;
      save();
      computeTrail();
    });
  }

  // ------------------------------------------------------------ rendering
  function romanCaps(s) { return s.toUpperCase().replace(/U/g, 'V'); }

  function drawSmartie(x, y, col, bob) {
    A.R(ctx, 'rgba(40,20,10,0.25)', x - 2, y + 2, 5, 1);
    A.R(ctx, col, x - 2, y - 1 + bob, 5, 3);
    A.R(ctx, col, x - 1, y - 2 + bob, 3, 5);
    A.R(ctx, 'rgba(255,255,255,0.65)', x - 1, y - 1 + bob, 1, 1);
    A.R(ctx, 'rgba(0,0,0,0.18)', x - 1, y + 2 + bob, 3, 1);
  }

  function drawTrail() {
    const n = trail.length;
    for (let i = 0; i < n; i++) {
      const [x, y] = trail[i];
      const key = x + ',' + y;
      if (!trailSet.has(key)) continue;
      if (i === n - 1) continue;        // the memory itself gets a sparkle instead
      const h = A.hash(x, y), h2 = A.hash(y + 17, x + 3);
      const col = SMARTIES[Math.floor(h * SMARTIES.length)];
      const bob = Math.sin(time * 5 - i * 0.7) > 0.85 ? -1 : 0;
      drawSmartie(x * TILE + 5 + Math.round(h2 * 6), y * TILE + 7 + Math.round(h * 4), col, bob);
    }
  }

  function drawSparkle(x, y, size, alpha, col) {
    ctx.globalAlpha = alpha;
    A.R(ctx, col, x - size, y, size * 2 + 1, 1);
    A.R(ctx, col, x, y - size, 1, size * 2 + 1);
    A.R(ctx, '#fffbe8', x, y, 1, 1);
    if (size > 2) { A.R(ctx, col, x - 1, y - 1, 3, 3); A.R(ctx, '#fffbe8', x, y, 1, 1); }
    ctx.globalAlpha = 1;
  }

  function drawHotspots() {
    const next = nextTarget();
    M.PROPS.forEach(p => {
      const id = p.finale ? 'finale' : p.memory;
      if (!id) return;
      const cx = Math.round((p.x + (p.w || 1) / 2) * TILE);
      const top = p.t === 'forumfacade' || p.t === 'bakery' ? (p.y + (p.h || 1)) * TILE - 18 : p.y * TILE - (p.t === 'banner' ? 14 : p.t === 'piano' ? 9 : 4);
      if (id === 'finale') {
        if (!state.unlocked) return;
        const a = 0.6 + Math.sin(time * 3) * 0.4;
        drawSparkle(cx, top - 2, 3, a, '#ffd66b');
        return;
      }
      if (state.found.has(id)) {
        A.R(ctx, 'rgba(201,162,74,0.9)', cx - 1, top - 1, 3, 1); A.R(ctx, 'rgba(201,162,74,0.9)', cx, top - 2, 1, 3);
        return;
      }
      const isNext = id === next;
      const pulse = Math.sin(time * (isNext ? 4 : 2.2) + cx) * 0.5 + 0.5;
      if (isNext) {
        ctx.globalAlpha = 0.18 + pulse * 0.2;
        ctx.fillStyle = '#ffd66b';
        ctx.beginPath(); ctx.ellipse(cx, top + 10, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
      drawSparkle(cx, top - 2 - Math.round(pulse * 2), isNext ? 3 : 2, 0.55 + pulse * 0.45, '#ffd66b');
    });
  }

  function drawWorld() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#24160f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const ox = -Math.round(cam.x * zoom), oy = -Math.round(cam.y * zoom);
    ctx.setTransform(zoom, 0, 0, zoom, ox, oy);
    ctx.imageSmoothingEnabled = false;
    if (staticMap) ctx.drawImage(staticMap, 0, 0);
    M.renderLive(ctx, time, state);
    drawTrail();
    if (tapMark) {
      const k = tapMark.t / 0.6;
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = '#ffd66b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(tapMark.x, tapMark.y, 3 + k * 5, 2 + k * 3, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // depth-sorted: tall scenery + characters
    const list = M.TALL.slice();
    const frame = player.moving ? ['walk1', 'stand', 'walk2', 'stand'][Math.floor(player.walkT * 8) % 4] : 'stand';
    list.push({ baseY: player.y, draw: () => S.drawPerson(ctx, window.CHARACTERS.avia, player.x, player.y, { facing: player.facing, pose: frame }) });
    procession.forEach((w, i) => {
      const pose = ['walk1', 'stand', 'walk2', 'stand'][Math.floor(w.t * 6) % 4];
      list.push({ baseY: w.y, draw: () => S.drawPerson(ctx, w.spec, Math.round(w.x), Math.round(w.y), { facing: w.facing, pose }) });
    });
    list.sort((a, b) => a.baseY - b.baseY);
    list.forEach(o => o.draw(ctx, time));

    drawHotspots();
    particles.forEach(p => { ctx.globalAlpha = 1 - p.t / p.life; A.R(ctx, p.c, Math.round(p.x), Math.round(p.y), 2, 2); });
    ctx.globalAlpha = 1;

    // labels in screen space
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawLabels(ox, oy);
    // warm vignette
    const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.35, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.75);
    g.addColorStop(0, 'rgba(40,15,5,0)');
    g.addColorStop(1, 'rgba(40,15,5,0.38)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  function drawLabels(ox, oy) {
    const tileCss = TILE * zoom / dpr;
    const fsCss = Math.max(10, Math.min(16, tileCss * 0.34));
    const fs = Math.round(fsCss * dpr);
    ctx.font = '700 ' + fs + 'px Cinzel, Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    M.LABELS.forEach(l => {
      const n = window.ROOM_NAMES[l.room];
      const text = l.text || romanCaps(n.la);
      const sx = l.x * TILE * zoom + ox, sy = l.y * TILE * zoom + oy;
      if (sx < -200 || sy < -50 || sx > canvas.width + 200 || sy > canvas.height + 50) return;
      ctx.letterSpacing = Math.round(fs * 0.12) + 'px';
      const w = ctx.measureText(text).width + fs * 1.2, h = fs * 1.7;
      ctx.shadowColor = 'rgba(30,10,5,0.35)'; ctx.shadowBlur = 4 * dpr; ctx.shadowOffsetY = 1 * dpr;
      ctx.fillStyle = l.sign ? 'rgba(98,24,15,0.92)' : 'rgba(246,239,226,0.9)';
      roundRect(sx - w / 2, sy - h / 2, w, h, 3 * dpr);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#c9a24a'; ctx.lineWidth = Math.max(1, dpr);
      ctx.stroke();
      ctx.fillStyle = l.sign ? '#f0d68e' : '#7a1f17';
      ctx.fillText(text, sx + fs * 0.06, sy + fs * 0.06);
    });
    ctx.letterSpacing = '0px';
  }

  function popSmartie(x, y, key) {
    const h = A.hash(x, y);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + h;
      particles.push({ x, y, vx: Math.cos(a) * 26, vy: Math.sin(a) * 22 - 26, t: 0, life: 0.45, c: SMARTIES[(i + Math.floor(h * 8)) % SMARTIES.length] });
    }
    window.GameAudio.pop();
  }

  function frame(ts) {
    if (!running) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000);
    last = ts;
    update(dt);
    drawWorld();
    requestAnimationFrame(frame);
  }

  // ------------------------------------------------------------ public
  function init(images) {
    staticMap = M.renderStatic(images);
    const params = new URLSearchParams(location.search);
    if (params.has('reset')) resetSave();
    const resumed = load();
    const dbg = params.get('debug');
    if (dbg) {
      const n = dbg === 'all' || dbg === '1' ? window.MEMORIES.length : Math.min(window.MEMORIES.length, parseInt(dbg, 10) || 0);
      window.MEMORIES.slice(0, n).forEach(m => state.found.add(m.id));
    }
    if (state.found.size === window.MEMORIES.length) { state.unlocked = true; state.doorOpen = 1; }
    const f = feet(player.tx, player.ty);
    player.x = f[0]; player.y = f[1];
    currentRoom = M.roomAt(player.tx, player.ty);
    setupProcession();
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointerdown', onPointer);
    computeTrail();
    running = true;
    requestAnimationFrame(frame);
    return resumed;
  }

  function begin() { state.paused = false; computeTrail(); }

  function restart() {
    resetSave();
    state.found.clear(); state.unlocked = false; state.doorOpen = 0; state.finaleSeen = false;
    player.path = []; player.tx = M.START[0]; player.ty = M.START[1];
    const f = feet(player.tx, player.ty); player.x = f[0]; player.y = f[1]; player.facing = 'up';
    cam.init = false;
    window.UI.updateCounter(0);
    computeTrail();
    save();
  }

  function setLang(l) { state.lang = l; save(); }

  window.Game = {
    init, begin, restart, setLang, state, romanCaps,
    // debugging / testing helpers
    debug: {
      teleport(x, y) { player.tx = x; player.ty = y; const f = feet(x, y); player.x = f[0]; player.y = f[1]; player.path = []; computeTrail(); },
      openMemory, startFinale, unlock, walkTo, player, cam
    }
  };
})();
