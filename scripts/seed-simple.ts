import 'dotenv/config';
import { db } from "../server/db.js";
import { portfolioItems } from "../shared/schema.js";

const now = new Date();

const sampleItems = [
  {
    title: "Historic Church Photogrammetry",
    description: "Complete 3D capture of a 19th century church exterior and interior for historic preservation documentation.",
    category: "heritage",
    tools: ["DJI Mavic 3 Pro", "RealityCapture"],
    services: ["Aerial Mapping", "Photogrammetry"],
    published: true,
    featured: true,
    createdAt: now
  },
  {
    title: "Commercial Construction Site",
    description: "Monthly progress documentation for a 50,000 sq ft commercial development.",
    category: "construction",
    tools: ["DJI Phantom 4 RTK", "Pix4D"],
    services: ["Drone Mapping", "Progress Monitoring"],
    published: true,
    featured: true,
    createdAt: now
  },
  {
    title: "LiDAR Forest Analysis",
    description: "High-density LiDAR scan of forested area for environmental assessment.",
    category: "lidar",
    tools: ["DJI Zenmuse L1", "CloudCompare"],
    services: ["LiDAR Scanning", "Data Analysis"],
    published: true,
    featured: false,
    createdAt: now
  }
];

async function seed() {
  try {
    console.log("🌱 Seeding...\n");
    for (const item of sampleItems) {
      console.log(`Adding: ${item.title}`);
      await db.insert(portfolioItems).values(item);
    }
    console.log("\n✅ Done! Visit http://localhost:5000/gallery\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();
