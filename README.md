# Vidriera

Curso interactivo de Visual Merchandising de Ricardo Romero Medina.

## Versión 1.6.4 · Empezar el curso y fuente en GitHub

El botón de la portada dice **Empezar el curso** y abre el primer tema, conservando el avance y los borradores existentes.

Repositorio independiente del curso: [ricardo-3/vidriera](https://github.com/ricardo-3/vidriera). El código está en la raíz de ese repositorio y la compilación en `dist/`. El portfolio es otro proyecto y queda separado. La incorporación anterior al portfolio se revirtió. Ver `docs/CORRECCION_REPOSITORIO_2026_10_17.md`.

## Portada amplia y miniaturas (1.6.3)

La foto del inicio ocupa casi todo el marco, con un margen de 8 px y bordes redondeados. Conserva su proporción 16:9 y encuadre completo; la tarjeta de presentación flota encima en escritorio. En tablet y móvil, foto y texto se apilan para mostrar el local completo. Se incluyen las correcciones de miniaturas de 1.6.2.

La fuente incluye código React, datos, recursos originales, documentos, pruebas y salida estática. El Site conserva su identidad y dirección. El destino del proyecto es ricardo-3/vidriera. El problema inicial de acceso quedó resuelto. La copia que se había añadido a porfolio fue retirada tras aclarar Ricardo que quería repositorios separados. Ver `docs/CAMBIOS_v1_6_3.md` y `docs/CAMBIOS_v1_6_4.md`.

## Miniaturas de Tu recorrido (1.6.2)

Las once miniaturas de «Tu recorrido» y de la vista previa usan URLs absolutas construidas con la base fija del Site. También se aplica a las vistas relacionadas, atmósfera y comparador. Así, las fotos no dependen de la URL de capítulo activa al cargarse. Se conserva el aspecto, el orden de temas y el avance. Ver `docs/CAMBIOS_v1_6_2.md`.

## Menú y fotos del local (1.6.1)

La navegación principal mantiene este orden en todas las páginas: **Curso VM → Explora el local → El taller**. Las tres opciones permanecen visibles en móvil. Curso VM inicia o retoma el recorrido con las mismas restricciones de avance.

El visor resuelve las fotografías desde la base fija del Site, también en diálogos y después de navegar entre capítulos. Comprueba descarga y decodificación antes de mostrar la foto, mantiene la anterior mientras carga la siguiente, cancela solicitudes anteriores y ofrece reintento ante error o espera prolongada. Las 17 imágenes originales permanecen intactas. Ver `docs/CAMBIOS_v1_6_1.md`.

## Escena estable y nueva marca (1.6)

La marca visible pasa a **VIDRIERA**, en negrita y sin punto. Los títulos de página tienen mayor tamaño y peso que los encabezados de contenido; se conserva la familia tipográfica y la paleta gris aprobada como dirección.

La escena izquierda utiliza una foto de proporción 16:9 al ancho del marco, con esquinas redondeadas. El detalle ocupa un espacio reservado de altura fija, incluso al cerrarlo: cambiar entre los puntos 1, 2 y 3 solo cambia el texto con un fundido. Comparación y detalles usan el mismo espacio; el indicador de lectura también mantiene su altura. El contenedor principal de página usa solo opacidad al entrar para no alterar la referencia de posición del bloque fijo.

La identidad y URL del Site, los IDs, las claves `vitrina-*`, las 17 imágenes y los guardados continúan siendo compatibles. Los archivos históricos del proyecto conservan sus nombres anteriores.

## Recorrido por scroll

Cada tema se recorre con el scroll nativo del navegador: Observá → Entendé → Probá → confirmación final. No hay pestañas para saltar pasos ni una botonera de capítulos durante la lectura. Las explicaciones aparecen suavemente al entrar en pantalla y la escena acompaña los puntos observados.

La confirmación de avance aparece al llegar al final del tema activo; hacer scroll no lo completa automáticamente. Las miniaturas son una vista previa discreta, disponible al terminar. Solo los temas completados pueden abrirse desde ellas. El tema disponible se inicia o retoma con la acción general de entrar al curso.

La nueva referencia visual aportada por Ricardo define grises cálidos, grafito, negro, vidrio ahumado y paneles claros. Se conserva la tipografía anterior y las imágenes del local.

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

La fuente se guarda en el Git canónico del Site. El destino correcto es ricardo-3/vidriera, con código en la raíz y salida en dist/. El portfolio se restauró y debe permanecer separado del curso. Siguiente tarea: revisión visual con Ricardo en navegador permitido y revisión de contenidos docentes.
