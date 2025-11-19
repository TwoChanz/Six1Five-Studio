import 'dotenv/config';
import { db } from '../server/db.js';
import { portfolioItems } from '../shared/schema.js';

/**
 * Migrate the hard-coded Parthenon case study page to a database entry
 * This allows it to be managed via the admin dashboard like other portfolio items
 */

async function migrateParthenonStudy() {
  console.log('🔄 Migrating Parthenon concept study to database...\n');

  try {
    const parthenonStudy = {
      title: 'Nashville Parthenon',
      description: `Architectural Site Analysis & Solar Retrofit Strategy

A comprehensive conceptual analysis demonstrating solar path evaluation, structural assessment, and sustainable retrofit methodology for historic landmark buildings.

This study explores architectural site analysis techniques including:
- Sun path modeling and seasonal solar exposure analysis
- Structural load assessment for photovoltaic integration
- Sustainable retrofit strategies for heritage buildings
- Environmental analysis workflows for site documentation

While not a traditional reality capture project, this demonstrates the analytical and visualization expertise that complements scanning services — showcasing how environmental analysis and building systems knowledge inform comprehensive site documentation workflows.`,

      category: 'heritage',
      tools: ['Solar Analysis', 'Structural Assessment', 'BIM', 'Environmental Modeling'],
      services: ['Architectural Analysis', 'Site Assessment', 'Sustainable Design'],

      // Concept study flag
      isConceptStudy: true,

      // Publishing settings
      published: true,
      featured: false,

      // Note: The original page had extensive interactive content
      // For full content, the original page can be preserved or content expanded here
      featuredImage: null, // Add an image URL if available
      images: [],

      // No 3D models for this study
      sketchfabModelId: null,
      lumaEmbedUrl: null,
      polycamEmbedUrl: null,
      modelFile: null,
      modelFormat: null,
      videoFile: null,
      videoFormat: null,
    };

    const result = await db.insert(portfolioItems).values(parthenonStudy).returning();

    console.log('✅ Successfully migrated Parthenon study!');
    console.log('📝 Database ID:', result[0].id);
    console.log('🏛️ Title:', result[0].title);
    console.log('📂 Category:', result[0].category);
    console.log('🎓 Concept Study:', result[0].isConceptStudy ? 'Yes' : 'No');
    console.log('✨ Published:', result[0].published ? 'Yes' : 'No');
    console.log('\n🎉 Migration complete! You can now manage this study via the admin dashboard at /admin');
    console.log('💡 The original /case-study/parthenon route can now be removed.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateParthenonStudy();
