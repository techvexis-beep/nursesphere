'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, AlertCircle, Info, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface Drug {
  name: string;
  classification: string;
  indication: string;
  dosage: string;
  sideEffects: string[];
  nursingConsiderations: string;
}

const fallbackDrugs: Drug[] = [
  {
    name: 'Aspirin',
    classification: 'NSAID / Antiplatelet',
    indication: 'Pain relief, fever reduction, cardioprotection, stroke prevention',
    dosage: '81-325mg daily (cardioprotection)',
    sideEffects: ['GI bleeding', 'Tinnitus', 'Rash', 'Bleeding time prolonged'],
    nursingConsiderations: 'Monitor for signs of bleeding, GI upset. Give with food or milk. Assess pain levels.',
  },
  {
    name: 'Metformin',
    classification: 'Biguanide (Antidiabetic)',
    indication: 'Type 2 Diabetes Management',
    dosage: '500mg twice daily with meals',
    sideEffects: ['GI upset', 'Diarrhea', 'Metallic taste', 'Lactic acidosis (rare)'],
    nursingConsiderations: 'Hold before contrast dye procedures. Monitor blood glucose. Take with meals to reduce GI effects.',
  },
  {
    name: 'Lisinopril',
    classification: 'ACE Inhibitor',
    indication: 'Hypertension, Heart Failure, Post-MI',
    dosage: '10-40mg daily',
    sideEffects: ['Dry cough', 'Hyperkalemia', 'Dizziness', 'Angioedema'],
    nursingConsiderations: 'Monitor BP and potassium levels. Report dry cough. Rise slowly from sitting. Avoid potassium supplements.',
  },
  {
    name: 'Amlodipine',
    classification: 'Calcium Channel Blocker',
    indication: 'Hypertension, Angina',
    dosage: '5-10mg daily',
    sideEffects: ['Peripheral edema', 'Flushing', 'Headache', 'Dizziness'],
    nursingConsiderations: 'Monitor blood pressure and heart rate. Assess for peripheral edema. Take at same time each day.',
  },
  {
    name: 'Omeprazole',
    classification: 'Proton Pump Inhibitor',
    indication: 'GERD, Peptic ulcer,胃酸反流',
    dosage: '20-40mg daily before breakfast',
    sideEffects: ['Headache', 'Diarrhea', 'Constipation', 'Vitamin B12 deficiency (long-term)'],
    nursingConsiderations: 'Take 30-60 min before meals. Do not crush or chew capsules. Monitor for signs of C. diff infection.',
  },
  {
    name: 'Heparin',
    classification: 'Anticoagulant',
    indication: 'DVT prevention/treatment, PE, ACS',
    dosage: 'IV: 25,000-40,000 units/day; SubQ: 5000 units q12h',
    sideEffects: ['Bleeding', 'Thrombocytopenia', 'Osteoporosis (long-term)', 'Injection site reactions'],
    nursingConsiderations: 'Monitor aPTT, platelets, Hgb/Hct. Assess for signs of bleeding. Give deep SubQ injections. Reverse with protamine sulfate.',
  },
  {
    name: 'Furosemide',
    classification: 'Loop Diuretic',
    indication: 'Edema, Hypertension, Heart Failure',
    dosage: '20-80mg IV/PO daily',
    sideEffects: ['Hypokalemia', 'Hypomagnesemia', 'Dehydration', 'Ototoxicity', 'Hyperglycemia'],
    nursingConsiderations: 'Monitor electrolytes (K+, Mg2+), BP, weight, and I&O. Give in AM to avoid nocturia. IV dose should be given slowly.',
  },
  {
    name: 'Morphine',
    classification: 'Opioid Analgesic',
    indication: 'Severe pain, Pulmonary edema',
    dosage: '2-4mg IV q2-4h; 10-30mg PO q4h',
    sideEffects: ['Respiratory depression', 'Sedation', 'Constipation', 'Nausea', 'Hypotension'],
    nursingConsiderations: 'Monitor respirations, BP, pain level. Keep naloxone available. Assess for signs of dependence. Prevent constipation.',
  },
];

export default function DrugOfDay() {
  const { theme } = useUser();
  const [drug, setDrug] = useState<Drug>(fallbackDrugs[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchDailyDrug = async () => {
      try {
        const response = await fetch('/api/ai/daily?type=drug');
        const data = await response.json();
        
        if (data.success && data.content) {
          setDrug({
            name: data.content.name || fallbackDrugs[0].name,
            classification: data.content.classification || fallbackDrugs[0].classification,
            indication: data.content.indication || fallbackDrugs[0].indication,
            dosage: data.content.dosage || fallbackDrugs[0].dosage,
            sideEffects: data.content.sideEffects || fallbackDrugs[0].sideEffects,
            nursingConsiderations: data.content.nursingConsiderations || fallbackDrugs[0].nursingConsiderations,
          });
        } else {
          const now = new Date();
          const start = new Date(now.getFullYear(), 0, 0);
          const diff = now.getTime() - start.getTime();
          const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
          setDrug(fallbackDrugs[dayOfYear % fallbackDrugs.length]);
        }
      } catch (error) {
        console.log('Using fallback drug data');
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        setDrug(fallbackDrugs[dayOfYear % fallbackDrugs.length]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyDrug();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border ${
        isDark 
          ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20' 
          : 'bg-white border-emerald-100 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
        }`}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
          ) : (
            <Pill className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          )}
        </div>
        <div>
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Drug of the Day
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{drug.classification}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{drug.name}</h4>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {drug.indication}
          </p>
        </div>

        <div className={`rounded-lg p-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>Dosage</p>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{drug.dosage}</p>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
          }`}
        >
          <Info className="w-3 h-3" />
          {showDetails ? 'Hide details' : 'View nursing considerations'}
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className={`rounded-lg p-3 border ${
              isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'
            }`}>
              <div className="flex items-center gap-1 mb-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className={`text-xs font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Side Effects</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {drug.sideEffects.map((effect, i) => (
                  <span key={i} className={`text-xs px-2 py-0.5 rounded ${
                    isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {effect}
                  </span>
                ))}
              </div>
            </div>

            <div className={`rounded-lg p-3 border ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <p className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mb-1`}>Nursing Considerations</p>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{drug.nursingConsiderations}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
