gsap.registerPlugin(ScrollTrigger);

const letters = gsap.utils.toArray('.logo-letter');
const logo = document.querySelector('.logo-wrap');
const mode = document.querySelector('#interaction-mode');
const size = document.querySelector('#logo-size');
const sizeValue = document.querySelector('#size-value');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let flip;
let hoveredLetter = -1;
let lastPointer;
let spinning = false;
const rotors = letters.map((letter) => ({
  angle: 0,
  velocity: 0,
  active: false,
  x: Number(letter.style.getPropertyValue('--x')),
  width: Number(letter.style.getPropertyValue('--w')),
  render: gsap.quickSetter(letter, 'rotationX', 'deg')
}));

function updateRotors(_time, deltaTime) {
  // Integração em passos pequenos: atrito e uma ligeira força de alinhamento.
  const elapsed = Math.min(deltaTime / 1000, 0.05);
  const steps = Math.max(1, Math.ceil(elapsed * 120));
  const dt = elapsed / steps;
  for (const rotor of rotors) {
    if (!rotor.active) continue;
    for (let step = 0; step < steps; step++) {
      const acceleration = -1.65 * rotor.velocity - 22 * Math.sin(2 * rotor.angle);
      rotor.velocity += acceleration * dt;
      rotor.angle += rotor.velocity * dt;
    }
    const rest = Math.round(rotor.angle / Math.PI) * Math.PI;
    if (Math.abs(rotor.velocity) < 0.025 && Math.abs(rotor.angle - rest) < 0.003) {
      rotor.angle = rest % (2 * Math.PI);
      rotor.velocity = 0;
      rotor.active = false;
    }
    rotor.render(rotor.angle * 180 / Math.PI);
  }
  if (!rotors.some((rotor) => rotor.active)) {
    gsap.ticker.remove(updateRotors);
    spinning = false;
  }
}

function stopRotors() {
  gsap.ticker.remove(updateRotors);
  spinning = false;
  hoveredLetter = -1;
  lastPointer = undefined;
  rotors.forEach((rotor) => {
    rotor.angle = 0;
    rotor.velocity = 0;
    rotor.active = false;
  });
}

function hoverLetter(event) {
  if (mode.value !== 'letters' || reduceMotion || event.pointerType === 'touch') return;
  // Usa a área original da letra, que não encolhe nem oscila durante a rotação.
  const bounds = logo.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width * 1456;
  const inside = event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  let index = -1;
  let distance = Infinity;
  if (inside) rotors.forEach((rotor, candidate) => {
    const centerDistance = Math.abs(x - rotor.x - rotor.width / 2);
    if (x >= rotor.x && x <= rotor.x + rotor.width && centerDistance < distance) {
      index = candidate;
      distance = centerDistance;
    }
  });
  const now = event.timeStamp;
  const speed = lastPointer
    ? Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y) /
      Math.max(16, now - lastPointer.time)
    : 0;
  lastPointer = { x: event.clientX, y: event.clientY, time: now };
  if (index === hoveredLetter) return;
  hoveredLetter = index;
  if (index < 0) return;

  const rotor = rotors[index];
  // Uma passagem rápida dá mais impulso; novas passagens acumulam inércia.
  rotor.velocity = Math.max(-34, rotor.velocity - 17 - Math.min(speed, 3) * 4);
  rotor.active = true;
  if (!spinning) {
    spinning = true;
    gsap.ticker.add(updateRotors);
  }
}

window.addEventListener('pointermove', hoverLetter, { passive: true });
document.documentElement.addEventListener('pointerleave', () => {
  hoveredLetter = -1;
  lastPointer = undefined;
});

function setMode() {
  stopRotors();
  document.body.dataset.interaction = mode.value;
  if (flip) {
    if (flip.scrollTrigger) flip.scrollTrigger.kill();
    flip.kill();
    flip = undefined;
  }
  gsap.set(letters, { clearProps: 'transform' });
  window.scrollTo(0, 0);
  if (reduceMotion || mode.value === 'letters') {
    ScrollTrigger.refresh();
    return;
  }

  flip = gsap.timeline(mode.value === 'scroll' ? {
    scrollTrigger: {
      trigger: '#animation',
      start: 'top top',
      end: '+=130%',
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1
    }
  } : { paused: true });

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

  ScrollTrigger.refresh();
}

// O mesmo movimento sequencial avança ao entrar e recua ao sair.
logo.addEventListener('pointerenter', () => {
  if (mode.value === 'mouse' && flip) flip.play();
});
logo.addEventListener('pointerleave', () => {
  if (mode.value === 'mouse' && flip) flip.reverse();
});
mode.addEventListener('change', setMode);
size.addEventListener('input', () => {
  logo.style.setProperty('--logo-size', Number(size.value) / 100);
  sizeValue.value = `${size.value}%`;
});
setMode();
