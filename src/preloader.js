export class Preloader {
  constructor(assets) {
    this.assets = assets;
    this.svgs = new Map();
    this.images = new Map();
  }

  async load(onProgress) {
    const images = this.assets.images || [];
    const totalSteps = this.assets.svgs.length + images.length + 1; // +1 por las fuentes
    let completedSteps = 0;

    const updateProgress = () => {
      completedSteps++;
      onProgress(completedSteps / totalSteps);
    };

    // Esperar a que las fuentes estén listas
    await document.fonts.ready;
    updateProgress();

    // Precargar todos los SVG como texto
    for (const path of this.assets.svgs) {
      const response = await fetch(path);
      if (!response.ok) {
        // Avisar en consola pero no romper la precarga: el día del evento
        // preferimos arrancar aunque falte un asset secundario.
        console.warn(`[Preloader] No se pudo cargar ${path} (HTTP ${response.status})`);
      }
      const text = await response.text();
      this.svgs.set(path, text);
      updateProgress();
    }

    // Precargar imágenes (PNG/JPG) creando Image() objects: el navegador los cachea
    // y cualquier <img src=...> posterior los pinta sin parpadeo.
    for (const path of images) {
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => { this.images.set(path, img); resolve(); };
        img.onerror = () => {
          console.warn(`[Preloader] No se pudo cargar ${path}`);
          resolve();
        };
        img.src = path;
      });
      updateProgress();
    }
  }

  getSVG(path) {
    return this.svgs.get(path);
  }

  getImage(path) {
    return this.images.get(path);
  }
}
