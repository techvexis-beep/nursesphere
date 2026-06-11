'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StudyTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const studyTopics: StudyTopic[] = [
  { id: 'nclex', title: 'NCLEX-RN Prep', icon: '📝', description: 'Practice questions and concepts' },
  { id: 'anatomy', title: 'Anatomy & Physiology', icon: '🫀', description: 'Body systems and structures' },
  { id: 'pharmacology', title: 'Pharmacology', icon: '💊', description: 'Drug classifications and dosages' },
  { id: 'pathophysiology', title: 'Pathophysiology', icon: '🦠', description: 'Disease processes' },
  { id: 'care-plans', title: 'Nursing Care Plans', icon: '📋', description: 'Create effective care plans' },
  { id: 'skills', title: 'Clinical Skills', icon: '🩺', description: 'Procedures and techniques' },
  { id: 'exams', title: 'Other Exams', icon: '📚', description: 'TEAS, HESI, and more' },
];

const quickPrompts = [
  'Explain the nursing process',
  'What are the priority interventions for a patient with chest pain?',
  'Calculate the IV drip rate for 1000ml over 8 hours',
  'Describe the signs of sepsis',
  'What are the differences between Type 1 and Type 2 Diabetes?',
];

const mockAIResponses: Record<string, string> = {
  'nursing process': `The **Nursing Process** is a systematic, patient-centered approach to care that consists of five steps:

1. **Assessment** - Collecting comprehensive data about the patient's health status
2. **Diagnosis** - Analyzing the data to identify health problems
3. **Planning** - Setting goals and outcomes to address the identified problems
4. **Implementation** - Executing the planned interventions
5. **Evaluation** - Assessing the effectiveness of interventions and modifying as needed

This process is cyclical and allows for continuous improvement in patient care.`,
  'chest pain': `**Priority Interventions for Chest Pain:**

🚨 **First, call for help and get the rapid response team!**

1. **Assess** - Quick ABCs, obtain 12-lead ECG within 10 minutes
2. **Oxygen** - Administer O2 if SpO2 <94%
3. **Nitrates** - Nitroglycerin (if BP >90 systolic)
4. **Aspirin** - 162-325mg chewable aspirin (unless allergic)
5. **IV Access** - Establish IV access immediately
6. **Monitor** - Continuous cardiac monitoring
7. **Labs** - Cardiac enzymes, troponin

**Remember:** Time is muscle! Every minute counts in STEMI.`,
  'iv drip rate': `**IV Drip Rate Calculation:**

**Given:** 1000mL over 8 hours

**Step 1:** Convert hours to minutes
- 8 hours × 60 = 480 minutes

**Step 2:** Calculate mL/minute
- 1000mL ÷ 480 min = 2.08 mL/min

**Step 3:** If using a standard tubing (10 gtt/mL):
- Rate = 2.08 × 10 = **20.8 ≈ 21 gtt/min**

**Formula:**
Drip Rate (gtt/min) = (Volume × Drop Factor) / Time

Always double-check calculations! 📊`,
  'sepsis': `**Signs of Sepsis (SIRS Criteria):**

⚠️ **Two or more of these indicate sepsis:**

- **Temperature** >38°C or <36°C
- **Heart Rate** >90 bpm
- **Respiratory Rate** >20/min
- **WBC** >12,000 or <4,000

**Septic Shock:** Sepsis + hypotension despite fluids + lactate >2

**Early Signs to Watch:**
- Confusion/altered mental status
- Decreased urine output
- Mottled skin
- High lactate levels

**Remember:** TIME = ORGANS! Early recognition saves lives.`,
  'diabetes': `**Type 1 vs Type 2 Diabetes:**

| Feature | Type 1 | Type 2 |
|---------|--------|--------|
| **Age** | Usually <30 | Usually >40 |
| **Cause** | Autoimmune | Insulin resistance |
| **Insulin** | Always required | May not be needed |
| **Body Type** | Usually thin | Usually overweight |
| **Onset** | Sudden | Gradual |

**Type 1:** Pancreas doesn't produce insulin - immune system attacks beta cells

**Type 2:** Body becomes resistant to insulin - related to lifestyle factors

Both require careful blood glucose monitoring! 🍎`,
};

const getMockResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();

  for (const [key, response] of Object.entries(mockAIResponses)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }

  return `Thank you for your question about "${input}"!

As your AI study tutor, I can help you understand:

📚 **Nursing Concepts** - From anatomy to pathophysiology

💊 **Pharmacology** - Drug classifications, mechanisms, side effects

📝 **NCLEX Prep** - Practice questions and test strategies

🩺 **Clinical Skills** - Procedures and best practices

💉 **Care Plans** - How to create effective nursing care plans

Feel free to ask more specific questions or select a study topic from the sidebar!`;
};

export default function AIStudyTutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          context: selectedTopic ? `Study topic: ${studyTopics.find(t => t.id === selectedTopic)?.title || selectedTopic}` : 'General nursing study',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.response,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error('No response content');
        }
      } else {
        setUseMock(true);
        const mockResponse = getMockResponse(currentInput);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: mockResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.log('Using mock response due to error');
      setUseMock(true);
      const mockResponse = getMockResponse(currentInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleTopicSelect = (topic: StudyTopic) => {
    setSelectedTopic(topic.id);
    setInput(`I'm studying ${topic.title}. ${topic.description}. Can you help me understand the key concepts?`);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100vh-13rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)]">
      {/* Sidebar - desktop only */}
      <div className="hidden md:flex w-64 shrink-0 flex-col gap-4 overflow-y-auto">
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Study Topics</CardTitle>
              {!useMock && (
                <Badge variant="success" className="text-[10px] px-2 py-0 h-5">AI Active</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-1">
            {studyTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                  selectedTopic === topic.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent'
                }`}
              >
                <span className="text-lg shrink-0">{topic.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{topic.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{topic.description}</div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Quick Questions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-1">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt)}
                className="w-full text-left text-xs text-muted-foreground p-2 rounded-md border border-border hover:bg-accent hover:text-foreground transition-colors"
              >
                {prompt.length > 35 ? prompt.slice(0, 35) + '...' : prompt}
              </button>
            ))}
          </CardContent>
        </Card>

        {useMock && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Using offline responses - AI unavailable
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topic pills */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
          {studyTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedTopic === topic.id
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-card text-muted-foreground border-border hover:bg-accent'
              }`}
            >
              {topic.icon} {topic.title}
            </button>
          ))}
        </div>

        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              AI Study Tutor
            </h1>
            <p className="text-sm text-muted-foreground">
              Powered by <span className="text-primary font-medium">Google Gemini AI</span>
            </p>
          </div>
          {selectedTopic && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTopic(null)}
              className="gap-1.5 shrink-0"
            >
              <X className="w-3 h-3" />
              {studyTopics.find(t => t.id === selectedTopic)?.title}
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to AI Study Tutor!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Powered by <span className="text-primary font-medium">Google Gemini AI</span>. Ask me anything about nursing!
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-primary shrink-0 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-card-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                    <p
                      className={`text-[10px] mt-2 ${
                        message.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-success shrink-0 flex items-center justify-center text-xs font-bold text-success-foreground">
                      U
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="pt-4 border-t border-border shrink-0">
          <div className="flex gap-3 p-3 rounded-xl bg-card border border-border">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask anything about nursing..."
              disabled={loading}
              className="flex-1 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[24px]"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              size="sm"
              className="shrink-0 gap-1.5"
            >
              {loading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
