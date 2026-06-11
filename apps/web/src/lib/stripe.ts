import { SubscriptionTier, HospitalLicenseTier, SUBSCRIPTION_TIERS, HOSPITAL_LICENSE_TIERS } from '@/context/UserContext';
import { API_BASE_URL } from '@/lib/api-config';

export interface CreateCheckoutSessionParams {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export interface CreateHospitalCheckoutParams {
  hospitalName: string;
  hospitalEmail: string;
  licenseTier: HospitalLicenseTier;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateVerificationCheckoutParams {
  userId: string;
  userEmail: string;
  verificationType: 'basic' | 'premium' | 'urgent';
  successUrl: string;
  cancelUrl: string;
}

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const API_URL = API_BASE_URL;

export function getStripePublicKey(): string {
  return STRIPE_PUBLIC_KEY;
}

export function isStripeConfigured(): boolean {
  return Boolean(STRIPE_PUBLIC_KEY && STRIPE_PUBLIC_KEY.startsWith('pk_'));
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url?: string; sessionId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to create checkout session' };
    }

    return { url: data.url, sessionId: data.sessionId };
  } catch (error: any) {
    console.error('Checkout session error:', error);
    return { error: error.message || 'Network error' };
  }
}

export async function createSubscription(params: CreateSubscriptionParams): Promise<{ subscriptionId?: string; clientSecret?: string; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/subscription/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to create subscription' };
    }

    return { subscriptionId: data.subscriptionId, clientSecret: data.clientSecret };
  } catch (error: any) {
    console.error('Subscription error:', error);
    return { error: error.message || 'Network error' };
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/subscription/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to cancel subscription' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function createHospitalCheckout(params: CreateHospitalCheckoutParams): Promise<{ url?: string; error?: string }> {
  const tierConfig = HOSPITAL_LICENSE_TIERS[params.licenseTier];
  
  try {
    const response = await fetch(`${API_URL}/api/payment/hospital-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        price: tierConfig.price * 100,
        metadata: {
          hospitalName: params.hospitalName,
          licenseTier: params.licenseTier,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to create hospital checkout' };
    }

    return { url: data.url };
  } catch (error: any) {
    console.error('Hospital checkout error:', error);
    return { error: error.message || 'Network error' };
  }
}

export async function createVerificationPayment(params: CreateVerificationCheckoutParams): Promise<{ url?: string; error?: string }> {
  const verificationFees: Record<string, number> = {
    basic: 1500,
    premium: 2900,
    urgent: 4900,
  };

  try {
    const response = await fetch(`${API_URL}/api/payment/verification-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        amount: verificationFees[params.verificationType],
        metadata: {
          userId: params.userId,
          verificationType: params.verificationType,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to create verification payment' };
    }

    return { url: data.url };
  } catch (error: any) {
    console.error('Verification payment error:', error);
    return { error: error.message || 'Network error' };
  }
}

export async function getCustomerPortal(customerId: string): Promise<{ url?: string; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/payment/portal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || 'Failed to create portal session' };
    }

    return { url: data.url };
  } catch (error: any) {
    console.error('Portal error:', error);
    return { error: error.message || 'Network error' };
  }
}

export function getTierPrice(tier: SubscriptionTier): string {
  if (tier === 'free') return 'Free';
  const price = SUBSCRIPTION_TIERS[tier].price;
  return `$${price}`;
}

export function getTierPriceId(tier: SubscriptionTier): string | null {
  return SUBSCRIPTION_TIERS[tier].priceId;
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function getMonthlyPrice(tier: SubscriptionTier): number {
  return SUBSCRIPTION_TIERS[tier].price;
}

export function getAnnualPrice(tier: SubscriptionTier): number {
  const monthly = SUBSCRIPTION_TIERS[tier].price;
  return monthly * 12 * 0.8;
}

export function getAnnualSavings(tier: SubscriptionTier): number {
  const monthly = SUBSCRIPTION_TIERS[tier].price;
  const annual = getAnnualPrice(tier);
  return (monthly * 12) - annual;
}

export interface SubscriptionUsage {
  examsUsed: number;
  examsLimit: number;
  aiMessagesUsed: number;
  aiMessagesLimit: number;
  jobApplicationsUsed: number;
  jobApplicationsLimit: number;
}

export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0;
  if (used === 0) return 0;
  return Math.min((used / limit) * 100, 100);
}

export function isUsageExceeded(used: number, limit: number): boolean {
  if (limit === -1) return false;
  return used >= limit;
}

export function getUsageStatus(used: number, limit: number): 'ok' | 'warning' | 'exceeded' {
  if (limit === -1) return 'ok';
  const percentage = (used / limit) * 100;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 80) return 'warning';
  return 'ok';
}
