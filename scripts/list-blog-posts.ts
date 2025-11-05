import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

const useSqlite = process.env.USE_SQLITE === 'true';

async function listBlogPosts() {
  try {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM blog_posts ORDER BY created_at DESC`) as any[];
      console.log('\n📝 Blog Posts in Database:\n');
      results.forEach((post: any, index: number) => {
        console.log(`${index + 1}. ID: ${post.id}`);
        console.log(`   Title: ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Published: ${post.published}`);
        console.log(`   Created: ${post.created_at}`);
        console.log('');
      });
      console.log(`Total: ${results.length} blog posts\n`);
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Error listing blog posts:", error);
    process.exit(1);
  }
}

listBlogPosts();
