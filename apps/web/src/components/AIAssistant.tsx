'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'diagnosis' | 'calculator' | 'general';
  data?: any;
}

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  prompt: string;
}

const quickActions: QuickAction[] = [
  { id: 'diagnosis', icon: '🩺', label: 'Clinical Diagnosis', prompt: 'Help me with a clinical diagnosis using NANDA-I' },
  { id: 'dosage', icon: '💊', label: 'Dosage Calc', prompt: 'Calculate medication dosage for' },
  { id: 'explain', icon: '📚', label: 'Explain Concept', prompt: 'Explain' },
  { id: 'exam', icon: '📝', label: 'Exam Prep', prompt: 'Help me prepare for NCLEX' },
  { id: 'migration', icon: '✈️', label: 'Migration Help', prompt: 'Guide me through migration process' },
  { id: 'drugs', icon: '💉', label: 'Drug Info', prompt: 'Information about medication' },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m NurseAI, your AI nursing assistant. I can help you with:\n\n🩺 Clinical diagnosis using NANDA-I\n💊 Medication dosages & calculations\n📚 Nursing concepts & explanations\n📝 NCLEX exam preparation\n🌍 Migration guidance\n\nHow can I help you today?',
      timestamp: new Date(),
      type: 'general',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();
    
    // NANDA-I Diagnosis detection
    if (lowerInput.includes('diagnos') || lowerInput.includes('nanda') || lowerInput.includes('patient') || lowerInput.includes('assessment')) {
      return getNANDAResponse(userInput);
    }
    
    // Dosage calculation
    if (lowerInput.includes('dose') || lowerInput.includes('calculate') || lowerInput.includes('mg') || lowerInput.includes('ml')) {
      return getDosageResponse(userInput);
    }
    
    // NCLEX/Exam prep
    if (lowerInput.includes('nclex') || lowerInput.includes('exam') || lowerInput.includes('question') || lowerInput.includes('practice')) {
      return getExamResponse(userInput);
    }
    
    // Migration
    if (lowerInput.includes('migration') || lowerInput.includes('visa') || lowerInput.includes('nclex') || lowerInput.includes('ielts') || lowerInput.includes('abroad')) {
      return getMigrationResponse(userInput);
    }
    
    // Drug information
    if (lowerInput.includes('drug') || lowerInput.includes('medication') || lowerInput.includes('medicine') || lowerInput.includes('pill')) {
      return getDrugResponse(userInput);
    }
    
    // General nursing help
    return getGeneralResponse(userInput);
  };

  const getNANDAResponse = (input: string): string => {
    const diagnoses = [
      { code: '00132', name: 'Acute Pain', related: 'Disease process, invasive procedures', defining: 'Verbal report, guarding behavior, changes in appetite', interventions: 'Pain management, medication administration, comfort measures' },
      { code: '00078', name: 'Ineffective Airway Clearance', related: 'Obstructed airway, secretions, trauma', defining: 'Abnormal breath sounds, cyanosis, ineffective coughing', interventions: 'Positioning, suctioning, breathing exercises, humidification' },
      { code: '00126', name: 'Deficient Knowledge', related: 'Lack of exposure, unfamiliarity with information', defining: 'Verbalization of problem, incorrect procedures', interventions: 'Teaching, written materials, demonstration, teach-back' },
      { code: '00179', name: 'Risk for Unstable Blood Glucose', related: 'Inadequate glucose monitoring, lack of adherence to treatment', interventions: 'Blood glucose monitoring, diet management, medication compliance' },
      { code: '00069', name: 'Ineffective Coping', related: 'Situational crises, inadequate support system', defining: 'Verbalization of inability to cope, destructive behavior', interventions: 'Crisis intervention, support systems, problem-solving skills' },
      { code: '00198', name: 'Disturbed Sleep Pattern', related: 'Environmental changes, illness, psychological stress', defining: 'Difficulty falling asleep, waking frequently', interventions: 'Sleep hygiene, relaxation techniques, medication' },
      { code: '00133', name: 'Chronic Pain', related: 'Chronic physical/psychological disability', defining: 'Verbal report, guarding, changes in appetite/sleep', interventions: 'Pain management, alternative therapies, support groups' },
      { code: '00051', name: 'Impaired Verbal Communication', related: 'Physical barriers, cultural differences, stress', defining: 'Difficulty speaking, unable to form words', interventions: 'Alternative communication, interpreter, speech therapy' },
      { code: '00085', name: 'Impaired Physical Mobility', related: 'Musculoskeletal impairment, pain, restrictions', defining: 'Inability to move, limited range of motion', interventions: 'Range of motion, assistive devices, safety measures' },
      { code: '00102', name: 'Constipation', related: 'Inadequate fiber/fluid, lack of activity', defining: 'Decreased bowel sounds, hard stools, distention', interventions: 'Fiber/fluid intake, activity, stool softeners' },
      { code: '00004', name: 'Risk for Infection', related: 'Invasive procedures, compromised immunity', interventions: 'Hand hygiene, aseptic technique, monitoring' },
      { code: '00039', name: 'Risk for Aspiration', related: 'Reduced consciousness, enteral feeding', interventions: 'Head elevation, suctioning, swallowing assessment' },
      { code: '00124', name: 'Risk for Falls', related: 'Age, medications, environmental hazards', interventions: 'Fall precautions, bed alarms, non-slip footwear' },
      { code: '00043', name: 'Ineffective Protection', related: 'Altered immune system, blood disorders', interventions: 'Infection prevention, safety monitoring' },
      { code: '00155', name: 'Risk for Falls', related: 'History of falls, impaired mobility', interventions: 'Environmental modification, assist devices' },
    ];
    
    const selected = diagnoses.slice(0, 5);
    
    return `🩺 **NANDA-I Nursing Diagnoses**\n\nBased on your query, here are relevant nursing diagnoses:\n\n${selected.map((d, i) => `${i + 1}. **${d.code} - ${d.name}**\n   📌 Related Factors: ${d.related}\n   📌 Defining Characteristics: ${d.defining}\n   📌 Interventions: ${d.interventions}`).join('\n\n')}\n\n⚠️ *Note: This is for educational purposes only. Always consult clinical guidelines and healthcare providers for actual patient care.*`;
  };

  const getDosageResponse = (input: string): string => {
    return `💊 **Medication Dosage Guidance**\n\nFor accurate dosage calculations, I need more details:\n\n**Please provide:**\n- Patient weight (kg)\n- Medication name\n- Required dose (mg/kg or mcg/kg)\n- Available concentration\n\n**Common Formulas:**\n• **Basic**: Dose = Weight × Dosage\n• **IV Drip**: (Dose × Weight × 60) ÷ Concentration = mL/hr\n• **Pediatric**: (Weight in kg × Dose in mg/kg) ÷ Concentration = mL\n\n🔢 Visit the **Dosage Calculator** page for automated calculations with safety checks.`;
  };

  const getExamResponse = (input: string): string => {
    return `📝 **NCLEX Preparation Tips**\n\n**Priority Questions (Most Important!)**\n1. ABCs - Airway, Breathing, Circulation\n2. Maslow's Hierarchy of Needs\n3. Nursing Process: Assess → Diagnose → Plan → Implement → Evaluate\n\n**Question Strategies:**\n• Look for "best" or "most appropriate" answers\n• Eliminate obviously wrong answers first\n• Consider safety principles\n• Patient advocacy is always priority\n\n**Topics to Focus On:**\n• Medication pharmacology\n• Delegation principles\n• Patient safety\n• Infection control\n• Emergency interventions\n\n📚 Visit the **Exams** page for practice questions!`;
  };

  const getMigrationResponse = (input: string): string => {
    return `✈️ **Migration Pathway Guidance**\n\n**Typical Steps for International Nurses:**\n\n1. **NCLEX-RN** 🎯\n   - Required for USA, Canada\n   - Computer adaptive testing\n\n2. **Language Tests** 🗣️\n   - IELTS (UK, Australia, Canada)\n   - OET (Healthcare-specific)\n\n3. **Credential Evaluation** 📋\n   - CGFNS (for USA)\n   - NMC (for UK)\n\n4. **Visa Process** 🛂\n   - NCLEX-RN for green card\n   - TN Visa for USA (Mexican/Canadian)\n\n5. **Job Offer & Sponsorship** 💼\n\n🌍 Visit the **Migration** page for detailed tracking!`;
  };

  const getDrugResponse = (input: string): string => {
    const drugs: Record<string, string> = {
      'heparin': '🩸 **Heparin**\n• Anticoagulant\n• Monitor PTT/INR\n• Reverse with protamine\n• SC or IV administration',
      'insulin': '💉 **Insulin**\n• Types: Rapid, Short, Intermediate, Long-acting\n• Sliding scale dosing\n• Monitor blood glucose\n• Store properly',
      'morphine': '💊 **Morphine**\n• Opioid analgesic\n• Monitor respirations\n• Risk of constipation\n• Naloxone for overdose',
      'furosemide': '💧 **Furosemide (Lasix)**\n• Loop diuretic\n• Monitor K+ levels\n• Take in morning\n• Monitor BP',
      'warfarin': '🩸 **Warfarin (Coumadin)**\n• Anticoagulant (PO)\n• Monitor INR\n• Vitamin K antagonist\n• Consistent vitamin K intake',
      'amiodarone': '❤️ **Amiodarone**\n• Antiarrhythmic\n• Multiple side effects\n• Long half-life\n• Monitor thyroid, liver',
    };
    
    for (const [key, value] of Object.entries(drugs)) {
      if (input.toLowerCase().includes(key)) {
        return value + '\n\n⚠️ *Always verify with current drug references.*';
      }
    }
    
    return `💉 **Drug Information**\n\nTo provide medication information, please specify the drug name.\n\n**Common Nursing Drug Categories:**\n• Analgesics (pain relief)\n• Antibiotics (infections)\n• Anticoagulants (blood thinners)\n• Antihypertensives (BP meds)\n• Insulin & hypoglycemics\n• Anti-inflammatories\n\n🔍 For dosing calculations, visit the **Dosage Calculator** page.`;
  };

  const getGeneralResponse = (input: string): string => {
    const responses = [
      `I'd be happy to help! Here are some things I can assist with:\n\n🩺 **Clinical** - NANDA-I diagnoses, patient assessment\n💊 **Medications** - Dosages, drug info, interactions\n📚 **Education** - NCLEX prep, nursing concepts\n✈️ **Career** - Migration, job search, salaries\n\nWhat would you like to know more about?`,
      `That's a great question! Let me point you in the right direction:\n\n• For clinical help: Ask about "diagnosis" or "NANDA-I"\n• For medications: Ask about specific drugs or "dosage"\n• For exams: Ask about "NCLEX" or "practice questions"\n• For career: Ask about "migration" or "jobs"\n\nHow can I assist you further?`,
      `I'm here to help with your nursing journey! 🚀\n\n**Quick Topics:**\n• Patient assessment & nursing diagnoses\n• Medication calculations & safety\n• Exam preparation strategies\n• International career pathways\n• Clinical concepts & procedures\n\nWhat would you like to explore?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response delay
    setTimeout(async () => {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt);
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 4s ease infinite',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.2s',
        }}
        title="AI Assistant"
      >
        🤖
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '420px',
            height: '600px',
            background: 'rgba(15, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <style>{`
            @keyframes gradient-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .gradient-header {
              background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
              background-size: 200% 200%;
              animation: gradient-shift 4s ease infinite;
            }
            .message-enter {
              animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div className="gradient-header" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🤖</div>
              <div>
                <h3 style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>NurseAI Assistant</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0 }}>NANDA-I • Clinical • Exams</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'white', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '20px',
                  color: '#a5b4fc',
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className="message-enter"
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' 
                      : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#6366F1', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                  <span style={{ width: '8px', height: '8px', background: '#8B5CF6', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                  <span style={{ width: '8px', height: '8px', background: '#EC4899', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                </div>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>NurseAI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: input.trim() ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  transition: 'transform 0.2s',
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
