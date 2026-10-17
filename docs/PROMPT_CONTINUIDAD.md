# Continuar Vidriera 1.6.4

Actuá como desarrollador de interfaces y colaborador de diseño. Continuá Vidriera de Ricardo Romero Medina desde su fuente efectiva. Implementá, comprobá y documentá el cierre.

Leé README.md, docs/CAMBIOS_v1_6_4.md, docs/CAMBIOS_v1_6_3.md, docs/CAMBIOS_v1_6_2.md, docs/CAMBIOS_v1_6_1.md, docs/CAMBIOS_v1_6.md, docs/INTERACTIVIDAD.md y el maestro v5. Inspeccioná package.json, vite.config.js, src/App.jsx, src/Workshop.jsx, src/ui/, src/styles/ y src/domain/. Usa React, Vite y salida estática en dist. No edites los bundles a mano. Conservá manifiesto de hosting, identidad y audiencia del Site.

Todas las fotos de React, incluidas las miniaturas de «Tu recorrido», vistas relacionadas, atmósfera y comparadores, resuelven src con storeImageUrl y StoreImageBase. No vuelvas a pasar DATA.images[id].src directamente a un img: dependería de la URL activa. Comprobá las once miniaturas, además del visor grande.

La cabecera debe mantener Curso VM → Explora el local → El taller en ese orden, también en móvil. Curso VM retoma el recorrido sin desbloquear temas. Conservá la base fija de fotos, la comprobación de carga/decodificación, la cancelación de cargas anteriores y el reintento del visor.

La portada muestra la foto completa 16:9 al ancho del marco, con un margen de 8 px y bordes redondeados. La tarjeta flota en escritorio; en tablet/móvil se apilan foto y texto. Conservá src/styles/home.css y evitá volver a la franja central con grandes márgenes.

El botón de portada dice Empezar el curso y abre S01 sin borrar el avance. Los accesos de continuar siguen retomando el recorrido.

La marca visible es VIDRIERA, en negrita y sin punto. Conservá la familia tipográfica, la jerarquía de título de página por encima de subtítulos y la paleta gris. La identidad del Site, las rutas y las claves vitrina-* se conservan para mantener los guardados. No renombres las claves ni regeneres las imágenes por este cambio de nombre.

La escena izquierda debe conservar su geometría mientras se lee: marco de foto 16:9 al ancho disponible, bordes redondeados, detalle de altura fija y seguimiento de altura fija. Los puntos 1-3 cambian el texto con opacidad, sin añadir/quitar espacio. La comparación ocupa la misma ranura que el detalle. No vuelvas a usar max-height/márgenes animados en esa columna ni transform/filter sobre el contenedor padre de la escena fija. Revisá src/styles/scene.css y el modo fade de MotionSection.

La experiencia actual es un recorrido por scroll nativo: Observá, Entendé y Probá aparecen en secuencia vertical, con la confirmación solo al llegar al final. No vuelvas a convertirlos en pestañas ni pongas una botonera de temas en la cabecera. El scroll no completa temas: habilita la confirmación explícita. Las miniaturas quedan al final como vista previa discreta y solo los completados permiten navegar. Los enlaces profundos no deben saltar el orden.

La referencia de color de Ricardo es la imagen SAFE·CORE SET 027: gris cálido, grafito, negro, vidrio ahumado y paneles claros. La tipografía se conserva; no copiar la de la referencia. Conservá el lenguaje espacial solicitado: paneles flotantes claros, profundidad, separación figura/fondo, controles redondeados y movimiento suave próximo a Apple TV. Meta UI Set es nativo de Android/Horizon OS con Jetpack Compose; esta web lo adapta mediante componentes propios en React. No afirmes que utiliza una biblioteca web oficial de Meta. Mantené contenido durante el cierre de diálogos y alternativa de movimiento reducido.

Conservá las 17 imágenes y su encuadre completo. Mujer queda a la izquierda desde la entrada, Kids al fondo izquierdo y Hombre a la derecha; cada departamento tiene calzado propio. La isla lleva libros, tres perfumes y complementos, sin maniquíes centrales.

Cada tema tiene página HTML real en temas/S01.html…S11.html. La navegación React conserva recarga, History API, Atrás/Adelante y enlaces anteriores. #course retoma el capítulo; #/indice muestra el índice y #/cierre la observación y descarga. La base de recursos se fija antes de navegar. npm run build genera dist y las once páginas.

Orden estable: S01,S02,S03,S04,S05,S06,S07,S10,S08,S09,S11. S10 es tema 8. Solo «Sí, entendí» completa el tema activo y habilita el siguiente. «No, quiero repasar» conserva lo completado. Scroll, prácticas y exploración no completan temas; esta confirmación no es evaluación académica.

Conservá DATA.version='1', vitrina-course-v1 y las claves independientes de taller, color, composición y prácticas. Los laboratorios React comparten estado entre curso y taller. Conservá arrastre, teclado, trazos, deshacer/rehacer, guardados y exportación/importación JSON/SVG/PNG. No pierdas borradores de sesión cuando falle localStorage.

Las 13 transiciones de cámara siguen sin videos. Los fundidos actuales son de interfaz y fotografías. Cámara y aprendizaje siguen separados. Cuando existan clips, validá geometría, muebles, productos, empalmes y navegación inversa antes de integrar scrubbing; no simules continuidad mediante deformaciones.

Imágenes y textos requieren aprobación final/revisión docente. Calzado Mujer conserva la repisa baja pendiente. El plano de 8×12 m es didáctico. No infieras mediciones, validación técnica ni cumplimiento académico.

Ejecutá npm run build, node tests/check.mjs y node tests/check-all.mjs. En Sites usá sus helpers de instalación, compilación y publicación. Las pruebas React son renderizado en Node, no navegador. Sigue pendiente la revisión real a 360 px/escritorio, tacto, teclado, movimiento reducido y PNG por falta del controlador requerido. Registrá el límite con precisión.

La fuente está en el Git canónico del Site. El repositorio independiente y correcto del curso es https://github.com/ricardo-3/vidriera.git, con el proyecto en la raíz y la compilación en dist/. La copia añadida anteriormente a porfolio se revirtió. La aclaración de Ricardo es mantener ambos proyectos separados. No vuelvas a integrar el curso dentro del portfolio. Leé docs/CORRECCION_REPOSITORIO_2026_10_17.md. Al cerrar registrá versión, commit publicado, comprobaciones, pendientes y siguiente tarea en docs y en https://app.notion.com/p/3f98350307db81aa8cf9c375025cbe67.
