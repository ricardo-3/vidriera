# Guía técnica de Vidriera

Esta guía reúne la información de desarrollo que antes ocupaba el README. La presentación, el propósito docente y la historia del proyecto están en el [README](../README.md).

Versión funcional: **1.6.4**. El código está en la raíz de [ricardo-3/vidriera](https://github.com/ricardo-3/vidriera) y la salida compilada en `dist/`.

## Base React y componentes flotantes

Curso y taller usan React con Vite y salida estática. La interfaz comparte superficies de vidrio claro, profundidad, botones redondeados, pestañas, ayudas y diálogos. Las entradas y salidas mantienen el contenido durante su animación; las fotografías se funden después de precargarse y conservan su encuadre completo.

La referencia solicitada es [Meta Spatial SDK UI Set](https://developers.meta.com/vr/documentation/spatial-sdk/spatial-sdk-ui-overview/). Ese conjunto utiliza Jetpack Compose para Android/Horizon OS. Esta web implementa una adaptación propia en React de su jerarquía de superficies y controles; no importa una biblioteca web de Meta.

Cada tema conserva su página real `temas/S01.html`…`S11.html`, navegación sin recarga y Atrás/Adelante. Se mantienen las once prácticas y el taller con planta editable, recorrido, croquis, deshacer/rehacer e importación/exportación JSON/SVG/PNG. Color y composición son componentes React con estado compartido entre curso y taller. Los otros nueve ejercicios conservan sus modelos dentro de adaptadores React.

## Ejecutar y comprobar

```sh
npm ci
npm run build
node tests/check-all.mjs
```

El build genera `dist/` y las once páginas. En Sites se utilizan los helpers soportados de instalación y compilación. `.openai/hosting.json` mantiene identidad y salida estática. Editar `src/`, `public/` y las plantillas HTML de raíz; no editar los bundles generados.

`check-all` comprueba modelos, rutas, guardados, recursos, sintaxis y componentes React renderizados en Node. No ejecuta un navegador. La revisión real a 360 px y escritorio, tacto, teclado, movimiento reducido y exportación PNG sigue pendiente: este entorno no ofrece el controlador requerido por Sites.

## Rutas y avance

- `#course`: empezar o retomar el tema disponible.
- `#/indice`: vista previa de los once temas; solo los completados tienen enlaces.
- `temas/S01.html`: página de capítulo válida también al recargar.
- `#/tema/S01` y `#lesson-S01`: enlaces anteriores compatibles.
- `#/cierre`: observación y descarga al completar los once temas.
- `taller.html`: planta, recorrido, croquis, color y composición.

Orden: `S01,S02,S03,S04,S05,S06,S07,S10,S08,S09,S11`. S10 es el tema 8. Una URL bloqueada lleva al capítulo habilitado. «Sí, entendí · siguiente» completa únicamente el tema activo y abre el siguiente. «No, quiero repasar» conserva lo completado. Explorar, practicar y hacer scroll no completan temas. La confirmación no es una evaluación académica.

## Guardados compatibles

La versión de datos continúa en `1`; la versión del paquete es `1.6.4`. Se mantienen las claves:

- Curso y observación: `vitrina-course-v1`.
- Planta, recorrido y croquis: `vitrina-layout-v1`.
- Color: `vitrina-color-lab-v1`.
- Composición: `vitrina-composition-v1`.
- Otras prácticas: `vitrina-practice-v1`.

Reiniciar el curso conserva las prácticas y el taller. El cierre descarga la reflexión y los borradores de brief, concepto y mejora. Si falla el almacenamiento, el estado continúa en memoria durante la sesión y se pueden descargar las propuestas.

## Fuente

- `src/App.jsx`: curso, navegación, índice, comprensión, mapa, exploración y cierre.
- `src/Workshop.jsx`: editor React de planta y exportaciones.
- `src/ui/components.jsx`: superficies, botones, pestañas, campos, diálogos, ayudas y presencia animada.
- `src/ui/GuidedCourse.jsx`: lectura continua, seguimiento del tema y confirmación al final.
- `src/ui/CoursePreview.jsx`: miniaturas con enlaces únicamente a temas completados.
- `src/domain/reading.js`: lectura transitoria y guarda de confirmación, sin escribir progreso.
- `src/styles/guided.css`: paleta de referencia y composición del recorrido.
- `src/styles/scene.css`: dimensiones estables de la escena, imagen, marca y jerarquía tipográfica.
- `src/styles/home.css`: portada con foto completa casi al borde, tarjeta flotante y composición móvil.
- `src/ui/Scene.jsx`: encuadre completo, carga de fotografías, hotspots y comparadores.
- `src/domain/store-image.js`: rutas estables, descarga/decodificación, errores y cancelación de fotos.
- `src/ui/Labs.jsx`: color y composición React, persistencia y sincronización entre vistas.
- `src/ui/Practice.jsx`: integración de los ejercicios con React.
- `src/domain/`: modelos originales de progreso, navegación, cámara, geometría y actividades.
- `src/domain/data/`: contenidos base, propuestas editoriales y puntos normalizados.
- `src/styles/spatial.css`: lenguaje visual, movimiento y adaptación móvil.
- `public/assets/`: 17 imágenes originales y favicon.
- `scripts/generate-pages.mjs`: generación de páginas físicas después del build.
- `tests/`: comprobaciones de modelos, recursos, rutas, sintaxis y componentes.

## Revisión y continuidad

Se mantienen las 17 imágenes sin regenerarlas, Mujer a la izquierda desde la entrada, Kids al fondo izquierdo y Hombre a la derecha. La isla conserva libros, tres perfumes y complementos, sin maniquíes centrales.

Los 13 clips de cámara siguen pendientes, con `video: null`. Los fundidos son de interfaz y fotografías; no representan continuidad audiovisual validada. El adaptador `CameraPlayer` permanece separado del avance pedagógico para una integración futura.

Imágenes y textos siguen pendientes de aprobación final/revisión docente. Calzado Mujer conserva el pendiente de la repisa baja. La planta de 8 × 12 m es didáctica. La comparación de color es conceptual; IMG-07 muestra acentos e IMG-12B luz uniforme.

El maestro v5 mantiene el brief histórico; `docs/CAMBIOS_v1_6.md` describe la implementación vigente. `docs/PROMPT_CONTINUIDAD.md` permite retomar el proyecto.

## Historial y retoma

Las decisiones de cada versión se conservan en los documentos `CAMBIOS_v1_*.md` de esta carpeta. El registro de ubicación del repositorio está en [CORRECCION_REPOSITORIO_2026_10_17.md](CORRECCION_REPOSITORIO_2026_10_17.md).

Para continuar, consultá [PROMPT_CONTINUIDAD.md](PROMPT_CONTINUIDAD.md). Antes de publicar cambios de la aplicación, comprobá el build, las pruebas y la navegación en el entorno de destino.

## Publicación en GitHub Pages

La publicación del curso debe usar la salida compilada de `dist/`. El `index.html` de la raíz es una entrada de desarrollo para Vite: publicarlo directamente deja el mensaje «Preparando tu recorrido…» sin iniciar React ni cargar sus estilos.

El workflow [.github/workflows/pages.yml](../.github/workflows/pages.yml) instala las dependencias, compila el curso, ejecuta `node tests/check-all.mjs` y publica exclusivamente `dist/`. En Settings → Pages → Build and deployment, la fuente debe ser **GitHub Actions**.

Después de publicar, `scripts/verify-pages.mjs` comprueba por HTTP que el inicio, el taller, las once páginas de tema, los bundles y las 17 fotografías coincidan byte por byte con la compilación. Esta comprobación de archivos no sustituye una revisión visual real en navegador.

El código de la aplicación, las imágenes originales, la versión funcional y las claves de guardado no cambian con esta configuración de publicación.
