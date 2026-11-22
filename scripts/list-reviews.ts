import 'dotenv/config';
import { db } from '../server/db';
import { reviews } from '../shared/schema';

async function listReviews() {
  console.log('📋 All Reviews in Database:\n');

  const allReviews = await db.select().from(reviews);

  if (allReviews.length === 0) {
    console.log('No reviews found in database.\n');
    console.log('💡 To test the review system:');
    console.log('1. Visit http://localhost:5000');
    console.log('2. Scroll to the testimonials section');
    console.log('3. Click "Leave a Review"');
    console.log('4. Submit a test review');
    console.log('5. Visit http://localhost:5000/admin to approve it');
    return;
  }

  allReviews.forEach((review) => {
    console.log(`\n📝 Review ID: ${review.id}`);
    console.log(`   Name: ${review.name}`);
    console.log(`   Company: ${review.company || 'N/A'}`);
    console.log(`   Role: ${review.role || 'N/A'}`);
    console.log(`   Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
    console.log(`   Project Type: ${review.projectType}`);
    console.log(`   Status: ${review.approved ? '✅ Approved' : '⏳ Pending'}`);
    console.log(`   Featured: ${review.featured ? '⭐ Yes' : 'No'}`);
    console.log(`   Review: "${review.reviewText.substring(0, 100)}${review.reviewText.length > 100 ? '...' : ''}"`);
    console.log(`   Created: ${new Date(review.createdAt).toLocaleString()}`);
  });

  const pendingCount = allReviews.filter(r => !r.approved).length;
  const approvedCount = allReviews.filter(r => r.approved).length;
  const featuredCount = allReviews.filter(r => r.featured).length;

  console.log(`\n📊 Summary:`);
  console.log(`   Total: ${allReviews.length}`);
  console.log(`   Pending: ${pendingCount}`);
  console.log(`   Approved: ${approvedCount}`);
  console.log(`   Featured: ${featuredCount}`);
}

listReviews()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
