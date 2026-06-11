'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Brain, BookOpen, Plane, ChevronRight } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'diagnosis' | 'exam' | 'migration' | 'job' | 'general';
  title: string;
  description: string;
  icon: string;
  gradient: string;
  cta?: string;
  ctaLink?: string;
}

interface AIInsightsPanelProps {
  insights?: string[];
}

export default function AIInsightsPanel({ insights = [] }: AIInsightsPanelProps) {
  const { theme } = useUser();
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const isDark = theme === 'dark';

  const defaultInsights: AIInsight[] = [
    {
      id: '1',
      type: 'diagnosis',
      title: 'Clinical Diagnosis',
      description: 'Based on your recent clinical logs, consider monitoring for Risk for Infection (00004) due to invasive procedures.',
      icon: 'brain',
      gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      cta: 'View Assessment',
      ctaLink: '/diagnosis',
    },
    {
      id: '2',
      type: 'exam',
      title: 'Study Recommendation',
      description: 'Focus on Cardiovascular and Pharmacology topics. These are your weakest areas based on recent exam performance.',
      icon: 'book',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      cta: 'Practice Now',
      ctaLink: '/exams',
    },
    {
      id: '3',
      type: 'migration',
      title: 'Migration Update',
      description: 'Complete your IELTS within 30 days to stay on track. Credential verification typically takes 45-60 days.',
      icon: 'plane',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      cta: 'View Progress',
      ctaLink: '/migration',
    },
  ];

  const aiInsights = insights.length > 0 
    ? insights.map((insight, i) => defaultInsights[i % defaultInsights.length])
    : defaultInsights;

  useEffect(() => {
    if (!insights.length) return;
    
    const currentText = insights[currentIndex];
    if (!currentText) return;

    setIsTyping(true);
    setDisplayedText('');

    let index = 0;
    const interval = setInterval(() => {
      if (index <= currentText.length) {
        setDisplayedText(currentText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % insights.length);
        }, 5000);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex, insights]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'brain': return <Brain className="w-6 h-6" />;
      case 'book': return <BookOpen className="w-6 h-6" />;
      case 'plane': return <Plane className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
    }
  };

  return (
    <div className={`mb-8 ${isDark ? '' : 'bg-white rounded-2xl p-6 shadow-sm'}`}>
      <div className={`flex items-center gap-3 mb-5 flex-wrap`}>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Clinical Insights
        </h2>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            isDark 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
              : 'bg-indigo-100 text-indigo-700'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          NurseAI
        </motion.span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {aiInsights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className={`relative overflow-hidden rounded-2xl p-6 transition-all ${
              isDark 
                ? 'bg-white/5 border border-white/10' 
                : 'bg-gray-50 border border-gray-100 hover:shadow-lg'
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1`} style={{ background: insight.gradient }} />
            
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'text-white' : ''
              }`}
              style={{ background: insight.gradient, boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 4px 12px rgba(99,102,241,0.3)' }}>
                {getIconComponent(insight.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-base mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {insight.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  {index === 0 && insights.length > 0 ? (
                    <>
                      {displayedText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 align-middle"
                      />
                    </>
                  ) : (
                    insight.description
                  )}
                </p>
                {insight.cta && insight.ctaLink && (
                  <Link 
                    href={insight.ctaLink}
                    className="inline-flex items-center gap-1.5 mt-3.5 text-sm font-semibold"
                    style={{ 
                      color: insight.gradient.includes('#6366F1') ? '#6366F1' : 
                             insight.gradient.includes('#10B981') ? '#10B981' : '#F59E0B' 
                    }}
                  >
                    {insight.cta}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
