import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAlN1EleApuTDHkr-LwEufCRS4q8ouy9rs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

const dailyContentPrompts = {
  drug: `You are a nursing pharmacology expert. Provide a brief drug spotlight for nursing students. 

Respond with ONLY a JSON object (no other text) in this exact format:
{
  "name": "Drug Name",
  "classification": "Drug Classification",
  "indication": "Primary indication in 1 sentence",
  "dosage": "Common adult dosage",
  "sideEffects": ["Side effect 1", "Side effect 2", "Side effect 3"],
  "nursingConsiderations": "2-3 key nursing points for this medication"
}

Choose a different commonly used medication each day. Focus on medications nurses encounter frequently in clinical practice.`,
  
  tip: `You are an expert nursing educator. Provide a valuable clinical tip for nursing students.

Respond with ONLY a JSON object (no other text) in this exact format:
{
  "title": "Tip Title",
  "category": "Category (one of: Clinical, Safety, Communication, Documentation, Skills)",
  "content": "The tip content in 2-3 sentences",
  "keyPoints": ["Point 1", "Point 2", "Point 3"]
}

Make it practical and useful for new nurses or nursing students.`,
  
  focus: `You are a nursing education expert. Provide a daily learning focus area.

Respond with ONLY a JSON object (no other text) in this exact format:
{
  "title": "Focus Area Title",
  "subject": "Subject (e.g., Pharmacology, Cardiac, Pediatrics)",
  "description": "Brief description of what to focus on today",
  "tasks": ["Task 1", "Task 2", "Task 3"],
  "ncingelQuestion": "A sample NCLEX-style question about this topic with answer"
}

Today's date will be used to seed different topics.`
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'drug';
  
  try {
    const prompt = dailyContentPrompts[type as keyof typeof dailyContentPrompts];
    
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

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
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to get AI content',
        details: errorData 
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json({ error: 'Invalid API response' }, { status: 500 });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(aiResponse);
    } catch {
      parsedContent = { raw: aiResponse };
    }

    return NextResponse.json({ 
      content: parsedContent,
      type,
      date: new Date().toISOString(),
      success: true
    });

  } catch (error) {
    console.error('Daily content API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
