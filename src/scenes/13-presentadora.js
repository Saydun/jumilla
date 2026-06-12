// 13-presentadora.js
// Pulsación 1 · Presentación de Ángela Moreno · Victoria Crea.
//
// Versión simplificada: fondo Monastrell sólido (sin vídeo) con el logo de Victoria
// Crea (VC_white.svg) centrado y "ÁNGELA MORENO" en pequeño debajo, Bebas Neue
// letterspaced. Minimal · institucional.
//
//   step(1)
//     1) Logo VC entra con fade-in + sutil scale up.
//     2) "ÁNGELA MORENO" entra con fade-up.

import { gsap } from 'gsap';
import { injectSVG } from '../utils/svg-helpers.js';

const VC_LOGO   = '/logo/VC_white.svg';
const VC_SLOGAN = '/logo/VC_SLOGAN.svg';

export default {
  id: 'presentadora',
  pulsaciones: 1,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'pres-root';
    stage.appendChild(root);
    this.state.root = root;

    const page = document.createElement('div');
    page.className = 'pres-page';
    root.appendChild(page);

    // Logo Victoria Crea (ya viene en blanco).
    const logoBox = document.createElement('div');
    logoBox.className = 'pres-logo';
    injectSVG(logoBox, preloader.getSVG(VC_LOGO), { prefix: 'pres-vc' });
    page.appendChild(logoBox);

    // Línea divisoria fina entre el logo VC y el nombre.
    const divider = document.createElement('div');
    divider.className = 'pres-divider';
    page.appendChild(divider);

    // "ÁNGELA MORENO" en Match Regular letterspaced.
    const name = document.createElement('p');
    name.className = 'pres-name';
    name.textContent = 'ÁNGELA MORENO';
    page.appendChild(name);

    // Slogan de Victoria Crea bajo el nombre (SVG con sus colores originales).
    const sloganBox = document.createElement('div');
    sloganBox.className = 'pres-slogan';
    injectSVG(sloganBox, preloader.getSVG(VC_SLOGAN), { prefix: 'pres-vc-sl' });
    page.appendChild(sloganBox);

    this.state.refs = { logoBox, divider, name, sloganBox };
    gsap.set(logoBox, { autoAlpha: 0, scale: 0.96, transformOrigin: '50% 50%' });
    gsap.set(divider, { scaleX: 0, transformOrigin: 'center' });
    gsap.set(name, { autoAlpha: 0, y: 14 });
    gsap.set(sloganBox, { autoAlpha: 0, y: 14 });
  },

  step() {
    const r = this.state.refs;
    const tl = gsap.timeline();
    tl.to(r.logoBox, {
      autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out'
    }, 0.1);
    tl.to(r.divider, {
      scaleX: 1, duration: 0.6, ease: 'power2.out'
    }, 0.6);
    tl.to(r.name, {
      autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out'
    }, 0.85);
    tl.to(r.sloganBox, {
      autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out'
    }, 1.15);
    this.state.timelines.push(tl);
    return tl.then();
  },

  teardown() {
    if (!this.state) return;
    this.state.timelines.forEach((t) => t.kill());
    this.state.stage.style.background = '';
    this.state = null;
  }
};
