'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';
import {
  MessageSquare, Wifi, MessageCircle, ArrowLeft, Send,
  MoreVertical, Phone, Search, CheckCheck, Users
} from 'lucide-react';

interface Conversation {
  id: string;
  type: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    otherUser: { id: '2', firstName: 'Sarah', lastName: 'Williams', avatar: null },
    lastMessage: { content: 'Thanks for the study tips!', createdAt: '2024-01-16T10:30:00Z' },
    unreadCount: 2,
  },
  {
    id: '2',
    type: 'group',
    otherUser: { id: '3', firstName: 'UK NMC', lastName: 'Applicants', avatar: null },
    lastMessage: { content: 'Has anyone received their decision letter?', createdAt: '2024-01-16T09:15:00Z' },
    unreadCount: 5,
  },
  {
    id: '3',
    type: 'direct',
    otherUser: { id: '4', firstName: 'Michael', lastName: 'Chen', avatar: null },
    lastMessage: { content: 'The AHPRA process is straightforward once you...', createdAt: '2024-01-15T14:00:00Z' },
    unreadCount: 0,
  },
  {
    id: '4',
    type: 'direct',
    otherUser: { id: '5', firstName: 'Emily', lastName: 'Johnson', avatar: null },
    lastMessage: { content: 'Ready for tomorrow\'s study session?', createdAt: '2024-01-14T18:00:00Z' },
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', content: 'Hi! I saw your post about NCLEX preparation. Could you share some tips?', senderId: '1', createdAt: '2024-01-16T10:00:00Z', sender: { firstName: 'You', lastName: '', avatar: null } },
    { id: '2', content: 'Of course! Focus on the priority questions first. The Saunders book is great!', senderId: '2', createdAt: '2024-01-16T10:15:00Z', sender: { firstName: 'Sarah', lastName: 'Williams', avatar: null } },
    { id: '3', content: 'Thanks! How many questions did you practice daily?', senderId: '1', createdAt: '2024-01-16T10:20:00Z', sender: { firstName: 'You', lastName: '', avatar: null } },
    { id: '4', content: 'I did about 50-75 questions daily in the last month. Quality over quantity!', senderId: '2', createdAt: '2024-01-16T10:25:00Z', sender: { firstName: 'Sarah', lastName: 'Williams', avatar: null } },
    { id: '5', content: 'Thanks for the study tips!', senderId: '1', createdAt: '2024-01-16T10:30:00Z', sender: { firstName: 'You', lastName: '', avatar: null } },
  ],
  '2': [
    { id: '1', content: 'Starting a new thread for UK NMC applicants!', senderId: 'sys', createdAt: '2024-01-10T08:00:00Z', sender: { firstName: 'System', lastName: '', avatar: null } },
    { id: '2', content: 'Has anyone received their decision letter?', senderId: '3', createdAt: '2024-01-16T09:15:00Z', sender: { firstName: 'Michael', lastName: 'Chen', avatar: null } },
  ],
  '3': [
    { id: '1', content: 'Hey! I\'m planning to apply for Australia. Any advice?', senderId: '1', createdAt: '2024-01-15T13:00:00Z', sender: { firstName: 'You', lastName: '', avatar: null } },
    { id: '2', content: 'The AHPRA process is straightforward once you gather all documents. Start with credential verification.', senderId: '4', createdAt: '2024-01-15T14:00:00Z', sender: { firstName: 'Michael', lastName: 'Chen', avatar: null } },
  ],
  '4': [
    { id: '1', content: 'Hey! Are you free for a study session tomorrow?', senderId: '5', createdAt: '2024-01-14T18:00:00Z', sender: { firstName: 'Emily', lastName: 'Johnson', avatar: null } },
  ],
};

const userColors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

function getInitials(firstName: string, lastName: string) {
  return (firstName[0] || '') + (lastName?.[0] || '');
}

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return userColors[Math.abs(hash) % userColors.length];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      if (isMobile) setShowMobileChat(true);
    }
  }, [selectedConversation, isMobile]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_BASE_URL + '/api/messages/conversations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      } else throw new Error('API error');
    } catch {
      setApiError(true);
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/messages/conversations/${conversationId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else throw new Error('API error');
    } catch {
      setMessages(mockMessages[conversationId] || []);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const userId = '1';
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: userId,
      createdAt: new Date().toISOString(),
      sender: { firstName: 'You', lastName: '', avatar: null },
    };
    setMessages(prev => [...prev, newMsg]);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/api/messages/conversations/${selectedConversation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content: newMessage }),
      });
    } catch { /* sent locally */ }
    setNewMessage('');
  };

  const goBack = () => { setShowMobileChat(false); setSelectedConversation(null); };

  const filteredConversations = searchQuery.trim()
    ? conversations.filter(c =>
        `${c.otherUser.firstName} ${c.otherUser.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 flex h-[calc(100dvh-7rem)] md:h-[calc(100dvh-3rem)] bg-background">
      {/* Sidebar */}
      <aside className={cn(
        'w-full md:w-80 lg:w-96 border-r border-border flex flex-col shrink-0 bg-card',
        showMobileChat && isMobile && 'hidden'
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
            </h2>
            {apiError && (
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md text-[11px] font-medium">
                <Wifi className="h-3 w-3" />
                Demo
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-0.5">
              {filteredConversations.map((conv) => {
                const isActive = selectedConversation === conv.id;
                const name = `${conv.otherUser.firstName} ${conv.otherUser.lastName}`;
                const initials = getInitials(conv.otherUser.firstName, conv.otherUser.lastName);
                const color = getColor(name);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                      isActive
                        ? 'bg-primary/10 shadow-sm'
                        : 'hover:bg-muted/60'
                    )}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ background: conv.type === 'group' ? 'linear-gradient(135deg, #10B981, #059669)' : `linear-gradient(135deg, ${color}, ${color}99)` }}
                      >
                        {conv.type === 'group' ? <Users className="h-5 w-5" /> : initials}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center ring-2 ring-card">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn('text-sm truncate', conv.unreadCount > 0 ? 'font-semibold text-foreground' : 'font-medium text-foreground/90')}>
                          {name}
                        </span>
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={cn(
                          'text-xs truncate',
                          conv.unreadCount > 0 ? 'font-medium text-foreground/80' : 'text-muted-foreground'
                        )}>
                          {conv.lastMessage?.content || 'No messages'}
                        </span>
                        {conv.lastMessage?.content && conv.unreadCount === 0 && (
                          <CheckCheck className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6">
              <MessageCircle className="h-10 w-10 mb-3 text-muted-foreground/40" />
              <p className="text-sm font-medium">No conversations</p>
              <p className="text-xs mt-1">Start connecting with nurses!</p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={cn(
        'flex-1 flex flex-col min-w-0',
        !showMobileChat && isMobile && 'hidden'
      )}>
        {selectedConversation && selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0 bg-background/80 backdrop-blur-sm">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={goBack} className="rounded-xl -ml-1">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
                style={{
                  background: selectedConv.type === 'group'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : `linear-gradient(135deg, ${getColor(selectedConv.otherUser.firstName)}, ${getColor(selectedConv.otherUser.firstName)}99)`
                }}
              >
                {selectedConv.type === 'group' ? <Users className="h-4 w-4" /> : getInitials(selectedConv.otherUser.firstName, selectedConv.otherUser.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {selectedConv.otherUser.firstName} {selectedConv.otherUser.lastName}
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium">Online</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Say hello to start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => {
                    const isOwn = msg.senderId === '1';
                    const showAvatar = !isOwn && (idx === 0 || messages[idx - 1]?.senderId !== msg.senderId);
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn('flex gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}
                      >
                        {!isOwn && (
                          <div className={cn('shrink-0', showAvatar ? '' : 'invisible')}>
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                              style={{ background: `linear-gradient(135deg, ${getColor(msg.sender.firstName)}, ${getColor(msg.sender.firstName)}99)` }}
                            >
                              {getInitials(msg.sender.firstName, msg.sender.lastName)}
                            </div>
                          </div>
                        )}
                        <div className={cn('flex flex-col max-w-[75%]', isOwn ? 'items-end' : 'items-start')}>
                          {showAvatar && (
                            <span className="text-[11px] text-muted-foreground mb-1 ml-1">
                              {msg.sender.firstName} {msg.sender.lastName}
                            </span>
                          )}
                          <div className={cn(
                            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-muted text-foreground rounded-bl-md'
                          )}>
                            {msg.content}
                          </div>
                          <div className={cn(
                            'flex items-center gap-1 mt-0.5',
                            isOwn ? 'flex-row-reverse' : 'flex-row'
                          )}>
                            <span className="text-[10px] text-muted-foreground/60">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isOwn && (
                              <CheckCheck className="h-3 w-3 text-muted-foreground/40" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="shrink-0 border-t border-border p-3 md:p-4 bg-background/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Type a message..."
                    className="w-full h-10 pl-4 pr-10 rounded-xl bg-muted border-0 text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="icon"
                  className="h-10 w-10 rounded-xl shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center max-w-xs">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-foreground/80">Select a conversation</p>
              <p className="text-sm mt-1">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
