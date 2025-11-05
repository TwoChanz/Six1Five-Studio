import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: No password provided');
  console.log('\nUsage:');
  console.log('  npx tsx scripts/hash-password.ts YOUR_PASSWORD');
  console.log('\nExample:');
  console.log('  npx tsx scripts/hash-password.ts MySecurePassword123!\n');
  process.exit(1);
}

console.log('\n🔐 Generating bcrypt hash...\n');

bcrypt.hash(password, 10).then(hash => {
  console.log('✅ Password hash generated successfully!\n');
  console.log('='.repeat(80));
  console.log(hash);
  console.log('='.repeat(80));
  console.log('\n📋 Add this to your production .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\n💡 For production security, use the hash instead of plain text password.');
  console.log('   Remove or comment out ADMIN_PASSWORD in production.\n');
}).catch(error => {
  console.error('❌ Error generating hash:', error);
  process.exit(1);
});
