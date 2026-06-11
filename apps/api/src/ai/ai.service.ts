import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface MigrationPathway {
  country: string;
  steps: {
    order: number;
    name: string;
    duration: string;
    cost: number;
    requirements: string[];
  }[];
  totalCost: number;
  totalDuration: string;
}

export interface ReadinessAssessment {
  score: number;
  gaps: string[];
  recommendations: string[];
}

const NURSING_SYSTEM_PROMPT = `You are NurseOrbit AI, an expert nursing education assistant. You help nurses with:
- NCLEX-RN exam preparation and practice questions
- Nursing concepts, anatomy, physiology, pharmacology
- Clinical skills and procedures
- Care planning and nursing diagnoses
- Migration pathways and licensing requirements
- Career guidance for nurses

Provide accurate, helpful responses tailored to nursing students and professionals. Use clear explanations suitable for nursing education.`;

@Injectable()
export class AiService {
  private openaiApiKey: string | undefined;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.openaiApiKey = this.config.get('OPENAI_API_KEY');
  }

  async chatWithAI(userId: string, message: string, context?: string): Promise<{ response: string; sources?: string[] }> {
    const fullContext = context 
      ? `${NURSING_SYSTEM_PROMPT}\n\nContext: ${context}\n\nUser question: ${message}`
      : `${NURSING_SYSTEM_PROMPT}\n\nUser question: ${message}`;

    if (this.openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: NURSING_SYSTEM_PROMPT },
              ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return { response: data.choices[0].message.content };
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
      }
    }

    return this.getMockResponse(message, context);
  }

  private getMockResponse(message: string, context?: string): { response: string } {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('nclex') || lowerMessage.includes('exam') || lowerMessage.includes('question')) {
      return {
        response: this.getNCLEXResponse(lowerMessage, context)
      };
    }
    
    if (lowerMessage.includes('anatomy') || lowerMessage.includes('physiology') || lowerMessage.includes('body')) {
      return {
        response: this.getAnatomyResponse(lowerMessage)
      };
    }
    
    if (lowerMessage.includes('pharmacology') || lowerMessage.includes('drug') || lowerMessage.includes('medication')) {
      return {
        response: this.getPharmacologyResponse(lowerMessage)
      };
    }
    
    if (lowerMessage.includes('care plan') || lowerMessage.includes('nursing diagnosis') || lowerMessage.includes('intervention')) {
      return {
        response: this.getCarePlanResponse(lowerMessage)
      };
    }
    
    if (lowerMessage.includes('migration') || lowerMessage.includes('license') || lowerMessage.includes('register')) {
      return {
        response: this.getMigrationResponse(lowerMessage)
      };
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('procedure') || lowerMessage.includes('technique')) {
      return {
        response: this.getSkillsResponse(lowerMessage)
      };
    }

    return {
      response: this.getGeneralResponse(message, context)
    };
  }

  private getNCLEXResponse(query: string, context?: string): string {
    if (query.includes('priority') || query.includes('first') || query.includes('most important')) {
      return `**Prioritization in NCLEX:**

The **ABCDE** framework is key:
- **A - Airway**: Is the patient's airway patent?
- **B - Breathing**: Is breathing adequate?
- **C - Circulation**: Is perfusion OK?
- **D - Disability**: Any neurological issues?
- **E - Exposure**: Full exposure and environmental control

For SATA questions, look for options that:
1. Address airway first
2. Don't cause harm
3. Are based on patient assessment data
4. Come before patient education

Would you like me to generate some practice priority questions?`;
    }
    
    if (query.includes('SATA') || query.includes('select all')) {
      return `**SATA (Select All That Apply) Strategies:**

These are worth 2-3 points each. Key strategies:

1. **Read carefully** - Each option is either correct or incorrect
2. **Look for 2-3 correct answers** typically
3. **Eliminate obviously wrong** options first
4. **"All of the above"** is rarely correct alone

Common SATA topics:
- Patient safety interventions
- Delegation decisions
- Medication side effects
- Assessment findings

Would you like practice SATA questions on a specific topic?`;
    }

    if (query.includes('delegation') || query.includes('assign')) {
      return `**Delegation Principles (NCLEX Key!):**

✓ **RN tasks** - Assessment, evaluation, patient education
✓ **LPN tasks** - Routine care, vitals, wound care
✓ **UAP tasks** - Hygiene, feeding, ambulation

**NEVER delegate:**
- Patient assessment
- Nursing judgments
- Patient education
- Evaluation of care

**Right to refuse** - If you see unsafe delegation, speak up!

Would you like more delegation scenarios?`;
    }

    return `**NCLEX Preparation Tips:**

1. **Use the SATA approach** - Select all that apply questions test depth of knowledge
2. **Master prioritization** - Always think ABCs (Airway, Breathing, Circulation)
3. **Focus on safety** - The correct answer is always the safest option
4. **Eliminate distractors** - Look for the "most" or "least" important
5. **Know your lab values** - Normal ranges are crucial

What specific NCLEX topic would you like to focus on? I can help with:
- Pharmacology
- Care plans
- Prioritization
- SATA strategies
- Delegation`;
  }

  private getAnatomyResponse(query: string): string {
    if (query.includes('heart') || query.includes('cardiac')) {
      return `**Cardiac Anatomy - Key Points:**

🫀 **Heart Chambers:**
- Right Atrium → Right Ventricle → Lungs
- Left Atrium → Left Ventricle → Body

⚡ **Conduction System:**
1. SA Node (pacemaker - 60-100 bpm)
2. AV Node (60-80 bpm)
3. Bundle of His
4. Purkinje fibers

💉 **Coronary Arteries:**
- LAD: Supplies left ventricle (widow maker!)
- RCA: Supplies right side & inferior wall
- LCx: Supplies lateral wall

**NCLEX Tip:** Know which side of the heart pumps to lungs vs body!

Want a practice question on cardiac content?`;
    }

    if (query.includes('lung') || query.includes('respiratory')) {
      return `**Respiratory Anatomy:**

🌬️ **Right Lung:** 3 lobes (upper, middle, lower)
🌬️ **Left Lung:** 2 lobes (upper, lower) - has cardiac notch

📊 **Gas Exchange:** Happens at alveoli
- O2 moves: Alveoli → Blood
- CO2 moves: Blood → Alveoli

🫁 **Breathing Muscles:**
- Diaphragm (primary)
- Intercostal muscles
- Accessory muscles (neck)

**ABG Interpretation Tip:** 
- pH < 7.35 = Acidotic
- pH > 7.45 = Alkalotic

Need help with ABG interpretation?`;
    }

    return `**Anatomy & Physiology Essentials:**

Key body systems to master:
- **Cardiac** - Heart chambers, conduction, vessels
- **Respiratory** - Lungs, gas exchange, ventilation
- **Renal** - Nephron function, filtration
- **Neurological** - Brain regions, spinal cord
- **GI** - Digestion, absorption, enzymes

**Study Tip:** For each system, know:
1. Structure
2. Function
3. Common disorders
4. Nursing interventions

Which system would you like to explore deeper?`;
  }

  private getPharmacologyResponse(query: string): string {
    if (query.includes('antibiotic') || query.includes('infection')) {
      return `**Antibiotic Classes - NCLEX High Yield:**

💊 **Penicillins** (Amoxicillin, Ampicillin)
- MOA: Inhibit cell wall synthesis
- S/E: Rash, anaphylaxis, diarrhea
- Teaching: Take full course!

💊 **Cephalosporins** (Ceftriaxone)
- Cross-reactivity with penicillins (10%)
- Same MOA as penicillins

💊 **Aminoglycosides** (Gentamicin)
- S/E: Ototoxicity, nephrotoxicity
- Peak & trough levels needed!

💊 **Fluoroquinolones** (Levofloxacin)
- S/E: Tendon rupture, photosensitivity
- Avoid in pregnancy/children

**NCLEX Priority:** Allergy assessment before antibiotics!`;
    }

    if (query.includes('cardiac') || query.includes('heart') || query.includes('blood pressure')) {
      return `**Cardiac Medications - Essentials:**

💓 **ACE Inhibitors** (Lisinopril, Enalapril)
- End in -pril
- S/E: Cough, angioedema, hyperkalemia
- Teaching: Rise slowly (orthostatic hypotension)

💓 **Beta Blockers** (Metoprolol, Atenolol)
- End in -olol
- S/E: Bradycardia, hypotension, fatigue
- Never stop abruptly!

💓 **Diuretics** (Furosemide/Lasix)
- S/E: Hypokalemia, dehydration
- Monitor I&O, weights

💓 **Anticoagulants** (Heparin, Warfarin)
- Heparin: Monitor PTT
- Warfarin: Monitor PT/INR
- Bleeding precautions!

Which medication class do you want to explore?`;
    }

    return `**Pharmacology Fundamentals:**

📚 **Drug Classifications to Know:**
- Antibiotics
- Cardiac medications
- Anticoagulants
- Insulin & hypoglycemics
- Pain medications
- Psychiatric medications

🔑 **NCLEX Drug Questions:**
1. What is the mechanism of action?
2. What are the side effects?
3. What nursing interventions are needed?
4. What patient teaching is required?

**Key Strategy:** Always think SAFETY first!

What medication class or condition are you studying?`;
  }

  private getCarePlanResponse(query: string): string {
    return `**Nursing Care Plans - Step by Step:**

📋 **Step 1: Assessment**
- Collect subjective & objective data
- Interview patient
- Review lab values

📋 **Step 2: Diagnosis**
- Use NANDA nursing diagnoses
- Example: Risk for infection r/t immunosuppression

📋 **Step 3: Planning**
- Set SMART goals
- Example: Patient will remain afebrile throughout hospitalization

📋 **Step 4: Implementation**
- Interventions with rationales
- Example: Monitor temperature q4h

📋 **Step 5: Evaluation**
- Was goal met?
- Revise as needed

**Common NANDA Diagnoses:**
- Anxiety
- Risk for infection
- Acute pain
- Impaired gas exchange
- Ineffective airway clearance

Would you like a care plan for a specific condition?`;
  }

  private getMigrationResponse(query: string): string {
    if (query.includes('usa') || query.includes('united states')) {
      return `**🇺🇸 Nursing Migration to USA:**

📌 **Key Steps:**
1. **NCLEX-RN** - Pass the exam (~$450)
2. **CGFNS Credential Evaluation** - ($300-500)
3. **VisaScreen Certificate** - Required for visa (~$375)
4. **Apply for state license** - Each state has requirements
5. **Find employer** - Many hospitals sponsor visas

⏱️ **Timeline:** 12-24 months
💰 **Estimated Cost:** $5,000-10,000

📋 **Requirements:**
- Nursing degree (diploma, ADN, or BSN)
- English proficiency (IELTS or OET)
- Clean license in home country

Would you like details on NCLEX preparation or specific state requirements?`;
    }

    if (query.includes('uk') || query.includes('united kingdom')) {
      return `**🇬🇧 Nursing Migration to UK:**

📌 **Key Steps:**
1. **IELTS/OET** - English test (7.0 in all bands)
2. **NMC Registration** - £763 (~$950)
3. **CBT Exam** - Computer-based test (~$500)
4. **OSCE Exam** - Practical exam in UK (~$3,000)
5. **Apply for visa** - Health & Care Worker visa

⏱️ **Timeline:** 6-12 months
💰 **Estimated Cost:** £5,000-8,000

📋 **Requirements:**
- Nursing degree
- IELTS 7.0+ or OET B+
- Good health & character

Would you like help with IELTS preparation?`;
    }

    if (query.includes('canada')) {
      return `**🇨🇦 Nursing Migration to Canada:**

📌 **Key Steps:**
1. **NCSBN NCLEX-RN** - Same as USA
2. **Credential Assessment** - $350
3. **Provincial Registration** - varies by province
4. **Express Entry** - Points-based immigration
5. **Job offer** - Helps with PR

⏱️ **Timeline:** 12-18 months
💰 **Estimated Cost:** $3,000-6,000

📋 **Provincial Options:**
- British Columbia, Ontario, Alberta, Quebec

Would you like specific provincial requirements?`;
    }

    return `**🌍 Global Nursing Migration:**

I can help you with migration to:
- 🇺🇸 USA - NCLEX, CGFNS, VisaScreen
- 🇬🇧 UK - NMC, IELTS, OSCE
- 🇨🇦 Canada - NCLEX, Express Entry
- 🇦🇺 Australia - AHPRA,Skills Assessment
- 🇮🇪 Ireland - NMBI, IELTS
- 🇸🇦 Saudi Arabia - Prometric exam
- 🇦🇪 UAE - DHA exam

What country are you interested in?
I can provide:
1. Licensing requirements
2. Exam preparation tips
3. Estimated costs & timeline
4. Visa information`;
  }

  private getSkillsResponse(query: string): string {
    if (query.includes('iv') || query.includes('intravenous')) {
      return `**IV Therapy - Key Skills:**

💉 **IV Insertion Tips:**
1. Assess veins - use tourniquet
2. Clean with alcohol - 30 seconds
3. Insert at 15-30 degree angle
4. Flashback = successful venipuncture
5. Release tourniquet, advance catheter

⚠️ **Complications to Monitor:**
- Phlebitis (redness, swelling)
- Infiltration (cool, swollen)
- Infection (fever, pain)
- Air embolism

📊 **IV Calculations:**
- Drip rate = Volume / Time × Drop factor
- Remember: 1 mL = 1 gtt (macrodrip)

Need help with IV calculation practice?`;
    }

    if (query.includes('wound') || query.includes('dressing')) {
      return `**Wound Care - Essential Skills:**

🩹 **Dressing Types:**
- **Dry gauze** - Basic wounds
- **Wet-to-dry** - Debridement
- **Hydrocolloid** - Moisture balance
- **Alginate** - Heavy drainage
- **Silvers** - Infection risk

🔄 **Wound Assessment:**
- Location & size
- Drainage amount & type
- Color (red=yellow=black)
- Odor
- Surrounding skin

📊 **Pressure Injury Stages:**
1. Non-blanchable redness
2. Partial thickness
3. Full thickness
4. Full thickness with exposed bone

Would you like wound care scenarios?`;
    }

    return `**Clinical Skills Essentials:**

🩺 **Core Skills to Master:**
- Vital signs measurement
- IV insertion & management
- Wound care & dressing changes
- Medication administration
- Patient assessment
- Catheterization
- Suctioning

📚 **NCLEX Skills Questions:**
- Focus on patient safety
- Know the "why" behind steps
- Sequence steps correctly
- Identify complications

**Study Tip:** Watch skill videos, then practice in lab!

Which clinical skill would you like to review?`;
  }

  private getGeneralResponse(query: string, context?: string): string {
    const greetings = ['hello', 'hi', 'hey', 'greetings'];
    if (greetings.some(g => query.includes(g))) {
      return `👋 Hello! I'm NurseOrbit AI, your nursing study assistant.

I can help you with:
- 📝 **NCLEX prep** - Questions, strategies, content review
- 🫀 **Anatomy & Physiology** - Body systems, functions
- 💊 **Pharmacology** - Drug classifications, interactions
- 📋 **Care Plans** - Nursing diagnoses, interventions
- 🌍 **Migration** - License requirements, exam prep
- 🩺 **Clinical Skills** - Procedures, techniques

What would you like to learn about today?`;
    }

    if (query.includes('thank')) {
      return `You're welcome! 🎉

Remember, consistent study is key to success:
- Set aside 1-2 hours daily
- Practice questions regularly
- Focus on weak areas
- Join study groups

Good luck with your nursing journey! Feel free to ask more questions.`;
    }

    return `I'm here to help you succeed in your nursing studies! 📚

**What I can assist with:**

🧠 **NCLEX Preparation**
- Practice questions & strategies
- Content review
- Test-taking tips

💉 **Clinical Knowledge**
- Pharmacology
- Anatomy & Physiology
- Pathophysiology
- Nursing interventions

📋 **Care Planning**
- Nursing diagnoses
- Interventions & rationales
- Evaluation

🌍 **Career & Migration**
- Licensing requirements
- Exam preparation
- Job search tips

**Tip:** Be specific with your questions for the best answers!

What would you like to explore?`;
  }

  async getMigrationGuidance(userId: string, targetCountry: string) {
    const migrationProgress = await this.prisma.migrationProgress.findUnique({
      where: { userId },
    });

    const pathways = this.getMigrationPathways(targetCountry);
    const readiness = await this.assessReadiness(userId, targetCountry);
    const recommendations = this.generateRecommendations(migrationProgress, targetCountry);

    return {
      targetCountry,
      currentProgress: migrationProgress,
      pathways,
      readiness,
      recommendations,
    };
  }

  private getMigrationPathways(country: string): MigrationPathway[] {
    const pathways: Record<string, MigrationPathway> = {
      USA: {
        country: 'USA',
        steps: [
          { order: 1, name: 'NCLEX-RN Exam', duration: '3-6 months', cost: 450, requirements: ['Nursing degree', 'English proficiency'] },
          { order: 2, name: 'Credential Evaluation', duration: '2-4 months', cost: 300, requirements: ['Transcripts', 'License verification'] },
          { order: 3, name: 'CGFNS Certificate', duration: '2-3 months', cost: 500, requirements: ['Credential eval', 'NCLEX pass'] },
          { order: 4, name: 'VisaScreen Certificate', duration: '2-3 months', cost: 375, requirements: ['CGFNS', 'English test'] },
          { order: 5, name: 'Job Offer & Visa Application', duration: '3-6 months', cost: 5000, requirements: ['Job offer', 'All certificates'] },
        ],
        totalCost: 6625,
        totalDuration: '12-22 months',
      },
      UK: {
        country: 'UK',
        steps: [
          { order: 1, name: 'IELTS/OET Exam', duration: '2-3 months', cost: 400, requirements: ['English proficiency'] },
          { order: 2, name: 'NMC Registration', duration: '2-4 months', cost: 763, requirements: ['IELTS/OET', 'Nursing degree'] },
          { order: 3, name: 'CBT Exam', duration: '1-2 months', cost: 450, requirements: ['NMC approval'] },
          { order: 4, name: 'OSCE Exam', duration: '1 month', cost: 2500, requirements: ['CBT pass'] },
          { order: 5, name: 'Visa Application', duration: '3-4 months', cost: 3000, requirements: ['NMC registration', 'Job offer'] },
        ],
        totalCost: 7113,
        totalDuration: '9-16 months',
      },
      Canada: {
        country: 'Canada',
        steps: [
          { order: 1, name: 'NCLEX-RN Exam', duration: '3-6 months', cost: 450, requirements: ['Nursing degree'] },
          { order: 2, name: 'Credential Assessment', duration: '2-4 months', cost: 350, requirements: ['Transcripts'] },
          { order: 3, name: 'BRN Registration', duration: '2-3 months', cost: 500, requirements: ['Credential assessment'] },
          { order: 4, name: 'Language Test', duration: '1-2 months', cost: 400, requirements: ['IELTS or CELPIP'] },
          { order: 5, name: 'Visa & Work Permit', duration: '4-8 months', cost: 4000, requirements: ['Job offer', 'All docs'] },
        ],
        totalCost: 5700,
        totalDuration: '12-23 months',
      },
      Australia: {
        country: 'Australia',
        steps: [
          { order: 1, name: 'AHPRA Registration', duration: '3-4 months', cost: 500, requirements: ['Nursing degree', 'English test'] },
          { order: 2, name: 'Skills Assessment', duration: '2-3 months', cost: 400, requirements: ['AHPRA letter'] },
          { order: 3, name: 'English Test', duration: '1-2 months', cost: 400, requirements: ['IELTS/OET/PEP'] },
          { order: 4, name: 'Visa Application', duration: '4-8 months', cost: 5000, requirements: ['Skills assessment', 'Job offer'] },
        ],
        totalCost: 6300,
        totalDuration: '10-17 months',
      },
    };

    return pathways[country] ? [pathways[country]] : Object.values(pathways);
  }

  private async assessReadiness(userId: string, targetCountry: string): Promise<ReadinessAssessment> {
    const progress = await this.prisma.migrationProgress.findUnique({ where: { userId } });
    
    if (!progress) {
      return {
        score: 0,
        gaps: ['No migration progress recorded'],
        recommendations: ['Start by setting your target country and tracking your exams'],
      };
    }

    let score = 0;
    const gaps: string[] = [];
    const recommendations: string[] = [];

    if (targetCountry === 'USA') {
      if (progress.nclexStatus === 'COMPLETED' && progress.nclexScore && progress.nclexScore >= 75) {
        score += 25;
      } else {
        gaps.push('NCLEX-RN not passed or score below target');
        recommendations.push('Focus on NCLEX preparation - aim for score of 75+');
      }
    }

    if (progress.ieltsStatus === 'COMPLETED' && progress.ieltsScore && progress.ieltsScore >= 7.0) {
      score += 20;
    } else if (progress.ieltsStatus !== 'NOT_STARTED') {
      gaps.push('IELTS score below requirement (7.0)');
      recommendations.push('Retake IELTS targeting 7.0+ in all bands');
    }

    if (progress.credentialEvalStatus === 'COMPLETED') {
      score += 20;
    } else {
      gaps.push('Credential evaluation not completed');
      recommendations.push('Submit credentials for evaluation');
    }

    if (progress.visaStatus !== 'NOT_STARTED') {
      score += 15;
    }

    if (score >= 40) {
      score += 20;
    } else {
      recommendations.push('Complete all requirements before applying for jobs');
    }

    return { score, gaps, recommendations };
  }

  private generateRecommendations(progress: any, targetCountry: string): string[] {
    const recommendations: string[] = [];
    
    if (!progress) return ['Start your migration journey by setting a target country'];

    if (progress.nclexStatus === 'IN_PROGRESS') {
      recommendations.push('Continue NCLEX preparation - take practice exams weekly');
    }

    if (progress.ieltsStatus === 'IN_PROGRESS' || progress.ieltsScore && progress.ieltsScore < 7) {
      recommendations.push('Focus on English test preparation - consider taking a preparation course');
    }

    if (progress.readinessScore >= 70) {
      recommendations.push('You appear ready! Start applying to hospitals and agencies');
    }

    return recommendations;
  }

  async getCareerGuidance(userId: string, query: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const examAttempts = await this.prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const response = this.generateCareerResponse(query, user, examAttempts);

    await this.prisma.aIGuidanceSession.create({
      data: {
        userId,
        agentType: 'CAREER_GUIDANCE',
        query,
        response: JSON.stringify(response),
      },
    });

    return response;
  }

  private generateCareerResponse(query: string, user: any, examAttempts: any[]) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('salary') || lowerQuery.includes('earning')) {
      return {
        answer: 'Nurses in the US earn an average of $75,000-$120,000 annually depending on location and specialty. Starting salaries typically range from $60,000-$75,000.',
        data: { averageSalary: 90000, range: [60000, 120000], currency: 'USD' },
      };
    }

    if (lowerQuery.includes('specialty') || lowerQuery.includes('best')) {
      return {
        answer: 'High-demand specialties include ICU, Emergency Room, Operating Room, and Labor & Delivery. These offer higher salaries and better job security.',
        specialties: [
          { name: 'ICU', avgSalary: 95000, demand: 'High' },
          { name: 'ER', avgSalary: 85000, demand: 'Very High' },
          { name: 'OR', avgSalary: 90000, demand: 'High' },
          { name: 'Labor & Delivery', avgSalary: 80000, demand: 'High' },
        ],
      };
    }

    if (examAttempts.length > 0) {
      const avgScore = examAttempts.reduce((sum, e) => sum + e.score, 0) / examAttempts.length;
      if (avgScore < 70) {
        return {
          answer: 'Based on your recent exam performance, I recommend focusing on fundamentals and taking a structured preparation course.',
          recommendation: 'Consider starting with adaptive learning modules',
        };
      }
    }

    return {
      answer: 'I recommend exploring our exam prep modules and connecting with experienced mentors in your target specialty.',
      nextSteps: ['Take a diagnostic assessment', 'Join study groups', 'Schedule mentor consultation'],
    };
  }

  async getChurnPrediction(userId: string) {
    const activities = await this.prisma.studyActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    if (activities.length < 3) {
      return {
        risk: 'HIGH',
        score: 80,
        reasons: ['Very low activity', 'New user not engaged'],
        recommendations: ['Send welcome series', 'Offer first-week incentives', 'Prompt goal setting'],
      };
    }

    const recentActivity = activities.slice(0, 7);
    const olderActivity = activities.slice(7, 30);
    
    const recentCount = recentActivity.length;
    const olderCount = olderActivity.length;

    if (recentCount === 0) {
      return {
        risk: 'HIGH',
        score: 90,
        reasons: ['No activity in last 7 days'],
        recommendations: ['Send re-engagement notification', 'Offer personalized study plan', 'Highlight progress made'],
      };
    }

    if (recentCount < olderCount / 2) {
      return {
        risk: 'MEDIUM',
        score: 60,
        reasons: ['Declining activity pattern'],
        recommendations: ['Send motivational content', 'Remind of goals', 'Offer achievement rewards'],
      };
    }

    return {
      risk: 'LOW',
      score: 20,
      reasons: [],
      recommendations: ['Continue current engagement strategies'],
    };
  }

  async createStudyActivity(userId: string, activityType: string, duration: number, metadata?: any) {
    return this.prisma.studyActivity.create({
      data: {
        userId,
        activityType,
        duration,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }
}
