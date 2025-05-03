import { useTranslation } from 'react-i18next';

const ChatInput = ({ input, setInput, handleSend, startListening, isListening }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-2 border-t">
      <select
        className="mb-2 p-1 border rounded w-full"
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
      </select>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type or speak..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition"
          onClick={startListening}
          disabled={isListening}
        >
          {isListening ? 'Listening...' : t('speak')}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;