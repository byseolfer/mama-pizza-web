// Extrae los textos de interfaz traducidos de la web actual (https://mamapizza.metro.bar/?lang=xx)
// y los combina con los textos nuevos de content/i18n-ui.json en content/i18n/{lang}.json.
// Las 16 versiones comparten plantilla: cada texto se localiza por su posición en la versión es.
import { parse } from 'node-html-parser';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { LANGS } from '../src/lib/i18n.mjs';

const SOURCE = 'https://mamapizza.metro.bar/?lang=';
const out = new URL('../content/i18n/', import.meta.url);
const ui = JSON.parse(readFileSync(new URL('../content/i18n-ui.json', import.meta.url), 'utf8'));

// [clave, texto en es, aparición (1 = primera)]. Las claves con 2 partes son H2 partidos ("Nuestro" / "menú").
const SINGLE = [
  ['btn.reservation', 'Reserva', 1], ['nav.menu', 'Menú', 2], ['nav.location', 'Dónde estamos', 2],
  ['nav.times', 'Horarios de apertura', 1], ['nav.payment', 'Opciones de pago', 1], ['nav.about', 'Sobre nosotros', 2],
  ['nav.services', 'Servicios', 1], ['nav.contact', 'Contacto', 1], ['nav.reservation', 'Reserva', 3],
  ['sec.location', 'Dónde estamos', 1], ['map.show', 'Mostrar mapa', 1], ['map.ip', 'Su dirección IP se enviará a Google Maps.', 1],
  ['country', 'España', 1], ['closed', 'cerrado', 1], ['pay.cash', 'En efectivo', 1], ['about', 'Sobre nosotros', 1],
  ['srv.ac', 'Aire acondicionado', 1], ['srv.takeaway', 'Para llevar', 1],
  ['glance.find', 'Encuéntrenos', 1], ['glance.mail', 'Envíenos un correo electrónico', 1], ['glance.call', 'Llámenos', 1],
  ['form.title', 'Envíenos su mensaje', 1], ['form.name', 'Su nombre', 1], ['form.err.name', 'Introduzca su nombre.', 1],
  ['form.email', 'Su correo electrónico', 1], ['form.err.email', 'Introduzca su dirección de correo electrónico.', 1],
  ['form.err.emailInvalid', 'Introduzca una dirección de correo electrónico válida', 1], ['form.phone', 'su teléfono', 1],
  ['form.err.phone', 'Introduzca su número de teléfono.', 1], ['form.err.phoneInvalid', 'Introduzca un número de teléfono válido', 1],
  ['form.subject', 'Asunto', 1], ['form.err.subject', 'Introduzca su asunto.', 1], ['form.message', 'Su mensaje', 1],
  ['form.err.message', 'Introduzca su mensaje.', 1], ['form.send', 'Enviar', 1], ['form.ok', 'Su mensaje ha sido enviado.', 1],
  ['form.ok2', 'Le contestaremos a la mayor brevedad.', 1], ['form.fail', 'Fallo en el envío del mensaje', 1],
  ['foot.legal', 'Aviso legal', 1], ['foot.privacy', 'Política de privacidad', 1], ['foot.cookies', 'Cambiar configuración de cookies', 1],
  ['ui.close', 'Cerrar', 1], ['langName', 'Español', 1]
];
const PAIRS = [['sec.menu', 'Nuestro', 1], ['sec.reserve', 'Haz tu', 1], ['sec.times', 'Nuestros', 1],
  ['sec.payment', 'Disponible', 1], ['sec.services', 'Nuestros', 2], ['sec.glance', 'Todo', 1]];
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const LEGAL = ['Nombre del negocio', 'Nombre y forma jurídica de la empresa', 'Nombre', 'Apellido', 'Dirección postal', 'Código postal',
  'Localidad', 'País', 'Número de teléfono', 'Dirección de correo electrónico', 'Registro', 'Número de registro',
  'Número de identificación fiscal', 'Responsable'];

function leaves(html) {
  const root = parse(html);
  const title = root.querySelector('head > title')?.text.trim() || null;
  root.querySelectorAll('script,style,svg,noscript,head').forEach((n) => n.remove());
  const list = [];
  const walk = (n) => n.childNodes.forEach((c) => {
    if (c.nodeType === 3) { const t = c.text.replace(/\s+/g, ' ').trim(); if (t) list.push(t); } else walk(c);
  });
  walk(root);
  return { title, list };
}

const indexOf = (list, text, nth = 1, from = 0) => {
  let seen = 0;
  for (let i = from; i < list.length; i++) if (list[i] === text && ++seen === nth) return i;
  throw new Error(`No se encuentra "${text}" (${nth}) en es`);
};

const pages = {};
for (const lang of LANGS) {
  const html = await fetch(SOURCE + lang, { headers: { 'User-Agent': 'MamaPizzaRedesign/1.0' } }).then((r) => r.text());
  pages[lang] = leaves(html);
}
const es = pages.es.list;
mkdirSync(out, { recursive: true });

for (const lang of LANGS) {
  const { title, list } = pages[lang];
  if (list.length !== es.length) console.warn(`[${lang}] ${list.length} textos frente a ${es.length} en es: revisar`);
  const at = (i) => list[i];
  const dict = {};
  dict.title = title || pages.es.title;
  for (const [key, text, nth] of SINGLE) dict[key] = at(indexOf(es, text, nth));
  for (const [key, text, nth] of PAIRS) { const i = indexOf(es, text, nth); dict[key] = [at(i), at(i + 1)]; }
  const lunes = indexOf(es, 'Lunes');
  dict.days = DAYS.map((d) => at(indexOf(es, d)));
  dict.clock = /AM|PM/.test(at(lunes + 1)) ? '12' : '24';
  const legalStart = indexOf(es, 'Aviso legal', 2);
  dict['legal.labels'] = LEGAL.map((l) => at(indexOf(es, l, 1, legalStart)));
  dict['ui.ourMenu'] = dict['sec.menu'].join(' ');
  Object.assign(dict, ui[lang]);
  if (lang !== 'es' && lang !== 'en') dict._review = ['ui.* (traducción nueva, no procede de la web actual)'];
  if (!title && lang !== 'es') dict._review = [...(dict._review || []), 'title (la web actual no tiene <title> en este idioma; se usa el de es)'];
  writeFileSync(new URL(`${lang}.json`, out), JSON.stringify(dict, null, 2) + '\n');
  console.log(`${lang}: ${Object.keys(dict).length} claves`);
}
