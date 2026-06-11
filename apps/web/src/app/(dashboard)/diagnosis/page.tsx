'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  X,
  Brain,
  ClipboardList,
  AlertTriangle,
  Target,
  Bot,
  FileText,
  Download,
  Globe,
  Wrench,
  Pencil,
  Copy,
  ChevronDown,
  Plus,
  Sparkles,
  Check,
} from 'lucide-react';

interface Diagnosis {
  code: string;
  name: string;
  class: string;
  domain: string;
  related: string[];
  defining: string[];
  interventions: string[];
  outcomes: string[];
}

const nandaDiagnoses: Diagnosis[] = [
  {
    code: '00096',
    name: 'Decreased Diversional Activity Engagement',
    class: 'Health awareness',
    domain: 'Health Promotion',
    related: ['Environmental lack of stimuli', 'Physical limitations', 'Psychological limitations', 'Social isolation'],
    defining: ['Verbal expression of boredom', 'Restlessness', 'Decreased participation', 'Anxiety', 'Withdrawal'],
    interventions: ['Activity assessment', 'Stimulating environment', 'Social engagement', 'Recreational activities'],
    outcomes: ['Increased engagement', 'Expressed satisfaction', 'Active participation'],
  },
  {
    code: '00212',
    name: 'Readiness for Enhanced Health Literacy',
    class: 'Health awareness',
    domain: 'Health Promotion',
    related: ['Expressed desire to improve health management', 'Interest in health information'],
    defining: ['Expressed desire to enhance health literacy', 'Demonstrates ability to access health information'],
    interventions: ['Health education', 'Resource provision', 'Skill development', 'Literacy-appropriate materials'],
    outcomes: ['Improved health literacy', 'Effective self-management', 'Informed health decisions'],
  },
  {
    code: '00165',
    name: 'Sedentary Lifestyle',
    class: 'Health awareness',
    domain: 'Health Promotion',
    related: ['Lack of physical activity', 'Insufficient exercise', 'Physical deconditioning', 'Motivational factors'],
    defining: ['Verbal report of inactivity', 'Physical deconditioning', 'Avoidance of exercise', 'Weight gain'],
    interventions: ['Exercise program', 'Activity promotion', 'Behavioral counseling', 'Goal setting'],
    outcomes: ['Increased activity level', 'Improved fitness', 'Weight management'],
  },
  {
    code: '00214',
    name: 'Frail Elderly Syndrome',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Aging', 'Multiple comorbidities', 'Decreased physiological reserve', 'Malnutrition', 'Cognitive decline'],
    defining: ['Unintentional weight loss', 'Exhaustion', 'Low physical activity', 'Slow walking speed', 'Weak grip strength'],
    interventions: ['Comprehensive assessment', 'Multidisciplinary care', 'Fall prevention', 'Nutrition support', 'Exercise program'],
    outcomes: ['Maintained function', 'Improved strength', 'Reduced complications'],
  },
  {
    code: '00215',
    name: 'Risk for Frail Elderly Syndrome',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Advanced age', 'Chronic illness', 'Malnutrition', 'Polypharmacy', 'Social isolation'],
    defining: ['Presence of risk factors', 'No signs of frailty'],
    interventions: ['Risk assessment', 'Preventive interventions', 'Health promotion', 'Monitoring'],
    outcomes: ['Prevention of frailty', 'Maintained independence', 'Optimal function'],
  },
  {
    code: '00216',
    name: 'Deficient Community Health',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Inadequate resources', 'Insufficient health services', 'Environmental hazards', 'Lack of health education'],
    defining: ['Increased illness rates', 'Inadequate health services', 'Environmental problems', 'Lack of health promotion programs'],
    interventions: ['Community assessment', 'Resource development', 'Health education', 'Collaboration with agencies'],
    outcomes: ['Improved community health', 'Increased access to services', 'Reduced health risks'],
  },
  {
    code: '00217',
    name: 'Risk-Prone Health Behaviour',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Inadequate comprehension', 'Denial of health risks', 'Lack of resources', 'Low self-efficacy', 'Chronic stress'],
    defining: ['Verbalization of risk', 'Non-adherence to health recommendations', 'Reckless behavior', 'Substance abuse'],
    interventions: ['Health education', 'Motivational interviewing', 'Support systems', 'Behavioral interventions'],
    outcomes: ['Adopts healthy behaviors', 'Reduces risky behaviors', 'Improved self-management'],
  },
  {
    code: '00099',
    name: 'Ineffective Health Maintenance',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Inadequate resources', 'Insufficient knowledge', 'Impaired cognitive function', 'Ineffective coping'],
    defining: ['Inability to take responsibility', 'Failure to improve health', 'Absence of preventive measures'],
    interventions: ['Health education', 'Resource provision', 'Support systems', 'Care coordination'],
    outcomes: ['Effective self-care', 'Adopts healthy practices', 'Prevention of illness'],
  },
  {
    code: '00078',
    name: 'Ineffective Airway Clearance',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Obstructed airway', 'Excessive secretions', 'Trauma', 'Neurological impairment', 'Allergic reactions'],
    defining: ['Abnormal breath sounds', 'Cyanosis', 'Ineffective coughing', 'Dyspnea', 'Tachypnea', 'Orthopnea'],
    interventions: ['Airway positioning', 'Suctioning', 'Oxygen therapy', 'Breathing exercises', 'Humidification', 'Chest physiotherapy'],
    outcomes: ['Clear airway', 'Normal breath sounds', 'Adequate oxygenation'],
  },
  {
    code: '00218',
    name: 'Ineffective Health Management',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Complex regimen', 'Insufficient knowledge', 'Inadequate support', 'Economic barriers', 'Cultural beliefs'],
    defining: ['Difficulty with regimen', 'Missed treatments', 'Exacerbation of symptoms', 'Failure to progress'],
    interventions: ['Care coordination', 'Education', 'Self-management support', 'Resource provision', 'Follow-up care'],
    outcomes: ['Effective management', 'Symptom control', 'Improved outcomes'],
  },
  {
    code: '00219',
    name: 'Readiness for Enhanced Health Management',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Expressed desire to manage health', 'Effective self-management behaviors'],
    defining: ['Expresses readiness', 'Demonstrates effective management', 'Actively participates in care'],
    interventions: ['Support', 'Education', 'Resource provision', 'Goal setting'],
    outcomes: ['Optimal health management', 'Improved outcomes', 'Self-efficacy'],
  },
  {
    code: '00220',
    name: 'Ineffective Family Health Management',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Insufficient family resources', 'Inadequate knowledge', 'Family conflict', 'Complex health needs'],
    defining: ['Difficulty managing health', 'Ineffective care', 'Family stress', 'Missed appointments'],
    interventions: ['Family education', 'Resource coordination', 'Support services', 'Care planning'],
    outcomes: ['Effective family management', 'Improved family function', 'Better health outcomes'],
  },
  {
    code: '00043',
    name: 'Ineffective Protection',
    class: 'Health management',
    domain: 'Health Promotion',
    related: ['Altered immune system', 'Blood disorders', 'Medication effects', 'Thermal injury'],
    defining: ['Frequent infections', 'Delayed healing', 'Easy bruising/bleeding', 'Altered pigmentation'],
    interventions: ['Infection prevention', 'Safety monitoring', 'Bleeding precautions', 'Protective isolation', 'Skin care'],
    outcomes: ['Free from infection/injury', 'Adequate wound healing', 'Protected from harm'],
  },
  {
    code: '00002',
    name: 'Imbalanced Nutrition: Less Than Body Requirements',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Inadequate food intake', 'Malabsorption', 'Increased metabolic demands', 'Swallowing difficulties'],
    defining: ['Weight loss', 'Loss of subcutaneous fat', 'Muscle wasting', 'Decreased appetite', 'Weakness'],
    interventions: ['Nutritional assessment', 'Dietary counseling', ' supplementation', 'Monitoring weight', 'Meal planning'],
    outcomes: ['Weight gain', 'Improved nutritional status', 'Adequate intake'],
  },
  {
    code: '00263',
    name: 'Readiness for Enhanced Nutrition',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Expresses desire to improve nutritional status', 'Healthy eating behaviors'],
    defining: ['Expresses readiness', 'Demonstrates healthy eating', 'Maintains healthy weight'],
    interventions: ['Nutrition education', 'Meal planning', 'Resource provision', 'Support'],
    outcomes: ['Optimal nutrition', 'Healthy weight', 'Improved health'],
  },
  {
    code: '00268',
    name: 'Insufficient Breast Milk Production',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Insufficient glandular tissue', 'Hormonal imbalance', 'Poor infant attachment', 'Maternal stress'],
    defining: ['Inadequate milk supply', 'Infant weight loss', 'Poor infant feeding', 'Decreased wet diapers'],
    interventions: ['Lactation support', 'Breastfeeding education', 'Pumping', 'Referral to lactation consultant'],
    outcomes: ['Adequate milk production', 'Successful breastfeeding', 'Infant weight gain'],
  },
  {
    code: '00104',
    name: 'Ineffective Breastfeeding',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Poor infant attachment', 'Maternal anxiety', 'Insufficient milk', 'Maternal illness', 'Infant problems'],
    defining: ['Unsatisfactory breastfeeding', 'Inadequate infant intake', 'Nipple pain', 'Infant fussiness'],
    interventions: ['Lactation support', 'Positioning assistance', 'Education', 'Pump provision', 'Follow-up'],
    outcomes: ['Effective breastfeeding', 'Adequate infant intake', 'Maternal comfort'],
  },
  {
    code: '00105',
    name: 'Interrupted Breastfeeding',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Maternal illness', 'Infant illness', 'Separation', 'Maternal employment', 'Contraindications'],
    defining: ['Inability to feed', 'Separation from infant', 'Inability to sustain breastfeeding'],
    interventions: ['Pumping education', 'Milk storage', 'Support', 'Re-establishment planning'],
    outcomes: ['Breastfeeding re-establishment', 'Continued milk production', 'Infant nutrition'],
  },
  {
    code: '00264',
    name: 'Readiness for Enhanced Breastfeeding',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Expresses desire to breastfeed', 'Support system available', 'Normal infant reflexes'],
    defining: ['Expresses readiness', 'Demonstrates proper technique', 'Infant latches effectively'],
    interventions: ['Education', 'Support', 'Resource provision', 'Follow-up'],
    outcomes: ['Successful breastfeeding', 'Maternal-infant bonding', 'Infant health'],
  },
  {
    code: '00221',
    name: 'Ineffective Adolescent Eating Dynamics',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Body image concerns', 'Peer pressure', 'Family conflict', 'Psychological issues', 'Media influence'],
    defining: ['Binge eating', 'Food restriction', 'Purging', 'Weight concerns', 'Avoidance behaviors'],
    interventions: ['Assessment', 'Counseling', 'Nutrition education', 'Family therapy', 'Referral'],
    outcomes: ['Healthy eating patterns', 'Improved body image', 'Normalized weight'],
  },
  {
    code: '00222',
    name: 'Ineffective Child Eating Dynamics',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Family feeding patterns', 'Power struggles', 'Food preferences', 'Developmental issues'],
    defining: ['Food refusal', 'Selective eating', 'Feeding difficulties', 'Poor weight gain'],
    interventions: ['Feeding assessment', 'Behavior interventions', 'Family education', 'Occupational therapy'],
    outcomes: ['Improved eating', 'Adequate nutrition', 'Healthy weight'],
  },
  {
    code: '00223',
    name: 'Ineffective Infant Eating Dynamics',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Neurological impairment', 'Oral-motor dysfunction', 'Prematurity', 'Gastrointestinal problems'],
    defining: ['Feeding difficulties', 'Ineffective suck', 'Poor weight gain', 'Feeding aversion'],
    interventions: ['Feeding assessment', 'Positioning', 'Swallowing therapy', 'Nutritional support'],
    outcomes: ['Effective feeding', 'Adequate intake', 'Weight gain'],
  },
  {
    code: '00269',
    name: 'Ineffective Infant Feeding Pattern',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Neurological dysfunction', 'Oral-motor problems', 'Prematurity', 'Fatigue', 'Reflex problems'],
    defining: ['Difficulty feeding', 'Weak suck', 'Poor coordination', 'Ineffective swallowing'],
    interventions: ['Feeding evaluation', 'Positioning', 'Therapy', 'Nourishment support', 'Monitoring'],
    outcomes: ['Effective feeding', 'Adequate intake', 'Growth'],
  },
  {
    code: '00223',
    name: 'Obesity',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Excessive caloric intake', 'Sedentary lifestyle', 'Genetic factors', 'Metabolic disorders', 'Psychological factors'],
    defining: ['BMI >30', 'Excessive body fat', 'Weight gain', 'Physical limitations', 'Comorbidities'],
    interventions: ['Diet modification', 'Exercise program', 'Behavior therapy', 'Medical monitoring', 'Support groups'],
    outcomes: ['Weight loss', 'Improved health', 'Behavior change'],
  },
  {
    code: '00270',
    name: 'Overweight',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Excessive caloric intake', 'Sedentary lifestyle', 'Genetic predisposition', 'Metabolic factors'],
    defining: ['BMI 25-29.9', 'Increased body weight', 'Poor dietary habits', 'Low activity level'],
    interventions: ['Nutrition counseling', 'Physical activity', 'Behavioral modification', 'Monitoring'],
    outcomes: ['Weight management', 'Healthy BMI', 'Lifestyle change'],
  },
  {
    code: '00271',
    name: 'Risk for Overweight',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Family history', 'Sedentary lifestyle', 'Unhealthy eating patterns', 'Psychological factors'],
    defining: ['Presence of risk factors', 'No current overweight'],
    interventions: ['Risk assessment', 'Education', 'Prevention strategies', 'Monitoring'],
    outcomes: ['Prevention of overweight', 'Healthy weight maintenance', 'Behavior change'],
  },
  {
    code: '00103',
    name: 'Impaired Swallowing',
    class: 'Ingestion',
    domain: 'Nutrition',
    related: ['Neurological impairment', 'Mechanical obstruction', 'Muscle weakness', 'Cognitive impairment', 'Radiation therapy'],
    defining: ['Difficulty swallowing', 'Coughing', 'Choking', 'Drooling', 'Pocketing food'],
    interventions: ['Swallowing assessment', 'Diet modification', 'Positioning', 'Therapy', 'Monitoring'],
    outcomes: ['Safe swallowing', 'Adequate nutrition', 'No aspiration'],
  },
  {
    code: '00179',
    name: 'Risk for Unstable Blood Glucose Level',
    class: 'Metabolism',
    domain: 'Nutrition',
    related: ['Inadequate glucose monitoring', 'Lack of adherence', 'Stress', 'Illness', 'Medication issues'],
    defining: ['History of hypoglycemia/hyperglycemia', 'Diabetes diagnosis', 'Irregular eating patterns'],
    interventions: ['Blood glucose monitoring', 'Diet management', 'Medication compliance', 'Education', 'Insulin adjustment'],
    outcomes: ['Maintains stable glucose', 'No hypoglycemia/hyperglycemia', 'Good glycemic control'],
  },
  {
    code: '00194',
    name: 'Neonatal Hyperbilirubinemia',
    class: 'Metabolism',
    domain: 'Nutrition',
    related: ['Prematurity', 'Blood type incompatibility', 'Breastfeeding', 'Hemolysis', 'Liver dysfunction'],
    defining: ['Yellow skin/eyes', 'Elevated bilirubin', 'Lethargy', 'Poor feeding', 'Dark urine'],
    interventions: ['Phototherapy', 'Hydration', 'Monitoring', 'Exchange transfusion if needed', 'Parent education'],
    outcomes: ['Decreased bilirubin', 'No kernicterus', 'Normal development'],
  },
  {
    code: '00229',
    name: 'Risk for Neonatal Hyperbilirubinemia',
    class: 'Metabolism',
    domain: 'Nutrition',
    related: ['Prematurity', 'Blood type incompatibility', 'Breastfeeding', 'Sibling with jaundice', 'East Asian ethnicity'],
    defining: ['Presence of risk factors'],
    interventions: ['Monitoring bilirubin', 'Early feeding', 'Phototherapy', 'Parent education'],
    outcomes: ['Prevention of significant jaundice', 'Normal bilirubin levels'],
  },
  {
    code: '00230',
    name: 'Risk for Impaired Liver Function',
    class: 'Metabolism',
    domain: 'Nutrition',
    related: ['Hepatitis', 'Cirrhosis', 'Alcohol use', 'Medication toxicity', 'Viral infection'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Education', 'Monitoring liver enzymes', 'Avoidance of hepatotoxic substances'],
    outcomes: ['Preserved liver function', 'Early detection of dysfunction'],
  },
  {
    code: '00231',
    name: 'Risk for Metabolic Imbalance Syndrome',
    class: 'Metabolism',
    domain: 'Nutrition',
    related: ['Obesity', 'Insulin resistance', 'Dyslipidemia', 'Hypertension', 'Sedentary lifestyle'],
    defining: ['Presence of risk factors', 'Metabolic syndrome components'],
    interventions: ['Metabolic monitoring', 'Lifestyle modification', 'Weight management', 'Medical management'],
    outcomes: ['Prevention of metabolic syndrome', 'Improved metabolic health'],
  },
  {
    code: '00015',
    name: 'Risk for Electrolyte Imbalance',
    class: 'Hydration',
    domain: 'Nutrition',
    related: ['Diuretic therapy', 'GI losses', 'Renal disease', 'Endocrine disorders', 'IV therapy'],
    defining: ['Presence of risk factors', 'No current symptoms'],
    interventions: ['Electrolyte monitoring', 'IV/oral replacement', 'Dietary modification', 'Medication review'],
    outcomes: ['Normal electrolyte levels', 'Prevention of imbalance'],
  },
  {
    code: '00024',
    name: 'Risk for Imbalanced Fluid Volume',
    class: 'Hydration',
    domain: 'Nutrition',
    related: ['Surgery', 'Trauma', 'Burns', 'Renal dysfunction', 'Heart failure'],
    defining: ['Risk factors present'],
    interventions: ['Fluid monitoring', 'I&O tracking', 'Weight monitoring', 'IV management'],
    outcomes: ['Fluid balance', 'Normal hydration status'],
  },
  {
    code: '00027',
    name: 'Deficient Fluid Volume',
    class: 'Hydration',
    domain: 'Nutrition',
    related: ['Vomiting', 'Diarrhea', 'Diuretics', 'Decreased intake', 'Fever', 'Hyperglycemia'],
    defining: ['Decreased urine output', 'Dry mucous membranes', 'Decreased skin turgor', 'Tachycardia', 'Hypotension'],
    interventions: ['Fluid replacement', 'Oral/IV hydration', 'Monitoring', 'Treatment of cause'],
    outcomes: ['Restored fluid volume', 'Normal hydration', 'Stable vitals'],
  },
  {
    code: '00026',
    name: 'Excess Fluid Volume',
    class: 'Hydration',
    domain: 'Nutrition',
    related: ['Heart failure', 'Renal failure', 'Cirrhosis', 'IV fluid overload', 'Steroid therapy'],
    defining: ['Edema', 'Weight gain', 'Crackles', 'JVD', 'Shortness of breath', 'Hypertension'],
    interventions: ['Fluid restriction', 'Diuretic therapy', 'Sodium restriction', 'Monitoring', 'Daily weights'],
    outcomes: ['Fluid balance', 'Resolution of edema', 'Normal weight'],
  },
  {
    code: '00016',
    name: 'Impaired Urinary Elimination',
    class: 'Urinary function',
    domain: 'Elimination and Exchange',
    related: ['Urinary tract obstruction', 'Neurological impairment', 'Post-surgical changes', 'Infection'],
    defining: ['Dysuria', 'Frequency', 'Urgency', 'Nocturia', 'Hematuria', 'Incontinence'],
    interventions: ['Bladder training', 'Catheter care', 'Medication management', 'Fluid management', 'Pelvic floor exercises'],
    outcomes: ['Normal urinary elimination', 'No incontinence', 'No infection'],
  },
  {
    code: '00020',
    name: 'Functional Urinary Incontinence',
    class: 'Urinary function',
    domain: 'Elimination and Exchange',
    related: ['Physical limitations', 'Cognitive impairment', 'Environmental barriers', 'Muscle weakness'],
    defining: ['Unawareness of bladder fullness', 'Inability to reach toilet', 'Incontinence before toileting'],
    interventions: ['Scheduled voiding', 'Environmental modifications', 'Assistive devices', 'Prompted voiding'],
    outcomes: ['Improved continence', 'Reduced accidents', 'Independence in toileting'],
  },
  {
    code: '00176',
    name: 'Overflow Urinary Incontinence',
    class: 'Urinary function',
    domain: 'Elimination and Exchange',
    related: ['Bladder outlet obstruction', 'Detrusor weakness', 'Neurogenic bladder', 'Medications'],
    defining: ['Dribbling', 'Incomplete emptying', 'Weak stream', 'Urinary retention', 'Overflow'],
    interventions: ['Catheterization', 'Bladder management', 'Medication review', 'Scheduled voiding'],
    outcomes: ['Complete bladder emptying', 'Reduced dribbling', 'No retention'],
  },
  {
    code: '00019',
    name: 'Stress Urinary Incontinence',
    class: 'Urinary function',
    domain: 'Elimination and Exchange',
    related: ['Weak pelvic floor muscles', 'Pregnancy', 'Childbirth', 'Obesity', 'Chronic cough'],
    defining: ['Incontinence with cough/sneeze/exercise', 'Small amounts', 'No urge sensation'],
    interventions: ['Pelvic floor exercises', 'Weight management', 'Bladder training', 'Pessary if indicated'],
    outcomes: ['Reduced incontinence', 'Improved pelvic floor strength'],
  },
  {
    code: '00018',
    name: 'Urge Urinary Incontinence',
    class: 'Urinary function',
    domain: 'Elimination and Exchange',
    related: ['Detrusor overactivity', 'Caffeine', 'Infection', 'Neurological conditions'],
    defining: ['Strong urge', 'Inability to delay urination', 'Frequent urination', 'Large volume loss'],
    interventions: ['Bladder training', 'Timed voiding', 'Fluid management', 'Medication', 'Pelvic floor exercises'],
    outcomes: ['Improved bladder control', 'Reduced urge episodes', 'Fewer accidents'],
  },
  {
    code: '00198',
    name: 'Disturbed Sleep Pattern',
    class: 'Sleep/Rest',
    domain: 'Activity/Rest',
    related: ['Environmental changes', 'Illness', 'Psychological stress', 'Discomfort', 'Pain'],
    defining: ['Difficulty falling asleep', 'Waking frequently', 'Unrefreshing sleep', 'Daytime fatigue'],
    interventions: ['Sleep hygiene', 'Relaxation techniques', 'Comfort measures', 'Medication management', 'Environmental modification'],
    outcomes: ['Adequate sleep', 'Feels rested', 'Improved energy'],
  },
  {
    code: '00096',
    name: 'Insomnia',
    class: 'Sleep/Rest',
    domain: 'Activity/Rest',
    related: ['Stress', 'Anxiety', 'Depression', 'Pain', 'Caffeine', 'Environmental factors'],
    defining: ['Difficulty initiating sleep', 'Difficulty maintaining sleep', 'Early morning awakening', 'Non-restorative sleep'],
    interventions: ['Sleep hygiene education', 'Cognitive behavioral therapy', 'Relaxation', 'Medication management'],
    outcomes: ['Improved sleep quality', 'Adequate sleep duration', 'Feeling rested'],
  },
  {
    code: '00198',
    name: 'Sleep Deprivation',
    class: 'Sleep/Rest',
    domain: 'Activity/Rest',
    related: ['Environmental stimuli', 'Caregiving demands', 'Hospitalization', 'Shift work', 'Sleep disorders'],
    defining: ['Chronic sleep loss', 'Daytime fatigue', 'Impaired function', 'Irritability', 'Cognitive changes'],
    interventions: ['Sleep promotion', 'Environment control', 'Rest periods', 'Sleep assessment'],
    outcomes: ['Adequate sleep', 'Improved function', 'Alertness'],
  },
  {
    code: '00254',
    name: 'Readiness for Enhanced Sleep',
    class: 'Sleep/Rest',
    domain: 'Activity/Rest',
    related: ['Expresses desire to improve sleep', 'Healthy sleep patterns'],
    defining: ['Expresses readiness', 'Demonstrates good sleep hygiene', 'Adequate sleep duration'],
    interventions: ['Education', 'Support', 'Resource provision'],
    outcomes: ['Optimal sleep quality', 'Maintained restfulness'],
  },
  {
    code: '00255',
    name: 'Risk for Disuse Syndrome',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Paralysis', 'Severe illness', 'Mechanical restriction', 'Intensive care stay', 'Coma'],
    defining: ['Presence of risk factors', 'No current symptoms'],
    interventions: ['Range of motion', 'Positioning', 'Early mobilization', 'DVT prophylaxis', 'Skin care'],
    outcomes: ['Prevention of complications', 'Maintained function', 'No skin breakdown'],
  },
  {
    code: '00091',
    name: 'Impaired Bed Mobility',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Musculoskeletal impairment', 'Neurological impairment', 'Pain', 'Post-surgical restrictions'],
    defining: ['Inability to move in bed', 'Requires assistance', 'Limited range of motion'],
    interventions: ['Mobility aids', 'Physical therapy', 'Positioning', 'Assistive devices', 'Safety measures'],
    outcomes: ['Improved bed mobility', 'Independence in bed mobility', 'Prevention of complications'],
  },
  {
    code: '00085',
    name: 'Impaired Physical Mobility',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Musculoskeletal impairment', 'Pain', 'Neurological impairment', 'Activity restrictions', 'Deconditioning'],
    defining: ['Inability to move', 'Limited ROM', 'Muscle weakness', 'Requires assistance', 'Gait changes'],
    interventions: ['ROM exercises', 'Assistive devices', 'Physical therapy', 'Positioning', 'Safety measures'],
    outcomes: ['Maintains mobility', 'Achieves maximum independence', 'No complications of immobility'],
  },
  {
    code: '00089',
    name: 'Impaired Wheelchair Mobility',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Lower extremity impairment', 'Neurological deficit', 'Muscle weakness', 'Pain'],
    defining: ['Unable to propel wheelchair', 'Limited mobility', 'Requires assistance'],
    interventions: ['Wheelchair skills training', 'Strengthening exercises', 'Adaptive equipment', 'Energy conservation'],
    outcomes: ['Independent wheelchair mobility', 'Safe mobility', 'Optimal function'],
  },
  {
    code: '00256',
    name: 'Impaired Sitting',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Musculoskeletal impairment', 'Neurological impairment', 'Pain', 'Postural instability'],
    defining: ['Unable to maintain sitting position', 'Requires support', 'Poor balance'],
    interventions: ['Postural support', 'Balance training', 'Seating adaptations', 'Therapy'],
    outcomes: ['Stable sitting', 'Independence in sitting', 'No falls'],
  },
  {
    code: '00257',
    name: 'Impaired Standing',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Lower extremity weakness', 'Balance problems', 'Neurological impairment', 'Pain'],
    defining: ['Unable to stand independently', 'Requires support', 'Unstable'],
    interventions: ['Balance training', 'Strengthening', 'Assistive devices', 'Standing frame if indicated'],
    outcomes: ['Improved standing ability', 'Balance', 'Independence'],
  },
  {
    code: '00070',
    name: 'Impaired Transfer Ability',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Mobility impairment', 'Muscle weakness', 'Balance problems', 'Pain', 'Cognitive impairment'],
    defining: ['Unable to transfer', 'Requires assistance', 'Unsafe transfers'],
    interventions: ['Transfer training', 'Assistive devices', 'Bed positioning', 'Safety education'],
    outcomes: ['Safe transfers', 'Independence in transfer', 'No injury'],
  },
  {
    code: '00088',
    name: 'Impaired Walking',
    class: 'Activity/Exercise',
    domain: 'Activity/Rest',
    related: ['Musculoskeletal impairment', 'Neurological impairment', 'Balance problems', 'Pain', 'Fatigue'],
    defining: ['Difficulty walking', 'Gait abnormalities', 'Requires assistance', 'Falls'],
    interventions: ['Gait training', 'Assistive devices', 'Strengthening', 'Balance exercises', 'Safety measures'],
    outcomes: ['Improved walking', 'Independence', 'No falls'],
  },
  {
    code: '00258',
    name: 'Imbalanced Energy Field',
    class: 'Energy Balance',
    domain: 'Activity/Rest',
    related: ['Illness', 'Stress', 'Pain', 'Depression', 'Medical treatments'],
    defining: ['Verbal report of exhaustion', 'Restlessness', 'Inability to restore energy', 'Fatigue'],
    interventions: ['Energy conservation', 'Rest periods', 'Therapeutic touch', 'Relaxation', 'Support'],
    outcomes: ['Improved energy', 'Restored balance', 'Adequate rest'],
  },
  {
    code: '00113',
    name: 'Fatigue',
    class: 'Energy Balance',
    domain: 'Activity/Rest',
    related: ['Illness', 'Increased physical demands', 'Stress', 'Depression', 'Anemia', 'Chronic pain'],
    defining: ['Overwhelming exhaustion', 'Inability to restore energy', 'Impaired function', 'Reduced concentration'],
    interventions: ['Energy conservation', 'Activity pacing', 'Stress management', 'Treatment of cause', 'Rest promotion'],
    outcomes: ['Improved energy', 'Increased activity tolerance', 'Function restoration'],
  },
  {
    code: '00154',
    name: 'Wandering',
    class: 'Energy Balance',
    domain: 'Activity/Rest',
    related: ['Cognitive impairment', 'Dementia', 'Restlessness', 'Environmental triggers', 'Unmet needs'],
    defining: ['Purposeless wandering', 'Getting lost', 'Roaming behavior', 'Unable to follow routines'],
    interventions: ['Safe environment', 'Supervision', 'Routine establishment', 'Identification bracelet', 'Activity engagement'],
    outcomes: ['Safe wandering', 'Reduced elopement', 'Safety maintained'],
  },
  {
    code: '00033',
    name: 'Activity Intolerance',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Generalized weakness', 'Bed rest', 'Cardiac/pulmonary disease', 'Anemia', 'Deconditioning'],
    defining: ['Verbal report of fatigue', 'Abnormal response to activity', 'Dyspnea', 'Tachycardia'],
    interventions: ['Activity pacing', 'Gradual exercise', 'Energy conservation', 'Oxygen therapy', 'Monitoring'],
    outcomes: ['Improved activity tolerance', 'Increased endurance', 'No adverse symptoms'],
  },
  {
    code: '00034',
    name: 'Risk for Activity Intolerance',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['History of intolerance', 'Cardiac/pulmonary problems', 'Deconditioning', 'Fatigue'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Gradual conditioning', 'Activity planning', 'Monitoring'],
    outcomes: ['Prevention of intolerance', 'Improved tolerance', 'Safe activity'],
  },
  {
    code: '00032',
    name: 'Ineffective Breathing Pattern',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Pain', 'Anxiety', 'Respiratory muscle fatigue', 'Airway obstruction', 'Neurological impairment'],
    defining: ['Dyspnea', 'Tachypnea', 'Bradypnea', 'Hyperventilation', 'Hypoventilation', 'Use of accessory muscles'],
    interventions: ['Breathing exercises', 'Oxygen therapy', 'Positioning', 'Anxiety reduction', 'Airway clearance'],
    outcomes: ['Effective breathing pattern', 'Normal respiratory rate', 'Adequate oxygenation'],
  },
  {
    code: '00029',
    name: 'Decreased Cardiac Output',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Myocardial infarction', 'Heart failure', 'Cardiac arrhythmias', 'Valvular disease', 'Cardiomyopathy'],
    defining: ['Low blood pressure', 'Tachycardia', 'Edema', 'Fatigue', 'Dyspnea', 'Chest pain', 'Decreased urine output'],
    interventions: ['Cardiac monitoring', 'Medication management', 'Fluid management', 'Oxygen therapy', 'Activity restriction'],
    outcomes: ['Adequate cardiac output', 'Stable hemodynamics', 'Improved perfusion'],
  },
  {
    code: '00239',
    name: 'Risk for Decreased Cardiac Output',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Cardiac history', 'Arrhythmias', 'Medication effects', 'Electrolyte imbalances'],
    defining: ['Presence of risk factors'],
    interventions: ['Monitoring', 'Medication management', 'Risk factor modification', 'Education'],
    outcomes: ['Prevention of decreased output', 'Cardiac function preservation'],
  },
  {
    code: '00259',
    name: 'Impaired Spontaneous Ventilation',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Respiratory muscle weakness', 'Neurological impairment', 'Metabolic disorders', 'Mechanical ventilation weaning'],
    defining: ['Insufficient breathing', 'Increased respiratory effort', 'Restlessness', 'Anxiety', 'Use of accessory muscles'],
    interventions: ['Ventilatory support', 'Respiratory therapy', 'Weaning plan', 'Monitoring', 'Energy conservation'],
    outcomes: ['Adequate ventilation', 'Successful weaning', 'Improved oxygenation'],
  },
  {
    code: '00260',
    name: 'Risk for Decreased Cardiac Tissue Perfusion',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Coronary artery disease', 'Hypertension', 'Hyperlipidemia', 'Diabetes', 'Smoking'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Cardiac monitoring', 'Medication compliance', 'Lifestyle modification'],
    outcomes: ['Preserved tissue perfusion', 'Prevention of ischemia'],
  },
  {
    code: '00261',
    name: 'Risk for Ineffective Cerebral Tissue Perfusion',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Hypertension', 'Atherosclerosis', 'Carotid artery disease', 'Cardiac emboli', 'Stroke history'],
    defining: ['Presence of risk factors'],
    interventions: ['Blood pressure management', 'Anticoagulation if indicated', 'Monitoring neurological status', 'Risk factor control'],
    outcomes: ['Adequate cerebral perfusion', 'Prevention of stroke'],
  },
  {
    code: '00204',
    name: 'Ineffective Peripheral Tissue Perfusion',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Peripheral vascular disease', 'Diabetes', 'Smoking', 'Immobility', 'Venous insufficiency'],
    defining: ['Cool skin', 'Diminished pulses', 'Edema', 'Pain', 'Skin changes', 'Hair loss', 'Claudication'],
    interventions: ['Circulation monitoring', 'Positioning', 'Exercise', 'Compression if indicated', 'Wound care'],
    outcomes: ['Improved perfusion', 'Warm extremities', 'Adequate pulses'],
  },
  {
    code: '00205',
    name: 'Dysfunctional Ventilatory Weaning Response',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Prolonged ventilation', 'Respiratory muscle weakness', 'Anxiety', 'Nutritional deficits', 'Infection'],
    defining: ['Respiratory distress during weaning', 'Increased respiratory rate', 'Dyspnea', 'Cyanosis', 'Agitation'],
    interventions: ['Weaning protocol', 'Respiratory therapy', 'Psychological support', 'Nutritional support', 'Patience'],
    outcomes: ['Successful weaning', 'Adequate spontaneous breathing', 'Ventilator independence'],
  },
  {
    code: '00093',
    name: 'Impaired Home Maintenance',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Cognitive impairment', 'Physical limitations', 'Insufficient finances', 'Inadequate support', 'Chronic illness'],
    defining: ['Inability to maintain home', 'Unsanitary conditions', 'Safety hazards', 'Hoarding'],
    interventions: ['Home assessment', 'Resource referral', 'Support services', 'Education', 'Family involvement'],
    outcomes: ['Safe home environment', 'Adequate hygiene', 'Independence in home management'],
  },
  {
    code: '00108',
    name: 'Bathing Self-Care Deficit',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Musculoskeletal impairment', 'Neurological impairment', 'Cognitive impairment', 'Pain', 'Fatigue'],
    defining: ['Inability to bathe', 'Requires assistance', 'Fear of falling'],
    interventions: ['Assistive devices', 'Safe bathing environment', 'Education', 'Occupational therapy', 'Gradual independence'],
    outcomes: ['Improved bathing ability', 'Independence', 'Safety maintained'],
  },
  {
    code: '00109',
    name: 'Dressing Self-Care Deficit',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Upper extremity weakness', 'Cognitive impairment', 'Pain', 'Fatigue', 'Arthritis'],
    defining: ['Inability to dress', 'Requires assistance', 'Time-consuming'],
    interventions: ['Adaptive clothing', 'Energy conservation', 'Occupational therapy', 'Gradual training'],
    outcomes: ['Improved dressing ability', 'Independence', 'Efficient dressing'],
  },
  {
    code: '00110',
    name: 'Feeding Self-Care Deficit',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Upper extremity impairment', 'Cognitive impairment', 'Swallowing difficulty', 'Fatigue'],
    defining: ['Inability to feed self', 'Requires assistance', 'Mealtime difficulties'],
    interventions: ['Adaptive equipment', 'Feeding assistance', 'Swallowing precautions', 'Proper positioning'],
    outcomes: ['Improved feeding ability', 'Adequate nutrition', 'Independence'],
  },
  {
    code: '00111',
    name: 'Toileting Self-Care Deficit',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Mobility impairment', 'Cognitive impairment', 'Urinary/fecal incontinence', 'Bathroom accessibility'],
    defining: ['Inability to toilet', 'Requires assistance', 'Incontinence'],
    interventions: ['Assisted toileting', 'Scheduled voiding', 'Equipment', 'Skin care', 'Incontinence management'],
    outcomes: ['Improved toileting', 'Independence', 'Skin integrity'],
  },
  {
    code: '00182',
    name: 'Readiness for Enhanced Self-Care',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Expresses desire to improve self-care', 'Ability to perform self-care'],
    defining: ['Expresses readiness', 'Demonstrates self-care abilities', 'Independent in ADLs'],
    interventions: ['Support', 'Education', 'Resource provision', 'Goal setting'],
    outcomes: ['Optimal self-care', 'Independence', 'Improved function'],
  },
  {
    code: '00182',
    name: 'Self-Neglect',
    class: 'Self-Care',
    domain: 'Activity/Rest',
    related: ['Cognitive impairment', 'Mental illness', 'Substance abuse', 'Social isolation', 'Poverty'],
    defining: ['Inadequate self-care', 'Poor hygiene', 'Unsafe living conditions', 'Refusal of help'],
    interventions: ['Assessment', 'Case management', 'Support services', 'Mental health referral', 'Safety monitoring'],
    outcomes: ['Improved self-care', 'Safe living conditions', 'Acceptance of help'],
  },
  {
    code: '00173',
    name: 'Unilateral Neglect',
    class: 'Attention',
    domain: 'Perception/Cognition',
    related: ['Neurological impairment', 'Stroke', 'Brain injury', 'Perceptual deficits'],
    defining: ['Inattention to one side', 'Ignoring affected side', 'Safety issues', 'Personal care deficits'],
    interventions: ['Neglect awareness training', 'Safety measures', 'Visual scanning exercises', 'Environmental adaptation'],
    outcomes: ['Increased awareness', 'Safe function', 'Compensation strategies'],
  },
  {
    code: '00128',
    name: 'Acute Confusion',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Infection', 'Medication', 'Metabolic imbalance', 'Surgery', 'Pain', 'Dehydration'],
    defining: ['Disorientation', 'Altered consciousness', 'Restlessness', 'Hallucinations', 'Impaired cognition'],
    interventions: ['Identify cause', 'Reorient', 'Safety measures', 'Sleep promotion', 'Medication review'],
    outcomes: ['Return to baseline', 'Clear thinking', 'Oriented'],
  },
  {
    code: '00173',
    name: 'Risk for Acute Confusion',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Age >65', 'History of confusion', 'Medication', 'Infection', 'Surgery', 'Cognitive impairment'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Prevention strategies', 'Monitoring', 'Orientation'],
    outcomes: ['Prevention of confusion', 'Maintained cognition'],
  },
  {
    code: '00173',
    name: 'Chronic Confusion',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Dementia', 'Alzheimers', 'Vascular dementia', 'Neurological disease', 'Traumatic brain injury'],
    defining: ['Progressive cognitive decline', 'Memory loss', 'Impaired judgment', 'Personality changes'],
    interventions: ['Reality orientation', 'Safety measures', 'Memory aids', 'Caregiver support', 'Behavioral interventions'],
    outcomes: ['Optimal function', 'Safety', 'Quality of life'],
  },
  {
    code: '00251',
    name: 'Labile Emotional Control',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Neurological conditions', 'Traumatic brain injury', 'Stroke', 'Dementia', 'Psychiatric conditions'],
    defining: ['Uncontrolled emotions', 'Rapid mood swings', 'Inappropriate emotional responses', 'Irritability'],
    interventions: ['Emotional regulation training', 'Safety measures', 'Medication management', 'Therapy'],
    outcomes: ['Improved emotional control', 'Stable mood', 'Appropriate responses'],
  },
  {
    code: '00252',
    name: 'Ineffective Impulse Control',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Neurological impairment', 'Psychiatric disorder', 'Substance abuse', 'Frustration', 'Cognitive impairment'],
    defining: ['Impulsive behavior', 'Verbal aggression', 'Physical aggression', 'Inappropriate sexual behavior'],
    interventions: ['Behavior management', 'Safety measures', 'Therapy', 'Medication if needed'],
    outcomes: ['Improved control', 'Safe behavior', 'Appropriate responses'],
  },
  {
    code: '00126',
    name: 'Deficient Knowledge',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Lack of exposure', 'Unfamiliarity with information', 'Cognitive limitation', 'Lack of interest', 'Language barrier'],
    defining: ['Verbalization of problem', 'Incorrect procedures', 'Anxiety', 'Non-compliance', 'Questions'],
    interventions: ['Teaching', 'Written materials', 'Demonstration', 'Teach-back method', 'Audiovisual aids'],
    outcomes: ['Verbalizes understanding', 'Demonstrates proper technique', 'Makes informed decisions'],
  },
  {
    code: '00160',
    name: 'Readiness for Enhanced Knowledge',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Expresses desire to learn', 'Previous knowledge'],
    defining: ['Expresses readiness', 'Asks questions', 'Seeks information'],
    interventions: ['Education', 'Resource provision', 'Support'],
    outcomes: ['Acquires knowledge', 'Demonstrates understanding', 'Informed decisions'],
  },
  {
    code: '00131',
    name: 'Impaired Memory',
    class: 'Cognition',
    domain: 'Perception/Cognition',
    related: ['Neurological impairment', 'Aging', 'Dementia', 'Trauma', 'Infection', 'Substance abuse'],
    defining: ['Inability to recall information', 'Forgetting', 'Difficulty learning', 'Disorientation'],
    interventions: ['Memory aids', 'Reality orientation', 'Routine establishment', 'Safety measures', 'Therapy'],
    outcomes: ['Improved function', 'Compensation strategies', 'Safety'],
  },
  {
    code: '00051',
    name: 'Impaired Verbal Communication',
    class: 'Communication',
    domain: 'Perception/Cognition',
    related: ['Physical barriers', 'Cultural differences', 'Stress', 'Hearing impairment', 'Neurological impairment', 'Intubation'],
    defining: ['Difficulty speaking', 'Unable to form words', 'Inability to understand', 'Frustration', 'Reduced speech'],
    interventions: ['Alternative communication', 'Interpreter services', 'Speech therapy', 'Visual aids', 'Patience'],
    outcomes: ['Effective communication', 'Expresses needs', 'Understands instructions'],
  },
  {
    code: '00156',
    name: 'Readiness for Enhanced Communication',
    class: 'Communication',
    domain: 'Perception/Cognition',
    related: ['Expresses desire to improve communication', 'Ability to communicate'],
    defining: ['Expresses readiness', 'Demonstrates effective communication'],
    interventions: ['Support', 'Education', 'Resource provision'],
    outcomes: ['Effective communication', 'Improved relationships'],
  },
  {
    code: '00124',
    name: 'Hopelessness',
    class: 'Self-Perception',
    domain: 'Psychosocial Integrity',
    related: ['Prolonged illness', 'Loss', 'Social isolation', 'Chronic pain', 'Failed coping'],
    defining: ['Verbal expressions of hopelessness', 'Withdrawal', 'Passivity', 'Decreased affect', 'No motivation'],
    interventions: ['Therapeutic relationship', 'Hope enhancement', 'Goal setting', 'Support', 'Referral'],
    outcomes: ['Expression of hope', 'Increased motivation', 'Active participation'],
  },
  {
    code: '00185',
    name: 'Readiness for Enhanced Hope',
    class: 'Self-Perception',
    domain: 'Psychosocial Integrity',
    related: ['Expresses desire to enhance hope', 'Coping with illness'],
    defining: ['Expresses hope', 'Goal setting', 'Future orientation'],
    interventions: ['Hope-focused interventions', 'Goal setting', 'Support', 'Resource provision'],
    outcomes: ['Enhanced hope', 'Optimism', 'Active engagement'],
  },
  {
    code: '00262',
    name: 'Risk for Compromised Human Dignity',
    class: 'Self-Perception',
    domain: 'Psychosocial Integrity',
    related: ['Stigmatization', 'Loss of control', 'Dependence', 'Exposure', 'Invasion of privacy'],
    defining: ['Presence of risk factors'],
    interventions: ['Respect for privacy', 'Empowerment', 'Involvement in care', 'Dignity-preserving care'],
    outcomes: ['Dignity maintained', 'Respect', 'Control'],
  },
  {
    code: '00221',
    name: 'Disturbed Personal Identity',
    class: 'Self-Perception',
    domain: 'Psychosocial Integrity',
    related: ['Social role changes', 'Illness', 'Trauma', 'Loss', 'Cultural conflict'],
    defining: ['Confusion about self', 'Unclear values', 'Role confusion', 'Identity disturbance'],
    interventions: ['Therapy', 'Identity clarification', 'Role support', 'Cultural competence'],
    outcomes: ['Clear identity', 'Role clarity', 'Self-acceptance'],
  },
  {
    code: '00225',
    name: 'Risk for Disturbed Personal Identity',
    class: 'Self-Perception',
    domain: 'Psychosocial Integrity',
    related: ['Major life changes', 'Loss', 'Chronic illness', 'Trauma', 'Cultural issues'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Support', 'Therapy', 'Crisis intervention'],
    outcomes: ['Identity preserved', 'Coping', 'Adaptation'],
  },
  {
    code: '00227',
    name: 'Readiness for Enhanced Self-Concept',
    class: 'Self-Perception',
    domain: 'Psychosocial Integrity',
    related: ['Expresses desire to improve self-concept', 'Psychological readiness'],
    defining: ['Expresses readiness', 'Positive self-talk', 'Goal setting'],
    interventions: ['Support', 'Therapy', 'Education', 'Empowerment'],
    outcomes: ['Enhanced self-concept', 'Self-acceptance', 'Confidence'],
  },
  {
    code: '00119',
    name: 'Chronic Low Self-Esteem',
    class: 'Self-Esteem',
    domain: 'Psychosocial Integrity',
    related: ['Chronic illness', 'Repeated failures', 'Lack of validation', 'Abuse', 'Depression'],
    defining: ['Negative self-evaluation', 'Self-critical', 'Avoidance', 'Dependent on others', 'Hesitant to try'],
    interventions: ['Therapy', 'Positive reinforcement', 'Skill building', 'Support groups'],
    outcomes: ['Improved self-esteem', 'Positive self-image', 'Increased confidence'],
  },
  {
    code: '00220',
    name: 'Risk for Chronic Low Self-Esteem',
    class: 'Self-Esteem',
    domain: 'Psychosomal Integrity',
    related: ['History of failure', 'Low achievement', 'Lack of support', 'Chronic illness'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Support', 'Achievement opportunities', 'Validation'],
    outcomes: ['Self-esteem preserved', 'Positive self-image'],
  },
  {
    code: '00120',
    name: 'Situational Low Self-Esteem',
    class: 'Self-Esteem',
    domain: 'Psychosocial Integrity',
    related: ['Loss', 'Failure', 'Life changes', 'Illness', 'Relationship issues'],
    defining: ['Negative self-evaluation', 'Self-doubt', 'Withdrawal', 'Decreased motivation'],
    interventions: ['Therapy', 'Support', 'Skill building', 'Reframing', 'Validation'],
    outcomes: ['Restored self-esteem', 'Coping', 'Recovery'],
  },
  {
    code: '00118',
    name: 'Disturbed Body Image',
    class: 'Body Image',
    domain: 'Psychosocial Integrity',
    related: ['Physical changes', 'Amputation', 'Weight change', 'Surgery', 'Illness', 'Burns'],
    defining: ['Negative body image', 'Avoidance', 'Social withdrawal', 'Changed relationships'],
    interventions: ['Therapy', 'Support groups', 'Body image exercises', 'Peer support', 'Reconstruction options'],
    outcomes: ['Acceptance of body', 'Improved self-image', 'Social engagement'],
  },
  {
    code: '00164',
    name: 'Caregiver Role Strain',
    class: 'Caregiving Roles',
    domain: 'Psychosocial Integrity',
    related: ['Chronic illness', 'Disability', '24-hour care', 'Insufficient resources', 'Caregiver burden'],
    defining: ['Verbal strain', 'Fatigue', 'Impaired coping', 'Sleep disturbance', 'Role conflicts'],
    interventions: ['Respite care', 'Support groups', 'Resource referral', 'Education', 'Care planning'],
    outcomes: ['Reduced strain', 'Improved coping', 'Caregiver well-being'],
  },
  {
    code: '00158',
    name: 'Risk for Caregiver Role Strain',
    class: 'Caregiving Roles',
    domain: 'Psychosocial Integrity',
    related: ['High care needs', 'Lengthy illness', 'Insufficient support', 'Caregiver health'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Respite planning', 'Resource provision', 'Support'],
    outcomes: ['Strain prevention', 'Caregiver health', 'Sustainable caregiving'],
  },
  {
    code: '00056',
    name: 'Impaired Parenting',
    class: 'Caregiving Roles',
    domain: 'Psychosocial Integrity',
    related: ['Insufficient resources', 'Single parent', 'Premature infant', 'Special needs child', 'Postpartum depression'],
    defining: ['Inappropriate parenting behaviors', 'Child neglect', 'Poor attachment', 'Lack of nurturing'],
    interventions: ['Parenting education', 'Support services', 'Therapy', 'Resource referral', 'Home visits'],
    outcomes: ['Effective parenting', 'Healthy attachment', 'Child safety'],
  },
  {
    code: '00057',
    name: 'Risk for Impaired Parenting',
    class: 'Caregiving Roles',
    domain: 'Psychosocial Integrity',
    related: ['Young parent', 'Low income', 'History of abuse', 'Premature infant', 'Lack of support'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Education', 'Support', 'Home visits', 'Resource provision'],
    outcomes: ['Healthy parenting', 'Safe environment', 'Child well-being'],
  },
  {
    code: '00159',
    name: 'Readiness for Enhanced Parenting',
    class: 'Caregiving Roles',
    domain: 'Psychosomal Integrity',
    related: ['Expresses desire to improve parenting', 'Parental bonding'],
    defining: ['Expresses readiness', 'Positive interactions', 'Safe environment'],
    interventions: ['Education', 'Support', 'Resources', 'Skill building'],
    outcomes: ['Effective parenting', 'Healthy child development', 'Strong bonding'],
  },
  {
    code: '00210',
    name: 'Risk for Impaired Attachment',
    class: 'Family Relationships',
    domain: 'Psychosocial Integrity',
    related: ['Prematurity', 'Ill infant', 'Maternal depression', 'Separation', 'Unplanned pregnancy'],
    defining: ['Presence of risk factors'],
    interventions: ['Bonding support', 'Skin-to-skin', 'Infant massage', 'Referral', 'Follow-up'],
    outcomes: ['Secure attachment', 'Healthy relationship', 'Infant development'],
  },
  {
    code: '00063',
    name: 'Dysfunctional Family Processes',
    class: 'Family Relationships',
    domain: 'Psychosocial Integrity',
    related: ['Substance abuse', 'Conflict', 'Chronic illness', 'Abuse', 'Communication problems'],
    defining: ['Family conflict', 'Poor communication', 'Substance abuse', 'Role changes', 'Lack of support'],
    interventions: ['Family therapy', 'Communication skills', 'Support services', 'Referral'],
    outcomes: ['Improved family function', 'Healthy communication', 'Conflict resolution'],
  },
  {
    code: '00060',
    name: 'Interrupted Family Processes',
    class: 'Family Relationships',
    domain: 'Psychosocial Integrity',
    related: ['Crisis', 'Illness', 'Hospitalization', 'Loss', 'Role changes', 'Relocation'],
    defining: ['Changes in family function', 'Role confusion', 'Unmet needs', 'Stress'],
    interventions: ['Family support', 'Crisis intervention', 'Communication', 'Resource provision'],
    outcomes: ['Family adaptation', 'Coping', 'Stability'],
  },
  {
    code: '00208',
    name: 'Readiness for Enhanced Family Processes',
    class: 'Family Relationships',
    domain: 'Psychosomal Integrity',
    related: ['Expresses desire to improve family', 'Healthy functioning'],
    defining: ['Expresses readiness', 'Positive communication', 'Healthy roles'],
    interventions: ['Support', 'Education', 'Resource provision'],
    outcomes: ['Enhanced family function', 'Communication', 'Coping'],
  },
  {
    code: '00209',
    name: 'Ineffective Relationship',
    class: 'Role Performance',
    domain: 'Psychosocial Integrity',
    related: ['Communication barriers', 'Trust issues', 'Conflict', 'Lack of intimacy', 'Substance abuse'],
    defining: ['Unsatisfying relationship', 'Poor communication', 'Conflict', 'Isolation'],
    interventions: ['Couples therapy', 'Communication training', 'Referral', 'Support'],
    outcomes: ['Improved relationship', 'Effective communication', 'Intimacy'],
  },
  {
    code: '00223',
    name: 'Risk for Ineffective Relationship',
    class: 'Role Performance',
    domain: 'Psychosocial Integrity',
    related: ['History of failed relationships', 'Lack of social skills', 'Stress', 'Unrealistic expectations'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Skill building', 'Counseling', 'Support'],
    outcomes: ['Healthy relationships', 'Effective communication'],
  },
  {
    code: '00207',
    name: 'Readiness for Enhanced Relationship',
    class: 'Role Performance',
    domain: 'Psychosocial Integrity',
    related: ['Expresses desire to improve relationship', 'Commitment'],
    defining: ['Expresses readiness', 'Willing to work on relationship'],
    interventions: ['Support', 'Counseling', 'Education', 'Resources'],
    outcomes: ['Enhanced relationship', 'Commitment', 'Intimacy'],
  },
  {
    code: '00164',
    name: 'Parental Role Conflict',
    class: 'Role Performance',
    domain: 'Psychosocial Integrity',
    related: ['Hospitalized child', 'Chronic illness', 'Disability', 'Role changes'],
    defining: ['Role confusion', 'Anxiety', 'Inability to meet child needs', 'Guilt'],
    interventions: ['Support', 'Education', 'Family-centered care', 'Resource provision'],
    outcomes: ['Role clarity', 'Reduced conflict', 'Effective parenting'],
  },
  {
    code: '00055',
    name: 'Ineffective Role Performance',
    class: 'Role Performance',
    domain: 'Psychosocial Integrity',
    related: ['Role conflict', 'Role ambiguity', 'Stress', 'Physical health', 'Mental health'],
    defining: ['Role overload', 'Ineffective coping', 'Dissatisfaction', 'Role confusion'],
    interventions: ['Role clarification', 'Stress management', 'Support', 'Resource provision'],
    outcomes: ['Effective role performance', 'Role satisfaction', 'Coping'],
  },
  {
    code: '00052',
    name: 'Impaired Social Interaction',
    class: 'Role Performance',
    domain: 'Psychosocial Integrity',
    related: ['Social skill deficits', 'Anxiety', 'Depression', 'Autism', 'Cognitive impairment'],
    defining: ['Insufficient social engagement', 'Withdrawal', 'Difficulty relating to others'],
    interventions: ['Social skills training', 'Therapy', 'Support groups', 'Structured activities'],
    outcomes: ['Improved interaction', 'Social engagement', 'Relationships'],
  },
  {
    code: '00065',
    name: 'Sexual Dysfunction',
    class: 'Sexual Function',
    domain: 'Psychosocial Integrity',
    related: ['Physical factors', 'Psychological factors', 'Relationship problems', 'Illness', 'Medications'],
    defining: ['Dissatisfaction with sexual function', 'Decreased desire', 'Pain', 'Impotence'],
    interventions: ['Assessment', 'Counseling', 'Medical referral', 'Education', 'Communication skills'],
    outcomes: ['Improved sexual function', 'Satisfaction', 'Intimacy'],
  },
  {
    code: '00065',
    name: 'Ineffective Sexuality Pattern',
    class: 'Sexual Function',
    domain: 'Psychosocial Integrity',
    related: ['Illness', 'Medications', 'Stress', 'Relationship issues', 'Aging'],
    defining: ['Altered sexual behavior', 'Dissatisfaction', 'Impaired function', 'Lack of intimacy'],
    interventions: ['Counseling', 'Education', 'Communication', 'Medical referral'],
    outcomes: ['Effective sexuality', 'Satisfaction', 'Intimacy'],
  },
  {
    code: '00208',
    name: 'Ineffective Childbearing Process',
    class: 'Reproduction',
    domain: 'Psychosocial Integrity',
    related: ['Insufficient prenatal care', 'High-risk pregnancy', 'Complications', 'Lack of support'],
    defining: ['Inadequate prenatal care', 'Complications', 'Poor preparation', 'Unsafe practices'],
    interventions: ['Prenatal education', 'High-risk care', 'Support', 'Monitoring', 'Referral'],
    outcomes: ['Healthy pregnancy', 'Safe delivery', 'Infant health'],
  },
  {
    code: '00221',
    name: 'Risk for Ineffective Childbearing Process',
    class: 'Reproduction',
    domain: 'Psychosocial Integrity',
    related: ['Inadequate prenatal care', 'Teen pregnancy', 'Multiple gestation', 'Medical complications'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Education', 'Monitoring', 'Support', 'Referral'],
    outcomes: ['Effective pregnancy', 'Healthy outcome'],
  },
  {
    code: '00226',
    name: 'Readiness for Enhanced Childbearing Process',
    class: 'Reproduction',
    domain: 'Psychosomal Integrity',
    related: ['Expresses desire for healthy pregnancy', 'Adequate prenatal care'],
    defining: ['Expresses readiness', 'Healthy behaviors', 'Prenatal care'],
    interventions: ['Education', 'Support', 'Resources', 'Prenatal care'],
    outcomes: ['Healthy pregnancy', 'Safe delivery', 'Infant health'],
  },
  {
    code: '00209',
    name: 'Risk for Disturbed Maternal-Fetal Dyad',
    class: 'Reproduction',
    domain: 'Psychosomal Integrity',
    related: ['High-risk pregnancy', 'Maternal complications', 'Fetal complications', 'Substance abuse'],
    defining: ['Presence of risk factors'],
    interventions: ['Monitoring', 'High-risk care', 'Education', 'Support'],
    outcomes: ['Healthy mother and fetus', 'Safe delivery'],
  },
  {
    code: '00237',
    name: 'Risk for Complicated Immigration Transition',
    class: 'Post-Trauma Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Immigration stress', 'Language barriers', 'Cultural adjustment', 'Legal issues', 'Separation from family'],
    defining: ['Presence of risk factors'],
    interventions: ['Cultural support', 'Language services', 'Legal referral', 'Mental health support', 'Community resources'],
    outcomes: ['Successful adaptation', 'Reduced stress', 'Integration'],
  },
  {
    code: '00114',
    name: 'Post-Trauma Syndrome',
    class: 'Post-Trauma Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Traumatic event', 'Abuse', 'Assault', 'War', 'Accident', 'Natural disaster'],
    defining: ['Intrusive memories', 'Nightmares', 'Flashbacks', 'Avoidance', 'Hypervigilance', 'Anxiety'],
    interventions: ['Trauma therapy', 'EMDR', 'Support groups', 'Safety planning', 'Crisis intervention'],
    outcomes: ['Coping', 'Reduced symptoms', 'Recovery'],
  },
  {
    code: '00145',
    name: 'Risk for Post-Trauma Syndrome',
    class: 'Post-Trauma Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Trauma severity', 'Prior trauma', 'Lack of support', 'Proximity to event'],
    defining: ['Presence of risk factors'],
    interventions: ['Early intervention', 'Support', 'Psychoeducation', 'Monitoring'],
    outcomes: ['Prevention', 'Coping', 'Recovery'],
  },
  {
    code: '00115',
    name: 'Rape-Trauma Syndrome',
    class: 'Post-Trauma Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Sexual assault', 'Rape', 'Violent crime'],
    defining: ['Trauma response', 'Fear', 'Shame', 'Anger', 'Sexual dysfunction', 'Flashbacks'],
    interventions: ['Crisis intervention', 'Medical care', 'Forensic exam', 'Therapy', 'Support groups'],
    outcomes: ['Recovery', 'Coping', 'Safety', 'Justice'],
  },
  {
    code: '00114',
    name: 'Relocation Stress Syndrome',
    class: 'Post-Trauma Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Relocation', 'Transfer', 'Nursing home placement', 'Hospitalization', 'Migration'],
    defining: ['Anxiety', 'Withdrawal', 'Altered sleep', 'Loneliness', 'Depression', 'Confusion'],
    interventions: ['Orientation', 'Social support', 'Cultural care', 'Gradual transition', 'Involvement'],
    outcomes: ['Adaptation', 'Reduced stress', 'Coping'],
  },
  {
    code: '00139',
    name: 'Risk for Relocation Stress Syndrome',
    class: 'Post-Trauma Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Move to new environment', 'Loss of support', 'Decreased health status'],
    defining: ['Presence of risk factors'],
    interventions: ['Preparation', 'Support', 'Orientation', 'Involvement', 'Monitoring'],
    outcomes: ['Prevention', 'Successful transition', 'Coping'],
  },
  {
    code: '00284',
    name: 'Ineffective Activity Planning',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Anxiety', 'Fear', 'Perceived overwhelming nature of task', 'Poor organizational skills'],
    defining: ['Difficulty planning activities', 'Procrastination', 'Overwhelm', 'Unmet goals'],
    interventions: ['Activity scheduling', 'Break tasks into steps', 'Goal setting', 'Support', 'Time management'],
    outcomes: ['Effective planning', 'Achieved goals', 'Reduced overwhelm'],
  },
  {
    code: '00285',
    name: 'Risk for Ineffective Activity Planning',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['History of ineffective planning', 'Anxiety', 'Perfectionism', 'Executive dysfunction'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Skill building', 'Support', 'Planning tools'],
    outcomes: ['Effective planning', 'Goal achievement'],
  },
  {
    code: '00146',
    name: 'Anxiety',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Stress', 'Threat', 'Uncertainty', 'Change', 'Financial concerns', 'Health concerns'],
    defining: ['Apprehension', 'Restlessness', 'Tension', 'Increased HR', 'Sweating', 'Difficulty concentrating'],
    interventions: ['Anxiety reduction techniques', 'Therapy', 'Medication if needed', 'Support', 'Problem-solving'],
    outcomes: ['Reduced anxiety', 'Coping', 'Function'],
  },
  {
    code: '00071',
    name: 'Defensive Coping',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Denial', 'Projection', 'Substance use', 'Self-harm'],
    defining: ['Denial of problems', 'Hostility', 'Rationalization', 'Grandiosity'],
    interventions: ['Therapy', 'Confrontation avoidance', 'Support', 'Education'],
    outcomes: ['Adaptive coping', 'Reality testing', 'Insight'],
  },
  {
    code: '00069',
    name: 'Ineffective Coping',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Situational crises', 'Inadequate support system', 'Personal vulnerability', 'Unrealistic perceptions', 'Substance use'],
    defining: ['Verbal inability to cope', 'Destructive behavior', 'Fatigue', 'Insomnia', 'Withdrawal'],
    interventions: ['Crisis intervention', 'Support systems', 'Problem-solving skills', 'Therapy', 'Referral'],
    outcomes: ['Uses adaptive coping', 'Verbalizes ability to cope', 'Demonstrates problem-solving'],
  },
  {
    code: '00075',
    name: 'Readiness for Enhanced Coping',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Expresses desire to improve coping', 'Using effective strategies'],
    defining: ['Expresses readiness', 'Demonstrates coping', 'Problem-solving'],
    interventions: ['Support', 'Education', 'Resource provision', 'Validation'],
    outcomes: ['Enhanced coping', 'Function', 'Well-being'],
  },
  {
    code: '00077',
    name: 'Ineffective Community Coping',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Community crisis', 'Inadequate resources', 'Lack of leadership', 'Social disintegration'],
    defining: ['Community problems', 'Inadequate response', 'Conflict', 'Inequity'],
    interventions: ['Community assessment', 'Resource development', 'Collaboration', 'Advocacy'],
    outcomes: ['Effective community coping', 'Resource mobilization', 'Problem resolution'],
  },
  {
    code: '00074',
    name: 'Readiness for Enhanced Community Coping',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Expresses desire to improve community coping', 'Community resources'],
    defining: ['Expresses readiness', 'Community involvement', 'Resource availability'],
    interventions: ['Support', 'Education', 'Resource provision', 'Collaboration'],
    outcomes: ['Enhanced community coping', 'Resilience', 'Function'],
  },
  {
    code: '00058',
    name: 'Risk for Complicated Grieving',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Sudden death', 'Traumatic loss', 'Unresolved grief', 'Lack of support', 'Ambivalent relationship'],
    defining: ['Presence of risk factors'],
    interventions: ['Grief counseling', 'Support groups', 'Therapy', 'Memory rituals', 'Referral'],
    outcomes: ['Healthy grief', 'Coping', 'Resolution'],
  },
  {
    code: '00137',
    name: 'Chronic Sorrow',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Chronic illness', 'Disability', 'Loss', 'Ongoing grief'],
    defining: ['Persistent sadness', 'Recurring grief', 'Loss', 'Disability'],
    interventions: ['Support', 'Therapy', 'Coping skills', 'Meaning-making', 'Referral'],
    outcomes: ['Coping', 'Adapted grief', 'Quality of life'],
  },
  {
    code: '00177',
    name: 'Stress Overload',
    class: 'Coping Responses',
    domain: 'Coping/Stress Tolerance',
    related: ['Multiple stressors', 'Inadequate coping', 'High demands', 'Lack of resources'],
    defining: ['Overwhelm', 'Fatigue', 'Anxiety', 'Inability to function', 'Burnout'],
    interventions: ['Stress management', 'Resource provision', 'Support', 'Prioritization', 'Referral'],
    outcomes: ['Reduced stress', 'Coping', 'Function'],
  },
  {
    code: '00211',
    name: 'Acute Substance Withdrawal Syndrome',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['Substance cessation', 'Alcohol', 'Opioids', 'Benzodiazepines', 'Stimulants'],
    defining: ['Tremors', 'Anxiety', 'Nausea', 'Sweating', 'Seizures', 'Delirium', 'Autonomic hyperactivity'],
    interventions: ['Withdrawal management', 'Medical monitoring', 'Medication', 'Support', 'Safety'],
    outcomes: ['Safe withdrawal', 'Stabilization', 'Treatment engagement'],
  },
  {
    code: '00210',
    name: 'Risk for Acute Substance Withdrawal Syndrome',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['History of withdrawal', 'High substance use', 'Previous seizures', 'Medical comorbidities'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Prevention', 'Monitoring', 'Medical management', 'Support'],
    outcomes: ['Prevention', 'Safe withdrawal', 'Stabilization'],
  },
  {
    code: '00009',
    name: 'Autonomic Dysreflexia',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['Spinal cord injury T6 or above', 'Bladder distention', 'Bowel impaction', 'Skin irritation'],
    defining: ['Severe hypertension', 'Bradycardia', 'Pounding headache', 'Flushing', 'Sweating above level of injury'],
    interventions: ['Identify and remove triggering stimuli', 'Blood pressure monitoring', 'Emergency care', 'Bladder/bowel management'],
    outcomes: ['Resolution of symptoms', 'Prevention', 'Safety'],
  },
  {
    code: '00010',
    name: 'Risk for Autonomic Dysreflexia',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['Spinal cord injury T6 or above', 'Bladder/bowel management issues'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention education', 'Regular monitoring', 'Trigger avoidance', 'Emergency plan'],
    outcomes: ['Prevention', 'Early detection', 'Safety'],
  },
  {
    code: '00147',
    name: 'Neonatal Abstinence Syndrome',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['Maternal substance use', 'Opioids', 'Prenatal drug exposure', 'Alcohol'],
    defining: ['Irritability', 'Tremors', 'Hypertonia', 'Vomiting', 'Diarrhea', 'Poor feeding', 'Seizures'],
    interventions: ['Assessment scoring', 'Non-pharmacologic care', 'Medication if needed', 'Environmental control', 'Family support'],
    outcomes: ['Symptom control', 'Stable feeding', 'Development'],
  },
  {
    code: '00116',
    name: 'Disorganized Infant Behavior',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['Prematurity', 'Pain', 'Overstimulation', 'Separation', 'Neurological immaturity'],
    defining: ['Irritability', 'Poor self-regulation', 'Disorganized sleep-wake states', 'Feeding difficulties'],
    interventions: ['Developmental care', 'Cluster care', 'Skin-to-skin', 'Positioning', 'Sensory modulation'],
    outcomes: ['Organized behavior', 'Self-regulation', 'Development'],
  },
  {
    code: '00215',
    name: 'Risk for Disorganized Infant Behavior',
    class: 'Neurobehavioral Stress',
    domain: 'Coping/Stress Tolerance',
    related: ['Prematurity', 'Painful procedures', 'Separation', 'NICU environment'],
    defining: ['Presence of risk factors'],
    interventions: ['Developmental support', 'Minimizing stress', 'Family involvement', 'Comfort measures'],
    outcomes: ['Preserved organization', 'Development', 'Bonding'],
  },
  {
    code: '00219',
    name: 'Readiness for Enhanced Spiritual Well-Being',
    class: 'Beliefs',
    domain: 'Life Principles',
    related: ['Expresses desire for spiritual growth', 'Meaningful relationships', 'Life purpose'],
    defining: ['Expresses hope', 'Meaning', 'Purpose', 'Connection'],
    interventions: ['Spiritual support', 'Resources', 'Counseling', 'Connection'],
    outcomes: ['Spiritual well-being', 'Meaning', 'Hope'],
  },
  {
    code: '00183',
    name: 'Readiness for Enhanced Decision-Making',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Expresses desire to make decisions', 'Information availability'],
    defining: ['Expresses readiness', 'Makes decisions', 'Verbalizes choices'],
    interventions: ['Support', 'Information provision', 'Respect for choices', 'Time'],
    outcomes: ['Informed decisions', 'Autonomy', 'Satisfaction'],
  },
  {
    code: '00184',
    name: 'Readiness for Enhanced Power',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Expresses desire for power', 'Coping', 'Self-efficacy'],
    defining: ['Expresses hope', 'Control', 'Coping', 'Self-efficacy'],
    interventions: ['Empowerment', 'Support', 'Education', 'Skill building'],
    outcomes: ['Enhanced power', 'Control', 'Self-efficacy'],
  },
  {
    code: '00247',
    name: 'Impaired Resilience',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Chronic stress', 'Trauma', 'Mental illness', 'Lack of support', 'Chronic illness'],
    defining: ['Ineffective coping', 'Withdrawal', 'Pessimism', 'Difficulty adapting'],
    interventions: ['Therapy', 'Coping skills', 'Support', 'Resource provision'],
    outcomes: ['Resilience', 'Coping', 'Adaptation'],
  },
  {
    code: '00248',
    name: 'Risk for Impaired Resilience',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Stressors', 'Lack of support', 'Chronic illness', 'Prior trauma'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Support', 'Coping skills', 'Resources'],
    outcomes: ['Resilience maintained', 'Coping', 'Adaptation'],
  },
  {
    code: '00249',
    name: 'Readiness for Enhanced Resilience',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Expresses desire to improve resilience', 'Coping skills'],
    defining: ['Expresses readiness', 'Uses coping', 'Support seeking'],
    interventions: ['Support', 'Education', 'Skill building', 'Resources'],
    outcomes: ['Resilience', 'Coping', 'Well-being'],
  },
  {
    code: '00157',
    name: 'Impaired Religiosity',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Illness', 'Loss', 'Hospitalization', 'Barriers to practice', 'Depression'],
    defining: ['Difficulty practicing religion', 'Distress', 'Withdrawal', 'Questions beliefs'],
    interventions: ['Spiritual support', 'Chapel services', 'Counseling', 'Resources'],
    outcomes: ['Resumed practice', 'Comfort', 'Spiritual well-being'],
  },
  {
    code: '00170',
    name: 'Risk for Impaired Religiosity',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Hospitalization', 'Chronic illness', 'Loss', 'Lack of support'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Spiritual support', 'Resources', 'Referral'],
    outcomes: ['Religiosity maintained', 'Spiritual well-being'],
  },
  {
    code: '00166',
    name: 'Spiritual Distress',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Illness', 'Loss', 'Meaninglessness', 'Alienation', 'Challenging beliefs'],
    defining: ['Questions meaning', 'Loss of hope', 'Anger', 'Withdrawal', 'No peace'],
    interventions: ['Spiritual care', 'Therapy', 'Chaplain referral', 'Meaning-making', 'Support'],
    outcomes: ['Spiritual comfort', 'Meaning', 'Peace'],
  },
  {
    code: '00167',
    name: 'Risk for Spiritual Distress',
    class: 'Value/Belief/Action Congruence',
    domain: 'Life Principles',
    related: ['Illness', 'Loss', 'Life changes', 'Lack of support'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Spiritual support', 'Monitoring', 'Resources'],
    outcomes: ['Spiritual well-being', 'Coping', 'Meaning'],
  },
  {
    code: '00004',
    name: 'Risk for Infection',
    class: 'Infection',
    domain: 'Safety/Protection',
    related: ['Invasive procedures', 'Compromised immunity', 'Malnutrition', 'Inadequate hand hygiene', 'Chronic illness'],
    defining: ['Fever', 'Elevated WBC', 'Chills', 'Redness/swelling', 'Purulent drainage'],
    interventions: ['Hand hygiene', 'Aseptic technique', 'Wound care', 'Monitoring vital signs', 'Isolation precautions'],
    outcomes: ['Free from infection', 'Normal WBC', 'Afebrile'],
  },
  {
    code: '00204',
    name: 'Risk for Surgical Site Infection',
    class: 'Infection',
    domain: 'Safety/Protection',
    related: ['Surgical procedure', 'Obesity', 'Diabetes', 'Immunosuppression', 'Contamination'],
    defining: ['Presence of risk factors'],
    interventions: ['Aseptic technique', 'Wound care', 'Antibiotic prophylaxis', 'Monitoring', 'Patient education'],
    outcomes: ['No infection', 'Wound healing', 'No complications'],
  },
  {
    code: '00155',
    name: 'Risk for Falls',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['History of falls', 'Impaired mobility', 'Visual deficits', 'Medications', 'Environmental hazards', 'Age >65'],
    defining: ['History of falls', 'Gait instability', 'Use of assistive devices', 'Balance problems'],
    interventions: ['Fall risk assessment', 'Bed alarms', 'Non-slip footwear', 'Side rails', 'Adequate lighting', 'Environmental modification'],
    outcomes: ['Remain free from falls', 'Maintains safe environment', 'Independence'],
  },
  {
    code: '00039',
    name: 'Risk for Aspiration',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Reduced consciousness', 'Enteral feeding', 'Vomiting', 'Swallowing difficulties', 'Neurological impairment'],
    defining: ['Difficulty swallowing', 'Coughing while eating', 'Gurgling voice', 'Drooling'],
    interventions: ['Head elevation', 'Suctioning available', 'Swallowing assessment', 'Small frequent meals', 'Feeding supervision'],
    outcomes: ['No aspiration', 'Clear airway', 'Adequate nutrition'],
  },
  {
    code: '00206',
    name: 'Risk for Bleeding',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Anticoagulant therapy', 'Coagulopathy', 'Trauma', 'Surgery', 'GI bleeding'],
    defining: ['Presence of risk factors'],
    interventions: ['Monitoring', 'Bleeding precautions', 'Medication management', 'Safety measures'],
    outcomes: ['No bleeding', 'Stable hemoglobin', 'Safety'],
  },
  {
    code: '00247',
    name: 'Risk for Dry Mouth',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Mouth breathing', 'Dehydration', 'Medications', 'Radiation', 'Sjogrens syndrome'],
    defining: ['Presence of risk factors'],
    interventions: ['Oral care', 'Hydration', 'Saliva substitutes', 'Humidification'],
    outcomes: ['Moist oral mucosa', 'Comfort', 'No complications'],
  },
  {
    code: '00219',
    name: 'Risk for Dry Eye',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Aging', 'Contact lens use', 'Medications', 'Autoimmune conditions', 'Environmental factors'],
    defining: ['Presence of risk factors'],
    interventions: ['Eye lubrication', 'Humidification', 'Eye protection', 'Education'],
    outcomes: ['Eye comfort', 'No damage', 'Moisture'],
  },
  {
    code: '00086',
    name: 'Risk for Peripheral Neurovascular Dysfunction',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Fractures', 'Cast application', 'Compartment syndrome', 'Trauma', 'Immobilization'],
    defining: ['Presence of risk factors', 'Pain', 'Pallor', 'Pulselessness', 'Paresthesia', 'Paralysis'],
    interventions: ['Circulation monitoring', 'Neurovascular checks', 'Positioning', 'Cast care', 'Emergency intervention'],
    outcomes: ['Preserved circulation', 'No neurovascular compromise', 'Function'],
  },
  {
    code: '00087',
    name: 'Risk for Pressure Ulcer',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Immobility', 'Incontinence', 'Poor nutrition', 'Decreased sensation', 'Advanced age'],
    defining: ['Presence of risk factors', 'Skin changes'],
    interventions: ['Skin assessment', 'Repositioning', 'Support surfaces', 'Nutrition', 'Incontinence care'],
    outcomes: ['Intact skin', 'No breakdown', 'Pressure relief'],
  },
  {
    code: '00044',
    name: 'Impaired Tissue Integrity',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Pressure', 'Shear', 'Friction', 'Moisture', 'Nutritional deficits', 'Circulatory impairment'],
    defining: ['Skin breakdown', 'Wound', 'Pressure injury', 'Altered skin'],
    interventions: ['Wound care', 'Pressure relief', 'Nutrition', 'Moisture management', 'Infection prevention'],
    outcomes: ['Wound healing', 'Tissue integrity', 'No infection'],
  },
  {
    code: '00045',
    name: 'Impaired Skin Integrity',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Pressure', 'Moisture', 'Incontinence', 'Immobility', 'Nutritional deficits'],
    defining: ['Skin breakdown', 'Pressure injury', 'Alteration in skin', 'Wound'],
    interventions: ['Skin care', 'Pressure relief', 'Nutrition', 'Moisture management', 'Wound care'],
    outcomes: ['Skin healing', 'Intact skin', 'Prevention'],
  },
  {
    code: '00216',
    name: 'Risk for Impaired Skin Integrity',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Immobility', 'Incontinence', 'Poor nutrition', 'Decreased sensation'],
    defining: ['Presence of risk factors'],
    interventions: ['Prevention', 'Skin assessment', 'Repositioning', 'Support surfaces'],
    outcomes: ['Skin integrity', 'No breakdown'],
  },
  {
    code: '00156',
    name: 'Risk for Sudden Infant Death',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Prematurity', 'Low birth weight', 'Prone sleeping', 'Soft bedding', 'Maternal smoking', 'Bed sharing'],
    defining: ['Presence of risk factors'],
    interventions: ['Safe sleep education', 'Back to sleep', 'Firm mattress', 'Room sharing', 'Avoid overheating'],
    outcomes: ['Prevention of SIDS', 'Safe sleep'],
  },
  {
    code: '00217',
    name: 'Risk for Suffocation',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Airway obstruction', 'Inability to swallow', 'Seizures', 'Drowning', 'Smoke inhalation'],
    defining: ['Presence of risk factors'],
    interventions: ['Safety measures', 'Monitoring', 'Airway management', 'Education'],
    outcomes: ['Airway patency', 'Safety', 'No suffocation'],
  },
  {
    code: '00218',
    name: 'Delayed Surgical Recovery',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Complications', 'Infection', 'Poor nutrition', 'Age', 'Chronic illness', 'Obesity'],
    defining: ['Extended recovery', 'Complications', 'Prolonged wound healing', 'Delayed discharge'],
    interventions: ['Complication monitoring', 'Wound care', 'Nutrition', 'Early mobilization', 'Discharge planning'],
    outcomes: ['Uncomplicated recovery', 'Timely discharge', 'Wound healing'],
  },
  {
    code: '00220',
    name: 'Risk for Delayed Surgical Recovery',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Age', 'Obesity', 'Diabetes', 'Malnutrition', 'Immunosuppression'],
    defining: ['Presence of risk factors'],
    interventions: ['Risk assessment', 'Preoperative optimization', 'Monitoring', 'Prevention'],
    outcomes: ['Uncomplicated recovery', 'Timely healing'],
  },
  {
    code: '00213',
    name: 'Risk for Venous Thromboembolism',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Immobility', 'Surgery', 'Trauma', 'Cancer', 'Obesity', 'Oral contraceptives', 'Venous stasis'],
    defining: ['Presence of risk factors'],
    interventions: ['DVT prophylaxis', 'Early mobilization', 'Compression devices', 'Anticoagulation', 'Monitoring'],
    outcomes: ['No DVT', 'No pulmonary embolism', 'Safe circulation'],
  },
  {
    code: '00132',
    name: 'Acute Pain',
    class: 'Comfort',
    domain: 'Health Promotion',
    related: ['Disease process', 'Invasive procedures', 'Injury', 'Physical agents', 'Surgery'],
    defining: ['Verbal report', 'Guarding behavior', 'Changes in appetite', 'Facial grimacing', 'Restlessness', 'Crying', 'Pupil dilation'],
    interventions: ['Pain assessment', 'Medication administration', 'Comfort measures', 'Positioning', 'Relaxation techniques'],
    outcomes: ['Pain level decreased', 'Demonstrates comfort', 'Uses effective coping'],
  },
  {
    code: '00133',
    name: 'Chronic Pain',
    class: 'Comfort',
    domain: 'Health Promotion',
    related: ['Chronic disability', 'Psychological factors', 'Chronic disease', 'Nerve damage'],
    defining: ['Verbal report', 'Guarding', 'Changes in appetite/sleep', 'Depression', 'Social withdrawal'],
    interventions: ['Pain management', 'Alternative therapies', 'Support groups', 'Activity modification', 'Multidisciplinary care'],
    outcomes: ['Reports acceptable pain level', 'Uses non-pharmacological methods', 'Maintains quality of life'],
  },
  {
    code: '00134',
    name: 'Nausea',
    class: 'Comfort',
    domain: 'Health Promotion',
    related: ['Chemotherapy', 'Anesthesia', 'GI irritation', 'Motion sickness', 'Pregnancy', 'Anxiety'],
    defining: ['Unpleasant sensation', 'Dry heaving', 'Excess saliva', 'Avoidance of food'],
    interventions: ['Antiemetics', 'Diet modification', 'Small frequent meals', 'Relaxation', 'Positioning'],
    outcomes: ['Nausea relief', 'Adequate nutrition', 'Comfort'],
  },
  {
    code: '00232',
    name: 'Risk for Metabolic Imbalance Syndrome',
    class: 'Metabolism',
    domain: 'Nutrition',
    related: ['Obesity', 'Insulin resistance', 'Dyslipidemia', 'Hypertension', 'Sedentary lifestyle'],
    defining: ['Metabolic syndrome criteria', 'Abdominal obesity', 'Insulin resistance'],
    interventions: ['Metabolic monitoring', 'Weight management', 'Diet', 'Exercise', 'Medical management'],
    outcomes: ['Prevention of syndrome', 'Improved metabolic health'],
  },
  {
    code: '00195',
    name: 'Risk for Elective Surgical Procedure',
    class: 'Infection',
    domain: 'Safety/Protection',
    related: ['Previous surgical site infection', 'Obesity', 'Diabetes', 'Immunosuppression'],
    defining: ['Presence of risk factors'],
    interventions: ['Preoperative optimization', 'Antibiotic prophylaxis', 'Skin preparation', 'Monitoring'],
    outcomes: ['No infection', 'Uncomplicated surgery'],
  },
  {
    code: '00233',
    name: 'Risk for Ineffective Thermoregulation',
    class: 'Physical Injury',
    domain: 'Safety/Protection',
    related: ['Prematurity', 'Extreme age', 'Neurological impairment', 'Medications', 'Exposure'],
    defining: ['Presence of risk factors', 'Temperature instability'],
    interventions: ['Temperature monitoring', 'Environmental control', 'Warming/cooling measures', 'Education'],
    outcomes: ['Normal temperature', 'Thermoregulation'],
  },
  {
    code: '00234',
    name: 'Risk for Occupational Injury',
    class: 'Environmental Hazards',
    domain: 'Safety/Protection',
    related: ['Hazardous workplace', 'Inadequate training', 'Lack of PPE', 'Fatigue', 'Substance use'],
    defining: ['Presence of risk factors'],
    interventions: ['Safety training', 'PPE provision', 'Risk assessment', 'Engineering controls'],
    outcomes: ['Prevention', 'Safety', 'No injury'],
  },
  {
    code: '00235',
    name: 'Risk for Unstable Blood Pressure',
    class: 'Cardiovascular/Pulmonary Responses',
    domain: 'Activity/Rest',
    related: ['Medication noncompliance', 'Heart failure', 'Kidney disease', 'Endocrine disorders', 'Autonomic dysfunction'],
    defining: ['History of BP instability', 'Risk factors'],
    interventions: ['BP monitoring', 'Medication management', 'Lifestyle modification', 'Education'],
    outcomes: ['Stable BP', 'Prevention of complications'],
  },
  {
    code: '00221',
    name: 'Imbalanced Energy Field',
    class: 'Energy Balance',
    domain: 'Activity/Rest',
    related: ['Illness', 'Stress', 'Pain', 'Medical treatments', 'Depression'],
    defining: ['Verbal report of exhaustion', 'Restlessness', 'Inability to restore energy'],
    interventions: ['Energy conservation', 'Rest periods', 'Therapeutic touch', 'Relaxation', 'Support'],
    outcomes: ['Improved energy', 'Restored balance', 'Adequate rest'],
  },
];

const symptomCategories = [
  { name: 'Pain & Comfort', symptoms: ['Acute pain', 'Chronic pain', 'Nausea', 'Fatigue', 'Dyspnea', 'Chest pain'] },
  { name: 'Respiratory', symptoms: ['Dyspnea', 'Cough', 'Wheezing', 'Cyanosis', 'Shortness of breath', 'Orthopnea'] },
  { name: 'Cardiovascular', symptoms: ['Chest pain', 'Edema', 'Palpitations', 'Syncope', 'Hypotension', 'Hypertension'] },
  { name: 'Neurological', symptoms: ['Confusion', 'Headache', 'Numbness', 'Seizures', 'Memory loss', 'Vertigo'] },
  { name: 'Gastrointestinal', symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Bloating'] },
  { name: 'Mental Health', symptoms: ['Anxiety', 'Depression', 'Insomnia', 'Withdrawal', 'Hopelessness', 'Fear'] },
  { name: 'Mobility', symptoms: ['Weakness', 'Paralysis', 'Balance problems', 'Joint stiffness', 'Gait changes', 'Fatigue'] },
  { name: 'Safety', symptoms: ['Fall risk', 'Infection risk', 'Skin breakdown', 'Aspiration risk', 'Bleeding risk', 'DVT risk'] },
  { name: 'Urinary', symptoms: ['Incontinence', 'Dysuria', 'Frequency', 'Urgency', 'Retention', 'Hematuria'] },
  { name: 'Nutrition', symptoms: ['Weight loss', 'Poor appetite', 'Difficulty swallowing', 'Nausea', 'Dehydration', 'Malnutrition'] },
  { name: 'Sleep/Rest', symptoms: ['Insomnia', 'Sleep deprivation', 'Fatigue', 'Daytime sleepiness', 'Restlessness', 'Nightmares'] },
  { name: 'Self-Care', symptoms: ['Bathing difficulty', 'Dressing difficulty', 'Feeding difficulty', 'Toileting difficulty', 'Home maintenance'] },
  { name: 'Communication', symptoms: ['Speech difficulty', 'Understanding difficulty', 'Frustration', 'Non-verbal cues'] },
  { name: 'Cognition', symptoms: ['Confusion', 'Memory impairment', 'Poor concentration', 'Disorientation', 'Difficulty decision-making'] },
  { name: 'Relationships', symptoms: ['Social isolation', 'Role changes', 'Family conflict', 'Caregiver strain', 'Relationship issues'] },
  { name: 'Spiritual', symptoms: ['Spiritual distress', 'Loss of hope', 'Meaninglessness', 'Loss of purpose', 'Questioning beliefs'] },
];

export default function ClinicalDiagnosisPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [patientSymptoms, setPatientSymptoms] = useState<string[]>([]);
  const [showAIPrediction, setShowAIPrediction] = useState(false);
  const [showCarePlan, setShowCarePlan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCarePlan, setEditedCarePlan] = useState<any>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Pain & Comfort']);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const classes = Array.from(new Set(nandaDiagnoses.map(d => d.class)));

  const downloadCarePlan = (format: 'txt' | 'json' | 'html') => {
    if (!carePlan && !editedCarePlan) return;
    
    const plan = editedCarePlan || carePlan;
    const patientName = 'Patient';
    const date = new Date().toLocaleDateString();
    
    let content = '';
    let mimeType = '';
    let filename = '';

    if (format === 'txt') {
      content = `
==============================================
       NURSING CARE PLAN
       ${date}
==============================================

NURSING DIAGNOSIS (PES Format)
${plan.diagnosis.statement}
NANDA-I Code: ${plan.diagnosis.code}

==============================================
ASSESSMENT DATA
==============================================
${plan.assessment.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}

==============================================
GOALS & OUTCOMES
==============================================
SHORT-TERM GOALS:
${plan.goals.shortTerm.map((goal: string, i: number) => `${i + 1}. ${goal}`).join('\n')}

LONG-TERM GOALS:
${plan.goals.longTerm.map((goal: string, i: number) => `${i + 1}. ${goal}`).join('\n')}

==============================================
NURSING INTERVENTIONS WITH RATIONALES
==============================================
${plan.interventions.map((item: any, i: number) => `
${i + 1}. ${item.intervention}
   Rationale: ${item.rationale}
`).join('\n')}

==============================================
EVALUATION
==============================================
${plan.evaluation.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}

==============================================
Generated by NurseSphere AI Care Planner
==============================================
      `.trim();
      mimeType = 'text/plain';
      filename = `care-plan-${patientName.replace(/\s+/g, '-').toLowerCase()}-${date.replace(/\//g, '-')}.txt`;
    } else if (format === 'json') {
      content = JSON.stringify(plan, null, 2);
      mimeType = 'application/json';
      filename = `care-plan-${patientName.replace(/\s+/g, '-').toLowerCase()}-${date.replace(/\//g, '-')}.json`;
    } else if (format === 'html') {
      content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nursing Care Plan</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #34495e; margin-top: 25px; }
    .diagnosis { background: #e8f4f8; padding: 15px; border-left: 4px solid #3498db; margin: 15px 0; }
    .code { color: #27ae60; font-weight: bold; }
    .section { margin: 20px 0; }
    .intervention { background: #f8f9fa; padding: 12px; margin: 10px 0; border-radius: 5px; }
    .rationale { color: #7f8c8d; font-style: italic; margin-left: 15px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #95a5a6; font-size: 12px; text-align: center; }
    ul { margin: 10px 0; }
    li { margin: 8px 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Nursing Care Plan</h1>
    <p><strong>Date:</strong> ${date}</p>
    
    <h2>📝 Nursing Diagnosis (PES Format)</h2>
    <div class="diagnosis">
      <p>${plan.diagnosis.statement}</p>
      <p class="code">NANDA-I Code: ${plan.diagnosis.code}</p>
    </div>
    
    <h2>🔍 Assessment Data</h2>
    <ul>
      ${plan.assessment.map((item: string) => `<li>${item}</li>`).join('')}
    </ul>
    
    <h2>🎯 Goals & Outcomes</h2>
    <div class="section">
      <h3>Short-Term Goals:</h3>
      <ul>
        ${plan.goals.shortTerm.map((goal: string) => `<li>${goal}</li>`).join('')}
      </ul>
    </div>
    <div class="section">
      <h3>Long-Term Goals:</h3>
      <ul>
        ${plan.goals.longTerm.map((goal: string) => `<li>${goal}</li>`).join('')}
      </ul>
    </div>
    
    <h2>💊 Nursing Interventions with Rationales</h2>
    ${plan.interventions.map((item: any, i: number) => `
      <div class="intervention">
        <strong>${i + 1}. ${item.intervention}</strong>
        <p class="rationale">Rationale: ${item.rationale}</p>
      </div>
    `).join('')}
    
    <h2>📊 Evaluation</h2>
    <ul>
      ${plan.evaluation.map((item: string) => `<li>${item}</li>`).join('')}
    </ul>
    
    <div class="footer">
      Generated by NurseSphere AI Care Planner | ${date}
    </div>
  </div>
</body>
</html>
      `.trim();
      mimeType = 'text/html';
      filename = `care-plan-${patientName.replace(/\s+/g, '-').toLowerCase()}-${date.replace(/\//g, '-')}.html`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!carePlan && !editedCarePlan) return;
    const plan = editedCarePlan || carePlan;
    const text = `
NURSING CARE PLAN

NURSING DIAGNOSIS (PES Format)
${plan.diagnosis.statement}
NANDA-I Code: ${plan.diagnosis.code}

ASSESSMENT DATA
${plan.assessment.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}

SHORT-TERM GOALS:
${plan.goals.shortTerm.map((goal: string, i: number) => `${i + 1}. ${goal}`).join('\n')}

LONG-TERM GOALS:
${plan.goals.longTerm.map((goal: string, i: number) => `${i + 1}. ${goal}`).join('\n')}

NURSING INTERVENTIONS WITH RATIONALES:
${plan.interventions.map((item: any, i: number) => `${i + 1}. ${item.intervention}\n   Rationale: ${item.rationale}`).join('\n\n')}

EVALUATION:
${plan.evaluation.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Care plan copied to clipboard!');
    });
  };

  const filteredDiagnoses = nandaDiagnoses.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.code.includes(searchTerm);
    const matchesClass = !selectedClass || d.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const toggleSymptom = (symptom: string) => {
    setPatientSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getAIPredictions = () => {
    if (patientSymptoms.length === 0) return [];
    
    const predictions = nandaDiagnoses.map(diagnosis => {
      let score = 0;
      const diagnosisText = `${diagnosis.name} ${diagnosis.defining.join(' ')} ${diagnosis.related.join(' ')}`.toLowerCase();
      
      patientSymptoms.forEach(symptom => {
        if (diagnosisText.includes(symptom.toLowerCase())) {
          score += 20;
        }
      });
      
      return { diagnosis, score };
    });
    
    return predictions
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const generateCarePlan = (diagnosis: Diagnosis) => {
    const rationales: Record<string, string[]> = {
      default: [
        'To assess patient condition and response to interventions',
        'To provide evidence-based care aligned with patient needs',
        'To promote optimal patient outcomes through individualized care',
      ],
      'Acute Pain': [
        'Pain is subjective and requires regular assessment for effective management',
        'Pharmacological intervention directly addresses pain pathophysiology',
        'Non-pharmacological methods complement medication for comprehensive pain relief',
        'Proper positioning reduces pressure and discomfort',
        'Relaxation techniques help reduce pain perception and anxiety',
      ],
      'Ineffective Airway Clearance': [
        'Maintaining airway patency is the highest priority in respiratory management',
        'Suctioning removes secretions that obstruct the airway',
        'Oxygen therapy improves oxygenation and reduces work of breathing',
        'Positioning affects lung expansion and secretion clearance',
      ],
      'Deficient Knowledge': [
        'Education empowers patient to participate in their care',
        'Understanding promotes compliance and self-management',
        'Written materials reinforce verbal teaching',
      ],
      'Risk for Falls': [
        'Prevention is key to avoiding fall-related injuries',
        'Environmental modifications reduce fall risk',
        'Monitoring allows for early intervention',
      ],
      'Risk for Infection': [
        'Hand hygiene is the primary method of infection prevention',
        'Aseptic technique prevents pathogen transmission',
        'Early detection allows for prompt treatment',
      ],
      'Impaired Physical Mobility': [
        'ROM exercises prevent contractures and maintain function',
        'Proper positioning prevents complications of immobility',
        'Assistive devices promote independence and safety',
      ],
    };

    const getRationales = (name: string) => {
      for (const key of Object.keys(rationales)) {
        if (name.includes(key)) return rationales[key];
      }
      return rationales.default;
    };

    const shortTermGoals = [
      `Patient will demonstrate understanding of ${diagnosis.name.toLowerCase()} by [timeframe]`,
      `Patient will show improvement in [specific symptom] within [timeframe]`,
    ];

    const longTermGoals = [
      `Patient will achieve optimal function and independence related to ${diagnosis.name.toLowerCase()} by discharge`,
      `Patient will demonstrate effective self-management strategies by discharge`,
    ];

    return {
      assessment: [
        'Collect subjective and objective data related to the diagnosis',
        'Identify defining characteristics present in the patient',
        'Review related factors that may be contributing',
        'Assess patient\'s current knowledge and abilities',
        'Evaluate support systems and resources available',
      ],
      diagnosis: {
        statement: `${diagnosis.name} related to ${diagnosis.related[0].toLowerCase()} as evidenced by ${diagnosis.defining.slice(0, 2).join(', ').toLowerCase()}`,
        code: diagnosis.code,
      },
      goals: {
        shortTerm: shortTermGoals,
        longTerm: longTermGoals,
      },
      interventions: diagnosis.interventions.map((int, i) => ({
        intervention: int,
        rationale: getRationales(diagnosis.name)[i] || getRationales(diagnosis.name)[0],
      })),
      evaluation: [
        'Assess patient response to interventions',
        'Evaluate goal achievement',
        'Modify plan as needed based on evaluation',
        'Document outcomes and plan modifications',
      ],
    };
  };

  const aiPredictions = getAIPredictions();
  const carePlan = selectedDiagnosis ? generateCarePlan(selectedDiagnosis) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-150px)]">
      {/* Left Panel - AI Prediction */}
      <div className="w-full lg:w-[340px] shrink-0">
        <Card className="bg-gradient-to-br from-indigo-500/[0.15] to-purple-600/[0.15] border-indigo-500/20 lg:sticky lg:top-[100px]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[14px] flex items-center justify-center text-2xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-foreground font-semibold text-lg m-0">AI Clinical Assistant</h3>
                <p className="text-muted-foreground text-xs m-0">NANDA-I Powered</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-5">
              Select patient symptoms for AI-powered diagnosis suggestions:
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {patientSymptoms.map(symptom => (
                <Badge
                  key={symptom}
                  variant="default"
                  className="cursor-pointer bg-indigo-500/30 border border-indigo-500 text-foreground"
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>

            {symptomCategories.map(category => {
              const isExpanded = expandedCategories.includes(category.name);
              return (
                <div key={category.name} className="mb-2">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between text-indigo-300 text-xs font-semibold uppercase tracking-wider py-2 px-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {category.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 pt-1 pb-2">
                          {category.symptoms.map(symptom => (
                            <button
                              key={symptom}
                              onClick={() => toggleSymptom(symptom)}
                              disabled={patientSymptoms.includes(symptom)}
                              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                patientSymptoms.includes(symptom)
                                  ? 'bg-indigo-500/30 border-indigo-500 text-foreground'
                                  : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                              {symptom}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {patientSymptoms.length > 0 && (
              <Button
                className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold"
                onClick={() => setShowAIPrediction(!showAIPrediction)}
              >
                <Sparkles className="w-4 h-4" />
                Get AI Predictions
              </Button>
            )}

            <AnimatePresence>
              {showAIPrediction && aiPredictions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 overflow-hidden"
                >
                  <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" /> Top Predictions
                  </h4>
                  {aiPredictions.map((pred) => (
                    <div
                      key={pred.diagnosis.code}
                      onClick={() => setSelectedDiagnosis(pred.diagnosis)}
                      className="p-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-2.5 cursor-pointer hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-foreground font-semibold text-sm">{pred.diagnosis.name}</span>
                        <span className="text-green-500 font-semibold text-sm">{pred.score}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded"
                          style={{ width: `${pred.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-semibold text-sm">Clinical Disclaimer</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed m-0">
                This AI assistant is for educational purposes only. Always follow clinical guidelines, hospital protocols, and consult with healthcare professionals for actual patient care decisions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Panel - Diagnosis List */}
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            NANDA-I <span className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Clinical Diagnosis</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Search and explore nursing diagnoses with related factors, defining characteristics, and interventions
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by diagnosis name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-muted/30 border-border text-foreground text-base"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-12 px-5 bg-muted/30 border border-border rounded-xl text-foreground text-base outline-none cursor-pointer"
          >
            <option value="">All Classes</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Diagnosis Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDiagnoses.map(diagnosis => (
            <motion.div
              key={diagnosis.code}
              onClick={() => setSelectedDiagnosis(diagnosis)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.2)] ${
                selectedDiagnosis?.code === diagnosis.code
                  ? 'bg-indigo-500/15 border-indigo-500'
                  : 'bg-card border-border hover:border-indigo-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                  {diagnosis.code}
                </Badge>
                <span className="text-muted-foreground/70 text-xs">{diagnosis.class}</span>
              </div>
              <h3 className="font-heading text-foreground font-semibold text-base mb-2">
                {diagnosis.name}
              </h3>
              <p className="text-muted-foreground text-sm m-0">
                {diagnosis.domain}
              </p>
            </motion.div>
          ))}
        </div>

        {filteredDiagnoses.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No diagnoses found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Right Panel - Detail View */}
      <AnimatePresence>
        {selectedDiagnosis && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-[380px] shrink-0"
          >
            <Card className="lg:sticky lg:top-[100px]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <Badge className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                      {selectedDiagnosis.code}
                    </Badge>
                    <h3 className="font-heading text-foreground font-bold text-xl mt-3 mb-1">
                      {selectedDiagnosis.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Class: {selectedDiagnosis.class} &bull; {selectedDiagnosis.domain}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDiagnosis(null)}
                    className="text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="mb-5">
                  <h4 className="text-red-300 text-xs font-semibold mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> Related Factors
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiagnosis.related.map((factor, i) => (
                      <Badge key={i} variant="outline" className="bg-red-300/10 border-red-300/20 text-red-300">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-indigo-300 text-xs font-semibold mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3 h-3" /> Defining Characteristics
                  </h4>
                  <ul className="pl-5 m-0 space-y-2">
                    {selectedDiagnosis.defining.map((char, i) => (
                      <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-5">
                  <h4 className="text-green-300 text-xs font-semibold mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-3 h-3" /> Nursing Interventions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiagnosis.interventions.map((int, i) => (
                      <Badge key={i} variant="outline" className="bg-green-300/10 border-green-300/20 text-green-300">
                        {int}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-amber-300 text-xs font-semibold mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> Expected Outcomes
                  </h4>
                  <ul className="pl-5 m-0 space-y-2">
                    {selectedDiagnosis.outcomes.map((outcome, i) => (
                      <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-semibold mt-3"
                  onClick={() => setShowCarePlan(true)}
                >
                  <ClipboardList className="w-4 h-4" />
                  Generate Nursing Care Plan
                </Button>

                <Link
                  href="/study-tutor"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 text-indigo-400 text-sm font-medium hover:underline"
                >
                  <Bot className="w-4 h-4" />
                  Ask AI Tutor
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Care Plan Modal */}
      <AnimatePresence>
        {showCarePlan && carePlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-[800px] w-full max-h-[90vh] overflow-auto border border-indigo-500/30 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCarePlan(false)}
                className="absolute top-4 right-4 bg-white/10 text-foreground rounded-full w-9 h-9"
              >
                <X className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-foreground font-bold text-2xl m-0">
                    AI Nursing Care Plan
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 m-0">
                    NANDA-I Powered &bull; Evidence-Based
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={isEditing ? 'destructive' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setIsEditing(!isEditing);
                      if (!isEditing) {
                        setEditedCarePlan(carePlan);
                      }
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <div className="relative inline-block">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    >
                      <Download className="w-4 h-4" />
                      Download <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                    {showDownloadMenu && (
                      <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-white/10 rounded-lg py-2 min-w-[150px] z-10 shadow-xl">
                        <button
                          onClick={() => downloadCarePlan('txt')}
                          className="w-full px-4 py-2.5 text-left text-muted-foreground text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" /> Plain Text (.txt)
                        </button>
                        <button
                          onClick={() => downloadCarePlan('html')}
                          className="w-full px-4 py-2.5 text-left text-muted-foreground text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" /> Web Page (.html)
                        </button>
                        <button
                          onClick={() => downloadCarePlan('json')}
                          className="w-full px-4 py-2.5 text-left text-muted-foreground text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <Wrench className="w-4 h-4" /> JSON (.json)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 mb-5">
                  <p className="text-amber-300 text-sm m-0 flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    You are in edit mode. Click &quot;Save Changes&quot; when done, or &quot;Cancel&quot; to discard changes.
                  </p>
                </div>
              )}

              {(() => {
                const plan = isEditing && editedCarePlan ? editedCarePlan : carePlan;
                const updateField = (field: string, value: any) => {
                  if (isEditing && editedCarePlan) {
                    const newPlan = { ...editedCarePlan };
                    if (field.startsWith('diagnosis.')) {
                      newPlan.diagnosis = { ...newPlan.diagnosis, [field.split('.')[1]]: value };
                    } else if (field.startsWith('goals.')) {
                      const goalType = field.split('.')[1];
                      newPlan.goals = { ...newPlan.goals, [goalType]: value };
                    } else if (field.startsWith('interventions.')) {
                      const idx = parseInt(field.split('.')[1]);
                      const intField = field.split('.')[2];
                      newPlan.interventions = [...newPlan.interventions];
                      newPlan.interventions[idx] = { ...newPlan.interventions[idx], [intField]: value };
                    } else if (field === 'assessment') {
                      newPlan.assessment = value;
                    } else if (field === 'evaluation') {
                      newPlan.evaluation = value;
                    }
                    setEditedCarePlan(newPlan);
                  }
                };

                return (
                  <>
                    <div className="mb-6">
                      <div className="bg-indigo-500/15 border border-indigo-500/30 rounded-xl p-4 mb-4">
                        <h3 className="text-indigo-300 text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-1.5">
                          <ClipboardList className="w-3 h-3" /> Nursing Diagnosis (PES Format)
                        </h3>
                        {isEditing ? (
                          <textarea
                            value={editedCarePlan?.diagnosis.statement || ''}
                            onChange={(e) => updateField('diagnosis.statement', e.target.value)}
                            className="w-full bg-black/30 border border-indigo-500/50 rounded-lg p-3 text-foreground text-sm font-mono resize-y min-h-[80px]"
                          />
                        ) : (
                          <p className="text-foreground text-base m-0 font-mono">
                            {plan.diagnosis.statement}
                          </p>
                        )}
                        <p className="text-muted-foreground text-sm mt-2 m-0">
                          NANDA-I Code: <span className="text-emerald-500 font-semibold">{plan.diagnosis.code}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-red-300 text-xs font-semibold mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <Search className="w-3 h-3" /> Assessment Data
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editedCarePlan?.assessment.join('\n') || ''}
                          onChange={(e) => updateField('assessment', e.target.value.split('\n').filter(Boolean))}
                          className="w-full bg-black/30 border border-red-300/50 rounded-lg p-3 text-foreground text-sm resize-y min-h-[120px]"
                        />
                      ) : (
                        <ul className="pl-5 m-0 space-y-2">
                          {plan.assessment.map((item: string, i: number) => (
                            <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-amber-300 text-xs font-semibold mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3 h-3" /> Goals & Outcomes
                      </h3>
                      <div className="mb-3">
                        <p className="text-indigo-300 text-sm font-semibold mb-2">Short-Term Goals:</p>
                        {isEditing ? (
                          <textarea
                            value={editedCarePlan?.goals.shortTerm.join('\n') || ''}
                            onChange={(e) => updateField('goals.shortTerm', e.target.value.split('\n').filter(Boolean))}
                            className="w-full bg-black/30 border border-amber-500/50 rounded-lg p-3 text-foreground text-sm resize-y min-h-[80px]"
                          />
                        ) : (
                          plan.goals.shortTerm.map((goal: string, i: number) => (
                            <p key={i} className="text-muted-foreground text-sm mb-1.5 pl-3">&bull; {goal}</p>
                          ))
                        )}
                      </div>
                      <div>
                        <p className="text-green-300 text-sm font-semibold mb-2">Long-Term Goals:</p>
                        {isEditing ? (
                          <textarea
                            value={editedCarePlan?.goals.longTerm.join('\n') || ''}
                            onChange={(e) => updateField('goals.longTerm', e.target.value.split('\n').filter(Boolean))}
                            className="w-full bg-black/30 border border-green-500/50 rounded-lg p-3 text-foreground text-sm resize-y min-h-[80px]"
                          />
                        ) : (
                          plan.goals.longTerm.map((goal: string, i: number) => (
                            <p key={i} className="text-muted-foreground text-sm mb-1.5 pl-3">&bull; {goal}</p>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-green-300 text-xs font-semibold mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="w-3 h-3" /> Nursing Interventions with Rationales
                      </h3>
                      {plan.interventions.map((item: any, i: number) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-3">
                          <div className="flex gap-3">
                            <span className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-semibold text-xs px-2.5 py-1 rounded-md h-fit shrink-0">
                              {i + 1}
                            </span>
                            <div className="flex-1">
                              {isEditing ? (
                                <>
                                  <textarea
                                    value={editedCarePlan?.interventions[i]?.intervention || ''}
                                    onChange={(e) => updateField(`interventions.${i}.intervention`, e.target.value)}
                                    className="w-full bg-black/30 border border-emerald-500/50 rounded-lg p-2 text-foreground text-sm mb-2 resize-y"
                                    placeholder="Intervention..."
                                  />
                                  <textarea
                                    value={editedCarePlan?.interventions[i]?.rationale || ''}
                                    onChange={(e) => updateField(`interventions.${i}.rationale`, e.target.value)}
                                    className="w-full bg-black/30 border border-gray-400/50 rounded-lg p-2 text-muted-foreground text-xs italic resize-y"
                                    placeholder="Rationale..."
                                  />
                                </>
                              ) : (
                                <>
                                  <p className="text-foreground font-medium text-sm mb-2">
                                    {item.intervention}
                                  </p>
                                  <p className="text-muted-foreground text-xs italic m-0">
                                    Rationale: {item.rationale}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-orange-300 text-xs font-semibold mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="w-3 h-3" /> Evaluation
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editedCarePlan?.evaluation.join('\n') || ''}
                          onChange={(e) => updateField('evaluation', e.target.value.split('\n').filter(Boolean))}
                          className="w-full bg-black/30 border border-orange-400/50 rounded-lg p-3 text-foreground text-sm resize-y min-h-[100px]"
                        />
                      ) : (
                        <ul className="pl-5 m-0 space-y-2">
                          {plan.evaluation.map((item: string, i: number) => (
                            <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 mt-5">
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => {
                            setIsEditing(false);
                            setEditedCarePlan(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                          Cancel Changes
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white"
                          onClick={() => setIsEditing(false)}
                        >
                          <Check className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300 font-semibold text-sm">Clinical Disclaimer</span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed m-0">
                        This AI-generated care plan is for educational and reference purposes only. Always validate with hospital protocols, physician orders, and adjust to individual patient needs before implementation.
                      </p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
