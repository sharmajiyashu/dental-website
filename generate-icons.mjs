// generate-icons.mjs  — run with: node generate-icons.mjs
import sharp from 'sharp';
import { writeFileSync } from 'fs';

// Teal gradient icon SVG source
const svgSrc = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#g)"/>
  <text x="256" y="320" font-family="Arial,sans-serif" font-size="300" font-weight="bold"
        text-anchor="middle" fill="white">H</text>
  <circle cx="360" cy="140" r="44" fill="white" opacity="0.3"/>
  <circle cx="152" cy="380" r="28" fill="white" opacity="0.2"/>
</svg>`);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(svgSrc)
    .resize(size, size)
    .png()
    .toFile(`public/icon-${size}x${size}.png`);
  console.log(`✅ icon-${size}x${size}.png`);
}

// Also write a shortcut icon
await sharp(svgSrc).resize(96, 96).png().toFile('public/shortcut-icon.png');
console.log('✅ shortcut-icon.png');
console.log('Done! All icons generated in /public');
