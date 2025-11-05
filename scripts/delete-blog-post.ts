import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

const useSqlite = process.env.USE_SQLITE === 'true';

async function deleteBlogPost(id: number) {
  try {
    console.log(`Deleting blog post with ID: ${id}...`);

    if (useSqlite) {
      await db.run(sql`DELETE FROM blog_posts WHERE id = ${id}`);
    }

    console.log(`✅ Blog post ID ${id} deleted successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting blog post:", error);
    process.exit(1);
  }
}

// Get ID from command line argument
const id = parseInt(process.argv[2]);
if (!id || isNaN(id)) {
  console.error("❌ Please provide a blog post ID");
  console.error("Usage: npx tsx scripts/delete-blog-post.ts <id>");
  process.exit(1);
}

deleteBlogPost(id);
