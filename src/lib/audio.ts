let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let nodes: AudioNode[] = [];

function buildDrone() {
  if (!ctx || !master) return;
  nodes.forEach((n) => {
    try {
      n.disconnect();
    } catch {
      /* noop */
    }
  });
  nodes = [];

  const mkOsc = (freq: number, type: OscillatorType, gain: number, detune = 0) => {
    const osc = ctx!.createOscillator();
    const g = ctx!.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    g.gain.setValueAtTime(0.0001, ctx!.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, ctx!.currentTime + 1.6);
    osc.connect(g);
    g.connect(master!);
    osc.start();
    nodes.push(osc, g);
    return osc;
  };

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.09;
  lfoGain.gain.value = 0.04;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 180;
  filter.Q.value = 6;
  filter.connect(master);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
  nodes.push(lfo, lfoGain, filter);

  const droneOsc = mkOsc(55, "sine", 0.05);
  mkOsc(82.4, "sine", 0.03, 4);
  mkOsc(110, "triangle", 0.02, -3);
  droneOsc.connect(filter);
}

export function enableAmbientSound() {
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume();
    return;
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(ctx.destination);
  buildDrone();
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.18;
  noise.buffer = buffer;
  noise.loop = true;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.012;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 420;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();
  nodes.push(noise, noiseGain, noiseFilter);
}

export function disableAmbientSound() {
  if (!ctx) return;
  ctx.suspend();
}
