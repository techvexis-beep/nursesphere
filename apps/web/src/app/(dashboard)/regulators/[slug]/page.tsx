'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Clock, Search, Landmark, CheckCircle2, Globe,
  Mail, ClipboardList, Megaphone, HelpCircle, Timer, FileEdit,
  MessageSquare, Pin, AlertTriangle, ArrowRight, Bookmark
} from 'lucide-react';

interface Regulator {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  logo: string | null;
  website: string | null;
  description: string | null;
  contactEmail: string | null;
  phone: string | null;
  address: string | null;
  isVerified: boolean;
  announcements: Announcement[];
  pathways: LicensingPathway[];
  faqs: FAQ[];
  _count: {
    liveSessions: number;
  };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  isPinned: boolean;
  publishedAt: string;
}

interface LicensingPathway {
  id: string;
  country: string;
  pathwayType: string;
  title: string;
  description: string;
  examRequired: boolean;
  examName: string | null;
  englishRequired: boolean;
  timeline: string | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  upvotes: number;
}

const categoryColors: Record<string, string> = {
  LICENSING: '#6366F1',
  EXAM: '#EC4899',
  POLICY: '#F59E0B',
  EMERGENCY: '#EF4444',
};

export default function RegulatorProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [regulator, setRegulator] = useState<Regulator | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pathways' | 'announcements' | 'faqs'>('overview');

  const fetchRegulator = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/regulators/slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setRegulator(data);
      }
    } catch (error) {
      console.error('Failed to fetch regulator:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchRegulator();
  }, [fetchRegulator]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div className="text-muted-foreground">Loading regulator...</div>
        </div>
      </div>
    );
  }

  if (!regulator) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl mb-2">Regulator not found</h2>
          <Link href="/regulators" className="text-primary">Back to regulators</Link>
        </div>
      </div>
    );
  }

  const parseJsonField = <T,>(field: string | null, defaultValue: T): T => {
    if (!field) return defaultValue;
    try {
      return JSON.parse(field) as T;
    } catch {
      return defaultValue;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        .tab-btn {
          transition: all 0.3s ease;
        }
        .tab-btn.active {
          background: rgba(99, 102, 241, 0.2);
          border-color: #6366F1;
          color: #a5b4fc;
        }
        .pathway-card {
          transition: all 0.3s ease;
        }
        .pathway-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
        }
      `}</style>

      <div className="pt-[120px] pb-[60px] px-8 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-[1200px] mx-auto">
          <Link href="/regulators" className="inline-flex items-center gap-2 text-muted-foreground no-underline mb-6 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Regulators
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-[100px] h-[100px] rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {regulator.logo ? (
                <Image src={regulator.logo} alt={regulator.name} width={64} height={64} className="object-contain" />
              ) : (
                <Landmark className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold m-0">{regulator.name}</h1>
                {regulator.isVerified && (
                  <span className="px-3 py-1 bg-green-500/20 rounded-lg text-xs text-green-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-base mb-4">
                {regulator.region || regulator.country}
              </p>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[700px]">
                {regulator.description}
              </p>
              <div className="flex gap-4 mt-5">
                {regulator.website && (
                  <a href={regulator.website} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'outline', className: 'gap-2 border-primary/20 text-primary' })}>
                    <Globe className="h-4 w-4" />
                    Official Website
                  </a>
                )}
                {regulator.contactEmail && (
                  <a href={`mailto:${regulator.contactEmail}`} className={buttonVariants({ variant: 'ghost', className: 'gap-2 text-muted-foreground' })}>
                    <Mail className="h-4 w-4" />
                    Contact
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-[1200px] mx-auto">
        <div className="flex gap-2 border-b border-border/10 pb-4 mb-8 overflow-x-auto">
          {(['overview', 'pathways', 'announcements', 'faqs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'tab-btn px-6 py-3 rounded-xl text-sm font-semibold capitalize cursor-pointer border transition-all',
                activeTab === tab
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-transparent border-border/10 text-muted-foreground'
              )}
            >
              {tab === 'pathways' && `Licensing Pathways (${regulator.pathways.length})`}
              {tab === 'announcements' && `Updates (${regulator.announcements.length})`}
              {tab === 'faqs' && `FAQs (${regulator.faqs.length})`}
              {tab === 'overview' && 'Overview'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-[120px] max-w-[1200px] mx-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border/10 rounded-2xl p-7 backdrop-blur-xl">
              <ClipboardList className="h-9 w-9 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Licensing Pathways</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {regulator.pathways.length} pathway{regulator.pathways.length !== 1 ? 's' : ''} available for international nurses
              </p>
              <Button variant="link" className="p-0 text-primary" onClick={() => setActiveTab('pathways')}>
                View pathways <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="bg-card border border-border/10 rounded-2xl p-7 backdrop-blur-xl">
              <Megaphone className="h-9 w-9 text-amber-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Official Updates</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {regulator.announcements.length} announcement{regulator.announcements.length !== 1 ? 's' : ''} from the regulator
              </p>
              <Button variant="link" className="p-0 text-primary" onClick={() => setActiveTab('announcements')}>
                View updates <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="bg-card border border-border/10 rounded-2xl p-7 backdrop-blur-xl">
              <HelpCircle className="h-9 w-9 text-pink-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Common Questions</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {regulator.faqs.length} frequently asked questions
              </p>
              <Button variant="link" className="p-0 text-primary" onClick={() => setActiveTab('faqs')}>
                View FAQs <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'pathways' && (
          <div className="flex flex-col gap-5">
            {regulator.pathways.length === 0 ? (
              <div className="text-center py-[60px]">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl mb-2">No pathways available</h3>
                <p className="text-muted-foreground">Check back later for licensing pathway information</p>
              </div>
            ) : (
              regulator.pathways.map((pathway, index) => (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="pathway-card bg-card border border-border/10 rounded-2xl p-7 backdrop-blur-xl"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary/20 rounded-lg text-xs text-primary font-semibold">
                          {pathway.pathwayType}
                        </span>
                        <span className="text-muted-foreground text-sm">{pathway.country}</span>
                      </div>
                      <h3 className="text-[22px] font-semibold">{pathway.title}</h3>
                    </div>
                    {pathway.timeline && (
                      <div className="px-4 py-2 bg-green-500/10 rounded-lg text-[13px] text-green-500 shrink-0 flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {pathway.timeline}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-5">
                    {pathway.description}
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    {pathway.examRequired && (
                      <div className="flex items-center gap-2 text-amber-500 text-sm">
                        <FileEdit className="h-4 w-4" />
                        {pathway.examName || 'Exam Required'}
                      </div>
                    )}
                    {pathway.englishRequired && (
                      <div className="flex items-center gap-2 text-pink-500 text-sm">
                        <MessageSquare className="h-4 w-4" />
                        English Required
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="flex flex-col gap-5">
            {regulator.announcements.length === 0 ? (
              <div className="text-center py-[60px]">
                <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl mb-2">No announcements</h3>
                <p className="text-muted-foreground">Check back later for official updates</p>
              </div>
            ) : (
              regulator.announcements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border/10 rounded-2xl p-7 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {announcement.isPinned && (
                      <Pin className="h-4 w-4 text-amber-500 mt-1" />
                    )}
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold"
                      style={{
                        background: `${categoryColors[announcement.category] || '#6366F1'}20`,
                        color: categoryColors[announcement.category] || '#6366F1',
                      }}
                    >
                      {announcement.category}
                    </span>
                    {announcement.priority === 'HIGH' && (
                      <span className="px-2.5 py-1 bg-red-500/20 rounded-md text-[11px] text-red-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        HIGH PRIORITY
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{announcement.title}</h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">
                    {announcement.content}
                  </p>
                  <div className="text-muted-foreground/50 text-[13px]">
                    {new Date(announcement.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="flex flex-col gap-4">
            {regulator.faqs.length === 0 ? (
              <div className="text-center py-[60px]">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-2xl mb-2">No FAQs available</h3>
                <p className="text-muted-foreground">Check back later for frequently asked questions</p>
              </div>
            ) : (
              regulator.faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border/10 rounded-[20px] p-6 backdrop-blur-xl"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xl font-bold text-primary">Q</span>
                    <h4 className="text-base font-semibold m-0">{faq.question}</h4>
                  </div>
                  <div className="flex items-start gap-3 ml-8">
                    <span className="text-xl font-bold text-green-500">A</span>
                    <p className="text-muted-foreground text-sm leading-relaxed m-0">{faq.answer}</p>
                  </div>
                  {faq.category && (
                    <div className="mt-3 ml-8">
                      <span className="px-2.5 py-1 bg-card border border-border/10 rounded-md text-[11px] text-muted-foreground">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
