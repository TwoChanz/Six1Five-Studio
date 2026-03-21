import 'dotenv/config';

/**
 * Admin Password Recovery Script
 *
 * Use this script if you forget your admin password or can't log in.
 *
 * Usage:
 *   npx tsx scripts/recover-admin-password.ts
 *
 * This will display:
 * - The current admin password from .env
 * - Instructions for resetting the password
 */

console.log('\n🔐 Admin Password Recovery\n');
console.log('═'.repeat(50));

const adminPassword = process.env.ADMIN_PASSWORD;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

if (adminPassword) {
  console.log('\n✅ Local Development Password Found:');
  console.log(`   Password: ${adminPassword}`);
  console.log('\n   Use this password to log in at:');
  console.log('   http://localhost:5000/admin');
} else if (adminPasswordHash) {
  console.log('\n⚠️  Only password hash found (production mode)');
  console.log('   You cannot retrieve the original password from a hash.');
  console.log('   You need to set a new password in .env:');
  console.log('\n   ADMIN_PASSWORD=your_new_password');
} else {
  console.log('\n❌ No admin password found in environment variables!');
  console.log('\n   Add to .env file:');
  console.log('   ADMIN_PASSWORD=your_password_here');
}

console.log('\n═'.repeat(50));
console.log('\n📝 To change your password:\n');
console.log('   1. Local development:');
console.log('      Update ADMIN_PASSWORD in .env file');
console.log('      Restart the dev server');
console.log('');
console.log('   2. Production (Vercel):');
console.log('      Run: npx vercel env rm ADMIN_PASSWORD production');
console.log('      Run: printf "new_password" | npx vercel env add ADMIN_PASSWORD production');
console.log('      Redeploy: git commit --allow-empty -m "Update password" && git push');
console.log('');
console.log('   3. Using password hash (more secure for production):');
console.log('      Run: npx tsx scripts/hash-password.ts your_new_password');
console.log('      Copy the hash to ADMIN_PASSWORD_HASH in Vercel environment variables');
console.log('');
console.log('═'.repeat(50));
console.log('\n');
