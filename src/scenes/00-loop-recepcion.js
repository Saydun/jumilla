// 00-loop-recepcion.js
// BLOQUE 0 · Recepción · Loop automático.
//
// Pantalla en bucle mientras llega la gente (30-60 min) ANTES de que arranque el evento.
// Arranca SOLA al cargar y queda en bucle sereno hasta la primera pulsación.
//
// Diseño discreto (versión rediseñada con vídeo de fondo):
//   - Fondo: vídeo /assets/video/videoloop_1.webm en loop, muteado, object-fit cover.
//     Encima, una capa Monastrell al 55 % que tiñe la imagen pero la deja respirar.
//   - Centro superior: logo del Ayuntamiento (blanco, ~90 px de alto).
//   - Centro: bloque tipográfico discreto · 3 líneas (kicker / título / locator) con
//     2 plecas hairline blancas a 160 px.
//   - Sin marco, sin fecha, sin claim institucional. Solo lo esencial.
//
// Cumple regla 9 (no logo turístico antes de la revelación): solo se ve el logo del
// Ayuntamiento como cliente del evento.

import { gsap } from 'gsap';
import { injectSVG } from '../utils/svg-helpers.js';

const AYTO_LOGO = '/logo/logo_ayto.svg';
const VIDEO_SRC = '/video/videoloop_1.webm';

export default {
  id: 'loop-recepcion',
  pulsaciones: 1,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, loops: [] };
    stage.style.background = 'var(--monastrell)';

    const root = document.createElement('div');
    root.className = 'recep-root';
    stage.appendChild(root);
    this.state.root = root;

    // ---- Vídeo de fondo ----
    // .webm VP9 (~26 MB). Si el archivo no carga (códec o ausencia), se elimina y
    // queda el Monastrell sólido como fondo.
    const video = document.createElement('video');
    video.className = 'recep-video';
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
    // Timeout cómodo (3 s) para el .webm de ~26 MB.
    this.state.videoTimeout = setTimeout(dropVideo, 3000);
    video.src = VIDEO_SRC;

    // Tinte Monastrell al 55 % por encima del vídeo.
    const overlay = document.createElement('div');
    overlay.className = 'recep-overlay';
    root.appendChild(overlay);

    // ---- Contenido (lo que "respira") ----
    const content = document.createElement('div');
    content.className = 'recep-content';
    root.appendChild(content);
    this.state.content = content;

    // Logo del Ayuntamiento.
    const ayto = document.createElement('div');
    ayto.className = 'recep-ayto';
    const aytoSvg = preloader.getSVG(AYTO_LOGO);
    if (aytoSvg && aytoSvg.includes('<svg')) {
      injectSVG(ayto, aytoSvg, { prefix: 'ayto' });
    } else {
      const ph = document.createElement('div');
      ph.className = 'recep-ayto-placeholder';
      ph.textContent = 'AYTO. DE JUMILLA';
      ayto.appendChild(ph);
    }
    content.appendChild(ayto);
    this.state.ayto = ayto;

    // Bloque central de título · 3 LÍNEAS BEBAS NEUE.
    // Mismo tamaño, mismo tracking · L1 y L3 en Middle (500), L2 en Bold (700).
    const titleBlock = document.createElement('div');
    titleBlock.className = 'recep-title-block';

    const title = document.createElement('p');
    title.className = 'recep-title';
    const l1 = document.createElement('span');
    l1.className = 'recep-title-l1';
    l1.textContent = 'Presentación de';
    const l2 = document.createElement('span');
    l2.className = 'recep-title-l2';
    l2.textContent = 'La nueva marca turística';
    const l3 = document.createElement('span');
    l3.className = 'recep-title-l3';
    l3.textContent = 'de Jumilla';
    title.appendChild(l1);
    title.appendChild(l2);
    title.appendChild(l3);
    titleBlock.appendChild(title);

    content.appendChild(titleBlock);
    this.state.titleBlock = titleBlock;
    this.state.titleParts = { title, l1, l2, l3 };

    // ---- Estados iniciales (ocultos) ----
    gsap.set(ayto, { autoAlpha: 0, y: 12 });
    gsap.set([l1, l2, l3], { autoAlpha: 0, y: 14 });
  },

  step() {
    const s = this.state;
    const tl = gsap.timeline();

    // 1) Logo del ayto entra suave desde arriba.
    tl.to(s.ayto, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0);

    // 2) Las 3 líneas entran como un solo gesto · stagger muy apretado (0.14 s) para
    //    que el bloque se levante a la vez sin perder la cadencia de lectura.
    tl.to([s.titleParts.l1, s.titleParts.l2, s.titleParts.l3], {
      autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.out', stagger: 0.14
    }, 0.45);

    s.loops.push(tl);

    // 3) Bucles serenos: respiración global + float del bloque central.
    s.loops.push(gsap.to(s.content, {
      scale: 1.012, duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true,
      transformOrigin: '50% 50%'
    }));
    s.loops.push(gsap.to(s.titleBlock, {
      y: -4, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true
    }));

    return tl.then();
  },

  teardown() {
    if (!this.state) return;
    if (this.state.videoTimeout) clearTimeout(this.state.videoTimeout);
    this.state.loops.forEach((t) => t.kill());
    this.state.stage.style.background = '';
    this.state = null;
  }
};
