'use strict';

/** Coordinación de la interfaz: estado transitorio, DOM y eventos del usuario. */
const { DEMO_DATE, calendars, events, categories } = AulaSyncData;
const { dateOf, keyOf, addDays, monday, formatDate, needsReview } = AulaSyncCalendar;
const { escapeHtml, emptyStateHtml } = AulaSyncViews;
const demoMonday = monday(DEMO_DATE);
const views = AulaSyncViews.createViews({ calendars, categories, firstMonday: demoMonday });
const selectElement = (selector) => document.querySelector(selector);
const state = {
  date: DEMO_DATE,
  view: matchMedia('(max-width:600px)').matches ? 'agenda' : 'week',
  selected: new Set(calendars.map((calendar) => calendar.id)),
  search: '',
  room: '',
  category: '',
  miniMonth: DEMO_DATE.slice(0, 7) + '-01',
};

function dateFor(event) {
  return AulaSyncCalendar.dateFor(event, demoMonday);
}

function visibleDates() {
  return AulaSyncCalendar.visibleDates(state.date, state.view);
}

function visibleEvents() {
  return AulaSyncCalendar.filterEvents(events, calendars, state, demoMonday);
}

function renderMini() {
  const firstOfMonth = state.miniMonth.slice(0, 7) + '-01';
  const start = monday(firstOfMonth);
  const range = visibleDates();
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    const classes = [
      date.slice(0, 7) !== firstOfMonth.slice(0, 7) ? 'other' : '',
      range.includes(date) ? 'range' : '',
      date === state.date ? 'selected' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <button data-date="${date}" class="${classes}"
        aria-label="${formatDate(date, { dateStyle: 'full' })}">
        ${Number(date.slice(-2))}
      </button>
    `;
  });

  selectElement('#mini-title').textContent = formatDate(firstOfMonth, {
    month: 'long',
    year: 'numeric',
  });
  selectElement('#mini-calendar').innerHTML = days.join('');
}

function renderFilters() {
  const dates = visibleDates();

  selectElement('#calendar-filters').innerHTML = calendars
    .map((calendar) => {
      const count = events.filter(
        (event) => event.calendarioId === calendar.id && dates.includes(dateFor(event)),
      ).length;

      return `
      <label class="calendar-check" style="--cal:${calendar.color}">
        <input type="checkbox" data-calendar="${escapeHtml(calendar.id)}"
          ${state.selected.has(calendar.id) ? 'checked' : ''}>
        <span>${escapeHtml(calendar.nombre)}</span>
        <span class="count">${count}</span>
      </label>
    `;
    })
    .join('');
}

function render() {
  const items = visibleEvents();
  const dates = visibleDates();
  selectElement('#date-title').textContent =
    state.view === 'day'
      ? formatDate(state.date, { day: 'numeric', month: 'long', year: 'numeric' })
      : `${Number(dates[0].slice(-2))} – ${formatDate(dates[6], { day: 'numeric', month: 'long', year: 'numeric' })}`;
  selectElement('#event-count').textContent = items.length;
  selectElement('#room-count').textContent = new Set(
    items.map((event) => event.aula).filter(Boolean),
  ).size;
  selectElement('#calendar-count').textContent = state.selected.size;
  selectElement('#review-count').textContent = items.filter(needsReview).length;
  selectElement('#footer-count').textContent = `${items.length} eventos · America/Lima`;
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === state.view);
    button.setAttribute('aria-pressed', String(button.dataset.view === state.view));
  });
  let content = emptyStateHtml();
  if (items.length > 0) {
    content =
      state.view === 'agenda'
        ? views.agendaHtml(items, dates)
        : views.gridHtml(items, dates, state.date, state.view);
  }

  selectElement('#calendar-content').innerHTML = content;
  renderMini();
  renderFilters();
  const scroller = selectElement('.calendar-scroll');
  if (scroller) {
    scroller.scrollTop = 55;
  }
}

function openEvent(id) {
  const event = events.find((candidate) => candidate.id === id);

  if (!event) {
    return;
  }

  const calendar = AulaSyncCalendar.calendarOf(event, calendars);
  selectElement('#dialog-accent').style.background = calendar.color;
  selectElement('#dialog-content').innerHTML = views.eventDetailsHtml(event);
  selectElement('#event-dialog').showModal();
}

function resetDemo() {
  state.date = DEMO_DATE;
  state.miniMonth = DEMO_DATE.slice(0, 7) + '-01';
  state.selected = new Set(calendars.map((calendar) => calendar.id));
  state.search = '';
  state.room = '';
  state.category = '';
  selectElement('#search').value = '';
  selectElement('#room-filter').value = '';
  selectElement('#category-filter').value = '';
  render();
}

function handleDocumentClick(domEvent) {
  const eventButton = domEvent.target.closest('[data-event]');
  const dateButton = domEvent.target.closest('[data-date]');
  const viewButton = domEvent.target.closest('[data-view]');

  if (eventButton) {
    openEvent(eventButton.dataset.event);
  }

  if (dateButton) {
    state.date = dateButton.dataset.date;
    render();
  }

  if (viewButton) {
    state.view = viewButton.dataset.view;
    render();
  }

  if (domEvent.target.closest('#reset-demo')) {
    resetDemo();
  }
}

function bindFilters() {
  selectElement('#calendar-filters').addEventListener('change', (domEvent) => {
    const id = domEvent.target.dataset.calendar;

    if (!id) {
      return;
    }

    if (domEvent.target.checked) {
      state.selected.add(id);
    } else {
      state.selected.delete(id);
    }

    render();
  });

  selectElement('#all-calendars').addEventListener('click', () => {
    state.selected = new Set(
      state.selected.size === calendars.length ? [] : calendars.map((calendar) => calendar.id),
    );
    render();
  });

  selectElement('#search').addEventListener('input', (domEvent) => {
    state.search = domEvent.target.value;
    render();
  });

  selectElement('#room-filter').addEventListener('change', (domEvent) => {
    state.room = domEvent.target.value;
    render();
  });

  selectElement('#category-filter').addEventListener('change', (domEvent) => {
    state.category = domEvent.target.value;
    render();
  });
}

function bindNavigation() {
  for (const [selector, delta] of [
    ['#previous', -1],
    ['#next', 1],
  ]) {
    selectElement(selector).addEventListener('click', () => {
      const stepInDays = state.view === 'day' ? 1 : 7;
      state.date = addDays(state.date, delta * stepInDays);
      state.miniMonth = state.date.slice(0, 7) + '-01';
      render();
    });
  }

  selectElement('#today').addEventListener('click', () => {
    state.date = keyOf(new Date());
    state.miniMonth = state.date.slice(0, 7) + '-01';
    render();
  });

  for (const [selector, delta] of [
    ['#mini-prev', -1],
    ['#mini-next', 1],
  ]) {
    selectElement(selector).addEventListener('click', () => {
      const date = dateOf(state.miniMonth);
      date.setUTCMonth(date.getUTCMonth() + delta);
      state.miniMonth = keyOf(date);
      renderMini();
    });
  }
}

function closeDialogOnBackdropClick(domEvent, dialog) {
  if (domEvent.target !== dialog) {
    return;
  }

  const bounds = dialog.getBoundingClientRect();
  const outsideDialog =
    domEvent.clientX < bounds.left ||
    domEvent.clientX > bounds.right ||
    domEvent.clientY < bounds.top ||
    domEvent.clientY > bounds.bottom;

  if (outsideDialog) {
    dialog.close();
  }
}

function bindDialogs() {
  selectElement('#close-dialog').addEventListener('click', () => {
    selectElement('#event-dialog').close();
  });

  selectElement('#help-button').addEventListener('click', () => {
    selectElement('#help-dialog').showModal();
  });

  selectElement('#close-help').addEventListener('click', () => {
    selectElement('#help-dialog').close();
  });

  selectElement('#demo-week').addEventListener('click', () => {
    resetDemo();
    selectElement('#help-dialog').close();
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (domEvent) => closeDialogOnBackdropClick(domEvent, dialog));
  });
}

function bindControls() {
  document.addEventListener('click', handleDocumentClick);
  bindFilters();
  bindNavigation();
  bindDialogs();
}

function initialize() {
  const roomSelect = selectElement('#room-filter');
  [...new Set(events.map((event) => event.aula).filter(Boolean))]
    .sort()
    .forEach((room) => roomSelect.add(new Option(room, room)));
  render();

  bindControls();
}

initialize();
