// contexts/ChatbotContext.jsx
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { generateGeminiResponse } from '../ksk/services/geminiService';
import { sendAppointmentEmail } from '../utils/emailService';

const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentState, setCurrentState] = useState('mainMenu');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  // Function to process user input with Gemini API
  const processMessage = async (message, state, lang) => {
    setIsLoading(true);
    try {
      // Create context for Gemini API
      const context = `
        Current state: ${state}
        User language preference: ${lang}
        User message: ${message}
      `;
      
      const response = await generateGeminiResponse(context, lang);
      
      if (response.success) {
        return response.message;
      } else {
        console.error('Error from Gemini API:', response.error);
        return lang === 'en' 
          ? "Sorry, I couldn't process your request. Please try again."
          : lang === 'hi'
            ? "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।"
            : "क्षमा करा, मी आपल्या विनंतीवर प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.";
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return lang === 'en' 
        ? "I'm having trouble connecting. Please try again later."
        : lang === 'hi'
          ? "मुझे कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
          : "मला कनेक्ट करण्यात अडचण येत आहे. कृपया नंतर पुन्हा प्रयत्न करा.";
    } finally {
      setIsLoading(false);
    }
  };

  // Function to schedule appointment
  const scheduleAppointment = async (userEmail, appointmentDetails) => {
    console.log('Scheduling appointment with details:',userEmail, appointmentDetails);
    try {
      const result = await sendAppointmentEmail(userEmail, appointmentDetails);
      return result;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      return {
        success: false,
        message: 'Failed to schedule appointment'
      };
    }
  };

  const value = {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    currentState,
    setCurrentState,
    language,
    setLanguage,
    isLoading,
    setIsLoading,
    processMessage,
    scheduleAppointment
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);