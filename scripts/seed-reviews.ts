import 'dotenv/config';
import { db } from '../server/db';
import { reviews } from '../shared/schema';

async function seedReviews() {
  console.log('🌱 Seeding sample reviews...\n');

  const now = new Date();
  const sampleReviews = [
    {
      name: 'Michael Rodriguez',
      email: 'mrodriguez@constructionco.com',
      company: 'Rodriguez Construction',
      role: 'Project Manager',
      rating: 5,
      reviewText: 'Six1Five Studio delivered exceptional drone mapping for our 50-acre commercial development. The orthomosaic maps were incredibly detailed and helped us identify grading issues early. Their LiDAR scans integrated perfectly with our BIM workflow. Highly professional team!',
      projectType: 'Aerial Mapping',
      approved: true,
      featured: true,
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    {
      name: 'Sarah Chen',
      email: 'schen@architectsgroup.com',
      company: 'Chen Architects',
      role: 'Senior Architect',
      rating: 5,
      reviewText: 'We needed detailed 3D scans of a historic church for our restoration project. The photogrammetry models were stunning and captured every architectural detail. The team was respectful of the site and delivered ahead of schedule. Will definitely use again!',
      projectType: 'Photogrammetry',
      approved: true,
      featured: true,
      createdAt: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
    },
    {
      name: 'David Thompson',
      email: 'dthompson@realestate.com',
      company: 'Thompson Real Estate Group',
      role: 'Commercial Broker',
      rating: 5,
      reviewText: 'The aerial photography and video walkthrough of our industrial property listing were game-changers. We received multiple offers within two weeks. The drone shots showcased the property scale in a way ground photos never could.',
      projectType: 'Real Estate',
      approved: true,
      featured: false,
      createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    },
    {
      name: 'Emily Parker',
      company: 'Parker Engineering',
      role: 'Civil Engineer',
      rating: 4,
      reviewText: 'Great experience working with Six1Five Studio on our highway expansion survey. The LiDAR data was accurate and the turnaround time was impressive. Minor delay in communication during one phase, but overall excellent work.',
      projectType: 'LiDAR Scanning',
      approved: true,
      featured: false,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    {
      name: 'James Wilson',
      email: 'jwilson@preservationassoc.org',
      company: 'Historic Preservation Associates',
      role: 'Preservation Specialist',
      rating: 5,
      reviewText: 'Outstanding work documenting our 1890s courthouse before renovation. The interior scans captured ornate ceiling details we couldn\'t access otherwise. The digital twin model will be invaluable for future restoration work. Truly impressed!',
      projectType: 'Interior Scanning',
      approved: true,
      featured: false,
      createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    },
    {
      name: 'Robert Martinez',
      email: 'rmartinez@farmops.com',
      company: 'Martinez Farms',
      rating: 5,
      reviewText: 'Needed thermal imaging for irrigation assessment across 200 acres. The analysis identified problem zones we hadn\'t spotted. Already seeing water savings. Excellent communication throughout the project.',
      projectType: 'Thermal Imaging',
      approved: false, // Pending approval
      featured: false,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ];

  let createdCount = 0;

  for (const review of sampleReviews) {
    try {
      // Convert booleans to integers for SQLite compatibility
      const sqliteReview = {
        ...review,
        approved: review.approved ? 1 : 0,
        featured: review.featured ? 1 : 0,
      };
      await db.insert(reviews).values(sqliteReview as any);
      console.log(`✅ Added review from ${review.name} (${review.projectType}) - ${review.approved ? 'Approved' : 'Pending'}`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error adding review from ${review.name}:`, error);
    }
  }

  console.log(`\n✨ Successfully seeded ${createdCount} reviews!`);
  console.log(`   📍 Approved & Featured: ${sampleReviews.filter(r => r.approved && r.featured).length}`);
  console.log(`   📍 Approved: ${sampleReviews.filter(r => r.approved && !r.featured).length}`);
  console.log(`   📍 Pending: ${sampleReviews.filter(r => !r.approved).length}`);
  console.log('\n💡 Visit http://localhost:5000/admin to manage reviews');
}

seedReviews()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
