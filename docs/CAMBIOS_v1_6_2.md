# Vidriera 1.6.2 · Miniaturas de Tu recorrido

Fecha de sesión: 2026-10-16, America/Sao_Paulo. Base publicada: `9b7f2e5d3e1a8679461344d7d38e72ac3b5c83d7` (1.6.1).

## Devolución y corrección

La captura de Ricardo muestra «Tu recorrido» con 11/11 temas completados: la primera miniatura aparece y las siguientes muestran iconos de imagen rota. La corrección 1.6.1 cubría StoreImage, pero LessonCards renderizaba sus fotos mediante img nativos con src relativos. Las vistas relacionadas, la atmósfera y el comparador también conservaban ese patrón.

Todos esos src ahora se resuelven con storeImageUrl y la base fija suministrada por StoreImageBase. Las once miniaturas reciben una URL absoluta que no cambia al navegar con History API ni al cargar de forma diferida desde una página de capítulo. Se añaden dimensiones intrínsecas a las miniaturas y se conserva su encuadre, carga diferida, formato de fila y jerarquía visual.

La comprobación HTTP autenticada de los archivos publicados permite distinguir recursos ausentes de problemas de resolución del cliente: las fotos de la captura responden con bytes WebP válidos. La dependencia de rutas relativas se elimina; no se afirma haber reproducido la secuencia exacta del fallo en un navegador.

## Validación

- Build de producción mediante el helper de Sites, con once páginas físicas de tema.
- `node tests/check-all.mjs`: progreso, guardados, ejercicios, geometría, recursos, sintaxis, cargador y renderizado React en Node.
- Prueba de los src realmente renderizados por LessonCards para los once temas en cada estado de progreso, tanto en raíz como en subdirectorio. Se comprueba su estabilidad al resolverlos desde URLs de capítulo e índice.
- Prueba de que todas las fotos renderizadas por App usan URLs absolutas en inicio, tema, índice, cierre y taller. Este caso habría detectado el alcance incompleto de la corrección anterior.
- Comparación de las 17 fotos de public y dist, sin modificar los recursos originales. La comprobación HTTP de las once fotos de tema se registra al cerrar en Notion.

No hay cambios en orden, selección de temas, estado de finalización, guardados ni audiencia. Los temas futuros siguen siendo miniaturas sin enlace. Curso y taller conservan sus claves independientes.

## Publicación y siguiente tarea

Corrección preparada como 1.6.2 e incorporada a la entrega 1.6.3; no se publicó por separado. La versión nativa, el commit exacto y el despliegue se registran en el documento maestro de Notion después de la publicación. README, INTERACTIVIDAD y PROMPT_CONTINUIDAD incluyen esta corrección.

La revisión visual real de las miniaturas con navegador sigue pendiente: el controlador requerido por Sites no está disponible en este entorno. La comprobación HTTP y el renderizado en Node no sustituyen esa revisión. Siguiente tarea: revisar «Tu recorrido» y el diálogo de miniaturas después de visitar un capítulo, al recargarlo y al volver con Atrás. Continúan los pendientes editoriales y de cámara documentados anteriormente.
