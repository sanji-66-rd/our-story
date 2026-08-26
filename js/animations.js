const Animations = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  showContinueButton() {
    const btn = document.getElementById('continue-btn');
    if (btn) btn.classList.add('visible');
  },

  hideContinueButton() {
    const btn = document.getElementById('continue-btn');
    if (btn) btn.classList.remove('visible');
  },

  waitForClick() {
    return new Promise(resolve => {
      const btn = document.getElementById('continue-btn');
      if (!btn) { resolve(); return; }

      const handler = () => {
        btn.removeEventListener('click', handler);
        this.hideContinueButton();
        resolve();
      };

      btn.addEventListener('click', handler);
      this.showContinueButton();
    });
  },

  calculateReadingDuration(text) {
    if (!text) return STORY_TIMING.minReading;
    const len = text.length;
    const computed = STORY_TIMING.minReading + len * STORY_TIMING.readingPerChar;
    return Math.min(Math.max(computed, STORY_TIMING.minReading), STORY_TIMING.maxReading);
  },

  async showSceneLines(container, lines) {
    if (this.reducedMotion) {
      return this._showSceneLinesReducedMotion(container, lines);
    }

    let stage = container.querySelector('.scene-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'scene-stage';
      container.appendChild(stage);
    }

    let textEl = stage.querySelector('.stage-text');
    if (!textEl) {
      textEl = document.createElement('div');
      textEl.className = 'stage-text';
      stage.appendChild(textEl);
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === '' || line === undefined) {
        await this.delay(STORY_TIMING.introLinePause);
        continue;
      }

      textEl.textContent = line;
      textEl.classList.remove('exiting');
      textEl.classList.remove('visible');
      void textEl.offsetHeight;

      textEl.classList.add('visible');

      await this.waitForClick();

      textEl.classList.remove('visible');
      textEl.classList.add('exiting');
      await this.delay(STORY_TIMING.fadeOut);
      textEl.classList.remove('exiting');
    }
  },

  async _showSceneLinesReducedMotion(container, lines) {
    let stage = container.querySelector('.scene-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'scene-stage';
      container.appendChild(stage);
    }

    let textEl = stage.querySelector('.stage-text');
    if (!textEl) {
      textEl = document.createElement('div');
      textEl.className = 'stage-text';
      stage.appendChild(textEl);
    }

    for (const line of lines) {
      if (line === '' || line === undefined) {
        await this.delay(300);
        continue;
      }
      textEl.textContent = line;
      textEl.classList.add('visible');
      await this.waitForClick();
      textEl.classList.remove('visible');
    }
  },

  async showTitleStage(container, text, styleClass, holdMs) {
    holdMs = holdMs || STORY_TIMING.titleHold;

    if (this.reducedMotion) {
      const stage = this._ensureStage(container);
      const textEl = stage.querySelector('.stage-text');
      textEl.textContent = text;
      textEl.className = 'stage-text visible ' + (styleClass || '');
      await this.waitForClick();
      textEl.classList.remove('visible');
      await this.delay(100);
      return;
    }

    const stage = this._ensureStage(container);
    const textEl = stage.querySelector('.stage-text');

    textEl.textContent = text;
    textEl.className = 'stage-text ' + (styleClass || '');

    await this.delay(50);
    textEl.classList.add('visible');

    await this.waitForClick();

    textEl.classList.remove('visible');
    textEl.classList.add('exiting');
    await this.delay(STORY_TIMING.fadeOut);
    textEl.classList.remove('exiting');
  },

  _ensureStage(container) {
    let stage = container.querySelector('.scene-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'scene-stage';
      container.appendChild(stage);
    }

    let textEl = stage.querySelector('.stage-text');
    if (!textEl) {
      textEl = document.createElement('div');
      textEl.className = 'stage-text';
      stage.appendChild(textEl);
    }

    return stage;
  },

  fadeElement(element, show, duration) {
    show = show !== false;
    duration = duration || 600;
    return new Promise(resolve => {
      if (this.reducedMotion) {
        element.style.opacity = show ? '1' : '0';
        element.classList.toggle('visible', show);
        resolve();
        return;
      }
      element.classList.toggle('visible', show);
      setTimeout(resolve, duration);
    });
  },

  async animateCounter(container, from, to, duration) {
    duration = duration || 2000;
    const numberEl = document.createElement('div');
    numberEl.className = 'counter-number';
    container.appendChild(numberEl);

    if (this.reducedMotion) {
      numberEl.textContent = to;
      return numberEl;
    }

    const steps = Math.min(to - from, 60);
    const stepDuration = duration / steps;
    let current = from;

    return new Promise(resolve => {
      const interval = setInterval(() => {
        current += Math.ceil((to - from) / steps);
        if (current >= to) {
          current = to;
          clearInterval(interval);
          numberEl.textContent = current;
          resolve(numberEl);
        } else {
          numberEl.textContent = current;
        }
      }, stepDuration);
    });
  },

  createParticles(container, count, type) {
    count = count || 20;
    type = type || 'warm';
    if (this.reducedMotion) return;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle particle-' + type;
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = (Math.random() * 100) + '%';
      particle.style.top = (Math.random() * 100) + '%';
      container.appendChild(particle);
      this.animateParticle(particle);
    }
  },

  animateParticle(particle) {
    if (this.reducedMotion) return;
    const duration = Math.random() * 3000 + 2000;
    const delay = Math.random() * 2000;

    setTimeout(() => {
      particle.style.transition = 'opacity ' + duration + 'ms, transform ' + duration + 'ms';
      particle.style.opacity = Math.random() * 0.6 + 0.2;
      particle.style.transform = 'translate(' + ((Math.random() - 0.5) * 100) + 'px, ' + ((Math.random() - 0.5) * 100) + 'px)';

      setTimeout(() => {
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.style.transform = 'translate(' + ((Math.random() - 0.5) * 100) + 'px, ' + ((Math.random() - 0.5) * 100) + 'px)';
          setTimeout(() => this.animateParticle(particle), duration);
        }, duration);
      }, duration);
    }, delay);
  },

  clearParticles(container) {
    if (!container) return;
    container.querySelectorAll('.particle').forEach(p => p.remove());
  }
};
