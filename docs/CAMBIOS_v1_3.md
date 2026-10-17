# Vitrina 1.3 · Escena, interacción y páginas por tema

Fecha: 2026-10-16. Base: `24047913b4d0f18499d91310dcf767a1732d0a51`.

La devolución de Ricardo sobre 1.2 señaló que la experiencia seguía demasiado próxima a la lectura anterior y no resolvía la fluidez solicitada. Esta versión cambia la composición y el mecanismo de navegación.

## Experiencia implementada

- Once archivos HTML reales de capítulo en `dist/temas/`, con títulos propios y base de recursos para recarga y acceso directo. La navegación interna cambia la URL mediante History API y conserva Atrás/Adelante.
- `#course` abre el tema de entrada/retoma; `#/indice` muestra las tarjetas de todos los temas con imágenes.
- Escenario amplio con imagen completa, puntos interactivos calibrados visualmente sobre los WebP y una capa de atmósfera de la misma imagen. No se generaron ni sustituyeron imágenes.
- Panel con Observá, Entendé, Probá y comprensión, con teclado, roles y foco. En móvil, lectura y práctica aprovechan el espacio de la pantalla.
- Controles anterior/siguiente siempre accesibles. «Sí, entendí · siguiente» conserva la confirmación explícita y avanza con una sola acción.
- Transición direccional de 240 + 360 ms entre capítulos, coordinada con la precarga y con alternativa sin movimiento.
- Comparador con asa de arrastre sobre la imagen, deslizador nativo y teclado; explicación accesible de los puntos mediante una lista.
- Taller, once prácticas, fuentes y claves de guardado conservados. Curso y cámara siguen separados. Los 13 clips siguen pendientes.

## Comprobaciones

`node scripts/generate-pages.mjs` genera las once páginas. `node tests/check-all.mjs` conserva las pruebas previas y añade existencia y rutas de las páginas, entrada directa del curso, bloqueo de enlaces profundos y posiciones de puntos dentro del rectángulo real de imagen a distintos tamaños. Los doce módulos pasan la comprobación de sintaxis.

Se inspeccionaron las 17 imágenes entregadas para ubicar referencias visuales. No se ejecutó navegador real: el controlador requerido por Sites continúa ausente en este entorno. Quedan pendientes la revisión visual efectiva de las pantallas, tacto, transiciones y exportación PNG.

## Identidad y guardados

Mismo Site, audiencia, 17 recursos, orden pedagógico y `vitrina-course-v1`. La versión del paquete es 1.3.0; la versión de datos del curso sigue en 1. Las propuestas editoriales y las imágenes continúan pendientes de aprobación/revisión docente.

La fuente se guarda en el repositorio Git canónico del Site. La copia al repositorio personal de GitHub sigue pendiente de identificar el destino y habilitar su acceso; no se utiliza el portfolio como destino.
