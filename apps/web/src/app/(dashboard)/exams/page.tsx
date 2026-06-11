'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, BarChart3, Shield,
  Settings, Sparkles, Target, Trophy,
  Brain, Stethoscope, Pill, Heart, Baby,
  Activity, Wind, Zap, Briefcase, Globe,
  ArrowRight, BookMarked, ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface ExamCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  icon: React.ElementType;
  color: string;
}

interface CramSheetBook {
  title: string;
  author?: string;
  edition?: string;
  link: string;
}

interface ExamType {
  id: string;
  name: string;
  description: string;
  duration: number;
  questionCount: number;
  icon: React.ElementType;
}

const examCategories: ExamCategory[] = [
  { id: 'fundamentals', name: 'Fundamentals of Nursing', description: 'Basic nursing principles and practices', questionCount: 450, icon: BookOpen, color: '#6366F1' },
  { id: 'medical-surgical', name: 'Medical-Surgical Nursing', description: 'Adult health nursing care', questionCount: 680, icon: Stethoscope, color: '#EC4899' },
  { id: 'maternity', name: 'Maternity Nursing', description: 'Pregnancy, childbirth, and newborn care', questionCount: 320, icon: Baby, color: '#10B981' },
  { id: 'pediatric', name: 'Pediatric Nursing', description: 'Care of children and adolescents', questionCount: 280, icon: Heart, color: '#F59E0B' },
  { id: 'psychiatric', name: 'Mental Health Nursing', description: 'Psychiatric and mental health care', questionCount: 220, icon: Brain, color: '#8B5CF6' },
  { id: 'pharmacology', name: 'Nursing Pharmacology', description: 'Medication and drug therapy', questionCount: 380, icon: Pill, color: '#EF4444' },
  { id: 'cardiovascular', name: 'Cardiovascular Nursing', description: 'Heart and circulatory system', questionCount: 250, icon: Activity, color: '#DC2626' },
  { id: 'respiratory', name: 'Respiratory Nursing', description: 'Breathing and respiratory care', questionCount: 190, icon: Wind, color: '#06B6D4' },
  { id: 'neurological', name: 'Neurological Nursing', description: 'Brain and nervous system care', questionCount: 170, icon: Brain, color: '#7C3AED' },
  { id: 'emergency', name: 'Emergency Nursing', description: 'Emergency and trauma care', questionCount: 210, icon: Zap, color: '#F97316' },
  { id: 'community', name: 'Community Health', description: 'Public health nursing', questionCount: 150, icon: Globe, color: '#14B8A6' },
  { id: 'leadership', name: 'Leadership & Management', description: 'Nursing management and leadership', questionCount: 130, icon: Briefcase, color: '#64748B' },
];

const examTypes: ExamType[] = [
  { id: 'quick', name: 'Quick Practice', description: 'Short practice session, 10 questions', duration: 15, questionCount: 10, icon: Zap },
  { id: 'standard', name: 'Standard Exam', description: 'Regular NCLEX-style exam', duration: 30, questionCount: 25, icon: BookOpen },
  { id: 'full', name: 'Full-Length NCLEX', description: 'Complete 150-question simulation', duration: 300, questionCount: 150, icon: Target },
  { id: 'tutor', name: 'Tutor Mode', description: 'Learn with instant explanations', duration: 45, questionCount: 20, icon: Sparkles },
];

const cramSheetBooks: CramSheetBook[] = [
  { title: 'Silvestri', edition: '2nd edition', link: 'http://amzn.to/1Ahi5yB' },
  { title: "Davis's NCLEX-RN Success", author: 'Lagerquist', edition: '3rd edition', link: 'http://amzn.to/1zbKboZ' },
  { title: "Mosby's Comprehensive Review of Nursing for the NCLEX-RN Exam", author: 'Nugent et al.', edition: '20th edition', link: 'http://amzn.to/1ytMYIR' },
  { title: 'Kaplan NCLEX RN 2013-2014 Edition: Strategies, Practice, and Review', link: 'http://amzn.to/171hdQR' },
  { title: "Lippincott's NCLEX-RN Questions and Answers Made Incredibly Easy", edition: '5th edition', link: 'http://amzn.to/1vpd6Et' },
  { title: "Lippincott's NCLEX-RN Alternate-Format Questions", edition: '5th edition', link: 'http://amzn.to/19dEEIz' },
];

const difficultyLevels = [
  { id: 'all', name: 'All Levels', color: '#6366F1' },
  { id: 'beginner', name: 'Beginner', color: '#10B981' },
  { id: 'intermediate', name: 'Intermediate', color: '#F59E0B' },
  { id: 'advanced', name: 'Advanced', color: '#EF4444' },
];

export default function ExamsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string>('standard');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState<{ total: number; averageScore: number; bestScore: number; passRate: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(API_BASE_URL + '/api/exams/stats', {
        headers: Object.keys(headers).length > 0 ? headers : undefined,
      });
      if (res.ok) setStats(await res.json());
    } catch { /* silent */ }
  };

  const selectedExam = examTypes.find(e => e.id === selectedExamType);

  const handleStartExam = () => {
    if (!selectedCategory) return;
    window.location.href = `/exams/start?type=${selectedExamType}&category=${selectedCategory}&difficulty=${selectedDifficulty}`;
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Attempts', value: stats?.total || 0, icon: BarChart3, color: '#6366F1' },
          { label: 'Average Score', value: `${stats?.averageScore || 0}%`, icon: Award, color: '#10B981' },
          { label: 'Best Score', value: `${stats?.bestScore || 0}%`, icon: Trophy, color: '#6366F1' },
          { label: 'Pass Rate', value: `${stats?.passRate || 0}%`, icon: Shield, color: '#F59E0B' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-xl bg-card border border-border p-4 md:p-5"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" style={{ background: stat.color }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Exam Type Selection */}
      <div>
        <h2 className="text-lg font-heading font-bold text-foreground mb-4">Select Exam Type</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {examTypes.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedExamType(exam.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                selectedExamType === exam.id
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <exam.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{exam.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{exam.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration} min</span>
                <span className="flex items-center gap-1"><BookOpen size={12} /> {exam.questionCount} Q</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category + Settings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-foreground">Select Category</h2>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className="gap-1.5">
            <Settings size={14} />
            Settings
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Exam Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Difficulty Level</label>
                <div className="flex gap-2 flex-wrap">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        selectedDifficulty === level.id
                          ? 'border-2 shadow-sm'
                          : 'border-border text-muted-foreground hover:bg-accent'
                      }`}
                      style={selectedDifficulty === level.id ? { borderColor: level.color, background: `${level.color}15`, color: level.color } : {}}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Timer &amp; Display</label>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { id: 'timer', label: 'Countdown Timer', default: true },
                    { id: 'progress', label: 'Show Progress', default: true },
                    { id: 'shuffle', label: 'Shuffle Questions', default: false },
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={item.default} className="rounded border-border text-primary focus:ring-primary" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {examCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedCategory === category.id
                    ? 'shadow-md'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-accent/30'
                }`}
                style={selectedCategory === category.id ? { borderColor: category.color, background: `${category.color}08` } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${category.color}15` }}>
                    <CategoryIcon size={24} style={{ color: category.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{category.description}</p>
                    <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: `${category.color}15`, color: category.color }}>
                      <BookOpen size={10} />
                      {category.questionCount} Questions
                    </div>
                  </div>
                  {selectedCategory === category.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: category.color, color: 'white', fontSize: 11 }}>
                      ✓
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Start Exam CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 text-center"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl bg-white/10" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl bg-white/5" />
        </div>
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-2">Ready to Start?</h3>
          <p className="text-white/80 text-sm max-w-md mx-auto mb-6">
            {selectedExam && selectedCategory
              ? `${selectedExam.questionCount} questions · ${selectedExam.duration} minutes · ${examCategories.find(c => c.id === selectedCategory)?.name}`
              : 'Select an exam type and category to begin'
            }
          </p>
          <Button
            size="lg"
            disabled={!selectedCategory}
            onClick={handleStartExam}
            className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all gap-2"
          >
            Start {selectedExam?.name || 'Exam'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </motion.div>

      {/* Cram Sheet Section */}
      <div>
        <h2 className="text-lg font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <BookMarked size={20} className="text-primary" />
          Recommended NCLEX Resources
        </h2>
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cramSheetBooks.map((book, index) => (
                <a
                  key={index}
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border hover:bg-accent hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BookOpen size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{book.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {book.author && `${book.author} · `}{book.edition || ''}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exam History */}
      <div>
        <h2 className="text-lg font-heading font-bold text-foreground mb-4">Your Recent Exams</h2>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No exam history yet. Start your first exam above!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


