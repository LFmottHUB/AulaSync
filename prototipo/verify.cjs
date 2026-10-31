const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const elements = new Map();
function element(selector){if(!elements.has(selector))elements.set(selector,{textContent:'',innerHTML:'',style:{},dataset:{},value:'',addEventListener(){},add(){},showModal(){},close(){}});return elements.get(selector);}
const context=vm.createContext({Intl,Date,Set,Map,console,Option:function(){},matchMedia:()=>({matches:false}),document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){}}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'app.js'),'utf8'),context);
function check(code){assert.equal(vm.runInContext(code,context),true,code);}
check('events.length === 30 && new Set(events.map(e=>e.id)).size === 30');
check('visibleEvents().length === 30');
check("monday('2026-10-31') === '2026-10-26'");
check("addDays('2026-10-31',1) === '2026-11-01'");
check('events.every(e=>minutes(e.inicio)<minutes(e.fin))');
check('events.every(e=>calendars.some(c=>c.id===e.calendarioId))');
check("layoutEvents(events.filter(e=>e.dia===0 && e.inicio==='08:00')).every(e=>e.columns===2)");
check("layoutEvents([makeEvent('a','mock-cursos',0,'08:00','10:00','a',null,null),makeEvent('b','mock-cursos',0,'10:00','12:00','b',null,null)]).every(e=>e.columns===1)");
check("events.find(e=>e.id==='mock-19').cantidad===null");
vm.runInContext("state.view='day';render()",context);check('visibleEvents().length===7');
vm.runInContext("state.view='week';state.selected=new Set(['mock-bloomberg']);render()",context);check('visibleEvents().length===4');
vm.runInContext("resetDemo();state.room='unknown';render()",context);check('visibleEvents().length===4');
vm.runInContext("resetDemo();state.search='escuela';render()",context);check("visibleEvents().length===1 && visibleEvents()[0].id==='mock-27'");
vm.runInContext("resetDemo();state.date='2026-11-09';render()",context);check('visibleEvents().length===0');
vm.runInContext("resetDemo();openEvent('mock-27')",context);check("document.querySelector('#dialog-content').innerHTML.includes('Sin especificar') && document.querySelector('#dialog-content').innerHTML.includes('25 y la descripción indica 35')");
console.log('15 comprobaciones correctas: datos, fechas, filtros, solapamientos, navegación y contenido de ficha.');
