// Genera la web estática completa en 16 idiomas: páginas, CSS, JS, imágenes, iconos, sitemap y robots.txt.
import { mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { LANGS, loadI18n, makeT } from '../src/lib/i18n.mjs';
import { pageShell } from '../src/templates/layout.mjs';
import { renderBody } from '../src/templates/page.mjs';
import { buildImages } from './images.mjs';
import { buildIcons } from './icons.mjs';
import { langPath } from '../src/templates/util.mjs';

const root = new URL('../', import.meta.url);
const CSS_ORDER = ['tokens', 'base', 'hero', 'carta', 'info', 'contacto', 'footer'];

function loadJSON(path) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(path, root)), 'utf8'));
}

function buildCss(outDir) {
  const css = CSS_ORDER.map((name) => readFileSync(fileURLToPath(new URL(`src/assets/css/${name}.css`, root)), 'utf8')).join('\n');
  writeFileSync(fileURLToPath(new URL('site.css', outDir)), css);
}

function buildJs(outDir) {
  const jsDir = new URL('js/', outDir);
  mkdirSync(fileURLToPath(jsDir), { recursive: true });
  cpSync(fileURLToPath(new URL('src/assets/js/', root)), fileURLToPath(jsDir), { recursive: true });
  const libDir = new URL('lib/', jsDir);
  mkdirSync(fileURLToPath(libDir), { recursive: true });
  cpSync(fileURLToPath(new URL('src/lib/hours.mjs', root)), fileURLToPath(new URL('hours.mjs', libDir)));
  cpSync(fileURLToPath(new URL('src/lib/form.mjs', root)), fileURLToPath(new URL('form.mjs', libDir)));
}

function sitemap(siteUrl) {
  const urls = LANGS.map((lang) => {
    const loc = siteUrl + langPath(lang);
    const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}${langPath(l)}"/>`).join('');
    return `<url><loc>${loc}</loc>${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/></url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

export async function build({ siteUrl, formKey, outDir = 'dist' } = {}) {
  siteUrl = siteUrl ?? process.env.SITE_URL;
  if (!siteUrl) throw new Error('SITE_URL es obligatoria');
  siteUrl = siteUrl.replace(/\/$/, '');
  formKey = formKey ?? process.env.WEB3FORMS_KEY ?? '';

  const outUrl = outDir instanceof URL ? outDir : new URL(`${String(outDir).replace(/\/$/, '')}/`, `file://${process.cwd()}/`);
  mkdirSync(fileURLToPath(outUrl), { recursive: true });

  const site = loadJSON('content/site.json');
  const carta = loadJSON('content/carta.json');
  const dicts = loadI18n(new URL('content/i18n/', root));

  for (const lang of LANGS) {
    const t = makeT(dicts, lang);
    const ctx = { t, site, carta, lang, dicts, formKey };
    const html = pageShell({ lang, t, siteUrl, body: renderBody(ctx), site, carta });
    const dir = lang === 'es' ? outUrl : new URL(`${lang}/`, outUrl);
    mkdirSync(fileURLToPath(dir), { recursive: true });
    writeFileSync(fileURLToPath(new URL('index.html', dir)), html);
  }

  const assetsDir = new URL('assets/', outUrl);
  mkdirSync(fileURLToPath(assetsDir), { recursive: true });
  buildCss(assetsDir);
  buildJs(assetsDir);
  await buildImages({ srcDir: new URL('assets-src/', root), outDir: assetsDir });
  await buildIcons({ outDir: assetsDir });

  writeFileSync(fileURLToPath(new URL('sitemap.xml', outUrl)), sitemap(siteUrl));
  writeFileSync(fileURLToPath(new URL('robots.txt', outUrl)), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await build({ outDir: new URL('../dist/', import.meta.url) });
    console.log('Build completo en dist/');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
