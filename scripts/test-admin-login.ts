import 'dotenv/config';
import { verifyAdminPassword } from '../server/auth.js';

async function testLogin() {
  console.log('🔐 Testing Admin Login\n');

  console.log('Environment Variables:');
  console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
  console.log(`  ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? `✅ Set to "${process.env.ADMIN_PASSWORD}"` : '❌ Not set'}`);
  console.log(`  ADMIN_PASSWORD_HASH: ${process.env.ADMIN_PASSWORD_HASH ? '✅ Set' : '❌ Not set'}`);
  console.log('');

  const testPassword = process.env.ADMIN_PASSWORD || 'admin615';
  console.log(`Testing password: "${testPassword}"`);

  const result = await verifyAdminPassword(testPassword);

  if (result) {
    console.log('✅ Login successful! Password is correct.');
  } else {
    console.log('❌ Login failed! Password is incorrect.');
  }

  // Test with wrong password
  console.log('\nTesting with wrong password: "wrongpassword"');
  const wrongResult = await verifyAdminPassword('wrongpassword');

  if (!wrongResult) {
    console.log('✅ Correctly rejected wrong password.');
  } else {
    console.log('❌ Warning: Wrong password was accepted!');
  }
}

testLogin().catch(console.error);
