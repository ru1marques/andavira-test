gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const logoWrap = document.querySelector('.logo-wrap');
const topNav = document.querySelector('.top-nav');
const candidate = document.querySelector('.candidate');
const platformAccess = document.querySelector('.platform-access');

const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const name = fields.get('nome').trim();
  const email = fields.get('email').trim();
  const message = fields.get('mensagem').trim();
  const subject = encodeURIComponent(`Contacto ANDAVIRA — ${name}`);
  const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:info@andavira.pt?subject=${subject}&body=${body}`;
});

// O Chrome não reproduz animações CSS dentro de favicons SVG. A troca de frames
// mantém a mesma rotação vertical e deixa o ficheiro SVG como fallback estático.
const favicon = document.querySelector('#favicon');
if (favicon && !reduceMotion) {
  let faviconFrame = 0;
  const totalFaviconFrames = 32;

  window.setInterval(() => {
    const angle = (faviconFrame / totalFaviconFrames) * Math.PI * 2;
    const scaleY = Math.cos(angle);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="7" fill="#675F56"/><g transform="translate(32 32) scale(1 ${scaleY.toFixed(3)}) translate(-32 -32)"><path d="M10 53.5 27.6 10h8.8L54 53.5h-9.6L32 21.2 19.6 53.5H10Z" fill="#f2efef"/></g></svg>`;
    favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    faviconFrame = (faviconFrame + 1) % totalFaviconFrames;
  }, 90);
}

// Mantém a identidade e a navegação independentes do painel fixado do hero.
document.body.append(logoWrap, topNav, candidate, platformAccess);
document.querySelectorAll('.logo-front').forEach((face) => face.remove());

const beliefCopy = document.querySelector('.belief-copy');
if (beliefCopy) {
  const phrase = beliefCopy.textContent.trim();
  beliefCopy.setAttribute('aria-label', phrase);
  beliefCopy.textContent = '';
  const lineBreaks = (beliefCopy.dataset.lineBreaks || '').split(',').map(Number);

  phrase.split(' ').forEach((word, wordIndex, words) => {
    if (wordIndex > 0 && lineBreaks.includes(wordIndex)) beliefCopy.appendChild(document.createElement('br'));
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
      start: 0,
      end: () => window.innerHeight * 1.3,
      invalidateOnRefresh: true,
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
      start: () => flip.scrollTrigger.end,
      end: () => flip.scrollTrigger.end + window.innerHeight * .55,
      invalidateOnRefresh: true,
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
  }, 0).to('.platform-access', {
    top: window.innerWidth <= 800 ? '4rem' : '1.7vw',
    left: window.innerWidth <= 800 ? '4vw' : '15vw',
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
  document.querySelectorAll('.community-intro p').forEach((paragraph) => {
    addFlipReveal(paragraph, paragraph);
  });
  addFlipReveal('.ecosystem-cta', '.ecosystem-cta');
  addFlipReveal('.contact-eyebrow, .contact-intro h2', '.contact-intro', 0.12);
  addFlipReveal('.contact-field, .contact-actions', '.contact-form', 0.1);
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

  document.querySelectorAll('.capabilities-eyebrow, .capabilities-intro, .capabilities-list').forEach((element) => {
    addFlipReveal(element, element);
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


// A cor depende da secção atual, incluindo após restaurar o scroll num refresh.
const headerSections = [...document.querySelectorAll('main > section, main > footer')];
const syncHeaderTheme = () => {
  let current = document.querySelector('#hero');
  headerSections.forEach((section) => {
    const bounds = section.getBoundingClientRect();
    if (!section.hidden && bounds.height > 0 && bounds.top <= 72) current = section;
  });
  const dark = current?.matches('.hero, .projects-stack, .site-footer');
  document.body.classList.toggle('header-on-light', !dark);
};
let headerSyncPending = false;
window.addEventListener('scroll', () => {
  if (headerSyncPending) return;
  headerSyncPending = true;
  requestAnimationFrame(() => {
    headerSyncPending = false;
    syncHeaderTheme();
  });
}, { passive: true });
ScrollTrigger.addEventListener('refresh', syncHeaderTheme);
const restoreScrollAnimations = () => {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.update();
    syncHeaderTheme();
  }));
};
window.addEventListener('load', restoreScrollAnimations);
window.addEventListener('pageshow', restoreScrollAnimations);
document.fonts.ready.then(restoreScrollAnimations);
syncHeaderTheme();
