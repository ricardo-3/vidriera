# Corrección de repositorio · 2026-10-17

El curso corresponde al repositorio independiente `ricardo-3/vidriera`, con código en la raíz y compilación en dist/. La incorporación anterior al portfolio fue revertida. Se conserva la versión funcional 1.6.4, incluida la acción Empezar el curso. Ver `CORRECCION_REPOSITORIO_2026_10_17.md`.

---

# Actualización 1.6.4 · Empezar el curso

El botón principal abre S01 y dice Empezar el curso. Conserva el avance guardado. Ricardo autorizó subir el proyecto completo a `ricardo-3/porfolio`, en `vidriera/`, y la compilación a `public/vidriera/` para publicarla como sección independiente. Ver `CAMBIOS_v1_6_4.md`.

---

# Actualización 1.6.3 · Portada amplia

Foto de inicio al ancho del componente con un margen de 8 px, proporción 16:9, encuadre completo y esquinas redondeadas. Tarjeta flotante en escritorio; imagen y texto apilados en tablet/móvil. Repositorio de destino identificado: `ricardo-3/vidriera`; subida pendiente de habilitar su acceso en GitHub. Se incluye la corrección de las once miniaturas. Ver `CAMBIOS_v1_6_3.md` y `src/styles/home.css`.

---

# Actualización 1.6.2 · Miniaturas de Tu recorrido

Las once miniaturas resuelven sus src desde la base fija del Site, igual que las vistas relacionadas, atmósferas y comparadores. Se conserva la carga diferida, el encuadre, los textos y las restricciones de avance. Ver `CAMBIOS_v1_6_2.md`.

---

# Actualización 1.6.1 · Menú y visor del local

Cabecera en orden Curso VM → Explora el local → El taller, con las tres opciones visibles en móvil. La exploración usa la base fija del Site y solo publica una foto después de descargarla y decodificarla. Mantiene la anterior durante la espera y permite reintentar errores; las solicitudes canceladas no reemplazan la vista actual. No modifica imágenes, avance ni guardados. Ver `CAMBIOS_v1_6_1.md`.

---

# Actualización 1.6 · Vidriera

La marca de la interfaz cambia a VIDRIERA en negrita, sin punto. La foto ocupa su marco 16:9 con esquinas redondeadas. Detalles y comparación comparten una ranura de altura fija; el indicador de lectura no cambia de altura. Los puntos 1-3 actualizan el texto con opacidad, sin animar las dimensiones de la columna izquierda. El recorrido y los guardados se conservan. Ver `CAMBIOS_v1_6.md` y `src/styles/scene.css`.

---

# Actualización 1.5

El curso se recorre por scroll: Observá → Entendé → Probá → confirmación al final. Se eliminan pestañas y acceso permanente a capítulos. Las miniaturas se muestran de forma discreta; los futuros no tienen enlaces. Solo confirmar explícitamente al final completa el tema activo. Se conserva el scroll nativo, el teclado y los guardados anteriores.

Paleta actual: grises cálidos, grafito, negro y vidrio ahumado según la referencia de Ricardo; misma tipografía. Ver `CAMBIOS_v1_5.md`, `src/ui/GuidedCourse.jsx` y `src/styles/guided.css`.

---

# Actualización 1.4

Curso y taller migrados a React con componentes flotantes compartidos. Color y composición usan estado sincronizado entre ambas vistas; los otros ejercicios conservan sus modelos dentro de adaptadores React. El editor está en `src/Workshop.jsx` y los modelos en `src/domain/`. El build genera `dist/` y las once páginas de tema. README.md y `CAMBIOS_v1_4.md` describen los archivos vigentes y límites de comprobación.

Las entradas y salidas conservan el contenido durante la animación. Se mantienen todas las claves de guardado y la opción de movimiento reducido. La revisión visual real de esta versión y la exportación PNG en navegador siguen pendientes.

---

# Actualización 1.3

Escenario visual con hotspots, cuatro paneles por capítulo y comparadores arrastrables sobre la foto. Las páginas HTML por tema se generan con `node scripts/generate-pages.mjs`. El taller y todos sus guardados se conservan. Ver `CAMBIOS_v1_3.md` para el estado de revisión.

---

# Actualización 1.2

El curso ahora tiene un capítulo por tema y once prácticas. Los detalles actuales están en README.md y CAMBIOS_v1_2.md. El taller descrito a continuación se conserva; el ejercicio de composición permite además seleccionar grupos y editar posición y escala, con la clave `vitrina-composition-v1`.

Los borradores de los otros ejercicios se guardan en `vitrina-practice-v1`, separados del curso y del layout. La comprobación general también incluye pruebas de navegación y peticiones de cámara fuera de orden. La revisión visual real sigue pendiente.

---

# Taller y actividades - Vitrina v1.1

## Recorrido de práctica

- `taller.html#layout`: distribución y mobiliario.
- `taller.html#recorrido`: abre con la herramienta de recorrido.
- `taller.html#color`: paleta y agrupación de prendas.
- `taller.html#composition`: comparación de criterios de composición.

El taller está disponible desde la navegación principal y desde el cierre del curso. S02 enlaza a diseñar layout; S03 a dibujar recorrido. S04 y S07 tienen ejercicios propios dentro de su explicación.

## Planta editable

La planta inicial representa el ejercicio de 8 × 12 m. Se puede partir de Vitrina, de una planta vacía o de varias islas. Zonas y muebles son elementos independientes. El alumno puede agregar, arrastrar, girar, modificar posición/tamaño y eliminar elementos.

Las posiciones arrastradas se ajustan a 0,25 m; Shift permite mover sin ese ajuste. Las flechas mueven el elemento seleccionado 0,25 m; Shift + flecha desplaza 1 m. El panel de propiedades ofrece una alternativa al arrastre. Las medidas son propuestas de estudio.

Recorrido admite puntos y dibujo continuo; Croquis libre dibuja trazos separados. Borrar trazos vacía recorrido y croquis. Deshacer/rehacer guarda hasta 45 cambios dentro de la sesión. La propuesta se guarda automáticamente en localStorage con la clave `vitrina-layout-v1`.

El análisis observa superposición entre muebles, muebles sobre un acceso propuesto de 2 × 2 m y cruces de la línea de recorrido con muebles. Es una ayuda geométrica sobre el esquema, no una validación normativa ni una calificación. Las zonas de departamento no cuentan como muebles que bloquean el recorrido.

## Exportación

- PNG: representación del plano, generada desde el SVG.
- SVG: esquema vectorial editable.
- JSON: estado completo para volver a abrir en el taller.

Los archivos se crean en el navegador. El importador acepta JSON de hasta 2 MB, valida versión/tipos y ajusta dimensiones y coordenadas al espacio. La propuesta guarda una explicación escrita. No hay backend ni envío de diseños a otras personas.

## Color y composición

Color: elegir un color base, armonía monocromática/análoga/complementaria, cambiar el tono de cada una de seis prendas esquemáticas y agrupar por familias de color/claridad. El estado usa `vitrina-color-lab-v1`. Es una simulación gráfica; complementa las comparaciones fotográficas v4.

Composición: comparar protagonista, equilibrio y repetición sobre una isla esquemática de libros, perfumes, bolso, prendas y calzado. Cada modo cambia posiciones y tamaños de grupos y describe qué se observa.

Ninguna actividad completa automáticamente los temas. El alumno sigue confirmando comprensión con Sí/No; su progreso de curso se conserva en la clave anterior.

## Archivos

- `dist/taller.html`, `taller.css`, `taller.js`: interfaz y comportamiento.
- `dist/layout-model.js`: geometría, presets, normalización y análisis.
- `dist/layout-render.js`: representación SVG compartida con exportación.
- `dist/activities.js`: armonías de color y composiciones.
- `tests/layout-check.mjs`: límites, geometría, importación, coordenadas y paletas.
- `tests/check-all.mjs`: curso y taller.

Se verifican los modelos, vínculos, recursos y sintaxis. La revisión en navegador real/touch y las descargas PNG siguen pendientes de comprobación con un navegador permitido. El entorno gestionado no ofrece el controlador requerido; no se improvisa otra vía de navegador.

## Siguiente tarea

Revisar los ejercicios con Ricardo, afinar los ejemplos docentes y comprobar arrastre, teclado, tamaño móvil y exportación real. Los 13 videos siguen pendientes y esta actualización no genera clips nuevos.

