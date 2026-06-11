'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Lightbulb, Heart, Brain, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface ClinicalTip {
  title: string;
  category: string;
  content: string;
  keyPoints?: string[];
}

const fallbackTips: ClinicalTip[] = [
  {
    title: 'The 5 Rights of Medication Administration',
    category: 'medication',
    content: 'Always verify: Right patient, Right drug, Right dose, Right route, Right time. Double-check the 5 rights before every medication administration. Additional checks include right documentation and right reason.',
    keyPoints: ['Right Patient - Verify using 2 identifiers', 'Right Drug - Check medication name', 'Right Dose - Calculate correctly', 'Right Route - Oral, IV, IM, etc.', 'Right Time - Follow schedule'],
  },
  {
    title: 'SBAR Communication Technique',
    category: 'communication',
    content: 'Use SBAR for handoffs: Situation (what\'s happening), Background (relevant history), Assessment (what you found), Recommendation (what you want). This ensures clear, concise clinical communication.',
    keyPoints: ['S - Situation: What is happening?', 'B - Background: Relevant patient history', 'A - Assessment: What you found', 'R - Recommendation: What you need'],
  },
  {
    title: 'Early Signs of Sepsis',
    category: 'assessment',
    content: 'Watch for: Temperature >38°C or <36°C, Heart rate >90, Respiratory rate >20, WBC >12,000 or <4,000. Remember: "Tachypnea, Tachycardia, Temperature, Altered mental status, Low blood pressure" = Sepsis alert!',
    keyPoints: ['Monitor vital signs closely', 'Check temperature every 4 hours', 'Assess mental status', 'Document I&O accurately', 'Report immediately if suspected'],
  },
  {
    title: 'Pain Assessment using PQRST',
    category: 'assessment',
    content: 'P - Provokes/Palliates (what makes it worse/better), Q - Quality (describe the pain), R - Radiation (does it spread?), S - Severity (scale 0-10), T - Timing (when did it start?). Essential for accurate pain management.',
    keyPoints: ['P - Provokes: What triggers the pain?', 'Q - Quality: Sharp, dull, burning?', 'R - Radiation: Does it spread?', 'S - Severity: 0-10 scale', 'T - Timing: When did it start?'],
  },
  {
    title: 'Proper Hand Hygiene Technique',
    category: 'safety',
    content: '20 seconds minimum: Wet hands, Apply soap, Palm to palm, Between fingers, Back of hands, Thumbs, Fingernails, Rinse thoroughly, Dry with paper towel, Use towel to turn off faucet. Most effective infection control!',
    keyPoints: ['Use soap and warm water', '20 seconds minimum', 'Clean between fingers', 'Use paper towel to dry', 'Use towel to turn off faucet'],
  },
  {
    title: 'ABCDE Assessment for Critical Patients',
    category: 'assessment',
    content: 'A - Airway (patency), B - Breathing (rate, effort, O2 sat), C - Circulation (BP, pulse, skin color), D - Disability (AVPU, pupils, glucose), E - Exposure (full body exam, temperature). Always start with ABCs!',
    keyPoints: ['A - Airway: Is it patent?', 'B - Breathing: Rate and effort', 'C - Circulation: BP and pulse', 'D - Disability: Neurological status', 'E - Exposure: Full exam'],
  },
  {
    title: 'IV Site Assessment',
    category: 'intervention',
    content: 'Check IV site every 4 hours for: Signs of infiltration (cool, swollen, pain), Phlebitis (redness, warmth, swelling), Infection (drainage, fever). Document site condition every shift. Remove if complications occur.',
    keyPoints: ['Check every 4 hours', 'Look for redness and swelling', 'Assess for pain', 'Document site condition', 'Remove if complications'],
  },
  {
    title: 'Patient Identification',
    category: 'safety',
    content: 'ALWAYS verify patient identity using two identifiers: Full name and Date of birth. Check wristband. Ask patient to state their name. Never rely on room number alone. Patient safety starts with correct identification!',
    keyPoints: ['Use 2 identifiers', 'Check wristband', 'Ask patient to state name', 'Never use room number', 'Document verification'],
  },
  {
    title: 'Orthostatic Hypotension Assessment',
    category: 'assessment',
    content: 'Measure BP and HR lying, sitting, and standing. Wait 2-3 minutes between measurements. Positive if: Systolic drop >20mmHg OR Diastolic drop >10mmHg OR HR increase >20bpm. Educate patient to rise slowly.',
    keyPoints: ['Measure in 3 positions', 'Wait 2-3 minutes between', 'Document all readings', 'Positive = intervention needed', 'Educate on slow rising'],
  },
  {
    title: 'Diabetes Blood Glucose Monitoring',
    category: 'medication',
    content: 'Normal fasting: 70-100 mg/dL. Target for diabetics: 80-130 mg/dL fasting, <180 mg/dL post-meal. Check before meals and bedtime. Hold insulin if <70 mg/dL. Document and report significant changes.',
    keyPoints: ['Normal: 70-100 mg/dL fasting', 'Diabetic target: 80-130 mg/dL', 'Check before meals', 'Hold if <70 mg/dL', 'Document all results'],
  },
];

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  assessment: { icon: Stethoscope, color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  intervention: { icon: Heart, color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  safety: { icon: AlertTriangle, color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  communication: { icon: Brain, color: 'purple', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  medication: { icon: Stethoscope, color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Clinical: { icon: Lightbulb, color: 'indigo', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
};

export default function ClinicalTip() {
  const { theme } = useUser();
  const [tip, setTip] = useState<ClinicalTip>(fallbackTips[0]);
  const [showFull, setShowFull] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchDailyTip = async () => {
      try {
        const response = await fetch('/api/ai/daily?type=tip');
        const data = await response.json();
        
        if (data.success && data.content) {
          setTip({
            title: data.content.title || fallbackTips[0].title,
            category: data.content.category || fallbackTips[0].category,
            content: data.content.content || fallbackTips[0].content,
            keyPoints: data.content.keyPoints || fallbackTips[0].keyPoints,
          });
        } else {
          const now = new Date();
          const start = new Date(now.getFullYear(), 0, 0);
          const diff = now.getTime() - start.getTime();
          const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
          setTip(fallbackTips[dayOfYear % fallbackTips.length]);
        }
      } catch (error) {
        console.log('Using fallback tip data');
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        setTip(fallbackTips[dayOfYear % fallbackTips.length]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTip();
  }, []);

  const config = categoryConfig[tip.category] || categoryConfig.Clinical;
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
            {isLoading ? (
              <Loader2 className={`w-4 h-4 text-${config.color}-500 animate-spin`} />
            ) : (
              <Icon className={`w-4 h-4 text-${config.color}-500`} />
            )}
          </div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Clinical Tip
          </h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          tip.category === 'safety' || tip.category === 'medication'
            ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
            : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
        }`}>
          {tip.category}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {tip.title}
          </h4>
        </div>

        <p className={`text-sm leading-relaxed ${
          showFull 
            ? isDark ? 'text-slate-300' : 'text-slate-600' 
            : isDark ? 'text-slate-400 line-clamp-3' : 'text-slate-500 line-clamp-3'
        }`}>
          {tip.content}
        </p>

        <button
          onClick={() => setShowFull(!showFull)}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
          }`}
        >
          <Lightbulb className="w-3 h-3" />
          {showFull ? 'Show less' : 'Read more'}
        </button>

        <div className={`flex items-center gap-2 pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <CheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            AI-powered daily clinical insights
          </span>
        </div>
      </div>
    </motion.div>
  );
}
