// One-off: render public/og-image.svg → public/og-image.png (1200x630)
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = join(__dirname, '..', 'public');

const svg = readFileSync(join(pub, 'og-image.svg'));
await sharp(svg, { density: 144 })
  .resize(1200, 630)
  .png()
  .toFile(join(pub, 'og-image.png'));

console.log('✓ og-image.png generated');
