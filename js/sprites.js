/* Domus Aviae — pixel characters drawn in code from js/config.js.
   Every sprite is 10px wide; its height comes from the config.
   Sprites are cached as small canvases with a soft dark outline. */
(function () {
  'use strict';

  const cache = new Map();
  const OUTLINE = [42, 26, 20, 235];

  // Draws one figure (no outline) with its top-left at (0,0) of a 12-wide canvas.
  // facing: 'down' | 'up' | 'left' | 'right'
  // pose:   'stand' | 'walk1' | 'walk2' | 'sit' | 'wave' | 'carry' | 'point' | 'oops'
  function paint(ctx, s, facing, pose) {
    const H = s.height;
    const sit = pose === 'sit';
    const L = sit ? 2 : Math.max(3, Math.round(H * 0.28));      // leg length
    const head = 7;
    const T = H - head - Math.max(3, Math.round(H * 0.28));     // torso length (same standing or sitting)
    const x0 = 1, top = 1;                                       // +1 margin for outline
    const r = (c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x0 + x, top + y, w, h); };
    const shade = (hex, k) => {
      const n = parseInt(hex.slice(1), 16);
      const f = v => Math.max(0, Math.min(255, Math.round(v * k)));
      return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')';
    };
    const side = facing === 'left' || facing === 'right';
    const back = facing === 'up';

    // ---- legs ----
    const ly = head + T;
    let liftL = 0, liftR = 0;
    if (pose === 'walk1') liftL = 1;
    if (pose === 'walk2') liftR = 1;
    const legC = s.dress ? s.skin : s.bottom;
    if (side) {
      const dx = pose === 'walk1' ? -1 : pose === 'walk2' ? 1 : 0;
      r(shade(legC, 0.85), 3 - dx, ly, 3, L);
      r(legC, 4 + dx, ly, 3, L);
      r(s.shoes, 3 - dx + (facing === 'left' ? -1 : 0), ly + L - 1, 4, 1);
      r(s.shoes, 4 + dx + (facing === 'left' ? -1 : 0), ly + L - 1, 4, 1);
    } else {
      r(legC, 2, ly, 3, L - liftL);
      r(legC, 5, ly, 3, L - liftR);
      r(s.shoes, 2, ly + L - 1 - liftL, 3, 1);
      r(s.shoes, 5, ly + L - 1 - liftR, 3, 1);
    }

    // ---- torso ----
    r(s.top, 1, head, 8, T);
    r(shade(s.top, 0.82), 1, head + T - 1, 8, 1);
    if (s.trim) { r(s.trim, 4, head, 2, 1); }
    if (s.dress) {
      const skirt = Math.max(2, Math.ceil(L * 0.65));
      r(s.bottom, 1, ly, 8, skirt);
      r(s.bottom, 0, ly + skirt - 1, 10, 1);
      r(shade(s.bottom, 1.35), 3, ly, 1, skirt - 1);
    } else if (!sit) {
      r(s.bottom, 1, ly - 1, 8, 2);                 // waistband / hips
    }

    // ---- arms ----
    const armLen = Math.max(3, T - 1);
    const sleeve = shade(s.top, 0.9);
    const armL = (dy) => { r(sleeve, 0, head + 1 + dy, 1, armLen - 1); r(s.skin, 0, head + armLen + dy, 1, 1); };
    const armR = (dy) => { r(sleeve, 9, head + 1 + dy, 1, armLen - 1); r(s.skin, 9, head + armLen + dy, 1, 1); };
    if (pose === 'wave') {
      armL(0);
      r(sleeve, 9, head - 3, 1, 4); r(s.skin, 9, head - 4, 1, 1);
    } else if (pose === 'oops') {                    // both hands up to the face
      r(sleeve, 0, head - 1, 1, 3); r(sleeve, 9, head - 1, 1, 3);
      r(s.skin, 0, head - 2, 1, 1); r(s.skin, 9, head - 2, 1, 1);
    } else if (pose === 'carry') {                   // arms forward, holding something
      r(sleeve, 1, head + 2, 1, 2); r(sleeve, 8, head + 2, 1, 2);
      r(s.skin, 2, head + 3, 6, 1);
    } else if (pose === 'point') {
      armL(0);
      r(sleeve, 9, head + 1, 2, 1); r(s.skin, 10, head + 1, 1, 1);
    } else if (side) {
      const dy = pose === 'walk1' ? 1 : pose === 'walk2' ? -1 : 0;
      r(sleeve, 4 + (facing === 'left' ? 0 : 1), head + 1 + dy, 1, armLen - 1);
      r(s.skin, 4 + (facing === 'left' ? 0 : 1), head + armLen + dy, 1, 1);
    } else {
      armL(pose === 'walk1' ? 1 : 0);
      armR(pose === 'walk2' ? 1 : 0);
    }

    // ---- head ----
    r(s.skin, 2, 1, 6, 6);
    r(s.skin, 1, 3, 1, 2); r(s.skin, 8, 3, 1, 2);   // ears / cheeks
    const hc = s.hair, hd = shade(s.hair, 0.78), hl = shade(s.hair, 1.25);
    const style = s.hairStyle || 'short';

    if (back) {
      r(hc, 1, 0, 8, 7);
      r(hd, 1, 6, 8, 1);
    } else {
      // crown
      r(hc, 2, 0, 6, 1);
      r(hc, 1, 1, 8, 2);
      r(hl, 3, 1, 3, 1);
      if (side) {
        if (facing === 'left') { r(hc, 5, 3, 4, 3); r(hc, 2, 3, 1, 1); }
        else                   { r(hc, 1, 3, 4, 3); r(hc, 7, 3, 1, 1); }
      } else {
        r(hc, 1, 3, 1, 1); r(hc, 8, 3, 1, 1);
        r(hc, 2, 3, 2, 1);                            // fringe
        r(hc, 7, 3, 1, 1);
      }
    }
    // style extras
    if (style === 'curly') {
      r(hc, 0, 1, 1, 4); r(hc, 9, 1, 1, 4);
      r(hd, 0, 4, 1, 1); r(hd, 9, 4, 1, 1);
      r(hc, 3, -1 + 1, 1, 0);
    } else if (style === 'long') {
      r(hc, 0, 2, 1, 7 + Math.min(3, T - 3)); r(hc, 9, 2, 1, 7 + Math.min(3, T - 3));
      r(hd, 1, 5, 1, 4); r(hd, 8, 5, 1, 4);
      if (back) r(hc, 1, 7, 8, 3);
    } else if (style === 'bob') {
      r(hc, 0, 2, 1, 5); r(hc, 9, 2, 1, 5); r(hc, 1, 4, 1, 3); r(hc, 8, 4, 1, 3);
    } else if (style === 'ponytail') {
      if (back) { r(hc, 4, 7, 2, 4); }
      else if (side) { r(hc, facing === 'left' ? 9 : 0, 2, 1, 5); }
      else { r(hc, 9, 1, 1, 2); r(hd, 9, 3, 1, 3); }
    } else if (style === 'pigtails') {
      r(hc, 0, 3, 1, 4); r(hc, 9, 3, 1, 4); r(hd, 0, 6, 1, 1); r(hd, 9, 6, 1, 1);
    }

    // face
    if (!back) {
      const eye = '#2a1d16';
      if (pose === 'sleep') {
        r(eye, 3, 5, 1, 1); r(eye, 6, 5, 1, 1);
      } else if (facing === 'down') {
        r(eye, 3, 4, 1, 2); r(eye, 6, 4, 1, 2);
        r(shade(s.skin, 0.88), 4, 6, 2, 1);           // little mouth shade
        if (pose === 'oops') r('#a04040', 4, 6, 2, 1);
      } else if (facing === 'left') {
        r(eye, 2, 4, 1, 2);
      } else if (facing === 'right') {
        r(eye, 7, 4, 1, 2);
      }
      // blush
      if (!side) { r('rgba(220,110,100,0.35)', 2, 5, 1, 1); r('rgba(220,110,100,0.35)', 7, 5, 1, 1); }
    }
  }

  function outline(c) {
    const ctx = c.getContext('2d');
    const w = c.width, h = c.height;
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const solid = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) solid[i] = d[i * 4 + 3] > 40 ? 1 : 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (solid[i]) continue;
      if ((x > 0 && solid[i - 1]) || (x < w - 1 && solid[i + 1]) ||
          (y > 0 && solid[i - w]) || (y < h - 1 && solid[i + w])) {
        d[i * 4] = OUTLINE[0]; d[i * 4 + 1] = OUTLINE[1]; d[i * 4 + 2] = OUTLINE[2]; d[i * 4 + 3] = OUTLINE[3];
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function sprite(spec, facing, pose) {
    const key = JSON.stringify(spec) + '|' + facing + '|' + pose;
    let c = cache.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = 14; c.height = spec.height + 8;
    const ctx = c.getContext('2d');
    ctx.translate(1, 4);       // room for raised arms above the head
    paint(ctx, spec, facing, pose);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    outline(c);
    cache.set(key, c);
    return c;
  }

  // Draw a person with their FEET centred at (fx, fy) in the current (logical) coordinates.
  function drawPerson(ctx, spec, fx, fy, opts) {
    opts = opts || {};
    const facing = opts.facing || 'down';
    const pose = opts.pose || 'stand';
    if (!opts.noShadow) {
      ctx.fillStyle = 'rgba(40,20,10,0.25)';
      ctx.fillRect(Math.round(fx) - 4, Math.round(fy) - 1, 8, 2);
      ctx.fillRect(Math.round(fx) - 3, Math.round(fy) + 1, 6, 1);
    }
    const c = sprite(spec, facing, pose);
    const sitDrop = pose === 'sit' ? Math.max(3, Math.round(spec.height * 0.28)) - 2 : 0;
    ctx.drawImage(c, Math.round(fx) - 7, Math.round(fy) - spec.height - 6 + sitDrop);
  }

  // A sleeping head on a pillow, for the Christmas scene. (x,y) = top-left of the pillow.
  function drawSleeper(ctx, spec, x, y, blanket) {
    ctx.fillStyle = '#f4efe6'; ctx.fillRect(x, y, 12, 6);           // pillow
    ctx.fillStyle = '#d9d0c0'; ctx.fillRect(x, y + 5, 12, 1);
    const c = sprite(spec, 'down', 'sleep');
    ctx.save();
    ctx.beginPath(); ctx.rect(x - 2, y - 6, 16, 14); ctx.clip();
    ctx.drawImage(c, x - 1, y - 4);
    ctx.restore();
    ctx.fillStyle = blanket || spec.top; ctx.fillRect(x - 1, y + 7, 14, 9);   // blanket
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x - 1, y + 7, 14, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(x - 1, y + 15, 14, 1);
  }

  window.Sprites = { drawPerson, drawSleeper, sprite };
})();
