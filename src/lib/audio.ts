const SONG_PATH = "/audio/dark-knight-rises.mp3";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let motifTimer: ReturnType<typeof setTimeout> | null = null;
let droneNodes: AudioNode[] = [];
let songEl: HTMLAudioElement | null = null;

/* Low, brooding melody scheduler — a dark two-bar motif in D minor. */
const MOTIF = [
  { f: 146.83, d: 0.5 }, // D3
  { f: 220.0, d: 0.32 }, // A3
  { f: 174.61, d: 0.5 }, // F3
  { f: 293.66, d: 0.34 }, // D4
  { f: 174.61, d: 0.62 }, // F3
  { f: 220.0, d: 0.5 }, // A3
];

function stopMotif() {
  if (motifTimer) {
    clearTimeout(motifTimer);
    motifTimer = null;
  }
  droneNodes.forEach((n) => {
    try {
      n.disconnect();
    } catch {
      /* noop */
    }
  });
  droneNodes = [];
}

function startMotif() {
  if (!ctx || !master) return;
  stopMotif();
  if (ctx.state === "suspended") ctx.resume();

  /* Low sustained pedal tone for weight. */
  const pedal = ctx.createOscillator();
  pedal.type = "sine";
  pedal.frequency.value = 73.42; // D2
  const pedalGain = ctx.createGain();
  pedalGain.gain.value = 0.045;
  pedal.connect(pedalGain);
  pedalGain.connect(master);
  pedal.start();
  droneNodes.push(pedal, pedalGain);

  const step = (i: number) => {
    if (!ctx || !master) return;
    const note = MOTIF[i % MOTIF.length];
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.value = note.f;
    osc.detune.value = -6;
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 2.5;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + note.d);
    osc.connect(filter);
    filter.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + note.d + 0.05);
    droneNodes.push(osc, g, filter);
    motifTimer = setTimeout(() => step(i + 1), note.d * 1000 + 620);
  };
  step(0);
}

/* Try to play the real theme; fall back to the synthesized motif. */
function playSong() {
  return new Promise<void>((resolve) => {
    const audio = new Audio(SONG_PATH);
    let done = false;
    const sw = setTimeout(() => finish(false), 3000);
    function finish(ok: boolean) {
      if (done) return;
      done = true;
      clearTimeout(sw);
      if (!ok) {
        audio.pause();
        songEl = null;
        startMotif();
      } else {
        songEl = audio;
      }
      resolve();
    }
    audio.loop = true;
    audio.volume = 0.55;
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.addEventListener("canplay", () => finish(true), { once: true });
    audio.play().catch(() => finish(false));
  });
}

export async function enableAmbientSound() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") await ctx.resume();

  if (songEl) {
    if (songEl.paused) await songEl.play().catch(() => undefined);
    return;
  }
  await playSong();
}

export function disableAmbientSound() {
  if (songEl) {
    songEl.pause();
    return;
  }
  stopMotif();
  if (ctx && ctx.state === "running") ctx.suspend();
}
