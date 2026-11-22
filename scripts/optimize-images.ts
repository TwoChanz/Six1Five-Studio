import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeImage(inputPath: string, outputPath: string, options: sharp.ResizeOptions = {}) {
  try {
    const info = await sharp(inputPath)
      .resize(options)
      .webp({ quality: 85 }) // Convert to WebP with 85% quality
      .toFile(outputPath);
    
    const inputStats = await fs.stat(inputPath);
    const outputStats = await fs.stat(outputPath);
    const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)}`);
    console.log(`  ${(inputStats.size / 1024 / 1024).toFixed(2)} MB → ${(outputStats.size / 1024 / 1024).toFixed(2)} MB (${savings}% smaller)`);
    console.log(`  Saved to: ${path.basename(outputPath)}\n`);
    
    return outputStats.size;
  } catch (error) {
    console.error(`✗ Failed to optimize ${inputPath}:`, error);
    throw error;
  }
}

async function createResponsiveVariants(inputPath: string, baseName: string, outputDir: string) {
  const sizes = [
    { suffix: '-mobile', width: 640 },    // Mobile
    { suffix: '-tablet', width: 1024 },   // Tablet
    { suffix: '-desktop', width: 1920 },  // Desktop
  ];
  
  console.log(`📐 Creating responsive variants for ${baseName}...`);
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${baseName}${size.suffix}.webp`);
    await optimizeImage(inputPath, outputPath, {
      width: size.width,
      fit: 'inside',
    });
  }
}

async function main() {
  const clientDir = path.resolve(__dirname, '../client/src/assets');
  
  console.log('🖼️  Optimizing images...\n');
  
  // Optimize logo-matrix-style.png (the biggest offender at 2.3MB)
  const logoMatrixInput = path.join(clientDir, 'logo-matrix-style.png');
  const logoMatrixOutput = path.join(clientDir, 'logo-matrix-style.webp');
  
  await optimizeImage(logoMatrixInput, logoMatrixOutput, {
    width: 1920, // Max width for hero sections
    height: 1080,
    fit: 'inside', // Maintain aspect ratio
  });
  
  // Create responsive variants for logo-matrix-style
  await createResponsiveVariants(logoMatrixInput, 'logo-matrix-style', clientDir);
  
  // Optimize other large PNGs to WebP
  const largePngs = [
    'logo-horizontal-final.png',
    'logo-circular-large.png',
  ];
  
  for (const filename of largePngs) {
    const inputPath = path.join(clientDir, filename);
    try {
      await fs.access(inputPath);
      const outputPath = path.join(clientDir, filename.replace('.png', '.webp'));
      await optimizeImage(inputPath, outputPath, {
        width: 1200,
        fit: 'inside',
      });
    } catch (error) {
      console.log(`⊘ Skipping ${filename} (not found or inaccessible)\n`);
    }
  }
  
  console.log('✅ Image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update component imports to use .webp versions');
  console.log('   2. Use responsive variants with <picture> element or srcSet');
  console.log('   3. Keep original .png files as fallbacks if needed');
}

main().catch(console.error);

