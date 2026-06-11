'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, CreditCard,
  Building, Shield, ArrowUpRight, ArrowDownRight,
  Download, RefreshCw, Crown, Sparkles, BarChart3,
  PieChart, Activity, Target, CheckCircle2, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RevenueMetrics {
  mrr: number;
  arr: number;
  activeSubscribers: number;
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  churnRate: number;
  ltv: number;
  arpu: number;
  verificationRevenue: number;
  hospitalRevenue: number;
  totalRevenue: number;
}

const DEMO_METRICS: RevenueMetrics = {
  mrr: 12847,
  arr: 154164,
  activeSubscribers: 847,
  freeUsers: 12534,
  proUsers: 712,
  enterpriseUsers: 135,
  churnRate: 2.4,
  ltv: 847,
  arpu: 15.17,
  verificationRevenue: 4250,
  hospitalRevenue: 8547,
  totalRevenue: 12797,
};

interface MonthlyRevenue {
  month: string;
  subscription: number;
  verification: number;
  hospital: number;
  total: number;
}

const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: 'Sep', subscription: 4200, verification: 1800, hospital: 3200, total: 9200 },
  { month: 'Oct', subscription: 4800, verification: 2100, hospital: 3800, total: 10700 },
  { month: 'Nov', subscription: 5100, verification: 2400, hospital: 4200, total: 11700 },
  { month: 'Dec', subscription: 5400, verification: 2800, hospital: 4800, total: 13000 },
  { month: 'Jan', subscription: 6200, verification: 3200, hospital: 5400, total: 14800 },
  { month: 'Feb', subscription: 6800, verification: 3600, hospital: 6000, total: 16400 },
];

interface Invoice {
  id: string;
  customer: string;
  email: string;
  type: 'subscription' | 'verification' | 'hospital';
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

const RECENT_INVOICES: Invoice[] = [
  { id: 'INV-001', customer: 'Medicore General Hospital', email: 'billing@medicore.com', type: 'hospital', amount: 1499, status: 'paid', date: '2024-03-15' },
  { id: 'INV-002', customer: 'Sarah Johnson', email: 'sarah@example.com', type: 'subscription', amount: 19, status: 'paid', date: '2024-03-14' },
  { id: 'INV-003', customer: 'City Health Medical Center', email: 'billing@cityhealth.org', type: 'hospital', amount: 599, status: 'paid', date: '2024-03-13' },
  { id: 'INV-004', customer: 'James Wilson', email: 'james@example.com', type: 'verification', amount: 29, status: 'paid', date: '2024-03-12' },
  { id: 'INV-005', customer: 'Emily Rodriguez', email: 'emily@example.com', type: 'subscription', amount: 19, status: 'pending', date: '2024-03-11' },
];

interface SubscriptionBreakdown {
  tier: string;
  users: number;
  price: number;
  revenue: number;
  percentage: number;
}

const SUBSCRIPTION_BREAKDOWN: SubscriptionBreakdown[] = [
  { tier: 'Pro ($19/mo)', users: 712, price: 19, revenue: 13528, percentage: 52 },
  { tier: 'Enterprise ($99/mo)', users: 135, price: 99, revenue: 13365, percentage: 51 },
  { tier: 'Free', users: 12534, price: 0, revenue: 0, percentage: 0 },
];

export default function RevenueDashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    trend, 
    icon: Icon, 
    color,
    prefix = ''
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    trend?: number; 
    icon: React.ElementType; 
    color: string;
    prefix?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{title}</span>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-emerald-500/40 to-teal-500/40" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-violet-500/40 to-purple-500/40" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                <DollarSign size={28} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Revenue Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time revenue analytics and metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:border-primary outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button variant="success" size="sm">
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="MRR" value={`$${DEMO_METRICS.mrr.toLocaleString()}`} trend={12.5} icon={DollarSign} color="#10B981" />
            <StatCard title="ARR" value={`$${(DEMO_METRICS.arr / 1000).toFixed(1)}K`} trend={15.2} icon={TrendingUp} color="#6366F1" />
            <StatCard title="ARPU" value={`$${DEMO_METRICS.arpu.toFixed(2)}`} trend={3.8} icon={Users} color="#8B5CF6" />
            <StatCard title="Churn Rate" value={`${DEMO_METRICS.churnRate}%`} trend={-0.3} icon={Activity} color="#EF4444" />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue Breakdown</h3>
            <PieChart size={20} className="text-violet-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Crown size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Subscription Revenue</p>
                  <p className="text-xs text-muted-foreground">Pro + Enterprise</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">${(DEMO_METRICS.mrr - DEMO_METRICS.verificationRevenue - DEMO_METRICS.hospitalRevenue).toLocaleString()}</p>
                <p className="text-xs text-emerald-400">+12.5%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Building size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Hospital Revenue</p>
                  <p className="text-xs text-muted-foreground">License subscriptions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">${DEMO_METRICS.hospitalRevenue.toLocaleString()}</p>
                <p className="text-xs text-emerald-400">+18.3%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Shield size={20} className="text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Verification Revenue</p>
                  <p className="text-xs text-muted-foreground">Credential verification</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">${DEMO_METRICS.verificationRevenue.toLocaleString()}</p>
                <p className="text-xs text-emerald-400">+8.7%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">User Distribution</h3>
            <Users size={20} className="text-primary" />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-amber-400" />
                  <span className="font-medium text-foreground">Enterprise Users</span>
                </div>
                <span className="text-lg font-bold text-amber-400">{DEMO_METRICS.enterpriseUsers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Revenue: ${(DEMO_METRICS.enterpriseUsers * 99).toLocaleString()}/mo</span>
                <span className="text-amber-400">${(DEMO_METRICS.enterpriseUsers * 99 * 12).toLocaleString()}/yr</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-violet-400" />
                  <span className="font-medium text-foreground">Pro Users</span>
                </div>
                <span className="text-lg font-bold text-violet-400">{DEMO_METRICS.proUsers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Revenue: ${(DEMO_METRICS.proUsers * 19).toLocaleString()}/mo</span>
                <span className="text-violet-400">${(DEMO_METRICS.proUsers * 19 * 12).toLocaleString()}/yr</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">Free Users</span>
                </div>
                <span className="text-lg font-bold text-muted-foreground">{DEMO_METRICS.freeUsers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground/70">Conversion target: 5%</span>
                <span className="text-muted-foreground">Potential: ${Math.floor(DEMO_METRICS.freeUsers * 0.05 * 19).toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-card border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Monthly Revenue Trend</h3>
          <BarChart3 size={20} className="text-emerald-400" />
        </div>
        
        <div className="h-64 flex items-end justify-between gap-2">
          {MONTHLY_REVENUE.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 h-52 items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.subscription / 7000) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg opacity-80"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.verification / 4000) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 + 0.1 }}
                  className="flex-1 bg-gradient-to-t from-violet-500 to-violet-400 rounded-t-lg opacity-80"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.hospital / 7000) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                  className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                />
              </div>
              <span className="text-xs text-muted-foreground">{data.month}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-xs text-muted-foreground">Subscriptions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-violet-500" />
            <span className="text-xs text-muted-foreground">Verifications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-xs text-muted-foreground">Hospitals</span>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="link" className="text-sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_INVOICES.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    invoice.type === 'hospital' ? 'bg-emerald-500/20' :
                    invoice.type === 'subscription' ? 'bg-amber-500/20' : 'bg-violet-500/20'
                  }`}>
                    {invoice.type === 'hospital' ? (
                      <Building size={18} className="text-emerald-400" />
                    ) : invoice.type === 'subscription' ? (
                      <CreditCard size={18} className="text-amber-400" />
                    ) : (
                      <Shield size={18} className="text-violet-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{invoice.customer}</p>
                    <p className="text-xs text-muted-foreground">{invoice.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${invoice.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                </div>
                <Badge
                  variant={
                    invoice.status === 'paid' ? 'success' :
                    invoice.status === 'pending' ? 'warning' : 'destructive'
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <Target size={20} className="text-emerald-400" />
            <span className="text-sm font-medium text-foreground">Customer LTV</span>
          </div>
          <p className="text-3xl font-bold text-foreground">${DEMO_METRICS.ltv}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Average lifetime value</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock size={20} className="text-amber-400" />
            <span className="text-sm font-medium text-foreground">Net Revenue Retention</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">108%</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Expansion + contraction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-5 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={20} className="text-violet-400" />
            <span className="text-sm font-medium text-foreground">Paying Customers</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{DEMO_METRICS.activeSubscribers}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Active subscriptions</p>
        </motion.div>
      </div>
    </div>
  );
}
