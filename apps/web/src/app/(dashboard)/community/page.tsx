'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Globe, Flame, Users, FileText, MessageCircle,
  ArrowUp, Plus, Mic, Trophy, Pin, Share2, Send,
  Hash, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  icon: string | null;
  color: string;
  membersCount: number;
  postsCount: number;
}

interface TrendingPost {
  id: string;
  title: string;
  type: string;
  author: { firstName: string; lastName: string; avatar: string | null };
  community: { name: string; slug: string };
  upvotesCount: number;
  commentsCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  upvotesCount: number;
  commentsCount: number;
  author: { id: string; firstName: string; lastName: string; avatar: string | null };
  community: { id: string; name: string; slug: string };
  createdAt: string;
}

interface OnlineUser {
  id: string;
  name: string;
  role: string;
}

const communityTypes = [
  { value: '', label: 'All Communities', color: '#6366F1' },
  { value: 'EXAM', label: 'Exam Prep', color: '#EC4899' },
  { value: 'MIGRATION', label: 'Migration', color: '#3B82F6' },
  { value: 'SPECIALTY', label: 'Specialties', color: '#10B981' },
  { value: 'RECRUITER', label: 'Recruiters', color: '#F59E0B' },
  { value: 'GENERAL', label: 'General', color: '#8B5CF6' },
];

const mockPosts: Post[] = [
  { id: '1', title: 'Tips for passing NCLEX on first attempt', content: 'After months of preparation, I finally passed my NCLEX! Here are the resources that helped me the most...', type: 'DISCUSSION', upvotesCount: 24, commentsCount: 12, author: { id: '2', firstName: 'Sarah', lastName: 'Williams', avatar: null }, community: { id: '1', name: 'NCLEX Champions', slug: 'nclex-champions' }, createdAt: '2024-01-16T10:30:00Z' },
  { id: '2', title: 'UK NMC Application Process Update', content: 'Just received my decision letter from NMC. The whole process took about 6 months from start to finish...', type: 'EXPERIENCE', upvotesCount: 18, commentsCount: 7, author: { id: '3', firstName: 'Michael', lastName: 'Chen', avatar: null }, community: { id: '2', name: 'UK NMC Applicants', slug: 'uk-nmc-applicants' }, createdAt: '2024-01-15T14:00:00Z' },
  { id: '3', title: 'Best stethoscope for ICU nurses?', content: 'Looking for recommendations on a good stethoscope for ICU work. Currently considering Littmann vs MDF...', type: 'QUESTION', upvotesCount: 15, commentsCount: 23, author: { id: '4', firstName: 'Emily', lastName: 'Johnson', avatar: null }, community: { id: '3', name: 'Critical Care', slug: 'critical-care' }, createdAt: '2024-01-14T09:00:00Z' },
  { id: '4', title: 'Travel nursing in Australia - AHPRA guide', content: 'I recently completed the AHPRA registration process for international nurses. Here is a step-by-step guide...', type: 'GUIDE', upvotesCount: 32, commentsCount: 9, author: { id: '5', firstName: 'James', lastName: 'Wilson', avatar: null }, community: { id: '4', name: 'Migration Hub', slug: 'migration-hub' }, createdAt: '2024-01-13T16:45:00Z' },
  { id: '5', title: 'Dealing with burnout - self care strategies', content: 'After 10 years in nursing, I have learned a few things about preventing burnout. Here is what works for me...', type: 'DISCUSSION', upvotesCount: 45, commentsCount: 31, author: { id: '6', firstName: 'Anna', lastName: 'Martinez', avatar: null }, community: { id: '5', name: 'Nurse Wellness', slug: 'nurse-wellness' }, createdAt: '2024-01-12T11:20:00Z' },
];

const onlineUsers: OnlineUser[] = [
  { id: '1', name: 'Sarah Williams', role: 'RN' },
  { id: '2', name: 'Michael Chen', role: 'Nursing Student' },
  { id: '3', name: 'Emily Johnson', role: 'ICU Nurse' },
  { id: '4', name: 'James Wilson', role: 'Travel RN' },
  { id: '5', name: 'Anna Martinez', role: 'Nurse Educator' },
  { id: '6', name: 'David Kim', role: 'NP Candidate' },
];

const userColors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

function getInitials(first: string, last: string) {
  return (first[0] || '') + (last?.[0] || '');
}

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return userColors[Math.abs(hash) % userColors.length];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

export default function CommunityPage() {
  const { user } = useUser();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [upvotedPosts, setUpvotedPosts] = useState<Set<string>>(new Set());
  const [sharedPostId, setSharedPostId] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedType
        ? `${API_BASE_URL}/api/community/communities?type=${selectedType}`
        : API_BASE_URL + '/api/community/communities';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCommunities(data);
      }
    } catch {
      console.error('Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  const fetchTrending = useCallback(async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/community/trending');
      if (res.ok) {
        const data = await res.json();
        setTrendingPosts(data);
      }
    } catch {
      console.error('Failed to fetch trending');
    }
  }, []);

  useEffect(() => { fetchCommunities(); fetchTrending(); }, [selectedType, fetchCommunities, fetchTrending]);

  const handleUpvote = (postId: string) => {
    setUpvotedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, upvotesCount: p.upvotesCount + (upvotedPosts.has(postId) ? -1 : 1) }
        : p
    ));
  };

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}/thread/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setSharedPostId(post.id);
      setTimeout(() => setSharedPostId(null), 2000);
    } catch {
      const shareData = { title: post.title, text: post.content.slice(0, 100), url };
      if (navigator.share) {
        await navigator.share(shareData);
      }
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !user) return;
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      type: 'DISCUSSION',
      upvotesCount: 0,
      commentsCount: 0,
      author: { id: user.id, firstName: user.name?.split(' ')[0] || 'You', lastName: user.name?.split(' ').slice(1).join(' ') || '', avatar: null },
      community: { id: '', name: 'Community Feed', slug: '' },
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '' });
    setShowComposer(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-2xl p-6 md:p-8"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
          }}
        >
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                Community Network
                <Globe className="h-6 w-6" />
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-lg mt-1">
                Connect with nurses worldwide, share knowledge, and grow together
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {onlineUsers.length} online
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Feed */}
          <div className="space-y-4">
            {/* Channel Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-bold text-foreground">
                  {selectedType
                    ? communityTypes.find(t => t.value === selectedType)?.label || 'Community'
                    : 'All Posts'}
                </h2>
              </div>
              {user && (
                <Button onClick={() => setShowComposer(!showComposer)} size="sm" className="rounded-lg gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Post</span>
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {communityTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                    selectedType === type.value
                      ? 'text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                  style={{
                    background: selectedType === type.value ? type.color : undefined,
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Create Post Composer */}
            {showComposer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-card border border-border rounded-xl space-y-3"
              >
                <Input
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="rounded-lg"
                />
                <textarea
                  placeholder="What's on your mind? Share your nursing experience, tips, or questions..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={3}
                  className="w-full p-3 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setShowComposer(false); setNewPost({ title: '', content: '' }); }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreatePost} disabled={!newPost.title.trim()} className="gap-1.5">
                    <Send className="h-4 w-4" />
                    Post
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Posts Feed */}
            {posts.map((post, index) => {
              const isUpvoted = upvotedPosts.has(post.id);
              const color = getColor(post.author.firstName);
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl hover:border-border/80 transition-all"
                >
                  {/* Post Header */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                      >
                        {getInitials(post.author.firstName, post.author.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {post.author.firstName} {post.author.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground/50">·</span>
                          <span className="text-xs text-muted-foreground/60">{timeAgo(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground/50">in</span>
                          <Link href={`/community/${post.community.slug}`} className="text-xs font-medium text-primary hover:underline">
                            {post.community.name}
                          </Link>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    <Link href={`/thread/${post.id}`} className="no-underline">
                      <h3 className="text-base font-bold text-foreground mb-1.5 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed line-clamp-2">
                        {post.content}
                      </p>
                    </Link>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-1 px-2 py-2 mt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpvote(post.id)}
                      className={cn(
                        'rounded-lg gap-1.5 h-8 text-xs font-medium',
                        isUpvoted ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ArrowUp className={cn('h-4 w-4', isUpvoted && 'fill-primary')} />
                      {post.upvotesCount}
                    </Button>
                    <Link href={`/thread/${post.id}`} className="no-underline">
                      <Button variant="ghost" size="sm" className="rounded-lg gap-1.5 h-8 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <MessageCircle className="h-4 w-4" />
                        {post.commentsCount}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post)}
                      className={cn(
                        'rounded-lg gap-1.5 h-8 text-xs font-medium',
                        sharedPostId === post.id ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Share2 className="h-4 w-4" />
                      {sharedPostId === post.id ? 'Copied!' : 'Share'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Trending */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Trending Now
              </h3>
              {trendingPosts.length > 0 ? (
                <div className="space-y-2">
                  {trendingPosts.slice(0, 5).map((post, i) => (
                    <Link key={post.id} href={`/thread/${post.id}`} className="no-underline group">
                      <div className="flex items-start gap-2 py-1.5">
                        <span className="text-xs font-bold text-muted-foreground/40 w-4 shrink-0">#{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-xs text-foreground/80 group-hover:text-primary transition-colors line-clamp-1">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 mt-0.5">
                            <span className="flex items-center gap-0.5"><ArrowUp className="h-2.5 w-2.5" /> {post.upvotesCount}</span>
                            <span className="flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> {post.commentsCount}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/60">No trending posts yet</p>
              )}
            </div>

            {/* Online Users */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Online — {onlineUsers.length}
              </h3>
              <div className="space-y-2">
                {onlineUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-semibold"
                        style={{ background: `linear-gradient(135deg, ${getColor(u.name)}, ${getColor(u.name)}99)` }}
                      >
                        {getInitials(u.name.split(' ')[0], u.name.split(' ')[1] || '')}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground/60">{u.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Communities */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Communities</h3>
              <div className="space-y-1">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-8 bg-muted rounded-lg animate-pulse" />)}
                  </div>
                ) : communities.length > 0 ? (
                  communities.slice(0, 6).map((c) => (
                    <Link key={c.id} href={`/community/${c.slug}`} className="no-underline group">
                      <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/60 transition-colors">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: c.color }}>
                          {c.icon || <Hash className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground/80 group-hover:text-foreground truncate">{c.name}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/50">{c.membersCount}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground/60">No communities found</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-1.5">
                <Link href="/community/create" className={buttonVariants({ variant: 'outline', className: 'w-full justify-start gap-2 h-9 text-xs rounded-lg' })}>
                  <Plus className="h-3.5 w-3.5" /> Create Community
                </Link>
                <Link href="/ama" className={buttonVariants({ variant: 'outline', className: 'w-full justify-start gap-2 h-9 text-xs rounded-lg' })}>
                  <Mic className="h-3.5 w-3.5" /> Upcoming AMAs
                </Link>
                <Link href="/reputation" className={buttonVariants({ variant: 'outline', className: 'w-full justify-start gap-2 h-9 text-xs rounded-lg' })}>
                  <Trophy className="h-3.5 w-3.5" /> Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
