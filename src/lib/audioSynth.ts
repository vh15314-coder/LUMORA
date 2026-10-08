import { AmbienceType } from '../types';

class AmbienceSynthesizer {
  private ctx: AudioContext | null = null;
  private currentType: AmbienceType | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private currentVolume: number = 0.5;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private intervalIds: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.currentVolume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): AmbienceType | null {
    return this.currentType;
  }

  public stop() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];

    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentType = null;
  }

  public play(type: AmbienceType, volume: number = 0.5) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentType === type) {
      return;
    }

    this.stop();
    this.setVolume(volume);
    this.isPlaying = true;
    this.currentType = type;

    try {
      switch (type) {
        case 'rain':
          this.buildRainSynth();
          break;
        case 'ocean':
          this.buildOceanSynth();
          break;
        case 'forest':
          this.buildForestSynth();
          break;
        case 'fireplace':
          this.buildFireplaceSynth();
          break;
        case 'night':
          this.buildNightSynth();
          break;
        case 'instrumental':
          this.buildInstrumentalSynth();
          break;
        case 'birds':
          this.buildBirdsSynth();
          break;
      }
    } catch (err) {
      console.warn('Audio synthesis warning:', err);
    }
  }

  private createNoiseBuffer(seconds: number = 3): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pinkish/Brownian filtered noise for soft sound
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  private buildRainSynth() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(4);
    if (!buffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, gain);

    // Random gentle droplet taps
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const freq = 1200 + Math.random() * 800;

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + 0.06);

      dropGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    }, 450);

    this.intervalIds.push(interval);
  }

  private buildOceanSynth() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(5);
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

    // LFO for slow ocean waves
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, waveGain, lfo, lfoGain);
  }

  private buildForestSynth() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(4);
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise, filter, gain);
  }

  private buildFireplaceSynth() {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.createNoiseBuffer(3);
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise, filter, gain);

    // Crackle clicks
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      if (Math.random() < 0.6) {
        const snap = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snap.type = 'triangle';
        snap.frequency.setValueAtTime(400 + Math.random() * 1200, this.ctx.currentTime);

        snapGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);

        snap.connect(snapGain);
        snapGain.connect(this.masterGain);
        snap.start();
        snap.stop(this.ctx.currentTime + 0.03);
      }
    }, 250);

    this.intervalIds.push(interval);
  }

  private buildNightSynth() {
    if (!this.ctx || !this.masterGain) return;
    const drone = this.ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(110, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();
    this.activeNodes.push(drone, droneGain);

    // Cricket pulsing
    const cricket = this.ctx.createOscillator();
    cricket.type = 'sine';
    cricket.frequency.setValueAtTime(3800, this.ctx.currentTime);

    const cricketGain = this.ctx.createGain();
    cricketGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

    const mod = this.ctx.createOscillator();
    mod.frequency.setValueAtTime(8, this.ctx.currentTime);
    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

    mod.connect(modGain);
    modGain.connect(cricketGain.gain);

    cricket.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    cricket.start();
    mod.start();
    this.activeNodes.push(cricket, cricketGain, mod, modGain);
  }

  private buildInstrumentalSynth() {
    if (!this.ctx || !this.masterGain) return;
    const chordFreqs = [146.83, 220.0, 293.66, 369.99];

    chordFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.activeNodes.push(osc, gain);
    });
  }

  private buildBirdsSynth() {
    if (!this.ctx || !this.masterGain) return;
    // Gentle soft breeze in background
    const buffer = this.createNoiseBuffer(3);
    if (buffer) {
      const wind = this.ctx.createBufferSource();
      wind.buffer = buffer;
      wind.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      wind.connect(filter);
      filter.connect(windGain);
      windGain.connect(this.masterGain);
      wind.start();
      this.activeNodes.push(wind, filter, windGain);
    }

    // Melodic gentle birdsong notes
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;
      const noteCount = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < noteCount; i++) {
        const delay = i * 0.12;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const baseFreq = 2200 + Math.random() * 800;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, this.ctx.currentTime + delay + 0.08);

        noteGain.gain.setValueAtTime(0.02, this.ctx.currentTime + delay);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + 0.1);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + 0.12);
      }
    }, 1900);

    this.intervalIds.push(interval);
  }
}

export const ambienceSynth = new AmbienceSynthesizer();
