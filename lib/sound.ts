// Tiny generative soundscape: a low drone plus a chime on each decision.
// No audio files; everything is synthesised with WebAudio.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

export function soundOn() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.connect(master);
    master.connect(ctx.destination);

    // A1, E2, A2 (slightly detuned) form a calm open fifth
    [55, 82.4, 110.3].forEach((f, i) => {
      const o = ctx!.createOscillator();
      o.type = i === 1 ? "triangle" : "sine";
      o.frequency.value = f;
      const g = ctx!.createGain();
      g.gain.value = 0.16 / (i + 1);
      // slow breathing LFO
      const lfo = ctx!.createOscillator();
      lfo.frequency.value = 0.07 + i * 0.03;
      const lg = ctx!.createGain();
      lg.gain.value = 0.05;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(filter);
      o.start();
      lfo.start();
    });
  }
  ctx.resume();
  enabled = true;
  master!.gain.cancelScheduledValues(ctx.currentTime);
  master!.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
}

export function soundOff() {
  enabled = false;
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
}

/** Bright chime when the Self rises, dark tone when the Shadow does. */
export function chime(kind: "light" | "dark") {
  if (!ctx || !enabled) return;
  const now = ctx.currentTime;
  const notes = kind === "light" ? [523.25, 659.25, 783.99] : [146.83, 174.61, 207.65];
  notes.forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = kind === "light" ? "sine" : "triangle";
    o.frequency.value = f;
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0, now + i * 0.09);
    g.gain.linearRampToValueAtTime(0.12, now + i * 0.09 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.8);
    o.connect(g).connect(ctx!.destination);
    o.start(now + i * 0.09);
    o.stop(now + i * 0.09 + 2);
  });
}
