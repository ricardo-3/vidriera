# Vitrina 1.5 · Recorrido guiado y paleta gris

Fecha: 2026-10-16. Base publicada: `f68e1c15f385e547c231e0130bd3e65657165a17` (1.4).

## Cambios solicitados

Ricardo aclaró que elegir capítulos mediante botones no resolvía la interacción deseada. Pidió recorrer cada tema mediante scroll, mantener miniaturas como vista previa discreta y evitar seleccionar temas sin completarlos. Aportó la referencia visual SAFE·CORE SET 027, que se inspeccionó directamente; solicitó sus colores y estética conservando la tipografía.

## Recorrido

Se eliminan las pestañas Observá/Entendé/Probá, la botonera superior de temas, el índice permanente durante un capítulo y la acción de siguiente situada fuera de la lectura. Cada tema conserva su URL, pero se presenta en tres secciones verticales con revelado suave. Se utiliza el scroll normal del navegador, sin capturar la rueda ni impedir que el usuario retroceda.

La escena permanece al lado de la lectura en escritorio. La posición de los puntos observados acompaña el scroll y abre la explicación correspondiente. Los hotspots, comparadores y ejercicios siguen admitiendo interacción directa. En móvil la escena precede a la lectura continua para no bloquear el área de contenido.

La confirmación aparece al alcanzar el final de la práctica. Un observador y una medida de posición cubren tanto el scroll gradual como llegar con Fin/PageDown. El estado de lectura es transitorio y no escribe completados. El manejador de confirmación verifica tema y ruta activos; después de «Sí, entendí» completa solo ese tema y permite el siguiente.

Las miniaturas se consultan al final, sin enlaces a temas futuros ni al tema pendiente. Solo los completados permiten revisitar. Inicio conserva una única acción para entrar/retomar y un acceso discreto a la vista previa. Las rutas anteriores y sus guardas se conservan.

## Estética

Paleta de interfaz basada en gris cálido claro `#e8e4e2`, fondo gris `#c4beba`, grafito/negro `#232120` y superficies ahumadas. Se retiran los acentos verdes del sistema visual. Se conserva exactamente la familia tipográfica anterior. Los colores de prendas y paletas del laboratorio siguen representando el ejercicio cromático; las 17 fotografías no se alteran.

Se mantienen componentes, profundidad, bordes suaves, transparencia, enfoque accesible y alternativa de movimiento reducido. Los paneles de lectura son claros; la escena y el seguimiento combinan grafito y vidrio ahumado.

## Comprobaciones y límites

Compilación de producción, `node tests/check.mjs` y `node tests/check-all.mjs`: curso, guardados, geometría, recursos, rutas, cámara, sintaxis y componentes React renderizados en Node. Se añaden pruebas del cálculo de lectura, confirmación restringida al tema activo al final, ausencia de avance por scroll y miniaturas navegables solo si están completadas, para todos los estados del curso. Se comprueba la secuencia de las secciones y la aparición condicionada de confirmación y vista previa.

El controlador de navegador requerido por Sites sigue sin estar disponible. No se afirma revisión visual o táctil efectiva, prueba de foco real ni comprobación de la sensación del movimiento a 360 px/escritorio. Las pruebas de Node no sustituyen esa revisión. La descarga PNG sigue pendiente de prueba real.

## Conservado y próximo paso

Mismo Site y audiencia, 17 fotografías, IDs, orden pedagógico y claves de guardado, sin invalidar avances anteriores. S10 sigue como tema 8. Las confirmaciones no son evaluación académica. Las 13 transiciones de cámara continúan sin videos; los efectos actuales son de interfaz y fotografías.

Imágenes y textos siguen pendientes de aprobación/revisión docente; continúa pendiente la repisa baja de calzado Mujer. Las medidas de la planta son didácticas. El Git del Site guarda la fuente; el repositorio GitHub personal de Vitrina aún debe identificarse.

Siguiente tarea: revisar con Ricardo el nuevo recorrido y los materiales de interfaz en un navegador permitido. El commit de publicación y la versión desplegada se registran en el cierre de Notion.
