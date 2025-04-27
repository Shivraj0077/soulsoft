import { NextResponse } from 'next/server';
import { generateChatResponse } from '../../../../lib/geminiAPI';

export async function POST(request) {
  try {
    const { message, language } = await request.json();
    
    if (!message || !language) {
      return NextResponse.json(
        { error: 'Message and language are required' },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(message, language);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}