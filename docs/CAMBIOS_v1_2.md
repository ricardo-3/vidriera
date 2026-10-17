# Vitrina 1.2 · Capítulos y práctica

Fecha: 2026-10-16. Base publicada al abrir: `0d96b8de2c939b983a5108c05948fc82af3be030` (versión 1.1, con taller).

## Cambios

- Una vista por tema, URL estable y compatibilidad con los enlaces previos. Índice con títulos, estados y navegación anterior/siguiente.
- Precarga y decodificación de imágenes, transiciones coordinadas y protección frente a navegación rápida. Se retiró la selección de tema por scroll.
- Guía de observación, ejemplos aplicados, errores frecuentes, síntesis y devolución de repaso.
- Once prácticas: marca, planta, ruta, composición editable, producto/soporte, facing, color, luz, vidriera, concepto y mejora.
- Guardados separados y descarga del brief, concepto y observaciones junto con la reflexión final.
- Taller 1.1 conservado. Composición ampliada con selección y controles de posición y escala.
- CSS específico de capítulos con diseño en una columna para pantallas pequeñas, sin escena fija que tape la lectura.

## Compatibilidad

Los IDs, el orden del curso, las 17 imágenes, el manifiesto, la audiencia y los datos de progreso conservan su identidad. La versión de paquete pasa a 1.2.0; la versión del estado del curso permanece en 1. Se mantiene `vitrina-course-v1`.

## Comprobado

- `node tests/check-all.mjs`: reglas del curso y taller; rutas y bloqueo en todos los estados de progreso; enlaces antiguos; datos anteriores; limpieza de borradores; referencias de módulos; reproductor con peticiones fuera de orden y movimiento reducido.
- Comprobación de sintaxis de los módulos JavaScript.
- Recursos y referencias DOM estáticas mediante los tests existentes, conservados.

## Límites y pendientes

La revisión real de la interfaz en navegador no se realizó: el entorno gestionado no ofrece el controlador requerido por Sites. Pendientes: revisión visual a 360 px/escritorio, teclado y tacto, controles de composición y descarga PNG real. Las comprobaciones de Node no acreditan esos comportamientos visuales.

Los nuevos textos son propuestas pendientes de revisión docente. Continúan pendientes calzado Mujer, aprobación final de imágenes y los 13 videos de continuidad. No se afirmó ninguna aprobación académica o del usuario.

GitHub: la conexión solo mostró acceso a `ricardo-3/porfolio`. Falta el repositorio de destino de Vitrina y acceso a él; no se copió el curso al portfolio. La fuente se guarda mediante el repositorio Git canónico del Site. La versión publicada y su SHA final se registran en Git y en el historial de Sites.

## Siguiente tarea

Revisión visual con Ricardo y ajuste de actividades; identificar y habilitar el repositorio de GitHub para copiar el código completo.
