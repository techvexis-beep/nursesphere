'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Users, FileText, MessageSquare, CheckCheck, Eye, User } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  upvotesCount: number;
  commentsCount: number;
  answersCount: number;
  viewsCount: number;
  author: { id: string; firstName: string; lastName: string; avatar: string | null };
  createdAt: string;
}

interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  membersCount: number;
  postsCount: number;
}

export default function CommunityDetailPage({ params }: { params: { slug: string } }) {
  const { user, token } = useUser();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'DISCUSSION' });

  const fetchCommunity = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/communities/${params.slug}`);
      if (res.ok) {
        const data = await res.json();
        setCommunity(data);
      }
    } catch (error) {
      console.error('Failed to fetch community:', error);
    }
  }, [params.slug]);

  const fetchPosts = useCallback(async () => {
    if (!community) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/communities/${community.id}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }, [community]);

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
  }, [fetchCommunity, fetchPosts]);

  const handleJoin = async () => {
    if (!token || !community) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/communities/${community.id}/join`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setJoined(true);
      }
    } catch (error) {
      console.error('Failed to join:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!token || !community || !newPost.title.trim()) return;
    try {
      const res = await fetch(API_BASE_URL + '/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          communityId: community.id,
          title: newPost.title,
          content: newPost.content,
          type: newPost.type,
        }),
      });
      if (res.ok) {
        setShowCreatePost(false);
        setNewPost({ title: '', content: '', type: 'DISCUSSION' });
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleUpvote = async (postId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${postId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  if (!community) {
    return (
      <div className="min-h-screen bg-background p-10 flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-[900px] mx-auto">
        <Link href="/community" className="text-muted-foreground no-underline text-sm">
          ← Back to Communities
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 md:p-8 rounded-[20px] mb-6"
          style={{
            background: community.color + '20',
            border: `1px solid ${community.color}40`,
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-5xl">{community.icon}</div>
                <div>
                  <h1 className="text-2xl md:text-[28px] font-bold text-foreground m-0">
                    {community.name}
                  </h1>
                  <span className="text-sm" style={{ color: community.color }}>{community.type}</span>
                </div>
              </div>
              <p className="text-[15px] text-muted-foreground/70 max-w-[500px]">
                {community.description}
              </p>
              <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {community.membersCount.toLocaleString()} members</span>
                <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {community.postsCount.toLocaleString()} posts</span>
              </div>
            </div>
            {user && (
              joined ? (
                <Button
                  variant="secondary"
                  className="rounded-[10px] shrink-0"
                  style={{
                    background: community.color + '30',
                    border: `1px solid ${community.color}`,
                  }}
                >
                  ✓ Joined
                </Button>
              ) : (
                <Button
                  onClick={handleJoin}
                  className="rounded-[10px] shrink-0"
                  style={{ background: community.color }}
                >
                  Join Community
                </Button>
              )
            )}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <h2 className="text-lg font-semibold text-foreground">Discussions</h2>
          {user && (
            <Button onClick={() => setShowCreatePost(true)}>
              + New Post
            </Button>
          )}
        </div>

        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-card border border-border rounded-[16px] mb-5"
          >
            <Input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="mb-3"
            />
            <textarea
              placeholder="Write your post..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
              className="w-full p-3 bg-muted border border-border rounded-[10px] text-foreground text-sm mb-3 font-sans resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Post
              </Button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[120px] bg-muted rounded-[12px]" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/thread/${post.id}`} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-card border border-border/50 rounded-[12px] cursor-pointer hover:border-border"
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.preventDefault(); handleUpvote(post.id); }}
                      >
                        <ArrowUp className="h-5 w-5" />
                      </Button>
                      <span className="text-sm font-semibold text-foreground">{post.upvotesCount}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-2 truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground/50 mb-2 leading-relaxed line-clamp-2">
                        {post.content.slice(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author.firstName} {post.author.lastName}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.commentsCount} comments</span>
                        <span className="flex items-center gap-1"><CheckCheck className="h-3 w-3" /> {post.answersCount} answers</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.viewsCount} views</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3" />
            <p>No posts yet. Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}
