export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { message, language } = req.body;
      // Simulate a bot response (replace with actual AI service call)
      const botResponse =
        language === 'english'
          ? `You said: "${message}"`
          : language === 'hindi'
          ? `आपने कहा: "${message}"`
          : `तुम्ही म्हणालात: "${message}"`;
      res.status(200).json({ response: botResponse });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }