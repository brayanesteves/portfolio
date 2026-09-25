/**
 * @file animus-audio.js
 * @description AudioSystem Singleton Class. Generates synthesized sound effects.
 */

class AudioSystem {
  constructor() {
    if (AudioSystem.instance) {
      return AudioSystem.instance;
    }
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('animus_muted') === 'true';
    AudioSystem.instance = this;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playOscillator(type, startFreq, endFreq, dur, vol) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      if (endFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);
      }

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      console.warn("Audio Context Failed", e);
    }
  }

  playHover() {
    this.playOscillator('sine', 800, 1400, 0.05, 0.015);
  }

  playClick() {
    this.playOscillator('triangle', 1200, 400, 0.08, 0.04);
  }

  playSyncPulse() {
    this.playOscillator('sine', 200, 900, 0.35, 0.05);
  }

  playTyping() {
    this.playOscillator('square', 1800 + Math.random() * 400, null, 0.03, 0.008);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('animus_muted', this.isMuted);
    return this.isMuted;
  }

  getMuteState() {
    return this.isMuted;
  }
}

// Export singleton instance globally (Facade Pattern)
window.AnimusAudio = new AudioSystem();
