const ChatMessages = ({ messages }) => {
    return (
      <div className="flex-1 p-2 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block p-2 rounded ${
                msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  export default ChatMessages;