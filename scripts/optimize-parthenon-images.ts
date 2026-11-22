import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const parthenonDir = 'client/public/assets/parthenon';

const imagesToOptimize = [
  'Phase-01_Photo_EastElevation.png',
  'Phase-02_LineDrawing.png',
  'Phase-03_Axonometric.png',
  'Phase-04_LoadPaths.png',
  'Phase-05_SolarStudy.png',
  'Phase-06_SunPathPlan.png',
  'Phase-08_SolarRetrofit.png',
];

async function optimizeImages() {
  console.log('🎨 Optimizing Parthenon Concept Study Images\n');
  console.log('═'.repeat(60));

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const imageName of imagesToOptimize) {
    const inputPath = path.join(parthenonDir, imageName);
    const tempPath = path.join(parthenonDir, `temp_${imageName}`);

    try {
      // Get original file size
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;
      totalOriginalSize += originalSize;

      console.log(`\n📸 ${imageName}`);
      console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

      // Optimize image
      await sharp(inputPath)
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({
          quality: 85,
          compressionLevel: 9,
          palette: true, // Use 8-bit palette if possible
        })
        .toFile(tempPath);

      // Get optimized file size
      const optimizedStats = await fs.stat(tempPath);
      const optimizedSize = optimizedStats.size;
      totalOptimizedSize += optimizedSize;

      const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(`   Optimized: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Reduction: ${reduction}%`);

      // Replace original with optimized
      await fs.unlink(inputPath);
      await fs.rename(tempPath, inputPath);

      console.log(`   ✅ Saved`);
    } catch (error) {
      console.error(`   ❌ Error optimizing ${imageName}:`, error.message);

      // Clean up temp file if it exists
      try {
        await fs.unlink(tempPath);
      } catch {}
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total Optimized Size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total Reduction: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`   Savings: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log('');
}

// Clean up placeholder files
async function cleanupPlaceholders() {
  console.log('\n🧹 Cleaning up placeholder files\n');
  console.log('═'.repeat(60));

  const files = await fs.readdir(parthenonDir);
  const placeholders = files.filter(f => f.startsWith('20251026_'));

  for (const placeholder of placeholders) {
    const filePath = path.join(parthenonDir, placeholder);
    try {
      await fs.unlink(filePath);
      console.log(`   ✅ Removed: ${placeholder}`);
    } catch (error) {
      console.error(`   ❌ Error removing ${placeholder}:`, error.message);
    }
  }

  console.log('');
}

// Run optimization
optimizeImages()
  .then(() => cleanupPlaceholders())
  .then(() => {
    console.log('✨ All done!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
