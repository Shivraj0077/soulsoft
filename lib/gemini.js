import axios from 'axios';

export const callGeminiAPI = async (input) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: input }] }],
      }
    );
    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    return 'Sorry, I could not process your request. Please try again.';
  }
};