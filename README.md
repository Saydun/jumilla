# Presentación marca turística Jumilla · Capital de la Monastrell

Pieza web interactiva para proyección sobre pantalla LED de 8 x 3 metros en el evento de presentación pública de la nueva marca turística del Ayuntamiento de Jumilla.

**Fecha del evento: martes 2 de junio de 2026, 18:30 h.**

---

## 🚀 Arrancar el proyecto

```bash
# Instalar dependencias
npm install

# Modo desarrollo (hot reload en http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview
```

Una vez en el navegador, pulsar **F** para entrar en fullscreen y **flecha derecha** para avanzar.

---

## 🎮 Controles

| Tecla | Acción |
|---|---|
| `→` (flecha derecha) | Avanzar a la siguiente pulsación |
| `←` (flecha izquierda) | Retroceder (solo para ensayos, no usar en el evento) |
| `F` | Entrar en fullscreen |
| `Escape` | Salir de fullscreen |
| `R` | Reiniciar la presentación desde el inicio |
| `D` | Mostrar/ocultar overlay de debug (número de pulsación) |

El día del evento, Victoria usa un **clicker Logitech R400** que emula la flecha derecha del teclado. Solo se debe pulsar el botón de avance.

---

## 📁 Estructura del proyecto

```
jumilla-presentacion/
├── CLAUDE.md                    ← contexto maestro para Claude Code
├── README.md                    ← este archivo
├── index.html                   ← entry point HTML
├── package.json
├── vite.config.js               ← config de Vite
├── /src
│   ├── main.js                  ← inicialización
│   ├── controller.js            ← gestor de pulsaciones
│   ├── preloader.js             ← precarga de assets
│   ├── /scenes                  ← una escena por bloque del guion
│   ├── /styles                  ← variables, base, escenas
│   └── /data
│       └── encuestas.json       ← datos de las encuestas
├── /assets
│   ├── /logo                    ← SVGs del logo (JU, MI, LLA, etc.)
│   ├── /icons                   ← SVGs de iconos (botella, castillo, uvas)
│   ├── /fonts                   ← Match y Bebas Neue (WOFF2)
│   ├── /images                  ← fotos y mockups
│   └── /video                   ← loops de bienvenida y cocktail
└── /docs
    ├── GUION_TECNICO.md         ← guion pulsación a pulsación
    └── manual-marca.pdf         ← manual de marca de referencia
```

---

## 🎨 Stack técnico

- **HTML5** + **CSS3** + **JavaScript ES6+** (vanilla)
- **GSAP 3** para animaciones
- **Vite** como bundler

**Cero frameworks. Cero dependencias innecesarias. Cero conexión a internet.**

---

## 📋 Checklist pre-evento

Lo que hay que verificar antes del día del evento:

### Una semana antes
- [ ] Todas las escenas implementadas y testeadas
- [ ] Datos de las encuestas validados con el cliente
- [ ] Loops de bienvenida y cocktail recibidos e integrados
- [ ] Mockups del manual integrados en el bloque 2.8
- [ ] Ensayo completo cronometrado con Victoria

### 48 horas antes (lunes 1 de junio)
- [ ] Build de producción generado (`npm run build`)
- [ ] Build copiado a USB
- [ ] Portátil de presentación con la pieza instalada
- [ ] Portátil de backup con la pieza instalada
- [ ] Prueba técnica en la pantalla LED real
- [ ] Configuración de salida HDMI verificada (resolución 2048x768)
- [ ] Clicker Logitech R400 probado y con pilas nuevas
- [ ] Clicker de backup preparado

### El día del evento (martes 2 de junio)
- [ ] Montaje y prueba final en el venue por la mañana
- [ ] Verificar que la pieza arranca en fullscreen sin problemas
- [ ] Verificar que las fuentes cargan correctamente
- [ ] Verificar que todas las pulsaciones funcionan
- [ ] Loop de recepción activo desde 18:00 h
- [ ] Evento a las 18:30 h

---

## 🏗️ Cómo añadir o modificar una escena

Cada escena vive en `/src/scenes/` y sigue este patrón:

```javascript
// /src/scenes/03-encuestas.js
import { gsap } from 'gsap';

export default {
  id: 'encuestas',
  pulsaciones: 8,                   // pulsaciones totales de la escena

  setup(stage) {
    // se ejecuta una vez al entrar en la escena
    stage.innerHTML = `
      <div class="scene-encuestas">
        <h1 class="titulo">Hemos preguntado a Jumilla</h1>
        <!-- ... -->
      </div>
    `;
  },

  step(n) {
    // se ejecuta en cada pulsación dentro de la escena
    // n va de 1 a `pulsaciones`
    switch(n) {
      case 1:
        // animación del paso 1
        break;
      case 2:
        // animación del paso 2
        break;
      // ...
    }
  },

  teardown() {
    // limpieza al salir de la escena
    gsap.killTweensOf("*");
  }
};
```

Luego, registrar la escena en `/src/controller.js` en el orden correcto.

---

## 🎯 Reglas de oro del proyecto

1. **El claim oficial es "Capital de la Monastrell"**. No "Origen Profundo".
2. **Todo es offline**. Nada de CDNs, Google Fonts, APIs externas.
3. **Fullscreen 2048x768**. Diseñar siempre para ratio 8:3.
4. **Solo flecha derecha avanza**. Nada se anima solo (salvo loops).
5. **Paleta cerrada**: Monastrell, Azul Heráldico, Púrpura, Verde Envero, Negro Enriquecido. Nada más.
6. **Solo Match y Bebas Neue**. Nada de Arial.
7. **Si algo no está claro, leer `CLAUDE.md` y `/docs/GUION_TECNICO.md`**.

---

## 📞 Equipo

- **Victoria Crea** · Agencia responsable, operadora del clicker
- **Ayuntamiento de Jumilla** · Cliente
- **Seve González** · Alcaldesa, interviene tras Victoria Crea
- **Empresa de pantallas** (pendiente de confirmar) · Operadora del Resolume y de la pantalla LED

---

## 📝 Licencia

Proyecto privado para el Ayuntamiento de Jumilla. Todos los derechos reservados.
