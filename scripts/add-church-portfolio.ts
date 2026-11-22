import 'dotenv/config';
import { db } from "../server/db.js";
import { portfolioItems } from "../shared/schema.js";

const churchProject = {
  title: "Historic Church Aerial Photogrammetry | Complete 3D Documentation",
  description: `Professional drone-based photogrammetry scan of a historic church in Middle Tennessee. This comprehensive project includes 179 aerial photographs processed through RealityCapture to create a highly detailed 3D model with millimeter-level accuracy.

The deliverables include an ultra-high-resolution 3D mesh (568MB), 8K texture atlas, and cinematic flythrough video. This project demonstrates the power of aerial photogrammetry for heritage documentation, architectural preservation, and virtual tourism applications.

Captured on October 3, 2023, using DJI drone equipment with automated flight planning for complete coverage of the structure and surrounding grounds.`,
  category: "heritage",
  tools: [
    "DJI Drone",
    "RealityCapture",
    "Aerial Photogrammetry",
    "8K Texture Mapping"
  ],
  services: [
    "3D Model (GLB format)",
    "8K Texture Atlas",
    "Flythrough Video Animation",
    "Orthomosaic Imagery",
    "Heritage Documentation"
  ],
  featuredImage: "/assets/church/church-cover-8k.png",
  modelFile: "/assets/church/church-model.glb",
  modelFormat: "glb",
  videoFile: "/assets/church/church-walkthrough.mp4",
  videoFormat: "mp4",
  published: true,
  featured: true,
  isConceptStudy: false,
};

async function addChurchPortfolio() {
  try {
    console.log("🐘 Adding Historic Church portfolio item...");

    const result = await db.insert(portfolioItems).values(churchProject).returning();

    console.log("✅ Portfolio item added successfully!");
    console.log(JSON.stringify(result[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding portfolio item:", error);
    process.exit(1);
  }
}

addChurchPortfolio();
