import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const communities = [
  { name: 'NCLEX Preparation', slug: 'nclex', description: 'NCLEX-RN & NCLEX-PN preparation tips, resources, and support', type: 'EXAM', color: '#6366F1', icon: '📝' },
  { name: 'IELTS & OET English', slug: 'ielts-oet', description: 'English language test preparation for nursing', type: 'EXAM', color: '#EC4899', icon: '📚' },
  { name: 'USA Nursing Migration', slug: 'usa-migration', description: 'US nursing licensing, NCLEX, CGFNS, and visa processes', type: 'MIGRATION', color: '#3B82F6', icon: '🇺🇸' },
  { name: 'UK Nursing', slug: 'uk-nursing', description: 'NMC registration and working as a nurse in the UK', type: 'MIGRATION', color: '#8B5CF6', icon: '🇬🇧' },
  { name: 'Canada Nursing', slug: 'canada-nursing', description: 'CRNBC, provincial licensing, and Express Entry', type: 'MIGRATION', color: '#10B981', icon: '🇨🇦' },
  { name: 'Australia Nursing', slug: 'australia-nursing', description: 'AHPRA registration and working in Australia', type: 'MIGRATION', color: '#F59E0B', icon: '🇦🇺' },
  { name: 'ICU Nurses', slug: 'icu-nurses', description: 'Intensive Care Unit nursing discussions and resources', type: 'SPECIALTY', color: '#EF4444', icon: '🏥' },
  { name: 'Emergency Room', slug: 'er-nurses', description: 'ER nursing, triage, and emergency care', type: 'SPECIALTY', color: '#F97316', icon: '🚨' },
  { name: 'Pediatric Nursing', slug: 'pediatrics', description: 'Pediatric nursing, NICU, and child healthcare', type: 'SPECIALTY', color: '#14B8A6', icon: '👶' },
  { name: 'Nurse Recruiters', slug: 'recruiters', description: 'Hospital recruiters, hiring managers, and job opportunities', type: 'RECRUITER', color: '#06B6D4', icon: '💼' },
  { name: 'Nurse Mentorship', slug: 'mentorship', description: 'Connect with experienced nurses for guidance', type: 'GENERAL', color: '#84CC16', icon: '🤝' },
  { name: 'General Discussion', slug: 'general', description: 'Off-topic discussions and community chat', type: 'GENERAL', color: '#A855F7', icon: '💬' },
];

const badges = [
  { name: 'First Post', description: 'Created your first post in the community', icon: '📝', color: '#6366F1', criteria: JSON.stringify({ postsCount: 1 }) },
  { name: 'Helper', description: 'Had 10 answers marked as helpful', icon: '🤝', color: '#10B981', criteria: JSON.stringify({ helpfulCount: 10 }) },
  { name: 'Popular', description: 'Received 100 upvotes on a post', icon: '🔥', color: '#F59E0B', criteria: JSON.stringify({ postUpvotes: 100 }) },
  { name: 'NCLEX Crusher', description: 'Passed the NCLEX-RN exam', icon: '🏆', color: '#EC4899', criteria: JSON.stringify({ examPassed: 'NCLEX' }) },
  { name: 'Migrator', description: 'Successfully completed migration to another country', icon: '✈️', color: '#3B82F6', criteria: JSON.stringify({ migrationCompleted: true }) },
  { name: 'Expert', description: 'Reached 1000 reputation points', icon: '🎓', color: '#8B5CF6', criteria: JSON.stringify({ reputationScore: 1000 }) },
  { name: 'Mentor', description: 'Helped 50 nurses with their questions', icon: '💡', color: '#14B8A6', criteria: JSON.stringify({ answersCount: 50 }) },
  { name: 'Contributor', description: 'Reached 100 reputation points', icon: '⭐', color: '#F97316', criteria: JSON.stringify({ reputationScore: 100 }) },
  { name: 'Community Builder', description: 'Created a popular community', icon: '🏠', color: '#06B6D4', criteria: JSON.stringify({ communityCreated: true }) },
  { name: 'Early Adopter', description: 'Joined during the beta phase', icon: '🌟', color: '#EAB308', criteria: JSON.stringify({ joinDate: 'beta' }) },
];

async function main() {
  console.log('Seeding communities...');
  for (const community of communities) {
    await prisma.community.upsert({
      where: { slug: community.slug },
      update: {},
      create: community,
    });
  }
  console.log('Seeded communities');

  console.log('Seeding badges...');
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log('Seeded badges');

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
