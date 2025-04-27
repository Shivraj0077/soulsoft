"use client";
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/ChatBot.module.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isMarathiTTSAvailable, setIsMarathiTTSAvailable] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Handle language selection
  const handleLanguageSelect = (language) => {
    const lang = language.toLowerCase();
    setSelectedLanguage(lang);
    const welcomeMessage =
      lang === 'english'
        ? 'Hi there! How can I help you today?'
        : lang === 'hindi'
        ? 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?'
        : 'नमस्कार! मी आपल्याला कशाप्रकारे मदत करू शकतो?';
    setMessages([
      { type: 'user', text: `Selected ${language}` },
      { type: 'bot', text: welcomeMessage },
    ]);
  };

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedLanguage) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language: selectedLanguage }),
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { type: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Chat API error:', error);
      const errorMessage =
        selectedLanguage === 'english'
          ? 'Sorry, something went wrong. Please try again.'
          : selectedLanguage === 'hindi'
          ? 'क्षमा करें, कुछ गलत हुआ। कृपया पुनः प्रयास करें।'
          : 'माफ करा, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.';
      setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle voice input (start/stop)
  const toggleVoiceInput = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        setIsListening(false);
      }
      return;
    }

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      const errorMessage =
        selectedLanguage === 'hindi'
          ? 'क्षमा करें, यह ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता।'
          : selectedLanguage === 'marathi'
          ? 'माफ करा, हा ब्राउझर व्हॉइस इनपुटला समर्थन देत नाही.'
          : 'Sorry, this browser does not support voice input.';
      setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang =
        selectedLanguage === 'hindi' ? 'hi-IN' : selectedLanguage === 'marathi' ? 'mr-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        recognitionRef.current = null;
        const errorMessage =
          selectedLanguage === 'hindi'
            ? 'वॉयस इनपुट में त्रुटि। कृपया पुनः प्रयास करें।'
            : selectedLanguage === 'marathi'
            ? 'व्हॉइस इनपुटमध्ये त्रुटी. कृपया पुन्हा प्रयत्न करा.'
            : 'Error with voice input. Please try again.';
        setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        recognitionRef.current = null;
        console.log('Speech recognition result:', transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        console.log('Speech recognition ended');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Microphone permission error:', error);
      const errorMessage =
        selectedLanguage === 'hindi'
          ? 'माइक्रोफोन अनुमति अस्वीकृत। कृपया अनुमति दें और पुनः प्रयास करें।'
          : selectedLanguage === 'marathi'
          ? 'मायक्रोफोन परवानगी नाकारली. कृपया परवानगी द्या आणि पुन्हा प्रयत्न करा.'
          : 'Microphone permission denied. Please allow access and try again.';
      setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
    }
  };

  // Handle text-to-speech with female voice preference
  const speakMessage = (text) => {
    if (!window.speechSynthesis) {
      const errorMessage =
        selectedLanguage === 'hindi'
          ? 'क्षमा करें, यह ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता।'
          : selectedLanguage === 'marathi'
          ? 'माफ करा, हा ब्राउझर टेक्स्ट-टू-स्पीचला समर्थन देत नाही.'
          : 'Sorry, this browser does not support text-to-speech.';
      setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    console.log('Available voices:', voices.map((v) => ({ name: v.name, lang: v.lang })));

    const utterance = new SpeechSynthesisUtterance(text);
    let targetLang = selectedLanguage === 'hindi' ? 'hi-IN' : selectedLanguage === 'marathi' ? 'mr-IN' : 'en-US';
    
    // Prioritize female voices
    let voice = voices.find((v) => 
      v.lang.toLowerCase().startsWith(targetLang.split('-')[0]) &&
      (v.name.toLowerCase().includes('female') || 
       v.name.includes('Google US English') || 
       v.name.includes('Google हिन्दी') || 
       v.name.includes('Samantha') || 
       v.name.includes('Tessa'))
    );

    // If no female voice for the language, try any voice for the language
    if (!voice) {
      voice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));
    }

    // Handle Marathi specifically
    if (!voice && selectedLanguage === 'marathi') {
      // Fallback to English female voice
      voice = voices.find((v) => 
        v.lang.toLowerCase().startsWith('en') && 
        (v.name.toLowerCase().includes('female') || 
         v.name.includes('Google US English') || 
         v.name.includes('Samantha') || 
         v.name.includes('Tessa'))
      );
      targetLang = 'en-US';
      setIsMarathiTTSAvailable(false);
      const errorMessage =
        selectedLanguage === 'marathi'
          ? 'माफ करा, मराठी टेक्स्ट-टू-स्पीच उपलब्ध नाही. इंग्रजी महिला आवाज वापरत आहे.'
          : 'Sorry, Marathi text-to-speech is not available. Using English female voice.';
      setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
    }

    // General fallback if no voice is found
    if (!voice) {
      voice = voices.find((v) => 
        v.lang.toLowerCase().startsWith('en') && 
        (v.name.toLowerCase().includes('female') || 
         v.name.includes('Google US English') || 
         v.name.includes('Samantha') || 
         v.name.includes('Tessa'))
      );
      targetLang = 'en-US';
      if (!voice) {
        voice = voices.find((v) => v.lang.toLowerCase().startsWith('en')); // Last resort: any English voice
      }
      const errorMessage =
        selectedLanguage === 'hindi'
          ? 'क्षमा करें, महिला आवाज उपलब्ध नहीं है. इंग्रजी आवाज वापरत आहे.'
          : selectedLanguage === 'marathi'
          ? 'माफ करा, महिला आवाज उपलब्ध नाही. इंग्रजी आवाज वापरत आहे.'
          : 'Sorry, female voice not available. Using English voice.';
      setMessages((prev) => [...prev, { type: 'bot', text: errorMessage }]);
    }

    utterance.lang = targetLang;
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    if (voice) {
      utterance.voice = voice;
      console.log('Selected voice:', { name: voice.name, lang: voice.lang });
    }

    window.speechSynthesis.speak(utterance);
  };

  // Load voices and check Marathi availability
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const hasMarathiVoice = voices.some((v) => v.lang.toLowerCase().startsWith('mr'));
      setIsMarathiTTSAvailable(hasMarathiVoice);
      console.log('Marathi TTS available:', hasMarathiVoice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className={styles.chatWidget}>
      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>
              {selectedLanguage === 'hindi'
                ? 'सहायता चैट'
                : selectedLanguage === 'marathi'
                ? 'सहायता चॅट'
                : 'Support Chat'}
            </h3>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {!selectedLanguage && (
              <div className={styles.options}>
                <p>Please select a language:</p>
                <div className={styles.buttons}>
                  <button
                    className={styles.optionButton}
                    onClick={() => handleLanguageSelect('English')}
                  >
                    English
                  </button>
                  <button
                    className={styles.optionButton}
                    onClick={() => handleLanguageSelect('Hindi')}
                  >
                    Hindi
                  </button>
                  <button
                    className={styles.optionButton}
                    onClick={() => handleLanguageSelect('Marathi')}
                  >
                    Marathi
                  </button>
                </div>
              </div>
            )}
            {selectedLanguage &&
              messages.map((message, index) => (
                <div
                  key={index}
                  className={message.type === 'user' ? styles.userMessage : styles.botMessage}
                >
                  <div className={styles.messageContent}>
                    <p>{message.text}</p>
                    {(selectedLanguage !== 'marathi' || isMarathiTTSAvailable) && (
                      <button
                        className={styles.speakerButton}
                        onClick={() => speakMessage(message.text)}
                        title="Listen to message"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" height="20" width="20">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            {loading && (
              <div className={styles.botMessage}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {selectedLanguage && (
            <form onSubmit={handleSendMessage} className={styles.inputForm}>
              {isListening && (
                <div className={styles.listeningIndicator}>
                  <span>Listening...</span>
                </div>
              )}
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    selectedLanguage === 'hindi'
                      ? 'अपना संदेश यहां टाइप करें...'
                      : selectedLanguage === 'marathi'
                      ? 'तुमचा संदेश येथे टाईप करा...'
                      : 'Type your message here...'
                  }
                  className={styles.chatInput}
                  disabled={isListening}
                />
                <button
                  type="button"
                  className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
                  onClick={toggleVoiceInput}
                  disabled={!selectedLanguage}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? '✖' : '🎤'}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || !selectedLanguage || isListening}
                  className={styles.sendButton}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)}>
        <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
          {isOpen ? (
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          ) : (
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          )}
        </svg>
      </button>
    </div>
  );
}