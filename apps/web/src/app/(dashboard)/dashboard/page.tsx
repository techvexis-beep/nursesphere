'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bell,
  Sparkles,
  Flame,
  Award,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Globe,
  ArrowRight,
  Activity,
  Clock,
  Target,
  CheckCircle,
  Users,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';

const quickActions = [
  { href: '/study-tutor', label: 'AI Study Tutor', icon: Sparkles, color: 'bg-violet-500' },
  { href: '/exams', label: 'NCLEX Prep', icon: GraduationCap, color: 'bg-emerald-500' },
  { href: '/jobs', label: 'Find Jobs', icon: Briefcase, color: 'bg-blue-500' },
  { href: '/migration', label: 'Migration', icon: Globe, color: 'bg-cyan-500' },
  { href: '/community', label: 'Community', icon: Users, color: 'bg-purple-500' },
  { href: '/mental-health', label: 'Wellness', icon: Activity, color: 'bg-pink-500' },
];

const recentActivity = [
  { type: 'exam', title: 'Completed NCLEX Practice Test', score: '85%', time: '2 hours ago' },
  { type: 'log', title: 'Logged 8 clinical hours', score: null, time: '5 hours ago' },
  { type: 'job', title: 'Applied to St. Mary\'s Hospital', score: null, time: 'Yesterday' },
  { type: 'exam', title: 'Cardiac medications quiz', score: '92%', time: '2 days ago' },
];

const upcomingTasks = [
  { id: 1, title: 'Complete 20 NCLEX practice questions', priority: 'high', due: 'Today' },
  { id: 2, title: 'Review cardiac medications', priority: 'medium', due: 'Tomorrow' },
  { id: 3, title: 'Log clinical hours', priority: 'low', due: 'This week' },
];

export default function Dashboard() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {greeting}, {user?.name?.split(' ')[0] || 'Nurse'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your nursing journey
          </p>
        </div>
        <Link href="/study-tutor">
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Start AI Chat
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Migration Score</span>
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">62%</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span>+5% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Exam Readiness</span>
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">78%</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
              <TrendingUp className="w-3 h-3" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Clinical Hours</span>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">45</div>
            <div className="text-sm text-muted-foreground mt-2">of 100 required</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Streak</span>
              <Flame className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">12 days</div>
            <div className="flex items-center gap-1 mt-2 text-sm text-orange-500">
              <Award className="w-3 h-3" />
              <span>Keep it up!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions - Full width on mobile, left on desktop */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">
                      {action.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Tasks</span>
              <Badge variant="secondary">{upcomingTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`mt-0.5 p-1 rounded border ${getPriorityColor(task.priority)}`}>
                  <CheckCircle className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {task.due}
                  </p>
                </div>
              </div>
            ))}
            <Link href="/dashboard" className="block mt-4">
              <Button variant="ghost" className="w-full">
                View all tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {activity.type === 'exam' && <GraduationCap className="w-5 h-5 text-primary" />}
                  {activity.type === 'log' && <Clock className="w-5 h-5 text-primary" />}
                  {activity.type === 'job' && <Briefcase className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                {activity.score && (
                  <Badge variant="success">{activity.score}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Discussion</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Join conversations with nurses from around the world
              </p>
              <Link href="/community">
                <Button variant="outline" size="sm">
                  Browse Discussions
                </Button>
              </Link>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-muted">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Live Events</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Attend live AMAs with nursing experts
              </p>
              <Link href="/ama">
                <Button variant="outline" size="sm">
                  View Schedule
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
