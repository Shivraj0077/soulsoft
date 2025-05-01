'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, ChevronUp, ChevronDown, X } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
];

// Translations for UI elements
const translations = {
  en: {
    placeholder: 'Type your message...',
    chatbotHeader: 'Customer Support',
    listening: 'Listening...',
    sendMessage: 'Send message',
    startVoice: 'Start voice input',
    stopVoice: 'Stop voice input',
    minimizeChat: 'Minimize chat',
    maximizeChat: 'Maximize chat',
    closeChat: 'Close chat',
    selectLanguage: 'Select Language',
    mainMenu: 'Main Menu',
    products: 'Products',
    services: 'Services',
    support: 'Support & AMC',
    contact: 'Contact Customer Care',
    emailLabel: 'Please enter your email:',
    emailSubmit: 'Submit',
    invalidEmail: 'Please enter a valid email address',
    appointmentConfirm: 'Your appointment has been scheduled. You will receive an email confirmation shortly.',
    typeNumber: 'Type a number to select an option',
    errorMessage: 'Sorry, there was an error processing your request.',
    purchaseRedirect: 'this is your purchase link',
    demoLink: 'Here is the demo link for the selected product.',
    phoneNumber: 'Contact us at: +91-123-456-7890',
    emailContact: 'Email us at: support@example.com',
  },
  hi: {
    placeholder: 'अपना संदेश लिखें...',
    chatbotHeader: 'ग्राहक सहायता',
    listening: 'सुन रहा हूँ...',
    sendMessage: 'संदेश भेजें',
    startVoice: 'वॉइस इनपुट शुरू करें',
    stopVoice: 'वॉइस इनपुट बंद करें',
    minimizeChat: 'चैट को छोटा करें',
    maximizeChat: 'चैट को बड़ा करें',
    closeChat: 'चैट बंद करें',
    selectLanguage: 'भाषा चुनें',
    mainMenu: 'मुख्य मेनू',
    products: 'उत्पाद',
    services: 'सेवाएँ',
    support: 'सहायता और AMC',
    contact: 'ग्राहक सेवा से संपर्क करें',
    emailLabel: 'कृपया अपना ईमेल दर्ज करें:',
    emailSubmit: 'सबमिट करें',
    invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    appointmentConfirm: 'आपका अपॉइंटमेंट शेड्यूल कर दिया गया है। आपको जल्द ही ईमेल पुष्टिकरण प्राप्त होगा।',
    typeNumber: 'कोई विकल्प चुनने के लिए एक नंबर टाइप करें',
    errorMessage: 'क्षमा करें, आपके अनुरोध को संसाधित करने में एक त्रुटि हुई थी।',
    purchaseRedirect: 'खरीद पृष्ठ पर पुनर्निर्देशित हो रहा है...',
    demoLink: 'चयनित उत्पाद के लिए डेमो लिंक यहाँ है।',
    phoneNumber: 'हमसे संपर्क करें: +91-123-456-7890',
    emailContact: 'हमें ईमेल करें: support@example.com',
  },
  mr: {
    placeholder: 'आपला संदेश टाइप करा...',
    chatbotHeader: 'ग्राहक सहाय्य',
    listening: 'ऐकत आहे...',
    sendMessage: 'संदेश पाठवा',
    startVoice: 'व्हॉइस इनपुट सुरू करा',
    stopVoice: 'व्हॉइस इनपुट थांबवा',
    minimizeChat: 'चॅट कमी करा',
    maximizeChat: 'चॅट वाढवा',
    closeChat: 'चॅट बंद करा',
    selectLanguage: 'भाषा निवडा',
    mainMenu: 'मुख्य मेनू',
    products: 'उत्पादने',
    services: 'सेवा',
    support: 'सहाय्य आणि AMC',
    contact: 'ग्राहक सेवा संपर्क',
    emailLabel: 'कृपया आपला ईमेल प्रविष्ट करा:',
    emailSubmit: 'सबमिट करा',
    invalidEmail: 'कृपया वैध ईमेल पत्ता प्रविष्ट करा',
    appointmentConfirm: 'आपली भेट निश्चित केली आहे. आपल्याला लवकरच ईमेल पुष्टी मिळेल.',
    typeNumber: 'पर्याय निवडण्यासाठी एक क्रमांक टाइप करा',
    errorMessage: 'क्षमा करा, आपल्या विनंतीवर प्रक्रिया करताना त्रुटी आली.',
    purchaseRedirect: 'खरेदी पृष्ठावर पुनर्निर्देशित होत आहे...',
    demoLink: 'निवडलेल्या उत्पादनासाठी डेमो लिंक येथे आहे.',
    phoneNumber: 'आमच्याशी संपर्क साधा: +91-123-456-7890',
    emailContact: 'आम्हाला ईमेल करा: support@example.com',
  },
};

// Chatbot flow data (unchanged from your provided code)
const chatbotFlowData = {
  mainMenu: {
    options: [
      { id: '1', name: { en: 'Products', hi: 'उत्पाद', mr: 'उत्पादने' }, nextState: 'products' },
      { id: '2', name: { en: 'Services', hi: 'सेवाएँ', mr: 'सेवा' }, nextState: 'services' },
      { id: '3', name: { en: 'Support & AMC', hi: 'सहायता और AMC', mr: 'सहाय्य आणि AMC' }, nextState: 'support' },
      { id: '4', name: { en: 'Contact Customer Care', hi: 'ग्राहक सेवा से संपर्क करें', mr: 'ग्राहक सेवा संपर्क' }, nextState: 'contact' },
    ],
  },
  products: {
    options: [
      { id: '1', name: { en: 'Shetkari Krushi Software', hi: 'शेतकरी कृषि सॉफ्टवेयर', mr: 'शेतकरी कृषी सॉफ्टवेअर' }, nextState: 'productOptions' },
      { id: '2', name: { en: 'Shopcare', hi: 'शॉपकेयर', mr: 'शॉपकेअर' }, nextState: 'productOptions' },
      { id: '3', name: { en: 'Kbazzar', hi: 'के-बाज़ार', mr: 'के-बाजार' }, nextState: 'productOptions' },
      { id: '4', name: { en: 'Pharma Chemist', hi: 'फार्मा केमिस्ट', mr: 'फार्मा केमिस्ट' }, nextState: 'productOptions' },
      { id: '5', name: { en: 'Back to Main Menu', hi: 'मुख्य मेनू पर वापस जाएं', mr: 'मुख्य मेनू वर परत जा' }, nextState: 'mainMenu' },
    ],
  },
  productOptions: {
    options: [
      { id: '1', name: { en: 'Purchase Now', hi: 'अभी खरीदें', mr: 'आता खरेदी करा' }, nextState: 'purchase' },
      { id: '2', name: { en: 'View Demo', hi: 'डेमो देखें', mr: 'डेमो पहा' }, nextState: 'viewDemo' },
      { id: '3', name: { en: 'Book Online Demo', hi: 'ऑनलाइन डेमो बुक करें', mr: 'ऑनलाइन डेमो बुक करा' }, nextState: 'bookDemo' },
      { id: '4', name: { en: 'Contact Customer Care', hi: 'ग्राहक सेवा से संपर्क करें', mr: 'ग्राहक सेवा संपर्क' }, nextState: 'contact' },
      { id: '5', name: { en: 'Back to Products', hi: 'उत्पादों पर वापस जाएं', mr: 'उत्पादने वर परत जा' }, nextState: 'products' },
    ],
  },
  services: {
    options: [
      { id: '1', name: { en: 'Web Design & Development', hi: 'वेब डिज़ाइन और डेवलपमेंट', mr: 'वेब डिझाइन आणि डेव्हलपमेंट' }, nextState: 'serviceOptions' },
      { id: '2', name: { en: 'Digital Marketing', hi: 'डिजिटल मार्केटिंग', mr: 'डिजिटल मार्केटिंग' }, nextState: 'serviceOptions' },
      { id: '3', name: { en: 'E-commerce Development', hi: 'ई-कॉमर्स डेवलपमेंट', mr: 'ई-कॉमर्स डेव्हलपमेंट' }, nextState: 'serviceOptions' },
      { id: '4', name: { en: 'Android App Development', hi: 'एंड्रॉइड ऐप डेवलपमेंट', mr: 'अँड्रॉइड अॅप डेव्हलपमेंट' }, nextState: 'serviceOptions' },
      { id: '5', name: { en: 'Learning Management System (LMS)', hi: 'लर्निंग मैनेजमेंट सिस्टम (LMS)', mr: 'लर्निंग मॅनेजमेंट सिस्टम (LMS)' }, nextState: 'serviceOptions' },
      { id: '6', name: { en: 'CRM Solutions', hi: 'CRM समाधान', mr: 'CRM समाधान' }, nextState: 'serviceOptions' },
      { id: '7', name: { en: 'Back to Main Menu', hi: 'मुख्य मेनू पर वापस जाएं', mr: 'मुख्य मेनू वर परत जा' }, nextState: 'mainMenu' },
    ],
  },
  serviceOptions: {
    options: [
      { id: '1', name: { en: 'Contact for Consultation', hi: 'परामर्श के लिए संपर्क करें', mr: 'सल्ल्यासाठी संपर्क करा' }, nextState: 'contact' },
      { id: '2', name: { en: 'Book Appointment', hi: 'अपॉइंटमेंट बुक करें', mr: 'अपॉइंटमेंट बुक करा' }, nextState: 'bookDemo' },
      { id: '3', name: { en: 'Chat with Expert', hi: 'विशेषज्ञ से चैट करें', mr: 'तज्ञांशी चॅट करा' }, nextState: 'expertChat' },
      { id: '4', name: { en: 'Back to Services', hi: 'सेवाओं पर वापस जाएं', mr: 'सेवा वर परत जा' }, nextState: 'services' },
    ],
  },
  support: {
    options: [
      { id: '1', name: { en: 'After Purchase Support', hi: 'खरीदारी के बाद सहायता', mr: 'खरेदी नंतर सहाय्य' }, nextState: 'contactSupport' },
      { id: '2', name: { en: 'Sales Related Queries', hi: 'बिक्री संबंधित प्रश्न', mr: 'विक्री संबंधित प्रश्न' }, nextState: 'contactSupport' },
      { id: '3', name: { en: 'GST Report Issues', hi: 'GST रिपोर्ट समस्याएं', mr: 'GST रिपोर्ट समस्या' }, nextState: 'contactSupport' },
      { id: '4', name: { en: 'Contact Customer Support', hi: 'ग्राहक सहायता से संपर्क करें', mr: 'ग्राहक सहाय्य संपर्क' }, nextState: 'contact' },
      { id: '5', name: { en: 'AMC (Annual Maintenance Contract)', hi: 'AMC (वार्षिक रखरखाव अनुबंध)', mr: 'AMC (वार्षिक देखभाल करार)' }, nextState: 'amc' },
      { id: '6', name: { en: 'Back to Main Menu', hi: 'मुख्य मेनू पर वापस जाएं', mr: 'मुख्य मेनू वर परत जा' }, nextState: 'mainMenu' },
    ],
  },
  amc: {
    options: [
      { id: '1', name: { en: 'View AMC Product List', hi: 'AMC उत्पाद सूची देखें', mr: 'AMC उत्पाद यादी पहा' }, nextState: 'amcProductList' },
      { id: '2', name: { en: 'Contact AMC Support', hi: 'AMC सहायता से संपर्क करें', mr: 'AMC सहाय्य संपर्क' }, nextState: 'contactSupport' },
      { id: '3', name: { en: 'Book AMC Appointment', hi: 'AMC अपॉइंटमेंट बुक करें', mr: 'AMC अपॉइंटमेंट बुक करा' }, nextState: 'bookDemo' },
      { id: '4', name: { en: 'Back to Support', hi: 'सहायता पर वापस जाएं', mr: 'सहाय्य वर परत जा' }, nextState: 'support' },
    ],
  },
  contact: {
    options: [
      { id: '1', name: { en: 'Phone Number', hi: 'फ़ोन नंबर', mr: 'फोन नंबर' }, nextState: 'showPhone' },
      { id: '2', name: { en: 'Email ID', hi: 'ईमेल आईडी', mr: 'ईमेल आयडी' }, nextState: 'showEmail' },
      { id: '3', name: { en: 'Book Online Appointment', hi: 'ऑनलाइन अपॉइंटमेंट बुक करें', mr: 'ऑनलाइन अपॉइंटमेंट बुक करा' }, nextState: 'bookDemo' },
      { id: '4', name: { en: 'Back to Main Menu', hi: 'मुख्य मेनू पर वापस जाएं', mr: 'मुख्य मेनू वर परत जा' }, nextState: 'mainMenu' },
    ],
  },
  contactSupport: {
    options: [
      { id: '1', name: { en: 'Call Support', hi: 'सहायता को कॉल करें', mr: 'सहाय्यता कॉल करा' }, nextState: 'showPhone' },
      { id: '2', name: { en: 'Email Support', hi: 'ईमेल सहायता', mr: 'ईमेल सहाय्य' }, nextState: 'showEmail' },
      { id: '3', name: { en: 'Back to Support', hi: 'सहायता पर वापस जाएं', mr: 'सहाय्य वर परत जा' }, nextState: 'support' },
    ],
  },
  amcProductList: {
    options: [
      { id: '1', name: { en: 'Shetkari Krushi Software AMC', hi: 'शेतकरी कृषि सॉफ्टवेयर AMC', mr: 'शेतकरी कृषी सॉफ्टवेअर AMC' }, nextState: 'amcDetails' },
      { id: '2', name: { en: 'Shopcare AMC', hi: 'शॉपकेयर AMC', mr: 'शॉपकेअर AMC' }, nextState: 'amcDetails' },
      { id: '3', name: { en: 'Kbazzar AMC', hi: 'के-बाज़ार AMC', mr: 'के-बाजार AMC' }, nextState: 'amcDetails' },
      { id: '4', name: { en: 'Pharma Chemist AMC', hi: 'फार्मा केमिस्ट AMC', mr: 'फार्मा केमिस्ट AMC' }, nextState: 'amcDetails' },
      { id: '5', name: { en: 'Back to AMC Options', hi: 'AMC विकल्पों पर वापस जाएं', mr: 'AMC पर्यायांवर परत जा' }, nextState: 'amc' },
    ],
  },
  amcDetails: {
    options: [
      { id: '1', name: { en: 'Get AMC Pricing', hi: 'AMC मूल्य निर्धारण प्राप्त करें', mr: 'AMC किंमत मिळवा' }, nextState: 'amcPricing' },
      { id: '2', name: { en: 'Book AMC Consultation', hi: 'AMC परामर्श बुक करें', mr: 'AMC सल्ला बुक करा' }, nextState: 'bookDemo' },
      { id: '3', name: { en: 'Back to AMC Products', hi: 'AMC उत्पादों पर वापस जाएं', mr: 'AMC उत्पादने वर परत जा' }, nextState: 'amcProductList' },
    ],
  },
  amcPricing: {
    options: [
      { id: '1', name: { en: 'Get Quote by Email', hi: 'ईमेल द्वारा कोटेशन प्राप्त करें', mr: 'ईमेल द्वारे कोटेशन मिळवा' }, nextState: 'bookDemo' },
      { id: '2', name: { en: 'Speak to Sales Representative', hi: 'बिक्री प्रतिनिधि से बात करें', mr: 'विक्री प्रतिनिधीशी बोला' }, nextState: 'showPhone' },
      { id: '3', name: { en: 'Back to AMC Details', hi: 'AMC विवरण पर वापस जाएं', mr: 'AMC तपशीलांवर परत जा' }, nextState: 'amcDetails' },
    ],
  },
  expertChat: {
    options: [
      { id: '1', name: { en: 'Schedule Expert Call', hi: 'विशेषज्ञ कॉल शेड्यूल करें', mr: 'तज्ञ कॉल शेड्यूल करा' }, nextState: 'bookDemo' },
      { id: '2', name: { en: 'Back to Service Options', hi: 'सेवा विकल्पों पर वापस जाएं', mr: 'सेवा पर्यायांवर परत जा' }, nextState: 'serviceOptions' },
    ],
  },
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currentState, setCurrentState] = useState('mainMenu');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          handleSendMessage();
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setSpeechRecognition(recognition);
      }

      // Speech Synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      if (speechRecognition) {
        speechRecognition.stop();
      }
      setIsListening(false);
    } else {
      if (speechRecognition) {
        speechRecognition.start();
        setIsListening(true);
      }
    }
  };

  const speakText = (text) => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN';
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const initialMessage = {
        type: 'bot',
        content: getWelcomeMessage(),
        options: chatbotFlowData[currentState].options.map((option) => ({
          id: option.id,
          name: option.name[language],
        })),
      };
      setMessages([initialMessage]);
      speakText(initialMessage.content);
    }
  }, [language, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = () => {
    const greetings = {
      en: 'Hello! Welcome to our support chatbot. How can I help you today?',
      hi: 'नमस्ते! हमारे सहायता चैटबॉट में आपका स्वागत है। मैं आज आपकी कैसे मदद कर सकता हूं?',
      mr: 'नमस्कार! आमच्या सहाय्य चॅटबॉटमध्ये आपले स्वागत आहे. मी आज आपली कशी मदत करू शकतो?',
    };
    return greetings[language];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      type: 'user',
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      if (showEmailForm) {
        await handleEmailSubmission(inputValue);
      } else {
        await processUserInput(inputValue);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        type: 'bot',
        content: translations[language].errorMessage,
      };
      setMessages((prev) => [...prev, errorMessage]);
      speakText(errorMessage.content);
    } finally {
      setIsLoading(false);
      setInputValue('');
    }
  };

  const handleEmailSubmission = async (emailInput) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError(translations[language].invalidEmail);
      return;
    }

    setEmailError('');
    setShowEmailForm(false);
    setEmail(emailInput);
console.log('Email submitted:', emailInput);
    // Simulate API call for booking
    await new Promise((resolve) => setTimeout(resolve, 800));

    const confirmationMessage = {
      type: 'bot',
      content: translations[language].appointmentConfirm,
      options: chatbotFlowData.mainMenu.options.map((option) => ({
        id: option.id,
        name: option.name[language],
      })),
    };

    setMessages((prev) => [...prev, confirmationMessage]);
    speakText(confirmationMessage.content);
    setCurrentState('mainMenu');
  };

  const processUserInput = async (input) => {
    const numInput = parseInt(input);

    if (!isNaN(numInput)) {
      const currentOptions = chatbotFlowData[currentState].options;
      const selectedOption = currentOptions.find((option) => option.id === numInput.toString());

      if (selectedOption) {
        return handleOptionSelection(selectedOption);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const botResponse = {
      type: 'bot',
      content: getResponseForState(currentState, input),
      options: chatbotFlowData[currentState].options.map((option) => ({
        id: option.id,
        name: option.name[language],
      })),
    };

    setMessages((prev) => [...prev, botResponse]);
    speakText(botResponse.content);
  };

  const getResponseForState = (state, input) => {
    const responses = {
      mainMenu: {
        en: 'I understand you need help. Please select an option from the menu below:',
        hi: 'मैं समझता हूं कि आपको मदद चाहिए। कृपया नीचे दिए गए मेनू से एक विकल्प चुनें:',
        mr: 'मला समजते की आपल्याला मदत हवी आहे. कृपया खालील मेनूमधून एक पर्याय निवडा:',
      },
      products: {
        en: 'Please select a product you’re interested in:',
        hi: 'कृपया वह उत्पाद चुनें जिसमें आप रुचि रखते हैं:',
        mr: 'कृपया आपल्याला आवडणारे उत्पाद निवडा:',
      },
      services: {
        en: 'Please select a service you’re interested in:',
        hi: 'कृपया वह सेवा चुनें जिसमें आप रुचि रखते हैं:',
        mr: 'कृपया आपल्याला आवडणारी सेवा निवडा:',
      },
      support: {
        en: 'Please select a support option:',
        hi: 'कृपया एक सहायता विकल्प चुनें:',
        mr: 'कृपया एक सहाय्य पर्याय निवडा:',
      },
      contact: {
        en: 'Please select a contact method:',
        hi: 'कृपया एक संपर्क पद्धति चुनें:',
        mr: 'कृपया एक संपर्क पद्धत निवडा:',
      },
    };

    return responses[state]?.[language] || translations[language].typeNumber;
  };

  const handleOptionSelection = async (option) => {
    const nextState = option.nextState;

    switch (nextState) {
      case 'bookDemo':
        setShowEmailForm(true);
        const emailPrompt = {
          type: 'bot',
          content: translations[language].emailLabel,
        };
        setMessages((prev) => [...prev, emailPrompt]);
        speakText(emailPrompt.content);
        break;

      case 'purchase':
        // Simulate redirect to purchase page
        const purchaseMessage = {
          type: 'bot',
          content: translations[language].purchaseRedirect,
          options: chatbotFlowData.mainMenu.options.map((option) => ({
            id: option.id,
            name: option.name[language],
          })),
        };
        setMessages((prev) => [...prev, purchaseMessage]);
        speakText(purchaseMessage.content);
        // In a real app, redirect to purchase page
        // window.location.href = '/purchase';
        setCurrentState('mainMenu');
        break;

      case 'viewDemo':
        // Provide a demo link or information
        const demoMessage = {
          type: 'bot',
          content: translations[language].demoLink,
          options: chatbotFlowData.productOptions.options.map((option) => ({
            id: option.id,
            name: option.name[language],
          })),
        };
        setMessages((prev) => [...prev, demoMessage]);
        speakText(demoMessage.content);
        setCurrentState('productOptions');
        break;

      case 'showPhone':
        // Show phone number
        const phoneMessage = {
          type: 'bot',
          content: translations[language].phoneNumber,
          options: chatbotFlowData.contact.options.map((option) => ({
            id: option.id,
            name: option.name[language],
          })),
        };
        setMessages((prev) => [...prev, phoneMessage]);
        speakText(phoneMessage.content);
        setCurrentState('contact');
        break;

      case 'showEmail':
        // Show email contact
        const emailMessage = {
          type: 'bot',
          content: translations[language].emailContact,
          options: chatbotFlowData.contact.options.map((option) => ({
            id: option.id,
            name: option.name[language],
          })),
        };
        setMessages((prev) => [...prev, emailMessage]);
        speakText(emailMessage.content);
        setCurrentState('contact');
        break;

      default:
        // Transition to the next state
        setCurrentState(nextState);
        const responseMessage = {
          type: 'bot',
          content: getResponseForState(nextState, ''),
          options: chatbotFlowData[nextState].options.map((option) => ({
            id: option.id,
            name: option.name[language],
          })),
        };
        setMessages((prev) => [...prev, responseMessage]);
        speakText(responseMessage.content);
        break;
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setMessages([]);
    setCurrentState('mainMenu');
    setShowEmailForm(false);
    setEmailError('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChatbot}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        >
          {translations[language].chatbotHeader}
        </button>
      ) : (
        <div
          className={`bg-white rounded-lg shadow-xl flex flex-col ${
            isMinimized ? 'h-12' : 'h-[500px]'
          } w-80 sm:w-96 transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {translations[language].chatbotHeader}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={toggleMinimize}
                className="hover:bg-blue-700 p-1 rounded"
                title={
                  isMinimized
                    ? translations[language].maximizeChat
                    : translations[language].minimizeChat
                }
              >
                {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <button
                onClick={toggleChatbot}
                className="hover:bg-blue-700 p-1 rounded"
                title={translations[language].closeChat}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Language Selector */}
              <div className="p-2 border-b">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full p-2 border rounded"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.options && (
                        <ul className="mt-2 space-y-1">
                          {message.options.map((option) => (
                            <li key={option.id}>
                              {option.id}. {option.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                      <p>...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t flex items-center space-x-2">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-full ${
                    isListening ? 'bg-red-600' : 'bg-gray-200'
                  } hover:bg-opacity-80 transition`}
                  title={
                    isListening
                      ? translations[language].stopVoice
                      : translations[language].startVoice
                  }
                >
                  {isListening ? <MicOff size={20} className="text-white" /> : <Mic size={20} />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening
                      ? translations[language].listening
                      : translations[language].placeholder
                  }
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                  title={translations[language].sendMessage}
                  disabled={isLoading}
                >
                  <Send size={20} />
                </button>
              </div>

              {emailError && (
                <p className="text-red-600 text-sm p-2">{emailError}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;