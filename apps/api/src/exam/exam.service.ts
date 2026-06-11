import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const questionBank = [
  {
    id: '1',
    question: 'A patient with hypertension is prescribed lisinopril. Which of the following patient statements indicates understanding of the medication?',
    options: ['I should take this with food', 'I will avoid potassium-rich foods', 'I can stop taking it when my blood pressure normalizes', 'I should report any cough to my doctor'],
    correctAnswer: 3,
    category: 'Pharmacology',
    difficulty: 'medium',
  },
  {
    id: '2',
    question: 'The nurse assesses a patient with suspected myocardial infarction. Which finding is MOST characteristic?',
    options: ['Chest pain that is relieved by rest', 'Chest pain described as sharp and stabbing', 'Chest pain radiating to the left arm', 'Chest pain that worsens with deep breathing'],
    correctAnswer: 2,
    category: 'Medical-Surgical',
    difficulty: 'medium',
  },
  {
    id: '3',
    question: 'A patient with diabetes mellitus is experiencing hypoglycemia. Which intervention should the nurse implement FIRST?',
    options: ['Administer glucagon', 'Give 15-20g of fast-acting carbohydrates', 'Check blood glucose level', 'Notify the physician'],
    correctAnswer: 1,
    category: 'Endocrine',
    difficulty: 'easy',
  },
  {
    id: '4',
    question: 'The nurse is caring for a patient with a nasogastric tube. Which action demonstrates proper tube placement verification?',
    options: ['Aspirating gastric contents', 'X-ray confirmation', 'Listening for air movement', 'Measuring tube length'],
    correctAnswer: 1,
    category: 'Fundamentals',
    difficulty: 'easy',
  },
  {
    id: '5',
    question: 'A patient with COPD is being discharged. Which instruction should the nurse include in the discharge teaching?',
    options: ['Use the rescue inhaler every 4 hours', 'Perform deep breathing exercises before meals', 'Avoid pursed-lip breathing', 'Limit fluid intake to 1000mL daily'],
    correctAnswer: 1,
    category: 'Respiratory',
    difficulty: 'medium',
  },
  {
    id: '6',
    question: 'The nurse is assessing a patient with fluid volume deficit. Which finding would the nurse expect?',
    options: ['Weight gain', 'Elevated blood pressure', 'Decreased skin turgor', 'Crackles in lungs'],
    correctAnswer: 2,
    category: 'Fundamentals',
    difficulty: 'easy',
  },
  {
    id: '7',
    question: 'A patient is receiving a blood transfusion. Which symptom would indicate a transfusion reaction?',
    options: ['Clear breath sounds', 'Blood pressure 120/80', 'Urine output 50mL/hr', 'Fever and chills'],
    correctAnswer: 3,
    category: 'Medical-Surgical',
    difficulty: 'medium',
  },
  {
    id: '8',
    question: 'The nurse is preparing to administer insulin. Which site would provide the FASTEST absorption?',
    options: ['Abdomen', 'Arm', 'Thigh', 'Gluteal'],
    correctAnswer: 0,
    category: 'Pharmacology',
    difficulty: 'hard',
  },
  {
    id: '9',
    question: 'A patient with chronic kidney disease is on a low-potassium diet. Which food should the nurse instruct the patient to AVOID?',
    options: ['Apples', 'Rice', 'Bananas', 'Cabbage'],
    correctAnswer: 2,
    category: 'Renal',
    difficulty: 'easy',
  },
  {
    id: '10',
    question: 'The nurse is caring for a patient with a chest tube. Which observation requires IMMEDIATE intervention?',
    options: ['Continuous bubbling in water seal', 'Tidaling in water seal', 'Disconnection from wall suction', 'Dark red drainage'],
    correctAnswer: 2,
    category: 'Respiratory',
    difficulty: 'hard',
  },
  {
    id: '11',
    question: 'A patient is diagnosed with deep vein thrombosis. Which nursing intervention is PRIORITY?',
    options: ['Apply warm compresses', 'Encourage ambulation', 'Administer anticoagulant as ordered', 'Massage the affected leg'],
    correctAnswer: 2,
    category: 'Medical-Surgical',
    difficulty: 'medium',
  },
  {
    id: '12',
    question: 'The nurse is assessing a patient with possible stroke. Which finding supports the diagnosis?',
    options: ['Bilateral hand weakness', 'Unilateral weakness', 'Bilateral leg swelling', 'Generalized fatigue'],
    correctAnswer: 1,
    category: 'Neurological',
    difficulty: 'medium',
  },
];

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  getQuestions(category?: string, difficulty?: string, limit = 10) {
    let questions = [...questionBank];
    
    if (category) {
      questions = questions.filter(q => q.category === category);
    }
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    return questions.slice(0, limit).map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
    }));
  }

  async submitExam(userId: string, answers: { questionId: string; answer: number }[], timeSpent: number) {
    let correct = 0;
    const wrongAreas: string[] = [];

    answers.forEach(answer => {
      const question = questionBank.find(q => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.answer) {
        correct++;
      } else if (question) {
        wrongAreas.push(question.category);
      }
    });

    const score = (correct / answers.length) * 100;

    return this.prisma.examAttempt.create({
      data: {
        userId,
        examType: 'NCLEX_PRACTICE',
        score,
        totalQuestions: answers.length,
        correctAnswers: correct,
        timeSpent,
        wrongAreas: wrongAreas.join(','),
        passed: score >= 70,
      },
    });
  }

  async getHistory(userId: string) {
    return this.prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getStats(userId: string) {
    const attempts = await this.prisma.examAttempt.findMany({
      where: { userId },
    });

    if (attempts.length === 0) {
      return { total: 0, averageScore: 0, bestScore: 0, passRate: 0 };
    }

    const scores = attempts.map(a => a.score);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const passed = attempts.filter(a => a.passed).length;
    const passRate = (passed / attempts.length) * 100;

    return {
      total: attempts.length,
      averageScore: Math.round(averageScore),
      bestScore: Math.round(bestScore),
      passRate: Math.round(passRate),
    };
  }
}
