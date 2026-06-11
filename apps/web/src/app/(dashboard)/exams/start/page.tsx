'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Flag, ChevronLeft, ChevronRight, CheckCircle, XCircle,
  HelpCircle, AlertTriangle, BarChart3, BookOpen, ArrowLeft,
  RefreshCw, FileText, Info, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL, WS_BASE_URL } from '@/lib/api-config';

interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'fill-blank' | 'ordered' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number | boolean;
  explanation: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

interface ExamResult {
  questionId: string;
  userAnswer: string | string[] | number | boolean;
  isCorrect: boolean;
  timeSpent: number;
}

const questionBank: Question[] = [
  {
    id: 'f001',
    type: 'multiple-choice',
    question: 'A client with a diagnosis of acute pain is receiving morphine sulfate 4mg IV every 4 hours PRN. Which assessment finding indicates the medication is effective?',
    options: [
      'Client reports pain level decreased from 8 to 3',
      'Client is sleeping soundly',
      'Client\'s respiratory rate is 10 breaths/minute',
      'Client requests medication every 2 hours'
    ],
    correctAnswer: 'Client reports pain level decreased from 8 to 3',
    explanation: 'The most reliable indicator of pain relief is the client\'s self-report. A decrease in pain scale from 8 to 3 indicates effective pain management.',
    category: 'fundamentals',
    difficulty: 'beginner',
    topic: 'Pain Management'
  },
  {
    id: 'f002',
    type: 'multiple-choice',
    question: 'Which intervention is the highest priority when caring for a client with a nasogastric tube?',
    options: [
      'Irrigating the tube with normal saline',
      'Verifying tube placement by X-ray',
      'Securing the tube to the nose',
      'Providing oral care every 2 hours'
    ],
    correctAnswer: 'Verifying tube placement by X-ray',
    explanation: 'X-ray confirmation ensures the tube is in the stomach or small intestine, not the lungs. This is crucial to prevent aspiration pneumonia.',
    category: 'fundamentals',
    difficulty: 'intermediate',
    topic: 'NG Tube Management'
  },
  {
    id: 'f003',
    type: 'multiple-select',
    question: 'Select all that are TRUE about hand hygiene in healthcare settings:',
    options: [
      'Alcohol-based hand rub is effective against C. difficile spores',
      'Hand washing with soap and water is needed after caring for a client with C. difficile',
      'Minimum hand hygiene time is 20 seconds',
      'Gloves can replace hand hygiene',
      'Hand hygiene should be performed before and after patient contact'
    ],
    correctAnswer: ['Hand washing with soap and water is needed after caring for a client with C. difficile', 'Minimum hand hygiene time is 20 seconds', 'Hand hygiene should be performed before and after patient contact'],
    explanation: 'Alcohol-based hand rubs are NOT effective against C. diff spores. Gloves do NOT replace hand hygiene.',
    category: 'fundamentals',
    difficulty: 'intermediate',
    topic: 'Infection Control'
  },
  {
    id: 'f004',
    type: 'multiple-choice',
    question: 'A client is receiving a blood transfusion. Which finding indicates a transfusion reaction?',
    options: [
      'Temperature of 99.2°F (37.3°C)',
      'BP 118/76 mmHg',
      'Flank pain and dark urine',
      'Heart rate 88 bpm'
    ],
    correctAnswer: 'Flank pain and dark urine',
    explanation: 'Flank pain and dark urine (hemoglobinuria) are classic signs of a hemolytic transfusion reaction, which is a medical emergency.',
    category: 'fundamentals',
    difficulty: 'intermediate',
    topic: 'Blood Transfusion'
  },
  {
    id: 'f005',
    type: 'true-false',
    question: 'True or False: The Glasgow Coma Scale assesses eye opening, verbal response, and motor response.',
    correctAnswer: true,
    explanation: 'True. The GCS has three components: Eye Opening (1-4), Verbal Response (1-5), and Motor Response (1-6). A score of 8 or less indicates severe brain injury.',
    category: 'neurological',
    difficulty: 'beginner',
    topic: 'Neurological Assessment'
  },
  {
    id: 'ms001',
    type: 'multiple-choice',
    question: 'A client with heart failure is receiving furosemide (Lasix) 40mg IV. Which finding indicates the medication is working?',
    options: [
      'Blood pressure 110/70 mmHg',
      'Weight loss of 2 kg in 24 hours',
      'Urine output 50 mL/hr',
      'Serum potassium 3.2 mEq/L'
    ],
    correctAnswer: 'Weight loss of 2 kg in 24 hours',
    explanation: 'Weight loss of 2 kg (approximately 2 liters of fluid) in 24 hours indicates effective diuresis. Low potassium is a side effect, not an indicator of effectiveness.',
    category: 'medical-surgical',
    difficulty: 'intermediate',
    topic: 'Heart Failure'
  },
  {
    id: 'ms002',
    type: 'multiple-choice',
    question: 'A client with diabetes mellitus type 2 is scheduled for surgery. Which preoperative medication order should the nurse question?',
    options: [
      'Hold morning insulin',
      'Administer D5W with regular insulin infusion',
      'Give metformin the morning of surgery',
      'Monitor blood glucose every 2 hours'
    ],
    correctAnswer: 'Give metformin the morning of surgery',
    explanation: 'Metformin should be held before surgery and for 48 hours after surgery due to risk of lactic acidosis, especially with contrast media use.',
    category: 'medical-surgical',
    difficulty: 'advanced',
    topic: 'Diabetes Management'
  },
  {
    id: 'ms003',
    type: 'multiple-choice',
    question: 'Which assessment finding is MOST concerning in a client with chronic obstructive pulmonary disease (COPD)?',
    options: [
      'Pink-tinged sputum',
      'Barrel chest configuration',
      'Clubbing of fingernails',
      'Tripod positioning'
    ],
    correctAnswer: 'Pink-tinged sputum',
    explanation: 'Pink-tinged sputum may indicate pulmonary hemorrhage or infection. Barrel chest, clubbing, and tripod positioning are common chronic findings in COPD.',
    category: 'respiratory',
    difficulty: 'intermediate',
    topic: 'COPD'
  },
  {
    id: 'ms004',
    type: 'multiple-select',
    question: 'Select all appropriate nursing interventions for a client with an NG tube:',
    options: [
      'Check gastric residual volume before each feeding',
      'Elevate the head of bed 30-45 degrees',
      'Irrigate with normal saline every 4 hours',
      'Verify placement by X-ray',
      'Provide oral care every shift'
    ],
    correctAnswer: ['Check gastric residual volume before each feeding', 'Elevate the head of bed 30-45 degrees', 'Verify placement by X-ray', 'Provide oral care every shift'],
    explanation: 'Irrigating with normal saline is no longer recommended as it can cause electrolyte imbalances. Routine irrigation is not evidence-based practice.',
    category: 'medical-surgical',
    difficulty: 'intermediate',
    topic: 'NG Tube Care'
  },
  {
    id: 'ms005',
    type: 'multiple-choice',
    question: 'A client with acute kidney injury has a urine output of 30 mL/hr. The nurse should prioritize which intervention?',
    options: [
      'Encourage fluid intake',
      'Monitor cardiac telemetry',
      'Weigh the client daily',
      'Insert a Foley catheter'
    ],
    correctAnswer: 'Monitor cardiac telemetry',
    explanation: 'Low urine output (oliguria) can lead to hyperkalemia, which can cause fatal cardiac arrhythmias. Cardiac monitoring is priority.',
    category: 'medical-surgical',
    difficulty: 'advanced',
    topic: 'Acute Kidney Injury'
  },
  {
    id: 'ms006',
    type: 'multiple-choice',
    question: 'The nurse is caring for a client who had a stroke and is exhibiting left-sided weakness. Which intervention should be included in the care plan?',
    options: [
      'Place the call light on the right side',
      'Position the client on the right side',
      'Encourage use of the left arm for activities',
      'Assist the client to stand on the left side first'
    ],
    correctAnswer: 'Position the client on the right side',
    explanation: 'For a client with left-sided weakness, positioning on the unaffected side (right) promotes safety and prevents pressure on the weak side.',
    category: 'neurological',
    difficulty: 'intermediate',
    topic: 'Stroke Care'
  },
  {
    id: 'ms007',
    type: 'true-false',
    question: 'True or False: A client with a history of myocardial infarction should avoid foods high in tyramine.',
    correctAnswer: false,
    explanation: 'False. Tyramine restriction is important for clients taking MAO inhibitors (antidepressants), not for those with MI history.',
    category: 'cardiovascular',
    difficulty: 'advanced',
    topic: 'Cardiac Nutrition'
  },
  {
    id: 'cv001',
    type: 'multiple-choice',
    question: 'A client with atrial fibrillation is receiving warfarin (Coumadin). Which laboratory value indicates therapeutic anticoagulation?',
    options: [
      'PT 12 seconds',
      'INR 2.5',
      'aPTT 40 seconds',
      'Platelet count 150,000/mm³'
    ],
    correctAnswer: 'INR 2.5',
    explanation: 'For clients with atrial fibrillation on warfarin, the therapeutic INR range is typically 2.0-3.0. An INR of 2.5 indicates therapeutic anticoagulation.',
    category: 'cardiovascular',
    difficulty: 'intermediate',
    topic: 'Anticoagulation'
  },
  {
    id: 'cv002',
    type: 'multiple-choice',
    question: 'Which finding is expected in a client with left-sided heart failure?',
    options: [
      'Jugular venous distension',
      'Crackles in lung bases',
      'Peripheral edema',
      'Hepatojugular reflux'
    ],
    correctAnswer: 'Crackles in lung bases',
    explanation: 'Left-sided heart failure causes pulmonary congestion manifesting as crackles (rales) in lung bases. JVD and peripheral edema are signs of right-sided failure.',
    category: 'cardiovascular',
    difficulty: 'intermediate',
    topic: 'Heart Failure'
  },
  {
    id: 'cv003',
    type: 'multiple-select',
    question: 'Select all risk factors for developing deep vein thrombosis (DVT):',
    options: [
      'Prolonged immobility',
      'Recent surgery',
      'Obesity',
      'Lower leg cast',
      'Anticoagulant therapy'
    ],
    correctAnswer: ['Prolonged immobility', 'Recent surgery', 'Obesity', 'Lower leg cast'],
    explanation: 'Anticoagulant therapy PREVENTS DVT. Immobility, surgery, obesity, and casts are all risk factors (Virchow\'s triad).',
    category: 'cardiovascular',
    difficulty: 'intermediate',
    topic: 'DVT Prevention'
  },
  {
    id: 'resp001',
    type: 'multiple-choice',
    question: 'A client on a ventilator develops high peak inspiratory pressure. What should the nurse do FIRST?',
    options: [
      'Increase sedation',
      'Suction the client',
      'Check the ventilator settings',
      'Notify the healthcare provider'
    ],
    correctAnswer: 'Suction the client',
    explanation: 'High PIP often indicates airway obstruction from secretions. Suctioning is the first intervention to clear the airway.',
    category: 'respiratory',
    difficulty: 'advanced',
    topic: 'Ventilator Management'
  },
  {
    id: 'resp002',
    type: 'multiple-choice',
    question: 'Which ABG result indicates respiratory acidosis?',
    options: [
      'pH 7.35, PaCO2 50 mmHg',
      'pH 7.50, PaCO2 30 mmHg',
      'pH 7.40, PaCO2 40 mmHg',
      'pH 7.30, PaCO2 25 mmHg'
    ],
    correctAnswer: 'pH 7.35, PaCO2 50 mmHg',
    explanation: 'Respiratory acidosis is indicated by low pH (<7.35) and high PaCO2 (>45 mmHg).',
    category: 'respiratory',
    difficulty: 'advanced',
    topic: 'ABG Interpretation'
  },
  {
    id: 'mh001',
    type: 'multiple-choice',
    question: 'A client with major depressive disorder is started on an SSRI. The nurse should educate the client that:',
    options: [
      'Effects will be seen within 1-2 days',
      'They should avoid aged cheese',
      'Therapeutic effects take 2-4 weeks',
      'They can stop the medication when feeling better'
    ],
    correctAnswer: 'Therapeutic effects take 2-4 weeks',
    explanation: 'SSRIs take 2-4 weeks to reach therapeutic effect. Tyramine restriction is for MAOIs, not SSRIs. Stopping abruptly can cause discontinuation syndrome.',
    category: 'psychiatric',
    difficulty: 'intermediate',
    topic: 'SSRI Therapy'
  },
  {
    id: 'mh002',
    type: 'multiple-choice',
    question: 'A client experiencing a panic attack presents with hyperventilation, palpitations, and feeling of impending doom. Which nursing intervention is priority?',
    options: [
      'Teach deep breathing exercises',
      'Stay with the client and provide calm reassurance',
      'Administer antianxiety medication',
      'Teach about panic disorder'
    ],
    correctAnswer: 'Stay with the client and provide calm reassurance',
    explanation: 'During a panic attack, the priority is ensuring client safety by staying with them. Teaching and medication come after the acute episode subsides.',
    category: 'psychiatric',
    difficulty: 'intermediate',
    topic: 'Panic Disorder'
  },
  {
    id: 'mh003',
    type: 'true-false',
    question: 'True or False: A client with anorexia nervosa typically recognizes they have an eating disorder.',
    correctAnswer: false,
    explanation: 'False. Clients with anorexia nervosa typically deny having an eating disorder and do not recognize the severity of their condition.',
    category: 'psychiatric',
    difficulty: 'intermediate',
    topic: 'Eating Disorders'
  },
  {
    id: 'mat001',
    type: 'multiple-choice',
    question: 'A client in labor is 4 cm dilated, 90% effaced, and -2 station. The client requests an epidural. What should the nurse do FIRST?',
    options: [
      'Position the client for epidural placement',
      'Check cervical dilation again',
      'Ensure client has signed consent',
      'Administer a fluid bolus'
    ],
    correctAnswer: 'Ensure client has signed consent',
    explanation: 'Before any procedure requiring anesthesia, informed consent must be obtained first.',
    category: 'maternity',
    difficulty: 'intermediate',
    topic: 'Labor Analgesia'
  },
  {
    id: 'mat002',
    type: 'multiple-choice',
    question: 'Which finding is a positive sign of pregnancy?',
    options: [
      'Quickening',
      'Braxton Hicks contractions',
      'Fetal heartbeat detected by Doppler',
      'Positive home pregnancy test'
    ],
    correctAnswer: 'Fetal heartbeat detected by Doppler',
    explanation: 'Positive signs of pregnancy definitively prove pregnancy: fetal heartbeat, fetal movements felt by examiner, and visualization of fetus on ultrasound.',
    category: 'maternity',
    difficulty: 'beginner',
    topic: 'Pregnancy Assessment'
  },
  {
    id: 'mat003',
    type: 'multiple-select',
    question: 'Select all signs of postpartum hemorrhage:',
    options: [
      'Saturation of more than 1 pad in 15 minutes',
      'Uterine fundus firm at umbilicus',
      'Blood loss >500 mL (vaginal)',
      'Blood loss >1000 mL (cesarean)',
      'Tachycardia'
    ],
    correctAnswer: ['Saturation of more than 1 pad in 15 minutes', 'Blood loss >500 mL (vaginal)', 'Blood loss >1000 mL (cesarean)', 'Tachycardia'],
    explanation: 'A firm uterine fundus is EXPECTED postpartum. A soft fundus indicates hemorrhage.',
    category: 'maternity',
    difficulty: 'advanced',
    topic: 'Postpartum Care'
  },
  {
    id: 'ped001',
    type: 'multiple-choice',
    question: 'A 6-month-old infant is admitted with dehydration. Which finding indicates severe dehydration?',
    options: [
      'Dry mucous membranes',
      'Sunken fontanelle',
      'Tachycardia',
      'Decreased urine output'
    ],
    correctAnswer: 'Sunken fontanelle',
    explanation: 'A sunken (depressed) fontanelle is a sign of severe dehydration in infants.',
    category: 'pediatric',
    difficulty: 'intermediate',
    topic: 'Pediatric Dehydration'
  },
  {
    id: 'ped002',
    type: 'multiple-choice',
    question: 'The parents of a child with asthma ask about using a peak flow meter. The nurse should explain that the peak flow meter is used to:',
    options: [
      'Measure oxygen saturation',
      'Monitor airway inflammation',
      'Measure how fast air can be exhaled',
      'Deliver medication to the lungs'
    ],
    correctAnswer: 'Measure how fast air can be exhaled',
    explanation: 'A peak flow meter measures the maximum speed of expiration to monitor asthma control.',
    category: 'pediatric',
    difficulty: 'beginner',
    topic: 'Asthma Management'
  },
  {
    id: 'pharm001',
    type: 'multiple-choice',
    question: 'A client is receiving IV heparin for deep vein thrombosis. Which laboratory value should be monitored?',
    options: [
      'Prothrombin time (PT)',
      'Partial thromboplastin time (aPTT)',
      'Platelet count',
      'Hemoglobin and hematocrit'
    ],
    correctAnswer: 'Partial thromboplastin time (aPTT)',
    explanation: 'Heparin therapy is monitored using aPTT. The therapeutic range is 1.5-2.5 times the control value.',
    category: 'pharmacology',
    difficulty: 'intermediate',
    topic: 'Anticoagulant Monitoring'
  },
  {
    id: 'pharm002',
    type: 'multiple-choice',
    question: 'A client receiving aminoglycosides (gentamicin) should be monitored for which serious side effect?',
    options: [
      'Neurotoxicity causing hearing loss',
      'Hepatotoxicity',
      'Photosensitivity',
      'Stevens-Johnson syndrome'
    ],
    correctAnswer: 'Neurotoxicity causing hearing loss',
    explanation: 'Aminoglycosides are ototoxic and nephrotoxic. Clients need monitoring of renal function and hearing.',
    category: 'pharmacology',
    difficulty: 'intermediate',
    topic: 'Antibiotic Toxicity'
  },
  {
    id: 'pharm003',
    type: 'multiple-select',
    question: 'Select all true statements about opioid analgesics:',
    options: [
      'Naloxone (Narcan) is the antidote for overdose',
      'Respiratory depression is a life-threatening side effect',
      'They cause constipation',
      'They are non-addictive',
      'Tolerance develops quickly'
    ],
    correctAnswer: ['Naloxone (Narcan) is the antidote for overdose', 'Respiratory depression is a life-threatening side effect', 'They cause constipation', 'Tolerance develops quickly'],
    explanation: 'Opioids CAN be addictive - this is a well-known risk. All other statements are true.',
    category: 'pharmacology',
    difficulty: 'intermediate',
    topic: 'Opioid Analgesics'
  },
  {
    id: 'em001',
    type: 'multiple-choice',
    question: 'A client presents with chest pain that radiates to the jaw and left arm. The ECG shows ST elevation in leads II, III, and aVF. Which type of myocardial infarction does this indicate?',
    options: [
      'Anterior MI',
      'Inferior MI',
      'Lateral MI',
      'Posterior MI'
    ],
    correctAnswer: 'Inferior MI',
    explanation: 'ST elevation in leads II, III, and aVF indicates inferior wall MI (affecting the right coronary artery).',
    category: 'emergency',
    difficulty: 'advanced',
    topic: 'ECG Interpretation'
  },
  {
    id: 'em002',
    type: 'multiple-choice',
    question: 'A client is brought in after a motor vehicle collision. Vital signs: BP 80/50, HR 120, RR 24. Which type of shock is the client most likely experiencing?',
    options: [
      'Cardiogenic',
      'Hypovolemic',
      'Septic',
      'Neurogenic'
    ],
    correctAnswer: 'Hypovolemic',
    explanation: 'Hypovolemic shock results from loss of blood or fluid volume. Trauma from MVC commonly causes hypovolemia from bleeding.',
    category: 'emergency',
    difficulty: 'intermediate',
    topic: 'Shock Types'
  },
  {
    id: 'em003',
    type: 'true-false',
    question: 'True or False: For a witnessed cardiac arrest, defibrillation should be performed within 3-5 minutes.',
    correctAnswer: true,
    explanation: 'True. Survival decreases by 7-10% for each minute delay in defibrillation. CPR should continue until the defibrillator is ready.',
    category: 'emergency',
    difficulty: 'intermediate',
    topic: 'Cardiac Arrest'
  },
  {
    id: 'comm001',
    type: 'multiple-choice',
    question: 'A community health nurse is developing a health education program. Which factor is most important to consider first?',
    options: [
      'The educational materials available',
      'The learning needs of the group',
      'The budget for the program',
      'The availability of translators'
    ],
    correctAnswer: 'The learning needs of the group',
    explanation: 'Assessing learning needs is the first step. This ensures education is relevant and meets actual needs.',
    category: 'community',
    difficulty: 'intermediate',
    topic: 'Health Education'
  },
  {
    id: 'lead001',
    type: 'multiple-choice',
    question: 'A nurse manager notices that one staff member is consistently late and another is frequently calling in sick. The best leadership approach would be to:',
    options: [
      'Ignore the behavior as it will resolve on its own',
      'Apply the same corrective action to both staff',
      'Address each staff member individually to understand reasons',
      'Write them up immediately for insubordination'
    ],
    correctAnswer: 'Address each staff member individually to understand reasons',
    explanation: 'Effective leadership requires individualized assessment. A private conversation to understand the root cause allows for appropriate intervention.',
    category: 'leadership',
    difficulty: 'intermediate',
    topic: 'Staff Management'
  },
  {
    id: 'lead002',
    type: 'multiple-select',
    question: 'Select all appropriate delegations from RN to LPN:',
    options: [
      'Administering oral medications',
      'Developing the care plan',
      'Wound care',
      'Assessing new patients',
      'Vital signs monitoring'
    ],
    correctAnswer: ['Administering oral medications', 'Wound care', 'Vital signs monitoring'],
    explanation: 'Assessment, care planning, and evaluation are RN responsibilities that cannot be delegated to LPNs.',
    category: 'leadership',
    difficulty: 'advanced',
    topic: 'Delegation'
  }
];

function ExamStartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [examType, setExamType] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const type = searchParams.get('type') || 'standard';
    const cat = searchParams.get('category') || 'fundamentals';
    const diff = searchParams.get('difficulty') || 'all';

    setExamType(type);
    setCategory(cat);
    setDifficulty(diff);

    const duration = type === 'quick' ? 15 * 60 : type === 'standard' ? 30 * 60 : type === 'full' ? 300 * 60 : 45 * 60;
    setTimeRemaining(duration);

    let filteredQuestions = questionBank.filter(q => q.category === cat);
    if (diff !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === diff);
    }

    const questionCount = type === 'quick' ? 10 : type === 'standard' ? 25 : type === 'full' ? 150 : 20;
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    setExamQuestions(shuffled.slice(0, Math.min(questionCount, shuffled.length)));
  }, [searchParams]);

  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, showResults]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartExam = () => {
    setExamStarted(true);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (answer: string) => {
    const question = examQuestions[currentQuestion];
    if (question.type === 'multiple-select') {
      const current = (selectedAnswers[question.id] as string[]) || [];
      const newAnswers = current.includes(answer)
        ? current.filter(a => a !== answer)
        : [...current, answer];
      setSelectedAnswers({ ...selectedAnswers, [question.id]: newAnswers });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [question.id]: answer });
    }
  };

  const isAnswerSelected = (answer: string) => {
    const question = examQuestions[currentQuestion];
    if (question.type === 'multiple-select') {
      return ((selectedAnswers[question.id] as string[]) || []).includes(answer);
    }
    return selectedAnswers[question.id] === answer;
  };

  const handleNext = () => {
    const timeSpent = Date.now() - questionStartTime;
    const question = examQuestions[currentQuestion];
    const userAnswer = selectedAnswers[question.id];

    let isCorrect = false;
    if (question.type === 'multiple-select') {
      const correct = question.correctAnswer as string[];
      const selected = (userAnswer as string[]) || [];
      isCorrect = correct.length === selected.length && correct.every(c => selected.includes(c));
    } else if (question.type === 'true-false') {
      isCorrect = userAnswer === question.correctAnswer;
    } else {
      isCorrect = userAnswer === question.correctAnswer;
    }

    setExamResults([...examResults, {
      questionId: question.id,
      userAnswer: userAnswer || '',
      isCorrect,
      timeSpent
    }]);

    setShowExplanation(false);
    setQuestionStartTime(Date.now());

    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishExam();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleFinishExam = () => {
    const timeSpent = Date.now() - questionStartTime;
    const question = examQuestions[currentQuestion];
    const userAnswer = selectedAnswers[question.id];

    let isCorrect = false;
    if (question.type === 'multiple-select') {
      const correct = question.correctAnswer as string[];
      const selected = (userAnswer as string[]) || [];
      isCorrect = correct.length === selected.length && correct.every(c => selected.includes(c));
    } else if (question.type === 'true-false') {
      isCorrect = userAnswer === question.correctAnswer;
    } else {
      isCorrect = userAnswer === question.correctAnswer;
    }

    const finalResults = [...examResults, {
      questionId: question.id,
      userAnswer: userAnswer || '',
      isCorrect,
      timeSpent
    }];

    setExamResults(finalResults);
    setShowResults(true);
    saveExamResults(finalResults);
  };

  const saveExamResults = async (results: ExamResult[]) => {
    try {
      const correctCount = results.filter(r => r.isCorrect).length;
      const score = Math.round((correctCount / results.length) * 100);
      const token = localStorage.getItem('token');
      await fetch(API_BASE_URL + '/api/exams/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category,
          examType,
          score,
          totalQuestions: results.length,
          correctAnswers: correctCount,
          timeTaken: examType === 'quick' ? 15 * 60 : examType === 'standard' ? 30 * 60 : examType === 'full' ? 300 * 60 : 45 * 60 - timeRemaining,
        }),
      });
    } catch { /* silent */ }
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) newFlagged.delete(currentQuestion);
    else newFlagged.add(currentQuestion);
    setFlaggedQuestions(newFlagged);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScore = () => {
    if (examResults.length === 0) return 0;
    const correct = examResults.filter(r => r.isCorrect).length;
    return Math.round((correct / examResults.length) * 100);
  };

  // ---- LANDING SCREEN ----
  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border p-8 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">NCLEX Practice Exam</h1>
          <p className="text-muted-foreground text-sm mb-8">
            {category.replace('-', ' ').toUpperCase()} · {examType === 'quick' ? 'Quick Practice' : examType === 'standard' ? 'Standard Exam' : examType === 'full' ? 'Full NCLEX' : 'Tutor Mode'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-2xl font-bold text-primary">{examQuestions.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-2xl font-bold text-emerald-500">{formatTime(timeRemaining)}</p>
              <p className="text-xs text-muted-foreground">Time Limit</p>
            </div>
          </div>

          <div className="mb-8 text-left p-5 rounded-xl bg-warning/10 border border-warning/20">
            <h3 className="text-sm font-semibold text-warning flex items-center gap-2 mb-3">
              <AlertTriangle size={16} /> Exam Instructions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">· Read each question carefully before selecting an answer</li>
              <li className="flex items-start gap-2">· For multiple-select questions, select ALL that apply</li>
              <li className="flex items-start gap-2">· You can flag questions to review later</li>
              <li className="flex items-start gap-2">· The exam will auto-submit when time expires</li>
            </ul>
          </div>

          <Button size="lg" onClick={handleStartExam} className="gap-2 shadow-lg shadow-primary/20">
            <FileText size={18} /> Start Exam
          </Button>
        </motion.div>
      </div>
    );
  }

  // ---- RESULTS SCREEN ----
  if (showResults) {
    const score = getScore();
    const correctCount = examResults.filter(r => r.isCorrect).length;

    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-card border border-border p-8 text-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            score >= 70 ? 'bg-success/10' : score >= 50 ? 'bg-warning/10' : 'bg-destructive/10'
          }`}>
            <span className="text-5xl">{score >= 70 ? '🎉' : score >= 50 ? '📚' : '💪'}</span>
          </div>

          <h1 className={`text-2xl font-heading font-bold mb-2 ${
            score >= 70 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive'
          }`}>
            {score >= 70 ? 'Excellent!' : score >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h1>

          <p className={`text-5xl font-heading font-extrabold my-6 ${
            score >= 70 ? 'text-success' : score >= 50 ? 'text-warning' : 'text-destructive'
          }`}>
            {score}%
          </p>

          <div className="flex justify-center gap-8 mb-8">
            <div>
              <p className="text-2xl font-bold text-success">{correctCount}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{examResults.length - correctCount}</p>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatTime(timeRemaining)}</p>
              <p className="text-xs text-muted-foreground">Time Left</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center mb-8">
            <Button variant="outline" onClick={() => router.push('/exams')} className="gap-2">
              <ArrowLeft size={16} /> Back to Exams
            </Button>
            <Button onClick={() => window.location.reload()} className="gap-2 shadow-lg shadow-primary/20">
              <RefreshCw size={16} /> Try Again
            </Button>
          </div>

          <div className="text-left">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Review Your Answers:</h3>
            <div className="space-y-3">
              {examQuestions.map((q, idx) => {
                const result = examResults[idx];
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`p-4 rounded-xl border ${
                      result?.isCorrect
                        ? 'bg-success/5 border-success/20'
                        : 'bg-destructive/5 border-destructive/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        result?.isCorrect ? 'bg-success' : 'bg-destructive'
                      }`}>
                        {result?.isCorrect
                          ? <CheckCircle size={14} className="text-white" />
                          : <XCircle size={14} className="text-white" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {idx + 1}. {q.question.length > 100 ? q.question.substring(0, 100) + '...' : q.question}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- ACTIVE EXAM ----
  const question = examQuestions[currentQuestion];
  if (!question) return null;

  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-card border border-border">
        <div>
          <p className="text-xs text-muted-foreground">Question {currentQuestion + 1} of {examQuestions.length}</p>
          <p className="text-[11px] text-muted-foreground">{question.topic} · {question.difficulty}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={flaggedQuestions.has(currentQuestion) ? 'warning' : 'outline'}
            size="sm"
            onClick={toggleFlag}
            className="gap-1.5"
          >
            <Flag size={14} />
            {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
          </Button>
          <div className={`px-4 py-2 rounded-lg text-lg font-bold font-heading ${
            timeRemaining < 300
              ? 'bg-destructive/20 text-destructive animate-pulse'
              : 'bg-muted text-foreground'
          }`}>
            <Clock size={16} className="inline mr-1.5 -mt-0.5" />
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary" className="text-xs">
              {question.type === 'multiple-choice' ? 'Single Answer' :
               question.type === 'multiple-select' ? 'Select All That Apply' :
               question.type === 'true-false' ? 'True / False' : 'Answer'}
            </Badge>
            {question.type === 'multiple-select' && (
              <span className="text-xs text-warning font-medium">Select ALL that apply</span>
            )}
          </div>

          <h2 className="text-lg font-semibold text-foreground leading-relaxed mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {(question.type === 'true-false'
              ? [{ label: 'TRUE', value: 'true' }, { label: 'FALSE', value: 'false' }]
              : (question.options || []).map(o => ({ label: o, value: o }))
            ).map(({ label, value }) => {
              const selected = isAnswerSelected(value);
              const isRadio = question.type !== 'multiple-select' && question.type !== 'true-false';
              return (
                <button
                  key={value}
                  onClick={() => handleAnswerSelect(value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all border-2 ${
                    selected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/30 hover:bg-accent/50'
                  }`}
                >
                  <span className={`w-6 h-6 shrink-0 border-2 flex items-center justify-center transition-colors ${
                    question.type === 'multiple-select' ? 'rounded-md' : 'rounded-full'
                  } ${
                    selected ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'
                  }`}>
                    {selected && <CheckCircle size={14} className="text-white" />}
                  </span>
                  <span className={`text-sm leading-relaxed ${selected ? 'text-primary font-medium' : 'text-foreground'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-2">
                    <Info size={16} /> Explanation
                  </h4>
                  <p className="text-sm text-card-foreground leading-relaxed">{question.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="gap-2"
        >
          <ChevronLeft size={16} /> Previous
        </Button>

        {/* Question Number Pills */}
        <div className="hidden md:flex gap-1.5 flex-wrap justify-center">
          {examQuestions.map((_, idx) => {
            const isAnswered = !!selectedAnswers[examQuestions[idx].id];
            const isFlagged = flaggedQuestions.has(idx);
            const isCurrent = idx === currentQuestion;
            return (
              <button
                key={idx}
                onClick={() => { setCurrentQuestion(idx); setShowExplanation(false); }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : isFlagged
                      ? 'bg-warning/20 text-warning border border-warning/30'
                      : isAnswered
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <Button
          onClick={() => {
            if (!showExplanation) {
              setShowExplanation(true);
            } else {
              handleNext();
            }
          }}
          className="gap-2 shadow-lg shadow-primary/20"
        >
          {showExplanation
            ? (currentQuestion === examQuestions.length - 1 ? 'Finish Exam' : 'Next')
            : 'Check Answer'}
          {showExplanation && currentQuestion < examQuestions.length - 1 && <ChevronRight size={16} />}
        </Button>
      </div>

      {/* Mobile question dots */}
      <div className="flex md:hidden gap-1.5 justify-center mt-4">
        {examQuestions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentQuestion(idx); setShowExplanation(false); }}
            className={`w-6 h-6 rounded text-[10px] font-semibold ${
              idx === currentQuestion
                ? 'bg-primary text-primary-foreground'
                : flaggedQuestions.has(idx)
                  ? 'bg-warning/20 text-warning'
                  : selectedAnswers[examQuestions[idx].id]
                    ? 'bg-success/20 text-success'
                    : 'bg-muted text-muted-foreground'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Loading exam...</p>
    </div>
  );
}

export default function ExamStartPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExamStartContent />
    </Suspense>
  );
}
