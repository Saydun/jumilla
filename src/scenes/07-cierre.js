// 07-cierre.js
// BLOQUE 4 · Cierre · 1 PULSACIÓN (última diapositiva de la presentación).
//
//   step(1) · Cierre final
//     Fondo: mismo tratamiento que la (12, 2) — vídeo videoloop_1.webm en loop +
//     tinte Monastrell al 78 %. Centrado: composición "logos final@2x.png" en
//     pequeño (~520 px ancho) con fade-in + leve scale-up.
//
// (Antes esta escena tenía 3 pulsaciones: Gracias, Cocktail y Loop. Se ha simplificado
//  a una sola pantalla de cierre.)

import { gsap } from 'gsap';

const VIDEO_SRC   = '/video/videoloop_1.webm';
const LOGOS_FINAL = '/logo/logos final@2x.png';

export default {
  id: 'cierre',
  pulsaciones: 1,
  state: null,

  setup(stage /*, preloader */) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'cie-root';
    stage.appendChild(root);
    this.state.root = root;

    // ---- Vídeo de fondo (mismo asset que portada y alcaldesa) ----
    const video = document.createElement('video');
    video.className = 'cie-video';
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
      video.play().catch(() => {});
      gsap.to(video, { autoAlpha: 1, duration: 1.4, ease: 'power2.out' });
    };
    video.addEventListener('error', dropVideo);
    video.addEventListener('loadeddata', acceptVideo);
    this.state.videoTimeout = setTimeout(dropVideo, 3000);
    video.src = VIDEO_SRC;

    // Tinte Monastrell al 78 % (idéntico a la alcaldesa puls. 2).
    const overlay = document.createElement('div');
    overlay.className = 'cie-overlay';
    root.appendChild(overlay);

    // ---- Composición de logos centrada ----
    const logos = document.createElement('img');
    logos.className = 'cie-logos';
    logos.src = LOGOS_FINAL;
    logos.alt = '';
    root.appendChild(logos);
    this.state.logos = logos;
    // xPercent/yPercent -50 mantiene el centrado del CSS aunque GSAP gestione el
    // scale del transform (de otro modo sobrescribiría el translate -50%, -50%).
    gsap.set(logos, {
      autoAlpha: 0,
      xPercent: -50,
      yPercent: -50,
      scale: 0.96,
      transformOrigin: '50% 50%'
    });
  },

  step(n) {
    if (n !== 1) return Promise.resolve();
    const tl = gsap.timeline();
    tl.to(this.state.logos, {
      autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out'
    }, 0.4);
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
