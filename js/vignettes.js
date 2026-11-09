/* Domus Aviae — the little pixel scenes shown on each memory card and in the finale.
   Each scene is a 128x80 stage, drawn with the same characters and furniture as the map. */
(function () {
  'use strict';
  const VW = 128, VH = 80;
  let floors = {};

  function setImages(images) {
    floors = {};
    Object.keys(images).forEach(k => {
      const c = document.createElement('canvas');
      c.width = 16; c.height = 16;
      const x = c.getContext('2d');
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
      x.drawImage(images[k], 0, 0, 16, 16);
      floors[k] = c;
    });
  }

  const R = (ctx, c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const P = () => window.Art.P;
  const person = (ctx, spec, x, y, o) => window.Sprites.drawPerson(ctx, spec, x, y, o || {});
  const CH = () => window.CHARACTERS;
  const walk = (t, i, speed) => ['walk1', 'stand', 'walk2', 'stand'][Math.floor(t * (speed || 6) + i) % 4];

  // ---------------------------------------------------------------- backdrops
  function room(ctx, floorKey, wallTop, opts) {
    opts = opts || {};
    const wallH = opts.wallH || 28;
    const f = floors[floorKey];
    for (let y = wallH; y < VH; y += 16) for (let x = 0; x < VW; x += 16) {
      if (f) ctx.drawImage(f, x, y); else R(ctx, '#e9e0cf', x, y, 16, 16);
    }
    R(ctx, wallTop || '#9b2c22', 0, 0, VW, wallH);
    R(ctx, 'rgba(255,255,255,0.06)', 0, 0, VW, 2);
    R(ctx, '#c9a24a', 0, 6, VW, 1);
    R(ctx, '#4a1610', 0, wallH - 6, VW, 6);
    R(ctx, '#97752c', 0, wallH - 6, VW, 1);
    // painted panels (Pompeian style)
    if (!opts.noPanels) for (let x = 6; x < VW; x += 40) { R(ctx, 'rgba(255,230,180,0.10)', x, 10, 28, wallH - 19); R(ctx, 'rgba(201,162,74,0.5)', x, 10, 28, 1); }
    R(ctx, 'rgba(60,20,10,0.25)', 0, wallH, VW, 3);
  }

  function outdoors(ctx, ground) {
    const g = ctx.createLinearGradient(0, 0, 0, 40);
    g.addColorStop(0, '#8fc3e0'); g.addColorStop(1, '#f2dfb8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, VW, 40);
    R(ctx, '#f8f0d0', 100, 6, 8, 8); R(ctx, '#fff8e0', 101, 7, 6, 6);    // sun
    for (let y = 40; y < VH; y += 16) for (let x = 0; x < VW; x += 16) {
      if (ground === 'grass') window.Art.grass(ctx, x, y, x / 16, y / 16);
      else window.Art.paving(ctx, x, y, x / 16, y / 16);
    }
  }

  function night(ctx, a) { R(ctx, 'rgba(18,16,48,' + (a || 0.38) + ')', 0, 0, VW, VH); }
  function glow(ctx, x, y, r, col) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function text(ctx, s, x, y, size, col, font) {
    ctx.font = (font || '700 ') + size + 'px Cinzel, Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = col; ctx.fillText(s, x, y);
  }
  function note(ctx, x, y, col) { R(ctx, col, x, y + 3, 2, 2); R(ctx, col, x + 1, y, 1, 4); R(ctx, col, x + 2, y, 2, 1); }

  // ---------------------------------------------------------------- scenes
  const SCENES = {
    macncheese(ctx, t) {
      room(ctx, 'rmarble21');
      P().tv(ctx, 92, 16, 2, 1, t);
      // Avia in the doorway with the dish
      R(ctx, '#3a2014', 14, 10, 22, 18); R(ctx, '#f6e7c4', 16, 12, 18, 16);
      const C = CH();
      person(ctx, C.avia, 26, 66, { facing: 'right', pose: 'carry' });
      R(ctx, '#fbf8f1', 20, 56, 14, 4); R(ctx, '#f0b93a', 21, 55, 12, 2); R(ctx, '#d58f22', 23, 55, 2, 1); R(ctx, '#d58f22', 28, 55, 3, 1);
      const s = Math.floor(t * 3) % 2;
      R(ctx, 'rgba(255,255,255,0.7)', 24 + s, 50, 1, 3); R(ctx, 'rgba(255,255,255,0.6)', 29 - s, 48, 1, 4);
      // grandchildren running to the table
      const kids = [C.me.child].concat(C.cousins);
      kids.forEach((k, i) => {
        const x = 54 + i * 10 + Math.round(Math.sin(t * 3 + i) * 1.5);
        const y = 62 + (i % 3) * 6;
        person(ctx, k, x, y, { facing: 'left', pose: walk(t, i, 8) });
      });
    },

    millionaire(ctx, t) {
      room(ctx, 'rmarble21', '#7e231c', { wallH: 34, noPanels: true });
      // big TV with the quiz on screen
      R(ctx, '#18161b', 34, 2, 60, 34); R(ctx, '#203a7e', 36, 4, 56, 30);
      const pulse = Math.sin(t * 2) * 0.5 + 0.5;
      R(ctx, 'rgba(120,160,255,' + (0.15 + pulse * 0.15) + ')', 36, 4, 56, 30);
      R(ctx, '#0d1430', 40, 8, 48, 7); R(ctx, '#c9a24a', 40, 8, 48, 1); R(ctx, '#c9a24a', 40, 14, 48, 1);
      for (let i = 0; i < 4; i++) {
        const x = 40 + (i % 2) * 25, y = 18 + Math.floor(i / 2) * 7;
        const lit = i === 2 && Math.floor(t * 1.5) % 2 === 0;
        R(ctx, lit ? '#e8a530' : '#0d1430', x, y, 23, 5); R(ctx, '#c9a24a', x, y, 23, 1); R(ctx, '#c9a24a', x, y + 4, 23, 1);
      }
      R(ctx, '#55321d', 30, 36, 68, 4);
      glow(ctx, 64, 30, 60, 'rgba(110,150,255,0.18)');
      // on the couch, seen from behind
      const C = CH();
      person(ctx, C.avia, 52, 68, { facing: 'up', pose: 'sit', noShadow: true });
      person(ctx, C.me.teen, 70, 68, { facing: 'up', pose: 'sit', noShadow: true });
      person(ctx, C.cousins[3], 86, 70, { facing: 'up', pose: 'sit', noShadow: true });
      P().couch(ctx, 32, 63, 4);
      // a raised hand: "final answer!"
      if (Math.floor(t * 0.8) % 2 === 0) { R(ctx, C.me.teen.top, 75, 46, 1, 5); R(ctx, C.me.teen.skin, 75, 45, 1, 1); }
    },

    christmas(ctx, t) {
      room(ctx, 'rmarble21', '#6e1f19');
      // string of lights along the wall
      const cols = ['#ffd75a', '#ff7b6b', '#8fd3ff', '#9be27a'];
      R(ctx, '#3a2a20', 0, 9, VW, 1);
      for (let x = 4; x < VW; x += 8) R(ctx, (Math.floor(t * 2) + x / 8) % 3 ? cols[(x / 8) % 4] : '#4a3a30', x, 10, 2, 2);
      P().xtree(ctx, 6, 38, 1, 1, t);
      // all the cousins asleep on the floor
      const C = CH();
      const kids = [C.me.child].concat(C.cousins);
      kids.forEach((k, i) => {
        const row = i < 4 ? 0 : 1;
        const x = 30 + (row ? 8 : 0) + (i % 4) * 22;
        window.Sprites.drawSleeper(ctx, k, x, 36 + row * 20, ['#3567b0', '#c0473a', '#3c8d5a', '#d0a03a', '#7d5bb5', '#2f8f83', '#b8463a'][i]);
      });
      night(ctx, 0.42);
      glow(ctx, 14, 30, 26, 'rgba(255,210,120,0.25)');
      // Zzz
      const z = (t * 6) % 12;
      ctx.globalAlpha = 1 - z / 12;
      text(ctx, 'z', 60, 30 - z, 6, '#f4ecd8', '400 ');
      text(ctx, 'z', 104, 34 - ((z + 6) % 12), 5, '#f4ecd8', '400 ');
      ctx.globalAlpha = 1;
    },

    latin(ctx, t) {
      room(ctx, 'rmarble6');
      // a wall tablet with a verb being learned
      R(ctx, '#e9e0cf', 34, 8, 60, 14); R(ctx, '#c9a24a', 34, 8, 60, 1); R(ctx, '#c9a24a', 34, 21, 60, 1);
      text(ctx, 'AMO · AMAS · AMAT', 64, 15.5, 5.5, '#7a1f17');
      const C = CH();
      person(ctx, C.avia, 46, 52, { facing: 'down', pose: 'sit' });
      person(ctx, C.me.teen, 82, 52, { facing: 'down', pose: 'sit' });
      P().dtable(ctx, 30, 46, 4, 2);
      // Avia's finger tracing the book
      if (Math.floor(t * 2) % 2 === 0) R(ctx, C.avia.skin, 50, 54, 1, 2);
    },

    myths(ctx, t) {
      room(ctx, 'rmarble6');
      const C = CH();
      person(ctx, C.avia, 36, 56, { facing: 'right', pose: 'sit' });
      P().desk(ctx, 14, 50, 3);
      P().greekvase(ctx, 108, 52);
      person(ctx, C.me.child, 84, 72, { facing: 'left', pose: 'sit' });
      // the story bubble: lightning of Zeus, a ship on the wine-dark sea
      const bob = Math.round(Math.sin(t * 2) * 1);
      const bx = 50, by = 6 + bob;
      R(ctx, '#fbf6ea', bx + 2, by, 40, 26); R(ctx, '#fbf6ea', bx, by + 2, 44, 22);
      R(ctx, '#c9a24a', bx + 2, by, 40, 1); R(ctx, '#c9a24a', bx + 2, by + 25, 40, 1);
      R(ctx, '#fbf6ea', bx + 6, by + 26, 4, 3); R(ctx, '#fbf6ea', bx + 3, by + 30, 2, 2);
      R(ctx, '#3d6f9a', bx + 4, by + 17, 36, 6);                         // sea
      R(ctx, '#6a3a20', bx + 22, by + 14, 12, 3); R(ctx, '#6a3a20', bx + 24, by + 17, 8, 1);   // ship
      R(ctx, '#7a5a3a', bx + 27, by + 5, 1, 9); R(ctx, '#f4ecd8', bx + 28, by + 6, 5, 6);
      R(ctx, '#b8463a', bx + 28, by + 8, 5, 1);
      const flash = Math.floor(t * 2.5) % 3 === 0;
      const bolt = flash ? '#fff2a0' : '#e8b830';
      R(ctx, bolt, bx + 10, by + 3, 3, 3); R(ctx, bolt, bx + 8, by + 6, 3, 3); R(ctx, bolt, bx + 10, by + 8, 3, 2); R(ctx, bolt, bx + 8, by + 10, 3, 3); R(ctx, bolt, bx + 7, by + 13, 2, 2);
    },

    chocolate(ctx, t) {
      room(ctx, 'rmarble21', '#a5452f', { wallH: 30 });
      P().counter(ctx, 0, 22, 8);
      const C = CH();
      person(ctx, C.avia, 32, 68, { facing: 'right', pose: 'point' });
      // the famous chocolate bin, lid open
      const bx = 52, by = 50;
      R(ctx, 'rgba(0,0,0,0.2)', bx, by + 20, 24, 3);
      R(ctx, '#8e2a22', bx, by + 4, 24, 17); R(ctx, '#b8463a', bx + 2, by + 5, 3, 15);
      R(ctx, '#c9a24a', bx, by + 9, 24, 1); R(ctx, '#c9a24a', bx, by + 17, 24, 1);
      R(ctx, '#3a1e10', bx + 1, by + 2, 22, 3);
      const lid = Math.round(Math.sin(t * 3) * 1);
      R(ctx, '#ead08a', bx - 2, by - 6 + lid, 28, 3); R(ctx, '#97752c', bx - 2, by - 4 + lid, 28, 1);
      // chocolates
      const choc = [['#5a3218', 3, 0], ['#d9b24a', 9, -2], ['#6e4022', 15, 0], ['#c0392b', 19, -1], ['#5a3218', 6, -3]];
      choc.forEach(([c, dx, dy]) => R(ctx, c, bx + dx, by + dy + 1, 4, 3));
      const sp = Math.floor(t * 4) % 4;
      R(ctx, '#fff6c8', bx + 4 + sp * 5, by - 9, 1, 1);
      person(ctx, C.me.child, 92, 70, { facing: 'left', pose: 'wave' });
      person(ctx, C.cousins[4], 108, 68, { facing: 'left', pose: Math.floor(t * 3) % 2 ? 'wave' : 'stand' });
    },

    vase(ctx, t) {
      room(ctx, 'rmarble6');
      P().vaseshelf(ctx, 8, 24, 2);
      P().bed(ctx, 88, 30, 2, 2);
      P().rug(ctx, 30, 52, 3, 2);
      P().brokenvase(ctx, 34, 58);
      const C = CH();
      const shake = Math.floor(t * 8) % 2;
      person(ctx, C.me.child, 52 + shake, 72, { facing: 'right', pose: 'oops' });
      R(ctx, '#8fd3ff', 58, 52 + (Math.floor(t * 2) % 3), 2, 3);      // sheepish sweat drop
      R(ctx, 'rgba(0,0,0,0.15)', 30, 28, 4, 2);                       // the empty spot on the shelf
      // Ouma, patiently gluing it back together (again)
      person(ctx, C.avia, 80, 70, { facing: 'left', pose: 'carry' });
      const vx = 72, vy = 50;
      R(ctx, '#3c6fb0', vx + 1, vy + 2, 6, 6); R(ctx, '#3c6fb0', vx, vy + 4, 8, 3); R(ctx, '#2a5590', vx + 2, vy, 4, 2);
      R(ctx, '#e8cf8a', vx + 2, vy + 3, 1, 1); R(ctx, '#e8cf8a', vx + 3, vy + 4, 1, 2); R(ctx, '#e8cf8a', vx + 4, vy + 6, 2, 1);   // glued cracks
      R(ctx, '#f4f0e6', vx + 9, vy + 3, 2, 5); R(ctx, '#d9534f', vx + 9, vy + 2, 2, 1);   // glue tube
      // "again..." — a few repaired-crack sparkles
      if (Math.floor(t * 2) % 2) R(ctx, '#fff6c8', vx + 5, vy - 2, 1, 1);
    },

    dvds(ctx, t) {
      room(ctx, 'rmarble1', '#8a2a20', { wallH: 40, noPanels: true });
      P().dvdshelf(ctx, 8, 6, 7);
      P().dvdshelf(ctx, 8, 22, 7);
      const C = CH();
      const kids = [C.me.child, C.cousins[0], C.cousins[2], C.cousins[1], C.cousins[5], C.cousins[3], C.cousins[4]];
      kids.forEach((k, i) => {
        const x = 14 + i * 16, y = i % 2 ? 72 : 64;
        const pick = i === Math.floor(t * 0.7) % kids.length;
        person(ctx, k, x, y, { facing: pick ? 'down' : 'up', pose: pick ? 'wave' : 'stand' });
        if (pick) { R(ctx, ['#2d6cb5', '#c0392b', '#e3b23c'][i % 3], x + 3, y - k.height - 7, 4, 6); R(ctx, '#f1e8d6', x + 4, y - k.height - 6, 2, 1); }
      });
    },

    forum(ctx, t) {
      outdoors(ctx, 'paving');
      P().forumfacade(ctx, 16, 22, 6, 3);
      text(ctx, 'FORVM', 64, 13.5, 6, '#7a1f17');
      const C = CH();
      const group = [C.cousins[0], C.cousins[2], C.me.child, C.avia, C.cousins[1], C.cousins[3], C.cousins[5], C.cousins[4]];
      const items = ['#c0392b', 'balloon', '#2d6cb5', null, '#e3b23c', 'balloon2', '#3c8d5a', '#d35f8d'];
      group.forEach((k, i) => {
        const x = 10 + i * 15, y = 74 + (i % 2 ? -2 : 0);
        person(ctx, k, x, y, { facing: 'down', pose: k === C.avia ? 'stand' : 'stand' });
        const it = items[i];
        if (!it) return;
        if (it.indexOf('balloon') === 0) {
          const sway = Math.round(Math.sin(t * 2 + i) * 1);
          R(ctx, '#7a6a5a', x + 4, y - k.height - 12, 1, 12 - 2);
          R(ctx, it === 'balloon' ? '#e53935' : '#1e88e5', x + 2 + sway, y - k.height - 19, 5, 6);
          R(ctx, 'rgba(255,255,255,0.5)', x + 3 + sway, y - k.height - 18, 1, 2);
        } else {
          R(ctx, it, x + 4, y - 8, 5, 4); R(ctx, 'rgba(255,255,255,0.35)', x + 4, y - 8, 5, 1);
        }
      });
    },

    bakery(ctx, t) {
      outdoors(ctx, 'paving');
      P().bakery(ctx, 20, 4, 6, 4);
      text(ctx, 'TURKSTRA', 68, 3.5, 5, '#7a1f17');
      const C = CH();
      person(ctx, C.avia, 40, 76, { facing: 'right', pose: 'carry' });
      // a melktertjie, with cinnamon
      R(ctx, '#c8893f', 39, 64, 10, 4); R(ctx, '#f6e4ad', 40, 64, 8, 2); R(ctx, '#b86e2c', 42, 64, 1, 1); R(ctx, '#b86e2c', 45, 65, 1, 1);
      person(ctx, C.me.child, 60, 76, { facing: 'left', pose: Math.floor(t * 2) % 2 ? 'wave' : 'stand' });
      person(ctx, C.cousins[1], 104, 76, { facing: 'left', pose: 'stand' });
      person(ctx, C.cousins[5], 116, 74, { facing: 'left', pose: 'stand' });
    },

    aardklop(ctx, t) {
      outdoors(ctx, 'grass');
      P().tent(ctx, 4, 20, 2, 2);
      P().tent(ctx, 90, 18, 2, 2);
      P().bunting(ctx, 0, 4, 8);
      text(ctx, 'AARDKLOP', 64, 14, 6, '#7a1f17');
      // the procession: Avia in front, cousins behind and beside her
      const C = CH();
      const walkers = [
        [C.avia, 0, 0], [C.me.child, -11, -7], [C.cousins[0], -12, 7], [C.cousins[2], -23, 0],
        [C.cousins[1], -26, -9], [C.cousins[3], -35, 6], [C.cousins[4], -40, -4], [C.cousins[5], -48, 3]
      ];
      const lead = ((t * 14) % 190) - 20;
      walkers.slice().sort((a, b) => a[2] - b[2]).forEach(([spec, dx, dy]) => {
        const i = walkers.findIndex(w => w[0] === spec);
        let x = lead + dx + 30;
        if (x > VW + 30) x -= 190;
        person(ctx, spec, Math.round(x), 66 + dy, { facing: 'right', pose: walk(t, i, 7) });
      });
    },

    piano(ctx, t) {
      room(ctx, 'rmarble6');
      const C = CH();
      // the keyboard, with the note letters written on the keys
      const kx = 30, ky = 38, n = 12, kw = 6;
      R(ctx, '#55321d', kx + 4, ky + 16, 2, 10); R(ctx, '#55321d', kx + n * kw - 2, ky + 16, 2, 10);
      R(ctx, '#222027', kx - 2, ky - 4, n * kw + 6, 21);
      R(ctx, '#3a3842', kx - 2, ky - 4, n * kw + 6, 2);
      R(ctx, '#7fd18a', kx + 1, ky - 2, 2, 1);
      const names = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      for (let i = 0; i < n; i++) {
        const x = kx + 1 + i * kw;
        const pressed = Math.floor(t * 3) % n === i;
        R(ctx, pressed ? '#f5e2a8' : '#fbf8f1', x, ky, kw - 1, 14);
        if (i % 7 !== 2 && i % 7 !== 6 && i < n - 1) R(ctx, '#1d1b20', x + kw - 2, ky, 3, 8);
        text(ctx, names[i % 7], x + (kw - 1) / 2, ky + 11, 4.5, '#2d5aa8', '700 ');
      }
      person(ctx, C.me.child, kx + 34, 76, { facing: 'up', pose: 'sit' });
      person(ctx, C.avia, 18, 62, { facing: 'right', pose: 'point' });
      const nn = (t * 10) % 20;
      ctx.globalAlpha = 1 - nn / 20;
      note(ctx, 100, 30 - nn, '#c9a24a');
      ctx.globalAlpha = 1;
    },

    finale(ctx, t) {
      room(ctx, 'rmarble7', '#6a1f19', { wallH: 34 });
      // night window with the moon
      R(ctx, '#3a2014', 6, 4, 24, 22); R(ctx, '#15183a', 8, 6, 20, 18);
      R(ctx, '#f4ecd0', 19, 9, 5, 5); R(ctx, '#15183a', 21, 9, 3, 3);
      [[11, 8], [14, 16], [25, 19], [10, 20]].forEach(([x, y], i) => R(ctx, (Math.floor(t * 2) + i) % 3 ? '#e8e2c8' : '#6a6a88', x, y, 1, 1));
      R(ctx, '#3a2014', 17, 6, 1, 18); R(ctx, '#3a2014', 8, 14, 20, 1);
      // a portrait of Avia on the wall
      R(ctx, '#c9a24a', 98, 3, 22, 27); R(ctx, '#97752c', 99, 4, 20, 25); R(ctx, '#e9dcc0', 100, 5, 18, 23);
      person(ctx, CH().avia, 109, 26, { facing: 'down', noShadow: true });
      P().shelf(ctx, 34, 12, 1);
      P().lamp(ctx, 104, 52);
      // the piano and the grown-up grandchild playing it
      P().piano(ctx, 40, 40, 3);
      R(ctx, '#3d261a', 50, 62, 28, 4);                                   // bench
      person(ctx, CH().me.adult, 64, 70, { facing: 'up', pose: 'sit', noShadow: true });
      R(ctx, '#2b1a12', 52, 66, 2, 6); R(ctx, '#2b1a12', 74, 66, 2, 6);
      night(ctx, 0.35);
      glow(ctx, 112, 46, 44, 'rgba(255,200,110,0.28)');
      glow(ctx, 64, 50, 40, 'rgba(255,200,110,0.12)');
      // notes rising from the piano
      for (let i = 0; i < 3; i++) {
        const p = ((t * 0.45 + i / 3) % 1);
        ctx.globalAlpha = Math.sin(p * Math.PI);
        note(ctx, 52 + i * 12 + Math.round(Math.sin(p * 6 + i) * 3), 34 - p * 30, '#ead08a');
      }
      ctx.globalAlpha = 1;
    }
  };

  function mount(canvas, id, maxCss) {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const k = Math.max(1, Math.floor(maxCss * dpr / VW));
    canvas.width = VW * k; canvas.height = VH * k;
    canvas.style.width = (VW * k / dpr) + 'px';
    canvas.style.height = (VH * k / dpr) + 'px';
    const ctx = canvas.getContext('2d');
    const scene = SCENES[id];
    let raf = 0, stopped = false;
    const t0 = performance.now();
    let lastDraw = -1;
    function draw(now) {
      if (stopped) return;
      const t = (now - t0) / 1000;
      if (t - lastDraw >= 1 / 12) {            // pixel art looks best at a calm frame rate
        lastDraw = t;
        ctx.setTransform(k, 0, 0, k, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, VW, VH);
        try { if (scene) scene(ctx, t); } catch (e) { if (!stopped) { stopped = true; console.error('vignette ' + id, e); } }
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    draw(performance.now());
    return function stop() { stopped = true; cancelAnimationFrame(raf); };
  }

  window.Vignettes = { mount, setImages, SCENES };
})();
