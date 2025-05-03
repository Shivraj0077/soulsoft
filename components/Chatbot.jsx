'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, ChevronUp, ChevronDown, X } from 'lucide-react';

// Language options
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
    purchaseRedirect: 'Redirecting to purchase page...',
    demoLink: 'Here is the demo link for the selected product: ',
    phoneNumber: 'Contact us at: + 8530798679',
    emailContact: 'Email us at: [ soulsoftinfotech@gmail.com](mailto: soulsoftinfotech@gmail.com)',
    chooseLanguage: 'Please select a language:',
    talkToMe: 'Talk to expert',
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
    demoLink: 'चयनित उत्पाद के लिए डेमो लिंक यहाँ है: ',
    phoneNumber: 'हमसे संपर्क करें: + 8530798679',
    emailContact: 'हमें ईमेल करें: [ soulsoftinfotech@gmail.com](mailto: soulsoftinfotech@gmail.com)',
    chooseLanguage: 'कृपया एक भाषा चुनें:',
    talkToMe: 'मुझसे बात करें',
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
    demoLink: 'निवडलेल्या उत्पादनासाठी डेमो लिंक येथे आहे: ',
    phoneNumber: 'आमच्याशी संपर्क साधा: + 8530798679',
    emailContact: 'आम्हाला ईमेल करा: [ soulsoftinfotech@gmail.com](mailto: soulsoftinfotech@gmail.com)',
    chooseLanguage: 'कृपया एक भाषा निवडा:',
    talkToMe: 'माझ्याशी बोला',
  },
};

// Chatbot flow data
const chatbotFlowData = {
  languageSelection: {
    options: [
      { id: '1', name: { en: 'English', hi: 'अंग्रेजी', mr: 'इंग्रजी' }, nextState: 'mainMenu', language: 'en' },
      { id: '2', name: { en: 'Hindi', hi: 'हिन्दी', mr: 'हिन्दी' }, nextState: 'mainMenu', language: 'hi' },
      { id: '3', name: { en: 'Marathi', hi: 'मराठी', mr: 'मराठी' }, nextState: 'mainMenu', language: 'mr' },
    ],
  },
  mainMenu: {
    options: [
      { id: '1', name: { en: 'Products', hi: 'उत्पाद', mr: 'उत्पादने' }, nextState: 'products' },
      { id: '2', name: { en: 'Services', hi: 'सेवाएँ', mr: 'सेवा' }, nextState: 'services' },
      { id: '3', name: { en: 'Support & AMC', hi: 'सहायता और AMC', mr: 'सहाय्य आणि AMC' }, nextState: 'support' },
      { id: '4', name: { en: 'Contact Customer Care', hi: 'ग्राहक सेवा से संपर्क करें', mr: 'ग्राहक सेवा संपर्क' }, nextState: 'contact' },
      { id: '5', name: { en: 'Talk to me', hi: 'मुझसे बात करें', mr: 'माझ्याशी बोला' }, nextState: 'randomChat' },
    ],
  },
  products: {
    options: [
      { 
        id: '1', 
        name: { en: 'Shetkari Krushi Software', hi: 'शेतकरी कृषि सॉफ्टवेयर', mr: 'शेतकरी कृषी सॉफ्टवेअर' }, 
        nextState: 'productOptions', 
        demoLink: 'https://www.youtube.com/watch?v=OGsO4XIuxC0', 
        purchaseLink: 'https://shetkari.soulsoftinfotech.com/purchase' 
      },
      { 
        id: '2', 
        name: { en: 'Shopcare', hi: 'शॉपकेयर', mr: 'शॉपकेअर' }, 
        nextState: 'productOptions', 
        demoLink: 'https://www.youtube.com/watch?v=b-vLaye6f_I&t=5s', 
        purchaseLink: 'https://shopcare.soulsoftinfotech.com/purchase' 
      },
      { 
        id: '3', 
        name: { en: 'Kbazzar', hi: 'के-बाज़ार', mr: 'के-बाजार' }, 
        nextState: 'productOptions', 
        demoLink: 'https://www.youtube.com/watch?v=cgPNFA8y_U0&t=3s', 
        purchaseLink: 'https://kbazzar.soulsoftinfotech.com/purchase' 
      },
      { 
        id: '4', 
        name: { en: 'Pharma Chemist', hi: 'फार्मा केमिस्ट', mr: 'फार्मा केमिस्ट' }, 
        nextState: 'productOptions', 
        demoLink: 'https://www.youtube.com/watch?v=CHP5k1No-RM', 
        purchaseLink: 'https://pharma.soulsoftinfotech.com/purchase' 
      },
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
  randomChat: {
    options: [
      { id: '1', name: { en: 'Back to Main Menu', hi: 'मुख्य मेनू पर वापस जाएं', mr: 'मुख्य मेनू वर परत जा' }, nextState: 'mainMenu' },
    ],
  },
};

// Company information document
const companyInfo = `Our pricing for services is as follows: Web Development ranges from ₹25,000 to ₹1,50,000. Mobile App Development is priced between ₹60,000 and ₹5,00,000. Custom Software Development costs range from ₹75,000 to ₹7,00,000. Digital Marketing services are available on a monthly retainer basis from ₹10,000 to ₹1,00,000. Billing Software development is priced between ₹30,000 and ₹1,00,000. E-commerce Website or App solutions range from ₹50,000 to ₹4,00,000. LMS Development services are available between ₹70,000 and ₹4,00,000. CRM Development projects range from ₹80,000 to ₹5,00,000.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(null);
  const [currentState, setCurrentState] = useState('languageSelection');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      if (!language) {
        const initialMessage = {
          type: 'bot',
          content: translations.en.chooseLanguage,
          options: chatbotFlowData.languageSelection.options.map((option) => ({
            id: option.id,
            name: option.name.en,
          })),
        };
        setMessages([initialMessage]);
        speakText(initialMessage.content);
      } else {
        const initialMessage = {
          type: 'bot',
          content: currentState === 'mainMenu' ? getWelcomeMessage() : getResponseForState(currentState, ''),
          options: chatbotFlowData[currentState].options.map((option) => ({
            id: option.id,
            name: option.name[language],
          })),
        };
        setMessages([initialMessage]);
        speakText(initialMessage.content);
      }
    }
  }, [language, isOpen, currentState]);

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
      } else if (currentState === 'randomChat') {
        await handleRandomChat(inputValue);
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
      setIsLoading(false);
      return;
    }

    setEmailError('');
    setShowEmailForm(false);
    setEmail(emailInput);
    setCurrentState('mainMenu');

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

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: emailInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = {
        type: 'bot',
        content: `${translations[language].errorMessage} (Email may not have been sent, please contact support.)`,
        options: chatbotFlowData.mainMenu.options.map((option) => ({
          id: option.id,
          name: option.name[language],
        })),
      };
      setMessages((prev) => [...prev, errorMessage]);
      speakText(errorMessage.content);
    }
  };

  const handleRandomChat = async (input) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from Gemini API');
      }

      const botResponse = {
        type: 'bot',
        content: data.response,
        options: chatbotFlowData.randomChat.options.map((option) => ({
          id: option.id,
          name: option.name[language],
        })),
      };

      setMessages((prev) => [...prev, botResponse]);
      speakText(botResponse.content);
    } catch (error) {
      console.error('Error in random chat:', error);
      const errorMessage = {
        type: 'bot',
        content: translations[language].errorMessage,
        options: chatbotFlowData.randomChat.options.map((option) => ({
          id: option.id,
          name: option.name[language],
        })),
      };
      setMessages((prev) => [...prev, errorMessage]);
      speakText(errorMessage.content);
    }
  };

  const processUserInput = async (input) => {
    const numInput = parseInt(input);

    if (!isNaN(numInput)) {
      const currentOptions = chatbotFlowData[currentState].options;
      const selectedOption = currentOptions.find((option) => option.id === numInput.toString());

      if (selectedOption) {
        if (currentState === 'products') {
          setSelectedProduct(selectedOption);
        }
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
      languageSelection: {
        en: translations.en.chooseLanguage,
        hi: translations.hi.chooseLanguage,
        mr: translations.mr.chooseLanguage,
      },
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
      randomChat: {
        en: 'Feel free to ask anything!',
        hi: 'कुछ भी पूछने के लिए स्वतंत्र महसूस करें!',
        mr: 'काहीही विचारण्यास मोकळे व्हा!',
      },
    };

    return responses[state]?.[language] || translations[language].typeNumber;
  };

  const handleOptionSelection = async (option) => {
    const nextState = option.nextState;

    if (currentState === 'languageSelection') {
      setLanguage(option.language);
      setCurrentState(nextState);
      const welcomeMessage = {
        type: 'bot',
        content: getWelcomeMessage(),
        options: chatbotFlowData.mainMenu.options.map((opt) => ({
          id: opt.id,
          name: opt.name[option.language],
        })),
      };
      setMessages((prev) => [...prev, welcomeMessage]);
      speakText(welcomeMessage.content);
      return;
    }

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
        if (selectedProduct && selectedProduct.purchaseLink) {
          const purchaseMessage = {
            type: 'bot',
            content: `${translations[language].purchaseRedirect} [${selectedProduct.purchaseLink}](${selectedProduct.purchaseLink})`,
            options: chatbotFlowData.productOptions.options.map((opt) => ({
              id: opt.id,
              name: opt.name[language],
            })),
          };
          setMessages((prev) => [...prev, purchaseMessage]);
          speakText(purchaseMessage.content);
          setCurrentState('productOptions');
        } else {
          const errorMessage = {
            type: 'bot',
            content: translations[language].errorMessage,
            options: chatbotFlowData.productOptions.options.map((opt) => ({
              id: opt.id,
              name: opt.name[language],
            })),
          };
          setMessages((prev) => [...prev, errorMessage]);
          speakText(errorMessage.content);
          setCurrentState('productOptions');
        }
        break;

      case 'viewDemo':
        if (selectedProduct && selectedProduct.demoLink) {
          const demoMessage = {
            type: 'bot',
            content: `${translations[language].demoLink} [${selectedProduct.demoLink}](${selectedProduct.demoLink})`,
            options: chatbotFlowData.productOptions.options.map((opt) => ({
              id: opt.id,
              name: opt.name[language],
            })),
          };
          setMessages((prev) => [...prev, demoMessage]);
          speakText(demoMessage.content);
          setCurrentState('productOptions');
        } else {
          const errorMessage = {
            type: 'bot',
            content: translations[language].errorMessage,
            options: chatbotFlowData.productOptions.options.map((opt) => ({
              id: opt.id,
              name: opt.name[language],
            })),
          };
          setMessages((prev) => [...prev, errorMessage]);
          speakText(errorMessage.content);
          setCurrentState('productOptions');
        }
        break;

      case 'showPhone':
        const phoneMessage = {
          type: 'bot',
          content: translations[language].phoneNumber,
          options: chatbotFlowData.contact.options.map((opt) => ({
            id: opt.id,
            name: opt.name[language],
          })),
        };
        setMessages((prev) => [...prev, phoneMessage]);
        speakText(phoneMessage.content);
        setCurrentState('contact');
        break;

      case 'showEmail':
        const emailMessage = {
          type: 'bot',
          content: translations[language].emailContact,
          options: chatbotFlowData.contact.options.map((opt) => ({
            id: opt.id,
            name: opt.name[language],
          })),
        };
        setMessages((prev) => [...prev, emailMessage]);
        speakText(emailMessage.content);
        setCurrentState('contact');
        break;

      default:
        setCurrentState(nextState);
        const responseMessage = {
          type: 'bot',
          content: getResponseForState(nextState, ''),
          options: chatbotFlowData[nextState].options.map((opt) => ({
            id: opt.id,
            name: opt.name[language],
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
    setSelectedProduct(null);
  };

  return (
    <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 50 }}>
      {!isOpen ? (
        <button
          onClick={toggleChatbot}
          style={{
            backgroundColor: '#1e40af',
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1e3a8a')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#1e40af')}
        >
          {language ? translations[language].chatbotHeader : 'Customer Support'}
        </button>
      ) : (
        <div
          style={{
            backgroundColor: '#1f2937',
            borderRadius: '8px',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            height: isMinimized ? '48px' : '500px',
            width: '320px',
            transition: 'height 0.3s',
            color: '#e5e7eb',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#1e40af',
              color: '#ffffff',
              padding: '16px',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
              {language ? translations[language].chatbotHeader : 'Customer Support'}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={toggleMinimize}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                title={
                  isMinimized
                    ? language
                      ? translations[language].maximizeChat
                      : 'Maximize chat'
                    : language
                    ? translations[language].minimizeChat
                    : 'Minimize chat'
                }
                onMouseOver={(e) => (e.target.style.backgroundColor = '#1e3a8a')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                {isMinimized ? <ChevronUp size={20} color="#ffffff" /> : <ChevronDown size={20} color="#ffffff" />}
              </button>
              <button
                onClick={toggleChatbot}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                title={language ? translations[language].closeChat : 'Close chat'}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#1e3a8a')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                <X size={20} color="#ffffff" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Language Selector */}
              {language && (
                <div style={{ padding: '8px', borderBottom: '1px solid #374151' }}>
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #4b5563',
                      borderRadius: '4px',
                      backgroundColor: '#374151',
                      color: '#e5e7eb',
                      outline: 'none',
                    }}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} style={{ backgroundColor: '#374151', color: '#e5e7eb' }}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: message.type === 'user' ? '#1e40af' : '#374151',
                        color: message.type === 'user' ? '#ffffff' : '#e5e7eb',
                      }}
                    >
                      <p>{message.content}</p>
                      {message.options && (
                        <ul style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div
                      style={{
                        backgroundColor: '#374151',
                        color: '#e5e7eb',
                        padding: '12px',
                        borderRadius: '8px',
                      }}
                    >
                      <p>Processing...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: '16px',
                  borderTop: '1px solid #374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <button
                  onClick={toggleListening}
                  style={{
                    padding: '8px',
                    borderRadius: '9999px',
                    backgroundColor: isListening ? '#dc2626' : '#4b5563',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  title={
                    isListening
                      ? language
                        ? translations[language].stopVoice
                        : 'Stop voice input'
                      : language
                      ? translations[language].startVoice
                      : 'Start voice input'
                  }
                  onMouseOver={(e) => (e.target.style.backgroundColor = isListening ? '#b91c1c' : '#6b7280')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = isListening ? '#dc2626' : '#4b5563')}
                >
                  {isListening ? <MicOff size={20} color="#ffffff" /> : <Mic size={20} color="#ffffff" />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening
                      ? language
                        ? translations[language].listening
                        : 'Listening...'
                      : language
                      ? translations[language].placeholder
                      : 'Type your message...'
                  }
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    backgroundColor: '#374151',
                    color: '#e5e7eb',
                    outline: 'none',
                  }}
                  disabled={isLoading}
                  onFocus={(e) => (e.target.style.borderColor = '#1e40af')}
                  onBlur={(e) => (e.target.style.borderColor = '#4b5563')}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    backgroundColor: '#1e40af',
                    color: '#ffffff',
                    padding: '8px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  title={language ? translations[language].sendMessage : 'Send message'}
                  disabled={isLoading}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#1e3a8a')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#1e40af')}
                >
                  <Send size={20} />
                </button>
              </div>

              {emailError && (
                <p style={{ color: '#dc2626', fontSize: '14px', padding: '8px' }}>{emailError}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;