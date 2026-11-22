/**
 * Update the Athletic Field portfolio item with correct image paths for the slider.
 * 
 * The slider component looks for images containing:
 * - 'reference' or 'baseline' for the "before" image
 * - 'satellite-overlay' or 'orthomosaic' for the "after" image
 */

import pg from 'pg';
const { Pool } = pg;

// Use the Neon production database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateAthleticImages() {
  const client = await pool.connect();
  
  try {
    console.log('Updating Athletic Field portfolio item images...\n');
    
    // First, check current state
    const checkResult = await client.query(
      `SELECT id, title, featured_image, images FROM portfolio_items WHERE title ILIKE '%athletic%field%'`
    );
    
    if (checkResult.rows.length === 0) {
      console.log('No Athletic Field portfolio item found!');
      return;
    }
    
    const item = checkResult.rows[0];
    console.log(`Found: ID ${item.id} - ${item.title}`);
    console.log(`Current featured_image: ${item.featured_image}`);
    console.log(`Current images: ${JSON.stringify(item.images)}`);
    
    // Update with the correct image paths for the slider
    const newImages = [
      '/assets/lhs-field/reference.png',           // Before: satellite view
      '/assets/lhs-field/satellite-overlay.png',   // After: drone orthomosaic overlay
      '/assets/lhs-field/orthomosaic.png',         // Full orthomosaic with context
      '/assets/lhs-field/dsm-heatmap.png'          // DSM elevation heatmap
    ];
    
    const newFeaturedImage = '/assets/lhs-field/orthomosaic.png';
    
    const updateResult = await client.query(
      `UPDATE portfolio_items 
       SET featured_image = $1, images = $2 
       WHERE id = $3 
       RETURNING id, title, featured_image, images`,
      [newFeaturedImage, newImages, item.id]
    );
    
    console.log('\n✅ Updated successfully!');
    console.log(`New featured_image: ${updateResult.rows[0].featured_image}`);
    console.log(`New images: ${JSON.stringify(updateResult.rows[0].images)}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateAthleticImages();


