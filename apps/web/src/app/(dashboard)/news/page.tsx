'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, Search, Sparkles, Lightbulb,
  Clock, Heart, Activity, Shield, Users,
  GraduationCap, Globe, Briefcase, Zap
} from 'lucide-react';
import { useUser, Notification } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  readTime: string;
  isNew?: boolean;
}

interface HealthTip {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  category: string;
}

const HEALTH_TIPS: HealthTip[] = [
  { id: 'tip_1', title: 'Stay Hydrated', content: 'Nurses should drink at least 8 glasses of water during shifts to maintain focus and energy.', icon: <Heart size={18} className="text-blue-400" />, category: 'wellness' },
  { id: 'tip_2', title: 'Proper Lifting', content: 'Always use your legs, not your back when lifting patients or heavy equipment.', icon: <Shield size={18} className="text-emerald-400" />, category: 'safety' },
  { id: 'tip_3', title: 'Mindfulness Break', content: 'Take 2-minute mindfulness breaks every 2 hours to reduce stress and prevent burnout.', icon: <Lightbulb size={18} className="text-amber-400" />, category: 'mental' },
  { id: 'tip_4', title: 'Hand Hygiene', content: 'Wash hands for at least 20 seconds. It\'s the best defense against hospital infections.', icon: <Shield size={18} className="text-cyan-400" />, category: 'safety' },
  { id: 'tip_5', title: 'Sleep Hygiene', content: 'Maintain a consistent sleep schedule. 7-8 hours of sleep is essential for cognitive function.', icon: <Activity size={18} className="text-violet-400" />, category: 'wellness' },
  { id: 'tip_6', title: 'Patient Communication', content: 'Always introduce yourself and explain procedures clearly to ease patient anxiety.', icon: <Users size={18} className="text-rose-400" />, category: 'care' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  all: { bg: 'bg-indigo-500', text: 'text-white', icon: <Sparkles size={14} /> },
  nclex: { bg: 'bg-pink-500', text: 'text-white', icon: <GraduationCap size={14} /> },
  migration: { bg: 'bg-emerald-500', text: 'text-white', icon: <Globe size={14} /> },
  conferences: { bg: 'bg-amber-500', text: 'text-white', icon: <Users size={14} /> },
  jobs: { bg: 'bg-violet-500', text: 'text-white', icon: <Briefcase size={14} /> },
  technology: { bg: 'bg-cyan-500', text: 'text-white', icon: <Zap size={14} /> },
  health_tips: { bg: 'bg-rose-500', text: 'text-white', icon: <Heart size={14} /> },
};

const NEWS_CATEGORIES = [
  { id: 'all', name: 'For You' },
  { id: 'nclex', name: 'NCLEX & Exams' },
  { id: 'migration', name: 'Migration' },
  { id: 'conferences', name: 'Conferences' },
  { id: 'jobs', name: 'Jobs' },
  { id: 'technology', name: 'Tech & AI' },
  { id: 'health_tips', name: 'Health Tips' },
];

function generateNews(): NewsArticle[] {
  const newsData = [
    { id: '1', title: 'NCLEX-RN 2026: Major Format Changes Announced by NCSBN', summary: 'The National Council of State Boards of Nursing reveals significant updates to the NCLEX-RN examination, including new question types and adjusted passing standards.', category: 'nclex', source: 'NCSBN Official', readTime: '5 min' },
    { id: '2', title: 'UK Opens Fast-Track Visa Pathway for International Nurses', summary: 'British government launches new Health and Care Worker visa route with expedited processing for qualified nurses worldwide.', category: 'migration', source: 'UK Visas & Immigration', readTime: '4 min' },
    { id: '3', title: 'World Nursing Congress 2026: Dubai Hosts Largest Gathering', summary: 'Over 10,000 nurses from 150 countries converge in Dubai for the annual World Nursing Congress.', category: 'conferences', source: 'World Nursing Association', readTime: '3 min' },
    { id: '4', title: 'Top 10 Hospitals Hiring Nurses in 2026 - Competitive Salaries', summary: 'Exclusive ranking of the best healthcare facilities offering exceptional compensation and career growth opportunities.', category: 'jobs', source: 'Nursing Careers Weekly', readTime: '6 min' },
    { id: '5', title: 'AI Revolution in Nursing: How Machine Learning is Transforming Care', summary: 'Hospitals worldwide are implementing AI-powered diagnostic tools to enhance nursing practice and patient outcomes.', category: 'technology', source: 'Healthcare IT News', readTime: '7 min' },
    { id: '6', title: 'Canada Launches $150M Nursing Recruitment Strategy', summary: 'Federal and provincial governments partner to attract 30,000 new nurses over five years with comprehensive support packages.', category: 'migration', source: 'Canada Health', readTime: '4 min' },
    { id: '7', title: 'WHO Releases Global Nursing Workforce Report - Critical Shortage', summary: 'World Health Organization warns of 10 million nurse shortage by 2030, calling for immediate action.', category: 'jobs', source: 'WHO Official', readTime: '5 min' },
    { id: '8', title: 'New Scholarship Program: Up to $50,000 for Nursing Students', summary: 'Department of Health announces largest nursing scholarship program ever with flexible repayment options.', category: 'jobs', source: 'Federal Student Aid', readTime: '3 min' },
    { id: '9', title: 'NCLEX Passing Score Update - What You Need to Know', summary: 'Important changes to passing standards for NCLEX-RN exams effective next quarter explained.', category: 'nclex', source: 'NCLEX Updates', readTime: '4 min' },
    { id: '10', title: 'Australia Introduces Priority Visa for Healthcare Workers', summary: 'Australian government announces priority processing for nurses and healthcare professionals seeking residency.', category: 'migration', source: 'Australia Immigration', readTime: '3 min' },
    { id: '11', title: 'Virtual Reality Nursing Training: The Future of Education', summary: 'Leading nursing schools adopting VR technology for immersive clinical experiences and skill development.', category: 'technology', source: 'EdTech Magazine', readTime: '5 min' },
    { id: '12', title: 'ANA Annual Conference 2026 - San Diego', summary: 'ANA conference brings together nursing leaders for three days of learning, networking, and professional development.', category: 'conferences', source: 'ANA Official', readTime: '4 min' },
    { id: '13', title: 'Study Shows AI-Assisted Diagnosis Improves Accuracy by 40%', summary: 'New research demonstrates significant improvement in diagnostic accuracy when AI tools support clinical decisions.', category: 'technology', source: 'Medical AI Journal', readTime: '6 min' },
    { id: '14', title: 'Global Nurse Migration: Top Destinations for 2026', summary: 'Analysis of the most popular destinations for international nurses seeking career advancement.', category: 'migration', source: 'Global Health Report', readTime: '5 min' },
  ];

  const images = [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
    'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    'https://images.unsplash.com/photo-1622979135225-d2ba269fb1ac?w=800&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
  ];

  return newsData.map((news, index) => ({
    ...news,
    imageUrl: images[index % images.length],
    publishedAt: new Date(Date.now() - (index * 2 + Math.random() * 4) * 60 * 60 * 1000).toISOString(),
    isNew: index < 2,
  }));
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NewsPage() {
  const { user, setNotifications, notifications } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [healthTip, setHealthTip] = useState<HealthTip | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
    setNewsArticles(generateNews());
    setHealthTip(HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)]);
    
    const tipInterval = setInterval(() => {
      setHealthTip(HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)]);
    }, 30000);
    
    return () => clearInterval(tipInterval);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newNews = generateNews().map(news => ({
      ...news,
      isNew: true,
      publishedAt: new Date().toISOString(),
    }));
    
    setNewsArticles(prev => {
      const combined = [...newNews, ...prev].slice(0, 20);
      return combined;
    });
    setLastUpdate(new Date());

    const latestNews = newNews[0];
    if (latestNews) {
      const notification: Notification = {
        id: `news_${Date.now()}`,
        type: 'news' as const,
        title: 'New Article',
        message: latestNews.title.substring(0, 100) + '...',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [notification, ...prev].slice(0, 20));
    }

    setTimeout(() => {
      setNewsArticles(prev => prev.map(n => ({ ...n, isNew: false })));
    }, 5000);

    setRefreshing(false);
  }, [setNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        handleRefresh();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const filteredNews = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filteredNews[0];
  const remaining = filteredNews.slice(1);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-card rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-card rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Today's News
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • 
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="default"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </motion.div>

      {healthTip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-violet-500/20 border border-rose-500/30 p-5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={24} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-rose-500/30 text-rose-300 rounded-full text-xs font-medium">
                  Health Tip
                </span>
                <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                  <Clock size={10} />
                  Updates every 30s
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{healthTip.title}</h3>
              <p className="text-sm text-muted-foreground">{healthTip.content}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 pr-4 py-3 rounded-xl"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {NEWS_CATEGORIES.map((cat) => {
          const color = CATEGORY_COLORS[cat.id] || CATEGORY_COLORS.all;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `${color.bg} ${color.text} shadow-lg`
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {color.icon}
              {cat.name}
            </button>
          );
        })}
      </div>

      {selectedCategory === 'all' && !searchQuery && featured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-80 md:h-96 group cursor-pointer">
            <img 
              src={featured.imageUrl} 
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[featured.category]?.bg} ${CATEGORY_COLORS[featured.category]?.text}`}>
                  {CATEGORY_COLORS[featured.category]?.icon}
                  {NEWS_CATEGORIES.find(c => c.id === featured.category)?.name}
                </span>
                {featured.isNew && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-bold animate-pulse">
                    NEW
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 line-clamp-2">
                {featured.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {featured.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-medium">{featured.source}</span>
                <span>•</span>
                <span>{formatTimeAgo(featured.publishedAt)}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {remaining.slice(0, 3).map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-border transition-all cursor-pointer group"
              >
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_COLORS[article.category]?.bg} ${CATEGORY_COLORS[article.category]?.text}`}>
                      {NEWS_CATEGORIES.find(c => c.id === article.category)?.name}
                    </span>
                    {article.isNew && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {formatTimeAgo(article.publishedAt)} • {article.readTime}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {searchQuery ? `Results for "${searchQuery}"` : 'Latest Articles'}
          </h2>
          <span className="text-sm text-muted-foreground">{filteredNews.length} articles</span>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(searchQuery || selectedCategory !== 'all' ? filteredNews : remaining).map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl bg-card border border-border overflow-hidden hover:border-border transition-all cursor-pointer group"
            >
              <div className="relative h-40">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${CATEGORY_COLORS[article.category]?.bg} ${CATEGORY_COLORS[article.category]?.text}`}>
                    {CATEGORY_COLORS[article.category]?.icon}
                    {NEWS_CATEGORIES.find(c => c.id === article.category)?.name}
                  </span>
                  {article.isNew && (
                    <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-bold">
                      NEW
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                  <span className="font-medium">{article.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatTimeAgo(article.publishedAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
            <Search size={32} className="text-muted-foreground/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-purple-500/20 border border-primary/30 p-6"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-primary" />
              <span className="text-sm font-medium text-primary">Stay Updated</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">Get Daily Nursing Updates</h3>
            <p className="text-sm text-muted-foreground">Never miss important nursing news, tips, and career opportunities</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-3 rounded-xl"
            />
            <Button variant="default">
              Subscribe
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
