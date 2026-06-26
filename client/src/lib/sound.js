/**
 * sound.js — the Zeus thunderclap, synthesised live via the Web Audio API.
 *
 * The welcome clap fires ONCE — on the user's first gesture after landing.
 * It does NOT replay on every route change (that's jarring in public/shared
 * spaces). `isArmed()` lets callers know audio is unlocked so they can use
 * the engine for future purposeful sounds if ever needed.
 */

let ctx = null;
let master = null;
let armed = false;
let lastClap = 0;

/** True once the user has interacted and audio is unlocked. */
export function isArmed() {
  return armed;
}

function getCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

/** Resume a suspended context (browsers start it suspended until a gesture). */
function resume() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/** A short buffer of brown-ish noise — the raw material for the thunder cracks. */
function makeNoiseBuffer(c, seconds) {
  const len = Math.floor(c.sampleRate * seconds);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

/**
 * The signature Zeus thunderclap: a bright initial crack that decays into a
 * long, low rolling rumble. ~2.4s tail.
 */
export function playThunder(vol = 1) {
  const c = getCtx();
  if (!c) return;
  resume();

  // Throttle: never stack two claps on top of each other (e.g. a nav click that
  // both arms audio AND changes the route).
  const t = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  if (t - lastClap < 800) return;
  lastClap = t;

  try {
    const now = c.currentTime;
    const out = c.createGain();
    out.gain.value = Math.max(0, Math.min(1, vol));
    out.connect(master);

    /* 1 — the crack: noise through a lowpass that sweeps down fast */
    const crack = c.createBufferSource();
    crack.buffer = makeNoiseBuffer(c, 2.6);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2200, now);
    lp.frequency.exponentialRampToValueAtTime(180, now + 1.8);
    lp.Q.value = 0.7;

    const crackGain = c.createGain();
    crackGain.gain.setValueAtTime(0.0001, now);
    crackGain.gain.exponentialRampToValueAtTime(1.0, now + 0.04); // sharp attack
    crackGain.gain.exponentialRampToValueAtTime(0.28, now + 0.5); // initial decay
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4); // long roll-off

    crack.connect(lp);
    lp.connect(crackGain);
    crackGain.connect(out);

    /* 2 — sub-bass rumble: a sine sweeping low for chest-thump body */
    const sub = c.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(90, now);
    sub.frequency.exponentialRampToValueAtTime(38, now + 1.6);
    const subGain = c.createGain();
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.7, now + 0.08);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    sub.connect(subGain);
    subGain.connect(out);

    /* 3 — a delayed second crack for the natural "rolling" double-clap */
    const roll = c.createBufferSource();
    roll.buffer = makeNoiseBuffer(c, 1.6);
    const rollLp = c.createBiquadFilter();
    rollLp.type = 'lowpass';
    rollLp.frequency.setValueAtTime(900, now + 0.25);
    rollLp.frequency.exponentialRampToValueAtTime(150, now + 1.6);
    const rollGain = c.createGain();
    rollGain.gain.setValueAtTime(0.0001, now + 0.25);
    rollGain.gain.exponentialRampToValueAtTime(0.5, now + 0.4);
    rollGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
    roll.connect(rollLp);
    rollLp.connect(rollGain);
    rollGain.connect(out);

    crack.start(now);
    crack.stop(now + 2.6);
    sub.start(now);
    sub.stop(now + 2.1);
    roll.start(now + 0.25);
    roll.stop(now + 2.0);
  } catch { /* never let audio break the UI */ }
}

/**
 * Arm the audio engine on the first user gesture (required by browser autoplay
 * policy) and play a welcome thunderclap. Safe to call multiple times.
 */
export function initSound() {
  if (armed) return;
  if (typeof window === 'undefined') return;

  const arm = () => {
    if (armed) return;
    armed = true;
    const c = getCtx();
    if (c) {
      resume();
      setTimeout(() => playThunder(0.6), 80); // welcome clap
    }
    window.removeEventListener('pointerdown', arm);
    window.removeEventListener('keydown', arm);
    window.removeEventListener('touchstart', arm);
  };

  window.addEventListener('pointerdown', arm, { once: true, passive: true });
  window.addEventListener('keydown', arm, { once: true });
  window.addEventListener('touchstart', arm, { once: true, passive: true });
}
