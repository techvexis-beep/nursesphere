'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, User, Bot, X, Zap, Crown, CreditCard,
  Building, Shield, CheckCircle2, ArrowRight, MessageSquare,
  Lightbulb, TrendingUp, Users, DollarSign, BarChart3,
  RefreshCw, Copy, ThumbsUp, ThumbsDown, ChevronDown
} from 'lucide-react';
import { useUser, SUBSCRIPTION_TIERS, SubscriptionTier } from '@/context/UserContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  action?: {
    label: string;
    type: 'upgrade' | 'link' | 'copy';
    value?: string;
  };
}

interface SalesContext {
  userPlan: SubscriptionTier;
  featureInterest?: string;
  lastInteraction?: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your AI Sales Assistant. I can help you with:\n\n• Upgrading your subscription plan\n• Understanding feature benefits\n• Hospital licensing options\n• Pricing questions\n\nWhat can I help you with today?",
    timestamp: new Date(),
    suggestions: [
      'Upgrade my plan',
      'Compare pricing',
      'Hospital licensing',
      'Feature benefits'
    ]
  }
];

const SALES_RESPONSES: Record<string, { 
  response: string; 
  suggestions?: string[];
  action?: Message['action'];
}> = {
  upgrade: {
    response: "I'd love to help you upgrade! Here's what you get with our higher tiers:\n\n**Pro ($19/mo)**\n• Unlimited exam questions\n• AI Study Tutor\n• Blockchain credentials\n• Priority support\n\n**Enterprise ($99/mo)**\n• Everything in Pro\n• Hospital recruitment tools\n• API access\n• Custom branding\n\nWhich tier interests you?",
    suggestions: ['See Pro features', 'See Enterprise features', 'Talk to sales']
  },
  pricing: {
    response: "Here's our pricing breakdown:\n\n**Free** - $0/mo\n• 50 exam questions/month\n• Basic profile\n\n**Pro** - $19/mo\n• Everything in Free\n• Unlimited questions\n• AI Tutor\n• Career coaching\n\n**Enterprise** - $99/mo\n• Everything in Pro\n• Hospital tools\n• API access\n\nWould you like to start a free trial?",
    suggestions: ['Start Pro trial', 'Contact sales', 'Compare plans'],
    action: { label: 'View pricing page', type: 'link', value: '/pricing' }
  },
  hospital: {
    response: "Our Hospital Licensing program is perfect for healthcare organizations:\n\n**Basic ($299/mo)**\n• 5 job postings\n• 50 nurse profiles\n\n**Professional ($599/mo)**\n• 20 job postings\n• 200 nurse profiles\n• Analytics\n\n**Enterprise ($1,499/mo)**\n• Unlimited everything\n• API access\n• Custom branding\n\nWould you like a demo of our hospital portal?",
    suggestions: ['Request demo', 'See hospital features', 'Talk to sales']
  },
  features: {
    response: "Let me highlight our most popular features:\n\n**AI Study Tutor** - Personalized learning with 50,000+ questions\n\n**Blockchain Credentials** - Tamper-proof, globally verified credentials\n\n**Hospital Recruitment** - Direct access to verified nurses worldwide\n\n**Migration Tracker** - AI-powered pathway from your country to your dream destination\n\nWhat feature interests you most?",
    suggestions: ['AI Tutor demo', 'Blockchain credentials', 'Hospital tools']
  },
  trial: {
    response: "Great choice! You can start a 7-day free trial of Pro with no credit card required.\n\nDuring your trial you'll get:\n• Full Pro access\n• AI Study Tutor\n• Unlimited exams\n• Priority support\n\nShall I set that up for you now?",
    action: { label: 'Start free trial', type: 'upgrade' }
  }
};

export default function AISalesAssistant() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<SalesContext>({
    userPlan: user?.subscription?.tier || 'free'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<Message> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    let responseKey = 'features';
    if (lowerMessage.includes('upgrade') || lowerMessage.includes('upgrade') || lowerMessage.includes('better plan')) {
      responseKey = 'upgrade';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing') || lowerMessage.includes('cheap')) {
      responseKey = 'pricing';
    } else if (lowerMessage.includes('hospital') || lowerMessage.includes('recruit') || lowerMessage.includes('hiring') || lowerMessage.includes('license')) {
      responseKey = 'hospital';
    } else if (lowerMessage.includes('trial') || lowerMessage.includes('free') || lowerMessage.includes('start')) {
      responseKey = 'trial';
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('do')) {
      responseKey = 'features';
    }

    const responseData = SALES_RESPONSES[responseKey];
    
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseData.response,
      timestamp: new Date(),
      suggestions: responseData.suggestions,
      action: responseData.action
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateResponse(input);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await generateResponse(suggestion);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAction = (action: Message['action']) => {
    if (action?.type === 'upgrade') {
      window.location.href = '/pricing';
    } else if (action?.type === 'link' && action.value) {
      window.location.href = action.value;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Sales Assistant</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-indigo-500' 
                        : 'bg-gradient-to-br from-violet-500 to-purple-500'
                    }`}>
                      {message.role === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-indigo-500 text-white rounded-tr-sm'
                          : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                      }`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>

                      {message.action && (
                        <button
                          onClick={() => handleAction(message.action!)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            message.role === 'user' 
                              ? 'bg-indigo-400 hover:bg-indigo-300 text-white'
                              : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:shadow-lg hover:shadow-violet-500/30 text-white'
                          }`}
                        >
                          {message.action.type === 'upgrade' && <Zap size={14} />}
                          {message.action.type === 'link' && <ArrowRight size={14} />}
                          {message.action.label}
                        </button>
                      )}

                      {message.suggestions && message.role === 'assistant' && (
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-600/50"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-[10px] text-slate-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-800">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about pricing, features, or upgrades..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700/50 text-white placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 text-center">
                AI responses are for informational purposes. Contact support for account-specific help.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all ${
          isOpen 
            ? 'bg-slate-700 hover:bg-slate-600' 
            : 'bg-gradient-to-br from-violet-500 to-purple-500 hover:shadow-xl hover:shadow-violet-500/30'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Sparkles size={24} className="text-white" />
        )}
      </motion.button>
    </>
  );
}
