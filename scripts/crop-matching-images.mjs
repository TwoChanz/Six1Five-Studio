/**
 * Script to prepare matching before/after images for the comparison slider.
 * 
 * The goal is to have two images of identical dimensions covering the same geographic area:
 * 1. reference.png - Pure satellite imagery (the "before")
 * 2. satellite-overlay.png - Drone orthomosaic overlaid on satellite (the "after")
 * 
 * Since the orthomosaic.png already has the correct crop showing the drone scan,
 * we'll use that as our "after" image and need to prepare a matching "before".
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../client/public/assets/lhs-field');

async function prepareMatchingImages() {
  console.log('Preparing matching images for comparison slider...\n');

  // Get info about the orthomosaic (our "after" reference)
  const orthomosaicPath = path.join(assetsDir, 'orthomosaic.png');
  const orthomosaicInfo = await sharp(orthomosaicPath).metadata();
  
  console.log(`Orthomosaic dimensions: ${orthomosaicInfo.width} x ${orthomosaicInfo.height}`);

  // Get info about the current reference image
  const referencePath = path.join(assetsDir, 'reference.png');
  const referenceInfo = await sharp(referencePath).metadata();
  
  console.log(`Reference dimensions: ${referenceInfo.width} x ${referenceInfo.height}`);

  // The orthomosaic.png is the wider view with drone overlay - this becomes satellite-overlay.png
  // We need to resize/crop reference.png to match the orthomosaic dimensions exactly
  
  // Since the images cover different geographic extents, we have two options:
  // 1. Use the orthomosaic as-is (shows context + drone scan) as "after"
  // 2. Create a matching "before" by using the same satellite base without the overlay
  
  // For the slider to work well, both images need identical dimensions
  // The orthomosaic already shows the satellite background, so we'll:
  // - Copy orthomosaic.png to satellite-overlay.png (this is the "after" showing the drone scan)
  // - The reference.png needs to be the same satellite view WITHOUT the drone overlay
  
  // Since we can't easily separate the overlay from the orthomosaic, 
  // we'll resize the reference to match the orthomosaic dimensions
  // This ensures the slider works, though the exact geographic alignment may vary slightly
  
  const targetWidth = orthomosaicInfo.width;
  const targetHeight = orthomosaicInfo.height;

  // Copy orthomosaic to satellite-overlay (this is our "after" image)
  const overlayPath = path.join(assetsDir, 'satellite-overlay.png');
  await sharp(orthomosaicPath)
    .toFile(overlayPath + '.new');
  
  // Replace the file
  if (fs.existsSync(overlayPath)) {
    fs.unlinkSync(overlayPath);
  }
  fs.renameSync(overlayPath + '.new', overlayPath);
  console.log(`\n✓ Saved satellite-overlay.png (${targetWidth}x${targetHeight})`);

  // Resize reference to match (maintaining aspect ratio and cropping to fit)
  await sharp(referencePath)
    .resize(targetWidth, targetHeight, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(referencePath + '.new');
  
  // Replace the file
  fs.unlinkSync(referencePath);
  fs.renameSync(referencePath + '.new', referencePath);
  console.log(`✓ Resized reference.png to match (${targetWidth}x${targetHeight})`);

  // Verify final dimensions
  const finalRef = await sharp(path.join(assetsDir, 'reference.png')).metadata();
  const finalOverlay = await sharp(path.join(assetsDir, 'satellite-overlay.png')).metadata();
  
  console.log('\n--- Final Image Dimensions ---');
  console.log(`reference.png: ${finalRef.width} x ${finalRef.height}`);
  console.log(`satellite-overlay.png: ${finalOverlay.width} x ${finalOverlay.height}`);
  
  if (finalRef.width === finalOverlay.width && finalRef.height === finalOverlay.height) {
    console.log('\n✅ Images are now matching dimensions - slider will be seamless!');
  } else {
    console.log('\n⚠️ Dimensions still differ - manual adjustment may be needed');
  }
}

prepareMatchingImages().catch(console.error);


