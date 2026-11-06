const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

/** Doble mínimo de DOM: no sustituye las pruebas visuales en navegador. */
function createDemo() {
  const elements = new Map();

  function element(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        textContent: '',
        innerHTML: '',
        style: {},
        dataset: {},
        value: '',
        addEventListener() {},
        add() {},
        showModal() {},
        close() {},
      });
    }

    return elements.get(selector);
  }

  const context = vm.createContext({
    Intl,
    Date,
    Set,
    Map,
    console,
    Option: function () {},
    matchMedia: () => ({ matches: false }),
    document: { querySelector: element, querySelectorAll: () => [], addEventListener() {} },
  });
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)];
  assert.equal(scripts.length, 4);

  for (const [, filename] of scripts) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, filename), 'utf8'), context, { filename });
  }

  return {
    ...vm.runInContext(
      '({ data: AulaSyncData, calendar: AulaSyncCalendar, views, state, visibleEvents, render, openEvent, resetDemo })',
      context,
    ),
    element,
  };
}

// Una instancia por prueba evita que los filtros de un caso contaminen el siguiente.
test('30 eventos únicos con calendario válido e intervalos positivos', () => {
  const { data, calendar } = createDemo();
  assert.equal(data.events.length, 30);
  assert.equal(new Set(data.events.map((event) => event.id)).size, 30);

  for (const event of data.events) {
    assert.ok(calendar.minutes(event.inicio) < calendar.minutes(event.fin));
    assert.ok(data.calendars.some((source) => source.id === event.calendarioId));
  }
});

test('fechas de Lima, cambios de mes/año y lunes de domingo', () => {
  const { calendar } = createDemo();
  assert.equal(calendar.monday('2026-10-31'), '2026-10-26');
  assert.equal(calendar.monday('2026-11-01'), '2026-10-26');
  assert.equal(calendar.addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(calendar.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(calendar.keyOf(new Date('2026-11-01T02:00:00Z')), '2026-10-31');
});

test('semana completa y día seleccionado', () => {
  const demo = createDemo();
  assert.equal(demo.visibleEvents().length, 30);
  demo.state.view = 'day';
  demo.render();
  assert.equal(demo.visibleEvents().length, 7);
});

test('filtro por calendario y selección vacía', () => {
  const demo = createDemo();
  demo.state.selected = new Set(['mock-bloomberg']);
  assert.equal(demo.visibleEvents().length, 4);
  demo.state.selected.clear();
  demo.render();
  assert.equal(demo.visibleEvents().length, 0);
  assert.match(demo.element('#calendar-content').innerHTML, /No hay eventos/);
});

test('aula desconocida y categoría', () => {
  const demo = createDemo();
  demo.state.room = 'unknown';
  assert.equal(demo.visibleEvents().length, 4);
  demo.state.category = 'por_clasificar';
  assert.equal(demo.visibleEvents().length, 2);
  assert.ok(demo.visibleEvents().every((event) => event.aula === null));
});

test('búsqueda sin distinguir mayúsculas y filtros combinados', () => {
  const demo = createDemo();
  demo.state.search = 'ESCUELA';
  assert.equal(demo.visibleEvents().length, 1);
  assert.equal(demo.visibleEvents()[0].id, 'mock-27');
  demo.state.room = 'A-201';
  assert.equal(demo.visibleEvents().length, 0);
});

test('fechas fuera de demo y restauración', () => {
  const demo = createDemo();
  demo.state.date = '2026-11-09';
  demo.render();
  assert.equal(demo.visibleEvents().length, 0);
  demo.state.search = 'inexistente';
  demo.resetDemo();
  assert.equal(demo.visibleEvents().length, 30);
});

test('simultáneos conservan identidad y columnas separadas', () => {
  const { data, calendar } = createDemo();
  const events = data.events.filter((event) => event.dia === 0 && event.inicio === '08:00');
  const layout = calendar.layoutEvents(events);
  assert.equal(layout.length, 2);
  assert.ok(layout.every((placement) => placement.columns === 2));
  assert.equal(new Set(layout.map((placement) => placement.col)).size, 2);
});

test('adyacentes reutilizan columna; solapamientos contenidos no mutan la entrada', () => {
  const { calendar } = createDemo();
  const events = [
    { id: 'd', inicio: '12:00', fin: '13:00' },
    { id: 'a', inicio: '08:00', fin: '12:00' },
    { id: 'b', inicio: '09:00', fin: '10:00' },
    { id: 'c', inicio: '09:30', fin: '11:00' },
  ];
  const original = JSON.stringify(events);
  const layout = calendar.layoutEvents(events);
  assert.equal(JSON.stringify(events), original);
  assert.equal(layout.find((item) => item.event.id === 'd').columns, 1);
  assert.ok(layout.filter((item) => item.event.id !== 'd').every((item) => item.columns === 3));
  assert.ok(calendar.layoutEvents(events.slice(0, 2)).every((item) => item.columns === 1));
  assert.equal(calendar.layoutEvents([]).length, 0);
});

test('ficha conserva discrepancia, título y cantidad desconocida', () => {
  const demo = createDemo();
  assert.equal(demo.data.events.find((event) => event.id === 'mock-19').cantidad, null);
  demo.openEvent('mock-27');
  const html = demo.element('#dialog-content').innerHTML;
  assert.match(html, /Sin especificar/);
  assert.match(html, /25 y la descripción indica 35/);
  assert.match(html, /25, B-104, Escuela de proyectos/);
});

test('escape de HTML en agenda, cuadrícula y ficha', () => {
  const demo = createDemo();
  const text = '<img src=x onerror="alert(1)">';
  const event = {
    ...demo.data.events[0],
    tituloOriginal: text,
    aula: text,
    descripcionOriginal: text,
    revision: text,
  };
  const dates = ['2026-10-26'];
  const outputs = [
    demo.views.agendaHtml([event], dates),
    demo.views.gridHtml([event], dates, dates[0], 'day'),
    demo.views.eventDetailsHtml(event),
  ];

  for (const html of outputs) {
    assert.ok(!html.includes('<img'));
    assert.ok(html.includes('&lt;img'));
    assert.ok(html.includes('&quot;'));
  }
});

test('informativos sin cantidad no requieren revisión; cero no es null', () => {
  const demo = createDemo();
  const event = { ...demo.data.events[0], cantidad: 0 };
  assert.equal(demo.calendar.needsReview(event), false);
  assert.match(demo.views.eventDetailsHtml(event), /<dd>0<\/dd>/);
  assert.equal(demo.calendar.needsReview({ ...event, cantidad: null }), true);
  assert.equal(
    demo.calendar.needsReview({ ...event, categoria: 'informativo', cantidad: null, aula: null }),
    false,
  );
});
