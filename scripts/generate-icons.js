import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgBuffer = readFileSync(resolve(__dirname, '../public/favicon.svg'));

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(resolve(__dirname, `../public/icon${size}.png`));
    console.log(`Generated icon${size}.png`);
  }
}

generateIcons().catch((err) => {
  console.error(err);
  process.exit(1);
});
