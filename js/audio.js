const AudioSystem = {
  audio: null,
  isPlaying: false,
  isPausedByUser: false,
  volume: 0.3,
  _started: false,
  _trackQueue: [],
  _currentTrackIndex: 0,

  init() {
    this.volume = parseFloat(localStorage.getItem('story-volume') || '0.3');
    this._buildQueue();
    this._startTrack();
  },

  _buildQueue() {
    this._trackQueue = STORY_CONFIG.music.tracks.slice();
    this._currentTrackIndex = 0;
  },

  _startTrack() {
    if (this._trackQueue.length === 0) return;

    const track = this._trackQueue[this._currentTrackIndex];
    if (!track) {
      this._buildQueue();
      return this._startTrack();
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
      this.audio = null;
    }

    this.audio = new window.Audio();
    this.audio.src = track.src;
    this.audio.loop = false;
    this.audio.volume = 0;
    this.audio.preload = 'auto';

    this.audio.addEventListener('canplaythrough', () => {
      this._tryAutoplay();
    }, { once: true });

    this.audio.addEventListener('ended', () => {
      this._nextTrack();
    }, { once: true });

    this.audio.addEventListener('error', () => {
      if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
        console.warn('[Story] Audio not found:', track.src);
      }
      this._nextTrack();
    }, { once: true });

    this.audio.load();
  },

  _nextTrack() {
    this._currentTrackIndex++;
    if (this._currentTrackIndex >= this._trackQueue.length) {
      this._buildQueue();
    }
    this._startTrack();
  },

  async _tryAutoplay() {
    if (!this.audio || this.isPausedByUser) return;
    try {
      this.audio.volume = 0;
      await this.audio.play();
      this._started = true;
      this._fadeIn(this.volume, 2000);
      this.isPlaying = true;
      this.showControls();
    } catch (e) {
      if (!this._started) {
        this._waitForInteraction();
      }
    }
  },

  _waitForInteraction() {
    const handler = () => {
      if (this._started) return;
      this._started = true;
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('keydown', handler);
      this._play();
    };
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
    document.addEventListener('keydown', handler);
  },

  async _play() {
    if (!this.audio || this.isPausedByUser) return;
    try {
      this.audio.volume = 0;
      await this.audio.play();
      this._fadeIn(this.volume, 2000);
      this.isPlaying = true;
      this.showControls();
    } catch (e) {
      console.warn('[Story] Playback blocked:', e);
    }
  },

  pause() {
    if (!this.audio || !this.isPlaying) return;
    this._fadeOut(500).then(() => {
      if (this.audio) this.audio.pause();
      this.isPlaying = false;
      this.isPausedByUser = true;
      this._updatePauseUI();
    });
  },

  resume() {
    if (!this.audio || this.isPlaying || !this.isPausedByUser) return;
    this.audio.play().then(() => {
      this._fadeIn(this.volume, 500);
      this.isPlaying = true;
      this.isPausedByUser = false;
      this._updatePauseUI();
    }).catch(() => {});
  },

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  },

  setVolume(value) {
    this.volume = value;
    localStorage.setItem('story-volume', value);
    if (this.audio) this.audio.volume = value;
  },

  fadeOutAndStop() {
    if (!this.audio) return;
    this._fadeOut(2000).then(() => {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      this.isPlaying = false;
      this._updatePauseUI();
    });
  },

  _fadeIn(targetVol, duration) {
    return new Promise(resolve => {
      if (!this.audio) { resolve(); return; }
      const start = performance.now();
      const animate = (time) => {
        const p = Math.min((time - start) / duration, 1);
        this.audio.volume = targetVol * (1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(animate);
        else resolve();
      };
      requestAnimationFrame(animate);
    });
  },

  _fadeOut(duration) {
    return new Promise(resolve => {
      if (!this.audio) { resolve(); return; }
      const startVol = this.audio.volume;
      const start = performance.now();
      const animate = (time) => {
        const p = Math.min((time - start) / duration, 1);
        this.audio.volume = startVol * (1 - p);
        if (p < 1) requestAnimationFrame(animate);
        else resolve();
      };
      requestAnimationFrame(animate);
    });
  },

  showControls() {
    const el = document.getElementById('music-controls');
    if (el) {
      el.classList.remove('hidden');
      el.classList.add('visible');
    }
  },

  _updatePauseUI() {
    const pauseIcon = document.getElementById('music-icon-pause');
    const playIcon = document.getElementById('music-icon-play');
    const toggleBtn = document.getElementById('music-toggle');

    if (pauseIcon && playIcon) {
      pauseIcon.classList.toggle('hidden', !this.isPlaying);
      playIcon.classList.toggle('hidden', this.isPlaying);
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', this.isPlaying ? 'Pause music' : 'Play music');
    }
  }
};
