'use client';

import { motion } from 'framer-motion';
import {
  Crown, Check, X, Sparkles, Shield,
  ArrowRight, Star, Lock, CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useUser, SUBSCRIPTION_TIERS, getTierColor } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingTier {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: { name: string; included: boolean; note?: string }[];
  limits: { label: string; value: string }[];
  cta: string;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started with essential nursing tools',
    icon: <CreditCard size={24} />,
    color: '#6B7280',
    gradient: 'from-slate-500 to-slate-600',
    features: [
      { name: 'Basic exam questions (50/month)', included: true },
      { name: 'Migration tracker', included: true },
      { name: 'Dosage calculator', included: true },
      { name: 'Community access', included: true },
      { name: 'Basic profile', included: true },
      { name: 'Email support', included: true },
      { name: 'AI Study Tutor', included: false },
      { name: 'AI Clinical Assistant', included: false },
      { name: 'Unlimited exam questions', included: false },
      { name: 'Blockchain credentials', included: false },
      { name: 'Priority support', included: false },
      { name: 'Career coaching sessions', included: false },
      { name: 'Hospital recruitment tools', included: false },
      { name: 'API access', included: false },
      { name: 'Custom branding', included: false },
    ],
    limits: [
      { label: 'Exam Questions', value: '50/month' },
      { label: 'AI Messages', value: '5/day' },
      { label: 'Job Applications', value: '5/month' },
      { label: 'Career Coaching', value: 'None' },
    ],
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    period: 'per month',
    description: 'Everything you need to advance your nursing career',
    icon: <Sparkles size={24} />,
    color: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-500',
    features: [
      { name: 'Unlimited exam questions', included: true },
      { name: 'AI Study Tutor', included: true },
      { name: 'AI Clinical Assistant', included: true },
      { name: 'Priority support', included: true },
      { name: 'Analytics dashboard', included: true },
      { name: 'Certificate verification', included: true },
      { name: 'Unlimited job applications', included: true },
      { name: 'Career coaching sessions', included: true, note: '2/month' },
      { name: 'Blockchain credentials', included: true },
      { name: 'Export all data', included: true },
      { name: 'Hospital recruitment tools', included: false },
      { name: 'API access', included: false },
      { name: 'Custom branding', included: false },
      { name: 'SSO integration', included: false },
      { name: 'Dedicated account manager', included: false },
    ],
    limits: [
      { label: 'Exam Questions', value: 'Unlimited' },
      { label: 'AI Messages', value: 'Unlimited' },
      { label: 'Job Applications', value: 'Unlimited' },
      { label: 'Career Coaching', value: '2/month' },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'per month',
    description: 'Full platform access with hospital recruitment tools',
    icon: <Crown size={24} />,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Hospital recruitment tools', included: true },
      { name: 'API access', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom branding', included: true },
      { name: 'SSO integration', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority feature requests', included: true },
      { name: 'Early access to new features', included: true },
      { name: 'Unlimited career coaching', included: true },
      { name: 'Custom domains', included: true },
      { name: 'White-label solution', included: true },
      { name: 'SLA guarantees', included: true },
      { name: '24/7 priority support', included: true },
    ],
    limits: [
      { label: 'Exam Questions', value: 'Unlimited' },
      { label: 'AI Messages', value: 'Unlimited' },
      { label: 'Job Applications', value: 'Unlimited' },
      { label: 'Career Coaching', value: 'Unlimited' },
    ],
    cta: 'Contact Sales',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel your subscription at any time. You will retain access until the end of your billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Pro users get a 7-day free trial. No credit card required to start.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe payment processing.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 30-day money-back guarantee for all paid subscriptions. No questions asked.',
  },
  {
    q: 'What is included in hospital recruitment tools?',
    a: 'Access to job posting management, candidate database search, hiring analytics, and direct messaging with potential candidates.',
  },
];

export default function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const currentTier = user?.subscription?.tier || 'free';

  const annualDiscount = 0.2;

  const handleSelectPlan = async (tierId: 'free' | 'pro' | 'enterprise') => {
    if (tierId === 'free') {
      router.push('/register');
      return;
    }

    if (currentTier === tierId) {
      router.push('/settings');
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tierId,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-sm font-medium text-violet-300 mb-6">
              <Sparkles size={14} />
              Simple, transparent pricing
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Path to
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"> Success</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              From essential tools to enterprise-level features, we have a plan that fits your nursing journey.
            </p>

            <div className="inline-flex items-center gap-3 p-1.5 bg-card rounded-xl border border-border">
              <Button
                onClick={() => setBillingCycle('monthly')}
                variant={billingCycle === 'monthly' ? 'secondary' : 'ghost'}
                className="rounded-lg"
              >
                Monthly
              </Button>
              <Button
                onClick={() => setBillingCycle('annual')}
                variant={billingCycle === 'annual' ? 'secondary' : 'ghost'}
                className="rounded-lg flex items-center gap-2"
              >
                Annual
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  -20%
                </span>
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {PRICING_TIERS.map((tier, index) => {
              const isCurrent = currentTier === tier.id;
              const isPopular = tier.popular;
              const isHovered = hoveredTier === tier.id;
              const price = tier.price > 0 && billingCycle === 'annual'
                ? Math.round(tier.price * 12 * (1 - annualDiscount))
                : tier.price;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredTier(tier.id)}
                  onMouseLeave={() => setHoveredTier(null)}
                  className={cn(
                    "relative rounded-2xl transition-all duration-300",
                    isPopular
                      ? "bg-gradient-to-b from-card to-background border-2 border-primary/50 shadow-xl shadow-primary/10"
                      : "bg-card border border-border",
                    isHovered && "scale-[1.02]"
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-500/50">
                        <Star size={12} />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${tier.color}20` }}
                      >
                        <div style={{ color: tier.color }}>
                          {tier.icon}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/70">{tier.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">${price}</span>
                        {tier.price > 0 && (
                          <span className="text-muted-foreground/70">
                            /{billingCycle === 'annual' ? 'year' : 'mo'}
                          </span>
                        )}
                      </div>
                      {tier.price > 0 && billingCycle === 'annual' && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Save ${tier.price * 12 - price}/year
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleSelectPlan(tier.id)}
                      disabled={isCurrent}
                      variant={isCurrent || tier.id === 'free' ? 'secondary' : 'default'}
                      className={cn(
                        "w-full mb-6",
                        isPopular && !isCurrent && "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg hover:shadow-violet-500/50 border-0",
                        tier.id === 'enterprise' && !isCurrent && "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/50 border-0"
                      )}
                    >
                      {isCurrent ? (
                        <>
                          <Lock size={16} />
                          Current Plan
                        </>
                      ) : (
                        <>
                          {tier.cta}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>

                    <div className="space-y-2">
                      {tier.features.slice(0, 6).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {feature.included ? (
                            <Check size={16} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <X size={16} className="text-muted-foreground/50 flex-shrink-0" />
                          )}
                          <span className={feature.included ? 'text-muted-foreground' : 'text-muted-foreground/50'}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground/70 uppercase tracking-wide mb-3">Limits</p>
                      <div className="grid grid-cols-2 gap-2">
                        {tier.limits.map((limit, i) => (
                          <div key={i} className="text-xs">
                            <span className="text-muted-foreground/70">{limit.label}: </span>
                            <span className="text-muted-foreground font-medium">{limit.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-card to-background border border-border">
              <Shield size={20} className="text-emerald-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">30-day money-back guarantee</p>
                <p className="text-xs text-muted-foreground">No questions asked. Cancel anytime.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
