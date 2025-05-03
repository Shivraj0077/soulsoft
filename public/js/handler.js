// Hey there! This is the server-side API handler for our chatbot.
// It processes user messages, manages the conversation flow, and handles appointment logic.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      // Only allow POST requests, otherwise send a friendly error
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { message, language, state } = req.body;
  
    // Let's define our products and services for easy reference
    const products = ['Shetkari Krushi Software', 'Shopcare', 'Kbazzar', 'Pharma Chemist'];
    const services = [
      'Web Design & Development',
      'Digital Marketing',
      'E-commerce Development',
      'Android App Development',
      'Learning Management System (LMS)',
      'CRM Solutions',
    ];
  
    // Helper function to get translated responses
    const getResponse = (en, hi, mr) => {
      return language === 'english' ? en : language === 'hindi' ? hi : mr;
    };
  
    // Initialize response and new state
    let response = '';
    let newState = state || { step: 'main_menu', selectedItem: null, appointment: {} };
  
    // Main logic based on the current step
    switch (newState.step) {
      case 'main_menu':
        // Show the main menu when the chat starts or user returns to it
        response = getResponse(
          'Welcome! Please choose an option:\n1. Products\n2. Services\n3. Support & AMC\n4. Contact Customer Care',
          'स्वागत है! कृपया एक विकल्प चुनें:\n1. उत्पाद\n2. सेवाएँ\n3. समर्थन और AMC\n4. ग्राहक सेवा से संपर्क करें',
          'स्वागत आहे! कृपया एक पर्याय निवडा:\n1. उत्पादने\n2. सेवा\n3. समर्थन आणि AMC\n4. ग्राहक सेवा संपर्क'
        );
        newState.options = ['1', '2', '3', '4'];
        break;
  
      case 'products':
        // User selected Products; show the product list
        if (!newState.selectedItem) {
          response = getResponse(
            `Here's our product list. Please select one:\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
            `यहाँ हमारी उत्पाद सूची है। कृपया एक चुनें:\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
            `ही आमची उत्पाद यादी आहे. कृपया एक निवडा:\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
          );
          newState.options = products.map((_, i) => (i + 1).toString());
        } else {
          // User selected a product; show next actions
          response = getResponse(
            `You selected ${newState.selectedItem}. What would you like to do?\n1. Purchase Now\n2. View Demo\n3. Book Online Demo\n4. Contact Customer Care`,
            `आपने ${newState.selectedItem} चुना। आप आगे क्या करना चाहेंगे?\n1. अभी खरीदें\n2. डेमो देखें\n3. ऑनलाइन डेमो बुक करें\n4. ग्राहक सेवा से संपर्क करें`,
            `तुम्ही ${newState.selectedItem} निवडले. पुढे काय करायचे?\n1. आता खरेदी करा\n2. डेमो पहा\n3. ऑनलाइन डेमो बुक करा\n4. ग्राहक सेवा संपर्क`
          );
          newState.options = ['1', '2', '3', '4'];
          newState.step = 'product_actions';
        }
        break;
  
      case 'product_actions':
        // Handle actions after selecting a product
        if (message === '1') {
          response = getResponse(
            'Great! Proceed to purchase: [Payment Link](https://example.com/payment)',
            'बढ़िया! खरीदारी के लिए आगे बढ़ें: [भुगतान लिंक](https://example.com/payment)',
            'छान! खरेदीसाठी पुढे जा: [पेमेंट लिंक](https://example.com/payment)'
          );
          newState.step = 'main_menu';
          newState.selectedItem = null;
        } else if (message === '2') {
          response = getResponse(
            'Watch the demo here: [Demo Video](https://youtube.com/demo)',
            'डेमो यहाँ देखें: [डेमो वीडियो](https://youtube.com/demo)',
            'डेमो इथे पहा: [डेमो व्हिडिओ](https://youtube.com/demo)'
          );
          newState.step = 'main_menu';
          newState.selectedItem = null;
        } else if (message === '3') {
          response = getResponse(
            'Please provide your preferred date and time for the demo (e.g., 2025-05-02 14:00).',
            'कृपया डेमो के लिए अपनी पसंदीदा तारीख और समय प्रदान करें (उदा., 2025-05-02 14:00).',
            'कृपया डेमोसाठी तुमची पसंतीची तारीख आणि वेळ द्या (उदा., 2025-05-02 14:00).'
          );
          newState.step = 'book_demo';
        } else if (message === '4') {
          response = getResponse(
            'Contact us at: +1234567890 or support@yourcompany.com',
            'हमसे संपर्क करें: +1234567890 या support@yourcompany.com',
            'आमच्याशी संपर्क साधा: +1234567890 किंवा support@yourcompany.com'
          );
          newState.step = 'main_menu';
          newState.selectedItem = null;
        }
        break;
  
      case 'services':
        // User selected Services; show the service list
        if (!newState.selectedItem) {
          response = getResponse(
            `Here are our services. Choose one:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
            `यहाँ हमारी सेवाएँ हैं। एक चुनें:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
            `या आमच्या सेवा आहेत. एक निवडा:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
          );
          newState.options = services.map((_, i) => (i + 1).toString());
        } else {
          // User selected a service; show description and actions
          const descriptions = {
            'Web Design & Development': 'Custom websites tailored to your needs.',
            'Digital Marketing': 'Boost your brand with SEO and ads.',
            'E-commerce Development': 'Build your online store.',
            'Android App Development': 'Create powerful mobile apps.',
            'Learning Management System (LMS)': 'Online learning platforms.',
            'CRM Solutions': 'Manage customer relationships effectively.',
          };
          response = getResponse(
            `${newState.selectedItem}: ${descriptions[newState.selectedItem]}\nWhat next?\n1. Contact for Consultation\n2. Book Appointment\n3. Chat with Expert`,
            `${newState.selectedItem}: ${descriptions[newState.selectedItem]}\nआगे क्या?\n1. परामर्श के लिए संपर्क करें\n2. अपॉइंटमेंट बुक करें\n3. विशेषज्ञ से चैट करें`,
            `${newState.selectedItem}: ${descriptions[newState.selectedItem]}\nपुढे काय?\n1. सल्लामसलतसाठी संपर्क साधा\n2. भेटीची वेळ बुक करा\n3. तज्ञाशी चॅट करा`
          );
          newState.step = 'service_actions';
          newState.options = ['1', '2', '3'];
        }
        break;
  
      case 'service_actions':
        // Handle actions after selecting a service
        if (message === '1' || message === '3') {
          response = getResponse(
            'Contact our expert: +1234567890 or expert@yourcompany.com',
            'हमारे विशेषज्ञ से संपर्क करें: +1234567890 या expert@yourcompany.com',
            'आमच्या तज्ञाशी संपर्क साधा: +1234567890 किंवा expert@yourcompany.com'
          );
          newState.step = 'main_menu';
          newState.selectedItem = null;
        } else if (message === '2') {
          response = getResponse(
            'Please provide your preferred date and time for the appointment (e.g., 2025-05-02 14:00).',
            'कृपया अपॉइंटमेंट के लिए अपनी पसंदीदा तारीख और समय प्रदान करें (उदा., 2025-05-02 14:00).',
            'कृपया भेटीसाठी तुमची पसंतीची तारीख आणि वेळ द्या (उदा., 2025-05-02 14:00).'
          );
          newState.step = 'book_service';
        }
        break;
  
      case 'support_amc':
        // User selected Support & AMC; show concerns
        response = getResponse(
          'Please select your concern:\n1. After Purchase Support\n2. Sales Related Queries\n3. GST Report Issues\n4. Contact Customer Support\n5. AMC',
          'कृपया अपनी चिंता चुनें:\n1. खरीद के बाद समर्थन\n2. बिक्री संबंधी प्रश्न\n3. GST रिपोर्ट समस्याएँ\n4. ग्राहक समर्थन से संपर्क करें\n5. AMC',
          'कृपया तुमची चिंता निवडा:\n1. खरेदीनंतर समर्थन\n2. विक्री संबंधित प्रश्न\n3. GST अहवाल समस्या\n4. ग्राहक समर्थनाशी संपर्क साधा\n5. AMC'
        );
        newState.options = ['1', '2', '3', '4', '5'];
        break;
  
      case 'amc':
        // Handle AMC-specific queries
        response = getResponse(
          'Do you want to:\n1. View AMC Details\n2. Contact AMC Support\n3. Book AMC Appointment',
          'क्या आप चाहते हैं:\n1. AMC विवरण देखें\n2. AMC समर्थन से संपर्क करें\n3. AMC अपॉइंटमेंट बुक करें',
          'तुम्हाला काय करायचे आहे:\n1. AMC तपशील पहा\n2. AMC समर्थनाशी संपर्क साधा\n3. AMC भेटीची वेळ बुक करा'
        );
        newState.options = ['1', '2', '3'];
        newState.step = 'amc_actions';
        break;
  
      case 'amc_actions':
        // Handle AMC actions
        if (message === '1') {
          response = getResponse(
            'AMC covers annual maintenance for our products. Contact for details!',
            'AMC हमारे उत्पादों के लिए वार्षिक रखरखाव को कवर करता है। विवरण के लिए संपर्क करें!',
            'AMC आमच्या उत्पादांसाठी वार्षिक देखभाल कव्हर करते. तपशीलासाठी संपर्क साधा!'
          );
          newState.step = 'main_menu';
        } else if (message === '2') {
          response = getResponse(
            'Contact AMC support: +1234567890 or amc@yourcompany.com',
            'AMC समर्थन से संपर्क करें: +1234567890 या amc@yourcompany.com',
            'AMC समर्थनाशी संपर्क साधा: +1234567890 किंवा amc@yourcompany.com'
          );
          newState.step = 'main_menu';
        } else if (message === '3') {
          response = getResponse(
            'Please provide your preferred date and time for the AMC appointment (e.g., 2025-05-02 14:00).',
            'कृपया AMC अपॉइंटमेंट के लिए अपनी पसंदीदा तारीख और समय प्रदान करें (उदा., 2025-05-02 14:00).',
            'कृपया AMC भेटीसाठी तुमची पसंतीची तारीख आणि वेळ द्या (उदा., 2025-05-02 14:00).'
          );
          newState.step = 'book_amc';
        }
        break;
  
      case 'contact_care':
        // Handle Contact Customer Care
        response = getResponse(
          'Reach us at:\nPhone: +1234567890\nEmail: support@yourcompany.com\nBook Appointment: Reply with date/time',
          'हमसे संपर्क करें:\nफोन: +1234567890\nईमेल: support@yourcompany.com\nअपॉइंटमेंट बुक करें: तारीख/समय के साथ जवाब दें',
          'आमच्याशी संपर्क साधा:\nफोन: +1234567890\nईमेल: support@yourcompany.com\nभेटीची वेळ बुक करा: तारीख/वेळेसह उत्तर द्या'
        );
        newState.step = 'book_care';
        break;
  
      case 'book_demo':
      case 'book_service':
      case 'book_amc':
      case 'book_care':
        // Handle appointment booking
        newState.appointment.datetime = message;
        response = getResponse(
          'Please provide your name and email for the appointment.',
          'कृपया अपॉइंटमेंट के लिए अपना नाम और ईमेल प्रदान करें।',
          'कृपया भेटीसाठी तुमचे नाव आणि ईमेल द्या.'
        );
        newState.step = 'confirm_appointment';
        break;
  
      case 'confirm_appointment':
        // Confirm appointment and generate WhatsApp link + email
        const [name, email] = message.split(',').map((s) => s.trim());
        newState.appointment.name = name;
        newState.appointment.email = email;
  
        const whatsappMessage = encodeURIComponent(
          `Appointment Request\nName: ${name}\nEmail: ${email}\nItem: ${newState.selectedItem || 'Customer Care'}\nDateTime: ${newState.appointment.datetime}`
        );
        const whatsappLink = `https://wa.me/+1234567890?text=${whatsappMessage}`;
  
        // Simulate sending email (replace with real email service like SendGrid)
        console.log('Sending email to user:', {
          to: email,
          from: 'appointments@yourcompany.com',
          subject: 'Appointment Confirmation',
          body: `Dear ${name},\nYour appointment for ${newState.selectedItem || 'Customer Care'} on ${newState.appointment.datetime} has been requested. We'll confirm soon!\n\nBest,\nYourCompany`,
        });
        console.log('Sending email to handler:', {
          to: 'handler@yourcompany.com',
          from: 'appointments@yourcompany.com',
          subject: 'New Appointment Request',
          body: `New appointment request:\nName: ${name}\nEmail: ${email}\nItem: ${newState.selectedItem || 'Customer Care'}\nDateTime: ${newState.appointment.datetime}`,
        });
  
        response = getResponse(
          `Appointment requested! Click to confirm via WhatsApp: [Book Appointment](${whatsappLink})\nYou'll receive an email confirmation soon.`,
          `अपॉइंटमेंट अनुरोधित! व्हाट्सएप के माध्यम से पुष्टि करने के लिए क्लिक करें: [अपॉइंटमेंट बुक करें](${whatsappLink})\nआपको जल्द ही एक ईमेल पुष्टिकरण प्राप्त होगा।`,
          `भेटीची विनंती केली! व्हाट्सअॅपद्वारे पुष्टीकरणासाठी क्लिक करा: [भेटीची वेळ बुक करा](${whatsappLink})\nतुम्हाला लवकरच ईमेल पुष्टीकरण मिळेल.`
        );
        newState.step = 'main_menu';
        newState.selectedItem = null;
        newState.appointment = {};
        break;
  
      default:
        // Fallback for unrecognized steps
        response = getResponse(
          'Sorry, I didn’t understand. Let’s start over.\n1. Products\n2. Services\n3. Support & AMC\n4. Contact Customer Care',
          'क्षमा करें, मुझे समझ नहीं आया। आइए फिर से शुरू करें।\n1. उत्पाद\n2. सेवाएँ\n3. समर्थन और AMC\n4. ग्राहक सेवा से संपर्क करें',
          'माफ करा, मला समजले नाही. चला पुन्हा सुरू करू.\n1. उत्पादने\n2. सेवा\n3. समर्थन आणि AMC\n4. ग्राहक सेवा संपर्क'
        );
        newState.step = 'main_menu';
        newState.options = ['1', '2', '3', '4'];
    }
  
    // Handle direct triggers (e.g., "Show me your products")
    if (!state || state.step === 'main_menu') {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('product')) {
        newState.step = 'products';
        response = getResponse(
          `Here's our product list. Please select one:\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
          `यहाँ हमारी उत्पाद सूची है। कृपया एक चुनें:\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
          `ही आमची उत्पाद यादी आहे. कृपया एक निवडा:\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
        );
        newState.options = products.map((_, i) => (i + 1).toString());
      } else if (lowerMessage.includes('service')) {
        newState.step = 'services';
        response = getResponse(
          `Here are our services. Choose one:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
          `यहाँ हमारी सेवाएँ हैं। एक चुनें:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
          `या आमच्या सेवा आहेत. एक निवडा:\n${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
        );
        newState.options = services.map((_, i) => (i + 1).toString());
      } else if (lowerMessage.includes('support') || lowerMessage.includes('amc')) {
        newState.step = 'support_amc';
        response = getResponse(
          'Please select your concern:\n1. After Purchase Support\n2. Sales Related Queries\n3. GST Report Issues\n4. Contact Customer Support\n5. AMC',
          'कृपया अपनी चिंता चुनें:\n1. खरीद के बाद समर्थन\n2. बिक्री संबंधी प्रश्न\n3. GST रिपोर्ट समस्याएँ\n4. ग्राहक समर्थन से संपर्क करें\n5. AMC',
          'कृपया तुमची चिंता निवडा:\n1. खरेदीनंतर समर्थन\n2. विक्री संबंधित प्रश्न\n3. GST अहवाल समस्या\n4. ग्राहक समर्थनाशी संपर्क साधा\n5. AMC'
        );
        newState.options = ['1', '2', '3', '4', '5'];
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('help')) {
        newState.step = 'contact_care';
        response = getResponse(
          'Reach us at:\nPhone: +1234567890\nEmail: support@yourcompany.com\nBook Appointment: Reply with date/time',
          'हमसे संपर्क करें:\nफोन: +1234567890\nईमेल: support@yourcompany.com\nअपॉइंटमेंट बुक करें: तारीख/समय के साथ जवाब दें',
          'आमच्याशी संपर्क साधा:\nफोन: +1234567890\nईमेल: support@yourcompany.com\nभेटीची वेळ बुक करा: तारीख/वेळेसह उत्तर द्या'
        );
      }
    }
  
    // If the user selected an item (product/service)
    if (
      (newState.step === 'products' || newState.step === 'services') &&
      !newState.selectedItem &&
      newState.options.includes(message)
    ) {
      const items = newState.step === 'products' ? products : services;
      newState.selectedItem = items[parseInt(message) - 1];
    }
  
    // Return the response and updated state
    res.status(200).json({ response, state: newState });
  }