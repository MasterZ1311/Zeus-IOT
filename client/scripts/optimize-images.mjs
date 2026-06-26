// One-off: gently optimise the brand logos for the web WITHOUT degrading them.
// No palette quantization (preserves gradients/detail), transparent background,
// square master at 512px. Run locally with: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

async function optimizeLogo(file) {
  const path = join(pub, file);
  if (!existsSync(path)) {
    console.log(`⚠ ${file} not found — skipping (save it into public/ first).`);
    return;
  }
  const input = readFileSync(path);
  const before = input.length;
  const output = await sharp(input)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })          // lossless, keeps full color/gradients
    .toBuffer();
  writeFileSync(path, output);
  console.log(`${file}: ${Math.round(before / 1024)}KB → ${Math.round(output.length / 1024)}KB`);
}

await optimizeLogo('logo.png');        // main emblem
await optimizeLogo('logo-loader.png'); // loading mascot

console.log('✓ logo optimization complete');
