// Recebe os gestos do iframe, incluindo quando a homepage é aberta por file://.
(() => {
  const frame = document.querySelector('.ecosystem-frame');
  const section = frame?.closest('.ecosystem-section');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (!section) return;
    const travel = Math.max(0, Math.min(1, (window.innerHeight * .6 - section.getBoundingClientRect().top) / Math.max(1, section.offsetHeight * .65)));
    // Abre, mantém a rede expandida e regressa ao círculo ao continuar o scroll.
    const progress = Math.max(0, Math.min(1, travel / .4, (1 - travel) / .25));
    frame.contentWindow.postMessage({ type: 'andavira:ecosystem-progress', progress }, '*');
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('message', (event) => {
    if (!frame || event.source !== frame.contentWindow) return;
    const data = event.data;
    if (data?.type === 'andavira:ecosystem-ready') {
      schedule();
      return;
    }
    if (data?.type !== 'andavira:ecosystem-scroll') return;
    if (!Number.isFinite(data.x) || !Number.isFinite(data.y)) return;
    window.scrollBy({ left: data.x, top: data.y, behavior: 'instant' });
  });
  schedule();
})();
