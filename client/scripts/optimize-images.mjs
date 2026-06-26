// One-off: compress/resize the heavy public images for fast web loading.
// Run locally with: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

async function process(file, transform) {
  const path = join(pub, file);
  const input = readFileSync(path);
  const before = input.length;
  const output = await transform(sharp(input)).toBuffer();
  writeFileSync(path, output);
  console.log(`${file}: ${Math.round(before / 1024)}KB → ${Math.round(output.length / 1024)}KB`);
}

// Logo: used as nav/footer mark + PWA icon (512) + preloader. Square, transparent.
await process('logo.png', (s) =>
  s.resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
   .png({ compressionLevel: 9, quality: 80, palette: true })
);

// Project preview images: displayed at ~200–400px. 800px wide is plenty for retina.
for (const f of ['iot_hero.png', 'ble_tracker_preview.png', 'hospital_management_preview.png']) {
  await process(f, (s) =>
    s.resize(800, null, { withoutEnlargement: true }).png({ compressionLevel: 9, quality: 78, palette: true })
  );
}

await process('digital_olympus.jpg', (s) =>
  s.resize(800, null, { withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true })
);

console.log('✓ image optimization complete');
