const Interactions = {
  init() {
    this.initCursor();
  },

  initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    this._attachCursorListeners();
  },

  _attachCursorListeners() {
    document.querySelectorAll('button, a, [role="button"], .interactive-word, .constellation-star, .memory-option, .choice-option, .interactive-option').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const c = document.getElementById('custom-cursor');
        if (c) c.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        const c = document.getElementById('custom-cursor');
        if (c) c.classList.remove('hover');
      });
    });
  },

  refreshCursorTargets() {
    this._attachCursorListeners();
  },

  _clearStageText(container) {
    const stageText = container.querySelector('.scene-stage .stage-text');
    if (stageText) {
      stageText.classList.remove('visible', 'exiting');
    }
  },

  async showTimeProgression(container) {
    this._clearStageText(container);
    const timeDiv = document.createElement('div');
    timeDiv.className = 'time-progression';
    container.appendChild(timeDiv);

    const labelEl = document.createElement('div');
    labelEl.className = 'time-progression-label';
    labelEl.textContent = 'that night';
    timeDiv.appendChild(labelEl);

    const timeEl = document.createElement('div');
    timeEl.className = 'time-progression-time';
    timeEl.textContent = '23:00';
    timeDiv.appendChild(timeEl);

    await Animations.delay(300);
    timeDiv.classList.add('visible');

    const totalMinutes = 300;
    const intervalMs = 30;

    await new Promise(resolve => {
      let minutes = 0;
      const interval = setInterval(() => {
        minutes++;

        const h = (23 + Math.floor(minutes / 60)) % 24;
        const m = minutes % 60;
        timeEl.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');

        if (minutes >= totalMinutes) {
          clearInterval(interval);
          timeEl.textContent = '04:00';
          resolve();
        }
      }, intervalMs);
    });

    await Animations.waitForClick();
    timeDiv.remove();
  },

  async showJoke(container, word, context) {
    this._clearStageText(container);
    const jokeDiv = document.createElement('div');
    jokeDiv.className = 'joke-container';
    container.appendChild(jokeDiv);

    const wordEl = document.createElement('div');
    wordEl.className = 'joke-word';
    wordEl.textContent = word;
    jokeDiv.appendChild(wordEl);

    const contextEl = document.createElement('div');
    contextEl.className = 'joke-context';
    contextEl.textContent = context;
    jokeDiv.appendChild(contextEl);

    await Animations.delay(300);
    wordEl.classList.add('visible');
    await Animations.delay(1500);
    contextEl.classList.add('visible');

    await Animations.waitForClick();
    jokeDiv.remove();
  },

  async showMultiJoke(container, jokes) {
    this._clearStageText(container);
    const jokeDiv = document.createElement('div');
    jokeDiv.className = 'joke-container';
    container.appendChild(jokeDiv);

    for (let i = 0; i < jokes.length; i++) {
      const item = document.createElement('div');
      item.className = 'joke-item';
      jokeDiv.appendChild(item);

      const wordEl = document.createElement('div');
      wordEl.className = 'joke-word';
      wordEl.textContent = jokes[i].word;
      item.appendChild(wordEl);

      const contextEl = document.createElement('div');
      contextEl.className = 'joke-context';
      contextEl.textContent = jokes[i].context;
      item.appendChild(contextEl);

      await Animations.delay(300);
      wordEl.classList.add('visible');
      await Animations.delay(1200);
      contextEl.classList.add('visible');

      if (i < jokes.length - 1) {
        await Animations.delay(600);
      }
    }

    await Animations.waitForClick();
    jokeDiv.remove();
  },

  async showPhrase(container, word) {
    this._clearStageText(container);
    const phraseDiv = document.createElement('div');
    phraseDiv.className = 'phrase-container';
    container.appendChild(phraseDiv);

    const wordEl = document.createElement('div');
    wordEl.className = 'phrase-word';
    wordEl.textContent = word;
    phraseDiv.appendChild(wordEl);

    await Animations.delay(300);
    wordEl.classList.add('visible');

    await Animations.waitForClick();
    phraseDiv.remove();
  },

  async showBubbles(container, words) {
    this._clearStageText(container);
    const bubblesDiv = document.createElement('div');
    bubblesDiv.className = 'bubbles-container';
    container.appendChild(bubblesDiv);

    for (const word of words) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = word;
      bubblesDiv.appendChild(bubble);
    }

    const bubbleEls = bubblesDiv.querySelectorAll('.bubble');
    for (let i = 0; i < bubbleEls.length; i++) {
      await Animations.delay(400);
      bubbleEls[i].classList.add('visible');
      await Animations.delay(500);
    }

    await Animations.waitForClick();
    bubblesDiv.remove();
  },

  showInteractiveWords(container, words) {
    this._clearStageText(container);
    const wordsDiv = document.createElement('div');
    wordsDiv.className = 'interactive-words';

    for (const word of words) {
      const btn = document.createElement('button');
      btn.className = 'interactive-word';
      btn.textContent = word;
      btn.setAttribute('aria-label', 'Click to hear about ' + word);
      btn.addEventListener('click', () => this.showWordMemory(word));
      wordsDiv.appendChild(btn);
    }

    container.appendChild(wordsDiv);
    this.refreshCursorTargets();
  },

  showWordMemory(word) {
    const existing = document.querySelector('.word-tooltip');
    if (existing) existing.remove();

    const memory = STORY_CONFIG.wordMemories[word] || 'A memory between us.';

    const tooltip = document.createElement('div');
    tooltip.className = 'word-tooltip';
    tooltip.textContent = memory;
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);

    requestAnimationFrame(() => {
      tooltip.classList.add('visible');
    });

    setTimeout(() => {
      tooltip.classList.remove('visible');
      setTimeout(() => tooltip.remove(), 400);
    }, 3000);
  },

  async showFragments(container, words) {
    this._clearStageText(container);
    const fragmentsDiv = document.createElement('div');
    fragmentsDiv.className = 'fragments-container';
    container.appendChild(fragmentsDiv);

    const fragmentEls = [];
    for (const word of words) {
      const frag = document.createElement('div');
      frag.className = 'fragment';
      frag.textContent = word;
      fragmentsDiv.appendChild(frag);
      fragmentEls.push(frag);
    }

    const assembled = document.createElement('div');
    assembled.className = 'fragment assembled';
    assembled.textContent = 'YOU.';
    assembled.style.opacity = '0';
    fragmentsDiv.appendChild(assembled);

    for (let i = 0; i < fragmentEls.length; i++) {
      await Animations.delay(400);
      fragmentEls[i].classList.add('visible');
      await Animations.delay(600);
    }

    await Animations.delay(800);
    assembled.style.transition = 'opacity 1s var(--ease-cinematic)';
    assembled.style.opacity = '1';

    await Animations.waitForClick();
    fragmentsDiv.remove();
  },

  async showTimeline(container, milestones) {
    this._clearStageText(container);
    const timelineDiv = document.createElement('div');
    timelineDiv.className = 'timeline';
    container.appendChild(timelineDiv);

    for (const m of milestones) {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = '<div class="timeline-day">' + m.day + '</div><div class="timeline-text">' + m.text + '</div>';
      timelineDiv.appendChild(item);
    }

    const items = timelineDiv.querySelectorAll('.timeline-item');
    for (let i = 0; i < items.length; i++) {
      await Animations.delay(400);
      items[i].classList.add('visible');
      await Animations.delay(700);
    }

    await Animations.waitForClick();
    timelineDiv.remove();
  },

  async showCyclingWords(container, question, words, finalWord) {
    this._clearStageText(container);
    const cyclingDiv = document.createElement('div');
    cyclingDiv.className = 'cycling-container';
    container.appendChild(cyclingDiv);

    const questionEl = document.createElement('div');
    questionEl.className = 'cycling-question';
    questionEl.textContent = question;
    cyclingDiv.appendChild(questionEl);

    const wordEl = document.createElement('div');
    wordEl.className = 'cycling-word';
    cyclingDiv.appendChild(wordEl);

    await Animations.delay(500);
    questionEl.classList.add('visible');
    await Animations.delay(1000);

    for (const word of words) {
      wordEl.textContent = word;
      wordEl.style.opacity = '0';
      await Animations.delay(150);
      wordEl.style.transition = 'opacity 0.6s';
      wordEl.style.opacity = '1';
      await Animations.delay(1400);
      wordEl.style.opacity = '0';
      await Animations.delay(500);
    }

    wordEl.className = 'cycling-word final-word';
    wordEl.textContent = finalWord;
    wordEl.style.opacity = '0';
    await Animations.delay(300);
    wordEl.style.opacity = '1';

    await Animations.waitForClick();
    cyclingDiv.remove();
  },

  async showCounter(container, from, to, label) {
    this._clearStageText(container);
    const counterDiv = document.createElement('div');
    counterDiv.className = 'counter-container';
    container.appendChild(counterDiv);

    await Animations.animateCounter(counterDiv, from, to, 2500);

    const labelEl = document.createElement('div');
    labelEl.className = 'counter-label';
    labelEl.textContent = label;
    counterDiv.appendChild(labelEl);

    await Animations.delay(300);
    labelEl.classList.add('visible');

    await Animations.waitForClick();
    counterDiv.remove();
  },

  showConstellation(container, stars) {
    this._clearStageText(container);
    const constellationDiv = document.createElement('div');
    constellationDiv.className = 'constellation-container';

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      const starEl = document.createElement('button');
      starEl.className = 'constellation-star';
      starEl.style.left = star.x + '%';
      starEl.style.top = star.y + '%';
      starEl.setAttribute('aria-label', 'Memory: ' + star.label);

      const label = document.createElement('span');
      label.className = 'constellation-label';
      label.textContent = star.label;
      starEl.appendChild(label);

      starEl.addEventListener('click', () => {
        this.showConstellationMemory(star.label);
      });

      constellationDiv.appendChild(starEl);
    }

    for (let i = 0; i < stars.length - 1; i++) {
      const line = document.createElement('div');
      line.className = 'constellation-line';
      const x1 = stars[i].x;
      const y1 = stars[i].y;
      const x2 = stars[i + 1].x;
      const y2 = stars[i + 1].y;
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      line.style.left = x1 + '%';
      line.style.top = y1 + '%';
      line.style.width = length + '%';
      line.style.transform = 'rotate(' + angle + 'deg)';
      constellationDiv.appendChild(line);
    }

    container.appendChild(constellationDiv);
    this.refreshCursorTargets();
  },

  showConstellationMemory(label) {
    const existing = document.querySelector('.word-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'word-tooltip';
    tooltip.textContent = label;
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);

    requestAnimationFrame(() => tooltip.classList.add('visible'));

    setTimeout(() => {
      tooltip.classList.remove('visible');
      setTimeout(() => tooltip.remove(), 400);
    }, 3000);
  },

  showSplitScreen(container, left, right) {
    this._clearStageText(container);
    const splitDiv = document.createElement('div');
    splitDiv.className = 'split-screen';

    const leftPanel = document.createElement('div');
    leftPanel.className = 'split-panel';
    leftPanel.innerHTML = '<div class="split-title">' + left.title + '</div><div class="split-text">' + left.text + '</div>';

    const rightPanel = document.createElement('div');
    rightPanel.className = 'split-panel';
    rightPanel.innerHTML = '<div class="split-title">' + right.title + '</div><div class="split-text">' + right.text + '</div>';

    splitDiv.appendChild(leftPanel);
    splitDiv.appendChild(rightPanel);
    container.appendChild(splitDiv);

    setTimeout(() => leftPanel.classList.add('visible'), 300);
    setTimeout(() => rightPanel.classList.add('visible'), 800);
  },

  async showInteractiveQuestion(container, question, options, response) {
    this._clearStageText(container);
    const qDiv = document.createElement('div');
    qDiv.className = 'interactive-question';
    container.appendChild(qDiv);

    const qText = document.createElement('div');
    qText.className = 'interactive-question-text';
    qText.textContent = question;
    qDiv.appendChild(qText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'interactive-options';

    const responseEl = document.createElement('div');
    responseEl.className = 'interactive-response';
    responseEl.textContent = response;

    let userInteracted = false;
    let resolveInteraction;

    for (const option of options) {
      const btn = document.createElement('button');
      btn.className = 'interactive-option';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        if (userInteracted) return;
        userInteracted = true;
        optionsDiv.querySelectorAll('.interactive-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        responseEl.classList.add('visible');
        optionsDiv.querySelectorAll('.interactive-option').forEach(b => {
          if (b !== btn) b.style.opacity = '0.3';
        });
        if (resolveInteraction) resolveInteraction();
      });
      optionsDiv.appendChild(btn);
    }

    qDiv.appendChild(optionsDiv);
    qDiv.appendChild(responseEl);
    this.refreshCursorTargets();

    await new Promise(resolve => {
      resolveInteraction = resolve;
    });

    await Animations.waitForClick();
    await Animations.delay(STORY_TIMING.interactionFade);
    qDiv.remove();
  },

  showMemoryChoice(container, config) {
    this._clearStageText(container);
    const choiceDiv = document.createElement('div');
    choiceDiv.className = 'memory-choice';
    container.appendChild(choiceDiv);

    const prompt = document.createElement('div');
    prompt.className = 'memory-choice-prompt';
    prompt.textContent = config.prompt;
    choiceDiv.appendChild(prompt);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'memory-options';

    const revealDiv = document.createElement('div');
    revealDiv.className = 'memory-reveal';
    const revealText = document.createElement('div');
    revealText.className = 'memory-reveal-text';
    revealDiv.appendChild(revealText);

    let userClicked = false;

    for (const option of config.options) {
      const btn = document.createElement('button');
      btn.className = 'memory-option';
      btn.textContent = option.label;
      btn.addEventListener('click', () => {
        if (userClicked) return;
        userClicked = true;
        optionsDiv.querySelectorAll('.memory-option').forEach(b => {
          b.style.opacity = b === btn ? '1' : '0.3';
        });
        revealText.textContent = option.memory;
        revealDiv.classList.add('visible');
      });
      optionsDiv.appendChild(btn);
    }

    choiceDiv.appendChild(optionsDiv);
    choiceDiv.appendChild(revealDiv);
    this.refreshCursorTargets();
  },

  showMap(container) {
    this._clearStageText(container);
    const mapDiv = document.createElement('div');
    mapDiv.className = 'map-container';
    mapDiv.innerHTML = '<div class="map-line"></div><div class="map-point" style="left: 15%"></div><div class="map-point" style="right: 15%"></div><div class="map-distance">~200 km</div>';
    container.appendChild(mapDiv);
  },

  showDigitalScreen(container, items) {
    this._clearStageText(container);
    const screenDiv = document.createElement('div');
    screenDiv.className = 'digital-screen';

    for (const item of items) {
      const itemEl = document.createElement('div');
      itemEl.className = 'screen-item';
      itemEl.textContent = item;
      screenDiv.appendChild(itemEl);
    }

    container.appendChild(screenDiv);

    const itemEls = screenDiv.querySelectorAll('.screen-item');
    itemEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 200 + 300);
    });
  },

  async showMeetingSequence(container, steps) {
    this._clearStageText(container);
    const seqDiv = document.createElement('div');
    seqDiv.className = 'meeting-sequence';
    container.appendChild(seqDiv);

    for (let i = 0; i < steps.length; i++) {
      const step = document.createElement('div');
      step.className = 'meeting-step';
      step.textContent = steps[i];
      if (i === steps.length - 1) step.classList.add('highlight');
      seqDiv.appendChild(step);

      if (i < steps.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'meeting-arrow';
        arrow.textContent = '\u2193';
        seqDiv.appendChild(arrow);
      }
    }

    const stepEls = seqDiv.querySelectorAll('.meeting-step');
    const arrowEls = seqDiv.querySelectorAll('.meeting-arrow');

    for (let i = 0; i < stepEls.length; i++) {
      await Animations.delay(400);
      stepEls[i].classList.add('visible');
      if (arrowEls[i]) {
        await Animations.delay(200);
        arrowEls[i].classList.add('visible');
      }
      await Animations.delay(600);
    }

    await Animations.waitForClick();
    seqDiv.remove();
  },

  showTravel(container, places, icons) {
    this._clearStageText(container);
    const travelDiv = document.createElement('div');
    travelDiv.className = 'travel-container';

    for (let i = 0; i < places.length; i++) {
      const item = document.createElement('div');
      item.className = 'travel-item';
      item.innerHTML = '<div class="travel-icon">' + icons[i] + '</div><div class="travel-text">' + places[i] + '</div>';
      travelDiv.appendChild(item);
    }

    container.appendChild(travelDiv);

    const items = travelDiv.querySelectorAll('.travel-item');
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 300 + 300);
    });
  },

  showHome(container, moments) {
    this._clearStageText(container);
    const homeDiv = document.createElement('div');
    homeDiv.className = 'home-container';

    const momentsDiv = document.createElement('div');
    momentsDiv.className = 'home-moments';

    for (const moment of moments) {
      const m = document.createElement('div');
      m.className = 'home-moment';
      m.textContent = moment;
      momentsDiv.appendChild(m);
    }

    homeDiv.appendChild(momentsDiv);
    container.appendChild(homeDiv);

    const mEls = momentsDiv.querySelectorAll('.home-moment');
    mEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 200 + 300);
    });
  },

  showHomeScene(container) {
    this._clearStageText(container);
    const homeDiv = document.createElement('div');
    homeDiv.className = 'home-scene';
    homeDiv.innerHTML = '<div class="home-scene-icon">\uD83C\uDFE0</div>';
    container.appendChild(homeDiv);

    setTimeout(() => {
      homeDiv.querySelector('.home-scene-icon').classList.add('visible');
    }, 300);
  },

  async showTimeLapse(container, stages) {
    this._clearStageText(container);
    const lapseDiv = document.createElement('div');
    lapseDiv.className = 'time-lapse';
    container.appendChild(lapseDiv);

    for (let i = 0; i < stages.length; i++) {
      const stage = document.createElement('div');
      stage.className = 'time-lapse-stage';
      stage.textContent = stages[i];
      lapseDiv.appendChild(stage);

      if (i < stages.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'time-lapse-arrow';
        arrow.textContent = '\u2193';
        lapseDiv.appendChild(arrow);
      }
    }

    const stageEls = lapseDiv.querySelectorAll('.time-lapse-stage');
    const arrowEls = lapseDiv.querySelectorAll('.time-lapse-arrow');

    for (let i = 0; i < stageEls.length; i++) {
      await Animations.delay(500);
      stageEls[i].classList.add('visible');
      stageEls[i].classList.add('active');
      if (arrowEls[i]) {
        await Animations.delay(300);
        arrowEls[i].classList.add('visible');
      }
      await Animations.delay(800);
      if (i < stageEls.length - 1) {
        stageEls[i].classList.remove('active');
        stageEls[i].style.color = 'var(--text-muted)';
      }
    }

    await Animations.waitForClick();
    lapseDiv.remove();
  },

  async showInteractiveChoice(container, config, onChoice) {
    this._clearStageText(container);
    const choiceDiv = document.createElement('div');
    choiceDiv.className = 'interactive-choice';
    container.appendChild(choiceDiv);

    if (config.question) {
      const q = document.createElement('div');
      q.className = 'choice-question';
      q.textContent = config.question;
      choiceDiv.appendChild(q);
    }

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'choice-options';

    const responseEl = document.createElement('div');
    responseEl.className = 'choice-response';

    let userInteracted = false;
    let resolveInteraction;

    for (const option of config.options) {
      const btn = document.createElement('button');
      btn.className = 'choice-option';
      btn.textContent = option;
      btn.addEventListener('click', () => {
        if (userInteracted) return;
        userInteracted = true;
        optionsDiv.querySelectorAll('.choice-option').forEach(b => {
          b.classList.remove('selected');
          if (b !== btn) b.style.opacity = '0.3';
        });
        btn.classList.add('selected');

        const resp = config.responses[option];
        const text = typeof resp === 'object' ? resp.text : resp;
        responseEl.textContent = text;
        responseEl.classList.add('visible');

        if (onChoice) onChoice(option, resp);

        if (resolveInteraction) resolveInteraction();
      });
      optionsDiv.appendChild(btn);
    }

    choiceDiv.appendChild(optionsDiv);
    choiceDiv.appendChild(responseEl);
    this.refreshCursorTargets();

    await new Promise(resolve => {
      resolveInteraction = resolve;
    });

    await Animations.waitForClick();
    await Animations.delay(STORY_TIMING.interactionFade);
    choiceDiv.remove();
  }
};
