# AulaSync · Prototipo visual

Frontend independiente en HTML, CSS y JavaScript, sin instalación de dependencias.

## Abrir

Desde la raíz del proyecto:

```powershell
node prototipo/server.cjs
```

Abre http://127.0.0.1:4173. También puedes abrir `index.html` directamente con un navegador. Detén el servidor con Ctrl+C.

## Qué probar

1. La demo comienza en la semana del 26 de octubre al 1 de noviembre de 2026.
2. Cambia entre Día, Semana y Agenda; usa las flechas y el calendario pequeño.
3. Filtra por calendario, aula, categoría o texto.
4. Abre los eventos del lunes a las 08:00: permanecen separados aunque compartan aula.
5. Abre los casos del viernes a las 10:00 y sábado a las 13:00: muestran discrepancias sin inventar cantidades.
6. Comprueba la ficha con teclado (Enter, Tab, Escape) y en teléfono. En pantalla pequeña se inicia en Agenda y se puede alternar a cuadrícula.
7. «Hoy» usa America/Lima. El botón de ayuda permite regresar a la semana demo.

## Datos y alcance

Los 30 eventos son ficticios. La estructura toma como referencia `calendarios`, `aulas`, `eventos_origen` y `requerimientos` del SQL. Se reproducen únicamente patrones de los eventos consultados: simultaneidad, instrucciones libres, discrepancias y cantidades ausentes. No se copian IDs, nombres de personas ni solicitudes reales.

No se conecta ni modifica Google Calendar ni MySQL. No hay autenticación, persistencia, estados operativos ni tareas reales. Las métricas resumen el período visible y los filtros activos. «Por revisar» comprende datos de clase incompletos, eventos por clasificar y discrepancias explícitas; no representa un estado operativo.

La fuente web es opcional; sin Internet se usan fuentes del sistema. Este prototipo permite validar diseño y comportamiento antes de trasladarlo al stack Next.js/TypeScript previsto. No sustituye la implementación final.
