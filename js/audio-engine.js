/* ==========================================================================
   MORSE SPACE CADET - WEB AUDIO SYNTHESIZER ENGINE
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.currentSkin = "arcade"; // 'arcade', 'laser', 'sonar', 'classic'
    this.frequency = 600; // Hz
    this.wpm = 14;
    this.volume = 0.8;
    this.activeOsc = null;
    this.activeGain = null;
    this.isMuted = false;
    this.isPlayingSequence = false;
    this.sequenceCancelToken = { cancel: false };

    // Callbacks for visual sync
    this.onToneStart = null;
    this.onToneEnd = null;
  }

  // Initialize Audio Context on first user interaction
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setSkin(skinName) {
    this.currentSkin = skinName;
  }

  setWpm(wpm) {
    this.wpm = Math.max(8, Math.min(30, Number(wpm)));
  }

  setFrequency(freq) {
    this.frequency = Math.max(300, Math.min(1000, Number(freq)));
  }

  // Dit duration in milliseconds based on PARIS standard (1200 / WPM)
  getDitDurationMs() {
    return 1200 / this.wpm;
  }

  /* ==========================================================================
     START & STOP SINGLE TONE (For Manual Keyer & Sequence)
     ========================================================================== */
  startTone(freq = this.frequency) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    if (this.activeOsc) {
      this.stopTone();
    }

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Configure Oscillator Waveform based on Sound Skin
      switch (this.currentSkin) {
        case "arcade":
          osc.type = "square";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 0.006);
          break;

        case "laser":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq * 1.25, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + 0.12);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + 0.008);
          break;

        case "sonar":
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq * 1.1, now);
          osc.frequency.exponentialRampToValueAtTime(freq, now + 0.05);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + 0.015);
          break;

        case "classic":
        default:
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + 0.005);
          break;
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);

      this.activeOsc = osc;
      this.activeGain = gain;

      if (typeof this.onToneStart === "function") {
        this.onToneStart();
      }
    } catch (e) {
      console.warn("AudioEngine startTone error:", e);
    }
  }

  stopTone() {
    if (!this.ctx || !this.activeOsc || !this.activeGain) return;

    try {
      const now = this.ctx.currentTime;
      this.activeGain.gain.cancelScheduledValues(now);
      this.activeGain.gain.setValueAtTime(this.activeGain.gain.value, now);
      this.activeGain.gain.linearRampToValueAtTime(0.0001, now + 0.012);

      const osc = this.activeOsc;
      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      }, 20);

      this.activeOsc = null;
      this.activeGain = null;

      if (typeof this.onToneEnd === "function") {
        this.onToneEnd();
      }
    } catch (e) {
      console.warn("AudioEngine stopTone error:", e);
    }
  }

  /* ==========================================================================
     PLAY MORSE CODE SEQUENCE
     ========================================================================== */
  async playMorse(code, customWpm = null) {
    this.init();
    if (!code) return;

    // Cancel any currently playing sequence
    this.stopSequence();
    this.isPlayingSequence = true;
    const token = { cancel: false };
    this.sequenceCancelToken = token;

    const ditMs = customWpm ? 1200 / customWpm : this.getDitDurationMs();
    const dahMs = ditMs * 3;
    const elementGapMs = ditMs;
    const letterGapMs = ditMs * 3;
    const wordGapMs = ditMs * 7;

    for (let i = 0; i < code.length; i++) {
      if (token.cancel) break;

      const char = code[i];

      if (char === "." || char === "•") {
        this.startTone();
        await this._sleep(ditMs);
        this.stopTone();
        await this._sleep(elementGapMs);
      } else if (char === "-" || char === "—") {
        this.startTone();
        await this._sleep(dahMs);
        this.stopTone();
        await this._sleep(elementGapMs);
      } else if (char === " ") {
        await this._sleep(letterGapMs);
      } else if (char === "/" || char === "|") {
        await this._sleep(wordGapMs);
      }
    }

    this.isPlayingSequence = false;
  }

  stopSequence() {
    if (this.sequenceCancelToken) {
      this.sequenceCancelToken.cancel = true;
    }
    this.stopTone();
    this.isPlayingSequence = false;
  }

  /* ==========================================================================
     GAME SOUND EFFECTS (SFX)
     ========================================================================== */
  playSuccessChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5 - E5 - G5 - C6
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + idx * 0.07);

      gain.gain.setValueAtTime(0.001, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.3);
    });
  }

  playWrongBoop() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  playLevelUpFanfare() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.28 }, // E5
      { f: 783.99, d: 0.28 }, // G5
      { f: 1046.5, d: 0.55 }  // C6
    ];

    let t = this.ctx.currentTime;
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18 * this.volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + n.d + 0.05);
      t += n.d + 0.03;
    });
  }

  playClickTap() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.1 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Global Audio Engine Instance
const soundEngine = new AudioEngine();
