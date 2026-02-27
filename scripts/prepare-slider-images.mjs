/**
 * Script to prepare properly matched before/after images for the comparison slider.
 * 
 * The user provided two images showing the same geographic area:
 * 1. Pure satellite view (wider area with road labels)
 * 2. Drone orthomosaic overlaid on satellite (same area, shows the scan boundary)
 * 
 * These need to be:
 * - Cropped to exactly the same boundaries
 * - Same dimensions for seamless slider operation
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '../client/public/assets/lhs-field');

async function prepareSliderImages() {
  console.log('Preparing slider images...\n');

  // The orthomosaic.png is the "after" image (drone scan overlaid on satellite)
  // We need to create a matching "before" that shows pure satellite of the SAME area
  
  const orthomosaicPath = path.join(assetsDir, 'orthomosaic.png');
  const orthomosaicInfo = await sharp(orthomosaicPath).metadata();
  
  console.log(`Orthomosaic (after) dimensions: ${orthomosaicInfo.width} x ${orthomosaicInfo.height}`);

  // The orthomosaic already has the correct crop - it shows the wider area with the drone overlay
  // This becomes our satellite-overlay.png (the "after" image)
  
  const satelliteOverlayPath = path.join(assetsDir, 'satellite-overlay.png');
  await sharp(orthomosaicPath)
    .toFile(satelliteOverlayPath + '.tmp');
  
  if (fs.existsSync(satelliteOverlayPath)) {
    fs.unlinkSync(satelliteOverlayPath);
  }
  fs.renameSync(satelliteOverlayPath + '.tmp', satelliteOverlayPath);
  console.log(`✓ Created satellite-overlay.png from orthomosaic`);

  // For the "before" image (reference.png), we need the pure satellite view
  // of the SAME geographic area. Since we don't have that exact image,
  // we'll note that the user needs to provide a matching satellite screenshot
  // OR we use what we have and acknowledge the geographic mismatch
  
  // For now, let's resize reference.png to match dimensions
  // The slider will work, but the geographic alignment won't be perfect
  const referencePath = path.join(assetsDir, 'reference.png');
  const referenceInfo = await sharp(referencePath).metadata();
  
  console.log(`Reference (before) dimensions: ${referenceInfo.width} x ${referenceInfo.height}`);

  // Resize reference to match orthomosaic dimensions
  await sharp(referencePath)
    .resize(orthomosaicInfo.width, orthomosaicInfo.height, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(referencePath + '.tmp');
  
  fs.unlinkSync(referencePath);
  fs.renameSync(referencePath + '.tmp', referencePath);
  console.log(`✓ Resized reference.png to ${orthomosaicInfo.width}x${orthomosaicInfo.height}`);

  console.log('\n✅ Images prepared for slider!');
  console.log('\nNote: For perfect geographic alignment, the "before" image should be');
  console.log('a satellite screenshot of the exact same area as the orthomosaic.');
}

prepareSliderImages().catch(console.error);


