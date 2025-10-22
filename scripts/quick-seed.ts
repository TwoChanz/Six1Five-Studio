import 'dotenv/config';
import Database from 'better-sqlite3';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'local.db'));

const items = [
  ["Historic Church Photogrammetry", "Complete 3D capture of a 19th century church for historic preservation.", "heritage", '["DJI Mavic 3 Pro","RealityCapture"]', '["Aerial Mapping","Photogrammetry"]', 1, 1],
  ["Commercial Construction Site", "Monthly progress documentation for commercial development.", "construction", '["DJI Phantom 4 RTK","Pix4D"]', '["Drone Mapping","Progress Monitoring"]', 1, 1],
  ["LiDAR Forest Analysis", "LiDAR scan of forested area for environmental assessment.", "lidar", '["DJI Zenmuse L1","CloudCompare"]', '["LiDAR Scanning"]', 1, 0]
];

console.log("🌱 Seeding portfolio...\n");

const stmt = db.prepare(`
  INSERT INTO portfolio_items (title, description, category, tools, services, published, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (const item of items) {
  console.log(`Adding: ${item[0]}`);
  stmt.run(...item);
}

console.log("\n✅ Done! Visit http://localhost:5000/gallery\n");
db.close();
