import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Company information (same as in Chatbot component)
const companyInfo = `
Company Name: Your Company Name
About: Your Company Name is a leading provider of innovative software solutions, specializing in agricultural technology, e-commerce, and digital marketing services. Founded in 2010, we aim to empower businesses with cutting-edge tools.
Products: Shetkari Krushi Software, Shopcare, Kbazzar, Pharma Chemist
Services: Web Design & Development, Digital Marketing, E-commerce Development, Android App Development, LMS, CRM Solutions
Contact: support@yourcompany.com, +91-123-456- systemie
Website: https://yourcompany.com
`;

export async function POST(request) {
  try {
    const { prompt, language } = await request.json();
    console.log('Received Gemini API request:', { prompt, language });

    if (!prompt) {
      console.log('Error: No prompt provided');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Construct the prompt with company info and language
    const fullPrompt = `
You are a customer support chatbot for Your Company Name. Use the following company information to answer questions accurately and professionally. Respond in the language specified (${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Marathi'}). Keep responses concise and friendly. If the user asks about something unrelated to the company, provide a helpful and relevant response.

Company Information:
${companyInfo}

User Prompt: ${prompt}
`;

    console.log('Sending prompt to Gemini API:', fullPrompt);
    const result = await model.generateContent(fullPrompt);
    const responseText = await result.response.text();
    console.log('Gemini API response:', responseText);

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ error: 'Failed to get response from Gemini API' }, { status: 500 });
  }
}