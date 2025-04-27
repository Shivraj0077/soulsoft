import { GoogleGenAI } from "@google/genai";
import { companyInfo, companyInfoHindi } from "./companyData";

// Initialize the Google GenAI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateChatResponse(message, language) {
  try {
    // Select the appropriate company information based on language
    const info = language === 'hindi' ? companyInfoHindi : companyInfo;
    
    // Create a context that includes company information
    const companyContext = JSON.stringify(info);
    
    // Create a prompt based on language
    let prompt = "";
    if (language === 'hindi') {
      prompt = `तुम एक सहायक एजेंट हो जो हिंदी में उत्तर देता है। नीचे दी गई कंपनी की जानकारी का उपयोग करके उपयोगकर्ता के प्रश्नों का उत्तर दें। अगर कोई सवाल कंपनी से संबंधित नहीं है, तो बताएं कि आप केवल कंपनी के बारे में जानकारी प्रदान कर सकते हैं।\n\nकंपनी की जानकारी:\n${companyContext}\n\nप्रश्न: ${message}`;
    } else {
      prompt = `You are a helpful assistant for an agency. Use the company information provided below to answer user questions. If a question is not related to the company, politely inform that you can only provide information about the company.\n\nCompany Information:\n${companyContext}\n\nQuestion: ${message}`;
    }
    
    // Generate content using the model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate response from Gemini');
  }
}