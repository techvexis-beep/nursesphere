'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Building2,
  Globe,
  FileText,
  Users,
  Heart,
  Calculator,
  Briefcase,
  GraduationCap,
  BookOpen,
  ShoppingBag,
  FlaskConical,
  ArrowRight,
  Check,
  Sparkles,
  Star,
  ChevronRight,
  Play,
  Zap,
  Shield,
  TrendingUp,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';
import NurseSphereLogo from '@/components/NurseSphereLogo';
import { Button } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { Badge } from '@/components/ui';

const features = [
  {
    title: 'AI Clinical Intelligence',
    description: 'AI-powered clinical decision support, drug interaction alerts, and evidence-based practice recommendations.',
    icon: Brain,
    href: '/dashboard',
    color: 'from-violet-500/20 to-indigo-500/20',
    iconColor: 'text-violet-400',
    borderColor: 'hover:border-violet-500/40',
  },
  {
    title: 'Global Nursing Regulators',
    description: 'Official licensing pathways, requirements, and timelines from verified nursing boards in 120+ countries.',
    icon: Building2,
    href: '/regulators',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'hover:border-blue-500/40',
  },
  {
    title: 'Migration Tracker',
    description: 'End-to-end tracking for NCLEX, IELTS, OET, visa processing, and credential verification.',
    icon: Globe,
    href: '/migration',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/40',
  },
  {
    title: 'CBT Exam Platform',
    description: 'Adaptive computer-based testing with thousands of questions, real-time analytics, and performance insights.',
    icon: FileText,
    href: '/exams',
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'hover:border-amber-500/40',
  },
  {
    title: 'Community Network',
    description: 'Connect with 50,000+ nurses worldwide. Share knowledge, join discussions, and earn achievement badges.',
    icon: Users,
    href: '/community',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
    borderColor: 'hover:border-pink-500/40',
  },
  {
    title: 'Mental Health & Wellness',
    description: 'Burnout assessments, peer support channels, mindfulness exercises, and professional counseling resources.',
    icon: Heart,
    href: '/mental-health',
    color: 'from-red-500/20 to-pink-500/20',
    iconColor: 'text-red-400',
    borderColor: 'hover:border-red-500/40',
  },
  {
    title: 'Dosage Calculator',
    description: 'Precision dosage calculations with weight-based, pediatric, and renal-adjusted dosing support.',
    icon: Calculator,
    href: '/dosage',
    color: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/40',
  },
  {
    title: 'Job Board',
    description: 'Curated international nursing positions with salary insights, visa sponsorship filters, and direct apply.',
    icon: Briefcase,
    href: '/jobs',
    color: 'from-indigo-500/20 to-violet-500/20',
    iconColor: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/40',
  },
  {
    title: 'AI Study Tutor',
    description: 'Personalized study plans, spaced repetition, weak-area targeting, and AI-generated practice questions.',
    icon: GraduationCap,
    href: '/study-tutor',
    color: 'from-purple-500/20 to-fuchsia-500/20',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/40',
  },
  {
    title: 'Clinical Logbook',
    description: 'Digital portfolio for documenting clinical hours, procedures, competencies, and continuing education.',
    icon: BookOpen,
    href: '/logbook',
    color: 'from-teal-500/20 to-emerald-500/20',
    iconColor: 'text-teal-400',
    borderColor: 'hover:border-teal-500/40',
  },
  {
    title: 'Nursing Marketplace',
    description: 'Buy and sell study materials, equipment, scrubs, and resources from trusted nurse entrepreneurs.',
    icon: ShoppingBag,
    href: '/marketplace',
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'hover:border-orange-500/40',
  },
  {
    title: 'Research Hub',
    description: 'Access latest nursing research, contribute to studies, and stay current with evidence-based practice.',
    icon: FlaskConical,
    href: '/research',
    color: 'from-rose-500/20 to-red-500/20',
    iconColor: 'text-rose-400',
    borderColor: 'hover:border-rose-500/40',
  },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Active Nurses', icon: Users },
  { value: 120, suffix: '+', label: 'Countries', icon: Globe },
  { value: 95, suffix: '%', label: 'NCLEX Pass Rate', icon: TrendingUp },
  { value: 18, suffix: '+', label: 'Nursing Boards', icon: Shield },
];

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up in seconds and tell us about your nursing background, goals, and dream destination.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Choose Your Pathway',
    description: 'Select your target country and get a personalized roadmap with exams, certifications, and timelines.',
    icon: Map,
  },
  {
    number: '03',
    title: 'Track & Succeed',
    description: 'Monitor your progress, ace your exams with AI tutoring, and land your dream nursing position.',
    icon: CheckCircle,
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'RN, migrated to USA',
    text: 'NurseSphere made my migration journey seamless. The tracker kept me organized throughout the NCLEX and visa process. I could not have done it without this platform.',
    country: 'Nigeria → USA',
    rating: 5,
  },
  {
    name: 'Amara Okonkwo',
    role: 'NP Candidate, Canada',
    text: 'The exam prep platform is incredible. I went from 55% to 92% in just 3 months of consistent practice. The AI tutor knew exactly where I needed help.',
    country: 'Nigeria → Canada',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'ICU Nurse, UK',
    text: 'The migration tracker helped me stay on top of OET preparation and visa applications. The community support was invaluable during the process.',
    country: 'India → UK',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Basic exam questions',
      'Migration tracker',
      'Dosage calculator',
      'Community access',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'Best for serious nurses',
    features: [
      'Unlimited exams',
      'AI clinical assistant',
      'Priority support',
      'Analytics dashboard',
      'Certificate verification',
      'AI study tutor',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For institutions and teams',
    features: [
      'Everything in Pro',
      'Hospital onboarding',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Bulk licensing tools',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
];

const partners = [
  'WHO', 'ICN', 'ANA', 'NCSBN', 'Pearson VUE', 'British Council',
];

function Map({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatted = count >= 1000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count.toString();

  return (
    <span ref={ref}>
      {formatted}{suffix}
    </span>
  );
}

function FloatingShape({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.04,
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-primary to-pink-500 z-[60] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <NurseSphereLogo size={24} animated={false} />
            </div>
            <span className="font-semibold text-foreground">NurseSphere</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-border flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">Log in</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 min-h-[90vh] flex items-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 hero-gradient-bg" />

        {/* Floating Shapes */}
        <FloatingShape
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-violet-500/10 to-transparent blur-3xl"
          delay={0}
        />
        <FloatingShape
          className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/8 to-transparent blur-3xl"
          delay={2}
        />
        <FloatingShape
          className="absolute bottom-20 left-[20%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl"
          delay={4}
        />

        {/* Decorative Grid Dots */}
        <div className="absolute inset-0 dot-pattern opacity-30 dark:dot-pattern-dark" />

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-32 left-[8%] w-3 h-3 rounded-full bg-violet-400/40"
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-48 right-[12%] w-2 h-2 rounded-full bg-pink-400/50"
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-[30%] w-4 h-4 rounded-sm bg-blue-400/30 rotate-45"
          animate={{ y: [0, -10, 0], rotate: [45, 90, 45], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.div
          className="absolute top-60 left-[45%] w-2 h-2 rounded-full bg-emerald-400/40"
          animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute bottom-40 right-[25%] w-3 h-3 rounded-full bg-amber-400/30"
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Badge variant="secondary" className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Trusted by 50,000+ nurses worldwide
            </Badge>
          </motion.div>

          {/* Headline with word-by-word animation */}
          <div className="mb-8">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[1.05]"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              <motion.span
                className="block"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                The future of
              </motion.span>
              <motion.span
                className="block gradient-text"
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                global nursing
              </motion.span>
            </motion.h1>
          </div>

          {/* Animated Explainer Paragraph */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <WordReveal
              text="The first AI-powered platform designed specifically for nurses pursuing global careers. Track your migration, ace your exams, and advance your career — all in one place."
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
              delay={0.6}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link href="/register">
              <Button size="lg" className="group relative overflow-hidden px-8 py-6 text-base font-semibold">
                <span className="relative z-10 flex items-center gap-2">
                  Start for free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="group px-8 py-6 text-base font-semibold">
                <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
                View demo
              </Button>
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════ PARTNERS / TRUSTED BY ═══════════════ */}
      <section className="py-12 px-4 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by leading nursing organizations
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                className="text-lg md:text-xl font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section id="features" className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for nurses pursuing global opportunities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.4 }}
              >
                <Link href={feature.href}>
                  <Card className={`h-full card-glow border-border/50 ${feature.borderColor} transition-all duration-300 cursor-pointer group`}>
                    <CardContent className="p-6">
                      <div className={`feature-icon-wrapper bg-gradient-to-br ${feature.color} mb-4`}>
                        <feature.icon className={`w-6 h-6 ${feature.iconColor} transition-transform group-hover:scale-110`} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 bg-muted/30 section-fade-top">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Start in minutes, succeed for life
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your nursing career
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-violet-500/20 via-primary/30 to-pink-500/20" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-primary/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <step.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <div className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section id="testimonials" className="py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Loved by nurses worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="h-full card-glow border-border/50 hover:border-primary/30">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed flex-1">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center font-semibold text-foreground text-sm">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role} · {testimonial.country}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING SECTION ═══════════════ */}
      <section id="pricing" className="py-20 md:py-32 px-4 bg-muted/30 section-fade-top">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4 inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20'
                      : 'border-border/50 hover:border-border'
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground">{plan.period}</span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className="block">
                      <Button
                        variant={plan.popular ? 'default' : 'outline'}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-primary/5 to-pink-600/10" />
        <motion.div
          className="absolute top-10 left-[10%] w-40 h-40 rounded-full bg-violet-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-[15%] w-56 h-56 rounded-full bg-pink-500/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Ready to transform your nursing career?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join 50,000+ nurses who have already taken control of their professional journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="group relative overflow-hidden px-8 py-6 text-base font-semibold">
                  <span className="relative z-10 flex items-center gap-2">
                    Get started free
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="px-8 py-6 text-base font-semibold">
                  View demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <NurseSphereLogo size={24} animated={false} />
                </div>
                <span className="font-semibold text-foreground">NurseSphere</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering nurses worldwide with AI-driven tools for education, migration, and career advancement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/exams" className="hover:text-foreground transition-colors">CBT Exams</Link></li>
                <li><Link href="/migration" className="hover:text-foreground transition-colors">Migration</Link></li>
                <li><Link href="/jobs" className="hover:text-foreground transition-colors">Jobs</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">HIPAA</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            &copy; 2026 NurseSphere. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
