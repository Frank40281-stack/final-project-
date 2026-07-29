/* jshint esversion: 6 */


/* ════════════════════════════════════════════════════════════════


   Alpha 阿爾法投資 — Main JavaScript


   Reference: Lexus JMS2025 scroll-driven immersive UX


   ════════════════════════════════════════════════════════════════ */





/* ─────────────────────────────────────────────


   SECTOR DATA


───────────────────────────────────────────── */


const SECTORS = [


  {


    id: 1,


    zh: '國防 / 航太 / 軍工',


    en: 'Aerospace & Defense',


    img: 'assets/img/sector-aerospace.png',


    stocksA: ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'HII', 'LHX', 'LDOS', 'BAH', 'SAIC', 'CACI', 'PLTR', 'HON', 'GE', 'BWXT', 'KTOS', 'AVAV', 'MRCY', 'OSK', 'TXT', 'KBR', 'FLR', 'ACM', 'J', 'RKLB', 'LUNR'],


    stocksB: ['AAL', 'DAL', 'UAL', 'LUV', 'ALK', 'JBLU', 'CPA', 'TDG', 'HEI', 'SPR', 'HWM', 'ATI', 'ACHR', 'JOBY', 'EPEO']


  },


  {


    id: 2,


    zh: 'AI / 資料中心 / 電力基建',


    en: 'AI & Cloud Data Center',


    img: 'assets/img/sector-ai-cloud.jpg',


    stocksA: ['NVDA', 'AMD', 'MSFT', 'AMZN', 'GOOGL', 'ORCL', 'PLTR', 'VRT', 'ETN', 'PWR', 'GEV', 'CEG', 'VST', 'NRG', 'AEP', 'PCG', 'DUK', 'SO', 'EXC', 'EIX', 'PEG'],


    stocksB: ['CRM', 'NOW', 'ADBE', 'SNOW', 'DDOG', 'NET', 'MDB', 'WDAY', 'TEAM', 'SHOP', 'UBER', 'LYFT', 'RBLX']


  },


  {


    id: 3,


    zh: '半導體',


    en: 'Semiconductor',


    img: 'assets/img/sector-semiconductor.jpg',


    stocksA: ['INTC', 'TSM', 'MU', 'GFS', 'TXN', 'AMKR', 'HPQ', 'GLW', 'ENTG', 'COHR', 'MCHP', 'NXPI', 'NVDA', 'AMD'],


    stocksB: ['QCOM', 'AVGO', 'MRVL', 'ARM', 'ON', 'ADI', 'KLAC', 'LRCX', 'ASML', 'TER', 'MPWR', 'SWKS', 'QRVO', 'LSCC', 'SIMO', 'SMCI']


  },


  {


    id: 4,


    zh: '關鍵礦物 / 稀土 / 金屬材料',


    en: 'Critical Minerals',


    img: 'assets/img/sector-nuclear.jpg', // Using existing image since there isn't a specific one


    stocksA: ['MP', 'LAC', 'USAR', 'TMQ', 'UUUU', 'IONR', 'NB', 'FCX', 'ALB', 'PLL', 'NUE', 'STLD', 'CLF', 'AA', 'CENX', 'SCCO', 'TECK'],


    stocksB: ['RIO', 'BHP', 'VALE', 'NEM', 'GOLD', 'AEM', 'PAAS', 'HL', 'CDE', 'KGC', 'SAND', 'WPM']


  },


  {


    id: 5,


    zh: '核能 / 鈾 / SMR',


    en: 'Nuclear Energy & SMR',


    img: 'assets/img/sector-petrochemical.jpg', // Using existing image


    stocksA: ['LEU', 'BWXT', 'CEG', 'OKLO', 'SMR', 'NNE', 'UUUU', 'UEC', 'URG', 'CCJ', 'DNN', 'NXE', 'LTBR', 'ASPI'],


    stocksB: ['WEC', 'AEE', 'CMS', 'ES', 'ED', 'FE', 'NI', 'PPL', 'AES', 'XEL', 'ATO']


  },


  {


    id: 6,


    zh: '傳統能源 / LNG / 煤 / 油服',


    en: 'Traditional Energy',


    img: 'assets/img/sector-ev.jpg', // Using existing image


    stocksA: ['XOM', 'CVX', 'COP', 'OXY', 'EOG', 'FANG', 'DVN', 'APA', 'CTRA', 'EQT', 'EXE', 'AR', 'RRC', 'LNG', 'WMB', 'KMI', 'ET', 'EPD', 'MPLX', 'OKE', 'PAA', 'HAL', 'SLB', 'BKR', 'NOV', 'BTU', 'AMR', 'CNR', 'HCC', 'ARLP', 'SXC', 'NRP'],


    stocksB: ['ENPH', 'SEDG', 'RUN', 'NOVA', 'FSLR', 'BEP', 'CWEN', 'AY', 'HASI', 'NEE']


  },


  {


    id: 7,


    zh: 'EV / 電池 / 充電',


    en: 'EV & Battery',


    img: 'assets/img/sector-steel.jpg', // Using existing image


    stocksA: ['F', 'GM', 'RIVN', 'EVGO', 'LAC', 'IONR'],


    stocksB: ['LCID', 'CHPT', 'BLNK', 'QS', 'FREY', 'WKHS', 'GOEVQ', 'NKLAQ']


  },


  {


    id: 8,


    zh: '製藥 / 製造回流',


    en: 'Pharmaceuticals & Reshoring',


    img: 'assets/img/sector-robotics.jpg', // Using existing image


    stocksA: ['PFE', 'REGN', 'AMGN', 'BMY', 'GILD', 'GSK', 'MRK', 'NVS', 'SNY', 'LLY', 'NVO', 'JNJ', 'ABBV', 'AZN'],


    stocksB: ['MRNA', 'BNTX', 'VRTX', 'BIIB', 'ALNY', 'IONS', 'INCY', 'EXAS', 'ILMN', 'CRSP', 'NTLA', 'EDIT', 'BEAM', 'RXRX']


  },


];





/* Make sectors globally available for sub-pages */


window.SECTORS = SECTORS;





/* ─────────────────────────────────────────────


   GSAP + LENIS SETUP


───────────────────────────────────────────── */


if (typeof ScrollTrigger !== 'undefined') {


  gsap.registerPlugin(ScrollTrigger);


}





let lenis;

const HERO_REVEAL_PANEL_COUNT = 6;
const HERO_REVEAL_MOBILE_PANEL_COUNT = 5;
const HERO_REVEAL_PANEL_DELAYS = [0, 0.055, 0.11, 0.18, 0.25, 0.33];
const HERO_REVEAL_PANEL_DURATIONS = [0.90, 0.86, 0.94, 0.88, 0.96, 0.91];
const HERO_REVEAL_PANEL_EASE = 'power4.inOut';
const SECTION_TRANSITION_TOUCH_THRESHOLD = 42;

let transitionInputLocked = true;
let transitionWheelGateHandler = null;
let transitionTouchStartY = null;

function stopTransitionEvent(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (e && typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
}

function blockTransitionInput(e) {
  if (
    e &&
    e.type === 'wheel' &&
    typeof transitionWheelGateHandler === 'function' &&
    transitionWheelGateHandler(e.deltaY, e)
  ) {
    return;
  }
  if (!transitionInputLocked) return;
  stopTransitionEvent(e);
}

function rememberTransitionTouch(e) {
  transitionTouchStartY = e.touches && e.touches.length ? e.touches[0].clientY : null;
}

function blockTransitionTouchMove(e) {
  if (transitionInputLocked) {
    stopTransitionEvent(e);
    return;
  }
  if (
    transitionTouchStartY == null ||
    !e.touches ||
    !e.touches.length ||
    typeof transitionWheelGateHandler !== 'function'
  ) {
    return;
  }

  var deltaY = transitionTouchStartY - e.touches[0].clientY;
  if (Math.abs(deltaY) > SECTION_TRANSITION_TOUCH_THRESHOLD && transitionWheelGateHandler(deltaY, e)) {
    transitionTouchStartY = null;
  }
}

window.addEventListener('wheel', blockTransitionInput, { capture: true, passive: false });
window.addEventListener('touchstart', rememberTransitionTouch, { capture: true, passive: true });
window.addEventListener('touchmove', blockTransitionTouchMove, { capture: true, passive: false });
window.addEventListener('keydown', function(e) {
  if (!transitionInputLocked) return;
  var blockedKeys = [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  if (blockedKeys.indexOf(e.key) !== -1) {
    stopTransitionEvent(e);
  }
}, { capture: true });


function initLenis() {


  if (typeof Lenis === 'undefined') return;


  lenis = new Lenis({ lerp: 0.075, smoothWheel: true });


  if (typeof ScrollTrigger !== 'undefined') {


    lenis.on('scroll', ScrollTrigger.update);


  }


  gsap.ticker.add(t => lenis.raf(t * 1000));


  gsap.ticker.lagSmoothing(0);


}





/* ─────────────────────────────────────────────


   CUSTOM CURSOR


───────────────────────────────────────────── */


function initCursor() {


  const cursor = document.getElementById('cursor');


  const dot    = cursor.querySelector('.cursor__dot');


  const ring   = cursor.querySelector('.cursor__ring');





  let mx = -100, my = -100;


  let rx = -100, ry = -100;





  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });





  (function animRing() {


    rx += (mx - rx) * 0.10;


    ry += (my - ry) * 0.10;


    gsap.set(cursor, { x: mx, y: my });


    gsap.set(ring, { x: rx - mx, y: ry - my });


    requestAnimationFrame(animRing);


  })();





  document.querySelectorAll('a, button').forEach(el => {


    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));


    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));


  });


  document.querySelectorAll('.s-ind-card').forEach(el => {


    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--view'));


    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--view'));


  });


}





/* ─────────────────────────────────────────────


   LOADING ANIMATION


───────────────────────────────────────────── */


function initLoading() {


  const numEl  = document.getElementById('counter-num');


  const bar    = document.getElementById('loading-bar');


  const screen = document.getElementById('loading');


  const wrap   = document.getElementById('wrapper');





  let count = 0;


  const tick = setInterval(() => {


    count += Math.floor(Math.random() * 6) + 2;


    if (count >= 100) { count = 100; clearInterval(tick); setTimeout(() => onLoadComplete(screen, wrap), 600); }


    numEl.textContent = String(count).padStart(2, '0');


    bar.style.width   = count + '%';


  }, 28);


}





function onLoadComplete(screen, wrap) {


  playEntryAnimation();


  wrap.classList.add('is-ready');


  gsap.to(screen, {


    opacity: 0,


    duration: 0.9,


    ease: 'power2.inOut',


    onComplete: () => {
      screen.style.display = 'none';
      document.documentElement.classList.remove('is-home-booting');
      transitionInputLocked = false;
      if (lenis && typeof lenis.start === 'function') lenis.start();
    }


  });


}





/* ─────────────────────────────────────────────


   ENTRY ANIMATION (HJSD-style curtain reveal)


───────────────────────────────────────────── */


function playEntryAnimation() {


  var curtainStrip = document.getElementById('hero-curtain-strip');


  var curtain      = document.getElementById('hero-curtain');





  var tl = gsap.timeline({


    defaults: { ease: 'power3.out' },


    onComplete: function() {


      if (curtain) curtain.style.display = 'none';


      initHeroExpand();


      ScrollTrigger.refresh();


      startHeadlineColorCycle();


    }


  });





  // 1. Curtain slides up (HJSD style: scaleY 1->0 from top)


  if (curtainStrip) {


    tl.to(curtainStrip, {


      scaleY: 0,


      transformOrigin: 'top center',


      duration: 1.1,


      ease: 'power4.inOut'


    }, 0);


  }





  // 2. Reveal every first-screen element in the same frame.
  var collage = document.getElementById('hero-collage');
  if (collage) {
    collage.style.opacity = '0';
    tl.add(function() {
      var ticker = document.getElementById('hero-ticker');
      collage.style.opacity = '1';
      collage.classList.add('is-ready');
      if (ticker) ticker.classList.add('is-in');
      gsap.set(['#header-logo', '#menu-btn'], { opacity: 1, y: 0 });
      document.documentElement.classList.add('is-hero-first-frame-ready');
    }, 0.7);
  } else {
    var ticker = document.getElementById('hero-ticker');
    if (ticker) ticker.classList.add('is-in');
    gsap.set(['#header-logo', '#menu-btn'], { opacity: 1, y: 0 });
    document.documentElement.classList.add('is-hero-first-frame-ready');
  }


}





/* ─────────────────────────────────────────────


   HERO SCROLL TRANSITION


───────────────────────────────────────────── */


function startHeadlineColorCycle() {


  initHeroWheelSnap();


}


function initHeroScrollTransition() {


  initHeroWheelSnap();


}


function initHeroWheelSnap() {


  if (typeof gsap === 'undefined') return;


  var hero = document.querySelector('.s-hero-new');
  var statement = document.getElementById('statement');
  var industries = document.getElementById('industries');


  if (!hero || !statement || !industries || hero.dataset.wheelSnapReady === 'true') return;


  hero.dataset.wheelSnapReady = 'true';


  var transitionState = getScrollY() >= statement.offsetTop - 4 ? 'content' : 'hero-snap';
  var activeTimeline = null;
  var transitionToken = 0;
  var wheelReleaseLocked = false;
  var lastWheelAt = 0;
  var wheelIdleTimer = null;
  var lockedScrollY = 0;
  var WHEEL_IDLE_MS = 140;
  var SNAP_HOLD_MS = 220;
  var SNAP_TOLERANCE_PX = 2;
  var snapHoldTimer = null;
  var lastWheelDirection = null;
  var scrollCheckScheduled = false;
  var scrollLocked = false;
  var activeUnlockScroll = null;
  var reusableReveal = null;

  document.body.dataset.homeTransitionState = transitionState;
  window.__homeTransitionState = transitionState;


  ensureStatementCarry();

  window.addEventListener('resize', function() {
    var carry = getStatementCarry();
    var layer = document.querySelector('.s-hero-title-layer');
    if (carry && layer && carry.parentNode === layer) {
      reserveStatementTitleSlotHeight(carry);
    }
  }, { passive: true });


  function getScrollY() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }


  function setImmediateScrollY(top) {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(top, { immediate: true, force: true });
    }
    window.scrollTo({ top: top, left: 0, behavior: 'auto' });
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  }


  function setImmediateScroll(target) {
    setImmediateScrollY(target.offsetTop);
  }


  function lockScrollAt(top) {
    if (scrollLocked) return activeUnlockScroll;

    var html = document.documentElement;
    var body = document.body;
    var lockTop = Math.max(top, 0);
    var scrollbarWidth = window.innerWidth - html.clientWidth;
    var previous = {
      htmlScrollBehavior: html.style.scrollBehavior,
      htmlOverflow: html.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    lockedScrollY = lockTop;
    scrollLocked = true;
    html.style.scrollBehavior = 'auto';
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = (-lockTop) + 'px';
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'clip';
    if (scrollbarWidth > 0) body.style.paddingRight = scrollbarWidth + 'px';

    activeUnlockScroll = function unlockScroll(targetTop) {
      if (!scrollLocked) return;
      scrollLocked = false;
      activeUnlockScroll = null;
      html.style.scrollBehavior = previous.htmlScrollBehavior;
      html.style.overflow = previous.htmlOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPaddingRight;
      setImmediateScrollY(typeof targetTop === 'number' ? targetTop : lockedScrollY);
    };
    return activeUnlockScroll;
  }


  function ensureStatementCarry() {
    var slot = ensureStatementTitleSlot();
    var existing = document.querySelector('.s-statement__carry');
    if (existing) {
      setStatementCarryHeroMode(false);
      return;
    }
    var carry = document.createElement('div');
    carry.className = 's-statement__carry is-visible is-hero-title';
    carry.setAttribute('role', 'heading');
    carry.setAttribute('aria-level', '1');
    carry.innerHTML =
      '<div class="s-statement__carry-line s-statement__carry-line--one">投資不該是被密密麻麻數字淹沒</div>' +
      '<div class="s-statement__carry-line s-statement__carry-line--two">而是清晰可見的未來</div>' +
      '<p class="s-statement__carry-subtitle">Alpha Investment Guide — Where Every Trend Becomes Clear</p>';
    slot.appendChild(carry);
    setStatementCarryHeroMode(false);
  }


  function ensureStatementTitleSlot() {
    var slot = statement.querySelector('.s-statement__title-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.className = 's-statement__title-slot';
      var body = statement.querySelector('.s-statement__body');
      statement.insertBefore(slot, body || statement.firstChild);
    }
    return slot;
  }


  function ensureStatementTitleLayer() {
    var layer = document.querySelector('.s-hero-title-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 's-hero-title-layer';
      document.body.appendChild(layer);
    }
    layer.removeAttribute('aria-hidden');
    return layer;
  }


  function getStatementCarry() {
    return document.querySelector('.s-statement__carry');
  }


  function reserveStatementTitleSlotHeight(carry) {
    var slot = ensureStatementTitleSlot();
    if (!carry) return slot;
    var rect = carry.getBoundingClientRect();
    var height = Math.ceil(rect.height || carry.offsetHeight || 0);
    if (height > 0) {
      slot.style.minHeight = height + 'px';
    }
    return slot;
  }


  function clearStatementTitleSlotHeight() {
    var slot = ensureStatementTitleSlot();
    slot.style.minHeight = '';
  }


  function moveStatementCarryToHeroLayer() {
    var carry = getStatementCarry();
    if (!carry) return;
    reserveStatementTitleSlotHeight(carry);
    var layer = ensureStatementTitleLayer();
    if (carry.parentNode !== layer) {
      layer.appendChild(carry);
    }
  }


  function moveStatementCarryToStatement() {
    var carry = getStatementCarry();
    if (!carry) return;
    var slot = ensureStatementTitleSlot();
    if (carry.parentNode !== slot) {
      slot.appendChild(carry);
    }
  }


  function setStatementCarryHeroMode(started) {
    var carry = getStatementCarry();
    if (!carry) return;
    moveStatementCarryToHeroLayer();
    carry.classList.add('is-visible', 'is-hero-title');
    carry.classList.toggle('is-started', !!started);
  }


  function setStatementCarryNaturalMode() {
    var carry = getStatementCarry();
    if (!carry) return;
    moveStatementCarryToStatement();
    carry.classList.add('is-visible');
    carry.classList.remove('is-hero-title', 'is-started');
    clearStatementTitleSlotHeight();
  }


  function syncStatementCarryToScroll() {
    if (isTransitionActive() || transitionState === 'snap-hold') return;
    var y = getScrollY();
    var statementTop = statement.offsetTop;
    var industriesTop = industries.offsetTop;
    var isPastHero = y >= statementTop - 4;
    var isInIndustries = y >= industriesTop - 4;

    document.body.classList.toggle('is-industries-view', isInIndustries);

    if (isPastHero) {
      if (transitionState === 'hero-snap') transitionState = 'content';
      revealStatementContent(statement);
      setStatementCarryNaturalMode();
    } else {
      if (transitionState === 'content' || transitionState === 'intro-snap') return;
      transitionState = 'hero-snap';
      setStatementCarryHeroMode(false);
    }
  }


  function clearSnapHoldTimer() {
    if (snapHoldTimer !== null) {
      window.clearTimeout(snapHoldTimer);
      snapHoldTimer = null;
    }
  }


  function getIntroSnapY() {
    var intro = document.querySelector('[data-intro-snap]');
    if (!intro) return 0;
    return Math.max(0, intro.offsetTop);
  }


  function enterIntroSnapHold() {
    if (transitionState !== 'content' && transitionState !== 'intro-snap') return;

    var snapY = getIntroSnapY();
    transitionState = 'snap-hold';
    var token = ++transitionToken;
    clearSnapHoldTimer();
    clearWheelReleaseGuard();
    transitionInputLocked = true;
    if (lenis && typeof lenis.stop === 'function') lenis.stop();
    setImmediateScrollY(snapY);
    window.__homeTransitionState = transitionState;
    document.body.dataset.homeTransitionState = transitionState;
    document.body.classList.add('is-intro-snap-hold');
    var unlockScroll = lockScrollAt(snapY);

    snapHoldTimer = window.setTimeout(function() {
      snapHoldTimer = null;
      if (token !== transitionToken || transitionState !== 'snap-hold') return;
      startReverseFromSnap(token, unlockScroll);
    }, SNAP_HOLD_MS);
  }


  function startReverseFromSnap(token, unlockScroll) {
    if (token !== transitionToken || transitionState !== 'snap-hold' || activeTimeline) return;
    transitionState = 'reverse';
    document.body.classList.remove('is-intro-snap-hold');
    document.body.dataset.homeTransitionState = transitionState;
    window.__homeTransitionState = transitionState;
    runHeroRevealTransition('reverse', token, unlockScroll);
  }


  function observeIntroSnap() {
    if (transitionState !== 'content' || lastWheelDirection !== 'up' || scrollCheckScheduled) return;
    scrollCheckScheduled = true;
    requestAnimationFrame(function() {
      scrollCheckScheduled = false;
      if (transitionState !== 'content' || lastWheelDirection !== 'up') return;
      if (getScrollY() <= getIntroSnapY() + SNAP_TOLERANCE_PX) enterIntroSnapHold();
    });
  }


  syncStatementCarryToScroll();
  requestAnimationFrame(syncStatementCarryToScroll);
  window.addEventListener('scroll', syncStatementCarryToScroll, { passive: true });
  window.addEventListener('scroll', observeIntroSnap, { passive: true });
  window.addEventListener('pageshow', syncStatementCarryToScroll, { passive: true });
  window.addEventListener('resize', function() {
    requestAnimationFrame(syncStatementCarryToScroll);
  }, { passive: true });


  function stripCloneIds(root) {
    if (!root) return;
    root.removeAttribute('id');
    root.querySelectorAll('[id]').forEach(function(el) {
      el.removeAttribute('id');
    });
  }


  function createHeroRevealStage() {
    var panelCount = window.matchMedia('(max-width: 768px)').matches
      ? HERO_REVEAL_MOBILE_PANEL_COUNT
      : HERO_REVEAL_PANEL_COUNT;
    var stage = document.createElement('div');
    stage.className = 's-hero-reveal';
    stage.style.setProperty('--panel-count', panelCount);

    var clip = document.createElement('div');
    clip.className = 's-hero-reveal__clip';

    var statementClone = statement.cloneNode(true);
    stripCloneIds(statementClone);
    statementClone.classList.add('s-hero-reveal__statement-clone');

    var cloneCarry = statementClone.querySelector('.s-statement__carry');
    var cloneLines = statementClone.querySelectorAll('[data-reveal]');
    if (cloneCarry) cloneCarry.remove();
    if (cloneLines.length) gsap.set(cloneLines, { opacity: 1, y: 0 });

    clip.appendChild(statementClone);
    stage.appendChild(clip);
    document.body.appendChild(stage);
    gsap.set(stage, { autoAlpha: 0 });

    return {
      stage: stage,
      clip: clip,
      panelCount: panelCount,
    };
  }


  function getHeroRevealStage() {
    var panelCount = window.matchMedia('(max-width: 768px)').matches
      ? HERO_REVEAL_MOBILE_PANEL_COUNT
      : HERO_REVEAL_PANEL_COUNT;
    if (reusableReveal && reusableReveal.panelCount === panelCount) return reusableReveal;
    if (reusableReveal && reusableReveal.stage) reusableReveal.stage.remove();
    reusableReveal = createHeroRevealStage();
    return reusableReveal;
  }


  function syncHeroRevealStageLayout(reveal) {
    if (!reveal || !reveal.stage) return;

    var sourceSlot = statement.querySelector('.s-statement__title-slot');
    var cloneSlot = reveal.stage.querySelector('.s-statement__title-slot');
    if (!sourceSlot || !cloneSlot) return;

    var sourceHeight = Math.ceil(sourceSlot.getBoundingClientRect().height || 0);
    if (sourceHeight > 0) {
      cloneSlot.style.minHeight = sourceHeight + 'px';
    }
  }


  if (document.readyState === 'complete') {
    requestAnimationFrame(getHeroRevealStage);
  } else {
    window.addEventListener('load', function() {
      requestAnimationFrame(getHeroRevealStage);
    }, { once: true });
  }


  function buildHeroRevealClip(values) {
    var count = values.length;
    var points = ['0% 100%', '0% ' + clampClipY(values[0]) + '%'];

    for (var i = 0; i < count; i++) {
      var x = ((i + 1) / count) * 100;
      points.push(x + '% ' + clampClipY(values[i]) + '%');
      if (i < count - 1) {
        points.push(x + '% ' + clampClipY(values[i + 1]) + '%');
      }
    }

    points.push('100% 100%');
    return 'polygon(' + points.join(', ') + ')';
  }


  function clampClipY(value) {
    return Math.max(0, Math.min(100, value));
  }


  function applyHeroRevealClip(clip, states) {
    var values = states.map(function(state) { return state.y; });
    clip.style.clipPath = buildHeroRevealClip(values);
    clip.style.webkitClipPath = clip.style.clipPath;
  }


  function revealStatementContent(target) {
    var carry = target.querySelector('.s-statement__carry');
    var lines = target.querySelectorAll('[data-reveal]');

    if (carry) carry.classList.add('is-visible');
    if (lines.length) {
      gsap.set(lines, { opacity: 1, y: 0 });
    }
  }


  function settleStatementRevealAnimations(target) {
    var lines = target.querySelectorAll('[data-reveal]');

    lines.forEach(function(line) {
      gsap.getTweensOf(line).forEach(function(tween) {
        if (!tween.scrollTrigger) return;
        tween.scrollTrigger.kill(false);
        tween.kill();
      });
    });

    if (lines.length) {
      gsap.set(lines, { opacity: 1, y: 0 });
    }
  }


  function isTransitionActive() {
    return transitionState === 'forward' || transitionState === 'reverse';
  }


  function cancelActivePlayback() {
    if (activeTimeline) {
      activeTimeline.kill();
      activeTimeline = null;
    }
  }


  function registerWheelActivity() {
    lastWheelAt = performance.now();
    if (wheelIdleTimer !== null) {
      window.clearTimeout(wheelIdleTimer);
    }
    wheelIdleTimer = window.setTimeout(function() {
      var idleFor = performance.now() - lastWheelAt;
      if (idleFor >= WHEEL_IDLE_MS) {
        wheelReleaseLocked = false;
        wheelIdleTimer = null;
      }
    }, WHEEL_IDLE_MS);
  }


  function beginWheelReleaseGuard() {
    wheelReleaseLocked = true;
    registerWheelActivity();
  }


  function clearWheelReleaseGuard() {
    wheelReleaseLocked = false;
    if (wheelIdleTimer !== null) {
      window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = null;
    }
  }


  function startForwardOnce() {
    if (transitionState !== 'hero-snap' || activeTimeline) return;
    transitionState = 'forward';
    document.body.dataset.homeTransitionState = transitionState;
    window.__homeTransitionState = transitionState;
    runHeroRevealTransition('forward', ++transitionToken);
  }


  function runHeroRevealTransition(direction, token, existingUnlockScroll) {
    direction = direction || 'forward';
    var isReverse = direction === 'reverse';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var targetTop = isReverse ? hero.offsetTop : getIntroSnapY();
    var lockTop = isReverse ? getIntroSnapY() : getScrollY();
    var unlockScroll = existingUnlockScroll;
    var forwardHandoffPrepared = false;

    cancelActivePlayback();
    clearWheelReleaseGuard();
    transitionInputLocked = true;
    if (lenis && typeof lenis.stop === 'function') lenis.stop();
    if (isReverse && !unlockScroll) setImmediateScrollY(getIntroSnapY());
    if (!unlockScroll) unlockScroll = lockScrollAt(lockTop);
    setStatementCarryHeroMode(isReverse);

    function prepareForwardHandoff() {
      if (isReverse || forwardHandoffPrepared || token !== transitionToken) return;
      forwardHandoffPrepared = true;
      settleStatementRevealAnimations(statement);
      revealStatementContent(statement);
      unlockScroll(targetTop);
    }

    function finishTransition(reveal) {
      if (token !== transitionToken) return;

      activeTimeline = null;

      if (isReverse) {
        setStatementCarryHeroMode(false);
        transitionState = 'hero-snap';
        document.body.dataset.homeTransitionState = transitionState;
        window.__homeTransitionState = transitionState;
        if (reveal && reveal.stage) gsap.set(reveal.stage, { autoAlpha: 0 });
        unlockScroll(targetTop);
        if (lenis && typeof lenis.start === 'function') lenis.start();
        transitionInputLocked = false;
        beginWheelReleaseGuard();
        syncStatementCarryToScroll();
        return;
      }

      // The real statement has already been positioned beneath the fully
      // covered reveal layer. Re-assert the final text state after
      // ScrollTrigger's position update, then hand the frame over directly.
      prepareForwardHandoff();
      revealStatementContent(statement);
      setStatementCarryNaturalMode();
      transitionState = 'intro-snap';
      document.body.dataset.homeTransitionState = transitionState;
      window.__homeTransitionState = transitionState;
      if (reveal && reveal.stage) gsap.set(reveal.stage, { autoAlpha: 0 });
      transitionInputLocked = false;
      if (lenis && typeof lenis.start === 'function') lenis.start();
    }

    if (reduceMotion) {
      finishTransition(null);
      return;
    }

    var reveal = getHeroRevealStage();
    syncHeroRevealStageLayout(reveal);
    var states = [];
    for (var i = 0; i < reveal.panelCount; i++) {
      states.push({ y: isReverse ? 0 : 105 });
    }
    applyHeroRevealClip(reveal.clip, states);

    var panelCompleteAt = 0.12 + Math.max.apply(null, states.map(function(state, index) {
      return (HERO_REVEAL_PANEL_DELAYS[index] || 0) + (HERO_REVEAL_PANEL_DURATIONS[index] || 0.9);
    }));

    gsap.set(reveal.stage, { autoAlpha: 1 });

    // During the reverse transition the full statement clone is the visible
    // foreground. Move the locked document underneath it to the hero first,
    // so every descending clip panel reveals the real first section instead
    // of revealing the statement again and jumping only at the end.
    if (isReverse) {
      document.body.style.top = (-targetTop) + 'px';
      lockedScrollY = targetTop;
    }

    activeTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: HERO_REVEAL_PANEL_EASE },
      onComplete: function() {
        finishTransition(reveal);
      },
    });

    states.forEach(function(state, index) {
      var delayIndex = isReverse ? (reveal.panelCount - 1 - index) : index;
      activeTimeline.to(state, {
        y: isReverse ? 105 : 0,
        duration: HERO_REVEAL_PANEL_DURATIONS[index] || 0.9,
        onUpdate: function() {
          if (token !== transitionToken || transitionState !== direction) return;
          applyHeroRevealClip(reveal.clip, states);
        },
      }, 0.12 + (HERO_REVEAL_PANEL_DELAYS[delayIndex] || 0));
    });

    activeTimeline.call(function() {
      if (token !== transitionToken || transitionState !== direction) return;
      setStatementCarryHeroMode(!isReverse);
    }, null, 0);

    if (!isReverse) {
      activeTimeline.call(function() {
        if (token !== transitionToken || transitionState !== 'forward') return;
        prepareForwardHandoff();
      }, null, panelCompleteAt);
    }

    activeTimeline.set({}, {}, panelCompleteAt + (isReverse ? 0.03 : 0.016));
    activeTimeline.play(0);
  }


  transitionWheelGateHandler = function(deltaY, e) {
    registerWheelActivity();
    if (deltaY > 0) lastWheelDirection = 'down';
    if (deltaY < 0) lastWheelDirection = 'up';

    if (transitionState === 'snap-hold' || isTransitionActive() || activeTimeline) {
      stopTransitionEvent(e);
      return true;
    }

    if (wheelReleaseLocked) {
      stopTransitionEvent(e);
      return true;
    }

    if (Math.abs(deltaY) < 6) return false;

    var y = getScrollY();
    var heroTop = hero.offsetTop;
    var heroBottom = heroTop + hero.offsetHeight;
    var inHeroRange = y >= heroTop - 2 && y < heroBottom - window.innerHeight * 0.18;


    if (transitionState === 'hero-snap' && deltaY > 6 && inHeroRange) {
      stopTransitionEvent(e);
      startForwardOnce();
      return true;
    }

    if ((transitionState === 'content' || transitionState === 'intro-snap') && deltaY < -6) {
      var statementTop = getIntroSnapY();
      if (y > statementTop + SNAP_TOLERANCE_PX) {
        return false;
      }

      stopTransitionEvent(e);
      enterIntroSnapHold();
      return true;
    }

    if (transitionState === 'intro-snap' && deltaY > 6) {
      transitionState = 'content';
      document.body.dataset.homeTransitionState = transitionState;
      window.__homeTransitionState = transitionState;
      return false;
    }

    return false;
  };


}


/* ─────────────────────────────────────────────


   BUILD: HERO GALLERY (kept for compatibility, skipped if no container)


───────────────────────────────────────────── */


function buildHeroGallery() {


  const gallery = document.getElementById('hero-gallery');


  if (!gallery) return; // hero gallery removed in new design


  gallery.innerHTML = '';


  


  const REPEAT = 4;


  const allSectors = [];


  for(let r=0; r<REPEAT; r++) {


    allSectors.push(...SECTORS);


  }


  


  allSectors.forEach(s => {


    const div = document.createElement('div');


    div.className = 's-hero__card';


    div.setAttribute('role', 'listitem');


    div.innerHTML = `


      <div class="s-hero__card-inner">


        <img src="${s.img}" alt="${s.zh}" class="s-hero__card-img" loading="lazy">


        <div class="s-hero__card-overlay"></div>


        <span class="s-hero__card-name">${s.zh}</span>


      </div>


    `;


    gallery.appendChild(div);


  });


}





/* ─────────────────────────────────────────────


   BUILD: STATEMENT BG STRIP


───────────────────────────────────────────── */


function buildStatementStrip() {


  const strip = document.getElementById('statement-strip');


  if (!strip) return; // strip removed in new design


  [...SECTORS, ...SECTORS].forEach(s => {


    const img = document.createElement('img');


    img.src = s.img;


    img.alt = '';


    img.setAttribute('aria-hidden', 'true');


    strip.appendChild(img);


  });


}





/* ─────────────────────────────────────────────


   BUILD: INDUSTRY CAROUSEL CARDS


───────────────────────────────────────────── */


function buildIndustryCards() {


  const track = document.getElementById('industries-track');


  const hud = document.getElementById('industries-hud');


  hud.innerHTML = '';


  SECTORS.forEach((s, idx) => {


    const card = document.createElement('div');


    card.className = 's-ind-card';


    card.setAttribute('role', 'listitem');


    card.setAttribute('aria-label', s.zh);


    card.innerHTML = `


      <div class="s-ind-card__text">


        <div class="s-ind-card__num">( ${String(s.id).padStart(2,'0')} )</div>


        <div class="s-ind-card__zh">${s.zh}</div>


        <div class="s-ind-card__en">${s.en}</div>


      </div>


      <div class="s-ind-card__img-wrap">


        <img src="${s.img}" alt="${s.zh}" class="s-ind-card__img" loading="lazy">


        <div class="s-ind-card__overlay"></div>


        <button class="s-ind-card__cta" type="button" aria-label="查看${s.zh}詳情">VIEW MORE</button>


      </div>


    `;


    card.addEventListener('click', () => goToIndustry(s.id));


    track.appendChild(card);





    const hudItem = document.createElement('span');


    hudItem.className = 's-industries__hud-item';


    hudItem.textContent = s.zh;


    hud.appendChild(hudItem);





    if (idx < SECTORS.length - 1) {


      const sep = document.createElement('span');


      sep.className = 's-industries__hud-sep';


      sep.textContent = '·';


      hud.appendChild(sep);


    }


  });


}





/* ─────────────────────────────────────────────


   BUILD: MENU SECTORS


───────────────────────────────────────────── */


function buildMenuSectors() {


  const grid = document.getElementById('menu-sectors');


  SECTORS.forEach(s => {


    const btn = document.createElement('button');


    btn.className = 'p-menu__sector-btn';


    btn.type = 'button';


    btn.setAttribute('role', 'listitem');


    btn.innerHTML = `


      <span class="p-menu__sector-no">( ${String(s.id).padStart(2,'0')} )</span>


      <span class="p-menu__sector-name">${s.zh}</span>


      <i class="p-menu__sector-line" aria-hidden="true"></i>


    `;


    btn.addEventListener('click',      () => goToIndustry(s.id));


    btn.addEventListener('mouseenter', () => {


      const prev = document.getElementById('menu-preview');


      if (prev) prev.src = s.img;


    });


    grid.appendChild(btn);


  });


}





/* ─────────────────────────────────────────────


   MENU TOGGLE


───────────────────────────────────────────── */


function initMenu() {


  const btn  = document.getElementById('menu-btn');


  const menu = document.getElementById('p-menu');


  let open = false;





  function toggleMenu(force) {


    open = force !== undefined ? force : !open;


    btn.classList.toggle('is-open', open);


    btn.setAttribute('aria-expanded', String(open));


    menu.classList.toggle('is-open', open);


    menu.setAttribute('aria-hidden', String(!open));


    document.body.classList.toggle('is-menu-open', open);


    document.documentElement.classList.toggle('is-menu-open', open);


    if (open) {


      if (typeof lenis !== 'undefined' && lenis) lenis.stop();


    } else {


      if (typeof lenis !== 'undefined' && lenis) lenis.start();


    }


  }



  function preventScroll(e) {


    if (open) {


      e.preventDefault();


      e.stopPropagation();


      return false;


    }


  }



  window.addEventListener('wheel', preventScroll, { passive: false });


  window.addEventListener('touchmove', preventScroll, { passive: false });


  window.addEventListener('keydown', function(e) {


    if (open && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(e.code)) {


      e.preventDefault();


      e.stopPropagation();


    }


  }, { passive: false });





  btn.addEventListener('click', () => toggleMenu());





  // Scroll-to buttons inside menu


  document.querySelectorAll('[data-goto]').forEach(el => {


    el.addEventListener('click', () => {


      const target = document.getElementById(el.dataset.goto);


      toggleMenu(false);


      if (target) setTimeout(() => lenis.scrollTo(target, { duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) }), 500);


    });


  });


}





/* ─────────────────────────────────────────────


   STATEMENT TEXT REVEAL


───────────────────────────────────────────── */


function initStatementReveal() {


  document.querySelectorAll('[data-reveal]').forEach(el => {


    gsap.to(el, {


      opacity: 1, y: 0, duration: 1.1,


      ease: 'power3.out',


      scrollTrigger: {


        trigger: el,


        start: 'top 82%',


        end:   'top 50%',


        toggleActions: 'play none none reverse',


      }


    });


  });


}





/* ─────────────────────────────────────────────


   INDUSTRY HORIZONTAL SCROLL (GSAP ScrollTrigger pin)


───────────────────────────────────────────── */


function initIndustryScroll() {


  const track  = document.getElementById('industries-track');


  const pin    = document.getElementById('industries-pin');


  const hud    = document.getElementById('industries-hud');


  const hudItems = hud.querySelectorAll('.s-industries__hud-item');





  const getScrollDist = () => track.scrollWidth - window.innerWidth;





  gsap.to(track, {


    x: () => -getScrollDist(),


    ease: 'none',


    scrollTrigger: {


      trigger: '#industries',


      start: 'top top',


      end: () => '+=' + getScrollDist(),


      pin: pin,


      anticipatePin: 1,


      scrub: 0.7,


      invalidateOnRefresh: true,


      onUpdate(self) {


        const p = self.progress;


        const numItems = hudItems.length;


        const currentIndex = Math.min(Math.floor(p * numItems), numItems - 1);


        hudItems.forEach((item, idx) => {


          if (idx === currentIndex) item.classList.add('is-active');


          else item.classList.remove('is-active');


        });


      },


      onEnter:     () => hud.classList.add('is-show'),


      onLeave:     () => hud.classList.remove('is-show'),


      onEnterBack: () => hud.classList.add('is-show'),


      onLeaveBack: () => hud.classList.remove('is-show'),


    }


  });


}





/* ─────────────────────────────────────────────


   HERO SCROLL: Remove white-hero class when scrolling past hero


───────────────────────────────────────────── */


function initHeroExpand() {


  // Keep the light header mode through the statement and industries sections.


  if (typeof ScrollTrigger === 'undefined') return;





  ScrollTrigger.create({


    trigger: '#statement',


    start: 'top 80%',


    onEnter: () => {
      document.body.classList.add('on-white-hero');
      document.body.style.background = '#eef0ec';
    },
    onLeaveBack: () => {
      document.body.classList.add('on-white-hero');
      document.body.style.background = '#eef0ec';
    },


  });


}





/* ─────────────────────────────────────────────


   NAVIGATE TO INDUSTRY PAGE


───────────────────────────────────────────── */


function goToIndustry(id) {


  // Transition out


  gsap.to('#wrapper', { opacity: 0, duration: 0.4, ease: 'power2.in',


    onComplete: () => { window.location.href = `pages/industry.html?sector=${id}&view=20260729-header2`; }


  });


}





/* ─────────────────────────────────────────────


   INIT


───────────────────────────────────────────── */


document.addEventListener('DOMContentLoaded', () => {

  // Avoid a permanently locked page if an external animation dependency fails.
  window.setTimeout(() => {
    document.documentElement.classList.add('is-hero-first-frame-ready');
    document.documentElement.classList.remove('is-home-booting');
    transitionInputLocked = false;
    if (lenis && typeof lenis.start === 'function') lenis.start();
  }, 8000);


  // Start in white-hero mode (hero-new section is white)


  document.body.classList.add('on-white-hero');


  document.body.style.background = '#eef0ec';





  // Build dynamic content first


  buildHeroGallery();


  buildStatementStrip();


  buildIndustryCards();


  buildMenuSectors();





  // Smooth scroll


  initLenis();
  if (lenis && typeof lenis.stop === 'function') lenis.stop();





  // UI


  initCursor();


  initMenu();





  // Animations


  initLoading();            // starts counter → plays entry anim → calls initHeroExpand


  initStatementReveal();    // scroll-triggered text reveal





  // Industry horizontal scroll needs DOM measurements → slight delay


  requestAnimationFrame(() => {


    requestAnimationFrame(() => {


      initIndustryScroll();


      ScrollTrigger.refresh();


    });


  });


});

/* Three-cycle research navigation. These declarations intentionally replace the
   legacy sector builders while keeping the existing homepage transitions. */
function buildIndustryCards() {
  const track = document.getElementById('industries-track');
  const hud = document.getElementById('industries-hud');
  if (!track || !hud || !window.StockData) return;
  track.innerHTML = ''; hud.innerHTML = '';
  window.StockData.CYCLES.forEach((cycle) => {
    const link = document.createElement('a');
    link.className = 's-cycle-card';
    link.href = `pages/industry.html?cycle=${cycle.id}&market=us&industry=${encodeURIComponent(cycle.industries[0])}&view=20260729-header2`;
    link.setAttribute('aria-label', `進入${cycle.title}：${cycle.subtitle}`);
    link.innerHTML = `<div class="s-cycle-card__shade"></div><div class="s-cycle-card__content"><p>CYCLE ${cycle.number} / 03</p><h2>${cycle.title}</h2><h3>${cycle.subtitle}</h3><p class="s-cycle-card__desc">${cycle.description}</p><div class="s-cycle-card__count">${cycle.industries.length} INDUSTRIES</div><ul>${cycle.industries.map(name => `<li>${name}</li>`).join('')}</ul><span>進入循環 →</span></div>`;
    track.appendChild(link);
  });
}
function buildMenuSectors() {
  const grid=document.getElementById('menu-sectors'); if(!grid||!window.StockData)return; grid.innerHTML='';
  window.StockData.CYCLES.forEach(cycle=>{const a=document.createElement('a');a.className='p-menu__sector-btn';a.href=`pages/industry.html?cycle=${cycle.id}&view=20260729-header2`;a.innerHTML=`<span class="p-menu__sector-no">( ${cycle.number} )</span><span class="p-menu__sector-name">${cycle.title}｜${cycle.subtitle}</span><i class="p-menu__sector-line" aria-hidden="true"></i>`;grid.appendChild(a);});
}
function initIndustryScroll() {
  const hud=document.getElementById('industries-hud'); if(hud) hud.classList.remove('is-show');
}


