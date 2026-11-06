# AulaSync

Prototipo visual de calendario académico y consulta de requerimientos de equipos.

## Ejecutar la demo

Requiere Node.js. No necesita instalar dependencias.

```sh
node prototipo/server.cjs
```

Abre http://127.0.0.1:4173. Para detenerlo, pulsa Ctrl+C.

## Validar

```sh
node --check prototipo/app.js
node --check prototipo/server.cjs
node prototipo/verify.cjs
```

## Contenido

- `prototipo/`: frontend HTML, CSS y JavaScript con datos ficticios; calendario semanal/diario, agenda móvil, filtros y fichas flotantes. Consulta su [README](prototipo/README.md).
- `base_calendario.sql`: esquema MySQL educativo de referencia; no se ejecuta ni se conecta desde la demo.
- `AulaSync_*.md`: contexto, alcance e instrucciones de desarrollo originales.

La demo no conecta con Google Calendar ni guarda datos. El stack Next.js/TypeScript de los documentos corresponde al desarrollo previsto; el prototipo actual permite revisar primero la experiencia visual.

## Mantenimiento y legibilidad

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para conocer los módulos, las convenciones de código y las comprobaciones. El código usa bloques multilínea y formato compartido:

```sh
npm ci
npm run format
npm run format:check
npm run check:syntax
npm test
```

Las herramientas de formato son opcionales para ejecutar la demo. No hay dependencias de producción.
