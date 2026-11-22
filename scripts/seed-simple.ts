import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

const now = new Date().toISOString();
const useSqlite = process.env.USE_SQLITE === 'true';

const sampleItems = [
  {
    title: "Historic Church Photogrammetry",
    description: "Complete 3D capture of a 19th century church exterior and interior for historic preservation documentation.",
    category: "heritage",
    tools: ["DJI Mavic 3 Pro", "RealityCapture"],
    services: ["Aerial Mapping", "Photogrammetry"],
    published: true,
    featured: true,
  },
  {
    title: "Commercial Construction Site",
    description: "Monthly progress documentation for a 50,000 sq ft commercial development.",
    category: "construction",
    tools: ["DJI Phantom 4 RTK", "Pix4D"],
    services: ["Drone Mapping", "Progress Monitoring"],
    published: true,
    featured: true,
  },
  {
    title: "LiDAR Forest Analysis",
    description: "High-density LiDAR scan of forested area for environmental assessment.",
    category: "lidar",
    tools: ["DJI Zenmuse L1", "CloudCompare"],
    services: ["LiDAR Scanning", "Data Analysis"],
    published: true,
    featured: false,
  }
];

async function seed() {
  try {
    console.log("🌱 Seeding...\n");

    for (const item of sampleItems) {
      console.log(`Adding: ${item.title}`);

      if (useSqlite) {
        // For SQLite: manually insert with JSON-stringified arrays
        await db.run(sql`
          INSERT INTO portfolio_items (
            title, description, category, tools, services,
            published, featured, created_at
          ) VALUES (
            ${item.title},
            ${item.description},
            ${item.category},
            ${JSON.stringify(item.tools)},
            ${JSON.stringify(item.services)},
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

    console.log("\n✅ Done! Visit http://localhost:5000/gallery\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
