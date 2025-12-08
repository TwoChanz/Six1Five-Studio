import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_kOU1iKlwVS5e@ep-bold-forest-aem4u633-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require");

const items = await sql`SELECT id, title, featured_image, images FROM portfolio_items WHERE title ILIKE '%Athletic Field%'`;
console.log("Athletic Field project:");
console.log(JSON.stringify(items[0], null, 2));

