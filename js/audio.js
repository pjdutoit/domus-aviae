/* Domus Aviae — sound. Web Audio only, no libraries.
   Finale music: plays assets/audio/piano.mp3 if it exists; otherwise a gentle
   synthesized "Ode to Joy" (Beethoven, public domain). */
(function () {
  'use strict';

  let ac = null, master = null, muted = false, music = null;
  try { muted = localStorage.getItem('domusAviae.muted') === '1'; } catch (e) { /* ignore */ }

  function unlock() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = muted ? 0 : 0.8;
      master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
  }

  function tone(freq, start, dur, type, vol, dest) {
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(dest || master);
    o.start(start); o.stop(start + dur + 0.05);
  }
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);

  function pop() {
    if (!ac || muted) return;
    const t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(700 + Math.random() * 300, t);
    o.frequency.exponentialRampToValueAtTime(1500, t + 0.06);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.12);
  }

  function chime(isNew) {
    if (!ac || muted) return;
    const t = ac.currentTime + 0.02;
    const notes = isNew ? [72, 76, 79, 84] : [76, 79];
    notes.forEach((n, i) => { tone(midi(n), t + i * 0.09, 1.2, 'triangle', 0.09); tone(midi(n + 12), t + i * 0.09, 0.6, 'sine', 0.03); });
  }

  function door() {
    if (!ac || muted) return;
    const t = ac.currentTime + 0.05;
    tone(70, t, 0.5, 'sine', 0.25);
    [60, 64, 67, 72, 76].forEach((n, i) => tone(midi(n), t + 0.3 + i * 0.12, 1.8, 'triangle', 0.07));
  }

  function knock() {
    if (!ac || muted) return;
    const t = ac.currentTime;
    tone(110, t, 0.12, 'sine', 0.3); tone(105, t + 0.16, 0.12, 'sine', 0.3);
  }

  // ---------------------------------------------------------------- finale music
  const E = 64, F = 65, G = 67, D = 62, C = 60, G3 = 55;
  const A1 = [[E, 1], [E, 1], [F, 1], [G, 1], [G, 1], [F, 1], [E, 1], [D, 1], [C, 1], [C, 1], [D, 1], [E, 1]];
  const ODE = [].concat(
    A1, [[E, 1.5], [D, 0.5], [D, 2]],
    A1, [[D, 1.5], [C, 0.5], [C, 2]],
    [[D, 1], [D, 1], [E, 1], [C, 1], [D, 1], [E, 0.5], [F, 0.5], [E, 1], [C, 1], [D, 1], [E, 0.5], [F, 0.5], [E, 1], [D, 1], [C, 1], [D, 1], [G3, 2]],
    A1, [[D, 1.5], [C, 0.5], [C, 2]]
  );
  const BASS = [48, 43, 48, 43, 48, 43, 48, 48, 43, 48, 43, 48, 48, 43, 48, 48];   // one root per bar

  function synthOde() {
    const out = ac.createGain();
    out.gain.value = 0.9;
    out.connect(master);
    const beat = 0.62;
    let t = ac.currentTime + 0.4, beats = 0;
    ODE.forEach(([n, d]) => {
      const len = Math.max(0.9, d * beat * 2.2);
      tone(midi(n + 12), t, len, 'triangle', 0.11, out);
      tone(midi(n + 24), t, len * 0.5, 'sine', 0.025, out);
      if (beats % 4 === 0) {
        const root = BASS[(beats / 4) % BASS.length];
        tone(midi(root), t, beat * 3.6, 'sine', 0.07, out);
        tone(midi(root + 7), t + beat, beat * 2.6, 'sine', 0.035, out);
      }
      beats += d;
      t += d * beat;
    });
    return {
      stop() {
        const now = ac.currentTime;
        out.gain.setValueAtTime(out.gain.value, now);
        out.gain.linearRampToValueAtTime(0, now + 1.2);
        setTimeout(() => out.disconnect(), 1500);
      }
    };
  }

  function playPiano() {
    unlock();
    if (!ac) return;
    stopMusic();
    let stopped = false;
    const handle = { stop() { stopped = true; if (this.inner) this.inner.stop(); } };
    music = handle;
    fetch('assets/audio/piano.mp3')
      .then(r => { if (!r.ok) throw new Error('no recording'); return r.arrayBuffer(); })
      .then(buf => new Promise((res, rej) => ac.decodeAudioData(buf, res, rej)))
      .then(audio => {
        if (stopped) return;
        const src = ac.createBufferSource(), g = ac.createGain();
        src.buffer = audio; g.gain.value = 1;
        src.connect(g); g.connect(master); src.start();
        handle.inner = { stop() { const n = ac.currentTime; g.gain.setValueAtTime(g.gain.value, n); g.gain.linearRampToValueAtTime(0, n + 1.5); setTimeout(() => { try { src.stop(); } catch (e) { /* ignore */ } }, 1600); } };
      })
      .catch(() => { if (!stopped) handle.inner = synthOde(); });
  }

  function stopMusic() { if (music) { music.stop(); music = null; } }

  function setMuted(m) {
    muted = m;
    try { localStorage.setItem('domusAviae.muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
    if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ac.currentTime, 0.05);
  }

  window.GameAudio = { unlock, pop, chime, door, knock, playPiano, stopMusic, setMuted, isMuted: () => muted };
})();
