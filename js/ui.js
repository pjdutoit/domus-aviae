/* Domus Aviae — screens, memory cards, gallery, finale. */
(function () {
  'use strict';

  const T = window.TEXTS;
  const $ = id => document.getElementById(id);
  let toastTimer = null, cardOnClose = null, currentMemory = null, stopVig = null, stopFinaleVig = null;
  let resumed = false;

  const FLOORS = ['rmarble1', 'rmarble6', 'rmarble7', 'rmarble21', 'rmosaic1', 'rmosaic2', 'rmosaic3', 'rmosaic4'];

  const SOUND_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  const SOUND_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

  function show(el) { el.classList.add('show'); }
  function hide(el) { el.classList.remove('show'); }

  // ------------------------------------------------------------ static text
  function fillText() {
    $('titleText').textContent = T.title;
    $('subtitleText').textContent = T.subtitle;
    $('enterBtn').querySelector('.la').textContent = T.enter;
    $('enterBtn').querySelector('.en').textContent = T.enterAf;
    $('introText').innerHTML = '';
    T.intro.forEach(p => { const el = document.createElement('p'); el.textContent = p; $('introText').appendChild(el); });
    $('introHint').textContent = T.introHint;
    $('beginBtn').querySelector('.la').textContent = T.begin;
    $('beginBtn').querySelector('.en').textContent = T.beginAf;
    $('counter').querySelector('.lbl').textContent = T.counter.toUpperCase();
    $('counter').querySelector('.num').innerHTML = '<b>0</b>/' + window.MEMORIES.length;
    document.querySelectorAll('.credit, .credit-inline').forEach(el => { el.textContent = T.credit; });
    $('cardClose').querySelector('.la').textContent = T.close;
    $('galClose').querySelector('.la').textContent = T.close;
    $('galTitle').textContent = T.galleryTitle;
    $('restartBtn').textContent = T.restart + ' · ' + T.restartAf;
    $('cardNew').textContent = T.newMemoryLa + ' · ' + T.newMemoryAf;
    $('finaleNext').querySelector('.la').textContent = T.close;
    $('inscr').innerHTML = '';
    T.inscription.forEach((line, i) => {
      const s = document.createElement('span');
      if (i === T.inscription.length - 1) s.className = 'big';
      s.textContent = line;
      $('inscr').appendChild(s);
      if (i < T.inscription.length - 1) $('inscr').appendChild(document.createElement('br'));
    });
    $('inscrSub').textContent = T.inscriptionSub;
    $('inscrSubEn').textContent = T.inscriptionSubAf;
    $('dedication').textContent = T.dedication;
    $('signature').textContent = T.signature;
    $('revisitBtn').querySelector('.la').textContent = T.revisit;
    $('revisitBtn').querySelector('.en').textContent = T.revisitAf;
    updateSoundBtn();
  }

  function updateSoundBtn() {
    const m = window.GameAudio.isMuted();
    $('sound').innerHTML = m ? SOUND_OFF : SOUND_ON;
    $('sound').setAttribute('aria-pressed', m ? 'false' : 'true');
  }

  // ------------------------------------------------------------ toast
  function toast(la, en, isRoom) {
    const el = $('toast');
    el.querySelector('.la').textContent = la || '';
    el.querySelector('.en').textContent = en || '';
    el.classList.toggle('room', !!isRoom);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), isRoom ? 2000 : 3400);
  }

  // ------------------------------------------------------------ counter
  function updateCounter(n) {
    const el = $('counter');
    el.querySelector('.num').innerHTML = '<b>' + n + '</b>/' + window.MEMORIES.length;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }

  // ------------------------------------------------------------ memory card
  function renderCard() {
    const m = currentMemory;
    if (!m) return;
    const la = window.Game.state.lang === 'la';
    $('cardTitle').textContent = la ? m.titleLa : m.titleAf;
    $('cardLa').textContent = la ? m.la : m.laAf;
    $('cardLa').lang = la ? 'la' : 'af';
    $('cardText').textContent = m.text;
    document.querySelectorAll('#card .seg button').forEach(b => b.classList.toggle('on', b.dataset.lang === window.Game.state.lang));
  }

  function vigWidth(maxCss) {
    const panel = Math.min(window.innerWidth - 28 - 36 - 10, maxCss);
    return Math.max(160, panel);
  }

  function openCard(id, isNew, onClose) {
    currentMemory = window.MEMORIES.find(m => m.id === id);
    cardOnClose = onClose || null;
    $('cardNew').classList.toggle('hide', !isNew);
    renderCard();
    if (stopVig) stopVig();
    const landscape = window.innerHeight < 560 && window.innerWidth > window.innerHeight;
    stopVig = window.Vignettes.mount($('cardVig'), id, landscape ? Math.min(330, window.innerWidth * 0.42) : vigWidth(420));
    show($('card'));
    $('card').querySelector('.card-panel').scrollTop = 0;
    setTimeout(() => $('cardClose').focus({ preventScroll: true }), 50);
  }

  function closeCard() {
    if (!$('card').classList.contains('show')) return;
    hide($('card'));
    if (stopVig) { stopVig(); stopVig = null; }
    const cb = cardOnClose; cardOnClose = null;
    if (cb) cb();
  }

  // ------------------------------------------------------------ gallery
  function openGallery() {
    const st = window.Game.state;
    if (st.busy) return;
    st.busy = true;
    const grid = $('galGrid');
    grid.innerHTML = '';
    window.MEMORIES.forEach(m => {
      const b = document.createElement('button');
      if (st.found.has(m.id)) {
        b.className = 'gal-item';
        b.innerHTML = '<span></span><small></small>';
        b.firstChild.textContent = m.titleLa;
        b.lastChild.textContent = window.ROOM_NAMES[m.room] ? window.ROOM_NAMES[m.room].af : '';
        b.addEventListener('click', () => {
          hide($('gallery'));
          openCard(m.id, false, () => { st.busy = false; });
        });
      } else {
        b.className = 'gal-item locked';
        b.textContent = '?';
        b.disabled = true;
        b.setAttribute('aria-label', 'Not found yet');
      }
      grid.appendChild(b);
    });
    $('galEmpty').textContent = st.found.size ? '' : T.galleryEmpty;
    show($('gallery'));
  }
  function closeGallery() { hide($('gallery')); window.Game.state.busy = false; }

  // ------------------------------------------------------------ finale & monument
  function openFinale(onDone) {
    $('finaleTitle').textContent = T.finaleTitleLa;
    $('finaleLa').innerHTML = '';
    $('finaleLa').appendChild(document.createTextNode(T.finaleLa));
    const g = document.createElement('span'); g.className = 'gloss'; g.textContent = T.finaleLaAf;
    $('finaleLa').appendChild(g);
    $('finaleText').textContent = T.finaleText;
    $('hud').classList.add('hidden');
    const landscape = window.innerHeight < 560 && window.innerWidth > window.innerHeight;
    if (stopFinaleVig) stopFinaleVig();
    stopFinaleVig = window.Vignettes.mount($('finaleVig'), 'finale', landscape ? Math.min(360, window.innerWidth * 0.45) : vigWidth(520));
    show($('finale'));
    window.GameAudio.playPiano();

    $('finaleNext').onclick = () => {
      hide($('finale'));
      if (stopFinaleVig) { stopFinaleVig(); stopFinaleVig = null; }
      showMonument();
    };
    $('revisitBtn').onclick = () => {
      hide($('monument'));
      window.GameAudio.stopMusic();
      $('hud').classList.remove('hidden');
      if (onDone) onDone();
      setTimeout(openGallery, 400);
    };
  }

  function showMonument() {
    const m = $('monument');
    const items = m.querySelectorAll('.stele, .inscr-en, .dedication, .signature, #revisitBtn');
    items.forEach((el, i) => {
      el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'translateY(12px)';
      void el.offsetWidth;
      el.style.transition = 'opacity 1.4s ease, transform 1.4s ease';
      el.style.transitionDelay = (0.4 + i * 0.9) + 's';
    });
    show(m);
    requestAnimationFrame(() => items.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }));
  }

  // ------------------------------------------------------------ boot
  function loadImages() {
    return Promise.all(FLOORS.map(name => new Promise(res => {
      const img = new Image();
      img.onload = () => res([name, img]);
      img.onerror = () => res([name, null]);
      img.src = 'assets/floors/' + name + '.jpg';
    }))).then(list => { const o = {}; list.forEach(([k, v]) => { if (v) o[k] = v; }); return o; });
  }
  function loadFonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const p = Promise.all([
      document.fonts.load('700 20px Cinzel'), document.fonts.load('600 20px Cinzel'),
      document.fonts.load('400 20px "EB Garamond"'), document.fonts.load('italic 400 20px "EB Garamond"')
    ]).catch(() => {});
    return Promise.race([p, new Promise(r => setTimeout(r, 3000))]);
  }

  function startPlay() {
    $('hud').classList.remove('hidden');
    window.Game.begin();
    const st = window.Game.state;
    updateCounterQuiet(st.found.size);
    if (st.unlocked && !st.finaleSeen) setTimeout(() => toast(T.unlockedLa, T.unlockedAf), 600);
    else setTimeout(() => { const n = window.ROOM_NAMES.atrium; toast(window.Game.romanCaps(n.la), n.af, true); }, 500);
  }
  function updateCounterQuiet(n) { $('counter').querySelector('.num').innerHTML = '<b>' + n + '</b>/' + window.MEMORIES.length; }

  function boot() {
    fillText();
    $('loading').textContent = '';
    Promise.all([loadImages(), loadFonts()]).then(([images]) => {
      window.Vignettes.setImages(images);
      resumed = window.Game.init(images);
      $('enterBtn').disabled = false;
    });

    $('enterBtn').addEventListener('click', () => {
      window.GameAudio.unlock();
      hide($('title'));
      if (resumed || window.Game.state.found.size > 0) startPlay();
      else show($('intro'));
    });
    $('beginBtn').addEventListener('click', () => { hide($('intro')); startPlay(); });

    $('cardClose').addEventListener('click', closeCard);
    $('card').addEventListener('click', e => { if (e.target === $('card')) closeCard(); });
    document.querySelectorAll('#card .seg button').forEach(b => b.addEventListener('click', () => {
      window.Game.setLang(b.dataset.lang);
      renderCard();
    }));

    $('counter').addEventListener('click', openGallery);
    $('galClose').addEventListener('click', closeGallery);
    $('gallery').addEventListener('click', e => { if (e.target === $('gallery')) closeGallery(); });
    $('restartBtn').addEventListener('click', () => {
      if (window.confirm(T.restartConfirm)) { closeGallery(); window.Game.restart(); }
    });

    $('sound').addEventListener('click', () => {
      window.GameAudio.unlock();
      window.GameAudio.setMuted(!window.GameAudio.isMuted());
      updateSoundBtn();
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') { if ($('card').classList.contains('show')) closeCard(); else if ($('gallery').classList.contains('show')) closeGallery(); }
    });
  }

  window.UI = { toast, updateCounter, openCard, closeCard, openGallery, openFinale };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
