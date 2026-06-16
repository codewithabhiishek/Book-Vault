import sharp from 'sharp';
import fs from 'fs';

async function convert() {
  try {
    const svgBuffer = fs.readFileSync('public/favicon.svg');
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
    console.log('Successfully converted favicon.svg to public/apple-touch-icon.png (180x180)!');
  } catch (err) {
    console.error('Failed to convert icon:', err);
  }
}

convert();
