import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Seeds the database with sample portfolio items for testing
 *
 * Usage: npx tsx scripts/seed-sample-portfolio.ts
 */

const now = new Date().toISOString();
const useSqlite = process.env.USE_SQLITE === 'true';

const sampleItems = [
  {
    title: "Historic Church Photogrammetry",
    description: "Complete 3D capture of a 19th century church exterior and interior for historic preservation documentation. High-resolution model suitable for virtual tours and conservation planning.",
    category: "heritage",
    sketchfabModelId: null, // Add your Sketchfab model IDs
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["DJI Mavic 3 Pro", "RealityCapture", "Agisoft Metashape"],
    services: ["Aerial Mapping", "Photogrammetry", "3D Modeling"],
    featuredImage: null,
    images: [],
    published: true,
    featured: true,
  },
  {
    title: "Commercial Construction Site Mapping",
    description: "Monthly progress documentation for a 50,000 sq ft commercial development. Accurate elevation models and volume calculations for earthwork analysis.",
    category: "construction",
    sketchfabModelId: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["DJI Phantom 4 RTK", "Pix4D", "AutoCAD Civil 3D"],
    services: ["Drone Mapping", "Volumetric Analysis", "Progress Monitoring"],
    featuredImage: null,
    images: [],
    published: true,
    featured: true,
  },
  {
    title: "LiDAR Forest Canopy Analysis",
    description: "High-density LiDAR scan of 100-acre forested area for environmental assessment. Point cloud data processed for canopy height models and biomass estimation.",
    category: "lidar",
    sketchfabModelId: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["DJI Zenmuse L1", "CloudCompare", "QGIS"],
    services: ["LiDAR Scanning", "Environmental Surveying", "Data Analysis"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  },
  {
    title: "Luxury Estate Property Tour",
    description: "Complete property documentation including aerial overview, exterior details, and interior spaces. Created for real estate marketing and virtual tours.",
    category: "photogrammetry",
    sketchfabModelId: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["DJI Mini 3 Pro", "RealityCapture", "Blender"],
    services: ["Aerial Photography", "3D Modeling", "Virtual Tours"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  },
  {
    title: "Interior Office Space Scan",
    description: "Detailed interior scan of 10,000 sq ft office space for renovation planning. Includes accurate measurements and as-built documentation.",
    category: "interior",
    sketchfabModelId: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["Matterport Pro2", "Leica BLK360", "Revit"],
    services: ["Interior Scanning", "As-Built Documentation", "BIM Modeling"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  }
];

async function seedPortfolio() {
  try {
    console.log("🌱 Seeding portfolio with sample items...\n");

    for (const item of sampleItems) {
      console.log(`Adding: ${item.title}`);

      if (useSqlite) {
        // For SQLite: manually insert with JSON-stringified arrays
        await db.run(sql`
          INSERT INTO portfolio_items (
            title, description, category, sketchfab_model_id,
            model_file, model_format, video_file, video_format,
            tools, services, featured_image, images,
            published, featured, created_at
          ) VALUES (
            ${item.title},
            ${item.description},
            ${item.category},
            ${item.sketchfabModelId},
            ${item.modelFile},
            ${item.modelFormat},
            ${item.videoFile},
            ${item.videoFormat},
            ${JSON.stringify(item.tools)},
            ${JSON.stringify(item.services)},
            ${item.featuredImage},
            ${JSON.stringify(item.images)},
            ${item.published ? 1 : 0},
            ${item.featured ? 1 : 0},
            ${now}
          )
        `);
      } else {
        // For PostgreSQL: use Drizzle ORM with array support
        const { portfolioItems } = await import("../shared/schema.js");
        await db.insert(portfolioItems).values({
          ...item,
          createdAt: new Date(now)
        });
      }
    }

    console.log("\n✅ Successfully added", sampleItems.length, "portfolio items!");
    console.log("\n💡 To use real Sketchfab models:");
    console.log("   1. Upload your models to Sketchfab.com");
    console.log("   2. Get the model ID from the URL (e.g., sketchfab.com/3d-models/my-model-ABC123)");
    console.log("   3. Update the sketchfabModelId field in the database or this script");
    console.log("\n🌐 View your gallery at: http://localhost:5000/gallery\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding portfolio:", error);
    process.exit(1);
  }
}

seedPortfolio();
