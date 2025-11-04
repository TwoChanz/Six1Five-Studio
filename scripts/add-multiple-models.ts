import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Add multiple portfolio items at once
 */

const useSqlite = process.env.USE_SQLITE === 'true';
const now = new Date().toISOString();

const portfolioItems = [
  {
    title: "Luma AI NeRF Capture 1",
    description: "High-quality neural radiance field capture using Luma AI technology. This interactive 3D model showcases photorealistic rendering with accurate lighting and reflections, perfect for immersive virtual experiences.",
    category: "photogrammetry",
    sketchfabModelId: null,
    lumaEmbedUrl: "https://lumalabs.ai/capture/c000d017-1ab2-441a-93e8-6c5ee4783c03",
    polycamEmbedUrl: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["Luma AI", "NeRF Technology", "Mobile Capture"],
    services: ["3D NeRF Capture", "Photorealistic Rendering", "Interactive Visualization"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  },
  {
    title: "Luma AI NeRF Capture 2",
    description: "Advanced neural radiance field documentation demonstrating the power of Luma AI's cutting-edge capture technology. Features high-fidelity details and smooth camera movements for professional presentations.",
    category: "photogrammetry",
    sketchfabModelId: null,
    lumaEmbedUrl: "https://lumalabs.ai/capture/76ecb49e-3b3c-40d2-b47b-b7f89ef9aac2",
    polycamEmbedUrl: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["Luma AI", "NeRF Technology", "AI Processing"],
    services: ["NeRF Documentation", "Virtual Tours", "3D Visualization"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  },
  {
    title: "Featured Luma AI Project - Premium NeRF Capture",
    description: "Our flagship Luma AI neural radiance field project showcasing the pinnacle of modern 3D capture technology. This featured capture demonstrates photorealistic quality, seamless navigation, and immersive detail that sets the standard for professional reality capture.",
    category: "photogrammetry",
    sketchfabModelId: null,
    lumaEmbedUrl: "https://lumalabs.ai/capture/8e55f9bc-5520-455c-8cc3-5139749ad2a2",
    polycamEmbedUrl: null,
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["Luma AI Pro", "NeRF Technology", "Professional Capture Workflow"],
    services: ["Premium NeRF Capture", "Cinematic Visualization", "Professional Documentation"],
    featuredImage: null,
    images: [],
    published: true,
    featured: true, // Featured on homepage!
  },
  {
    title: "Polycam 3D Scan - Project 2",
    description: "Detailed 3D capture using Polycam mobile scanning technology. This model demonstrates the accessibility and quality of modern mobile photogrammetry for professional documentation and visualization.",
    category: "construction",
    sketchfabModelId: null,
    lumaEmbedUrl: null,
    polycamEmbedUrl: "https://poly.cam/capture/428AFBAA-425C-4D41-9A45-7D7EBF44C8F9",
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["Polycam", "LiDAR Scanner", "Mobile Photogrammetry"],
    services: ["Mobile 3D Scanning", "Quick Documentation", "Site Capture"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  },
  {
    title: "Polycam 3D Scan - Project 3",
    description: "Professional 3D documentation captured with Polycam technology. Showcases accurate geometry and texture detail for construction monitoring, real estate marketing, or digital preservation.",
    category: "construction",
    sketchfabModelId: null,
    lumaEmbedUrl: null,
    polycamEmbedUrl: "https://poly.cam/capture/CA40C0E6-58D1-4B7F-A2AE-81FFC1FB23C3",
    modelFile: null,
    modelFormat: null,
    videoFile: null,
    videoFormat: null,
    tools: ["Polycam", "Mobile LiDAR", "3D Scanning"],
    services: ["3D Site Documentation", "Digital Twin Creation", "Progress Monitoring"],
    featuredImage: null,
    images: [],
    published: true,
    featured: false,
  },
];

async function addMultipleItems() {
  try {
    console.log(`🌱 Adding ${portfolioItems.length} portfolio items...\n`);

    for (const item of portfolioItems) {
      console.log(`Adding: ${item.title}`);

      if (useSqlite) {
        await db.run(sql`
          INSERT INTO portfolio_items (
            title, description, category, sketchfab_model_id,
            luma_embed_url, polycam_embed_url,
            model_file, model_format, video_file, video_format,
            tools, services, featured_image, images,
            published, featured, created_at
          ) VALUES (
            ${item.title},
            ${item.description},
            ${item.category},
            ${item.sketchfabModelId},
            ${item.lumaEmbedUrl},
            ${item.polycamEmbedUrl},
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
        const { portfolioItems: portfolioTable } = await import("../shared/schema.js");
        await db.insert(portfolioTable).values({
          ...item,
          createdAt: new Date(now)
        });
      }
    }

    console.log("\n✅ Successfully added all portfolio items!");
    console.log(`\n📊 Portfolio Summary:`);
    console.log(`   • 3 Luma AI NeRF models (1 featured on homepage)`);
    console.log(`   • 2 Polycam 3D scans`);
    console.log(`\n💡 To update titles/descriptions:`);
    console.log(`   1. Edit entries directly in scripts/add-multiple-models.ts`);
    console.log(`   2. Or update via database queries`);
    console.log(`   3. Or wait for the admin panel feature`);
    console.log(`\n🌐 View your gallery at: http://localhost:5000/gallery\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding portfolio items:", error);
    process.exit(1);
  }
}

addMultipleItems();
