'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  FlaskConical, Search, BarChart3, FileText, BookOpen, Mic,
  FolderOpen, Heart, Target, CheckCircle2, Wrench, ChevronRight,
  MapPin, Calendar, HelpCircle, TrendingUp, Stethoscope, ArrowRight,
  RefreshCw, Menu, ClipboardList
} from 'lucide-react';

interface ResearchProject {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  institution: string;
  date: string;
  status: 'Active' | 'Completed' | 'Recruiting';
  participants?: number;
  tags: string[];
  icon: string;
  color: string;
}

interface Publication {
  id: string;
  title: string;
  journal: string;
  authors: string;
  date: string;
  citations: number;
  category: string;
  url: string;
}

const researchCategories = [
  { id: 'clinical', name: 'Clinical Practice', icon: '🩺', color: '#6366F1', count: 245 },
  { id: 'education', name: 'Nursing Education', icon: '📚', color: '#8B5CF6', count: 189 },
  { id: 'technology', name: 'Health Technology', icon: '💻', color: '#10B981', count: 156 },
  { id: 'patient-safety', name: 'Patient Safety', icon: '🛡️', color: '#F59E0B', count: 134 },
  { id: 'mental-health', name: 'Mental Health', icon: '💚', color: '#EC4899', count: 112 },
  { id: 'geriatrics', name: 'Geriatric Care', icon: '👴', color: '#14B8A6', count: 98 },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶', color: '#F97316', count: 87 },
  { id: 'leadership', name: 'Leadership', icon: '👔', color: '#3B82F6', count: 76 },
];

const recentPublications: Publication[] = [
  {
    id: '1',
    title: 'Nursing-led multidisciplinary ERAS collaboration improves early recovery after laparoscopic radical prostatectomy',
    journal: 'Frontiers in Medicine',
    authors: 'Multiple Authors',
    date: '2026-01-14',
    citations: 24,
    category: 'Clinical Practice',
    url: 'https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2025.1705709/full',
  },
  {
    id: '2',
    title: 'Nurse-led evidence-based protocolized weaning for invasive mechanical ventilation patients in the ICU',
    journal: 'BMC Pulmonary Medicine',
    authors: 'Research Team',
    date: '2025-10-27',
    citations: 67,
    category: 'Critical Care',
    url: 'https://link.springer.com/article/10.1186/s12890-025-03967-5',
  },
  {
    id: '3',
    title: 'The Effect of WOC Nurse Rounding on At-Risk Patients in the ICU in Reducing HAPIs',
    journal: 'Kennesaw State University',
    authors: 'Sydney Conrad, Ayoka Allen',
    date: '2025-01-01',
    citations: 45,
    category: 'Patient Safety',
    url: 'https://digitalcommons.kennesaw.edu/mastersprojects/51',
  },
  {
    id: '4',
    title: 'Nurses\' Expectations of a Knowledge Management System in Nursing Practice',
    journal: 'JMIR Nursing',
    authors: 'Magdalena Vogt et al.',
    date: '2026-01-01',
    citations: 18,
    category: 'Health Technology',
    url: 'https://nursing.jmir.org/2026/1/e78395/PDF',
  },
];

const researchProjects: ResearchProject[] = [
  {
    id: '1',
    title: 'AI-Powered Clinical Decision Support System',
    category: 'Health Technology',
    description: 'Developing machine learning algorithms to assist nurses in making evidence-based clinical decisions at point-of-care.',
    author: 'Dr. Sarah Johnson',
    institution: 'Johns Hopkins University',
    date: '2026-01',
    status: 'Active',
    participants: 245,
    tags: ['AI', 'Machine Learning', 'Clinical Decision'],
    icon: '🤖',
    color: '#6366F1',
  },
  {
    id: '2',
    title: 'Reducing Hospital-Acquired Infections Through Enhanced Hand Hygiene Protocols',
    category: 'Patient Safety',
    description: 'Multi-center study implementing evidence-based hand hygiene interventions across 50+ hospitals.',
    author: 'Dr. Michael Chen',
    institution: 'CDC Collaboration',
    date: '2025-11',
    status: 'Active',
    participants: 1250,
    tags: ['Infection Control', 'Hospitals', 'Prevention'],
    icon: '🧼',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Telehealth Implementation in Rural Healthcare Settings',
    category: 'Healthcare Delivery',
    description: 'Evaluating the effectiveness of telehealth services in improving access to care for rural communities.',
    author: 'Dr. Emily Williams',
    institution: 'Rural Health Initiative',
    date: '2025-10',
    status: 'Active',
    participants: 890,
    tags: ['Telehealth', 'Rural Health', 'Access to Care'],
    icon: '📡',
    color: '#8B5CF6',
  },
  {
    id: '4',
    title: 'Burnout Prevention Among ICU Nurses',
    category: 'Mental Health',
    description: 'Testing interventions to reduce occupational stress and burnout in intensive care unit nursing staff.',
    author: 'Dr. Amanda Brown',
    institution: 'American Nurses Association',
    date: '2025-09',
    status: 'Recruiting',
    participants: 500,
    tags: ['Burnout', 'Mental Health', 'ICU'],
    icon: '💚',
    color: '#EC4899',
  },
  {
    id: '5',
    title: 'Fall Prevention in Elderly Patients: Evidence-Based Protocols',
    category: 'Geriatric Care',
    description: 'Implementing and evaluating fall prevention programs in nursing homes and acute care settings.',
    author: 'Dr. Robert Davis',
    institution: 'Geriatric Nursing Consortium',
    date: '2025-08',
    status: 'Completed',
    tags: ['Falls', 'Elderly', 'Prevention'],
    icon: '👴',
    color: '#14B8A6',
  },
  {
    id: '6',
    title: 'Pediatric Pain Management Best Practices',
    category: 'Pediatrics',
    description: 'Developing age-appropriate pain assessment and management protocols for pediatric patients.',
    author: 'Dr. Lisa Martinez',
    institution: 'Children\'s Hospital Research',
    date: '2025-12',
    status: 'Active',
    participants: 340,
    tags: ['Pain Management', 'Pediatrics', 'Assessment'],
    icon: '👶',
    color: '#F97316',
  },
];

const conferences = [
  { name: '9th Nursing World Conference', location: 'Orlando, USA', date: 'October 27-29, 2025', type: 'Evidence-Based Nursing' },
  { name: 'Singapore Nursing Research Conference', location: 'Singapore', date: 'March 19-21, 2026', type: 'Research' },
  { name: 'Cleveland Clinic Nursing RIE 2026', location: 'Cleveland, USA', date: '2026', type: 'Innovation & EBP' },
  { name: 'Intermountain Health Nursing Symposium', location: 'Utah, USA', date: '2025', type: 'Evidence-Based Practice' },
];

const ebpTopics = [
  { category: 'Clinical Practice', topics: ['Medication administration safety', 'Wound care protocols', 'IV therapy standards', 'Pain management strategies'] },
  { category: 'Patient Safety', topics: ['Fall prevention programs', 'Infection control measures', 'Patient identification protocols', 'Handoff communication (SBAR)'] },
  { category: 'Technology', topics: ['EHR implementation', 'Clinical decision support', 'Telehealth delivery', 'Mobile health apps'] },
  { category: 'Education', topics: ['Simulation-based training', 'Competency assessment', 'Preceptor programs', 'Continuing education effectiveness'] },
];

const databases = [
  { name: 'CINAHL Ultimate', description: 'Primary nursing database', icon: '📖' },
  { name: 'PubMed', description: 'Medical & nursing research', icon: '🔬' },
  { name: 'Joanna Briggs Institute', description: 'EBP resources', icon: '📚' },
  { name: 'Cochrane Library', description: 'Systematic reviews', icon: '🎯' },
  { name: 'Google Scholar', description: 'Academic search', icon: '🔍' },
  { name: 'Scopus', description: 'Abstract & citation', icon: '📊' },
];

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ projects: 1250, researchers: 8500, publications: 24000 });

  const filteredProjects = researchProjects.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-150px)]">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .research-card {
          transition: all 0.3s ease;
        }
        .research-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
        }
      `}</style>

      <div className="bg-gradient-to-br from-primary/15 to-violet-500/15 border border-primary/20 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <FlaskConical className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-foreground font-bold text-[28px] m-0">Research & Evidence-Based Practice</h1>
            <p className="text-muted-foreground text-[15px] mt-1">Discover nursing research, join projects, and contribute to evidence-based practice</p>
          </div>
        </div>

        <div className="flex gap-10 mt-6">
          <div>
            <div className="text-[32px] font-bold text-foreground">{stats.projects.toLocaleString()}+</div>
            <div className="text-muted-foreground text-[13px]">Active Projects</div>
          </div>
          <div>
            <div className="text-[32px] font-bold text-foreground">{stats.researchers.toLocaleString()}+</div>
            <div className="text-muted-foreground text-[13px]">Researchers</div>
          </div>
          <div>
            <div className="text-[32px] font-bold text-foreground">{stats.publications.toLocaleString()}+</div>
            <div className="text-muted-foreground text-[13px]">Publications</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search research projects, topics, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 py-[14px] h-auto bg-card border-border/50 text-foreground text-[15px] rounded-[14px]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-[14px] bg-card border border-border/50 rounded-[14px] text-foreground text-[15px] cursor-pointer"
        >
          <option value="all">All Categories</option>
          {researchCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
        {[
          { id: 'projects', label: 'Research Projects', icon: BarChart3 },
          { id: 'publications', label: 'Publications', icon: FileText },
          { id: 'topics', label: 'EBP Topics', icon: BookOpen },
          { id: 'conferences', label: 'Conferences', icon: Mic },
          { id: 'resources', label: 'Resources', icon: FolderOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary to-violet-500 text-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'projects' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {researchCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                className={cn(
                  'rounded-2xl p-5 cursor-pointer transition-all',
                  selectedCategory === cat.id
                    ? 'bg-card border'
                    : 'bg-card/50 border border-border/10'
                )}
                style={{
                  borderColor: selectedCategory === cat.id ? cat.color : undefined,
                  backgroundColor: selectedCategory === cat.id ? `${cat.color}20` : undefined,
                }}
              >
                <div className="text-[28px] mb-3">{cat.icon}</div>
                <div className="text-foreground font-semibold text-[14px] mb-1">{cat.name}</div>
                <div className="text-muted-foreground/50 text-[13px]">{cat.count} projects</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="research-card bg-card border border-border/10 rounded-[20px] p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl"
                      style={{ background: `${project.color}20` }}
                    >
                      {project.icon}
                    </div>
                    <div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          background: project.status === 'Active' ? 'rgba(34,197,94,0.2)' : project.status === 'Recruiting' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)',
                          color: project.status === 'Active' ? '#22c55e' : project.status === 'Recruiting' ? '#f59e0b' : '#6366F1',
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  {project.participants && (
                    <div className="text-right">
                      <div className="text-primary font-semibold text-base">{project.participants.toLocaleString()}</div>
                      <div className="text-muted-foreground/50 text-xs">participants</div>
                    </div>
                  )}
                </div>

                <h3 className="text-foreground font-semibold text-[17px] mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-card border border-border/10 rounded-md text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/10">
                  <div>
                    <div className="text-foreground/70 text-[13px]">{project.author}</div>
                    <div className="text-muted-foreground/50 text-xs">{project.institution}</div>
                  </div>
                  <Button variant="secondary" size="sm">Join Project</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'publications' && (
        <div>
          <div className="grid grid-cols-1 gap-4">
            {recentPublications.map(pub => (
              <div
                key={pub.id}
                className="bg-card border border-border/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="px-2.5 py-1 bg-primary/20 rounded-full text-[11px] text-primary">
                        {pub.category}
                      </span>
                      <span className="text-muted-foreground/50 text-xs">{pub.date}</span>
                    </div>
                    <h3 className="text-foreground font-semibold text-base mb-2 leading-relaxed">{pub.title}</h3>
                    <p className="text-muted-foreground text-[13px]">{pub.journal} &bull; {pub.authors}</p>
                  </div>
                  <div className="text-right ml-6 shrink-0">
                    <div className="text-[24px] font-bold text-primary">{pub.citations}</div>
                    <div className="text-muted-foreground/50 text-xs">citations</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="mt-4">
                  View Publication <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ebpTopics.map(topic => (
              <div
                key={topic.category}
                className="bg-card border border-border/10 rounded-[20px] p-6"
              >
                <h3 className="text-foreground font-semibold text-lg mb-4">{topic.category}</h3>
                <ul className="pl-5 m-0 space-y-2.5">
                  {topic.topics.map((t, i) => (
                    <li key={i} className="text-foreground/70 leading-relaxed">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-violet-500/15 to-pink-500/15 border border-violet-500/20 rounded-[20px] p-7">
            <h3 className="text-foreground font-bold text-xl mb-4">
              <ClipboardList className="inline h-5 w-5 mr-2" />
              PICO Framework for EBP Questions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { letter: 'P', title: 'Population', desc: 'Patient/Problem', example: 'ICU nurses' },
                { letter: 'I', title: 'Intervention', desc: 'What you do', example: 'Mindfulness training' },
                { letter: 'C', title: 'Comparison', desc: 'Alternative', example: 'No training' },
                { letter: 'O', title: 'Outcome', desc: 'Results', example: 'Reduce burnout' },
              ].map(pico => (
                <div key={pico.letter} className="bg-muted rounded-xl p-5 text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-foreground">
                    {pico.letter}
                  </div>
                  <div className="text-foreground font-semibold text-sm mb-1">{pico.title}</div>
                  <div className="text-muted-foreground text-xs mb-2">{pico.desc}</div>
                  <div className="text-primary text-[13px] italic">&ldquo;{pico.example}&rdquo;</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conferences' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {conferences.map((conf, i) => (
              <div
                key={i}
                className="bg-card border border-border/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-foreground font-semibold text-base m-0">{conf.name}</h3>
                  <span className="px-2.5 py-1 bg-primary/20 rounded-full text-[11px] text-primary shrink-0 ml-2">
                    {conf.type}
                  </span>
                </div>
                <div className="flex gap-5 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {conf.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {conf.date}
                  </span>
                </div>
                <Button className="mt-4 bg-gradient-to-r from-primary to-violet-500 text-foreground font-semibold">
                  Register Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {databases.map(db => (
              <div
                key={db.name}
                className="bg-card border border-border/10 rounded-2xl p-5 flex items-center gap-4"
              >
                <span className="text-[32px]">{db.icon}</span>
                <div>
                  <div className="text-foreground font-semibold text-[15px]">{db.name}</div>
                  <div className="text-muted-foreground/50 text-xs">{db.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/20 rounded-[20px] p-7">
            <h3 className="text-foreground font-bold text-xl mb-5">
              <RefreshCw className="inline h-5 w-5 mr-2" />
              7 Steps of Evidence-Based Practice
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
              {[
                { step: 1, title: 'Ask', icon: HelpCircle },
                { step: 2, title: 'Acquire', icon: Search },
                { step: 3, title: 'Appraise', icon: BarChart3 },
                { step: 4, title: 'Analyze', icon: TrendingUp },
                { step: 5, title: 'Apply', icon: Stethoscope },
                { step: 6, title: 'Assess', icon: CheckCircle2 },
                { step: 7, title: 'Adjust', icon: Wrench },
              ].map(s => (
                <div key={s.step} className="bg-muted rounded-xl p-4 text-center">
                  <s.icon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-green-500 font-bold text-xl">{s.step}</div>
                  <div className="text-muted-foreground text-[13px]">{s.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
