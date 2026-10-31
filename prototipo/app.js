'use strict';

/** Contratos equivalentes a calendarios, aulas, eventos_origen y requerimientos del SQL.
 * Los identificadores y contenidos de esta demo son ficticios; no son IDs de Google.
 * @typedef {{id:string,nombre:string,color:string,bg:string,ink:string,edge:string,equipo:string|null}} Calendario
 * @typedef {{id:string,calendarioId:string,tituloOriginal:string,dia:number,inicio:string,fin:string,aula:string|null,cantidad:number|null,categoria:string,descripcionOriginal:string,revision:string|null}} Evento
 */
const DEMO_DATE = '2026-10-31';
/** @type {Calendario[]} */
const calendars = [
  {id:'mock-cursos',nombre:'A Móvil Cursos',color:'#659c85',bg:'#eaf4ed',ink:'#50765e',edge:'#d9e9dd',equipo:'Laptops'},
  {id:'mock-eventual',nombre:'A Móvil Eventual',color:'#b18e65',bg:'#f9f0e5',ink:'#987345',edge:'#efdfca',equipo:'Laptops'},
  {id:'mock-bloomberg',nombre:'E Bloomberg',color:'#779bd1',bg:'#edf2fc',ink:'#5577a8',edge:'#dde6f7',equipo:'PC Bloomberg'},
  {id:'mock-proyector',nombre:'E Proyectores',color:'#9c88bb',bg:'#f1ecf8',ink:'#89729f',edge:'#e5dcf1',equipo:'Proyector'},
  {id:'mock-ecran',nombre:'E Ecran',color:'#6da6ad',bg:'#ecf6f7',ink:'#5a9096',edge:'#daebed',equipo:'Ecran'},
  {id:'mock-otros',nombre:'OTROS',color:'#c79963',bg:'#fcf4e6',ink:'#a6844d',edge:'#f1e4c7',equipo:null},
  {id:'mock-info',nombre:'Información',color:'#9ca6a0',bg:'#f0f3f1',ink:'#7d8d83',edge:'#e1e7e3',equipo:null},
];
/** Genera exclusivamente ejemplos sintéticos, sin copiar información personal ni solicitudes reales. */
function makeEvent(id,calendarioId,dia,inicio,fin,tituloOriginal,aula,cantidad,categoria='clase',descripcionOriginal='',revision=null){return {id,calendarioId,dia,inicio,fin,tituloOriginal,aula,cantidad,categoria,descripcionOriginal,revision};}
/** @type {Evento[]} */
const events = [
  makeEvent('mock-01','mock-cursos',0,'08:00','10:00','20, A-201, Ingeniería Clínica','A-201',20),
  makeEvent('mock-02','mock-proyector',0,'08:00','10:00','A-201, Ingeniería Clínica','A-201',1,'clase','Requerimiento independiente de proyección. No se agrupa con el evento de laptops.'),
  makeEvent('mock-03','mock-bloomberg',0,'10:30','12:00','A-203, Práctica de mercados','A-203',null),
  makeEvent('mock-04','mock-eventual',0,'14:00','16:00','8, B-104, Taller de innovación','B-104',8),
  makeEvent('mock-05','mock-cursos',1,'08:00','10:00','16, A-202, Estadística aplicada','A-202',16),
  makeEvent('mock-06','mock-ecran',1,'10:00','12:00','B-104, Seminario de diseño','B-104',1),
  makeEvent('mock-07','mock-cursos',1,'13:00','15:00','12, A-201, Programación I','A-201',12),
  makeEvent('mock-08','mock-otros',1,'15:30','16:30','Revisar solicitud de apoyo',null,null,'por_clasificar','Solicitud sin aula ni cantidad identificada.'),
  makeEvent('mock-09','mock-cursos',2,'08:00','10:00','20, A-201, Ingeniería Clínica','A-201',20),
  makeEvent('mock-10','mock-proyector',2,'09:00','11:00','B-104, Presentaciones de proyectos','B-104',null),
  makeEvent('mock-11','mock-eventual',2,'11:00','13:00','6, A-202, Taller creativo','A-202',6),
  makeEvent('mock-12','mock-bloomberg',2,'14:00','16:00','A-203, Finanzas experimentales','A-203',null),
  makeEvent('mock-13','mock-otros',3,'07:00','08:00','Apoyo en apertura de laboratorios',null,null,'por_clasificar','Instrucción libre. Pendiente de interpretación manual.'),
  makeEvent('mock-14','mock-cursos',3,'08:00','10:00','18, A-202, Métodos cuantitativos','A-202',18),
  makeEvent('mock-15','mock-eventual',3,'10:30','12:30','10, B-104, Laboratorio de ideas','B-104',10),
  makeEvent('mock-16','mock-ecran',3,'14:00','16:00','A-201, Ciclo de conferencias','A-201',1),
  makeEvent('mock-17','mock-cursos',4,'08:00','10:00','20, A-201, Ingeniería Clínica','A-201',20),
  makeEvent('mock-18','mock-proyector',4,'08:00','10:00','A-201, Ingeniería Clínica','A-201',1),
  makeEvent('mock-19','mock-cursos',4,'10:00','12:00','16, A-202, Análisis de datos','A-202',null,'clase','Cantidad solicitada en la descripción: 18 laptops.','El título indica 16 y la descripción indica 18. La cantidad se mantiene sin especificar hasta revisión.'),
  makeEvent('mock-20','mock-bloomberg',4,'14:00','16:00','A-203, Simulación financiera','A-203',null),
  makeEvent('mock-21','mock-eventual',4,'16:30','18:30','8, B-104, Taller de prototipos','B-104',8),
  makeEvent('mock-22','mock-otros',5,'07:00','08:00','Apoyar en biblioteca',null,null,'informativo','Actividad de apoyo sin requerimiento de instalación.'),
  makeEvent('mock-23','mock-cursos',5,'08:00','10:00','20, A-201, Contabilidad aplicada','A-201',20),
  makeEvent('mock-24','mock-cursos',5,'08:00','10:00','12, A-202, Matemática financiera','A-202',12),
  makeEvent('mock-25','mock-proyector',5,'08:00','12:00','B-104, Encuentro de investigación','B-104',1),
  makeEvent('mock-26','mock-bloomberg',5,'10:00','12:00','A-203, Decisiones financieras','A-203',null),
  makeEvent('mock-27','mock-eventual',5,'13:00','15:00','25, B-104, Escuela de proyectos','B-104',null,'clase','La descripción solicita 35 laptops para el taller.','El título indica 25 y la descripción indica 35. Verifica la solicitud antes de asignar una cantidad.'),
  makeEvent('mock-28','mock-eventual',5,'15:00','18:00','6, A-201, Jornada de diseño','A-201',6,'clase','Coordinación de recojo mencionada a las 17:00.','El texto menciona recojo a las 17:00, pero el evento termina a las 18:00. No se crea una tarea automáticamente.'),
  makeEvent('mock-29','mock-info',6,'09:00','10:00','Jornada informativa del campus',null,null,'informativo','Aviso general. No genera instalaciones ni requerimientos.'),
  makeEvent('mock-30','mock-eventual',6,'10:00','12:00','4, A-202, Taller de comunicación','A-202',4),
];
const categories = {clase:'Clase',informativo:'Informativo',por_clasificar:'Por clasificar'};
const $ = selector => document.querySelector(selector);
const state = {date:DEMO_DATE,view:matchMedia('(max-width:600px)').matches?'agenda':'week',selected:new Set(calendars.map(c=>c.id)),search:'',room:'',category:'',miniMonth:'2026-10-01'};
const dateOf = iso => new Date(`${iso}T12:00:00-05:00`);
const keyOf = date => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
function addDays(iso,n){const d=dateOf(iso);d.setUTCDate(d.getUTCDate()+n);return keyOf(d);}
function monday(iso){const day=dateOf(iso).getUTCDay();return addDays(iso,-((day+6)%7));}
const demoMonday=monday(DEMO_DATE);
const minutes = time => {const [h,m]=time.split(':').map(Number);return h*60+m;};
const formatDate = (iso,options) => new Intl.DateTimeFormat('es-PE',{timeZone:'America/Lima',...options}).format(dateOf(iso));
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function calendarOf(e){return calendars.find(c=>c.id===e.calendarioId);}
function colorStyle(c){return `--color:${c.color};--bg:${c.bg};--ink:${c.ink};--edge:${c.edge}`;}
function dateFor(e){return addDays(demoMonday,e.dia);}
function needsReview(e){return e.revision || e.categoria==='por_clasificar' || (e.categoria==='clase' && (e.cantidad===null || e.aula===null));}
function visibleDates(){const start=state.view==='day'?state.date:monday(state.date);return Array.from({length:state.view==='day'?1:7},(_,i)=>addDays(start,i));}
function visibleEvents(){const dates=visibleDates();return events.filter(e=>dates.includes(dateFor(e)) && state.selected.has(e.calendarioId) && (!state.room || (state.room==='unknown'?e.aula===null:e.aula===state.room)) && (!state.category||e.categoria===state.category) && `${e.tituloOriginal} ${e.aula??''} ${calendarOf(e).nombre}`.toLocaleLowerCase('es').includes(state.search.toLocaleLowerCase('es'))).sort((a,b)=>dateFor(a).localeCompare(dateFor(b))||minutes(a.inicio)-minutes(b.inicio)||a.id.localeCompare(b.id));}
function renderMini(){
  const first=state.miniMonth.slice(0,7)+'-01';const start=monday(first);const range=visibleDates();
  $('#mini-title').textContent=formatDate(first,{month:'long',year:'numeric'});
  $('#mini-calendar').innerHTML=Array.from({length:42},(_,i)=>{const d=addDays(start,i);return `<button data-date="${d}" aria-label="${formatDate(d,{dateStyle:'full'})}" class="${d.slice(0,7)!==first.slice(0,7)?'other ':''}${range.includes(d)?'range ':''}${d===state.date?'selected':''}">${Number(d.slice(-2))}</button>`;}).join('');
}
function renderFilters(){
  $('#calendar-filters').innerHTML=calendars.map(c=>`<label class="calendar-check" style="--cal:${c.color}"><input type="checkbox" data-calendar="${c.id}" ${state.selected.has(c.id)?'checked':''}><span>${c.nombre}</span><span class="count">${events.filter(e=>e.calendarioId===c.id&&visibleDates().includes(dateFor(e))).length}</span></label>`).join('');
}
/** Distribuye los eventos en columnas independientes por grupo de solapamiento.
 * Los intervalos adyacentes no se consideran solapados. Nunca fusiona eventos.
 */
function layoutEvents(items){
  const sorted=[...items].sort((a,b)=>minutes(a.inicio)-minutes(b.inicio)||minutes(b.fin)-minutes(a.fin));
  const groups=[];let group=[];let end=-1;
  for(const e of sorted){if(minutes(e.inicio)>=end && group.length){groups.push(group);group=[];end=-1;}group.push(e);end=Math.max(end,minutes(e.fin));}if(group.length)groups.push(group);
  return groups.flatMap(list=>{const ends=[];const placed=list.map(e=>{let col=ends.findIndex(t=>t<=minutes(e.inicio));if(col<0)col=ends.length;ends[col]=minutes(e.fin);return {event:e,col};});return placed.map(p=>({...p,columns:ends.length}));});
}
function gridHtml(items){
  const dates=visibleDates();const startHour=6,endHour=23,height=(endHour-startHour)*60;
  return `<div class="calendar-scroll"><div class="week-grid ${state.view==='day'?'daily':''}" style="--days:${dates.length}"><div class="day-headings"><div class="corner">GMT−5</div>${dates.map(d=>`<div class="day-heading ${d===state.date?'highlight':''}"><span>${formatDate(d,{weekday:'short'})}</span><strong>${Number(d.slice(-2))}</strong></div>`).join('')}</div><div class="time-grid" style="height:${height}px"><div class="time-labels">${Array.from({length:endHour-startHour},(_,i)=>`<span class="time-label" style="top:${i*60+8}px">${String(startHour+i).padStart(2,'0')}:00</span>`).join('')}</div>${dates.map(d=>`<div class="day-column ${d===state.date?'highlight':''}">${layoutEvents(items.filter(e=>dateFor(e)===d)).map(({event:e,col,columns})=>{const c=calendarOf(e);const top=minutes(e.inicio)-startHour*60;const duration=minutes(e.fin)-minutes(e.inicio);return `<button class="event" data-event="${e.id}" aria-label="${escapeHtml(e.tituloOriginal)}, ${e.inicio} a ${e.fin}, ${c.nombre}" style="${colorStyle(c)};top:${top+2}px;height:${duration-4}px;left:calc(${100*col/columns}% + 3px);width:calc(${100/columns}% - 6px)"><span class="event-time">${e.inicio} – ${e.fin}</span><strong>${escapeHtml(e.tituloOriginal)}</strong><span class="event-meta">${e.categoria==='clase'?`${e.cantidad===null?'Cantidad sin especificar':`${e.cantidad} ${c.equipo?.toLowerCase()??'equipos'}`}`:categories[e.categoria]}</span><span class="event-calendar">${c.nombre}</span>${e.revision?'<span class="review-dot">◇ Revisar</span>':''}</button>`;}).join('')}</div>`).join('')}</div></div></div>`;
}
function agendaHtml(items){return `<div class="agenda">${visibleDates().filter(d=>items.some(e=>dateFor(e)===d)).map(d=>`<h3 class="agenda-date">${formatDate(d,{weekday:'long',day:'numeric',month:'long'})}</h3>${items.filter(e=>dateFor(e)===d).map(e=>`<button class="agenda-event" data-event="${e.id}" style="${colorStyle(calendarOf(e))}"><span class="agenda-time">${e.inicio} – ${e.fin}</span><span class="agenda-dot"></span><span><strong>${escapeHtml(e.tituloOriginal)}</strong><small>${calendarOf(e).nombre} · ${e.aula??'Aula sin especificar'}${e.revision?' · ◇ Revisar':''}</small></span><span class="agenda-category">${categories[e.categoria]}</span></button>`).join('')}`).join('')}</div>`;}
function render(){
  const items=visibleEvents();const dates=visibleDates();
  $('#date-title').textContent=state.view==='day'?formatDate(state.date,{day:'numeric',month:'long',year:'numeric'}):`${Number(dates[0].slice(-2))} – ${formatDate(dates[6],{day:'numeric',month:'long',year:'numeric'})}`;
  $('#event-count').textContent=items.length;$('#room-count').textContent=new Set(items.map(e=>e.aula).filter(Boolean)).size;$('#calendar-count').textContent=state.selected.size;$('#review-count').textContent=items.filter(needsReview).length;
  $('#footer-count').textContent=`${items.length} eventos · America/Lima`;
  document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===state.view);b.setAttribute('aria-pressed',String(b.dataset.view===state.view));});
  $('#calendar-content').innerHTML=items.length?(state.view==='agenda'?agendaHtml(items):gridHtml(items)):`<div class="empty"><span style="font-size:30px">▦</span><strong>No hay eventos en este período</strong><p>Prueba otra fecha o ajusta los filtros.</p><button id="reset-demo" class="primary-button">Ver semana demo</button></div>`;
  renderMini();renderFilters();
  const scroller=$('.calendar-scroll');if(scroller)scroller.scrollTop=55;
}
function openEvent(id){
  const e=events.find(e=>e.id===id);if(!e)return;const c=calendarOf(e);
  $('#dialog-accent').style.background=c.color;
  $('#dialog-content').innerHTML=`<article class="event-details"><div class="source-label" style="${colorStyle(c)}"><i></i>${c.nombre}</div><h2 id="dialog-title">${escapeHtml(e.tituloOriginal)}</h2><div class="detail-date">${formatDate(dateFor(e),{weekday:'long',day:'numeric',month:'long',year:'numeric'})}<br>${e.inicio} – ${e.fin} · America/Lima</div><dl class="detail-fields"><div><dt>Aula</dt><dd>${e.aula??'Sin especificar'}</dd></div><div><dt>Categoría</dt><dd>${categories[e.categoria]}</dd></div><div><dt>Requerimiento</dt><dd>${c.equipo??'Sin especificar'}</dd></div><div><dt>Cantidad</dt><dd>${e.cantidad??'Sin especificar'}</dd></div></dl><p class="detail-description">${escapeHtml(e.descripcionOriginal||'Sin descripción adicional.')}</p>${e.revision?`<div class="review-notice"><strong>◇ Requiere revisión</strong><br>${escapeHtml(e.revision)}</div>`:e.categoria==='por_clasificar'?'<div class="review-notice">Interpretación pendiente. No se ha generado ninguna tarea de instalación.</div>':''}<div class="dialog-footnote">DATOS FICTICIOS · El título original se conserva íntegro.<br>Este evento es independiente de otros que coincidan en aula u horario.</div></article>`;
  $('#event-dialog').showModal();
}
function resetDemo(){state.date=DEMO_DATE;state.miniMonth='2026-10-01';state.selected=new Set(calendars.map(c=>c.id));state.search='';state.room='';state.category='';$('#search').value='';$('#room-filter').value='';$('#category-filter').value='';render();}
document.addEventListener('click',ev=>{const eventButton=ev.target.closest('[data-event]');if(eventButton)openEvent(eventButton.dataset.event);const dateButton=ev.target.closest('[data-date]');if(dateButton){state.date=dateButton.dataset.date;render();}const viewButton=ev.target.closest('[data-view]');if(viewButton){state.view=viewButton.dataset.view;render();}if(ev.target.closest('#reset-demo'))resetDemo();});
$('#calendar-filters').addEventListener('change',ev=>{const id=ev.target.dataset.calendar;if(!id)return;if(ev.target.checked)state.selected.add(id);else state.selected.delete(id);render();});
$('#all-calendars').addEventListener('click',()=>{state.selected=new Set(state.selected.size===calendars.length?[]:calendars.map(c=>c.id));render();});
$('#search').addEventListener('input',ev=>{state.search=ev.target.value;render();});
$('#room-filter').addEventListener('change',ev=>{state.room=ev.target.value;render();});
$('#category-filter').addEventListener('change',ev=>{state.category=ev.target.value;render();});
for(const [selector,delta] of [['#previous',-1],['#next',1]])$(selector).addEventListener('click',()=>{state.date=addDays(state.date,delta*(state.view==='day'?1:7));state.miniMonth=state.date.slice(0,7)+'-01';render();});
$('#today').addEventListener('click',()=>{state.date=keyOf(new Date());state.miniMonth=state.date.slice(0,7)+'-01';render();});
for(const [selector,delta] of [['#mini-prev',-1],['#mini-next',1]])$(selector).addEventListener('click',()=>{const d=dateOf(state.miniMonth);d.setUTCMonth(d.getUTCMonth()+delta);state.miniMonth=keyOf(d);renderMini();});
$('#close-dialog').addEventListener('click',()=>$('#event-dialog').close());$('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());$('#close-help').addEventListener('click',()=>$('#help-dialog').close());
$('#demo-week').addEventListener('click',()=>{resetDemo();$('#help-dialog').close();});
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',ev=>{if(ev.target===dialog){const rect=dialog.getBoundingClientRect();if(ev.clientX<rect.left||ev.clientX>rect.right||ev.clientY<rect.top||ev.clientY>rect.bottom)dialog.close();}}));
const roomSelect=$('#room-filter');[...new Set(events.map(e=>e.aula).filter(Boolean))].sort().forEach(room=>roomSelect.add(new Option(room,room)));
render();
