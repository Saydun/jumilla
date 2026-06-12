// 07-cierre.js
// BLOQUE 4 · Cierre y cocktail · Pulsaciones 59-60 + Loop final (GUION_TECNICO.md).
//
//   step(1) · Puls. 59 · Agradecimiento
//     Fondo negro enriquecido. "Gracias." en Match 320 bold blanco arriba; debajo el
//     logo en su versión BLANCA (LOGO_COMPLETO_BLANCO.svg, ya incluye el slogan).
//     Pulso de respiración del conjunto (opacidad 0.95 ↔ 1, ciclo 4 s).
//   step(2) · Puls. 60 · Invitación al cocktail
//     Cross-fade: fondo pasa a Monastrell sólido. Tres líneas blancas: "Os invitamos
//     a un" / "cocktail" / "con los vinos de Jumilla." con stagger desde abajo.
//   step(3) · LOOP DE CIERRE (ambiente cocktail)
//     Cross-fade desde la invitación. Ciclo automático de 3 frases del manifiesto:
//     8 s por slide, cross-fade 1.5 s, repeat infinito. Isotipo discreto al 30 %.

import { gsap } from 'gsap';
import { injectSVG } from '../utils/svg-helpers.js';

const LOGO_BLANCO = '/logo/LOGO_COMPLETO_BLANCO.svg';
const ISOTIPO = '/logo/LOGO_ISOTIPO.svg';

const LOOP_FRASES = [
  'Capital de la Monastrell.',
  '700 años custodiando la tradición.',
  'El origen del vino mediterráneo.'
];

export default {
  id: 'cierre',
  pulsaciones: 3,
  state: null,

  setup(stage, preloader) {
    this.state = { stage, preloader, timelines: [] };
    stage.style.background = '';

    const root = document.createElement('div');
    root.className = 'cie-root';
    stage.appendChild(root);
    this.state.root = root;

    // ---- Puls. 59 · Agradecimiento (fondo negro) ----
    const pag59 = document.createElement('div');
    pag59.className = 'cie-page is-dark';
    root.appendChild(pag59);
    this.state.pag59 = pag59;

    const gracias = document.createElement('p');
    gracias.className = 'cie-gracias';
    gracias.textContent = 'Gracias.';
    pag59.appendChild(gracias);

    const logoBox = document.createElement('div');
    logoBox.className = 'cie-logo';
    injectSVG(logoBox, preloader.getSVG(LOGO_BLANCO), { prefix: 'cie-logo' });
    pag59.appendChild(logoBox);

    this.state.gracias = gracias;
    this.state.logo = logoBox;
    gsap.set([gracias, logoBox], { autoAlpha: 0 });

    // ---- Puls. 60 · Cocktail (fondo Monastrell, oculto hasta su turno) ----
    const pag60 = document.createElement('div');
    pag60.className = 'cie-page is-monastrell';
    root.appendChild(pag60);
    gsap.set(pag60, { autoAlpha: 0 });
    this.state.pag60 = pag60;

    const os = document.createElement('p');
    os.className = 'cie-os';
    os.textContent = 'OS INVITAMOS A UN';
    const cocktail = document.createElement('p');
    cocktail.className = 'cie-cocktail';
    cocktail.textContent = 'cocktail';
    const con = document.createElement('p');
    con.className = 'cie-con';
    con.textContent = 'con los vinos de Jumilla.';
    pag60.appendChild(os);
    pag60.appendChild(cocktail);
    pag60.appendChild(con);
    this.state.cocktailLines = [os, cocktail, con];
    gsap.set([os, cocktail, con], { autoAlpha: 0, y: 30 });

    // ---- Loop de cierre (fondo Monastrell, oculto) ----
    const pagLoop = document.createElement('div');
    pagLoop.className = 'cie-page is-monastrell';
    pagLoop.style.padding = '0';      // las slides ya gestionan su propio padding
    root.appendChild(pagLoop);
    gsap.set(pagLoop, { autoAlpha: 0 });
    this.state.pagLoop = pagLoop;

    // Una "slide" por cada frase + un isotipo discreto compartido (no es slide).
    this.state.loopSlides = LOOP_FRASES.map((frase) => {
      const s = document.createElement('div');
      s.className = 'cie-loop-slide';
      const t = document.createElement('p');
      t.className = 'cie-loop-text';
      t.textContent = frase;
      s.appendChild(t);
      pagLoop.appendChild(s);
      gsap.set(s, { autoAlpha: 0 });
      return s;
    });
    const iso = document.createElement('div');
    iso.className = 'cie-loop-iso';
    injectSVG(iso, preloader.getSVG(ISOTIPO), { prefix: 'cie-iso' });
    pagLoop.appendChild(iso);
  },

  step(n) {
    switch (n) {
      case 1: return this.stepGracias();
      case 2: return this.stepCocktail();
      case 3: return this.stepLoop();
      default: return Promise.resolve();
    }
  },

  // Puls. 59 · "Gracias." → logo → respiración del conjunto.
  stepGracias() {
    const tl = gsap.timeline();
    tl.to(this.state.gracias, { autoAlpha: 1, duration: 1.0, ease: 'power2.out' }, 0);
    tl.to(this.state.logo, { autoAlpha: 1, duration: 1.0, ease: 'power2.out' }, 0.5);
    // Respiración infinita del conjunto.
    this.state.timelines.push(gsap.to(this.state.pag59, {
      opacity: 0.95, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true
    }));
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Puls. 60 · Cross-fade a Monastrell + 3 líneas con stagger desde abajo.
  stepCocktail() {
    const tl = gsap.timeline();
    tl.to(this.state.pag59, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
    tl.set(this.state.pag60, { autoAlpha: 1 }, 0.6);
    tl.to(this.state.cocktailLines, {
      autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.3
    }, 0.6);
    this.state.timelines.push(tl);
    return tl.then();
  },

  // Loop · Ciclo infinito de 3 frases con cross-fade lento.
  // 8 s visible + 1.5 s cross-fade → ciclo total ≈ 9.5 s/slide.
  stepLoop() {
    const tl = gsap.timeline();
    tl.to(this.state.pag60, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
    tl.set(this.state.pagLoop, { autoAlpha: 1 }, 0.6);

    // Bucle infinito que rota entre las slides.
    const slides = this.state.loopSlides;
    const loopTl = gsap.timeline({ repeat: -1 });
    slides.forEach((s, i) => {
      const prev = slides[(i - 1 + slides.length) % slides.length];
      loopTl.to(prev, { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' }, i === 0 ? 0 : '+=8');
      loopTl.to(s, { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut' }, '<');
    });
    this.state.loopTl = loopTl;
    this.state.timelines.push(loopTl);

    // El loop arranca ya pero su primera transición fade-out del "prev" (= último) no
    // afecta porque está autoAlpha 0. El primer slide entra suave.
    this.state.timelines.push(tl);
    return tl.then();
  },

  teardown() {
    if (!this.state) return;
    this.state.timelines.forEach((t) => t.kill());
    if (this.state.loopTl) this.state.loopTl.kill();
    this.state.stage.style.background = '';
    this.state = null;
  }
};
