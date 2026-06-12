import { gsap } from 'gsap';
import { Controller } from './controller.js';
import { Preloader } from './preloader.js';

// Lista de assets a precargar.
// NOTA: los SVG del logo se sirven desde /logo/ (publicDir = assets).
// Los nombres usan el formato canónico de CLAUDE.md (guion bajo); los archivos
// originales que venían con espacios/typo se renombraron en el setup inicial.
const ASSETS = {
  fonts: ['Match', 'Bebas Neue'],
  svgs: [
    '/logo/JU.svg',
    '/logo/MI.svg',
    '/logo/LLA.svg',
    '/logo/SLOGAN.svg',
    '/logo/BOTELLA.svg',
    '/logo/CASTILLO.svg',
    '/logo/UVAS.svg',
    '/logo/PATRON.svg',
    '/logo/LOGO_COMPLETO_JUMILLA_TURISMO.svg',
    '/logo/LOGO_COMPLETO_BLANCO.svg',
    '/logo/LOGO_HORIZONTAL.svg',
    '/logo/LOGO_ISOTIPO.svg',
    '/logo/logo_ayto.svg',
    '/logo/VC_white.svg',
    '/logo/VC_SLOGAN.svg'
  ],
  images: [
    '/mockups/mock_mupi@2x.png',
    '/mockups/mock_bandera@2x.png',
    '/mockups/mock_rollup@2x.png',
    '/mockups/mock_flyer@2x.png',
    '/mockups/mock_sello@2x.png',
    '/mockups/mock_camiseta@2x.png',
    '/mockups/mock_gorra@2x.png',
    '/mockups/mock_pulsera@2x.png',
    '/mockups/mock_laptop@2x.png',
    '/mockups/mock_movil@2x.png'
  ]
};

async function init() {
  const preloader = new Preloader(ASSETS);
  await preloader.load((progress) => {
    document.querySelector('.loader-bar-fill').style.width = `${progress * 100}%`;
  });

  // Esperar 300ms para que la última actualización se vea
  await new Promise(r => setTimeout(r, 300));

  // Ocultar loader
  document.getElementById('loader').classList.add('hidden');

  // Inicializar controller con todas las escenas
  const controller = new Controller(preloader);
  await controller.init();
}

init();
