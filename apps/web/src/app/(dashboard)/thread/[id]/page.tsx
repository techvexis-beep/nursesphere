'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUp, Eye, MessageSquare, CheckCheck, User } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
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
  tags: string | null;
  author: { id: string; firstName: string; lastName: string; avatar: string | null };
  community: { id: string; name: string; slug: string };
  createdAt: string;
}

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  upvotesCount: number;
  author: { id: string; firstName: string; lastName: string; avatar: string | null };
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  upvotesCount: number;
  author: { id: string; firstName: string; lastName: string; avatar: string | null };
  replies: Comment[];
  createdAt: string;
}

export default function ThreadPage({ params }: { params: { id: string } }) {
  const { user, token } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchAnswers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${params.id}/answers`);
      if (res.ok) {
        const data = await res.json();
        setAnswers(data);
      }
    } catch (error) {
      console.error('Failed to fetch answers:', error);
    }
  }, [params.id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${params.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, [params.id]);

  useEffect(() => {
    fetchPost();
    fetchAnswers();
    fetchComments();
  }, [fetchPost, fetchAnswers, fetchComments]);

  const handleUpvote = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${params.id}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) fetchPost();
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!token || !answerContent.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/posts/${params.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: answerContent }),
      });
      if (res.ok) {
        setAnswerContent('');
        setShowAnswerForm(false);
        fetchAnswers();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!token || !post) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/community/answers/${answerId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) fetchAnswers();
    } catch (error) {
      console.error('Failed to accept answer:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!token || !commentContent.trim()) return;
    try {
      const res = await fetch(API_BASE_URL + '/api/community/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId: params.id, content: commentContent }),
      });
      if (res.ok) {
        setCommentContent('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  if (loading || !post) {
    return (
      <div className="min-h-screen bg-background p-10">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-[900px] mx-auto">
        <Link href={`/community/${post.community.slug}`} className="text-muted-foreground no-underline text-sm">
          ← Back to {post.community.name}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 bg-card border border-border/50 rounded-[16px] mb-6"
        >
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleUpvote} className="rounded-[10px]">
                <ArrowUp className="h-6 w-6" />
              </Button>
              <span className="text-lg font-bold text-foreground">{post.upvotesCount}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 no-underline">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                    {post.author.firstName[0]}{post.author.lastName[0]}
                  </div>
                  <span className="text-foreground text-sm">{post.author.firstName} {post.author.lastName}</span>
                </Link>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-primary text-sm">{post.type}</span>
              </div>
              <div className="text-[15px] text-muted-foreground/80 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
              <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {post.viewsCount} views</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {post.commentsCount} comments</span>
                <span className="flex items-center gap-1"><CheckCheck className="h-4 w-4" /> {post.answersCount} answers</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {answers.length} Answers
            </h2>
            {user && post.author.id === user.id && (
              <span className="text-xs text-muted-foreground">
                Click ✓ to accept an answer
              </span>
            )}
          </div>

          {answers.map((answer, index) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 rounded-[12px] mb-3"
              style={{
                background: answer.isAccepted ? 'rgba(16,185,129,0.1)' : undefined,
                border: `1px solid ${answer.isAccepted ? '#10B981' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <div className="flex gap-3">
                {answer.isAccepted && <CheckCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-muted-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {answer.content}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">{answer.author.firstName} {answer.author.lastName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground flex items-center gap-1"><ArrowUp className="h-3 w-3" /> {answer.upvotesCount}</span>
                      {user && post.author.id === user.id && !answer.isAccepted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className="text-emerald-500"
                        >
                          <CheckCheck className="h-4 w-4 mr-1" /> Accept
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {user && (
            showAnswerForm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer..."
                  rows={5}
                  className="w-full p-4 bg-muted border border-border rounded-[12px] text-foreground text-sm font-sans mb-3 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowAnswerForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitAnswer} disabled={!answerContent.trim()}>
                    Submit Answer
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button onClick={() => setShowAnswerForm(true)} className="mt-4">
                Add Answer
              </Button>
            )
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">
            {comments.length} Comments
          </h3>

          {user && (
            <div className="mb-5">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full p-3 bg-muted border border-border rounded-[10px] text-foreground text-sm font-sans mb-2 resize-none"
              />
              <Button onClick={handleSubmitComment} disabled={!commentContent.trim()}>
                Comment
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-muted/50 rounded-[8px]">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-foreground font-medium">{comment.author.firstName} {comment.author.lastName}</span>
                  <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground/70 m-0">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
