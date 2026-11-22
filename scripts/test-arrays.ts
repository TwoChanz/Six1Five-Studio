import 'dotenv/config';
import { storage } from "../server/storage.js";

/**
 * Test script to verify array deserialization works correctly
 *
 * Usage: npx tsx scripts/test-arrays.ts
 */

async function testArrays() {
  try {
    console.log('🧪 Testing array deserialization...\n');

    // Test portfolio items
    console.log('📦 Fetching portfolio items...');
    const portfolioItems = await storage.getPublishedPortfolioItems();

    if (portfolioItems.length === 0) {
      console.log('⚠️  No portfolio items found. Run seed script first.');
      process.exit(0);
    }

    console.log(`\n✅ Found ${portfolioItems.length} portfolio items\n`);

    // Check first item in detail
    const firstItem = portfolioItems[0];
    console.log(`Testing item: "${firstItem.title}"\n`);

    // Check if arrays are actually arrays
    console.log('🔍 Type checking:');
    console.log(`  - tools: ${Array.isArray(firstItem.tools) ? '✅ Array' : '❌ NOT an array (Type: ' + typeof firstItem.tools + ')'}`);
    console.log(`  - services: ${Array.isArray(firstItem.services) ? '✅ Array' : '❌ NOT an array (Type: ' + typeof firstItem.services + ')'}`);
    console.log(`  - images: ${Array.isArray(firstItem.images) ? '✅ Array' : '❌ NOT an array (Type: ' + typeof firstItem.images + ')'}`);

    // Show actual values
    console.log('\n📊 Actual values:');
    console.log(`  - tools (${firstItem.tools?.length || 0} items):`, firstItem.tools);
    console.log(`  - services (${firstItem.services?.length || 0} items):`, firstItem.services);
    console.log(`  - images (${firstItem.images?.length || 0} items):`, firstItem.images);

    // Verify all items
    console.log('\n🔍 Checking all portfolio items:');
    let allPassed = true;
    portfolioItems.forEach((item, index) => {
      const toolsOk = Array.isArray(item.tools);
      const servicesOk = Array.isArray(item.services);
      const imagesOk = Array.isArray(item.images);
      const passed = toolsOk && servicesOk && imagesOk;

      console.log(`  ${index + 1}. ${item.title}: ${passed ? '✅' : '❌'}`);
      if (!passed) {
        console.log(`     Problems: tools=${toolsOk}, services=${servicesOk}, images=${imagesOk}`);
        allPassed = false;
      }
    });

    console.log('\n' + '='.repeat(50));
    if (allPassed) {
      console.log('✅ SUCCESS! All arrays are properly deserialized!\n');
    } else {
      console.log('❌ FAILURE! Some arrays are not properly deserialized.\n');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testArrays();
