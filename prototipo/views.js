'use strict';

/** Plantillas HTML. Solo la capa app.js modifica el DOM y controla los diálogos. */
const AulaSyncViews = (() => {
  const { minutes, formatDate, layoutEvents } = AulaSyncCalendar;
  const GRID_START_HOUR = 6;
  const GRID_END_HOUR = 23;
  const PIXELS_PER_MINUTE = 1;
  const MINUTES_PER_HOUR = 60;
  const VERTICAL_EVENT_INSET = 2;
  const HORIZONTAL_EVENT_INSET = 3;
  const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
  }

  // Estos colores proceden exclusivamente de la paleta local de confianza.
  function colorStyle(calendar) {
    return `--color:${calendar.color};--bg:${calendar.bg};--ink:${calendar.ink};--edge:${calendar.edge}`;
  }

  function createViews({ calendars, categories, firstMonday }) {
    const calendarOf = (event) => AulaSyncCalendar.calendarOf(event, calendars);
    const dateFor = (event) => AulaSyncCalendar.dateFor(event, firstMonday);

    function eventSummary(event) {
      if (event.categoria !== 'clase') {
        return categories[event.categoria];
      }

      if (event.cantidad === null) {
        return 'Cantidad sin especificar';
      }

      const equipment = calendarOf(event).equipo?.toLowerCase() ?? 'equipos';

      return `${event.cantidad} ${equipment}`;
    }

    function gridEventHtml({ event, col, columns }) {
      const calendar = calendarOf(event);
      const top = (minutes(event.inicio) - GRID_START_HOUR * MINUTES_PER_HOUR) * PIXELS_PER_MINUTE;
      const duration = (minutes(event.fin) - minutes(event.inicio)) * PIXELS_PER_MINUTE;
      const position = [
        `top:${top + VERTICAL_EVENT_INSET}px`,
        `height:${duration - VERTICAL_EVENT_INSET * 2}px`,
        `left:calc(${(100 * col) / columns}% + ${HORIZONTAL_EVENT_INSET}px)`,
        `width:calc(${100 / columns}% - ${HORIZONTAL_EVENT_INSET * 2}px)`,
      ].join(';');
      const label = `${event.tituloOriginal}, ${event.inicio} a ${event.fin}, ${calendar.nombre}`;

      return `
        <button class="event" data-event="${escapeHtml(event.id)}"
          aria-label="${escapeHtml(label)}" style="${colorStyle(calendar)};${position}">
          <span class="event-time">${escapeHtml(event.inicio)} – ${escapeHtml(event.fin)}</span>
          <strong>${escapeHtml(event.tituloOriginal)}</strong>
          <span class="event-meta">${escapeHtml(eventSummary(event))}</span>
          <span class="event-calendar">${escapeHtml(calendar.nombre)}</span>
          ${event.revision ? '<span class="review-dot">◇ Revisar</span>' : ''}
        </button>
      `;
    }

    function dayHeadingHtml(date, selectedDate) {
      return `
        <div class="day-heading ${date === selectedDate ? 'highlight' : ''}">
          <span>${formatDate(date, { weekday: 'short' })}</span>
          <strong>${Number(date.slice(-2))}</strong>
        </div>
      `;
    }

    function timeLabelsHtml() {
      return Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, index) => {
        const hour = String(GRID_START_HOUR + index).padStart(2, '0');
        const top = index * MINUTES_PER_HOUR * PIXELS_PER_MINUTE + 8;

        return `<span class="time-label" style="top:${top}px">${hour}:00</span>`;
      }).join('');
    }

    function dayColumnHtml(events, date, selectedDate) {
      const dayEvents = events.filter((event) => dateFor(event) === date);
      const eventCards = layoutEvents(dayEvents).map(gridEventHtml).join('');

      return `
        <div class="day-column ${date === selectedDate ? 'highlight' : ''}">
          ${eventCards}
        </div>
      `;
    }

    function gridHtml(events, dates, selectedDate, view) {
      const height = (GRID_END_HOUR - GRID_START_HOUR) * MINUTES_PER_HOUR * PIXELS_PER_MINUTE;
      const headings = dates.map((date) => dayHeadingHtml(date, selectedDate)).join('');
      const columns = dates.map((date) => dayColumnHtml(events, date, selectedDate)).join('');

      return `
        <div class="calendar-scroll">
          <div class="week-grid ${view === 'day' ? 'daily' : ''}" style="--days:${dates.length}">
            <div class="day-headings">
              <div class="corner">GMT−5</div>
              ${headings}
            </div>
            <div class="time-grid" style="height:${height}px">
              <div class="time-labels">${timeLabelsHtml()}</div>
              ${columns}
            </div>
          </div>
        </div>
      `;
    }

    function agendaEventHtml(event) {
      const calendar = calendarOf(event);
      const room = event.aula ?? 'Aula sin especificar';
      const reviewLabel = event.revision ? ' · ◇ Revisar' : '';

      return `
        <button class="agenda-event" data-event="${escapeHtml(event.id)}"
          style="${colorStyle(calendar)}">
          <span class="agenda-time">${escapeHtml(event.inicio)} – ${escapeHtml(event.fin)}</span>
          <span class="agenda-dot"></span>
          <span>
            <strong>${escapeHtml(event.tituloOriginal)}</strong>
            <small>${escapeHtml(calendar.nombre)} · ${escapeHtml(room)}${reviewLabel}</small>
          </span>
          <span class="agenda-category">${escapeHtml(categories[event.categoria])}</span>
        </button>
      `;
    }

    function agendaHtml(events, dates) {
      const days = dates.map((date) => {
        const dayEvents = events.filter((event) => dateFor(event) === date);

        if (dayEvents.length === 0) {
          return '';
        }

        return `
          <h3 class="agenda-date">
            ${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          ${dayEvents.map(agendaEventHtml).join('')}
        `;
      });

      return `<div class="agenda">${days.join('')}</div>`;
    }

    function reviewNoticeHtml(event) {
      if (event.revision) {
        return `
          <div class="review-notice">
            <strong>◇ Requiere revisión</strong><br>${escapeHtml(event.revision)}
          </div>
        `;
      }

      if (event.categoria === 'por_clasificar') {
        return `
          <div class="review-notice">
            Interpretación pendiente. No se ha generado ninguna tarea de instalación.
          </div>
        `;
      }

      return '';
    }

    function detailFieldHtml(label, value) {
      return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value ?? 'Sin especificar')}</dd></div>`;
    }

    function eventDetailsHtml(event) {
      const calendar = calendarOf(event);
      const date = formatDate(dateFor(event), {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const fields = [
        ['Aula', event.aula],
        ['Categoría', categories[event.categoria]],
        ['Requerimiento', calendar.equipo],
        ['Cantidad', event.cantidad],
      ];

      return `
        <article class="event-details">
          <div class="source-label" style="${colorStyle(calendar)}">
            <i></i>${escapeHtml(calendar.nombre)}
          </div>
          <h2 id="dialog-title">${escapeHtml(event.tituloOriginal)}</h2>
          <div class="detail-date">
            ${date}<br>${escapeHtml(event.inicio)} – ${escapeHtml(event.fin)} · America/Lima
          </div>
          <dl class="detail-fields">
            ${fields.map(([label, value]) => detailFieldHtml(label, value)).join('')}
          </dl>
          <p class="detail-description">${escapeHtml(event.descripcionOriginal || 'Sin descripción adicional.')}</p>
          ${reviewNoticeHtml(event)}
          <div class="dialog-footnote">
            DATOS FICTICIOS · El título original se conserva íntegro.<br>
            Este evento es independiente de otros que coincidan en aula u horario.
          </div>
        </article>
      `;
    }

    return { gridHtml, agendaHtml, eventDetailsHtml };
  }

  function emptyStateHtml() {
    return `
      <div class="empty">
        <span style="font-size:30px">▦</span>
        <strong>No hay eventos en este período</strong>
        <p>Prueba otra fecha o ajusta los filtros.</p>
        <button id="reset-demo" class="primary-button">Ver semana demo</button>
      </div>
    `;
  }

  return { createViews, escapeHtml, emptyStateHtml };
})();
