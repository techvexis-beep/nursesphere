export interface SearchEntry {
  href: string;
  label: string;
  description: string;
  keywords: string[];
}

export const pageContent: SearchEntry[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    description: 'Personal overview with stats, progress tracking, and quick actions',
    keywords: ['home', 'overview', 'stats', 'progress', 'activity', 'streak'],
  },
  {
    href: '/study-tutor',
    label: 'AI Study Tutor',
    description: 'AI-powered nursing study assistant with chat and subject selection',
    keywords: ['study', 'tutor', 'ai', 'anatomy', 'pharmacology', 'med-surg', 'pediatrics', 'learning', 'flashcards', 'chat'],
  },
  {
    href: '/exams',
    label: 'NCLEX Exam Prep',
    description: 'NCLEX-style exam simulator with scoring, timer, and explanations',
    keywords: ['exam', 'nclex', 'practice', 'test', 'quiz', 'question', 'score', 'review', 'rationale', 'assessment'],
  },
  {
    href: '/diagnosis',
    label: 'Nursing Diagnosis',
    description: 'NANDA-I nursing diagnosis database with symptom matcher and care plans',
    keywords: ['diagnosis', 'nanda', 'care plan', 'symptom', 'intervention', 'outcome', 'clinical', 'assessment'],
  },
  {
    href: '/dosage',
    label: 'Dosage Calculator',
    description: 'Medication dosage calculations for IV drip rate, infusion, pediatric, and BSA',
    keywords: ['dosage', 'calculator', 'medication', 'drug', 'iv', 'infusion', 'pediatric', 'bsa', 'conversion', 'math'],
  },
  {
    href: '/logbook',
    label: 'Clinical Logbook',
    description: 'Track clinical hours, procedures, and skills with stats and export',
    keywords: ['logbook', 'clinical', 'hours', 'procedures', 'skills', 'tracking', 'competency', 'export'],
  },
  {
    href: '/jobs',
    label: 'Find Nursing Jobs',
    description: 'Job board with search, location, specialty filtering, and salary info',
    keywords: ['job', 'employment', 'hiring', 'rn', 'travel', 'nurse', 'salary', 'career', 'apply', 'position'],
  },
  {
    href: '/migration',
    label: 'Migration Tracker',
    description: 'Track immigration and nursing licensure migration progress',
    keywords: ['migration', 'immigration', 'visa', 'nclex abroad', 'licensure', 'international', 'cgfns', 'overseas'],
  },
  {
    href: '/community',
    label: 'Community Network',
    description: 'Social feed for nurses to share posts, connect, and discuss',
    keywords: ['community', 'social', 'network', 'forum', 'groups', 'events', 'discussion', 'peers', 'feed'],
  },
  {
    href: '/ama',
    label: 'Recruiter AMAs',
    description: 'Ask Me Anything sessions with recruiters and industry professionals',
    keywords: ['ama', 'ask me anything', 'recruiter', 'q&a', 'career advice', 'sessions'],
  },
  {
    href: '/regulators',
    label: 'Nursing Regulators',
    description: 'Directory of global nursing regulatory bodies with contact info',
    keywords: ['regulator', 'bon', 'ncsbn', 'licensing', 'registration', 'board', 'nursing council', 'directory'],
  },
  {
    href: '/messages',
    label: 'Messages',
    description: 'Direct messaging system with conversations and contacts',
    keywords: ['message', 'chat', 'dm', 'inbox', 'conversation', 'communicate'],
  },
  {
    href: '/careers',
    label: 'Nursing Careers',
    description: 'Guide to nursing career paths, specialties, and salary information',
    keywords: ['careers', 'specialty', 'np', 'crna', 'cns', 'nurse educator', 'role', 'path', 'advanced practice'],
  },
  {
    href: '/reputation',
    label: 'Reputation & Leaderboard',
    description: 'Gamified reputation system with badges, achievements, and leaderboard',
    keywords: ['reputation', 'badge', 'achievement', 'leaderboard', 'points', 'rank', 'gamification', 'rewards'],
  },
  {
    href: '/mental-health',
    label: 'Mental Health & Wellness',
    description: 'Wellness resources with self-assessment, coping strategies, and mindfulness',
    keywords: ['mental health', 'wellness', 'self-care', 'burnout', 'stress', 'mindfulness', 'meditation', 'resilience'],
  },
  {
    href: '/research',
    label: 'Research & EBP',
    description: 'Evidence-based practice resources, journals, and research articles',
    keywords: ['research', 'ebp', 'evidence', 'journal', 'article', 'literature', 'systematic review', 'citation'],
  },
  {
    href: '/news',
    label: 'Nursing News',
    description: 'Curated healthcare news, policy updates, and industry trends',
    keywords: ['news', 'healthcare', 'policy', 'trends', 'current events', 'headlines', 'industry'],
  },
  {
    href: '/marketplace',
    label: 'Marketplace',
    description: 'Shop for nursing products, scrubs, study materials, and equipment',
    keywords: ['marketplace', 'shop', 'scrubs', 'uniform', 'textbook', 'supplies', 'equipment', 'buy'],
  },
  {
    href: '/settings',
    label: 'Settings',
    description: 'Profile management, account preferences, and notification settings',
    keywords: ['settings', 'profile', 'account', 'preferences', 'notifications', 'privacy', 'security', 'password', 'theme'],
  },
  {
    href: '/admin',
    label: 'Admin Dashboard',
    description: 'Platform administration with user management, analytics, and revenue',
    keywords: ['admin', 'analytics', 'revenue', 'users', 'moderation', 'reports', 'audit'],
  },
  {
    href: '/admin/revenue',
    label: 'Revenue Analytics',
    description: 'In-depth revenue metrics, MRR, churn, and subscription analytics',
    keywords: ['revenue', 'mrr', 'churn', 'subscription', 'payment', 'earnings', 'transactions'],
  },
];

export function searchPages(query: string): SearchEntry[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return pageContent.filter(
    (page) =>
      page.label.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q) ||
      page.keywords.some((kw) => kw.toLowerCase().includes(q))
  ).slice(0, 8);
}
