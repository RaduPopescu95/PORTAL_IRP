const fs = require('fs');
const path = require('path');

// Definiția SVG-ului principal
const createSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2.2}" fill="#007bff" stroke="#ffffff" stroke-width="${size/24}"/>
  
  <!-- IRP Text -->
  <text x="${size/2}" y="${size/2.3}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="${size/7}" fill="white">IRP</text>
  
  <!-- Document icon -->
  <rect x="${size/2.7}" y="${size/1.8}" width="${size/6}" height="${size/4.8}" rx="${size/96}" fill="white" opacity="0.9"/>
  <rect x="${size/2.6}" y="${size/1.75}" width="${size/8}" height="${size/96}" fill="#007bff"/>
  <rect x="${size/2.6}" y="${size/1.67}" width="${size/9.6}" height="${size/96}" fill="#007bff"/>
  <rect x="${size/2.6}" y="${size/1.6}" width="${size/8}" height="${size/96}" fill="#007bff"/>
  <rect x="${size/2.6}" y="${size/1.54}" width="${size/12}" height="${size/96}" fill="#007bff"/>
  
  <!-- Plus icon -->
  <rect x="${size/1.78}" y="${size/1.67}" width="${size/16}" height="${size/96}" fill="white"/>
  <rect x="${size/1.7}" y="${size/1.75}" width="${size/96}" height="${size/16}" fill="white"/>
</svg>
`;

// Dimensiunile necesare pentru PWA
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Creează directorul pentru iconuri dacă nu există
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generează iconurile SVG
sizes.forEach(size => {
  const svgContent = createSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated: ${filename}`);
});

// Creează favicon SVG
const faviconSVG = createSVG(32);
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), faviconSVG.trim());
console.log('Generated: favicon.svg');

// Creează fișierul browserconfig.xml pentru Windows
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/icons/icon-144x144.svg"/>
            <TileColor>#007bff</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

fs.writeFileSync(path.join(iconsDir, 'browserconfig.xml'), browserConfig);
console.log('Generated: browserconfig.xml');

console.log('\n✅ All PWA icons generated successfully!');
console.log('\n📝 Next steps:');
console.log('1. Convert SVG files to PNG using an online tool or ImageMagick');
console.log('2. Replace the SVG references in manifest.json with PNG files');
console.log('3. Test the PWA installation on different devices'); 