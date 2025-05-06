// services/geminiService.js

export async function generateGeminiResponse(prompt, language = 'en') {
    try {
      // Replace with your actual API key and endpoint
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      
      // Set content based on selected language
      let systemPrompt = "You are a helpful customer support chatbot. ";
      
      if (language === 'hi') {
        systemPrompt += "Respond in Hindi.";
      } else if (language === 'mr') {
        systemPrompt += "Respond in Marathi.";
      } else {
        systemPrompt += "Respond in English.";
      }
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          systemInstructions: {
            parts: [
              {
                text: systemPrompt
              }
            ]
          },
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        }),
      });
  
      const data = await response.json();
      
      if (data.error) {
        console.error('Gemini API error:', data.error);
        return {
          success: false,
          message: 'Error generating response',
          error: data.error
        };
      }
      
      return {
        success: true,
        message: data.candidates[0].content.parts[0].text
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        success: false,
        message: 'Error processing your request',
        error: error.message
      };
    }
  }