'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardList, Calculator, Globe, GraduationCap,
  Shield, Heart, Briefcase, Sparkles, ChevronRight,
  ExternalLink, Check, ArrowRight, Star, Users,
  Award, Zap, Crown
} from 'lucide-react';
import NurseSphereLogo from '@/components/NurseSphereLogo';

const modules = [
  {
    id: 'logbook',
    icon: ClipboardList,
    title: 'Clinical Logbook',
    desc: 'Digital case documentation with supervisor verification and PDF export. Replace paper logbooks forever.',
    color: '#6366F1',
    route: '/logbook',
    features: ['Smart case entry', 'Supervisor sign-off', 'PDF export', 'Progress tracking'],
  },
  {
    id: 'dosage',
    icon: Calculator,
    title: 'Dosage Calculator',
    desc: 'AI-powered drug dosage engine with IV drip rates, pediatric dosing, BSA, and double-check safety validation.',
    color: '#EC4899',
    route: '/dosage',
    features: ['IV drip rate', 'Pediatric dosing', 'BSA calculator', 'Safety double-check'],
  },
  {
    id: 'migration',
    icon: Globe,
    title: 'Migration Tracker',
    desc: 'End-to-end international licensure pathways. Track NCLEX, credential evaluation, visa timelines, and costs.',
    color: '#3B82F6',
    route: '/migration',
    features: ['Country selection', 'Progress tracking', 'Cost estimator', 'Readiness score'],
  },
  {
    id: 'exams',
    icon: GraduationCap,
    title: 'NCLEX/CBT Prep',
    desc: 'Adaptive question bank with timed mock exams, detailed rationales, and performance analytics.',
    color: '#10B981',
    route: '/exams',
    features: ['Adaptive difficulty', 'Timed mock exams', 'Performance analytics', 'Detailed rationales'],
  },
  {
    id: 'advocacy',
    icon: Shield,
    title: 'Advocacy & Safety',
    desc: 'Anonymous workplace reporting, salary transparency heatmaps, and burnout risk indicators.',
    color: '#F59E0B',
    route: '/advocacy',
    features: ['Anonymous reporting', 'Salary heatmaps', 'Burnout assessment', 'Peer support'],
  },
  {
    id: 'wellness',
    icon: Heart,
    title: 'Wellness Hub',
    desc: 'Mental health tools tailored for nurses — self-assessment, journaling, mindfulness, and crisis resources.',
    color: '#8B5CF6',
    route: '/mental-health',
    features: ['Self-assessment', 'Anonymous journaling', 'Mindfulness exercises', 'Crisis resources'],
  },
  {
    id: 'marketplace',
    icon: Briefcase,
    title: 'Marketplace & Jobs',
    desc: 'Nursing job board, study materials marketplace, scrubs, equipment, and professional services.',
    color: '#06B6D4',
    route: '/marketplace',
    features: ['Job board', 'Study materials', 'Professional services', 'Nurse community'],
  },
];

const stats = [
  { icon: Users, value: '29M+', label: 'Global nurses' },
  { icon: Award, value: '7', label: 'Integrated tools' },
  { icon: Star, value: 'AI', label: 'Powered experience' },
  { icon: Zap, value: 'Offline', label: 'First architecture' },
];

export default function PrototypePage() {
  const [activeModule, setActiveModule] = useState(modules[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <NurseSphereLogo size={24} animated />
            </div>
            <span className="text-sm font-semibold text-muted-foreground">Team Synapse</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
            NurseSphere
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 text-2xl md:text-3xl mt-2">
              AI-Powered Global Nursing Ecosystem
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Seven integrated tools. One platform. Empowering every nurse, everywhere.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Launch Live Demo <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border font-semibold hover:bg-accent transition-all"
            >
              Create Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module Showcase */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Core Modules</h2>
        <p className="text-muted-foreground mb-10">Explore each module of the NurseSphere platform</p>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Module Tabs */}
          <div className="space-y-1">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-primary/10 shadow-sm border border-primary/20'
                      : 'hover:bg-muted/60 border border-transparent'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${m.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: m.color }} />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {m.title}
                  </span>
                  {isActive && <ChevronRight className="h-4 w-4 text-primary ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Module Detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${activeModule.color}20` }}
                >
                  <activeModule.icon className="h-7 w-7" style={{ color: activeModule.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{activeModule.title}</h3>
                  <p className="text-muted-foreground mt-1">{activeModule.desc}</p>
                </div>
                <Link
                  href={activeModule.route}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shrink-0"
                >
                  Live Demo <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-3">
                {activeModule.features.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${activeModule.color}20` }}>
                      <Check className="h-4 w-4" style={{ color: activeModule.color }} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </motion.div>
                ))}
              </div>

              {/* Preview Area */}
              <div className="mt-6 p-8 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border/50 flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <activeModule.icon className="h-12 w-12 mx-auto mb-3" style={{ color: activeModule.color }} />
                  <p className="text-foreground font-semibold">{activeModule.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">Click "Live Demo" to see the full working module</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Innovation Highlights */}
      <section className="border-t border-border/50 bg-card/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Why NurseSphere Wins</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered',
                desc: 'Clinical reasoning, adaptive learning, and smart recommendations powered by Gemini AI.',
              },
              {
                icon: Crown,
                title: 'All-in-One',
                desc: 'Seven modules unified in one platform — no more juggling multiple disconnected tools.',
              },
              {
                icon: Shield,
                title: 'Nurse-First',
                desc: 'Built with and for nurses. Anonymous advocacy, wellness support, and community at the core.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl bg-card border border-border text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ready to see it in action?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          NurseSphere is live and functional. Explore each module, create an account, and experience the future of nursing.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
          >
            Launch Live Demo <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border font-semibold hover:bg-accent transition-all"
          >
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>Team Synapse × NurseSphere — OPay National Innovation Challenge 2026</p>
      </footer>
    </div>
  );
}
