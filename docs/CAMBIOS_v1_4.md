# Vitrina 1.4 · React y lenguaje espacial

Fecha: 2026-10-16. Base publicada: `f51285f806dc22095917a4aa75ad87be13d040ca` (1.3).

## Pedido y referencia

Ricardo pidió suavizar burbujas y transiciones, distinguir contenido y fondo y reemplazar cajas rígidas por componentes próximos a Apple TV. Autorizó React y aportó Meta Spatial SDK UI Set.

La documentación oficial describe componentes de Jetpack Compose para Android/Horizon OS. La web implementa una adaptación propia en React; no utiliza ni afirma utilizar una biblioteca React oficial de Meta.

Referencia: https://developers.meta.com/vr/documentation/spatial-sdk/spatial-sdk-ui-overview/

## Implementación

- React y Vite con salida estática; once páginas de tema y taller conservados.
- Componentes compartidos: Surface, Button/IconButton, Tabs, Field, Slider, Tooltip, FloatingDetail, Dialog, Toast y MotionSection.
- Vidrio claro, sombras de varias capas, contornos suaves y bordes redondeados aplicados a inicio, índice, capítulos, prácticas, cierre y taller.
- Presencia retenida en aperturas y cierres. Contenido con entrada de 520 ms y fotografías con fundido de 680 ms tras precargarse. No hay deformación ni cámara ficticia.
- Diálogos en portal React con Escape, cierre por fondo, foco inicial, Tab contenido, restauración del foco y fondo inerte durante apertura/cierre.
- Pestañas con flechas e Inicio/Fin. Hotspots con teclado, Escape y retorno al punto; lista de observación desplegable como alternativa de lectura.
- Comparadores con asa arrastrable, teclado y deslizador nativo. Imágenes completas y puntos ajustados al rectángulo real.
- Color y composición React sincronizados entre curso y taller. Otros nueve ejercicios en adaptadores React sobre sus modelos existentes.
- Planta React: arrastre, selector/teclado, dimensiones, giro, agregar/quitar, 45 cambios de deshacer/rehacer, recorrido/croquis, observación, importación/exportación JSON/SVG/PNG.
- Movimiento reducido para CSS, animaciones programadas y desplazamiento a apartados.

## Compatibilidad

Se conservan las 17 imágenes, IDs, orden pedagógico, DATA.version='1' y claves de guardado. S10 sigue como tema 8. Se mantienen la identidad y audiencia del Site.

Solo la confirmación explícita completa el tema activo. Exploración, scroll y prácticas no desbloquean temas. Repasar y revisitar conservan el avance. El cierre permite escribir y descargar la observación junto con borradores seleccionados.

## Comprobaciones

Compilación de producción mediante el helper de Sites, React y Vite. `node tests/check.mjs` comprueba progresión, No/revisitas, persistencia, datos inválidos, 17 recursos, 11 temas y 13 enlaces de transición. `node tests/check-all.mjs` añade geometría, importación, colisiones, coordenadas a distintos tamaños, paletas, composición, rutas y enlaces anteriores, guardas en todos los estados y sintaxis de módulos.

Las pruebas React renderizadas en Node comprueban tarjetas en todos los estados, panel activo, roles, vínculos ARIA, IDs únicos en cinco rutas, guardados anteriores y modelos compartidos de color/composición. Se comprueba su continuidad en memoria cuando falla el almacenamiento.

## Límites y pendientes

No se ejecutó navegador real: falta el controlador requerido por Sites. No hay capturas de esta versión ni comprobación visual efectiva a 360 px/escritorio. Quedan pendientes sensación del movimiento, encuadres efectivos, tacto, foco real y exportación PNG. El renderizado de componentes en Node no sustituye esas comprobaciones.

Los 13 videos siguen pendientes. Imágenes y explicaciones no se marcan aprobadas por el usuario; falta revisión docente. Calzado Mujer conserva la repisa baja pendiente. El plano es didáctico. IMG-13 es un moodboard ilustrativo; IMG-10 no muestra el interior de probadores.

La fuente se guarda en el Git canónico del Site. El repositorio personal de Vitrina en GitHub sigue sin identificarse. Siguiente tarea: revisión visual con Ricardo en un navegador permitido y ajustes basados en esa revisión.

El commit final y el identificador de versión desplegada se registran en el cierre de Notion después de publicar; el SHA no se incrusta en el mismo commit que lo genera.
