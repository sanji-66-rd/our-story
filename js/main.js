const Story = {
  currentScene: 'intro',
  currentChapter: 0,
  isTransitioning: false,
  starCanvas: null,
  starCtx: null,
  stars: [],
  mouseX: 0,
  mouseY: 0,

  init() {
    AudioSystem.init();
    this.initStars();
    this.initGrain();
    this.initEventListeners();
    Interactions.init();
    this.startIntro();
  },

  initStars() {
    this.starCanvas = document.getElementById('starfield');
    if (!this.starCanvas) return;

    this.starCtx = this.starCanvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const count = window.innerWidth < 768 ? 150 : 300;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.starCanvas.width,
        y: Math.random() * this.starCanvas.height,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    this.animateStars();
  },

  resizeCanvas() {
    if (!this.starCanvas) return;
    this.starCanvas.width = window.innerWidth;
    this.starCanvas.height = window.innerHeight;
  },

  animateStars() {
    if (!this.starCtx) return;

    this.starCtx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height);
    const time = Date.now() * 0.001;

    for (const star of this.stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinkleOffset) * 0.3 + 0.7;
      const parallaxX = this.mouseX * star.speed * 15;
      const parallaxY = this.mouseY * star.speed * 15;
      const x = star.x + parallaxX;
      const y = star.y + parallaxY;

      this.starCtx.beginPath();
      this.starCtx.arc(x, y, star.size, 0, Math.PI * 2);
      this.starCtx.fillStyle = 'rgba(255, 255, 255, ' + (star.opacity * twinkle) + ')';
      this.starCtx.fill();
    }

    requestAnimationFrame(() => this.animateStars());
  },

  initGrain() {
    const grain = document.createElement('div');
    grain.className = 'grain-overlay';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);
  },

  initEventListeners() {
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
      musicToggle.addEventListener('click', () => AudioSystem.toggle());
    }

    const volumeSlider = document.getElementById('music-volume');
    if (volumeSlider) {
      volumeSlider.value = AudioSystem.volume * 100;
      volumeSlider.addEventListener('input', (e) => {
        AudioSystem.setVolume(e.target.value / 100);
      });
    }
  },

  async startIntro() {
    const container = document.getElementById('intro-lines');
    if (!container) return;

    await Animations.delay(1500);

    const lines = STORY_CONFIG.intro.lines;
    await Animations.showSceneLines(container, lines);

    await Animations.delay(STORY_TIMING.chapterPause * 2);

    await this.beginStory();
  },

  async beginStory() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const starfield = document.getElementById('starfield');
    if (starfield) starfield.classList.add('star-accelerate');

    await this.transitionToScene('chapter-01');

    this.currentChapter = 1;
    this.updateProgress(1);
    await this.renderChapter('chapter01', 'ch01-body', 1);

    this.isTransitioning = false;

    await Animations.delay(STORY_TIMING.chapterPause);
    await this.nextChapter(1);
  },

  async nextChapter(currentNum) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const nextNum = currentNum + 1;

    if (nextNum === 8) {
      await this.showFinalMessage();
      this.isTransitioning = false;
      return;
    }

    const chapterKey = 'chapter0' + nextNum;

    this.updateProgress(nextNum);

    await this.transitionToScene('chapter-0' + nextNum);

    this.currentChapter = nextNum;
    await this.renderChapter(chapterKey, 'ch0' + nextNum + '-body', nextNum);

    this.isTransitioning = false;

    await Animations.delay(STORY_TIMING.chapterPause);
    await this.nextChapter(nextNum);
  },

  async transitionToScene(sceneId) {
    const current = document.querySelector('.scene.active');
    const next = document.getElementById(sceneId);

    if (!next) return;

    if (current) {
      current.classList.add('scene-transition-blur-exit');
      await Animations.delay(STORY_TIMING.transitionBlurOut);
      current.classList.remove('active', 'scene-transition-blur-exit');
    }

    next.classList.add('active', 'scene-transition-blur-enter');
    await Animations.delay(STORY_TIMING.transitionBlurIn);
    next.classList.remove('scene-transition-blur-enter');
  },

  async renderChapter(chapterKey, bodyId, chapterNum) {
    const config = STORY_CONFIG.chapters[chapterKey];
    if (!config) return;

    const body = document.getElementById(bodyId);
    if (!body) return;

    body.innerHTML = '';

    const header = body.closest('.scene').querySelector('.chapter-header');
    if (header) {
      header.classList.remove('elevated');
    }
    body.classList.remove('reading-active');

    await Animations.delay(STORY_TIMING.titleHold);

    if (header) {
      header.classList.add('elevated');
    }
    body.classList.add('reading-active');

    await Animations.delay(1400);

    const particlesContainer = document.getElementById('particles-container');

    for (const scene of config.scenes) {
      switch (scene.type) {
        case 'text':
          await Animations.showSceneLines(body, scene.lines);
          break;

        case 'title':
          await Animations.showTitleStage(body, scene.text, scene.style);
          break;

        case 'timeProgression':
          await Interactions.showTimeProgression(body);
          break;

        case 'joke':
          await Interactions.showJoke(body, scene.word, scene.context);
          break;

        case 'multiJoke':
          await Interactions.showMultiJoke(body, scene.jokes);
          break;

        case 'phrase':
          await Interactions.showPhrase(body, scene.word);
          break;

        case 'bubbles':
          await Interactions.showBubbles(body, scene.words);
          break;

        case 'interactiveWords':
          Interactions.showInteractiveWords(body, scene.words);
          await Animations.waitForClick();
          break;

        case 'fragments':
          await Interactions.showFragments(body, scene.words);
          break;

        case 'timeline':
          await Interactions.showTimeline(body, scene.milestones);
          break;

        case 'cyclingWords':
          await Interactions.showCyclingWords(body, scene.question, scene.words, scene.final);
          break;

        case 'counter':
          await Interactions.showCounter(body, scene.from, scene.to, scene.text);
          break;

        case 'constellation':
          Interactions.showConstellation(body, scene.stars);
          await Animations.waitForClick();
          break;

        case 'splitScreen':
          Interactions.showSplitScreen(body, scene.left, scene.right);
          await Animations.waitForClick();
          break;

        case 'interactiveQuestion':
          await Interactions.showInteractiveQuestion(body, scene.question, scene.options, scene.response);
          break;

        case 'map':
          Interactions.showMap(body);
          await Animations.waitForClick();
          break;

        case 'digitalScreen':
          Interactions.showDigitalScreen(body, scene.items);
          await Animations.waitForClick();
          break;

        case 'meetingSequence':
          await Interactions.showMeetingSequence(body, scene.steps);
          break;

        case 'travel':
          Interactions.showTravel(body, scene.places, scene.icons);
          await Animations.waitForClick();
          break;

        case 'home':
          Interactions.showHome(body, scene.moments);
          await Animations.waitForClick();
          break;

        case 'homeScene':
          Interactions.showHomeScene(body);
          await Animations.waitForClick();
          break;

        case 'timeLapse':
          await Interactions.showTimeLapse(body, scene.stages);
          break;

        case 'interactiveChoice':
          await Interactions.showInteractiveChoice(body, scene);
          break;

        case 'memoryChoice':
          Interactions.showMemoryChoice(body, scene);
          await Animations.waitForClick();
          break;
      }
    }

    if (chapterNum === 1 || chapterNum === 6 || chapterNum === 7) {
      Animations.createParticles(particlesContainer, 15, 'warm');
    }
  },

  async showFinalMessage() {
    const finalSection = document.getElementById('final-message');
    const finalContent = document.getElementById('final-content');

    if (!finalSection || !finalContent) return;

    this.updateProgress(8);

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.querySelector('#progress-text').style.width = '100%';
    }

    await this.transitionToScene('final-message');

    finalContent.innerHTML = '';

    const lines = STORY_CONFIG.finalMessage.lines;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isLast = i === lines.length - 1;

      if (line.style === 'break') {
        await Animations.delay(STORY_TIMING.breakPause);
        continue;
      }

      const stage = finalContent.querySelector('.scene-stage') || this._createFinalStage(finalContent);
      const textEl = stage.querySelector('.stage-text');

      textEl.className = 'stage-text ' + line.style;

      if (Animations.reducedMotion) {
        textEl.textContent = line.text;
        textEl.classList.add('visible');
        if (!isLast) {
          await Animations.waitForClick();
          textEl.classList.remove('visible');
        }
        continue;
      }

      textEl.textContent = line.text;
      textEl.classList.remove('exiting');
      textEl.classList.remove('visible');
      void textEl.offsetHeight;

      textEl.classList.add('visible');

      if (isLast) {
        Animations.hideContinueButton();
      } else {
        await Animations.waitForClick();
        textEl.classList.remove('visible');
        textEl.classList.add('exiting');
        await Animations.delay(STORY_TIMING.fadeOut);
        textEl.classList.remove('exiting');
      }
    }

    Animations.createParticles(document.getElementById('particles-container'), 25, 'warm');
  },

  _createFinalStage(container) {
    const stage = document.createElement('div');
    stage.className = 'scene-stage';
    const textEl = document.createElement('div');
    textEl.className = 'stage-text';
    stage.appendChild(textEl);
    container.appendChild(stage);
    return stage;
  },

  _getFinalHoldTime(style) {
    switch (style) {
      case 'final-title': return STORY_TIMING.finalHoldShort;
      case 'i-mean': return STORY_TIMING.finalHoldShort;
      case 'emphasis': return STORY_TIMING.finalHoldMedium;
      case 'to-be-continued': return STORY_TIMING.finalHoldLong;
      case 'normal': return STORY_TIMING.finalHoldMedium;
      default: return STORY_TIMING.finalHoldShort;
    }
  },

  updateProgress(chapter) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (!progressBar || !progressText) return;

    progressBar.classList.add('visible');

    if (chapter <= 7) {
      const percent = (chapter / 8) * 100;
      progressText.style.width = percent + '%';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Story.init();
});
