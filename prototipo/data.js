'use strict';

/** Datos sintéticos. No contiene acceso a Google Calendar ni información real. */
const AulaSyncData = (() => {
  /**
   * @typedef {Object} Calendario
   * @property {string} id
   * @property {string} nombre
   * @property {string} color
   * @property {string} bg
   * @property {string} ink
   * @property {string} edge
   * @property {string|null} equipo
   *
   * @typedef {Object} Evento
   * @property {string} id
   * @property {string} calendarioId
   * @property {number} dia Desplazamiento desde el lunes de la semana demo (0–6).
   * @property {string} inicio Hora HH:mm de Lima.
   * @property {string} fin Hora HH:mm de Lima.
   * @property {string} tituloOriginal
   * @property {string|null} aula null significa desconocida.
   * @property {number|null} cantidad null nunca equivale a cero.
   * @property {'clase'|'informativo'|'por_clasificar'} categoria
   * @property {string} descripcionOriginal
   * @property {string|null} revision
   */
  const DEMO_DATE = '2026-10-31';
  /** @type {Calendario[]} */
  const calendars = [
    {
      id: 'mock-cursos',
      nombre: 'A Móvil Cursos',
      color: '#659c85',
      bg: '#eaf4ed',
      ink: '#50765e',
      edge: '#d9e9dd',
      equipo: 'Laptops',
    },
    {
      id: 'mock-eventual',
      nombre: 'A Móvil Eventual',
      color: '#b18e65',
      bg: '#f9f0e5',
      ink: '#987345',
      edge: '#efdfca',
      equipo: 'Laptops',
    },
    {
      id: 'mock-bloomberg',
      nombre: 'E Bloomberg',
      color: '#779bd1',
      bg: '#edf2fc',
      ink: '#5577a8',
      edge: '#dde6f7',
      equipo: 'PC Bloomberg',
    },
    {
      id: 'mock-proyector',
      nombre: 'E Proyectores',
      color: '#9c88bb',
      bg: '#f1ecf8',
      ink: '#89729f',
      edge: '#e5dcf1',
      equipo: 'Proyector',
    },
    {
      id: 'mock-ecran',
      nombre: 'E Ecran',
      color: '#6da6ad',
      bg: '#ecf6f7',
      ink: '#5a9096',
      edge: '#daebed',
      equipo: 'Ecran',
    },
    {
      id: 'mock-otros',
      nombre: 'OTROS',
      color: '#c79963',
      bg: '#fcf4e6',
      ink: '#a6844d',
      edge: '#f1e4c7',
      equipo: null,
    },
    {
      id: 'mock-info',
      nombre: 'Información',
      color: '#9ca6a0',
      bg: '#f0f3f1',
      ink: '#7d8d83',
      edge: '#e1e7e3',
      equipo: null,
    },
  ];

  /**
   * Las propiedades con nombre evitan confundir los numerosos argumentos del evento.
   * @param {Pick<Evento, 'id'|'calendarioId'|'dia'|'inicio'|'fin'|'tituloOriginal'|'aula'|'cantidad'> & Partial<Evento>} properties
   * @returns {Evento}
   */
  function makeEvent(properties) {
    return { categoria: 'clase', descripcionOriginal: '', revision: null, ...properties };
  }

  /** @type {Evento[]} */
  const events = [
    makeEvent({
      id: 'mock-01',
      calendarioId: 'mock-cursos',
      dia: 0,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '20, A-201, Ingeniería Clínica',
      aula: 'A-201',
      cantidad: 20,
    }),
    makeEvent({
      id: 'mock-02',
      calendarioId: 'mock-proyector',
      dia: 0,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: 'A-201, Ingeniería Clínica',
      aula: 'A-201',
      cantidad: 1,
      descripcionOriginal:
        'Requerimiento independiente de proyección. No se agrupa con el evento de laptops.',
    }),
    makeEvent({
      id: 'mock-03',
      calendarioId: 'mock-bloomberg',
      dia: 0,
      inicio: '10:30',
      fin: '12:00',
      tituloOriginal: 'A-203, Práctica de mercados',
      aula: 'A-203',
      cantidad: null,
    }),
    makeEvent({
      id: 'mock-04',
      calendarioId: 'mock-eventual',
      dia: 0,
      inicio: '14:00',
      fin: '16:00',
      tituloOriginal: '8, B-104, Taller de innovación',
      aula: 'B-104',
      cantidad: 8,
    }),
    makeEvent({
      id: 'mock-05',
      calendarioId: 'mock-cursos',
      dia: 1,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '16, A-202, Estadística aplicada',
      aula: 'A-202',
      cantidad: 16,
    }),
    makeEvent({
      id: 'mock-06',
      calendarioId: 'mock-ecran',
      dia: 1,
      inicio: '10:00',
      fin: '12:00',
      tituloOriginal: 'B-104, Seminario de diseño',
      aula: 'B-104',
      cantidad: 1,
    }),
    makeEvent({
      id: 'mock-07',
      calendarioId: 'mock-cursos',
      dia: 1,
      inicio: '13:00',
      fin: '15:00',
      tituloOriginal: '12, A-201, Programación I',
      aula: 'A-201',
      cantidad: 12,
    }),
    makeEvent({
      id: 'mock-08',
      calendarioId: 'mock-otros',
      dia: 1,
      inicio: '15:30',
      fin: '16:30',
      tituloOriginal: 'Revisar solicitud de apoyo',
      aula: null,
      cantidad: null,
      categoria: 'por_clasificar',
      descripcionOriginal: 'Solicitud sin aula ni cantidad identificada.',
    }),
    makeEvent({
      id: 'mock-09',
      calendarioId: 'mock-cursos',
      dia: 2,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '20, A-201, Ingeniería Clínica',
      aula: 'A-201',
      cantidad: 20,
    }),
    makeEvent({
      id: 'mock-10',
      calendarioId: 'mock-proyector',
      dia: 2,
      inicio: '09:00',
      fin: '11:00',
      tituloOriginal: 'B-104, Presentaciones de proyectos',
      aula: 'B-104',
      cantidad: null,
    }),
    makeEvent({
      id: 'mock-11',
      calendarioId: 'mock-eventual',
      dia: 2,
      inicio: '11:00',
      fin: '13:00',
      tituloOriginal: '6, A-202, Taller creativo',
      aula: 'A-202',
      cantidad: 6,
    }),
    makeEvent({
      id: 'mock-12',
      calendarioId: 'mock-bloomberg',
      dia: 2,
      inicio: '14:00',
      fin: '16:00',
      tituloOriginal: 'A-203, Finanzas experimentales',
      aula: 'A-203',
      cantidad: null,
    }),
    makeEvent({
      id: 'mock-13',
      calendarioId: 'mock-otros',
      dia: 3,
      inicio: '07:00',
      fin: '08:00',
      tituloOriginal: 'Apoyo en apertura de laboratorios',
      aula: null,
      cantidad: null,
      categoria: 'por_clasificar',
      descripcionOriginal: 'Instrucción libre. Pendiente de interpretación manual.',
    }),
    makeEvent({
      id: 'mock-14',
      calendarioId: 'mock-cursos',
      dia: 3,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '18, A-202, Métodos cuantitativos',
      aula: 'A-202',
      cantidad: 18,
    }),
    makeEvent({
      id: 'mock-15',
      calendarioId: 'mock-eventual',
      dia: 3,
      inicio: '10:30',
      fin: '12:30',
      tituloOriginal: '10, B-104, Laboratorio de ideas',
      aula: 'B-104',
      cantidad: 10,
    }),
    makeEvent({
      id: 'mock-16',
      calendarioId: 'mock-ecran',
      dia: 3,
      inicio: '14:00',
      fin: '16:00',
      tituloOriginal: 'A-201, Ciclo de conferencias',
      aula: 'A-201',
      cantidad: 1,
    }),
    makeEvent({
      id: 'mock-17',
      calendarioId: 'mock-cursos',
      dia: 4,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '20, A-201, Ingeniería Clínica',
      aula: 'A-201',
      cantidad: 20,
    }),
    makeEvent({
      id: 'mock-18',
      calendarioId: 'mock-proyector',
      dia: 4,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: 'A-201, Ingeniería Clínica',
      aula: 'A-201',
      cantidad: 1,
    }),
    makeEvent({
      id: 'mock-19',
      calendarioId: 'mock-cursos',
      dia: 4,
      inicio: '10:00',
      fin: '12:00',
      tituloOriginal: '16, A-202, Análisis de datos',
      aula: 'A-202',
      cantidad: null,
      descripcionOriginal: 'Cantidad solicitada en la descripción: 18 laptops.',
      revision:
        'El título indica 16 y la descripción indica 18. La cantidad se mantiene sin especificar hasta revisión.',
    }),
    makeEvent({
      id: 'mock-20',
      calendarioId: 'mock-bloomberg',
      dia: 4,
      inicio: '14:00',
      fin: '16:00',
      tituloOriginal: 'A-203, Simulación financiera',
      aula: 'A-203',
      cantidad: null,
    }),
    makeEvent({
      id: 'mock-21',
      calendarioId: 'mock-eventual',
      dia: 4,
      inicio: '16:30',
      fin: '18:30',
      tituloOriginal: '8, B-104, Taller de prototipos',
      aula: 'B-104',
      cantidad: 8,
    }),
    makeEvent({
      id: 'mock-22',
      calendarioId: 'mock-otros',
      dia: 5,
      inicio: '07:00',
      fin: '08:00',
      tituloOriginal: 'Apoyar en biblioteca',
      aula: null,
      cantidad: null,
      categoria: 'informativo',
      descripcionOriginal: 'Actividad de apoyo sin requerimiento de instalación.',
    }),
    makeEvent({
      id: 'mock-23',
      calendarioId: 'mock-cursos',
      dia: 5,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '20, A-201, Contabilidad aplicada',
      aula: 'A-201',
      cantidad: 20,
    }),
    makeEvent({
      id: 'mock-24',
      calendarioId: 'mock-cursos',
      dia: 5,
      inicio: '08:00',
      fin: '10:00',
      tituloOriginal: '12, A-202, Matemática financiera',
      aula: 'A-202',
      cantidad: 12,
    }),
    makeEvent({
      id: 'mock-25',
      calendarioId: 'mock-proyector',
      dia: 5,
      inicio: '08:00',
      fin: '12:00',
      tituloOriginal: 'B-104, Encuentro de investigación',
      aula: 'B-104',
      cantidad: 1,
    }),
    makeEvent({
      id: 'mock-26',
      calendarioId: 'mock-bloomberg',
      dia: 5,
      inicio: '10:00',
      fin: '12:00',
      tituloOriginal: 'A-203, Decisiones financieras',
      aula: 'A-203',
      cantidad: null,
    }),
    makeEvent({
      id: 'mock-27',
      calendarioId: 'mock-eventual',
      dia: 5,
      inicio: '13:00',
      fin: '15:00',
      tituloOriginal: '25, B-104, Escuela de proyectos',
      aula: 'B-104',
      cantidad: null,
      descripcionOriginal: 'La descripción solicita 35 laptops para el taller.',
      revision:
        'El título indica 25 y la descripción indica 35. Verifica la solicitud antes de asignar una cantidad.',
    }),
    makeEvent({
      id: 'mock-28',
      calendarioId: 'mock-eventual',
      dia: 5,
      inicio: '15:00',
      fin: '18:00',
      tituloOriginal: '6, A-201, Jornada de diseño',
      aula: 'A-201',
      cantidad: 6,
      descripcionOriginal: 'Coordinación de recojo mencionada a las 17:00.',
      revision:
        'El texto menciona recojo a las 17:00, pero el evento termina a las 18:00. No se crea una tarea automáticamente.',
    }),
    makeEvent({
      id: 'mock-29',
      calendarioId: 'mock-info',
      dia: 6,
      inicio: '09:00',
      fin: '10:00',
      tituloOriginal: 'Jornada informativa del campus',
      aula: null,
      cantidad: null,
      categoria: 'informativo',
      descripcionOriginal: 'Aviso general. No genera instalaciones ni requerimientos.',
    }),
    makeEvent({
      id: 'mock-30',
      calendarioId: 'mock-eventual',
      dia: 6,
      inicio: '10:00',
      fin: '12:00',
      tituloOriginal: '4, A-202, Taller de comunicación',
      aula: 'A-202',
      cantidad: 4,
    }),
  ];
  const categories = {
    clase: 'Clase',
    informativo: 'Informativo',
    por_clasificar: 'Por clasificar',
  };

  return { DEMO_DATE, calendars, events, categories, makeEvent };
})();
