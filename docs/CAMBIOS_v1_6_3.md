# Vidriera 1.6.3 · Portada amplia y repositorio de destino

Fecha: 2026-10-17, America/Sao_Paulo. Base publicada: `9b7f2e5d3e1a8679461344d7d38e72ac3b5c83d7` (1.6.1). La corrección preparada como 1.6.2 se incluye en esta entrega; no se publicó por separado.

## Portada

Ricardo pidió que la imagen del inicio ocupara casi todo el componente y tuviera los bordes redondeados como las fotos del curso. Se elimina la franja de imagen situada a la derecha y sus grandes márgenes. El marco utiliza una cuadrícula con la foto a todo el ancho y un margen de 8 px; la imagen conserva su proporción 16:9 y su encuadre completo. Las esquinas internas tienen 28 px de radio. La tarjeta de texto flota sobre la foto en escritorio.

En tablet y móvil se apilan foto, tarjeta y pie. La foto mantiene su proporción y todo el encuadre, con un margen de 7 px y esquinas de 20 px en móvil. La composición ya no depende de una altura fija y una imagen estrecha encajada dentro de ella. La familia tipográfica, el contenido y la paleta se conservan. La implementación está en src/styles/home.css, importada después de los estilos existentes.

## Miniaturas incluidas

Se incorpora la corrección de docs/CAMBIOS_v1_6_2.md: las miniaturas de «Tu recorrido», las vistas relacionadas, el comparador y las atmósferas usan URLs absolutas desde la base fija del Site. Las pruebas comprueban los src realmente renderizados para once temas y todos los estados de avance. La verificación HTTP previa de las once fotos publicadas devolvió 200, imágenes decodificables de 1600 × 900 y bytes idénticos a los originales.

## Comprobación y compatibilidad

Build de producción con el helper de Sites y once páginas generadas. Se ejecuta node tests/check-all.mjs, que incluye datos, recursos, sintaxis, orden, guardados, prácticas, taller, cargador y componentes React en Node. La portada utiliza encuadre completo sin generar ni editar las 17 fotografías. Se conserva el avance y los borradores anteriores, así como el orden Curso VM → Explora el local → El taller.

Límite: el controlador de navegador requerido por Sites sigue sin estar disponible. No se certifica una revisión visual real de la portada y las miniaturas a 360 px/escritorio, teclado o movimiento reducido. Se revisó la captura de Ricardo y la estructura de código y estilos.

## GitHub y publicación

Ricardo proporcionó https://github.com/ricardo-3/vidriera.git, un repositorio público nuevo y vacío. Se confirmó su existencia. El intento de crear README.md devolvió 403, «Resource not accessible by integration». La conexión de GitHub está configurada para repositorios seleccionados y la lista accesible solo contiene ricardo-3/porfolio. No se escribió en ese repositorio ajeno al pedido.

La subida a vidriera requiere que Ricardo lo añada a los repositorios permitidos de la integración de GitHub. El proyecto completo queda preparado y guardado en el Git del Site; se genera una copia ZIP de la fuente de entrega. Esto no equivale a una publicación en GitHub Pages. Se publica el Site existente con su identidad, manifiesto y audiencia actuales. El commit y la versión nativa se registran en el cierre de Notion.

Siguiente tarea: habilitar vidriera en la integración, subir esta fuente al repositorio y comprobar su commit. No es necesaria otra autorización para escribir: el usuario ya solicitó esa subida. Continúan pendientes la revisión visual real, la revisión docente, calzado Mujer y los clips de cámara.
