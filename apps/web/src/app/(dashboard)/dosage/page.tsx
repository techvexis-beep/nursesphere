'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Pill, Baby, Syringe, Heart, Ruler, Ambulance, Droplets,
  Zap, AlertTriangle, BarChart3, ScrollText, Calculator,
} from 'lucide-react';

type CalculatorType = 'pediatric' | 'iv-drip' | 'renal' | 'bsa' | 'emergency' | 'heparin' | 'insulin';

interface CalculationResult {
  id: string;
  calculator: string;
  inputs: Record<string, string>;
  value: number;
  unit: string;
  formula: string;
  warnings?: string[];
  timestamp: number;
}

interface Calculator {
  id: CalculatorType;
  label: string;
  icon: string;
  color: string;
  inputs: { key: string; label: string; placeholder: string; type: string; options?: { value: string; label: string }[] }[];
}

const calculators: Calculator[] = [
  {
    id: 'pediatric',
    label: 'Pediatric Dose',
    icon: '👶',
    color: '#EC4899',
    inputs: [
      { key: 'weight', label: 'Weight', placeholder: 'kg', type: 'number' },
      { key: 'dose', label: 'Dose', placeholder: 'mg/kg', type: 'number' },
      { key: 'unit', label: 'Unit', placeholder: '', type: 'select', options: [
        { value: 'mg/kg', label: 'mg/kg' },
        { value: 'mcg/kg', label: 'mcg/kg' },
      ]},
    ],
  },
  {
    id: 'iv-drip',
    label: 'IV Drip Rate',
    icon: '💉',
    color: '#10B981',
    inputs: [
      { key: 'dose', label: 'Dose', placeholder: 'mcg/kg/min', type: 'number' },
      { key: 'weight', label: 'Weight', placeholder: 'kg', type: 'number' },
      { key: 'concentration', label: 'Concentration', placeholder: 'mg', type: 'number' },
      { key: 'time', label: 'Time', placeholder: 'min', type: 'number' },
    ],
  },
  {
    id: 'renal',
    label: 'Renal Adjustment',
    icon: '🫘',
    color: '#8B5CF6',
    inputs: [
      { key: 'creatinine', label: 'Serum Cr', placeholder: 'mg/dL', type: 'number' },
      { key: 'age', label: 'Age', placeholder: 'years', type: 'number' },
      { key: 'weight', label: 'Weight', placeholder: 'kg', type: 'number' },
      { key: 'gender', label: 'Gender', placeholder: '', type: 'select', options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ]},
    ],
  },
  {
    id: 'bsa',
    label: 'BSA Calculator',
    icon: '📐',
    color: '#F59E0B',
    inputs: [
      { key: 'height', label: 'Height', placeholder: 'cm', type: 'number' },
      { key: 'weight', label: 'Weight', placeholder: 'kg', type: 'number' },
    ],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: '🚨',
    color: '#EF4444',
    inputs: [
      { key: 'drug', label: 'Drug', placeholder: '', type: 'select', options: [
        { value: 'adenosine', label: 'Adenosine' },
        { value: 'atropine', label: 'Atropine' },
        { value: 'epinephrine', label: 'Epinephrine' },
        { value: 'amiodarone', label: 'Amiodarone' },
        { value: 'lidocaine', label: 'Lidocaine' },
      ]},
      { key: 'weight', label: 'Weight', placeholder: 'kg', type: 'number' },
    ],
  },
  {
    id: 'heparin',
    label: 'Heparin',
    icon: '🩸',
    color: '#6366F1',
    inputs: [
      { key: 'weight', label: 'Weight', placeholder: 'kg', type: 'number' },
      { key: 'targetPTT', label: 'Target PTT', placeholder: 'seconds', type: 'number' },
      { key: 'currentPTT', label: 'Current PTT', placeholder: 'seconds', type: 'number' },
    ],
  },
  {
    id: 'insulin',
    label: 'Insulin Sliding Scale',
    icon: '💊',
    color: '#06B6D4',
    inputs: [
      { key: 'bloodGlucose', label: 'Blood Glucose', placeholder: 'mg/dL', type: 'number' },
      { key: 'insulinType', label: 'Insulin Type', placeholder: '', type: 'select', options: [
        { value: 'regular', label: 'Regular' },
        { value: 'lispro', label: 'Lispro' },
        { value: 'aspart', label: 'Aspart' },
      ]},
    ],
  },
];

const commonDrugs = [
  { name: 'Acetaminophen', dose: '10-15 mg/kg', max: '4g/day' },
  { name: 'Amoxicillin', dose: '25-45 mg/kg/day', max: '' },
  { name: 'Ibuprofen', dose: '5-10 mg/kg', max: '2400mg/day' },
  { name: 'Morphine', dose: '0.1 mg/kg', max: '' },
  { name: 'Fentanyl', dose: '1-2 mcg/kg', max: '' },
];

function calculate(calcId: CalculatorType, inputs: Record<string, string>): CalculationResult | null {
  const id = Math.random().toString(36).substr(2, 9);

  switch (calcId) {
    case 'pediatric': {
      const w = parseFloat(inputs.weight);
      const d = parseFloat(inputs.dose);
      const unit = inputs.unit || 'mg/kg';
      if (!w || !d) return null;
      const total = w * d;
      const warnings: string[] = [];
      if (w < 2) warnings.push('Weight is very low. Verify units.');
      if (d > 20) warnings.push('Dose exceeds typical range.');
      return {
        id, calculator: calcId, inputs, value: total, unit: unit.includes('mcg') ? 'mcg' : 'mg',
        formula: `${w} kg × ${d} ${unit} = ${total.toFixed(2)} ${unit.includes('mcg') ? 'mcg' : 'mg'}`,
        warnings, timestamp: Date.now(),
      };
    }
    case 'iv-drip': {
      const dose = parseFloat(inputs.dose);
      const weight = parseFloat(inputs.weight);
      const conc = parseFloat(inputs.concentration);
      const time = parseFloat(inputs.time);
      if (!dose || !weight || !conc || !time) return null;
      const rate = (dose * weight * time) / conc;
      const warnings: string[] = [];
      if (rate > 200) warnings.push('High drip rate. Verify settings.');
      return {
        id, calculator: calcId, inputs, value: rate, unit: 'mL/hr',
        formula: `(${dose} × ${weight} × ${time}) / ${conc} = ${rate.toFixed(2)} mL/hr`,
        warnings, timestamp: Date.now(),
      };
    }
    case 'renal': {
      const cr = parseFloat(inputs.creatinine);
      const age = parseFloat(inputs.age);
      const weight = parseFloat(inputs.weight) || 70;
      const gender = inputs.gender || 'male';
      if (!cr || !age) return null;
      let crcl = gender === 'male'
        ? ((140 - age) * weight) / (cr * 72)
        : ((140 - age) * weight) / (cr * 72) * 0.85;
      const warnings: string[] = [];
      if (crcl < 30) warnings.push('Severe renal impairment. Consider dose reduction.');
      else if (crcl < 60) warnings.push('Moderate renal impairment. Monitor closely.');
      let interp = crcl >= 90 ? 'Normal' : crcl >= 60 ? 'Mild' : crcl >= 30 ? 'Moderate' : 'Severe';
      return {
        id, calculator: calcId, inputs, value: crcl, unit: 'mL/min',
        formula: `CrCl = ${crcl.toFixed(2)} mL/min (${interp} impairment)`,
        warnings, timestamp: Date.now(),
      };
    }
    case 'bsa': {
      const h = parseFloat(inputs.height);
      const w = parseFloat(inputs.weight);
      if (!h || !w) return null;
      const bsa = Math.sqrt((h * w) / 3600);
      return {
        id, calculator: calcId, inputs, value: bsa, unit: 'm²',
        formula: `√((${h} × ${w}) / 3600) = ${bsa.toFixed(2)} m²`,
        timestamp: Date.now(),
      };
    }
    case 'emergency': {
      const drug = inputs.drug;
      const weight = parseFloat(inputs.weight);
      if (!drug || !weight) return null;
      let dose = 0, formula = '';
      const warnings: string[] = [];
      switch (drug) {
        case 'adenosine': dose = 0.1 * weight; warnings.push('Give rapid IV push followed by NS flush.'); break;
        case 'atropine': dose = Math.max(0.02 * weight, 0.5); warnings.push(`Min: 0.5mg, Max: 3mg`); break;
        case 'epinephrine': dose = 0.01 * weight; warnings.push('Use 1:10,000 concentration.'); break;
        case 'amiodarone': dose = 5 * weight; warnings.push('First dose: 5mg/kg IV push.'); break;
        case 'lidocaine': dose = 1 * weight; warnings.push('Max: 100mg per dose.'); break;
        default: return null;
      }
      return {
        id, calculator: calcId, inputs, value: dose, unit: 'mg',
        formula: `${drug} ${weight}kg: ${dose.toFixed(2)} mg`, warnings, timestamp: Date.now(),
      };
    }
    case 'heparin': {
      const weight = parseFloat(inputs.weight);
      const targetPTT = parseFloat(inputs.targetPTT);
      const currentPTT = parseFloat(inputs.currentPTT);
      if (!weight || !targetPTT) return null;
      const current = currentPTT || 30;
      const adjustment = ((targetPTT - current) / current) * 100;
      const infusionRate = weight * (adjustment > 0 ? 1 : 0.5);
      return {
        id, calculator: calcId, inputs, value: Math.max(0, infusionRate), unit: 'units/hr',
        formula: `Adjust based on PTT ratio: ${(targetPTT/current).toFixed(1)}`,
        warnings: currentPTT ? [] : ['Enter current PTT for accurate adjustment'],
        timestamp: Date.now(),
      };
    }
    case 'insulin': {
      const bg = parseFloat(inputs.bloodGlucose);
      if (!bg) return null;
      let dose = 0;
      if (bg < 70) dose = 0;
      else if (bg < 150) dose = 0;
      else if (bg < 200) dose = 2;
      else if (bg < 250) dose = 4;
      else if (bg < 300) dose = 6;
      else if (bg < 350) dose = 8;
      else dose = 10;
      return {
        id, calculator: calcId, inputs, value: dose, unit: 'units',
        formula: `Sliding scale: BG ${bg}mg/dL → ${dose} units`,
        timestamp: Date.now(),
      };
    }
    default:
      return null;
  }
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function DosageCalculatorPage() {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('pediatric');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('dosageHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 20));
      } catch (e) {}
    }
  }, []);

  const activeCalculator = calculators.find(c => c.id === activeCalc);

  const handleCalculate = () => {
    const res = calculate(activeCalc, inputs);
    if (res) {
      setResult(res);
      const newHistory = [res, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('dosageHistory', JSON.stringify(newHistory));
    }
  };

  const loadFromHistory = (item: CalculationResult) => {
    setActiveCalc(item.calculator as CalculatorType);
    setInputs(item.inputs);
    setResult(item);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('dosageHistory');
  };

  if (!mounted) {
    return <div className="bg-muted animate-pulse rounded-2xl h-[500px]" />;
  }

  const hasWarnings = result?.warnings && result.warnings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold mb-1.5 font-heading text-foreground flex items-center gap-2">
          <Pill className="w-7 h-7" />
          Dosage Calculator
        </h1>
        <p className="text-muted-foreground text-sm">
          Clinical calculators for healthcare professionals
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* Calculator Tabs */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-foreground font-heading">Calculators</h3>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-primary font-semibold bg-transparent border-none cursor-pointer"
            >
              <ScrollText className="w-3.5 h-3.5 inline mr-1" />
              History ({history.length})
            </button>
          </div>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {calculators.map(calc => (
              <button
                key={calc.id}
                onClick={() => { setActiveCalc(calc.id); setResult(null); setInputs({}); }}
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-none cursor-pointer text-left font-semibold text-sm transition-all duration-200 shrink-0',
                  activeCalc === calc.id
                    ? 'text-white'
                    : 'bg-transparent text-muted-foreground hover:bg-accent'
                )}
                style={activeCalc === calc.id ? { backgroundColor: calc.color } : {}}
              >
                <span className="text-lg">{calc.icon}</span>
                <span className="hidden sm:inline">{calc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-7">
          <div className="flex items-center gap-3.5 mb-6">
            <div
              className="w-[52px] h-[52px] rounded-xl flex items-center justify-center text-[26px]"
              style={{ backgroundColor: (activeCalculator?.color || '#6366F1') + '20' }}
            >
              {activeCalculator?.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground font-heading">
                {activeCalculator?.label}
              </h2>
              <p className="text-sm text-muted-foreground">Enter values and calculate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {activeCalculator?.inputs.map(input => (
              <div key={input.key}>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  {input.label}
                </label>
                {input.type === 'select' ? (
                  <select
                    value={inputs[input.key] || ''}
                    onChange={(e) => setInputs({ ...inputs, [input.key]: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted text-foreground text-sm outline-none"
                  >
                    <option value="">Select...</option>
                    {input.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={input.type}
                    value={inputs[input.key] || ''}
                    onChange={(e) => setInputs({ ...inputs, [input.key]: e.target.value })}
                    placeholder={input.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full py-4 h-auto text-base font-bold shadow-lg transition-all duration-200"
            style={{
              backgroundColor: activeCalculator?.color || '#6366F1',
              boxShadow: `0 4px 14px ${(activeCalculator?.color || '#6366F1')}40`,
            }}
          >
            <Zap className="w-4 h-4 mr-1.5" />
            Calculate
          </Button>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-7 p-6 rounded-2xl border-2"
                style={{
                  backgroundColor: hasWarnings ? '#FEF3C7' : '#10B98115',
                  borderColor: hasWarnings ? '#F59E0B' : '#10B981',
                }}
              >
                <div className="text-xs text-muted-foreground mb-2">RESULT</div>
                <div className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: activeCalculator?.color }}>
                  {result.value.toFixed(2)} <span className="text-lg font-semibold">{result.unit}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-card p-3 rounded-lg">
                  {result.formula}
                </div>
                {result.warnings?.map((w, i) => (
                  <div key={i} className="mt-3 p-3 rounded-lg text-sm font-medium flex items-start gap-2"
                    style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
                  >
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    {w}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Panel */}
        <div className="bg-card border border-border rounded-2xl p-5 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-foreground font-heading">Recent Calculations</h3>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-red-500 bg-transparent border-none cursor-pointer">
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 px-5 text-muted-foreground">
              <BarChart3 className="w-9 h-9 mx-auto mb-3" />
              <p className="text-sm">No calculations yet</p>
            </div>
          ) : (
            <div className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[500px] pb-2 lg:pb-0">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="p-3.5 bg-muted rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-primary hover:translate-x-1 shrink-0 lg:shrink"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] text-muted-foreground">
                      {calculators.find(c => c.id === item.calculator)?.icon} {calculators.find(c => c.id === item.calculator)?.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-foreground">
                    {item.value.toFixed(2)} <span className="text-[11px] font-medium">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Drug Reference */}
          <div className="mt-6 pt-5 border-t border-border">
            <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5 font-heading">
              <Pill className="w-3.5 h-3.5" />
              Common Pediatric Doses
            </h4>
            <div className="flex flex-col gap-2">
              {commonDrugs.map((drug, i) => (
                <div key={i} className="flex justify-between text-[11px]">
                  <span className="text-foreground font-medium">{drug.name}</span>
                  <span className="text-muted-foreground">{drug.dose}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-6 p-5 rounded-2xl border border-amber-500/20" style={{ backgroundColor: '#FEF3C720' }}>
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h4 className="text-sm font-bold" style={{ color: '#92400E' }}>Important Safety Information</h4>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#92400E' }}>
          Always double-check calculations before administering medication. Verify patient identity and weight.
          Cross-reference with official drug references (Lexicomp, Micromedex). Consult pharmacists for verification.
          This tool is for educational purposes - follow institutional protocols.
        </p>
      </div>
    </motion.div>
  );
}
