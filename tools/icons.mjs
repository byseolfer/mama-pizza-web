// Genera dist/assets/icons.svg: un sprite con los iconos de Phosphor (peso "bold", una sola familia)
// y los logotipos de Simple Icons usados en el pie (tripAdvisor, Facebook).
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PHOSPHOR = ['phone', 'book-open-text', 'list', 'x', 'map-pin', 'map-trifold', 'envelope-simple', 'money',
  'credit-card', 'snowflake', 'bag', 'scissors', 'file-pdf', 'list-bullets', 'paper-plane-tilt'];
const SIMPLE_ICONS = { tripadvisor: 'siTripadvisor', facebook: 'siFacebook' };

function phosphorSymbol(name) {
  const path = fileURLToPath(new URL(`../node_modules/@phosphor-icons/core/assets/bold/${name}-bold.svg`, import.meta.url));
  const svg = readFileSync(path, 'utf8');
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<symbol id="${name}" viewBox="${viewBox}">${inner}</symbol>`;
}

async function simpleIconSymbol(name, exportName) {
  const mod = await import('simple-icons');
  const icon = mod[exportName];
  if (!icon) throw new Error(`Icono no encontrado en simple-icons: ${exportName}`);
  return `<symbol id="${name}" viewBox="0 0 24 24"><path d="${icon.path}"/></symbol>`;
}

export async function buildIcons({ outDir }) {
  const dir = outDir instanceof URL ? outDir : new URL(outDir.endsWith('/') ? outDir : outDir + '/', import.meta.url);
  mkdirSync(fileURLToPath(dir), { recursive: true });
  const symbols = [
    ...PHOSPHOR.map(phosphorSymbol),
    ...(await Promise.all(Object.entries(SIMPLE_ICONS).map(([name, exp]) => simpleIconSymbol(name, exp))))
  ];
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>\n`;
  writeFileSync(fileURLToPath(new URL('icons.svg', dir)), sprite);
  return fileURLToPath(new URL('icons.svg', dir));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = await buildIcons({ outDir: new URL('../dist/assets/', import.meta.url) });
  console.log('icons.svg ->', out);
}
