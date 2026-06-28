const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const QUALITY = 80;

let totalOriginalSize = 0;
let totalWebpSize = 0;
let convertedCount = 0;
let skippedCount = 0;

async function convertFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.includes(ext)) return;

  const webpPath = filePath.replace(/(\.jpg|\.jpeg|\.png)$/i, '.webp');
  if (fs.existsSync(webpPath)) {
    skippedCount++;
    return;
  }

  const originalSize = fs.statSync(filePath).size;

  try {
    await sharp(filePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const webpSize = fs.statSync(webpPath).size;
    totalOriginalSize += originalSize;
    totalWebpSize += webpSize;
    convertedCount++;
    const pct = ((1 - webpSize / originalSize) * 100).toFixed(1);

    process.stdout.write(`\rConverted: ${convertedCount} | Skipped: ${skippedCount} | Saved: ${pct}% on ${path.basename(filePath)}`);
  } catch (err) {
    process.stdout.write(`\nError converting ${filePath}: ${err.message}`);
  }
}

async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else {
      await convertFile(fullPath);
    }
  }
}

(async () => {
  console.log('Converting images to WebP...\n');
  const start = Date.now();
  await walkDir(IMAGES_DIR);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log('\n\n=== RESULTS ===');
  console.log(`Converted: ${convertedCount} images`);
  console.log(`Skipped (already WebP): ${skippedCount} files`);
  console.log(`Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP size: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${(totalOriginalSize - totalWebpSize) / 1024 / 1024 .toFixed(2)} MB (${((1 - totalWebpSize / totalOriginalSize) * 100).toFixed(1)}%)`);
  console.log(`Time: ${elapsed}s`);
})();
