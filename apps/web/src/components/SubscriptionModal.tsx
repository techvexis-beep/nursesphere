'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Crown, Check, Sparkles, Zap, Shield, 
  BarChart3, GraduationCap, Users, Globe,
  CreditCard, Lock, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useUser, SUBSCRIPTION_TIERS, getTierColor, SubscriptionTier } from '@/context/UserContext';
import { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTier?: 'free' | 'pro' | 'enterprise';
  feature?: string;
}

const TIER_FEATURES: Record<'free' | 'pro' | 'enterprise', { icon: React.ReactNode; label: string }[]> = {
  free: [
    { icon: <CreditCard size={16} />, label: 'Basic profile' },
    { icon: <BarChart3 size={16} />, label: '50 exam questions/month' },
    { icon: <Shield size={16} />, label: 'Community access' },
    { icon: <Users size={16} />, label: 'Email support' },
  ],
  pro: [
    { icon: <GraduationCap size={16} />, label: 'Unlimited exam questions' },
    { icon: <Sparkles size={16} />, label: 'AI Study Tutor' },
    { icon: <Zap size={16} />, label: 'AI Clinical Assistant' },
    { icon: <BarChart3 size={16} />, label: 'Analytics dashboard' },
    { icon: <Shield size={16} />, label: 'Blockchain credentials' },
    { icon: <Users size={16} />, label: 'Career coaching (2/mo)' },
  ],
  enterprise: [
    { icon: <Crown size={16} />, label: 'Hospital recruitment tools' },
    { icon: <Globe size={16} />, label: 'API access' },
    { icon: <Sparkles size={16} />, label: 'Everything in Pro' },
    { icon: <Users size={16} />, label: 'Dedicated account manager' },
    { icon: <Shield size={16} />, label: 'Custom branding' },
    { icon: <Zap size={16} />, label: 'SSO integration' },
  ],
};

export default function SubscriptionModal({ 
  isOpen, 
  onClose, 
  targetTier = 'pro',
  feature 
}: SubscriptionModalProps) {
  const { user } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  
  const currentTier: SubscriptionTier = user?.subscription?.tier || 'free';
  const tierInfo = SUBSCRIPTION_TIERS[targetTier];
  const tierColor = getTierColor(targetTier);
  
  const isUpgrade = targetTier === 'pro' || targetTier === 'enterprise';
  const isDowngrade = currentTier === 'enterprise' && targetTier === 'pro';
  const isCurrent = currentTier === targetTier;

  const price = tierInfo.price > 0 && billingCycle === 'annual' 
    ? Math.round(tierInfo.price * 12 * 0.8) 
    : tierInfo.price;

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier: targetTier,
          billingCycle,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: `radial-gradient(circle, ${tierColor}40, transparent)` }}
            />
          </div>

          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${tierColor}30, ${tierColor}10)`,
                  border: `1px solid ${tierColor}30`,
                }}
              >
                {targetTier === 'free' ? (
                  <CreditCard size={24} className="text-slate-400" />
                ) : (
                  <Crown size={24} style={{ color: tierColor }} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isCurrent ? `${tierInfo.name} Plan` : `Upgrade to ${tierInfo.name}`}
                </h2>
                {feature && (
                  <p className="text-xs text-slate-400">Unlocks: {feature}</p>
                )}
              </div>
            </div>

            {isCurrent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  You're on the {tierInfo.name} Plan
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  You have access to all {tierInfo.name} features.
                </p>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                >
                  Manage Subscription
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">${price}</span>
                  {tierInfo.price > 0 && (
                    <span className="text-slate-500">
                      /{billingCycle === 'annual' ? 'year' : 'month'}
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 p-1 bg-slate-700/50 rounded-lg mb-6">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-slate-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-slate-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Annual
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      -20%
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {TIER_FEATURES[targetTier]?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <div style={{ color: tierColor }}>{item.icon}</div>
                      {item.label}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ 
                    background: `linear-gradient(135deg, ${tierColor}, ${targetTier === 'enterprise' ? '#EA580C' : '#7C3AED'})`,
                    boxShadow: `0 4px 20px ${tierColor}40`,
                  }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Lock size={16} />
                    </motion.div>
                  ) : (
                    <>
                      {isDowngrade ? 'Downgrade Plan' : 'Upgrade Now'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  7-day free trial included. Cancel anytime.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
