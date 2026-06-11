import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAlN1EleApuTDHkr-LwEufCRS4q8ouy9rs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

const systemPrompt = `You are an expert nursing AI Study Tutor. You help nursing students prepare for exams like NCLEX-RN, understand clinical concepts, and learn nursing skills.

Your responses should be:
- Educational and comprehensive
- Include nursing-specific terminology
- Use clear, numbered lists for steps
- Include memory aids where helpful
- Be encouraging and supportive

You have knowledge about:
- NCLEX-RN exam preparation
- Anatomy & Physiology
- Pharmacology (drug classifications, dosages, side effects)
- Pathophysiology (disease processes)
- Nursing Care Plans
- Clinical Skills and Procedures
- Vital signs monitoring
- Patient assessment
- Emergency response
- Various nursing specialties (ICU, Pediatrics, ER, etc.)

Format your responses with:
- **Bold** for important terms
- Numbered lists for procedures
- Clear headings
- Memory tips when applicable`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const fullPrompt = context 
      ? `${systemPrompt}\n\nContext: ${context}\n\nUser question: ${message}`
      : `${systemPrompt}\n\nUser question: ${message}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
        'Api-Revision': '2026-05-20',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get AI response',
        details: errorData 
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json({ error: 'Invalid API response' }, { status: 500 });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ 
      response: aiResponse,
      success: true
    });

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
