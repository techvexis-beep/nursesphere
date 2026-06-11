'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Megaphone, ClipboardList, HelpCircle,
  Video, TrendingUp, Settings, Users, Eye, ArrowRight
} from 'lucide-react';

interface DashboardStats {
  totalPathways: number;
  totalAnnouncements: number;
  totalFAQs: number;
  upcomingSessions: number;
  profileViews: number;
  totalTrackers: number;
  recentTrackers: number;
  pendingQuestions: number;
}

interface RecentActivity {
  id: string;
  type: 'announcement' | 'pathway' | 'faq' | 'session';
  title: string;
  date: string;
}

interface TrackerUser {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  targetCountry: string;
  readinessScore: number;
  trackedAt: string;
}

export default function RegulatorDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPathways: 3,
    totalAnnouncements: 2,
    totalFAQs: 5,
    upcomingSessions: 2,
    profileViews: 1250,
    totalTrackers: 1247,
    recentTrackers: 89,
    pendingQuestions: 23,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([
    { id: '1', type: 'announcement', title: 'NCLEX Passing Standard Update', date: '2026-03-15' },
    { id: '2', type: 'pathway', title: 'New RN Pathway Added', date: '2026-03-14' },
    { id: '3', type: 'faq', title: 'FAQ: Exam Requirements Updated', date: '2026-03-12' },
    { id: '4', type: 'session', title: 'Live Q&A Scheduled', date: '2026-03-10' },
  ]);

  const [trackers, setTrackers] = useState<TrackerUser[]>([
    { id: '1', firstName: 'Sarah', lastName: 'Johnson', country: 'Nigeria', targetCountry: 'USA', readinessScore: 45, trackedAt: '2026-03-16' },
    { id: '2', firstName: 'Maria', lastName: 'Garcia', country: 'Philippines', targetCountry: 'USA', readinessScore: 70, trackedAt: '2026-03-15' },
    { id: '3', firstName: 'James', lastName: 'Wilson', country: 'India', targetCountry: 'UK', readinessScore: 30, trackedAt: '2026-03-14' },
    { id: '4', firstName: 'Amara', lastName: 'Okafor', country: 'Nigeria', targetCountry: 'Canada', readinessScore: 55, trackedAt: '2026-03-13' },
    { id: '5', firstName: 'Chen', lastName: 'Wei', country: 'China', targetCountry: 'Australia', readinessScore: 25, trackedAt: '2026-03-12' },
  ]);

  const activityIcons: Record<string, React.ElementType> = {
    announcement: Megaphone,
    pathway: ClipboardList,
    faq: HelpCircle,
    session: Video,
  };

  const ActivityIcon = ({ type, className }: { type: string; className?: string }) => {
    const Icon = activityIcons[type] || Megaphone;
    return <Icon className={className} />;
  };

  const activityColors: Record<string, string> = {
    announcement: 'bg-pink-500/20 text-pink-400',
    pathway: 'bg-primary/20 text-indigo-300',
    faq: 'bg-emerald-500/20 text-emerald-400',
    session: 'bg-red-500/20 text-red-400',
  };

  const quickActions = [
    { icon: Megaphone, label: 'Post Announcement', href: '/regulator-dashboard/announcements', color: '#EC4899' },
    { icon: ClipboardList, label: 'Add Pathway', href: '/regulator-dashboard/pathways', color: '#6366F1' },
    { icon: HelpCircle, label: 'Add FAQ', href: '/regulator-dashboard/faqs', color: '#10B981' },
    { icon: Video, label: 'Schedule Live Q&A', href: '/regulator-dashboard/live', color: '#EF4444' },
  ];

  const statCards = [
    { icon: Users, label: 'Nurses Tracking', value: stats.totalTrackers.toLocaleString(), color: '#3B82F6' },
    { icon: TrendingUp, label: 'New This Week', value: stats.recentTrackers, color: '#10B981' },
    { icon: HelpCircle, label: 'Pending Questions', value: stats.pendingQuestions, color: '#F59E0B' },
    { icon: Eye, label: 'Profile Views', value: stats.profileViews.toLocaleString(), color: '#8B5CF6' },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/regulator-dashboard', active: true },
    { icon: Megaphone, label: 'Announcements', href: '/regulator-dashboard/announcements', badge: '2' },
    { icon: ClipboardList, label: 'Pathways', href: '/regulator-dashboard/pathways', badge: '3' },
    { icon: HelpCircle, label: 'FAQs', href: '/regulator-dashboard/faqs', badge: '5' },
    { icon: Video, label: 'Live Sessions', href: '/regulator-dashboard/live', badge: '2' },
    { icon: TrendingUp, label: 'Analytics', href: '/regulator-dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/regulator-dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <div className="w-[280px] min-h-screen bg-background/30 border-r border-border p-6 fixed left-0 top-0">
          <Link href="/" className="flex items-center gap-3 no-underline mb-8 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-lg text-foreground">Regulator</span>
          </Link>

          <div className="p-4 bg-primary/10 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-lg font-semibold text-white">
                A
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">Admin User</div>
                <div className="text-xs text-muted-foreground">NCSBN Admin</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl no-underline border border-transparent transition-all duration-200",
                  item.active
                    ? "bg-primary/15 border-primary/30 text-indigo-300"
                    : "text-muted-foreground hover:bg-primary/15 hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-[18px] w-[18px]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-primary/20 rounded-lg text-xs text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 ml-[280px] p-8">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">Manage your regulator profile and content</p>
          </div>

          <div className="grid grid-cols-4 gap-5 mb-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border backdrop-blur-xl rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="h-7 w-7" style={{ color: stat.color }} />
                  <span className="text-[28px] font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card border border-border backdrop-blur-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-5">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                {quickActions.map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 p-3.5 rounded-xl no-underline text-foreground transition-all duration-200 hover:brightness-110"
                    style={{
                      background: `${action.color}10`,
                      border: `1px solid ${action.color}30`,
                    }}
                  >
                    <action.icon className="h-[18px] w-[18px]" style={{ color: action.color }} />
                    <span className="text-sm font-medium">{action.label}</span>
                    <span className="ml-auto" style={{ color: action.color }}>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border backdrop-blur-xl rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-5">Recent Activity</h3>
              <div className="flex flex-col gap-4">
                 {activities.map((activity) => {
                  return (
                    <div key={activity.id} className="flex items-center gap-3 pb-4 border-b border-border/50 last:border-b-0 last:pb-0">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center",
                        activityColors[activity.type]
                      )}>
                        <ActivityIcon type={activity.type} className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-0.5">{activity.title}</div>
                        <div className="text-xs text-muted-foreground/50">{activity.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-card border border-border backdrop-blur-xl rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Nurses Tracking Your Regulator</h3>
                  <p className="text-[13px] text-muted-foreground">Users interested in your licensing pathways</p>
                </div>
                <Button variant="outline" size="sm" className="border-primary/30 text-indigo-300 bg-primary/10 hover:bg-primary/20">
                  Export List
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-muted-foreground text-xs font-medium">Nurse</th>
                      <th className="text-left p-3 text-muted-foreground text-xs font-medium">Origin</th>
                      <th className="text-left p-3 text-muted-foreground text-xs font-medium">Target</th>
                      <th className="text-left p-3 text-muted-foreground text-xs font-medium">Progress</th>
                      <th className="text-left p-3 text-muted-foreground text-xs font-medium">Tracked</th>
                      <th className="text-right p-3 text-muted-foreground text-xs font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackers.map((tracker) => (
                      <tr key={tracker.id} className="border-b border-border/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-[13px] font-semibold">
                              {tracker.firstName[0]}{tracker.lastName[0]}
                            </div>
                            <span className="text-sm font-medium">{tracker.firstName} {tracker.lastName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{tracker.country}</td>
                        <td className="p-4 text-sm">{tracker.targetCountry}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-[60px] h-1.5 bg-border rounded-full">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${tracker.readinessScore}%`,
                                  background: tracker.readinessScore > 50 ? '#10B981' : '#F59E0B'
                                }}
                              />
                            </div>
                            <span className="text-[13px] text-muted-foreground">{tracker.readinessScore}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-[13px] text-muted-foreground/50">{tracker.trackedAt}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="text-muted-foreground border border-border/50">
                            Message
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
