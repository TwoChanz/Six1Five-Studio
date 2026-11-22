import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Update the featured Luma AI project with Floyd Stadium details
 */

async function updateFloydStadium() {
  try {
    console.log("🔧 Updating featured Luma AI project with Floyd Stadium details...\n");

    const updatedData = {
      title: "Floyd Stadium – MTSU | Drone Photogrammetry Scan",
      description: "This large-scale photogrammetry model captures Floyd Stadium, home of the Middle Tennessee State University Blue Raiders, in full detail. Captured in December 2023, the dataset covers the entire field, surrounding seating, track lines, and adjacent terrain. Using a DJI Mini 4 Pro and a high-resolution flight pattern, this model highlights the power of aerial mapping for educational institutions, facilities management, and digital archiving of sports infrastructure.",
      category: "construction",
      tools: ["DJI Mini 4 Pro", "DroneLink", "RealityCapture", "CloudCompare", "Sketchfab"],
      services: ["Stadium-scale Drone Mapping", "Orthophoto & 3D Textured Mesh", "Reality Capture Demonstration", "Digital Twin Generation", "BIM Integration Ready"],
    };

    // Update portfolio item ID 9 (the featured Luma AI entry)
    await db.run(sql`
      UPDATE portfolio_items
      SET
        title = ${updatedData.title},
        description = ${updatedData.description},
        category = ${updatedData.category},
        tools = ${JSON.stringify(updatedData.tools)},
        services = ${JSON.stringify(updatedData.services)}
      WHERE id = 9
    `);

    console.log("✅ Floyd Stadium project updated successfully!");
    console.log("\n📋 Updated Details:");
    console.log(`   Title: ${updatedData.title}`);
    console.log(`   Category: ${updatedData.category}`);
    console.log(`   Featured: Yes (homepage)`);
    console.log(`   Platform: Luma AI NeRF`);
    console.log(`   URL: https://lumalabs.ai/capture/8e55f9bc-5520-455c-8cc3-5139749ad2a2`);
    console.log("\n🌐 View on homepage: http://localhost:5000");
    console.log("🌐 View in gallery: http://localhost:5000/gallery\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating Floyd Stadium project:", error);
    process.exit(1);
  }
}

updateFloydStadium();
