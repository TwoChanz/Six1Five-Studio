import { db } from '../server/db.js';
import { portfolioItems } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// IDs of featured projects without cover images
const projectsToUnfeatured = [1, 2, 16, 17];

async function unfeaturedProjects() {
  console.log('Unfeaturing projects without cover images...\n');

  for (const id of projectsToUnfeatured) {
    const result = await db
      .update(portfolioItems)
      .set({ featured: false })
      .where(eq(portfolioItems.id, id))
      .returning();

    if (result.length > 0) {
      console.log(`✓ Unfeatured: ${result[0].title} (ID: ${id})`);
    } else {
      console.log(`✗ Not found: ID ${id}`);
    }
  }

  console.log('\nDone! Only projects with cover images are now featured.');
  process.exit(0);
}

unfeaturedProjects().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
