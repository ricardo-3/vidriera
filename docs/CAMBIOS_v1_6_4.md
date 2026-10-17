> Corrección posterior: la incorporación a porfolio descrita en este registro se revirtió. Ricardo aclaró que el curso debe estar en el repositorio independiente ricardo-3/vidriera. El estado vigente está en CORRECCION_REPOSITORIO_2026_10_17.md.

# Vidriera 1.6.4 · Empezar el curso y publicación en porfolio

Fecha: 2026-10-17, America/Sao_Paulo. Base publicada: `4ff824db7307d0e7f8f983d404f58e70f3d65c8a` (1.6.3).

El botón principal del inicio dice **Empezar el curso** y abre S01, el primer tema. Conserva las confirmaciones y los borradores ya guardados. Los accesos generales de continuar o retomar mantienen su función. No se modifican imágenes, portada, paleta, tipografía ni secuencia de temas.

Se interpretó el mensaje anterior como un cambio de destino a `ricardo-3/porfolio`. Ricardo aclaró después que el destino correcto es el repositorio independiente `ricardo-3/vidriera`; por ello se revirtió esta incorporación. Se revisaron sus archivos, instrucciones, configuración y workflow: ya contiene un portfolio React/Vite publicado mediante GitHub Pages.

La integración se realiza mediante dos carpetas nuevas: `vidriera/` contiene el proyecto completo y `public/vidriera/` contiene su salida estática. Se preservan los archivos del portfolio. El workflow existente compila el portfolio, copia public y publica el curso como `/porfolio/vidriera/`. La fuente del curso y esa copia estática deben actualizarse juntas. El Site conserva su guardado local; la URL de GitHub Pages tiene un guardado independiente por pertenecer a otro origen.

La entrega incluye los 17 WebP originales, datos, ejercicios, taller, documentación, pruebas y compilación. Los objetos binarios se comprueban por SHA al cargarlos. La actualización de main conserva el historial y usa la versión previa esperada; no se fuerza la rama.

Validación: build de Sites, once páginas de tema y `node tests/check-all.mjs`; comprobaciones de las rutas, progreso, persistencia, fotografías y renderizado React. El commit y los resultados de publicación del Site y GitHub Pages se registran en el cierre de Notion. La revisión visual real en navegador sigue pendiente porque el controlador requerido por Sites no está disponible.

Siguiente tarea: revisar el botón desde ambos sitios y las imágenes en GitHub Pages, manteniendo la revisión docente y los pendientes de recursos y cámara ya documentados.
