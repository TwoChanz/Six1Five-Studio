import { db } from "../server/db";
import { portfolioItems } from "../shared/schema";

async function listAll() {
  try {
    const items = await db
      .select({
        id: portfolioItems.id,
        title: portfolioItems.title,
        category: portfolioItems.category,
        published: portfolioItems.published,
        isConceptStudy: portfolioItems.isConceptStudy,
        coverImage: portfolioItems.coverImage,
      })
      .from(portfolioItems)
      .orderBy(portfolioItems.id);

    console.log("\nAll portfolio items in database:");
    console.log("=====================================");
    items.forEach(item => {
      console.log(`ID ${item.id}: ${item.title}`);
      console.log(`  Category: ${item.category}`);
      console.log(`  Published: ${item.published}`);
      console.log(`  Concept Study: ${item.isConceptStudy}`);
      console.log(`  Cover Image: ${item.coverImage}`);
      console.log("");
    });
    console.log(`Total items: ${items.length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

listAll();
