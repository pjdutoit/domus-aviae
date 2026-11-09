/* Domus Aviae — the villa and the town square.
   Grid legend:
     #  wall          .  floor        d  open doorway      L  Tablinum door (locked)
     P  Porta         ,  paving       g  grass             h  hedge
     C  column        ~  impluvium    F  fountain          T  cypress tree
     =  building      A  tent                                              */
(function () {
  'use strict';

  const TILE = 16;
  const GRID = [
    '#######################', // 0
    '#......#.......#......#', // 1
    '#......#.......#......#', // 2
    '#......#.......#......#', // 3
    '#......#.......#......#', // 4
    '#......#.......#......#', // 5
    '#......#.......#......#', // 6
    '###d#######L#######d###', // 7
    '#......#.......#......#', // 8
    '#......#.......#......#', // 9
    '#......d.......d......#', // 10
    '#......#.C...C.#......#', // 11
    '#......#..~~~..#......#', // 12
    '#......#..~~~..#......#', // 13
    '###d####..~~~..########', // 14
    '#......#.C...C.#......#', // 15
    '#......#.......#......#', // 16
    '#......d.......d......#', // 17
    '#......#.......#......#', // 18
    '#......#.......#......#', // 19
    '#......#.......#......#', // 20
    '###########P###########', // 21
    'T,,,,,,,,,,,,,,,,,,,,,T', // 22
    ',,,,,,,,,,,,,,,,,,,,,,,', // 23
    ',,,,,,,,,,,,,,,,,,,,,,,', // 24
    ',,,,,,,,,,,F,,,,,,,,,,,', // 25
    ',,,,,,,,,,,,,,,,,,,,,,,', // 26
    'T,,,,,,,,,,,,,,ggggggg,', // 27
    ',,,,,,,,,,,,,,,ggggggg,', // 28
    ',======,,=====,ggggggg,', // 29
    ',======,,=====,gAAgAAg,', // 30
    ',======,,=====,gAAgAAg,', // 31
    ',======,,=====,ggggggg,', // 32
    ',======,,=====,ggggggg,', // 33
    ',,,,,,,,,,,,,,,ggggggg,', // 34
    'hhhhhhhhhhhhhhhhhhhhhhh'  // 35
  ];
  const W = GRID[0].length, H = GRID.length;

  // Interior rooms (inclusive tile rectangles) and their floor images.
  const ROOMS = [
    { id: 'culina',      x0: 1,  y0: 1,  x1: 6,  y1: 6,  floor: 'rmarble21' },
    { id: 'tablinum',    x0: 8,  y0: 1,  x1: 14, y1: 6,  floor: 'rmarble7'  },
    { id: 'cubiculum',   x0: 16, y0: 1,  x1: 21, y1: 6,  floor: 'rmarble6'  },
    { id: 'triclinium',  x0: 1,  y0: 8,  x1: 6,  y1: 13, floor: 'rmarble6'  },
    { id: 'atrium',      x0: 8,  y0: 8,  x1: 14, y1: 20, floor: 'rmarble1'  },
    { id: 'oecus',       x0: 16, y0: 8,  x1: 21, y1: 13, floor: 'rmarble6'  },
    { id: 'theatrum',    x0: 1,  y0: 15, x1: 6,  y1: 20, floor: 'rmarble21' },
    { id: 'bibliotheca', x0: 16, y0: 15, x1: 21, y1: 20, floor: 'rmarble1'  }
  ];

  // Mosaic emblems (3x3 tiles, walkable) — the centrepieces of the main rooms.
  const EMBLEMS = [
    { img: 'rmosaic4', x: 10, y: 17 },   // atrium entrance (the dog: "cave canem")
    { img: 'rmosaic2', x: 3,  y: 11 },   // triclinium: Athena's owl, for Latin and the myths
    { img: 'rmosaic1', x: 18, y: 11 },   // oecus
    { img: 'rmosaic3', x: 10, y: 4  }    // tablinum
  ];

  // Furniture & buildings. Tile units. walk:true = can be walked over.
  // memory: links a prop to a memory id (tap it to walk there and open the card).
  const PROPS = [
    // Culina
    { t: 'counter', x: 1, y: 1, w: 4 }, { t: 'hearth', x: 5, y: 1, w: 2 },
    { t: 'chocbin', x: 2, y: 4, memory: 'chocolate' },
    { t: 'amphora', x: 1, y: 6 }, { t: 'amphora', x: 6, y: 6 },
    // Tablinum
    { t: 'shelf', x: 8, y: 1, w: 2 }, { t: 'shelf', x: 13, y: 1, w: 2 },
    { t: 'piano', x: 10, y: 3, w: 3, finale: true },
    { t: 'lamp', x: 9, y: 3 },
    { t: 'desk', x: 13, y: 5, w: 2 },
    // Cubiculum
    { t: 'rug', x: 18, y: 4, w: 3, h: 2, walk: true },
    { t: 'bed', x: 19, y: 1, w: 3, h: 2 },
    { t: 'vaseshelf', x: 16, y: 1, w: 2 },
    { t: 'vase', x: 17, y: 4, memory: 'vase', anim: true },
    // Triclinium
    { t: 'dtable', x: 2, y: 9, w: 3, h: 2, memory: 'latin' },
    { t: 'greekvase', x: 6, y: 8, memory: 'myths' },
    { t: 'plant', x: 1, y: 13 },
    // Oecus
    { t: 'keyboard', x: 17, y: 9, w: 3, memory: 'piano' },
    { t: 'plant', x: 21, y: 8 }, { t: 'armchair', x: 21, y: 12 }, { t: 'plant', x: 16, y: 13 },
    // Theatrum
    { t: 'tv', x: 3, y: 15, w: 2, memory: 'millionaire', anim: true },
    { t: 'sidetable', x: 6, y: 15, memory: 'macncheese' },
    { t: 'xtree', x: 1, y: 15, anim: true },
    { t: 'couch', x: 2, y: 18, w: 4 },
    { t: 'mattress', x: 1, y: 20, w: 3, memory: 'christmas' },
    { t: 'mattress', x: 5, y: 20, w: 2 },
    // Bibliotheca
    { t: 'rug', x: 18, y: 17, w: 3, h: 3, walk: true },
    { t: 'dvdshelf', x: 16, y: 15, w: 6, memory: 'dvds' },
    { t: 'armchair', x: 17, y: 19 }, { t: 'plant', x: 21, y: 20 },
    // Atrium
    { t: 'statue', x: 8, y: 8 }, { t: 'lararium', x: 14, y: 8 },
    { t: 'plant', x: 8, y: 20 }, { t: 'plant', x: 14, y: 20 },
    // Town
    { t: 'forumfacade', x: 1, y: 29, w: 6, h: 5, memory: 'forum' },
    { t: 'bakery', x: 9, y: 29, w: 5, h: 5, memory: 'bakery' },
    { t: 'tent', x: 16, y: 30, w: 2, h: 2 }, { t: 'tent', x: 19, y: 30, w: 2, h: 2 },
    { t: 'banner', x: 18, y: 30, memory: 'aardklop' },
    { t: 'bunting', x: 15, y: 27, w: 7, walk: true }
  ];

  // Where you stand to "find" each memory.
  const STANDS = {
    macncheese: [6, 16], millionaire: [3, 16], christmas: [2, 19],
    latin: [2, 11], myths: [5, 8], chocolate: [3, 4], vase: [17, 5],
    dvds: [18, 16], forum: [4, 34], bakery: [11, 34], aardklop: [18, 31],
    piano: [18, 10], finale: [11, 4]
  };
  const START = [11, 20];
  const TABLINUM_DOOR = [11, 7];

  // Room labels (centre of plaque in tiles).
  const LABELS = [
    { room: 'culina', x: 3.5, y: 2.6 }, { room: 'tablinum', x: 11.5, y: 2.0 },
    { room: 'cubiculum', x: 18.5, y: 3.3 }, { room: 'triclinium', x: 4.0, y: 8.5 },
    { room: 'atrium', x: 11.5, y: 9.3 }, { room: 'oecus', x: 19.0, y: 8.4 },
    { room: 'theatrum', x: 3.5, y: 17.2 }, { room: 'bibliotheca', x: 19.0, y: 17.0 },
    { room: 'forum', x: 4.0, y: 29.3, sign: true }, { room: 'pistrinum', text: 'TURKSTRA', x: 11.5, y: 29.1, sign: true },
    { room: 'aardklop', text: 'AARDKLOP', x: 18.5, y: 27.0, sign: true }
  ];

  // ---------------------------------------------------------------- queries
  const blocked = new Uint8Array(W * H);
  const propAt = new Array(W * H).fill(null);
  PROPS.forEach(p => {
    const w = p.w || 1, h = p.h || 1;
    for (let y = p.y; y < p.y + h; y++) for (let x = p.x; x < p.x + w; x++) {
      if (!p.walk) blocked[y * W + x] = 1;
      if (p.memory || p.finale) propAt[y * W + x] = p;
    }
  });

  function ch(x, y) { return (x < 0 || y < 0 || x >= W || y >= H) ? '#' : GRID[y][x]; }
  function walkable(x, y, unlocked) {
    const c = ch(x, y);
    if (c === 'L') return !!unlocked;
    if ('.,dPg'.indexOf(c) < 0) return false;
    return !blocked[y * W + x];
  }
  function roomAt(x, y) {
    for (const r of ROOMS) if (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) return r.id;
    if (y >= 22) {
      if (y >= 27 && x <= 7) return 'forum';
      if (y >= 27 && x >= 8 && x <= 14) return 'pistrinum';
      if (y >= 27 && x >= 15) return 'aardklop';
      return 'oppidum';
    }
    return null;
  }
  function hotspotAt(x, y) { return (x < 0 || y < 0 || x >= W || y >= H) ? null : propAt[y * W + x]; }

  // ---------------------------------------------------------------- rendering
  // Floors are downscaled to 32x32 (2x2 tiles) so they read as chunky pixel marble.
  function makeFloorPatterns(images) {
    const out = {};
    Object.keys(images).forEach(k => {
      if (k.indexOf('rmarble') !== 0) return;
      const c = document.createElement('canvas');
      c.width = 16; c.height = 16;
      const x = c.getContext('2d');
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
      x.drawImage(images[k], 0, 0, 16, 16);
      out[k] = c;
    });
    return out;
  }

  function renderStatic(images) {
    const A = window.Art;
    const c = document.createElement('canvas');
    c.width = W * TILE; c.height = H * TILE;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const floors = makeFloorPatterns(images);

    // 1. ground
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const px = x * TILE, py = y * TILE, g = GRID[y][x];
      if (g === ',' || g === 'F' || g === 'T' || g === '=' || g === 'P') A.paving(ctx, px, py, x, y);
      else if (g === 'g' || g === 'A') A.grass(ctx, px, py, x, y);
      else if (g === 'h') { A.paving(ctx, px, py, x, y); A.hedge(ctx, px, py, x); }
      else if (g !== '#') {
        let room = roomAt(x, y);
        if (!room) {   // doorway: use a neighbour's floor
          room = roomAt(x, y + 1) || roomAt(x + 1, y) || roomAt(x - 1, y) || roomAt(x, y - 1) || 'atrium';
        }
        const r = ROOMS.find(r => r.id === room);
        const f = r && floors[r.floor];
        if (f) ctx.drawImage(f, px, py);
        else { A.R(ctx, '#e9e0cf', px, py, 16, 16); }
        if (g === 'd') { A.R(ctx, 'rgba(120,80,50,0.25)', px, py, 16, 16); }
      }
    }
    // soft shade along the base of walls (gives depth)
    for (let y = 1; y < H; y++) for (let x = 0; x < W; x++) {
      if (GRID[y - 1][x] === '#' && '.d'.indexOf(GRID[y][x]) >= 0) {
        A.R(ctx, 'rgba(60,20,10,0.22)', x * TILE, y * TILE, 16, 3);
        A.R(ctx, 'rgba(60,20,10,0.10)', x * TILE, y * TILE + 3, 16, 2);
      }
      if (x > 0 && GRID[y][x - 1] === '#' && GRID[y][x] === '.') A.R(ctx, 'rgba(60,20,10,0.12)', x * TILE, y * TILE, 2, 16);
    }

    // 2. emblems
    EMBLEMS.forEach(e => A.mosaic(ctx, images[e.img], e.x * TILE + 2, e.y * TILE + 2, 44));

    // 3. walls
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const g = GRID[y][x];
      if (g !== '#' && g !== 'L' && g !== 'P') continue;
      if (g === '#') {
        const below = ch(x, y + 1);
        const faceBelow = below !== '#' && below !== 'L' && below !== 'P' && y + 1 < H;
        A.wall(ctx, x * TILE, y * TILE, faceBelow, ',gTF'.indexOf(below) >= 0);
      }
    }
    // Porta: big double door, open
    const px = TABLINUM_DOOR[0] * TILE, py = 21 * TILE;
    A.R(ctx, '#5c2a1e', px - 3, py, 22, 3);
    A.R(ctx, '#3a2014', px, py + 3, 16, 13);
    A.R(ctx, '#e9e0cf', px + 2, py + 3, 12, 13);
    A.R(ctx, '#6e3c22', px - 3, py + 3, 3, 13); A.R(ctx, '#6e3c22', px + 16, py + 3, 3, 13);
    A.R(ctx, A.C.gold, px - 3, py + 3, 22, 1);

    // 4. impluvium (static base; ripples drawn live)
    // 5. static props (animated ones are drawn every frame)
    PROPS.forEach(p => {
      if (p.anim) return;
      const fn = A.P[p.t];
      if (fn) fn(ctx, p.x * TILE, p.y * TILE, p.w || 1, p.h || 1, 0);
    });
    return c;
  }

  // Things drawn every frame, in order of depth: animated props, columns, trees, fountain.
  function renderLive(ctx, t, state) {
    const A = window.Art;
    A.P.impluvium(ctx, 10 * TILE, 12 * TILE, 3, 3, t);
    PROPS.forEach(p => {
      if (!p.anim) return;
      if (p.t === 'vase' && state.found.has('vase')) {
        A.P.vase(ctx, p.x * TILE, p.y * TILE, 1, 1, 0);
        A.P.brokenvase(ctx, p.x * TILE + 4, p.y * TILE + 6);
        return;
      }
      A.P[p.t](ctx, p.x * TILE, p.y * TILE, p.w || 1, p.h || 1, t);
    });
    // Tablinum door
    const dx = TABLINUM_DOOR[0] * TILE, dy = TABLINUM_DOOR[1] * TILE;
    const open = state.doorOpen;   // 0..1
    A.R(ctx, '#5c2a1e', dx - 2, dy, 20, 3);
    A.R(ctx, '#2a1810', dx, dy + 3, 16, 13);
    if (open < 1) {
      const w = Math.round(8 * (1 - open));
      A.R(ctx, '#6e3c22', dx, dy + 3, w, 13); A.R(ctx, '#6e3c22', dx + 16 - w, dy + 3, w, 13);
      if (w > 2) {
        A.R(ctx, A.C.gold, dx + w - 2, dy + 9, 1, 2); A.R(ctx, A.C.gold, dx + 17 - w, dy + 9, 1, 2);
        A.R(ctx, '#55301b', dx + 1, dy + 5, w - 2, 1); A.R(ctx, '#55301b', dx + 17 - w, dy + 5, w - 2, 1);
      }
      if (open === 0) {   // padlock
        A.R(ctx, A.C.gold, dx + 6, dy + 10, 4, 4); A.R(ctx, A.C.goldD, dx + 7, dy + 8, 2, 2); A.R(ctx, '#3a2a10', dx + 7, dy + 11, 2, 1);
      }
    } else {
      A.R(ctx, 'rgba(255,214,120,0.35)', dx + 1, dy + 3, 14, 13);
    }
    A.R(ctx, A.C.gold, dx - 2, dy + 3, 20, 1);
  }

  // Tall objects, depth-sorted with the characters (by the y of their base).
  const TALL = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const g = GRID[y][x];
    const fn = g === 'C' ? 'column' : g === 'T' ? 'cypress' : g === 'F' ? 'fountain' : null;
    if (fn) TALL.push({ baseY: y * TILE + 15, draw: (ctx, t) => window.Art.P[fn](ctx, x * TILE, y * TILE, 1, 1, t) });
  }

  window.VillaMap = {
    TILE, GRID, W, H, ROOMS, EMBLEMS, PROPS, STANDS, START, TABLINUM_DOOR, LABELS,
    walkable, roomAt, hotspotAt, renderStatic, renderLive, TALL
  };
})();
