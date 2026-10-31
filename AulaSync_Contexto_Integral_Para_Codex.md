# AULASYNC — CONTEXTO INTEGRAL PARA CODEX

**Documento de transferencia de contexto — 31 de octubre de 2026**  
**Estado:** especificación funcional avanzada; comienzo del incremento 1; **no hay implementación de AulaSync confirmada**.  
**Idioma del proyecto y documentación:** español. **Zona horaria funcional:** `America/Lima`.

> **Instrucción principal para Codex:** Lee íntegramente este archivo y, cuando estén disponibles, los documentos de referencia adjuntos. Trabaja exclusivamente en el incremento 1 salvo autorización explícita para ampliar el alcance. No confundas funcionalidades aprobadas *para el producto completo* con funcionalidades que deban programarse *ahora*. No inventes decisiones sobre asuntos pendientes de aprobación.

## 1. Propósito del proyecto

**AulaSync** es una aplicación web adaptable a escritorio y teléfono (con perspectiva de PWA) destinada a facilitar el trabajo de preparación y retiro de equipos en aulas universitarias. Los secretarios gestionan los horarios en **calendarios de Google Calendar independientes**. Inicialmente el usuario de AulaSync puede **consultar**, pero **no editar**, los eventos originales.

El producto final permitirá visualizar las actividades, reconocer el aula y equipamiento requerido, anotar datos operativos propios, gestionar instalaciones y recojos, agrupar manualmente requerimientos de una clase, mantener equipos entre clases consecutivas o vinculadas, recibir avisos internos y conocer el progreso de cada jornada.

**Principio no negociable:** Google Calendar es la fuente de *programación*; AulaSync mantiene por separado las *decisiones y acciones operativas*. Nunca escribir, modificar o eliminar eventos en los calendarios de secretaría. No inferir que un evento equivale automáticamente a una clase académica o una instalación.

**Usuario inicial:** una sola persona. Más adelante podrían añadirse compañeros con permisos de visualización; no implementar colaboración multiusuario todavía.

## 2. Estado real y punto de partida

- Análisis funcional: existe documento consolidado `AulaSync_Etapa1_Requisitos_Reglas_Excepciones_v0.10.txt` (95 RF, 35 RN, 24 EX, 22 CA; también P-01 a P-20 y NF-01 a NF-07 pendientes de aprobación). Estos códigos son la numeración canónica; numeraciones de mensajes anteriores eran provisionales.
- Plan de trabajo: `AulaSync_Plan_Incremental_MVP_v0.1.txt`, con **7 incrementos**.
- Modelo de datos conceptual completo: **18 tablas propuestas**, documento `AulaSync_Incremento1_Modelo_Datos_Propuesto_v0.1.txt`. Existen diagramas y SQL completos MySQL de referencia.
- Existe un esquema **educativo y temporal de 4 tablas**: `AulaSync_Incremento1_MySQL_Simple_v0.1.sql`. No constituye la base de datos definitiva, ni debe conectarse al incremento 1 por defecto.
- **Desarrollo de AulaSync:** 0 % confirmado; no hay repositorio, dependencias ni aplicación ejecutable verificados en la conversación. No presumir que el código ya existe ni sobrescribir un repositorio existente.
- Última evaluación de **madurez de planificación de la Etapa 1**: aproximadamente 65 %, estimación cualitativa, NO avance de software.
- Entorno del usuario: **Windows**, VS Code, extensiones de VS Code y Git instalados; MySQL Workbench instalado (no equivale a MySQL Server). El usuario solicitó instrucciones para Node.js LTS, pero aún **no ha confirmado** que Node y npm funcionen. Verificar `node -v`, `npm -v`, `git --version` antes de iniciar. No exigir motor de base de datos.

**Importante:** algunas propuestas de interfaz anteriores quedaron sustituidas por una decisión posterior explícita: la versión de escritorio será similar a **Google Calendar**, no una cuadrícula principal por aulas. Ver sección 6.

## 3. Stack y decisiones arquitectónicas

### Tecnología prevista

- **Lenguaje principal:** TypeScript. React con componentes `.tsx`.
- **Framework:** Next.js con App Router.
- **Estilos:** Tailwind CSS.
- **Componentes UI:** shadcn/ui cuando aporte valor; iconos Lucide.
- **Calendario:** preferencia por FullCalendar estándar (`dayGrid`/`timeGrid`) u otra implementación compatible y sencilla; NO depender de funcionalidades premium de calendario de recursos. Antes de instalar confirmar compatibilidad y términos vigentes.
- **Ejecución local:** Node.js LTS y npm.
- **Editor/versionado:** Visual Studio Code, Git, GitHub cuando el usuario disponga de un repositorio.
- **Calidad:** TypeScript en modo estricto, ESLint, formato consistente, TSDoc y posteriormente TypeDoc. Código claro para alguien familiarizado con **Java 1.8**: contratos por interfaces, responsabilidades separadas, nombres explícitos, evitar sobreingeniería y explicar conceptos nuevos.
- **Integración futura:** Google Calendar API en modo solo lectura, con autorización apropiada (incremento 2).
- **Persistencia futura:** la propuesta inicial fue Supabase/PostgreSQL (incremento 3); también se diseñaron scripts MySQL a solicitud del usuario. **Motor definitivo no ratificado.** No fijar MySQL como dependencia obligatoria de I1 ni afirmar que la decisión de PostgreSQL/MySQL está cerrada.
- **Despliegue futuro:** Vercel, HTTPS, posible PWA, de acuerdo con necesidades y alcance.

### Arquitectura sugerida

Monolito modular en Next.js: `app/` para rutas, `components/` para presentación, `features/` para dominios, `types/` para contratos, `data/mocks/` para datos ficticios y `repositories/` para una capa intercambiable de acceso a datos. En I1 se usa repositorio mock en memoria; en incrementos posteriores podrá reemplazarse por adaptadores para Google Calendar y base de datos **sin rehacer las vistas**. No establecer infraestructura compleja ni backend prematuro.

### Principios permanentes

1. Conservar identidades y textos originales de eventos.
2. Clasificar por **ID de calendario**, nunca solo por color; colores son visuales, independientes de estados de operación.
3. Cantidad desconocida = `null`/«Sin especificar», **no cero**.
4. Modelar separadamente **evento original, clase académica, requerimiento de equipo, bloque de instalación, tarea operativa y recojo**.
5. La agrupación automática está prohibida: se pueden sugerir coincidencias, el usuario confirma.
6. Los cambios/confirmaciones operativas son manuales y registran historial cuando exista persistencia.
7. Alertas y cálculos no equivalen a confirmación física.
8. Las tareas pendientes de aprobación NO se convierten automáticamente en funcionalidad aprobada.

## 4. Contexto de los calendarios de origen

Los calendarios que utiliza el personal de secretaría representan distintos tipos de equipamiento. Sus nombres conocidos (los IDs reales se obtendrán únicamente en I2 y deben almacenarse, no inventarse) son:

| Calendario | Significado operativo |
|---|---|
| `A Móvil Cursos` | Laptops para cursos |
| `A Móvil Eventual` | Laptops para necesidades ocasionales |
| `E Bloomberg` | Equipos/PC con Bloomberg preinstalado |
| `E Ecran` | Ecran/pantalla |
| `E Proyectores` | Proyectores |
| `E TOA Amplificador` | Amplificador TOA |
| `OTROS` | Políticas, audífonos, micrófonos y requerimientos diversos |
| `Días feriados en Perú` / `Holidays in Peru` | Información, **no instalaciones** |

Los títulos y descripciones son **inconsistentes**: algunos empiezan por una cantidad seguida del aula y nombre del curso, otros no incluyen aula o cantidad, otros son instrucciones libres como «Apoyar en biblioteca» o «Abrir laboratorio», y a veces contienen referencias como ABTutor o códigos irrelevantes. Debe conservarse el título original y extraerse información solo con evidencia suficiente. Eventos ambiguos quedan «Por clasificar». Los informativos se muestran sin tareas ni alertas operativas automáticas.

Un evento puede aparecer en la misma fecha y horario que otro sin referirse a la misma clase; ni siquiera una coincidencia de aula y horario permite fusionar automáticamente. Dos calendarios podrían representar laptops y proyectores **de una única clase**, pero solo después de que el usuario confirme la relación.

## 5. Modelo conceptual de datos a largo plazo

El esquema de **18 entidades** sigue siendo una **propuesta técnica**, útil como guía de estructura; I1 NO crea estas tablas:

1. `calendarios`: ID de Google, nombre, color, categoría y tipo de equipo por defecto.
2. `eventos_origen`: identidad/ocurrencia, calendario, título/descripcion original, fechas y sincronización.
3. `interpretaciones_evento`: clasificación y campos detectados/corregidos sin alterar evento.
4. `aulas`: códigos/nombres.
5. `clases`: unidad académica, horario, aula, estado.
6. `clase_evento`: asociación confirmada entre clases y eventos de origen.
7. `tipos_equipo`: laptops, proyector, ecran, Bloomberg, amplificador, otros.
8. `requerimientos`: equipo y cantidad opcional por clase y evento fuente.
9. `aperturas_aula`: una apertura inicial por aula y fecha.
10. `bloques_instalacion`: instalaciones físicas que pueden atender varias clases.
11. `bloque_clase`: clases manualmente vinculadas a un bloque.
12. `equipos_instalados`: cantidades reales por bloque/tipo de equipo.
13. `tareas_operativas`: instalación, adicional, preparación, recojo, estado y jornada original.
14. `notas`: anotaciones internas de AulaSync.
15. `avisos_internos`: avisos programados y vistos.
16. `historial_cambios`: auditoría de correcciones y acciones.
17. `configuracion_alertas`: anticipaciones configurables.
18. `ejecuciones_sincronizacion`: éxito/error/tiempo de sincronización.

**Relaciones críticas:** calendario 1:N eventos; evento 0..1 interpretación; clase N:M eventos (manual); clase 1:N requerimientos; bloque N:M clases; bloque 1:N equipos físicos; bloque 1:N tareas, pero **un solo recojo final por bloque**. Las cantidades opcionales deben permitir `null`. El horario se presenta en `America/Lima`, almacenando instantes de forma inequívoca en la implementación definitiva.

**Referencia SQL simplificada (solo aprendizaje):** `aulasync_i1` con `calendarios`, `aulas`, `eventos_origen`, `requerimientos`. El esquema simplificado no separa todavía clases académicas de eventos y no es migración de producción. NO instalar ni ejecutar SQL como prerrequisito para desarrollar el frontend I1.

## 6. DISEÑO VISUAL APROBADO — sustituye bocetos anteriores

### Escritorio: experiencia tipo Google Calendar

Este diseño fue elegido expresamente por el usuario y prevalece sobre las propuestas anteriores:

- Pantalla principal con **cuadrícula horaria**, días en columnas y horas en filas, similar a la vista semanal/diaria de Google Calendar; eventos como bloques posicionados según **fecha, hora de inicio, duración y solapamientos**.
- Navegación por fecha (anterior/siguiente/hoy) y selector de vistas diaria, semanal y, cuando corresponda, mensual; los controles pueden implementarse gradualmente en I1.
- Cada evento mantiene un color visual relacionado con su calendario de origen, pero **no usar ese color para significar pendiente/completado**.
- **Al pulsar/clicar un evento se abre una ficha informativa flotante/contextual** (popover, o diálogo accesible donde el tamaño de pantalla lo aconseje), similar a la ficha de evento de Google Calendar. **NO una ficha lateral fija**.
- Datos de la ficha: **título original exacto**, fecha y horas, aula o «Sin especificar», calendario de origen, tipo de requerimiento, cantidad si es conocida, detalles descriptivos, categoría informativo/por clasificar cuando aplique. Eventualmente anotaciones y estados propios cuando estén implementados en incrementos posteriores.
- Evitar copiar logos, marcas o diseño pixel a pixel; objetivo es que la experiencia de uso resulte familiar, no replicar exactamente el producto de Google.
- La vista por aulas puede ofrecerse como filtro o mejora futura, **pero no sustituye la cuadrícula de días/horas aprobada como principal en escritorio**.

### Móvil

- **Dos vistas intercambiables:** tarjetas cronológicas y cuadrícula de calendario adaptada a pantalla pequeña (desplazamiento horizontal si es necesario).
- Ambas comparten los mismos datos y abren la ficha del evento.
- Fecha y filtros deben mantenerse al alternar vistas.
- No ocultar eventos meramente informativos por defecto.

### Usabilidad

- Mostrar todos los eventos de calendarios seleccionados, con filtros opcionales por aula, calendario, fecha y actividad.
- Mostrar simultáneos sin fusionarlos; eventos sin aula deben seguir visibles.
- La ficha se puede cerrar, debe ser legible y operable con teclado/tacto.
- Responsive y accesibilidad básica: jerarquía legible, foco visible, etiquetas, no depender únicamente del color.
- Todas las pantallas de I1 usan **datos ficticios inequívocamente identificados**.

## 7. INCREMENTO 1 — objetivo exacto y límites

**Nombre:** prototipo visual navegable. **Es la tarea actual de Codex.**

### Objetivo de entrega

Una aplicación Next.js que el usuario pueda ejecutar localmente, navegar por un horario simulado y abrir fichas de eventos. En escritorio debe usar el diseño tipo Google Calendar. En móvil deben poder alternarse tarjetas y cuadrícula. NO requiere cuentas, Google Calendar real, backend de persistencia ni servidor SQL.

### Funcionalidades que SÍ se pueden implementar en I1

1. Crear el proyecto Next.js con App Router, TypeScript estricto, Tailwind CSS, ESLint, estructura `src/`.
2. Desarrollar una página principal tipo calendario **semanal por defecto**, con vista diaria; vista mensual si la librería estándar lo permite sin gran esfuerzo. Respetar zona horaria de Lima en datos simulados y etiquetas visibles.
3. Navegar por fechas: Hoy, Anterior, Siguiente; elegir fecha/vista.
4. Mostrar datos ficticios tipados en `data/mocks/`: calendarios identificados, eventos, aulas, tipos de equipos y requerimientos opcionales.
5. Mostrar intervalos reales dentro de la cuadrícula, solapamientos y eventos del mismo horario por separado.
6. Colorear los eventos según calendario mock, sin codificar estados con esos colores.
7. Abrir **popover/ficha flotante** con información detallada de un evento, cerrable.
8. Implementar vista móvil de **tarjetas ordenadas cronológicamente** y alternativa de cuadrícula; alternancia visible y funcional.
9. Implementar filtros básicos por calendario, aula y categoría si no complican innecesariamente I1. El filtro no altera datos subyacentes.
10. Manejar de forma ilustrativa: cantidad ausente, aula ausente, evento ambiguo, informativo y eventos de equipamientos distintos que podrían corresponder a una misma clase SIN fusionarlos.
11. Incluir un `README.md` con requisitos de ejecución, comandos, estructura, supuestos y límites. Documentar con TSDoc las interfaces/funciones relevantes.
12. Ejecutar las verificaciones que el entorno permita: lint, typecheck y build; si algo falla, corregir o informar la limitación.

### Funcionalidades que NO se deben construir en I1

- No OAuth real, Google Calendar API, conexión a calendarios personales ni credenciales.
- No MySQL/PostgreSQL, Supabase, ORM, migraciones SQL ni endpoints de escritura.
- No persistencia de notas, cambios, agrupaciones, aperturas o estados tras recargar.
- No crear instalaciones/recojos reales, notificaciones reales ni lógica operacional avanzada.
- No simular un botón «Guardar» que dé a entender persistencia sin existir.
- No atribuir las actividades mock a secretaría real ni identificar nombres/IDs reales.
- No inventario, no colaboración multiusuario, no notificaciones push, no edición de Google Calendar.

### Casos mock sugeridos

Crea eventos inventados, por ejemplo en una semana de prueba:

- `A Móvil Cursos`: título `20, A-201, Ingeniería Clínica`, 08:00-10:00, aula A-201, 20 laptops.
- `E Proyectores`: título `A-201, Ingeniería Clínica`, mismo periodo, 1 proyector o cantidad no indicada; **evento separado**.
- `A Móvil Cursos`: `12, A-202, Estadística`, 09:00-11:00.
- `E Bloomberg`: `Práctica Bloomberg`, aula A-203, cantidad desconocida (`null`).
- `OTROS`: `Apoyar en biblioteca`, sin aula/cantidad, clasificado informativo.
- Otro evento `Por clasificar` con título libre, sin inferencias peligrosas.
- Un par de eventos solapados y uno con fecha diferente para comprobar navegación.

Los ejemplos deben tener IDs mock únicos y horarios consistentes. Si se utiliza hora del sistema como referencia, evitar que una semana fija de 2026 parezca vacía al abrir la app en otra fecha: generar datos ficticios cercanos a la fecha actual local o fijar explícitamente una fecha de demostración y mostrarla como tal. No escribir ninguna información en Google.

### Contratos de datos sugeridos (diseño, adaptables)

```ts
export type CategoriaEvento = 'clase' | 'informativo' | 'por_clasificar' | 'otro';

export interface CalendarioOrigen {
  id: string; // ID mock en I1; no fingir Google ID real
  nombre: string;
  color: string;
  categoria: 'equipamiento' | 'informativo';
}

export interface Aula {
  id: string;
  codigo: string;
  nombre?: string;
}

export interface Requerimiento {
  id: string;
  eventoId: string;
  tipoEquipo: string;
  cantidad: number | null; // desconocido != 0
}

export interface EventoOrigen {
  id: string;
  calendarioId: string;
  tituloOriginal: string;
  descripcionOriginal?: string | null;
  inicio: string; // ISO 8601 con zona/offset en datos de ejemplo
  fin: string;
  aulaId: string | null;
  categoria: CategoriaEvento;
}
```

Estas interfaces de I1 son una **propuesta**, no deben impedir evolucionar hacia modelo académico/operativo desacoplado. Si se crean objetos `Clase` ficticios para representación, separarlos explícitamente de `EventoOrigen` y no agrupar automáticamente.

### Estructura modular sugerida

```text
aulasync/
├─ README.md
├─ AGENTS.md                         # instrucciones para Codex (si se instala)
├─ docs/
│  └─ CONTEXTO_AULASYNC.md
└─ src/
   ├─ app/
   │  ├─ layout.tsx
   │  ├─ page.tsx
   │  └─ globals.css
   ├─ components/
   │  ├─ calendario/
   │  ├─ eventos/
   │  └─ movil/
   ├─ features/
   │  ├─ calendario/
   │  └─ horarios/
   ├─ data/
   │  └─ mocks/
   ├─ repositories/
   │  ├─ HorarioRepository.ts
   │  └─ MockHorarioRepository.ts
   ├─ lib/
   └─ types/
```

Simplificar carpetas si son innecesarias en la primera entrega; preferir código mantenible a una estructura vacía y excesiva. La capa de repositorio debe permitir trocar mocks por datos reales después.

### Criterios de aceptación de I1

- [ ] La aplicación arranca localmente (`npm run dev`) sin BD ni claves de Google.
- [ ] En escritorio la cuadrícula semanal muestra días/horas y bloques correctamente posicionados.
- [ ] Cambiar fecha y alternar vista diaria/semanal funciona.
- [ ] Clicar un evento abre su **ficha flotante** correcta; cerrar funciona.
- [ ] Un evento simultáneo de otro calendario continúa separado.
- [ ] Los datos originales de ejemplo (título, calendario, horarios) aparecen sin alteraciones.
- [ ] Cantidad/aula desconocida se muestra «Sin especificar», nunca `0` por defecto.
- [ ] Los eventos informativos y ambiguos son visibles.
- [ ] En móvil se alternan tarjetas y cuadrícula; el diseño es legible.
- [ ] Sin flujos de autenticación, guardado operativo, SQL ni conexiones externas.
- [ ] Se entregan instrucciones para reproducirlo, y resultados de comprobaciones.

## 8. Hoja de ruta: los siete incrementos

| Incremento | Objetivo | Entregable |
|---|---|---|
| **I1 (actual)** | Interfaz con mocks, escritorio tipo Google Calendar, popover y móvil dual | Demo visual navegable |
| **I2** | Autorización segura de solo lectura, importación de Google Calendar, IDs/colores/recurrencias, interpretación tentativa y sincronización sin duplicados | Demo privada con eventos reales |
| **I3** | Persistencia de notas, correcciones, apertura manual, instalación general y física, clase completada manual, un recojo único y confirmación manual | Primer MVP básico para clases independientes |
| **I4** | Agrupación confirmada, vincular clases pegadas, comparación de cantidades reales, adicionales de laptops/equipos, dejar continuar, recojo final | Flujo de continuidad de equipos |
| **I5** | Alertas internas configurables, avisos para adicionales, pendientes atrasados por jornada, próximos días y porcentajes académico/operativo | MVP operativo demostrable |
| **I6** | Preparación anticipada del día anterior, cruces de jornadas, cancelaciones, cambios de origen y revisiones | Escenarios complejos controlados |
| **I7** | Pruebas integrales, robustez, seguridad y respaldos, documentación, despliegue HTTPS privado, PWA si procede | Piloto listo para probar |

**Nota:** se aplicarán controles mínimos de seguridad y anti-duplicación desde I2/I3 aunque las pruebas más amplias queden para I7. No postergar seguridad elemental a producción.

## 9. Reglas de negocio ya aprobadas para incrementos posteriores (NO implementar todas ahora)

### 9.1. Interpretación y agrupaciones

- Fuente de verdad del horario: Google Calendar en solo lectura. ID de calendario identifica tipo de equipo; el color es meramente visual.
- El título original nunca se reemplaza por la extracción/corrección local. Si falta aula/cantidad, mostrar «Sin especificar».
- Un evento ambiguo se marca «Por clasificar», no crea tarea de instalación automática.
- Eventos informativos, incluidos feriados, no generan instalaciones ni alertas operativas y no cuentan académicamente.
- Si diferentes calendarios podrían referirse a una clase común, solo **sugerir** agrupación por curso, fecha, aula, horario, etc.; **requiere confirmación manual**. No basta coincidencia horaria.
- Clase agrupada cuenta **una vez** académicamente pero conserva requerimientos y eventos originales separados y rastreables. Permitir deshacer/corregir agrupaciones.

### 9.2. Apertura

- **Una hora de apertura inicial por aula y fecha/jornada**, registrada manualmente; no hay un estado obligatorio «Aula abierta».
- Si no existe hora registrada, mostrar literalmente **«Apertura sin definir»**, sin inventar hora ni generar aviso de apertura.
- La hora de apertura es referencia de cuándo se puede comenzar a instalar, no confirmación de que el aula esté efectivamente libre; no bloquea consulta ni confirmación de instalación.

### 9.3. Estados e instalaciones

- Diferenciar estado académico de clase, estado general de instalación y estado de recojo. Una clase no se completa automáticamente al terminar su horario.
- Una clase con varios requerimientos tiene **un único estado general de instalación**, sin obligar estados por equipo. Solo marcar «Instalado» manualmente cuando todos estén colocados.
- Registrar cantidad de laptops requeridas y cantidad **físicamente** instalada; se permite instalación parcial y se conserva el faltante.
- Si llega un nuevo requerimiento confirmado a una instalación completada, conservar lo realmente instalado y su historial; generar una tarea adicional, marcar «Requiere completar» hasta reconfirmación; no duplicar recojo ni añadir equipo a recojo hasta instalarlo de verdad.
- Confirmaciones incorrectas deben poder rectificarse dejando rastro y reevaluando tareas relacionadas.

### 9.4. Clases pegadas, adicionales y un solo recojo

- Clases compartiendo aula y equipos pueden vincularse **manualmente** incluso con un intervalo entre ellas.
- Mantener todos los equipos colocados hasta la **última clase vinculada**. No retirar tipos sobrantes en una clase intermedia; no crear recojos parciales automáticos.
- Comparar cantidad física de laptops existente con cantidad requerida de la siguiente clase: faltante positivo = tarea adicional por diferencia; si alcanza, opción **«Dejar continuar»**.
- Ejemplo **20 → 28 → 25 laptops** en clases vinculadas: instalar 20, generar adicional **+8** antes de la segunda, dejar continuar en tercera, **un único recojo final**.
- Si la clase siguiente necesita un tipo nuevo de equipo, generar tarea adicional separada.
- Confirmar una instalación crea **un único recojo pendiente por bloque**; su hora se basa en el fin de la clase, o de la última clase vinculada. Confirmar recojo siempre manualmente, guardando fecha/hora **del sistema en el momento de confirmar** y no una supuesta hora física previa.
- Si se supera hora prevista sin confirmar, marcar «Atrasado» y duración del atraso. No recoger automáticamente. Tareas atrasadas conservan jornada original y se muestran en «Pendientes atrasados» de jornadas siguientes, sin contaminar avance del nuevo día.
- Recojo temprano permitido si ya no existen otras clases vinculadas que necesiten los equipos.

### 9.5. Preparación anticipada y domingo

- Evaluar **por aula** primera clase del día siguiente. Preparar día anterior solo cuando esa primera clase empieza a las **08:00** (NO 09:00). El viernes puede prepararse el sábado; domingo tiene excepción operativa de preparación manual y no debe excluirse de actividades.
- Turnos conocidos del usuario: viernes de **15:00 a 22:30**, sábado de **07:30 a 16:00**. Domingo: carga baja y frecuentemente solo 2 personas. La preparación extraordinaria de sábado para domingo puede extenderse como referencia hasta aproximadamente **18:00** si se organiza manualmente, no asumir que este es el turno estándar.
- Si se confirmó el viernes una instalación para sábado, el sábado se muestra «Instalado desde el día anterior», sin reconfirmación. Misma instalación física y bloque. La clase académica del sábado sí se completa manualmente.
- La preparación completada cuenta para el día de preparación; el recojo futuro pertenece a la fecha en que corresponde y solo aparece allí como pendiente; «Próximos días» permite consultarlo antes.

### 9.6. Alertas y progreso

**Valores iniciales aprobados, todos editables:**

| Alerta interna | Anticipación |
|---|---|
| Próxima apertura (si se registró hora manual) | **60 minutos antes** |
| Inicio académico de clase | **10 minutos antes** |
| Preparar laptops adicionales | **30 minutos antes** de terminar la clase anterior |
| Segundo aviso para instalar adicionales | **Al finalizar** la clase anterior, cuando aula esté disponible |
| Recojo previsto | **15 minutos antes** |

- Solo avisos **dentro** de AulaSync para el MVP; sin garantizar push con app cerrada.
- Al cambiar horarios o completarse tareas, reevaluar/cancelar avisos correspondientes.
- Instalación no confirmada después de inicio de clase: destacar «Instalación sin confirmar — inicio de clase superado», sin notificación adicional por defecto ni presunción sobre situación física.
- Porcentaje **académico** y **operativo** son distintos; clases cuentan solo por confirmación manual, eventos informativos no cuentan; adicionales no crean nuevas clases.
- Los pendientes anteriores se consultan aparte y no afectan avance operativo de jornada posterior.

### 9.7. Cancelaciones y cambios de Google

- Desaparición de todo un evento de Google tras sincronización: «Posible cancelación» para revisión, no cancelar/borrar sin intervención manual.
- Si desaparece **uno** de los eventos de equipamiento agrupados, conservar la clase, el resto de requerimientos y cualquier equipo ya instalado; mostrar «Revisar requerimiento» del evento afectado. Verificar que no sea un fallo de sincronización/acceso.
- Si aparece nuevo evento potencialmente relacionado con una clase, sugerir agrupación y requerir confirmación manual.
- Cancelación manual lógica, reversible y con historial; los equipos ya instalados siguen sujetos a recojo si corresponde.
- Cambio de aula después de instalación: **fuera del MVP** la gestión física de traslado; señalar revisión sin inventar movimientos de equipos.

## 10. Pendientes explícitos: NO convertir en aprobación

El documento funcional v0.10 contiene **P-01 a P-20** y **NF-01 a NF-07**. Mantenerlos en backlog de decisiones; no bloquear I1 por estos puntos. Prioritarios cuando proceda:

- P-01 (I3): recojo para equipos parcialmente instalados cuando nunca se completa instalación general.
- P-02 (I2): estrategia exacta de identidades/recurrencias y protección frente a duplicaciones tras sincronizar.
- P-03 (I2): verificar falla/red/credenciales antes de interpretar una ausencia como borrado.
- P-04 (I6): reversión de cancelación con movimientos físicos históricos ya confirmados.
- P-05 a P-20: restantes escenarios documentados; no reabrir todos de golpe.
- NF-01 a NF-07: decisiones de requisitos no funcionales a validar por fase (seguridad, respaldo, accesibilidad, fiabilidad, usabilidad móvil, pruebas y documentación). Los mínimos técnicos para proteger datos reales no son opcionales.

**No hacer nuevas entrevistas interminables.** Cuando surja una decisión no esencial para I1, usa una implementación reversible y registra supuesto/pendiente. Pide confirmación solo si cambia sustancialmente alcance o comportamiento aprobado.

## 11. Guía concreta de cómo debe trabajar Codex

1. **Inspeccionar el directorio actual primero.** Si ya existe un proyecto, leer su estructura y cambios sin sobrescribir trabajo. Si no existe, crear un Next.js nuevo con opciones TypeScript, App Router, Tailwind, ESLint, `src/` y npm.
2. Verificar versiones locales y dependencias. **No asumir** Node instalado hasta verificarlo. En Windows usar CMD o `npm.cmd` si hay bloqueo `npm.ps1` en PowerShell, sin desactivar seguridad global.
3. Presentar antes de grandes cambios un plan breve, archivos que se crearán y criterios de prueba; después ejecutar el alcance acordado, evitando pedir aprobación por cada detalle menor.
4. Construir primero contratos tipados y datos mock; después vista escritorio, ficha flotante y móvil; luego filtros, navegación y correcciones UX.
5. Mantener lógica de filtrado/transformaciones separada de componentes; no duplicar datos entre vistas.
6. Conservar el código legible, funciones pequeñas, nombres explícitos, comentarios TSDoc en lógica relevante y componentes accesibles.
7. No añadir estado operativo falso ni persistencia aparente. Si hay controles no activos, señalarlos honestamente o no mostrarlos.
8. Ejecutar `npm run lint`, `npx tsc --noEmit` y `npm run build` si el entorno permite (o los comandos equivalentes del proyecto). Documentar resultados exactos, sin afirmar pruebas no ejecutadas.
9. Al terminar, informar qué archivos cambió, cómo iniciar la app, qué se puede probar, qué falta y qué queda reservado para I2/I3.
10. Preferir que la aplicación sea demostrable pronto sobre añadir abstracciones innecesarias o funciones futuras.

## 12. Prompt corto para darle a Codex junto con este documento

> Lee `AGENTS.md` y `docs/CONTEXTO_AULASYNC.md` (o este documento si aún no está dentro del repositorio). Estás trabajando en **AulaSync, incremento 1**. Verifica primero qué existe en el repositorio y las versiones de Node/npm. Necesito una demo Next.js/React/TypeScript con datos mock, calendario de escritorio estilo Google Calendar en vista semanal (días/hora y eventos proporcionados por horario), clic en evento que abre ficha flotante, navegación de fechas y vistas; en móvil tarjetas cronológicas y cuadrícula intercambiables. Usa Tailwind, prioriza accesibilidad y código claro para un desarrollador habituado a Java. Conserva título original, origen y cantidad desconocida como `null`; muestra informativos y ambiguos sin inventar tareas, sin agrupar automáticamente eventos. **No conectar MySQL, PostgreSQL, Supabase ni Google Calendar; no implementar instalación/recojo/alertas reales ni persistencia.** Crea README y comprueba lint, tipos y build. Explica brevemente cambios y cómo probar el prototipo.

---

## 13. Archivos de referencia adjuntos al paquete

- `docs/AulaSync_Etapa1_Requisitos_Reglas_Excepciones_v0.10.txt` — fuente canónica de RF/RN/EX/CA y pendientes.
- `docs/AulaSync_Plan_Incremental_MVP_v0.1.txt` — secuencia de siete incrementos.
- `docs/AulaSync_Incremento1_Modelo_Datos_Propuesto_v0.1.txt` — 18 tablas conceptuales.
- `docs/AulaSync_Incremento1_MySQL_Simple_v0.1.sql` — esquema educativo temporal de cuatro tablas (NO ejecutar para I1 por defecto).
- `docs/AulaSync_MySQL8_Esquema_v0.1.sql` — propuesta MySQL ampliada para referencia futura (NO ejecutar para I1).
- `docs/AulaSync_Diagrama_ER_Mermaid_v0.1.mmd` — diagrama editable del modelo largo.

### Prioridad ante contradicciones

1. **Última decisión expresa:** escritorio similar a Google Calendar con ficha **flotante**, no panel fijo ni cuadrícula principal por aulas.
2. Requisitos y reglas **[APROBADO]** del documento v0.10.
3. Alcance **I1** del plan incremental (lo aprobado para I2–I7 NO se construye en I1).
4. Modelo de datos y SQL como material **propuesto**, no arquitectura definitiva ya instalada.
5. Cuestiones **[PENDIENTE DE APROBACIÓN]** y **[FUTURO]** no aprobadas ni implementables automáticamente.

**Fin del contexto.**
