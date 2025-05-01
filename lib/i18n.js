import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome! How can I assist you today?',
      products: 'Products',
      services: 'Services',
      support: 'Support & AMC',
      contact: 'Contact Customer Care',
      selectProduct: 'Here\'s our product list. Please select one to proceed:',
      selectService: 'Here are the services we offer. Choose one to learn more:',
      selectSupport: 'Please select your concern:',
      bookAppointment: 'Please enter your email to schedule an appointment:',
      language: 'Select Language',
      speak: 'Speak',
    },
  },
  hi: {
    translation: {
      welcome: 'स्वागत है! मैं आपकी कैसे सहायता कर सकता हूँ?',
      products: 'उत्पाद',
      services: 'सेवाएँ',
      support: 'समर्थन और AMC',
      contact: 'ग्राहक सेवा से संपर्क करें',
      selectProduct: 'यहाँ हमारी उत्पाद सूची है। कृपया एक चुनें:',
      selectService: 'हमारी सेवाएँ यहाँ हैं। और जानने के लिए एक चुनें:',
      selectSupport: 'कृपया अपनी समस्या चुनें:',
      bookAppointment: 'अपॉइंटमेंट शेड्यूल करने के लिए अपना ईमेल दर्ज करें:',
      language: 'भाषा चुनें',
      speak: 'बोलें',
    },
  },
  mr: {
    translation: {
      welcome: 'स्वागत आहे! मी तुम्हाला कशी मदत करू शकतो?',
      products: 'उत्पादने',
      services: 'सेवा',
      support: 'समर्थन आणि AMC',
      contact: 'ग्राहक सेवा संपर्क',
      selectProduct: 'ही आमची उत्पाद यादी आहे. कृपया एक निवडा:',
      selectService: 'आमच्या सेवा येथे आहेत. अधिक जाणून घेण्यासाठी एक निवडा:',
      selectSupport: 'कृपया तुमची समस्या निवडा:',
      bookAppointment: 'अपॉइंटमेंट शेड्यूल करण्यासाठी तुमचा ईमेल प्रविष्ट करा:',
      language: 'भाषा निवडा',
      speak: 'बोला',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;