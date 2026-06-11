'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Lock, Sparkles, ArrowRight, Check, 
  Zap, Shield, BarChart3, Users, Globe, Code,
  Briefcase, GraduationCap, TrendingUp, Award
} from 'lucide-react';
import Link from 'next/link';
import { useUser, SUBSCRIPTION_TIERS, getTierGradient } from '@/context/UserContext';

type FeatureCategory = 
  | 'ai_tutor'
  | 'ai_diagnosis'
  | 'analytics'
  | 'blockchain_credentials'
  | 'hospital_tools'
  | 'api_access'
  | 'custom_branding'
  | 'unlimited_exams'
  | 'career_coaching'
  | 'priority_support';

interface FeatureInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  category: FeatureCategory;
  requiredTier: 'pro' | 'enterprise';
  benefits: string[];
}

const FEATURE_CATALOG: Record<FeatureCategory, FeatureInfo> = {
  ai_tutor: {
    name: 'AI Study Tutor',
    description: 'Personalized AI-powered learning assistant available 24/7',
    icon: <Sparkles size={20} />,
    category: 'ai_tutor',
    requiredTier: 'pro',
    benefits: ['Unlimited questions', 'Adaptive learning paths', 'Instant explanations'],
  },
  ai_diagnosis: {
    name: 'AI Clinical Assistant',
    description: 'Smart clinical decision support powered by advanced AI',
    icon: <Zap size={20} />,
    category: 'ai_diagnosis',
    requiredTier: 'pro',
    benefits: ['Clinical decision support', 'Evidence-based recommendations', 'Real-time analysis'],
  },
  analytics: {
    name: 'Analytics Dashboard',
    description: 'Track your progress with detailed insights and metrics',
    icon: <BarChart3 size={20} />,
    category: 'analytics',
    requiredTier: 'pro',
    benefits: ['Performance metrics', 'Progress tracking', 'Custom reports'],
  },
  blockchain_credentials: {
    name: 'Blockchain Credentials',
    description: 'Tamper-proof verification and credentials storage',
    icon: <Shield size={20} />,
    category: 'blockchain_credentials',
    requiredTier: 'pro',
    benefits: ['Tamper-proof records', 'Instant verification', 'Global recognition'],
  },
  hospital_tools: {
    name: 'Hospital Recruitment Tools',
    description: 'Access enterprise hiring and recruitment features',
    icon: <Briefcase size={20} />,
    category: 'hospital_tools',
    requiredTier: 'enterprise',
    benefits: ['Job posting management', 'Candidate database access', 'Hiring analytics'],
  },
  api_access: {
    name: 'API Access',
    description: 'Build custom integrations with our developer API',
    icon: <Code size={20} />,
    category: 'api_access',
    requiredTier: 'enterprise',
    benefits: ['REST API access', 'Webhooks', 'Custom integrations'],
  },
  custom_branding: {
    name: 'Custom Branding',
    description: 'White-label solution with your organization branding',
    icon: <Award size={20} />,
    category: 'custom_branding',
    requiredTier: 'enterprise',
    benefits: ['Custom domains', 'Logo removal', 'Branded experience'],
  },
  unlimited_exams: {
    name: 'Unlimited Exam Questions',
    description: 'Practice without limits with our full question bank',
    icon: <GraduationCap size={20} />,
    category: 'unlimited_exams',
    requiredTier: 'pro',
    benefits: ['50,000+ questions', 'All specialties', 'Latest NCLEX format'],
  },
  career_coaching: {
    name: 'Career Coaching Sessions',
    description: 'One-on-one sessions with nursing career experts',
    icon: <Users size={20} />,
    category: 'career_coaching',
    requiredTier: 'pro',
    benefits: ['Expert guidance', 'Resume reviews', 'Interview prep'],
  },
  priority_support: {
    name: 'Priority Support',
    description: 'Get fast-track support from our dedicated team',
    icon: <Globe size={20} />,
    category: 'priority_support',
    requiredTier: 'enterprise',
    benefits: ['24/7 support', 'Dedicated manager', 'SLA guarantees'],
  },
};

interface PremiumGateProps {
  feature?: FeatureCategory | FeatureCategory[];
  children: React.ReactNode;
  title?: string;
  description?: string;
  mode?: 'blur' | 'lock' | 'upgrade';
  showBenefits?: boolean;
  className?: string;
  compact?: boolean;
}

export default function PremiumGate({
  feature,
  children,
  title,
  description,
  mode = 'upgrade',
  showBenefits = true,
  className = '',
  compact = false,
}: PremiumGateProps) {
  const { user } = useUser();
  
  const currentTier = user?.subscription?.tier || 'free';
  const isPro = currentTier === 'pro' || currentTier === 'enterprise';
  const isEnterprise = currentTier === 'enterprise';
  
  const features = feature 
    ? (Array.isArray(feature) ? feature : [feature]).map(f => FEATURE_CATALOG[f]).filter(Boolean)
    : [];
  
  const canAccess = features.every(f => {
    if (f.requiredTier === 'enterprise') return isEnterprise;
    return isPro || isEnterprise;
  });

  if (canAccess) {
    return <>{children}</>;
  }

  const requiredTier = features.length > 0 
    ? features.some(f => f.requiredTier === 'enterprise') ? 'enterprise' : 'pro'
    : 'pro';

  const requiredTierInfo = SUBSCRIPTION_TIERS[requiredTier];
  const requiredTierColor = requiredTier === 'enterprise' ? '#F59E0B' : '#8B5CF6';

  if (mode === 'blur') {
    return (
      <div className={`relative ${className}`}>
        <div className="blur-sm select-none pointer-events-none opacity-50">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <UpgradePrompt 
            features={features}
            requiredTier={requiredTier}
            requiredTierInfo={requiredTierInfo}
            requiredTierColor={requiredTierColor}
            title={title}
            description={description}
            showBenefits={showBenefits}
            compact={compact}
          />
        </div>
      </div>
    );
  }

  if (mode === 'lock') {
    return (
      <div className={`relative ${className}`}>
        {children}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <UpgradePrompt 
            features={features}
            requiredTier={requiredTier}
            requiredTierInfo={requiredTierInfo}
            requiredTierColor={requiredTierColor}
            title={title}
            description={description}
            showBenefits={showBenefits}
            compact={compact}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <UpgradePrompt 
        features={features}
        requiredTier={requiredTier}
        requiredTierInfo={requiredTierInfo}
        requiredTierColor={requiredTierColor}
        title={title}
        description={description}
        showBenefits={showBenefits}
        compact={compact}
      />
    </div>
  );
}

interface UpgradePromptProps {
  features: FeatureInfo[];
  requiredTier: 'pro' | 'enterprise';
  requiredTierInfo: typeof SUBSCRIPTION_TIERS.pro | typeof SUBSCRIPTION_TIERS.enterprise;
  requiredTierColor: string;
  title?: string;
  description?: string;
  showBenefits: boolean;
  compact: boolean;
}

function UpgradePrompt({
  features,
  requiredTier,
  requiredTierInfo,
  requiredTierColor,
  title,
  description,
  showBenefits,
  compact,
}: UpgradePromptProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm"
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${requiredTierColor}20` }}
        >
          <Crown size={18} style={{ color: requiredTierColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">
            {title || 'Upgrade to ' + requiredTierInfo.name}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {description || `${requiredTierInfo.price > 0 ? `$${requiredTierInfo.price}/mo` : 'Free'} - Unlock this feature`}
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
          style={{ 
            background: `linear-gradient(135deg, ${requiredTierColor}, ${requiredTier === 'enterprise' ? '#EA580C' : '#7C3AED'})`,
          }}
        >
          Upgrade
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 backdrop-blur-xl"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${requiredTierColor}40, transparent)` }}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${requiredTier === 'enterprise' ? '#F59E0B' : '#8B5CF6'}40, transparent)` }}
        />
      </div>

      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${requiredTierColor}30, ${requiredTier === 'enterprise' ? '#EA580C30' : '#7C3AED30'})`,
              border: `1px solid ${requiredTierColor}30`,
            }}
          >
            <Crown size={28} style={{ color: requiredTierColor }} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              {title || (requiredTier === 'enterprise' ? 'Enterprise Feature' : 'Pro Feature')}
            </h3>
            <p className="text-sm text-slate-400">
              {description || `Upgrade to ${requiredTierInfo.name} to unlock this feature and more!`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              background: `linear-gradient(135deg, ${requiredTierColor}20, ${requiredTier === 'enterprise' ? '#EA580C20' : '#7C3AED20'})`,
              color: requiredTierColor,
              border: `1px solid ${requiredTierColor}40`,
            }}
          >
            {requiredTierInfo.name}
          </span>
          <span className="text-sm text-slate-300 font-semibold">
            ${requiredTierInfo.price}
            <span className="text-slate-500 font-normal">/month</span>
          </span>
        </div>

        {features.length > 0 && features[0] && showBenefits && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Check size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                {features[0].name} Includes
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {features[0].benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-xs text-slate-400"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {features.length > 1 && (
          <div className="mb-5 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
            <p className="text-xs text-slate-400 mb-2">
              <TrendingUp size={12} className="inline mr-1 text-indigo-400" />
              Also unlocks {features.length - 1} more premium features
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: `linear-gradient(135deg, ${requiredTierColor}, ${requiredTier === 'enterprise' ? '#EA580C' : '#7C3AED'})`,
              boxShadow: `0 4px 20px ${requiredTierColor}40`,
            }}
          >
            <Crown size={16} />
            Upgrade Now
            <ArrowRight size={16} />
          </Link>
          
          <Link
            href="/pricing"
            className="px-4 py-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-600"
          >
            Compare Plans
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export { FEATURE_CATALOG };
export type { FeatureCategory, FeatureInfo };
