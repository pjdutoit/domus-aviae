/* Domus Aviae — furniture, buildings and tiles, drawn in code.
   All coordinates are logical pixels (one map tile = 16px).
   Used by the map (js/map.js) and the memory vignettes (js/vignettes.js). */
(function () {
  'use strict';

  const C = {
    wood: '#7a4a2b', woodD: '#55321d', woodL: '#9c6842',
    gold: '#c9a24a', goldL: '#ead08a', goldD: '#97752c',
    red: '#8e2a22', redD: '#62180f', redL: '#b8463a',
    terra: '#b5583e', terraD: '#8a3e2a',
    cream: '#f1e8d6', creamD: '#ddd0b8',
    stone: '#d7ccb6', stoneD: '#b7a88c', stoneL: '#ebe3d2',
    green: '#557f3c', greenD: '#3a5c29', greenL: '#7ba552',
    water: '#3d7d98', waterL: '#8cc2d2',
    ink: '#2a1d16', black: '#1d1b20', white: '#fbf8f1'
  };

  function R(ctx, c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
  function hash(x, y) { let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }

  // ------------------------------------------------------------------ tiles
  function paving(ctx, x, y, tx, ty) {
    R(ctx, '#cbbfa6', x, y, 16, 16);
    const off = (ty % 2) * 8;
    for (let i = 0; i < 2; i++) {
      const bx = x + ((i * 8 + off) % 16);
      const v = hash(tx * 2 + i, ty);
      R(ctx, v > 0.66 ? '#d4c9b1' : v > 0.33 ? '#c6b99e' : '#cdc1a8', bx + 1, y + 1, 7, 7);
      R(ctx, v > 0.5 ? '#d1c5ad' : '#c3b69b', bx + 1, y + 9, 7, 6);
    }
    R(ctx, 'rgba(90,70,50,0.18)', x, y + 8, 16, 1);
    R(ctx, 'rgba(90,70,50,0.18)', x, y, 16, 1);
  }

  function grass(ctx, x, y, tx, ty) {
    R(ctx, '#7f9c4b', x, y, 16, 16);
    for (let i = 0; i < 5; i++) {
      const a = hash(tx * 7 + i, ty * 3);
      const b = hash(tx * 3, ty * 7 + i);
      R(ctx, i % 2 ? '#93b25a' : '#6d8a3e', x + Math.floor(a * 15), y + Math.floor(b * 14), 1, 2);
    }
    if (hash(tx, ty) > 0.86) { R(ctx, '#f1e3a0', x + 5, y + 6, 1, 1); R(ctx, '#e88f8f', x + 10, y + 11, 1, 1); }
  }

  function hedge(ctx, x, y, tx) {
    R(ctx, C.greenD, x, y + 2, 16, 14);
    R(ctx, C.green, x, y + 2, 16, 4);
    for (let i = 0; i < 4; i++) R(ctx, C.greenL, x + i * 4 + (tx % 2), y + 3, 2, 1);
    R(ctx, 'rgba(0,0,0,0.25)', x, y + 15, 16, 1);
  }

  // Wall tile. faceBelow = a floor is directly below, so we see the painted wall face.
  function wall(ctx, x, y, faceBelow, outdoorBelow) {
    if (faceBelow) {
      R(ctx, '#5c2a1e', x, y, 16, 3);                      // top cap
      R(ctx, '#7a3a28', x, y + 3, 16, 1);
      if (outdoorBelow) {                                  // villa facade: warm render + base
        R(ctx, '#d9a77a', x, y + 4, 16, 9);
        R(ctx, '#c58f62', x, y + 4, 16, 1);
        R(ctx, '#a8714b', x, y + 13, 16, 3);
      } else {                                             // Pompeian red interior wall
        R(ctx, '#9b2c22', x, y + 4, 16, 8);
        R(ctx, C.gold, x, y + 6, 16, 1);
        R(ctx, '#4a1610', x, y + 12, 16, 4);               // dark dado
        R(ctx, C.goldD, x, y + 12, 16, 1);
      }
    } else {
      R(ctx, '#6e3424', x, y, 16, 16);
      R(ctx, '#7f3f2c', x + 1, y + 1, 14, 14);
      R(ctx, 'rgba(255,220,180,0.08)', x + 1, y + 1, 14, 1);
    }
  }

  // ------------------------------------------------------------------ props
  const P = {};

  P.counter = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, C.woodD, x, y + 4, W, 12);
    R(ctx, C.stoneL, x, y + 2, W, 4);
    R(ctx, C.stoneD, x, y + 5, W, 1);
    for (let i = 0; i < w * 2; i++) { R(ctx, C.wood, x + i * 8 + 1, y + 7, 6, 8); R(ctx, C.gold, x + i * 8 + 6, y + 10, 1, 2); }
    // a few jars on the counter
    R(ctx, '#d7b27a', x + 4, y - 2, 4, 5); R(ctx, '#8a5a3a', x + 4, y - 3, 4, 1);
    R(ctx, '#c9d6c2', x + 20, y - 1, 3, 4);
    R(ctx, C.terra, x + 36, y - 3, 5, 6); R(ctx, C.terraD, x + 36, y + 2, 5, 1);
  };

  P.hearth = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, '#8d8478', x, y + 1, W, 15);
    R(ctx, '#a69d90', x, y + 1, W, 3);
    R(ctx, '#2b2420', x + 4, y + 7, W - 8, 8);
    R(ctx, '#e0812c', x + 6, y + 11, W - 12, 3);
    R(ctx, '#f6c445', x + 9, y + 10, W - 18, 2);
    R(ctx, '#3a3330', x + 9, y - 2, 12, 5);               // pot
    R(ctx, '#57504a', x + 9, y - 2, 12, 1);
  };

  P.chocbin = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 1, y + 14, 14, 2);
    R(ctx, C.red, x + 2, y + 4, 12, 11);
    R(ctx, C.redL, x + 3, y + 5, 2, 9);
    R(ctx, C.gold, x + 2, y + 7, 12, 1); R(ctx, C.gold, x + 2, y + 12, 12, 1);
    R(ctx, C.goldL, x + 1, y + 1, 14, 3); R(ctx, C.goldD, x + 1, y + 3, 14, 1);
    R(ctx, C.goldD, x + 7, y, 2, 1);
    R(ctx, '#5a3218', x + 5, y + 9, 3, 2); R(ctx, '#6e4022', x + 9, y + 9, 2, 2);  // chocolate motif
  };

  P.amphora = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 4, y + 14, 8, 2);
    R(ctx, C.terra, x + 5, y + 4, 6, 10); R(ctx, C.terra, x + 4, y + 6, 8, 6);
    R(ctx, C.terraD, x + 6, y + 1, 4, 3); R(ctx, C.terraD, x + 3, y + 3, 1, 4); R(ctx, C.terraD, x + 12, y + 3, 1, 4);
    R(ctx, '#d27a5a', x + 5, y + 6, 1, 5);
  };

  P.shelf = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, C.woodD, x, y, W, 16);
    for (let s = 0; s < 3; s++) {
      R(ctx, '#2e1b10', x + 1, y + 1 + s * 5, W - 2, 4);
      for (let i = 0; i < W - 3; i += 3) {
        const v = hash(x + i, y + s);
        const col = v > 0.75 ? C.red : v > 0.5 ? '#2f5a7a' : v > 0.25 ? C.creamD : '#4a6b3a';
        R(ctx, col, x + 2 + i, y + 1 + s * 5 + (v > 0.6 ? 1 : 0), 2, 4 - (v > 0.6 ? 1 : 0));
      }
    }
  };

  P.dvdshelf = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, C.wood, x, y, W, 16);
    const cols = ['#c0392b', '#2d6cb5', '#e3b23c', '#3c8d5a', '#8e44ad', '#e67e22', '#1f2a44', '#d35f8d', '#16a085', '#f1e8d6'];
    for (let s = 0; s < 3; s++) {
      R(ctx, '#2a170d', x + 1, y + 1 + s * 5, W - 2, 4);
      for (let i = 0; i < W - 3; i += 2) {
        const v = hash(x + i * 3, y + s * 11);
        if (v > 0.93) continue;
        R(ctx, cols[Math.floor(v * cols.length)], x + 2 + i, y + 1 + s * 5, 1, 4);
      }
    }
  };

  P.piano = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, 'rgba(0,0,0,0.25)', x + 1, y + 14, W - 2, 2);
    R(ctx, '#2b1a12', x + 1, y - 6, W - 2, 18);          // tall upright body
    R(ctx, '#3d261a', x + 2, y - 5, W - 4, 2);
    R(ctx, '#4a2e1f', x + 3, y - 2, W - 6, 6);           // front panel
    R(ctx, C.goldD, x + 3, y + 3, W - 6, 1);
    R(ctx, C.white, x + 2, y + 6, W - 4, 4);             // keys
    for (let i = 0; i < W - 4; i += 3) R(ctx, C.ink, x + 3 + i, y + 6, 1, 2);
    R(ctx, '#20130c', x + 2, y + 10, W - 4, 4);
    R(ctx, C.goldL, x + W / 2 - 3, y - 4, 6, 3);         // sheet music
    R(ctx, '#b8a888', x + W / 2 - 2, y - 3, 4, 1);
  };

  // Keyboard with the note letters drawn on each key (the Oecus memory)
  P.keyboard = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, C.woodD, x + 3, y + 10, 2, 6); R(ctx, C.woodD, x + W - 5, y + 10, 2, 6);   // stand
    R(ctx, '#222027', x + 1, y + 2, W - 2, 10);
    R(ctx, '#3a3842', x + 1, y + 2, W - 2, 2);
    R(ctx, '#7fd18a', x + 4, y + 3, 3, 1);                // little power light
    R(ctx, C.white, x + 2, y + 5, W - 4, 6);
    for (let i = 0; i < W - 4; i += 3) {
      R(ctx, '#cfc7b8', x + 4 + i, y + 5, 1, 6);
      if ((i / 3) % 7 !== 2 && (i / 3) % 7 !== 6) R(ctx, C.ink, x + 4 + i, y + 5, 1, 3);
      R(ctx, '#3567b0', x + 2 + i, y + 9, 1, 1);          // the drawn-on letters
    }
  };

  P.desk = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, 'rgba(0,0,0,0.2)', x + 1, y + 14, W - 2, 2);
    R(ctx, C.woodL, x, y + 2, W, 6); R(ctx, C.wood, x, y + 8, W, 7);
    R(ctx, C.woodD, x + 2, y + 10, W - 4, 1);
    R(ctx, C.white, x + 4, y + 3, 7, 4); R(ctx, '#cfc7b8', x + 5, y + 4, 5, 1); R(ctx, '#cfc7b8', x + 5, y + 6, 4, 1);
    R(ctx, C.gold, x + W - 8, y - 4, 1, 7); R(ctx, '#2f5a3a', x + W - 11, y - 6, 7, 3);  // desk lamp
  };

  P.lamp = (ctx, x, y) => {
    R(ctx, 'rgba(255,214,120,0.18)', x - 4, y - 8, 24, 22);
    R(ctx, 'rgba(0,0,0,0.25)', x + 5, y + 14, 6, 2);
    R(ctx, C.goldD, x + 7, y, 2, 15);
    R(ctx, '#f3d58f', x + 3, y - 6, 10, 7); R(ctx, '#e7bd62', x + 3, y, 10, 1);
  };

  P.bed = (ctx, x, y, w, h) => {
    const W = w * 16, H = h * 16;
    R(ctx, 'rgba(0,0,0,0.2)', x + 1, y + H - 2, W - 2, 3);
    R(ctx, C.woodD, x, y, W, H);
    R(ctx, C.wood, x, y, W, 4);
    R(ctx, C.white, x + 3, y + 4, W - 6, 6);              // pillows
    R(ctx, '#e3dccd', x + W / 2 - 1, y + 4, 2, 6);
    R(ctx, C.red, x + 2, y + 10, W - 4, H - 12);           // blanket
    R(ctx, C.gold, x + 2, y + 12, W - 4, 1);
    R(ctx, C.redL, x + 2, y + 10, W - 4, 1);
  };

  P.vaseshelf = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, C.woodD, x, y + 6, W, 10); R(ctx, C.wood, x, y + 6, W, 2);
    const cols = ['#3c6fb0', '#b8463a', '#3c8d7a'];
    for (let i = 0; i < 3; i++) { const vx = x + 4 + i * 9; R(ctx, cols[i], vx, y, 4, 6); R(ctx, cols[i], vx + 1, y - 2, 2, 2); R(ctx, 'rgba(255,255,255,0.4)', vx + 1, y + 1, 1, 3); }
  };

  // small vase on a plinth (wobble = rotation in px, tier-3 detail)
  P.vase = (ctx, x, y, w, h, t) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 3, y + 14, 10, 2);
    R(ctx, C.stoneL, x + 3, y + 8, 10, 7); R(ctx, C.stoneD, x + 3, y + 13, 10, 2);
    const wob = t ? Math.round(Math.sin(t * 6) * Math.max(0, Math.sin(t * 0.7)) * 1.2) : 0;
    R(ctx, '#3c6fb0', x + 6 + wob, y + 2, 4, 6); R(ctx, '#3c6fb0', x + 5 + wob, y + 4, 6, 3);
    R(ctx, '#2a5590', x + 7 + wob, y, 2, 2);
    R(ctx, 'rgba(255,255,255,0.45)', x + 6 + wob, y + 3, 1, 3);
  };

  P.brokenvase = (ctx, x, y) => {
    R(ctx, '#3c6fb0', x + 2, y + 10, 3, 2); R(ctx, '#2a5590', x + 7, y + 12, 2, 2);
    R(ctx, '#3c6fb0', x + 11, y + 9, 3, 3); R(ctx, '#3c6fb0', x + 6, y + 8, 2, 1);
    R(ctx, 'rgba(255,255,255,0.4)', x + 12, y + 9, 1, 1);
  };

  P.rug = (ctx, x, y, w, h) => {
    const W = w * 16, H = h * 16;
    R(ctx, C.redD, x + 1, y + 1, W - 2, H - 2);
    R(ctx, C.gold, x + 3, y + 3, W - 6, H - 6);
    R(ctx, C.red, x + 4, y + 4, W - 8, H - 8);
    R(ctx, C.goldL, x + W / 2 - 2, y + H / 2 - 2, 4, 4);
    R(ctx, C.redD, x + W / 2 - 1, y + H / 2 - 1, 2, 2);
  };

  P.dtable = (ctx, x, y, w, h) => {
    const W = w * 16, H = h * 16;
    R(ctx, 'rgba(0,0,0,0.22)', x + 2, y + H - 1, W - 4, 3);
    R(ctx, C.woodD, x + 1, y + 2, W - 2, H - 2);
    R(ctx, C.woodL, x + 1, y + 2, W - 2, H - 5);
    R(ctx, C.wood, x + 1, y + H - 3, W - 2, 1);
    // open book (the Latin lessons)
    R(ctx, C.white, x + 6, y + 6, 12, 8); R(ctx, '#d9d0c0', x + 12, y + 6, 1, 8);
    for (let i = 0; i < 3; i++) { R(ctx, '#8a7f70', x + 7, y + 8 + i * 2, 4, 1); R(ctx, '#8a7f70', x + 14, y + 8 + i * 2, 3, 1); }
    // plate + cup
    R(ctx, C.white, x + W - 16, y + 7, 8, 6); R(ctx, '#e6dccb', x + W - 14, y + 9, 4, 2);
    R(ctx, C.terra, x + 26, y + 5, 3, 4);
  };

  P.greekvase = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 3, y + 14, 10, 2);
    R(ctx, '#d0773e', x + 4, y + 3, 8, 11); R(ctx, '#d0773e', x + 3, y + 5, 10, 7);
    R(ctx, '#1f1712', x + 3, y + 7, 10, 3);                // black-figure band
    R(ctx, '#d0773e', x + 5, y + 8, 1, 1); R(ctx, '#d0773e', x + 9, y + 8, 2, 1);
    R(ctx, '#1f1712', x + 6, y, 4, 3); R(ctx, '#1f1712', x + 2, y + 2, 1, 4); R(ctx, '#1f1712', x + 13, y + 2, 1, 4);
    R(ctx, '#1f1712', x + 5, y + 13, 6, 1);
  };

  P.plant = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 3, y + 14, 10, 2);
    R(ctx, C.terra, x + 4, y + 9, 8, 6); R(ctx, C.terraD, x + 4, y + 9, 8, 1);
    R(ctx, C.greenD, x + 2, y + 2, 12, 8); R(ctx, C.green, x + 4, y - 1, 8, 8);
    R(ctx, C.greenL, x + 5, y, 2, 2); R(ctx, C.greenL, x + 10, y + 3, 2, 2); R(ctx, C.greenL, x + 3, y + 5, 2, 2);
  };

  P.tv = (ctx, x, y, w, h, t) => {
    const W = w * 16;
    R(ctx, C.woodD, x + 1, y + 10, W - 2, 6); R(ctx, C.wood, x + 1, y + 10, W - 2, 2);
    R(ctx, '#18161b', x + 3, y - 2, W - 6, 12);
    const flick = t ? (Math.sin(t * 9) * 0.5 + 0.5) : 0.5;
    R(ctx, flick > 0.5 ? '#2c4f9e' : '#284894', x + 4, y - 1, W - 8, 10);
    R(ctx, '#6f8fd8', x + 6, y + 1, W - 12, 2);           // quiz show lights
    R(ctx, '#d9b14a', x + 6, y + 5, 6, 2); R(ctx, '#d9b14a', x + W - 12, y + 5, 6, 2);
    R(ctx, 'rgba(160,190,255,0.10)', x - 2, y + 10, W + 4, 8);
  };

  P.sidetable = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 2, y + 14, 12, 2);
    R(ctx, C.woodD, x + 3, y + 8, 2, 7); R(ctx, C.woodD, x + 11, y + 8, 2, 7);
    R(ctx, C.woodL, x + 1, y + 6, 14, 3);
    R(ctx, C.white, x + 3, y + 2, 10, 5);                 // baking dish
    R(ctx, '#f0b93a', x + 4, y + 2, 8, 3); R(ctx, '#d58f22', x + 5, y + 3, 2, 1); R(ctx, '#d58f22', x + 9, y + 2, 2, 1);
    R(ctx, 'rgba(255,255,255,0.55)', x + 6, y - 2, 1, 2); R(ctx, 'rgba(255,255,255,0.45)', x + 9, y - 3, 1, 2);
  };

  P.couch = (ctx, x, y, w) => {         // seen from behind (facing the TV)
    const W = w * 16;
    R(ctx, 'rgba(0,0,0,0.22)', x + 1, y + 14, W - 2, 2);
    R(ctx, C.redD, x, y + 2, W, 13);
    R(ctx, C.red, x + 1, y + 3, W - 2, 5);
    R(ctx, C.redL, x + 1, y + 3, W - 2, 1);
    R(ctx, C.redD, x + 2, y + 9, W - 4, 1);
    R(ctx, C.gold, x + 3, y + 12, W - 6, 1);
  };

  P.armchair = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.22)', x + 1, y + 14, 14, 2);
    R(ctx, '#2f5a6a', x + 1, y + 2, 14, 13); R(ctx, '#3e7385', x + 3, y + 5, 10, 8);
    R(ctx, '#244753', x + 1, y + 2, 14, 3);
  };

  P.xtree = (ctx, x, y, w, h, t) => {
    R(ctx, 'rgba(0,0,0,0.22)', x + 3, y + 14, 10, 2);
    R(ctx, C.redD, x + 5, y + 11, 6, 4);
    const g = '#2f6a3a', gl = '#3f8a4a';
    R(ctx, g, x + 7, y - 8, 2, 3); R(ctx, g, x + 5, y - 5, 6, 4); R(ctx, g, x + 3, y - 1, 10, 5); R(ctx, g, x + 1, y + 4, 14, 7);
    R(ctx, gl, x + 6, y - 4, 2, 1); R(ctx, gl, x + 4, y, 3, 1); R(ctx, gl, x + 3, y + 5, 3, 1);
    R(ctx, C.goldL, x + 7, y - 10, 2, 2);
    const lights = [[6, -3], [9, 0], [5, 2], [11, 6], [3, 8], [8, 8], [13, 9]];
    const cols = ['#ffd75a', '#ff7b6b', '#8fd3ff', '#ffd75a'];
    lights.forEach((p, i) => {
      const on = t ? ((Math.floor(t * 3) + i) % 3 !== 0) : true;
      R(ctx, on ? cols[i % cols.length] : '#3a4a3a', x + p[0], y + p[1], 1, 1);
    });
  };

  P.mattress = (ctx, x, y, w) => {
    const W = w * 16;
    R(ctx, 'rgba(0,0,0,0.18)', x + 1, y + 14, W - 2, 2);
    R(ctx, '#e7dfd0', x + 1, y + 3, W - 2, 12);
    R(ctx, '#c8bca6', x + 1, y + 14, W - 2, 1);
    const cols = ['#3567b0', '#c0473a', '#3c8d5a', '#d0a03a'];
    for (let i = 0; i < w; i++) {
      R(ctx, C.white, x + i * 16 + 3, y + 4, 10, 3);
      R(ctx, cols[(i + x) % cols.length], x + i * 16 + 2, y + 8, 12, 6);
    }
  };

  P.lararium = (ctx, x, y) => {
    R(ctx, C.stoneD, x + 2, y + 4, 12, 11); R(ctx, C.stoneL, x + 2, y + 4, 12, 2);
    R(ctx, '#7a2a20', x + 5, y + 7, 6, 6);                // niche
    R(ctx, C.goldL, x + 7, y + 9, 2, 3);                  // little figure
    R(ctx, C.stoneL, x + 1, y + 2, 14, 2); R(ctx, C.stoneL, x + 3, y, 10, 2); R(ctx, C.stoneL, x + 6, y - 1, 4, 1);
    R(ctx, '#f7c95a', x + 4, y + 13, 1, 1); R(ctx, '#f7c95a', x + 11, y + 13, 1, 1);
  };

  P.statue = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.22)', x + 3, y + 14, 10, 2);
    R(ctx, C.stoneD, x + 4, y + 8, 8, 7); R(ctx, C.stoneL, x + 3, y + 7, 10, 2);
    R(ctx, C.white, x + 5, y + 2, 6, 5); R(ctx, C.white, x + 6, y - 2, 4, 4); R(ctx, '#e6e0d4', x + 6, y + 4, 4, 1);
    R(ctx, C.greenL, x + 5, y - 2, 6, 1);                 // laurel
  };

  P.column = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.25)', x + 3, y + 13, 12, 3);
    R(ctx, C.stoneD, x + 3, y + 12, 10, 3);
    R(ctx, C.white, x + 4, y - 10, 8, 23);
    R(ctx, '#e1dacb', x + 9, y - 10, 2, 23); R(ctx, '#ece6da', x + 6, y - 10, 1, 23);
    R(ctx, C.stoneL, x + 2, y - 13, 12, 3); R(ctx, C.goldL, x + 2, y - 11, 12, 1);
  };

  P.fountain = (ctx, x, y, w, h, t) => {
    R(ctx, 'rgba(0,0,0,0.2)', x - 6, y + 13, 28, 4);
    R(ctx, C.stoneD, x - 6, y + 2, 28, 12); R(ctx, C.stoneL, x - 6, y + 2, 28, 2);
    R(ctx, C.water, x - 4, y + 5, 24, 7);
    const s = t ? Math.floor(t * 4) % 3 : 0;
    R(ctx, C.waterL, x - 2 + s * 3, y + 7, 4, 1); R(ctx, C.waterL, x + 10 - s * 2, y + 9, 4, 1);
    R(ctx, C.stoneL, x + 6, y - 6, 4, 12);
    R(ctx, C.waterL, x + 7, y - 9, 2, 3); R(ctx, 'rgba(140,194,210,0.7)', x + 5, y - 7, 1, 4); R(ctx, 'rgba(140,194,210,0.7)', x + 10, y - 7, 1, 4);
  };

  P.cypress = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.22)', x + 3, y + 13, 10, 3);
    R(ctx, '#5a3a22', x + 7, y + 10, 2, 5);
    R(ctx, '#2c4f2a', x + 4, y - 14, 8, 25); R(ctx, '#2c4f2a', x + 5, y - 18, 6, 4); R(ctx, '#2c4f2a', x + 6, y - 21, 4, 3);
    R(ctx, '#3d6a37', x + 5, y - 12, 2, 18); R(ctx, '#3d6a37', x + 6, y - 18, 2, 4);
  };

  P.forumfacade = (ctx, x, y, w, h) => {
    const W = w * 16, H = h * 16;
    R(ctx, '#e6dcc7', x, y - 8, W, H + 8);
    R(ctx, C.stoneD, x, y + H - 4, W, 4);
    // pediment
    for (let i = 0; i < 10; i++) R(ctx, C.stoneL, x + 4 + i * 4, y - 8 - i, W - 8 - i * 8, 1);
    R(ctx, C.stoneL, x - 2, y - 8, W + 4, 4); R(ctx, C.goldL, x - 2, y - 5, W + 4, 1);
    // shop windows between columns
    for (let i = 0; i < 4; i++) {
      const cx = x + 4 + i * 23;
      R(ctx, C.white, cx, y - 3, 5, H - 1);
      R(ctx, '#d8d0bf', cx + 3, y - 3, 1, H - 1);
      if (i < 3) {
        R(ctx, '#3d5a6b', cx + 7, y + 4, 14, 22);
        R(ctx, '#8fb6c6', cx + 8, y + 5, 3, 20);
        const g = ['#c0392b', '#e3b23c', '#2d6cb5'][i];
        R(ctx, g, cx + 12, y + 18, 5, 6); R(ctx, C.goldL, cx + 13, y + 16, 3, 2);
      }
    }
    R(ctx, C.red, x + 2, y + 30, W - 4, 4); R(ctx, C.redL, x + 2, y + 30, W - 4, 1);   // awning band
  };

  P.bakery = (ctx, x, y, w, h) => {
    const W = w * 16, H = h * 16;
    R(ctx, '#e9c79a', x, y - 6, W, H + 6);
    R(ctx, '#b27a4a', x, y + H - 4, W, 4);
    // striped awning
    for (let i = 0; i < W; i += 6) { R(ctx, i % 12 ? C.cream : C.red, x + i, y + 4, 6, 8); }
    for (let i = 0; i < W; i += 6) R(ctx, i % 12 ? C.cream : C.red, x + i + 1, y + 12, 4, 2);
    R(ctx, C.redD, x, y + 3, W, 1);
    // window with tarts
    R(ctx, '#5a3a24', x + 6, y + 18, W - 12, 26);
    R(ctx, '#f7ead2', x + 8, y + 20, W - 16, 22);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
      const tx = x + 12 + i * 15, ty = y + 26 + j * 9;
      R(ctx, '#c8893f', tx, ty, 9, 5); R(ctx, '#f6e4ad', tx + 1, ty + 1, 7, 3); R(ctx, '#b86e2c', tx + 3, ty + 2, 1, 1); R(ctx, '#b86e2c', tx + 5, ty + 1, 1, 1);
    }
    R(ctx, '#7a4a2b', x + W / 2 - 5, y + 46, 10, 18);     // door
  };

  P.tent = (ctx, x, y, w, h) => {
    const W = w * 16, H = h * 16;
    R(ctx, 'rgba(0,0,0,0.2)', x + 1, y + H - 2, W - 2, 3);
    for (let i = 0; i < W; i += 4) R(ctx, (i / 4) % 2 ? C.white : '#c6463a', x + i, y + 8, 4, H - 9);
    for (let i = 0; i < 8; i++) R(ctx, i % 2 ? C.white : '#c6463a', x + i * 2, y + 8 - i, W - i * 4, 1);
    R(ctx, C.goldD, x + W / 2 - 1, y - 6, 2, 6); R(ctx, '#e3b23c', x + W / 2 + 1, y - 6, 4, 3);
    R(ctx, '#2a1d16', x + W / 2 - 3, y + H - 10, 6, 9);
  };

  P.banner = (ctx, x, y) => {
    R(ctx, 'rgba(0,0,0,0.2)', x + 3, y + 14, 10, 2);
    R(ctx, C.woodD, x + 2, y - 10, 2, 25); R(ctx, C.woodD, x + 12, y - 10, 2, 25);
    R(ctx, '#e3b23c', x + 1, y - 9, 14, 9); R(ctx, '#c6463a', x + 1, y - 9, 14, 2); R(ctx, '#3c6fb0', x + 1, y - 2, 14, 2);
    R(ctx, '#7a2a20', x + 4, y - 6, 2, 2); R(ctx, '#7a2a20', x + 7, y - 6, 2, 2); R(ctx, '#7a2a20', x + 10, y - 6, 2, 2);
  };

  P.bunting = (ctx, x, y, w) => {
    const W = w * 16;
    const cols = ['#c6463a', '#e3b23c', '#3c6fb0', '#3c8d5a', '#d35f8d'];
    R(ctx, '#6b5a48', x, y, W, 1);
    for (let i = 0; i < W; i += 5) {
      const c = cols[(i / 5) % cols.length];
      R(ctx, c, x + i, y + 1, 4, 2); R(ctx, c, x + i + 1, y + 3, 2, 2);
    }
  };

  P.impluvium = (ctx, x, y, w, h, t) => {
    const W = w * 16, H = h * 16;
    R(ctx, C.stoneD, x - 2, y - 2, W + 4, H + 4);
    R(ctx, C.stoneL, x - 2, y - 2, W + 4, 2);
    R(ctx, C.water, x + 1, y + 1, W - 2, H - 2);
    R(ctx, '#356f88', x + 1, y + 1, W - 2, 3);
    const s = t || 0;
    for (let i = 0; i < 6; i++) {
      const px = x + 4 + ((i * 7 + Math.floor(s * 6)) % (W - 10));
      const py = y + 6 + ((i * 11) % (H - 12));
      R(ctx, C.waterL, px, py, 3, 1);
    }
    // a little lily pad and a fish
    R(ctx, '#5f9a4a', x + W - 14, y + H - 12, 5, 3);
    R(ctx, '#e88a3a', x + 10 + Math.round(Math.sin(s) * 6), y + H / 2, 3, 1);
  };

  function mosaic(ctx, img, x, y, size) {
    R(ctx, '#3a2418', x - 2, y - 2, size + 4, size + 4);
    R(ctx, C.goldD, x - 1, y - 1, size + 2, size + 2);
    if (img) ctx.drawImage(img, x, y, size, size);
  }

  window.Art = { C, R, hash, paving, grass, hedge, wall, P, mosaic };
})();
