import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  process.exit(1);
}

async function updateAthleticField() {
  try {
    const sql = neon(DATABASE_URL);
    
    // Find the Athletic Field project
    const items = await sql`
      SELECT id, title, "featuredImage", images
      FROM portfolio_items
      WHERE title ILIKE '%Athletic Field%'
    `;
    
    if (items.length === 0) {
      console.log("Athletic Field project not found!");
      process.exit(1);
    }
    
    const item = items[0];
    console.log("Found project:", item.title, "(ID:", item.id, ")");
    console.log("Current featuredImage:", item.featuredImage);
    console.log("Current images:", item.images);
    
    // Update with the EXISTING images that are already deployed
    const newFeaturedImage = "/assets/lhs-field/satellite-overlay.png";
    const newImages = [
      "/assets/lhs-field/reference.png",        // Google satellite baseline (before)
      "/assets/lhs-field/satellite-overlay.png", // Drone orthomosaic (after)
      "/assets/lhs-field/orthomosaic.png",       // Full area view
      "/assets/lhs-field/dsm-heatmap.png"        // Elevation heatmap
    ];
    
    await sql`
      UPDATE portfolio_items
      SET 
        "featuredImage" = ${newFeaturedImage},
        images = ${newImages}
      WHERE id = ${item.id}
    `;
    
    console.log("\n✅ Updated Athletic Field project:");
    console.log("  New featuredImage:", newFeaturedImage);
    console.log("  New images:", newImages);
    
    // Verify the update
    const updated = await sql`
      SELECT id, title, "featuredImage", images
      FROM portfolio_items
      WHERE id = ${item.id}
    `;
    
    console.log("\nVerification:");
    console.log(JSON.stringify(updated[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateAthleticField();
