import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Company information (same as in Chatbot component)
const companyInfo = `
Our pricing for services is as follows: Web Development ranges from ₹25,000 to ₹1,50,000. Mobile App Development is priced between ₹60,000 and ₹5,00,000. Custom Software Development costs range from ₹75,000 to ₹7,00,000. Digital Marketing services are available on a monthly retainer basis from ₹10,000 to ₹1,00,000. Billing Software development is priced between ₹30,000 and ₹1,00,000. E-commerce Website or App solutions range from ₹50,000 to ₹4,00,000. LMS Development services are available between ₹70,000 and ₹4,00,000. CRM Development projects range from ₹80,000 to ₹5,00,000.

Soulsoft Infotech Pvt. Ltd., established in 2011 and incorporated in 2020 (CIN: U72900PN2020PTC197158), is a trusted name in the IT services sector. Our registered office is located at Pune Nashik Road, Chandanapur, Sangamner, Maharashtra – 422605, while our corporate office operates from Top-Ten Imperial, College Road, Sangamner – 422605.

With over 14+ years of experience, we have successfully delivered 3000+ projects through a team of 20 to 50 skilled professionals, offering 24x7 client support. We specialize in a wide range of services including Web Design & Development using technologies like HTML, CSS, JavaScript, PHP, MySQL, and Bootstrap; Android App Development; E-commerce Solutions; POS Billing Software for retail, pharma, agri, and grocery domains; Digital Marketing services covering SEO, Social Media, and Google Ads; CRM and Custom Software Development; and Learning Management Systems (LMS) tailored for online education and training.

Our flagship POS products include Shetkari Krushi Software for agri-businesses and fertilizer stores, Shopcare Billing Software for retail shops, K-Bazaar Billing Software for supermarkets and grocery stores, and Pharma-Chemist Vision designed for pharmacies and medical stores.

We also provide internship and training programs for students from BE, BSc (IT), BCA, MCA, and MCS backgrounds. These programs cover a practical tech stack including PHP, MySQL, Bootstrap, HTML/CSS, and Android, and offer live projects, certification, and placement support.

Our development process is streamlined into clear phases: Requirement Gathering, Prototype & Planning, Design & Development, Testing & Quality Assurance, Deployment, and ongoing Support & Maintenance.

Driven by a clear vision “to revolutionize service delivery using innovative tech solutions” and a mission “to deliver effective, budget-friendly, and client-focused IT solutions,” Soulsoft Infotech continues to empower businesses across industries.

You can reach us at +91 85307 98679 / +91 80557 98579, email us at soulsoftinfotech@gmail.com, or visit our website at https://soulsoft.in.

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