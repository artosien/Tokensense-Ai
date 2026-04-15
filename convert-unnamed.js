const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/images/blog';
const file = 'unnamed (2).png';
const outputName = 'turboquant-memory-crisis-infographic.webp';

(async () => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(inputDir, outputName);

    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(outputPath);

        console.log(`✓ ${file} → ${outputName}`);
        
        // Delete original file
        fs.unlinkSync(inputPath);
        console.log(`  Deleted original: ${file}`);
      } catch (err) {
        console.error(`✗ ${file}: ${err.message}`);
      }
    } else {
      console.warn(`! File not found: ${file}`);
    }
})();