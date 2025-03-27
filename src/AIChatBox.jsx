// components/AIChatBox.jsx
import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { fetchOpenAIResponse } from '../utils/openai'; // קריאה ל־API

const AIChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'bot', text: 'Hi! I’m your AI assistant. How can I help you today?' }
  ]); 

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newChatLog = [...chatLog, { sender: 'user', text: userMessage }];
    setChatLog(newChatLog);
    setUserMessage('');

    try {
      const reply = await fetchOpenAIResponse(userMessage);
      setChatLog((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      setChatLog((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col border border-gray-300">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span>AI Assistant</span>
            <button onClick={toggleChat}><FaTimes /></button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded-lg max-w-[90%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 self-end text-right'
                    : 'bg-gray-200 self-start text-left'
                }`}
              >
                <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex items-center gap-2 border-t">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Ask something..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="text-blue-600">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
        >
          <FaRobot size={20} />
        </button>
      )}
    </div>
  );
};

export default AIChatBox;