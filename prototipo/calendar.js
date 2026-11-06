'use strict';

/** Lógica pura: recibe datos y devuelve resultados, sin leer el DOM ni el estado de la UI. */
const AulaSyncCalendar = (() => {
  const TIME_ZONE = 'America/Lima';
  const DAYS_PER_WEEK = 7;
  const MINUTES_PER_HOUR = 60;

  // El mediodía de Lima evita cruzar la fecha al operar sobre el día UTC.
  function dateOf(isoDate) {
    return new Date(`${isoDate}T12:00:00-05:00`);
  }

  function keyOf(date) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  function addDays(isoDate, numberOfDays) {
    const date = dateOf(isoDate);
    date.setUTCDate(date.getUTCDate() + numberOfDays);

    return keyOf(date);
  }

  function monday(isoDate) {
    const weekday = dateOf(isoDate).getUTCDay();
    const daysSinceMonday = (weekday + 6) % DAYS_PER_WEEK;

    return addDays(isoDate, -daysSinceMonday);
  }

  function minutes(time) {
    const [hours, minutePart] = time.split(':').map(Number);

    return hours * MINUTES_PER_HOUR + minutePart;
  }

  function formatDate(isoDate, options) {
    return new Intl.DateTimeFormat('es-PE', { timeZone: TIME_ZONE, ...options }).format(
      dateOf(isoDate),
    );
  }

  function dateFor(event, firstMonday) {
    return addDays(firstMonday, event.dia);
  }

  function calendarOf(event, calendars) {
    return calendars.find((calendar) => calendar.id === event.calendarioId);
  }

  function needsReview(event) {
    const missingClassData =
      event.categoria === 'clase' && (event.cantidad === null || event.aula === null);

    return Boolean(event.revision || event.categoria === 'por_clasificar' || missingClassData);
  }

  function visibleDates(date, view) {
    const start = view === 'day' ? date : monday(date);
    const dayCount = view === 'day' ? 1 : DAYS_PER_WEEK;

    return Array.from({ length: dayCount }, (_, index) => addDays(start, index));
  }

  function matchesRoom(event, room) {
    if (!room) {
      return true;
    }

    return room === 'unknown' ? event.aula === null : event.aula === room;
  }

  /** Los filtros nunca alteran ni agrupan los eventos originales. */
  function filterEvents(events, calendars, filters, firstMonday) {
    const dates = visibleDates(filters.date, filters.view);
    const search = filters.search.toLocaleLowerCase('es');

    return events
      .filter((event) => {
        const calendar = calendarOf(event, calendars);
        const searchableText = `${event.tituloOriginal} ${event.aula ?? ''} ${calendar.nombre}`;

        return (
          dates.includes(dateFor(event, firstMonday)) &&
          filters.selected.has(event.calendarioId) &&
          matchesRoom(event, filters.room) &&
          (!filters.category || event.categoria === filters.category) &&
          searchableText.toLocaleLowerCase('es').includes(search)
        );
      })
      .sort(
        (first, second) =>
          dateFor(first, firstMonday).localeCompare(dateFor(second, firstMonday)) ||
          minutes(first.inicio) - minutes(second.inicio) ||
          first.id.localeCompare(second.id),
      );
  }

  function overlappingGroups(events) {
    const sorted = [...events].sort(
      (first, second) =>
        minutes(first.inicio) - minutes(second.inicio) || minutes(second.fin) - minutes(first.fin),
    );
    const groups = [];
    let currentGroup = [];
    let groupEnd = -1;

    for (const event of sorted) {
      if (minutes(event.inicio) >= groupEnd && currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
        groupEnd = -1;
      }

      currentGroup.push(event);
      groupEnd = Math.max(groupEnd, minutes(event.fin));
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }

  function placeGroupInColumns(group) {
    const columnEndTimes = [];
    const placements = group.map((event) => {
      let col = columnEndTimes.findIndex((endTime) => endTime <= minutes(event.inicio));

      if (col < 0) {
        col = columnEndTimes.length;
      }

      columnEndTimes[col] = minutes(event.fin);

      return { event, col };
    });

    return placements.map((placement) => ({ ...placement, columns: columnEndTimes.length }));
  }

  /**
   * Distribuye cada grupo de solapamiento en columnas sin fusionar eventos.
   * Los intervalos adyacentes pueden reutilizar columna: [08:00, 10:00) y [10:00, 12:00).
   * No modifica el arreglo recibido ni sus eventos.
   */
  function layoutEvents(events) {
    return overlappingGroups(events).flatMap(placeGroupInColumns);
  }

  return {
    dateOf,
    keyOf,
    addDays,
    monday,
    minutes,
    formatDate,
    dateFor,
    calendarOf,
    needsReview,
    visibleDates,
    filterEvents,
    layoutEvents,
  };
})();
