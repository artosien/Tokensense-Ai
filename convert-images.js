const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/blog';

const files = fs.readdirSync(inputDir)
  .filter(f => /\.(png|jpg|jpeg)$/i.test(f));

console.log(`Found ${files.length} images to convert...`);

(async () => {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(inputDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

    try {
      await sharp(inputPath)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const oldSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const savings = (((oldSize - newSize) / oldSize) * 100).toFixed(1);

      console.log(`✓ ${file} → ${savings}% smaller`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  console.log('\nDone! You can now delete the original .png files.');
})();