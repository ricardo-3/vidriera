# Vidriera 1.6.1 · Menú y fotografías del local

Fecha de sesión: 2026-10-16, America/Sao_Paulo. Base publicada: `e8fbd8c9ca858c862ae77852f649260f78421935` (1.6).

## Pedido y cambios

Ricardo pidió ordenar la cabecera como **Curso VM → Explora el local → El taller** y corregir las fotos de la exploración. El orden y esos rótulos se mantienen en inicio, curso, índice, cierre y taller. Curso VM conserva el inicio/retorno al recorrido con sus guardas de avance. En móvil, el menú pasa a una segunda fila y conserva sus tres opciones; se elimina la regla que ocultaba la exploración.

Las 17 fotografías existen tanto en public como en dist, son WebP válidos de 1600 × 900 y no se modificaron. No se encontró una ausencia de archivos. Los registros disponibles del Site tampoco devolvieron errores del Worker en los 30 minutos consultados; eso no descarta fallos del cliente.

El visor anterior no comprobaba la carga inicial ni ofrecía reintento y notificaba una foto lista antes de cargarse. El visor compartido ahora resuelve cada ruta contra la base fija del Site, incluida la exploración en un portal después de navegar a un capítulo. Descarga y decodifica la imagen antes de insertarla, conserva la anterior durante la espera, cancela solicitudes atrasadas y muestra un componente de recuperación con reintento ante error o espera de 15 segundos. También comprueba errores de la imagen insertada. Los puntos de observación esperan a que la foto esté lista. Se conserva el fundido de fotografías y la alternativa de movimiento reducido.

## Comprobaciones

- Compilación de producción con el helper de Sites y once páginas de tema generadas.
- `node tests/check-all.mjs`, incluido `tests/check.mjs`, sintaxis, progreso, persistencia, prácticas, taller y componentes React renderizados en Node.
- Pruebas del cargador usado por el visor: primera foto, decodificación, error, reintento, caché y cambios rápidos con cargas canceladas o fuera de orden.
- Las 17 fotos resuelven desde las 13 entradas físicas (inicio, taller y once temas), en raíz y subdirectorio; archivos de public y dist idénticos byte por byte. Decodificación real de los WebP con Pillow.
- Renderizado de las 14 posiciones del recorrido, navegación principal en cinco rutas, IDs HTML únicos y comprobación de que no quedan reglas móviles que oculten la exploración.

Límite: no está disponible el controlador de navegador requerido por Sites. Estas comprobaciones no reproducen el fallo reportado en el navegador del usuario ni certifican la presentación a 360 px/escritorio, tacto, foco o movimiento reducido. La comprobación visual real de la exploración publicada sigue pendiente.

## Publicación y continuidad

Paquete 1.6.1. Se mantiene el Site existente, audiencia, manifiesto, once temas, orden, IDs, datos versión 1 y guardados vitrina-*. El commit exacto, la versión nativa y el despliegue se registran en el cierre del documento maestro de Notion después de publicar. La fuente y este documento forman parte del mismo commit de entrega.

Siguiente tarea: comprobar la exploración publicada con Ricardo desde Curso VM y desde El taller, al avanzar, retroceder y recargar una página de tema. Continúan pendientes la revisión docente, la aprobación de recursos, calzado Mujer, los 13 clips reales y la revisión de PNG del taller. El repositorio GitHub personal aún no está identificado; la fuente se conserva en el Git del Site.
