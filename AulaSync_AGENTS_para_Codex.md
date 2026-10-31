# AGENTS.md — AulaSync / Instrucciones para Codex

## Contexto
Lee `docs/CONTEXTO_AULASYNC.md` antes de planificar o modificar el proyecto. Revisa también los documentos originales de `docs/` según necesidad. El usuario quiere avanzar incrementalmente con un MVP demostrable, sin reabrir todas las decisiones ya tomadas. Idioma de comunicación y documentación: español.

## Fase activa
**Incremento 1: prototipo visual navegable con datos ficticios.** Aún no se confirma implementación existente. Antes de crear archivos comprueba el repositorio y el entorno local. No afirmes que se implementó nada sin inspeccionarlo y probarlo.

## Stack
Next.js (App Router), React, TypeScript estricto, Tailwind, ESLint, shadcn/ui cuando ayude, FullCalendar estándar si aporta valor. Node LTS y npm. TSDoc para contratos/lógica. No exige motor de base de datos local.

## Diseño aprobado
- Escritorio: calendario **tipo Google Calendar**; columnas por días, filas por horas y bloques en sus intervalos y duraciones. Vista semanal principal; navegación de fecha y vistas.
- Clic en evento: **cuadro informativo flotante**; **no** ficha lateral fija.
- Móvil: tarjetas cronológicas y cuadrícula horaria intercambiables.
- Color visual por calendario de origen; no equivale a estados operativos.
- Título original siempre visible; aula/cantidad desconocidas muestran «Sin especificar»; no asumir cantidad 0.
- No fusionar eventos por coincidencia horaria. Mostrar informativos y ambiguos.

## No implementar todavía
No conectar Google Calendar API, OAuth, SQL/MySQL/PostgreSQL/Supabase, persistencia, backend de tareas, instalaciones/recojos operativos, alertas reales, inventario, colaboradores ni edición de eventos de Google. No simular guardados persistentes.

## Buenas prácticas
Contratos tipados y mocks en `src/data/mocks`; separar UI, dominio y acceso a datos con una interfaz/repository simple. Mantener módulos pequeños, nombres claros, documentación en español y código explicable a alguien que conoce Java. Evitar sobreingeniería.

## Calidad y entrega
Comprobar `npm run lint`, `npx tsc --noEmit` y `npm run build` cuando sea posible. Reportar pruebas ejecutadas y resultados reales. Incluir `README.md` con instrucciones y límites. No revelar credenciales ni copiar información real a mocks.

## Control de decisiones
Documento v0.10: RF/RN/EX aprobados; P-01 a P-20 y NF-01 a NF-07 siguen pendientes de aprobación. **Nunca convertir propuestas pendientes en decisiones aprobadas.** La vista de escritorio más reciente anula bocetos previos por aulas.
