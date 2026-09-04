gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const logoWrap = document.querySelector('.logo-wrap');
const topNav = document.querySelector('.top-nav');
const candidate = document.querySelector('.candidate');

// Mantém a identidade e a navegação independentes do painel fixado do hero.
document.body.append(logoWrap, topNav, candidate);
document.querySelectorAll('.logo-front').forEach((face) => face.remove());

const beliefCopy = document.querySelector('.belief-copy');
if (beliefCopy) {
  const phrase = beliefCopy.textContent.trim();
  beliefCopy.setAttribute('aria-label', phrase);
  beliefCopy.textContent = '';

  phrase.split(' ').forEach((word, wordIndex, words) => {
    const wordElement = document.createElement('span');
    wordElement.className = 'belief-word';
    wordElement.setAttribute('aria-hidden', 'true');

    [...word].forEach((character) => {
      const letter = document.createElement('span');
      letter.className = 'belief-letter';
      letter.textContent = character;
      wordElement.appendChild(letter);
    });

    beliefCopy.appendChild(wordElement);
    if (wordIndex < words.length - 1) beliefCopy.appendChild(document.createTextNode(' '));
  });
}

if (!reduceMotion) {
  const letters = gsap.utils.toArray('.logo-letter');

  const flip = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=130%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  });

  /*
    Agora cada letra é o seu próprio plano 3D.
    A letra seguinte só começa quando a anterior já entrou claramente na viragem.
    O movimento continua ligado ao scroll, portanto não há saltos nem autoplay.
  */
  letters.forEach((letter, index) => {
    const start = index * 0.115;

    flip.to(letter, {
      rotateX: -180,
      ease: 'power1.inOut',
      duration: 0.34
    }, start);

    // Profundidade subtil no meio da viragem de cada letra.
    flip.to(letter, {
      z: -24,
      scale: 0.992,
      ease: 'sine.inOut',
      duration: 0.14
    }, start + 0.07);

    flip.to(letter, {
      z: 0,
      scale: 1,
      ease: 'sine.inOut',
      duration: 0.14
    }, start + 0.20);
  });

  flip.to('.scroll-cue', {
    opacity: 0,
    duration: 0.12,
    ease: 'none'
  }, 0);

  // Termina totalmente antes de começar a redução da marca.
  flip.to('.hero-tagline', {
    opacity: 0,
    duration: 0.22,
    ease: 'power2.out'
  }, 0.72);

  // Depois da viragem, o hero é libertado e sobe enquanto a marca se compacta.
  const compactTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'bottom bottom',
      end: '+=55%',
      scrub: true
    }
  }).to('.logo-wrap', {
    scale: 0.11,
    top: '1.3vw',
    left: '1.4vw',
    ease: 'power2.inOut'
  }, 0).to('.top-nav', {
    top: '1.7vw',
    right: 'calc(1.8vw + 108px + clamp(1rem, 1.4vw, 2.2rem))',
    ease: 'power2.inOut'
  }, 0).to('.candidate', {
    top: '1.7vw',
    right: '1.8vw',
    ease: 'power2.inOut'
  }, 0);

  let previousScroll = window.scrollY;
  let scrollDistance = 0;
  let logoIsFlipping = false;
  const finalLetter = letters[letters.length - 1];

  const flipCompactLogo = (direction) => {
    if (logoIsFlipping) return;
    logoIsFlipping = true;

    gsap.timeline({
      onComplete: () => { logoIsFlipping = false; }
    }).to(finalLetter, {
      rotateX: direction > 0 ? '+=26' : '-=26',
      duration: 0.46,
      ease: 'sine.inOut',
      repeat: 1,
      yoyo: true,
      overwrite: 'auto'
    });
  };

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const delta = currentScroll - previousScroll;
    previousScroll = currentScroll;

    // Só reage depois de terminar a passagem do logótipo grande para o pequeno.
    const reactiveStart = compactTimeline.scrollTrigger.end;
    if (currentScroll <= reactiveStart || Math.abs(delta) > window.innerHeight) {
      scrollDistance = 0;
      return;
    }

    if (scrollDistance && Math.sign(scrollDistance) !== Math.sign(delta)) scrollDistance = 0;
    scrollDistance += delta;

    if (Math.abs(scrollDistance) >= 180) {
      flipCompactLogo(Math.sign(scrollDistance));
      scrollDistance = 0;
    }
  }, { passive: true });

  ScrollTrigger.create({
    trigger: '.next-section',
    start: 'top 72px',
    end: 'bottom top',
    onEnter: () => document.body.classList.add('header-on-light'),
    onEnterBack: () => document.body.classList.add('header-on-light'),
    onLeaveBack: () => document.body.classList.remove('header-on-light')
  });

  ScrollTrigger.create({
    trigger: '.projects-stack',
    start: 'top 72px',
    onEnter: () => document.body.classList.remove('header-on-light'),
    onEnterBack: () => document.body.classList.remove('header-on-light'),
    onLeaveBack: () => document.body.classList.add('header-on-light')
  });

  ScrollTrigger.create({
    trigger: '.belief-section',
    start: 'top 72px',
    onEnter: () => document.body.classList.add('header-on-light'),
    onEnterBack: () => document.body.classList.add('header-on-light'),
    onLeaveBack: () => document.body.classList.remove('header-on-light')
  });

  ScrollTrigger.create({
    trigger: '.capabilities-section',
    start: 'top 72px',
    onEnter: () => document.body.classList.add('header-on-light'),
    onEnterBack: () => document.body.classList.add('header-on-light')
  });

  ScrollTrigger.create({
    trigger: '.site-footer',
    start: 'top 72px',
    onEnter: () => document.body.classList.remove('header-on-light'),
    onEnterBack: () => document.body.classList.remove('header-on-light'),
    onLeaveBack: () => document.body.classList.add('header-on-light')
  });
}

if (!reduceMotion) {
  const copyLines = gsap.utils.toArray('.feature-copy > span');
  const cards = gsap.utils.toArray('.visual-card');
  const statValues = gsap.utils.toArray('.value[data-count]');

  gsap.fromTo(copyLines, {
    opacity: 0,
    rotateX: -88
  }, {
    opacity: 1,
    rotateX: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.next-section',
      start: 'top 72%',
      once: true
    }
  });

  const addFlipReveal = (targets, trigger, stagger = 0.08) => {
    gsap.fromTo(targets, {
      opacity: 0,
      rotateX: -78,
      transformPerspective: 1000
    }, {
      opacity: 1,
      rotateX: 0,
      duration: 0.9,
      stagger,
      ease: 'power4.out',
      scrollTrigger: {
        trigger,
        start: 'top 82%',
        once: true
      }
    });
  };

  addFlipReveal('.stat-item', '.stats-row', 0.09);
  addFlipReveal(['.services-eyebrow', '.services-intro h2'], '.services-intro', 0.12);

  gsap.fromTo('.service-card', {
    opacity: 0,
    y: 48
  }, {
    opacity: 1,
    y: 0,
    duration: 1.25,
    stagger: 0.14,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 84%',
      once: true
    }
  });

  document.querySelectorAll('.project-panel').forEach((panel) => {
    addFlipReveal(
      panel.querySelectorAll('.project-topline, .project-category, .project-link, .project-description'),
      panel,
      0.09
    );
  });

  document.querySelectorAll('.belief-letter').forEach((letter) => {
    letter.addEventListener('pointerenter', () => {
      if (letter.dataset.turning === 'true') return;
      letter.dataset.turning = 'true';

      gsap.timeline({
        onComplete: () => { letter.dataset.turning = 'false'; }
      }).to(letter, {
        rotateX: -160,
        duration: 0.68,
        ease: 'sine.inOut',
        repeat: 1,
        yoyo: true
      });
    });
  });

  gsap.fromTo(['.capabilities-eyebrow', '.capabilities-list'], {
    opacity: 0,
    y: 42
  }, {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: .12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.capabilities-section',
      start: 'top 72%',
      once: true
    }
  });

  gsap.fromTo(['.agenda-eyebrow', '.agenda-event'], {
    opacity: 0,
    y: 34
  }, {
    opacity: 1,
    y: 0,
    duration: .9,
    stagger: .1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.agenda-section',
      start: 'top 72%',
      once: true
    }
  });

  const imageLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.15, paused: true });

  cards.forEach((card, index) => {
    const at = index * 1.15;
    imageLoop.fromTo(card, {
      opacity: 0,
      rotateY: -96,
      rotateX: index % 2 ? 8 : -8,
      scale: 0.92
    }, {
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, at).to(card, {
      opacity: 0,
      rotateY: 96,
      scale: 0.94,
      duration: 0.7,
      ease: 'power3.in'
    }, at + 2.15);
  });

  ScrollTrigger.create({
    trigger: '.next-section',
    start: 'top 90%',
    end: 'bottom 10%',
    onEnter: () => imageLoop.play(),
    onEnterBack: () => imageLoop.play(),
    onLeave: () => imageLoop.pause(),
    onLeaveBack: () => imageLoop.pause()
  });

  statValues.forEach((element) => {
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || '';
    const counter = { value: 0 };

    element.textContent = `0${suffix}`;
    gsap.to(counter, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        element.textContent = `${Math.round(counter.value)}${suffix}`;
      },
      scrollTrigger: {
        trigger: '.stats-row',
        start: 'top 82%',
        once: true
      }
    });
  });

  const slider = document.querySelector('.service-slider');
  const slides = slider ? [...slider.querySelectorAll('.service-slide')] : [];
  const dots = slider ? [...slider.querySelectorAll('.slider-dots span')] : [];
  let currentSlide = 0;
  let sliderTimer;

  const showSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      if (slide.classList.contains('is-active') && slideIndex !== index) {
        slide.classList.add('is-leaving');
        window.setTimeout(() => slide.classList.remove('is-leaving'), 950);
      }
      slide.classList.toggle('is-active', slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
    currentSlide = index;
  };

  const startSlider = () => {
    if (sliderTimer || slides.length < 2) return;
    sliderTimer = window.setInterval(() => showSlide((currentSlide + 1) % slides.length), 3200);
  };

  const stopSlider = () => {
    window.clearInterval(sliderTimer);
    sliderTimer = undefined;
  };

  if (slider) {
    ScrollTrigger.create({
      trigger: slider,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: startSlider,
      onEnterBack: startSlider,
      onLeave: stopSlider,
      onLeaveBack: stopSlider
    });
  }
}
