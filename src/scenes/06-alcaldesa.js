// 06-alcaldesa.js
// BLOQUE 3 · Intervención alcaldesa · Pulsaciones 62-63 (GUION_TECNICO.md).
//
//   step(1) · Puls. 62 · Presentación de la alcaldesa
//     Fondo: mismo vídeo de la portada (videoloop_1.webm) en loop + tinte Monastrell
//     al 55 % por encima (continuidad institucional con la pantalla de recepción).
//     Centrado: nombre "Seve González" en Match 160 bold blanco (entrada palabra a
//     palabra), línea decorativa blanca de 300×3 px (dibujada de izq. a der. con
//     scaleX), y cargo "ALCALDESA DE JUMILLA" en Bebas Neue 42 blanco letterspaced.
//   step(2) · Puls. 63 · Durante el discurso
//     Pantalla discreta para acompañar el discurso. Esquina inf. dcha.: logo del
//     Ayuntamiento (en blanco, ya viene así en el SVG) al 50 %. Esquina inf. izq.:
//     "CAPITAL DE LA MONASTRELL · 700 AÑOS · 2027" pequeño.

import { gsap } from 'gsap';
import { injectSVG } from '../utils/svg-helpers.js';

const AYTO_LOGO = '/logo/logo_ayto.svg';
const VIDEO_SRC = '/video/videoloop_1.webm';

export default {
  id: 'alcaldesa',
  pulsaciones: 2,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'alc-root';
    stage.appendChild(root);
    this.state.root = root;

    // ---- Vídeo de fondo (mismo que la portada · continuidad institucional) ----
    // Patrón idéntico al de la recepción: si el .mp4 no carga, fallback automático
    // al Monastrell sólido del .alc-root.
    const video = document.createElement('video');
    video.className = 'alc-video';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    gsap.set(video, { autoAlpha: 0 });
    root.appendChild(video);
    this.state.video = video;

    let videoSettled = false;
    const dropVideo = () => {
      if (videoSettled) return;
      videoSettled = true;
      video.removeAttribute('src');
      video.remove();
      this.state.video = null;
    };
    const acceptVideo = () => {
      if (videoSettled) return;
      videoSettled = true;
      video.play().catch(() => { });
      gsap.to(video, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' });
    };
    video.addEventListener('error', dropVideo);
    video.addEventListener('loadeddata', acceptVideo);
    this.state.videoTimeout = setTimeout(dropVideo, 5000);
    video.src = VIDEO_SRC;

    // Tinte Monastrell al 55 % por encima del vídeo.
    const overlay = document.createElement('div');
    overlay.className = 'alc-overlay';
    root.appendChild(overlay);

    // ---- Puls. 57 · Presentación (nombre + línea + cargo) ----
    const pres = document.createElement('div');
    pres.className = 'alc-page';
    root.appendChild(pres);
    this.state.pres = pres;

    const name = document.createElement('p');
    name.className = 'alc-name';
    'Seve González'.split(' ').forEach((w, i) => {
      if (i > 0) name.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      name.appendChild(span);
    });
    pres.appendChild(name);
    const words = Array.from(name.querySelectorAll('.word'));

    const line = document.createElement('div');
    line.className = 'alc-line';
    pres.appendChild(line);

    const cargo = document.createElement('p');
    cargo.className = 'alc-cargo';
    cargo.textContent = 'ALCALDESA DE JUMILLA';
    pres.appendChild(cargo);

    this.state.presRefs = { words, line, cargo };
    gsap.set(words, { autoAlpha: 0, y: 20 });
    gsap.set(line, { scaleX: 0 });
    gsap.set(cargo, { autoAlpha: 0 });

    // ---- Puls. 58 · Durante el discurso (oculto hasta su turno) ----
    const disc = document.createElement('div');
    disc.className = 'alc-page';
    root.appendChild(disc);
    gsap.set(disc, { autoAlpha: 0 });
    this.state.disc = disc;

    const aytoBox = document.createElement('div');
    aytoBox.className = 'alc-ayto';
    injectSVG(aytoBox, preloader.getSVG(AYTO_LOGO), { prefix: 'alc-ayto' });
    disc.appendChild(aytoBox);
    this.state.ayto = aytoBox;

    const tag = document.createElement('p');
    tag.className = 'alc-tag';
    tag.textContent = 'JUMILLA, CAPITAL DE LA MONASTRELL · 2027';
    disc.appendChild(tag);
    this.state.tag = tag;
    gsap.set([aytoBox, tag], { autoAlpha: 0 });
  },

  step(n) {
    switch (n) {
      case 1: return this.stepPresentacion();
      case 2: return this.stepDiscurso();
      default: return Promise.resolve();
    }
  },

  // Puls. 57 · Nombre palabra a palabra → línea (scaleX) → cargo fade-in.
  stepPresentacion() {
    const tl = gsap.timeline();
    const r = this.state.presRefs;
    tl.to(r.words, {
      autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15
    }, 0);
    tl.to(r.line, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '>0.1');
    tl.to(r.cargo, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, '>');
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 63 · Cross-fade a pantalla discreta: ayto logo y tag, ambos al 100 %.
  stepDiscurso() {
    const tl = gsap.timeline();
    tl.to(this.state.pres, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
    tl.set(this.state.disc, { autoAlpha: 1 }, 0.5);
    tl.to(this.state.ayto, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.5);
    tl.to(this.state.tag, { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.7);
    this.state.timelines.push(tl);
    return tl.then();
  },

  teardown() {
    if (!this.state) return;
    if (this.state.videoTimeout) clearTimeout(this.state.videoTimeout);
    this.state.timelines.forEach((t) => t.kill());
    this.state.stage.style.background = '';
    this.state = null;
  }
};
