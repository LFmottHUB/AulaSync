# Colaborar en AulaSync

Este repositorio contiene un prototipo de HTML, CSS y JavaScript. El stack Next.js/TypeScript de los documentos históricos pertenece al desarrollo previsto, no a la aplicación actual. La demo sigue sin conectarse a Google Calendar ni MySQL.

## Preparar y validar

Con Node.js 24 y npm, desde la raíz:

```sh
npm ci
npm start
```

Abre http://127.0.0.1:4173. Para comprobar cambios:

```sh
npm run format
npm run format:check
npm run check:syntax
npm test
```

Prettier es una dependencia de desarrollo: abrir la demo y ejecutar las pruebas no exige instalarla. `node prototipo/server.cjs` y `node prototipo/verify.cjs` siguen disponibles. El workflow de GitHub ejecuta formato, sintaxis y pruebas. No hay compilación TypeScript ni build en este prototipo; comprobar sintaxis no sustituye un analizador semántico como ESLint.

En VS Code instala las extensiones recomendadas al abrir el proyecto. La configuración compartida aplica Prettier al guardar JavaScript, HTML, CSS y JSON.

## Dónde hacer cada cambio

| Archivo                 | Responsabilidad                                                    |
| ----------------------- | ------------------------------------------------------------------ |
| `prototipo/data.js`     | Contratos JSDoc, calendarios y eventos ficticios.                  |
| `prototipo/calendar.js` | Fechas de Lima, filtros y distribución de solapamientos; sin DOM.  |
| `prototipo/views.js`    | Plantillas HTML de cuadrícula, agenda y ficha; escape de texto.    |
| `prototipo/app.js`      | Estado de pantalla, controles, renderizado y diálogos.             |
| `prototipo/styles.css`  | Presentación visual y reglas responsive.                           |
| `prototipo/server.cjs`  | Servidor local con lista explícita de archivos públicos.           |
| `prototipo/verify.cjs`  | Regresiones de datos, fechas, filtros, solapamientos y plantillas. |

Los scripts clásicos se cargan con `defer` en el orden `data → calendar → views → app`. Se conservan para poder abrir `index.html` directamente sin bundler. Cada módulo expone una API con nombre y mantiene sus detalles dentro de una función envolvente. `app.js` coordina los módulos. No agregar dependencias de la lógica del calendario hacia la interfaz.

## Convenciones de lectura

- Usar dos espacios y Prettier, con ancho objetivo de 100 caracteres. Las cadenas indivisibles pueden superar ese ancho; no romper datos originales para cumplir una medida.
- Escribir una instrucción por línea. Usar llaves y bloques multilínea para `if`, `else` y bucles, incluso con una sola instrucción.
- Separar funciones y pasos conceptuales con una línea en blanco. Mantener juntas las instrucciones que realizan el mismo paso.
- Preferir nombres como `event`, `calendar`, `columnEndTimes` y `firstOfMonth` frente a abreviaturas difíciles de interpretar.
- Mantener funciones centradas en una responsabilidad. Extraer cálculo, filtrado o plantillas cuando mezclarlos dificulte entender el flujo; evitar abstracciones sin utilidad.
- Para eventos con muchos campos, usar propiedades con nombre en `makeEvent({ ... })`, no una lista de argumentos posicionales.
- Documentar el motivo de una regla y los contratos relevantes con JSDoc. No comentar cada instrucción obvia.
- Escapar texto dinámico antes de insertarlo en HTML. Los colores CSS se obtienen únicamente de la paleta local de confianza; validar cualquier fuente externa antes de incorporarla en un incremento futuro.
- Conservar `null` para cantidades y aulas desconocidas. Usar `??`, no `||`, cuando cero sea un valor válido.
- Mantener título original, calendario de origen e identidad de cada evento. No fusionar eventos coincidentes ni inventar tareas operativas.
- Incorporar pruebas de comportamiento al cambiar fechas, filtros o solapamientos. Cada caso debe poder ejecutarse de manera independiente.

Prettier automatiza el formato, pero no determina si una función tiene demasiadas responsabilidades ni introduce todos los saltos de línea conceptuales: esa parte requiere revisión del código.

## Relación con Clean Code

Se toman como guía los temas de Robert C. Martin sobre nombres que expresan intención, funciones con responsabilidades concretas, argumentos comprensibles, separación de efectos y formato vertical. Se aplican al tamaño y propósito de esta demo, sin imponer una arquitectura nueva ni límites arbitrarios de líneas por función.

Referencia consultada: [Clean Code, edición 2008, índice y vista pública en O'Reilly](https://www.oreilly.com/library/view/clean-code-a/9780136083238/), capítulos 2, 3 y 5. Se consultó el material público disponible, no el texto completo del libro. No se reproduce su contenido.

## Límites de las comprobaciones

Las pruebas de Node usan un doble mínimo del DOM: validan lógica y contenido generado, pero no apariencia, foco ni compatibilidad real de navegadores. Antes de integrar cambios de interfaz, comprobar escritorio y móvil, navegación, filtros, apertura/cierre de ficha con teclado y datos sin especificar. El SQL es material educativo separado; este flujo no ejecuta ni valida una base MySQL.
