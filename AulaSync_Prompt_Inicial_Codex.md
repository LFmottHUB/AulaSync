# Primer mensaje para Codex — AulaSync Incremento 1

Lee `AGENTS.md` y `docs/CONTEXTO_AULASYNC.md` antes de comenzar. También tienes documentos funcionales originales de referencia en `docs/`.

Quiero desarrollar **AulaSync, incremento 1**, una demo navegable de calendario académico/operativo usando **datos ficticios**. Soy desarrollador familiarizado con Java; necesito explicaciones claras, código TypeScript organizado y comentarios TSDoc cuando corresponda.

1. Inspecciona primero si existe un proyecto; no sobrescribas nada. Comprueba Node/npm/Git y, si no existe, crea un proyecto Next.js App Router + React + TypeScript + Tailwind + ESLint.
2. Construye una **vista de escritorio similar a Google Calendar**: calendario semanal con columnas por día, horas y eventos representados según su intervalo/duración; navegación entre fechas y vista diaria. Colorea eventos por el calendario de origen.
3. Al pulsar un evento, abre una **ficha flotante** con título original, fecha/horas, aula, calendario, requerimientos y cantidades opcionales; nunca panel lateral fijo.
4. En móvil ofrece **tarjetas cronológicas y cuadrícula horaria intercambiables**.
5. Usa tipos y datos mock realistas, pero no información personal, credenciales ni calendarios reales. Incluye eventos de varios calendarios, evento informativo, evento ambiguo, cantidad nula, aula desconocida y simultaneidad sin fusionar.
6. Separa contratos, datos y componentes; agrega README. Prioriza buen funcionamiento y diseño legible por encima de funcionalidades futuras.
7. Ejecuta las comprobaciones disponibles de lint, TypeScript y build; explícame cómo correr y probar localmente el resultado.

**Restricción de alcance:** no instalar/conectar MySQL, PostgreSQL, Supabase ni Google Calendar en I1. No implementar persistencia, agrupaciones reales, instalaciones, recojos ni notificaciones internas todavía. Esas funciones son de incrementos posteriores.
