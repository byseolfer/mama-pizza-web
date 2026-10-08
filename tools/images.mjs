// Genera dist/assets/img/*, dist/assets/og.jpg y dist/assets/fonts/*.
// El mapa estático se compone una sola vez a partir de teselas de OpenStreetMap y se cachea en
// assets-src/map.png (ya oscurecido), para no volver a pedir teselas en cada build.
import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PHOTOS = ['pizza', 'hero', 'calientes', 'frios', 'hamburguesas', 'perritos', 'ensaladas', 'sandwiches'];
const PHOTO_WIDTHS = [480, 960, 1600];
const MAP_WIDTHS = [640, 1200];
// Tesela 16/{x}/{y}: cubre el negocio (Calle Parvillas Altas 6). Punto en el píxel (261,352) de un
// lienzo de 768x768 formado por las teselas x:32092-32094, y:24727-24729 (ver docs/decisiones.md).
const TILE_Z = 16, TILE_X0 = 32092, TILE_Y0 = 24727, MARKER_PX = { x: 261, y: 352 };
const USER_AGENT = 'MamaPizzaRedesign/1.0 (+mamapizza6@gmail.com)';

const PIN_SVG = (size, color) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 40 52">
<path d="M20 2C10.6 2 3 9.6 3 19c0 13 17 31 17 31s17-18 17-31C37 9.6 29.4 2 20 2Z" fill="${color}"/>
<circle cx="20" cy="19" r="8" fill="#fff"/></svg>`;

const toFile = (img, path, fmt, quality) => img.clone().toFormat(fmt, { quality }).toFile(path);

async function photos(srcDir, outDir) {
  const dir = fileURLToPath(new URL('img/', outDir));
  mkdirSync(dir, { recursive: true });
  for (const name of PHOTOS) {
    const src = sharp(fileURLToPath(new URL(`${name}.jpg`, srcDir)));
    for (const w of PHOTO_WIDTHS) {
      const resized = src.clone().resize({ width: w });
      await toFile(resized, `${dir}${name}-${w}.avif`, 'avif', 55);
      await toFile(resized, `${dir}${name}-${w}.webp`, 'webp', 72);
    }
  }
}

async function ogImage(srcDir, outDir) {
  mkdirSync(fileURLToPath(outDir), { recursive: true });
  const base = await sharp(fileURLToPath(new URL('hero.jpg', srcDir)))
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .modulate({ brightness: 0.82 })
    .toBuffer();
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#121310" stop-opacity=".92"/><stop offset=".55" stop-color="#121310" stop-opacity="0"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<text x="64" y="546" font-family="Arial, sans-serif" font-size="92" font-weight="900" letter-spacing="-2" fill="#F6F3EE">MAMA PIZZA</text>
</svg>`;
  await sharp(base).composite([{ input: Buffer.from(overlay) }]).jpeg({ quality: 85 }).toFile(fileURLToPath(new URL('og.jpg', outDir)));
}

async function fetchTile(x, y) {
  const res = await fetch(`https://tile.openstreetmap.org/${TILE_Z}/${x}/${y}.png`, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`No se pudo descargar la tesela ${x},${y}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function buildRawMap(cachePath) {
  if (existsSync(cachePath)) return;
  const composites = [];
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const buf = await fetchTile(TILE_X0 + dx, TILE_Y0 + dy);
      composites.push({ input: buf, left: dx * 256, top: dy * 256 });
      await new Promise((r) => setTimeout(r, 250)); // ritmo amable con el servidor de teselas
    }
  }
  const canvas = sharp({ create: { width: 768, height: 768, channels: 3, background: '#e8e4da' } }).composite(composites);
  // Aproxima el mapa oscuro de las maquetas: desaturado, oscurecido y con un tinte verde-noche.
  await canvas.grayscale().linear(0.62, 12).tint({ r: 38, g: 44, b: 40 }).png().toFile(cachePath);
}

async function mapImages(cachePath, outDir) {
  const dir = fileURLToPath(new URL('img/', outDir));
  mkdirSync(dir, { recursive: true });
  // Recorte 3:2 centrado en el marcador (768x512 dentro del lienzo de 768x768).
  const cropH = 512, top = Math.min(768 - cropH, Math.max(0, MARKER_PX.y - cropH / 2));
  const crop = sharp(cachePath).extract({ left: 0, top, width: 768, height: cropH });
  const markerY = MARKER_PX.y - top;
  for (const w of MAP_WIDTHS) {
    const h = Math.round((w * cropH) / 768);
    const scale = w / 768;
    const pin = Buffer.from(PIN_SVG(Math.round(44 * scale), '#E0412F'));
    const pinMeta = await sharp(pin).metadata();
    const base = await crop.clone().resize(w, h).toBuffer();
    const composed = sharp(base).composite([{
      input: pin, left: Math.round(MARKER_PX.x * scale - pinMeta.width / 2), top: Math.round(markerY * scale - pinMeta.height)
    }]);
    await toFile(composed, `${dir}map-${w}.avif`, 'avif', 60);
    await toFile(composed, `${dir}map-${w}.webp`, 'webp', 78);
  }
}

async function fonts(outDir) {
  const dir = fileURLToPath(new URL('fonts/', outDir));
  mkdirSync(dir, { recursive: true });
  const pkg = new URL('../node_modules/@fontsource-variable/archivo/files/', import.meta.url);
  copyFileSync(fileURLToPath(new URL('archivo-latin-wdth-normal.woff2', pkg)), `${dir}archivo-latin.woff2`);
  copyFileSync(fileURLToPath(new URL('archivo-latin-ext-wdth-normal.woff2', pkg)), `${dir}archivo-latin-ext.woff2`);
}

export async function buildImages({ srcDir, outDir }) {
  const src = srcDir instanceof URL ? srcDir : new URL(srcDir.endsWith('/') ? srcDir : srcDir + '/', import.meta.url);
  const out = outDir instanceof URL ? outDir : new URL(outDir.endsWith('/') ? outDir : outDir + '/', import.meta.url);
  mkdirSync(fileURLToPath(out), { recursive: true });
  const mapCache = fileURLToPath(new URL('../assets-src/map.png', import.meta.url));
  mkdirSync(fileURLToPath(new URL('../assets-src/', import.meta.url)), { recursive: true });
  await Promise.all([photos(src, out), ogImage(src, out), fonts(out)]);
  await buildRawMap(mapCache);
  await mapImages(mapCache, out);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await buildImages({ srcDir: new URL('../assets-src/', import.meta.url), outDir: new URL('../dist/assets/', import.meta.url) });
  console.log('Imágenes generadas en dist/assets/');
}
