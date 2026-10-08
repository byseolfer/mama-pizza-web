/* ======================= DATOS LITERALES DE LA CARTA ======================= */
const PDF = {
  ing: 'https://cdn.website.dish.co/media/30/42/4655350/Ingredientes.pdf',
  menu: 'https://cdn.website.dish.co/media/3e/6e/9716432/Menu.pdf',
  por: 'https://cdn.website.dish.co/media/3d/56/9716433/Porciones.pdf'
};
const OFFER = {
  title: 'OFERTA:',
  html: '<strong>2 x 1</strong> en Pizzas medianas y familiares de 3 o más ingredientes. <strong>Lunes a Jueves (sólo para llevar)</strong> Oferta no válida en festivos y vísperas de fiesta. <strong>50% en segunda pizza fines de semana y festivos.</strong>'
};
const C = [
  { id:'pizzas', label:'Pizzas', title:'PIZZAS', sub:'(PRECIO SEGÚN INGREDIENTES)', note:'Todas las Pizzas llevan como base : Salsa de Tomate y Mozzarella', sized:true, items:[
    {n:'MAMA PIZZA BASE',m:'12,40',f:'18,60'},
    {n:'BASE + 1 INGREDIENTE',m:'14,20',f:'20,80'},
    {n:'BASE + 2 INGREDIENTES',m:'16,00',f:'23,00'},
    {n:'BASE + 3 INGREDIENTES',m:'17,80',f:'25,20'},
    {n:'BASE + 4 INGREDIENTES',m:'19,60',f:'27,40'},
    {n:'BASE + 5 INGREDIENTES',m:'21,40',f:'29,60'},
    {n:'SUPLEMENTO',m:'2,50',f:'3,00',s:true}
  ]},
  { id:'sugerencias', label:'Sugerencias', title:'PIZZAS (SUGERENCIAS)', sized:true, items:[
    {n:'TROPICAL',d:'Base, Jamón y Piña (Base + 2 ingredientes)',m:'16,00',f:'23,00',ing:['Jamón York','Piña']},
    {n:'VEGETAL',d:'Base, Champiñón, Cebolla, Pim. verdes, Tomate natural (Base + 4 ingredientes)',m:'19,60',f:'27,40',ing:['Champiñón','Cebolla','Pimiento verde','Tomate']},
    {n:'4 ESTACIONES',d:'Base, Jamón, Champiñón, Chorizo, Tomate natural (Base + 4 ingredientes)',m:'19,60',f:'27,40',ing:['Jamón York','Champiñón','Chorizo','Tomate']},
    {n:'MARINA',d:'Base, Atún, Palometa ahumada, Anchoas, Pim. Morrón, Tomate natural (Base + 5 ingredientes)',m:'21,40',f:'29,60',ing:['Atún','Palometa ahumada','Anchoa ahumada','Pimiento rojo','Tomate']},
    {n:'MAMA PIZZA',d:'Base, Ternera, Bacon, Chorizo, Pim. verdes, Cebolla (Base + 5 ingredientes)',m:'21,40',f:'29,60',ing:['Ternera','Bacon','Chorizo','Pimiento verde','Cebolla']}
  ]},
  { id:'porciones', label:'Porciones', title:'PIZZAS (PORCIONES)', items:[
    {n:'MOZZARELLA',p:'3,00'},{n:'JAMON',p:'3,30'},{n:'BACON',p:'3,30'},{n:'4 QUESOS',p:'3,30'},{n:'CHAMPIÑÓN',p:'3,30'},{n:'CEBOLLA',p:'3,30'},
    {n:'CHORIZO',p:'3,40'},{n:'POLLO',p:'3,40'},{n:'ATUN',p:'3,40'},{n:'AHUMADOS',p:'3,40'},{n:'TERNERA',p:'3,40'},
    {n:'Suplemento ingrediente',p:'0,60',s:true}
  ]},
  { id:'calientes', label:'Bocadillos calientes', title:'BOCADILLOS CALIENTES', note:'Deliciosos bocadillos con pan recién horneado', items:[
    {n:'JAMON YORK, SALCHICHA FRANKFURT, CEBOLLA Y MAHONESA',p:'5,00'},
    {n:'BACON Y TOMATE (O QUESO)',p:'4,50'},
    {n:'LOMO ADOBADO Y TOMATE (O QUESO)',p:'5,00'},
    {n:'TORTILLA PATATAS Y PIM. VERDE (O MAHONESA)',p:'4,30'},
    {n:'TORTILLA PATATAS, JAMON SERRANO Y TOMATE',p:'5,00'},
    {n:'SUPLEMENTO POR PRODUCTO',p:'1,00',s:true}
  ]},
  { id:'frios', label:'Bocadillos fríos', title:'BOCADILLOS FRIOS', items:[
    {n:'VEGETAL (Tomate, lechuga, cebolla y pepinillo)',p:'4,00'},
    {n:'VEGETAL CON ATÚN',p:'4,50'},
    {n:'JAMÓN SERRANO Y TOMATE',p:'4,50'},
    {n:'CHORIZO, TABASCO Y MAHONESA',p:'4,50'},
    {n:'ROQUEFORT Y MANTEQUILLA',p:'5,00'},
    {n:'ATÚN, PIM.MORRÓN Y MAHONESA',p:'5,00'},
    {n:'PALOMETA AHUMADA, ANCHOAS Y MAHONESA',p:'5,00'},
    {n:'SUPLEMENTO POR PRODUCTO',p:'1,00',s:true}
  ]},
  { id:'hamburguesas', label:'Hamburguesas', title:'HAMBURGUESAS', items:[
    {n:'HAMBURGUESA',d:'Carne de ternera con queso fundido, tomate, lechuga y cebolla',p:'5,00'},
    {n:'SUPLEMENTO (Cada uno)',p:'1,00',s:true}
  ]},
  { id:'perritos', label:'Perritos', title:'PERRITO CALIENTE', items:[
    {n:'PERRITO CALIENTE (sencillo)',p:'2,70'},
    {n:'PERRITO ESPECIAL (con cebolla a la plancha y mozzarella)',p:'3,50'}
  ]},
  { id:'ensaladas', label:'Ensaladas', title:'ENSALADAS', items:[
    {n:'ESPAÑOLA',d:'Lechuga, tomate, cebolla, atún y aceitunas',p:'4,00'},
    {n:'AMERICANA',d:'Lechuga, tomate, zanahoria, maíz, jamón york, queso y salsa rosa',p:'4,20'}
  ]},
  { id:'sandwiches', label:'Sandwiches', title:'SANDWICHES', items:[
    {n:'MIXTO (Jamón y Queso)',p:'4,10'},
    {n:'VEGETAL (Tomate, lechuga, cebolla y pepinillo)',p:'3,70'},
    {n:'VEGETAL CON ATÚN',p:'4,10'}
  ]}
];
const ING_TITLE = 'INGREDIENTES PIZZAS';
const ING = [
  {g:'QUESOS:',i:['4 Quesos','Mozzarella','Roquefort']},
  {g:'CARNES/EMBUTIDOS:',i:['Jamón Serrano','Jamón York','Bacon','Ternera','Pollo','Chorizo','Salchicha Frankfurt']},
  {g:'PESCADOS (Conservas):',i:['Atún','Palometa ahumada','Anchoa ahumada']},
  {g:'VEGETALES/FRUTAS:',i:['Piña','Champiñón','Tomate','Pimiento verde / Pimiento rojo','Cebolla','Aceitunas verdes / Aceitunas negras']},
  {g:'OTROS:',i:['Salsa barbacoa']}
];

/* ======================= HELPERS ======================= */
const eur = p => `<span class="eur">${p} €</span>`;
const num = p => parseFloat(p.replace(',', '.'));
const fmt = n => n.toFixed(2).replace('.', ',');
const real = c => c.items.filter(i => !i.s);
const from = c => { const v = real(c).map(i => num(i.p ?? i.m)); return fmt(Math.min(...v)); };
const cartaHead = () => `
  <header class="mh">
    <span class="kick">La Pizza como tú la quieres....</span>
    <h2>Nuestro menú</h2>
    <div class="pdfs"><i class="ph ph-file-pdf"></i>
      <a href="${PDF.ing}" target="_blank" rel="noopener">Ingredientes</a>
      <a href="${PDF.menu}" target="_blank" rel="noopener">Menú</a>
      <a href="${PDF.por}" target="_blank" rel="noopener">Porciones</a>
    </div>
  </header>`;
const offer = () => `<div class="offer"><b>${OFFER.title}</b><p>${OFFER.html}</p></div>`;
const seg = () => `<div class="seg" role="group" aria-label="Tamaño"><button type="button" aria-pressed="true" data-s="m">Mediana</button><button type="button" aria-pressed="false" data-s="f">Familiar</button></div>`;
const bindSeg = (root, onChange) => root.querySelectorAll('.seg').forEach(s => s.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const isF = b.dataset.s === 'f';
  root.querySelectorAll('.seg').forEach(x => { x.classList.toggle('is-f', isF); x.querySelectorAll('button').forEach(y => y.setAttribute('aria-pressed', String(y.dataset.s === b.dataset.s))); });
  onChange(isF);
}));
const scrollFrameTo = (frame, el, offset = 0) => frame.scrollTo({ top: el.offsetTop - offset, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

