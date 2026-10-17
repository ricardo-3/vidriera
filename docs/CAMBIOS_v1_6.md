# Vidriera 1.6 · Escena estable, imagen y jerarquía

Fecha de sesión: 2026-10-16, America/Sao_Paulo. Base publicada: `06ed97368f3cb1c9f2368c55b917904753d11158` (1.5).

## Devolución y causas identificadas

Ricardo aportó dos capturas y señaló saltos debajo de la imagen al recorrer el contenido derecho. Pidió una capa izquierda estable, cambio de textos 1-3 sin modificar su geometría, imagen más amplia con bordes redondeados, jerarquía tipográfica y nombre VIDRIERA en negrita, sin punto. Valoró positivamente el recorrido por scroll; se conserva.

El detalle anterior entraba/salía del DOM y animaba max-height, padding y márgenes. Eso variaba la altura del elemento sticky y desplazaba sus controles inferiores. El seguimiento también dependía de texto con altura variable. El marco de foto tenía una altura impuesta y luego encajaba una imagen menor mediante cálculo JavaScript, dejando grandes espacios laterales. La animación del contenedor padre utilizaba transform/filter, que podía alterar la referencia del bloque sticky durante la entrada.

## Cambio

- Detalle siempre montado, con encabezado y cuerpo dentro de una ranura fija de 128 px en escritorio y 156 px en móvil. Los puntos 1-3 cambian únicamente el texto con un fundido de opacidad de 260 ms. El cierre mantiene la ranura con una indicación.
- La última explicación permanece al pasar a Entendé/Probá. Los cambios de punto no añaden/quitan paneles o controles.
- Comparación y detalle ocupan la misma ranura; barra de vistas en una sola fila de altura fija e indicador de lectura de 52 px. No hay animación de dimensiones ni anclaje de scroll en la columna izquierda.
- Imagen al ancho de un marco nativo 16:9, con esquinas redondeadas; se elimina el estado rect y su ResizeObserver. Los porcentajes de hotspots y comparador se calculan sobre ese mismo marco. La foto conserva el encuadre completo.
- El ancho del bloque fijo se adapta al alto útil del viewport para que sus controles sean visibles. En móvil y ventanas muy bajas, la escena participa del scroll normal de forma estable.
- Entrada de página solo por opacidad; los efectos de revelado de la lectura derecha se conservan.
- Marca visible VIDRIERA en peso 800, sin punto, en cabecera/pie, títulos de pestañas, diálogos, textos y nombres de descarga. La familia tipográfica se conserva. El título principal usa 40-64 px y mayor peso; encabezados de lectura 25-31 px, subtítulos 16 px y cuerpo 13-14 px, con ajustes móviles.

## Compatibilidad

Se mantienen proyecto y URL del Site, audiencia, once temas, orden, IDs, versión de datos 1 y claves de guardado vitrina-*. El cambio de nombre no invalida las propuestas ni el avance. Las 17 fotografías no se modifican; mantienen su rotulación original. Los documentos maestros y archivos históricos conservan el nombre anterior.

## Comprobación

Build de producción y `node tests/check-all.mjs`: progresión, lectura, guardas, datos, recursos, geometría, persistencia, cámara, sintaxis y componentes React renderizados en Node. Se añaden casos para la presencia permanente del detalle vacío y de los tres puntos, un único inspector por escena, marco sin geometría inline, vínculo entre puntos y panel, marca nueva e IDs únicos. Se verifica que las fotos no cambiaron.

Límite: el controlador de navegador exigido por Sites continúa ausente. Se revisaron las capturas aportadas y el código, pero no se ejecutó una reproducción real del scroll corregido, tacto o foco en navegador a 360 px/escritorio. Las pruebas de Node no certifican la sensación visual de ausencia de saltos. La exportación PNG sigue pendiente de prueba real.

## Pendientes

Comprobar con Ricardo la estabilidad de la escena en el navegador real, especialmente al cambiar 1/2/3, cerrar el detalle y alternar comparaciones. Mantener revisión docente, aprobación de recursos, calzado Mujer y 13 videos pendientes. El repositorio GitHub personal sigue sin identificarse; la fuente se guarda en el Git del Site. Commit y versión desplegada se registran en el cierre de Notion.
