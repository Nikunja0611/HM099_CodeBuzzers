import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { MessageSquare, X, Send } from 'lucide-react';

const socket = io('http://localhost:5000');

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const msgData = { text: input, sender: 'Me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      socket.emit('send_message', msgData);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition">
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="bg-teal-600 p-4 rounded-t-xl text-white flex justify-between items-center">
            <span className="font-bold">Project Chat</span>
            <button onClick={() => setIsOpen(false)}><X size={18}/></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                <div className={`p-2 rounded-lg text-sm max-w-[80%] ${m.sender === 'Me' ? 'bg-teal-100 text-teal-900' : 'bg-white border text-gray-800'}`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">{m.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2 bg-white rounded-b-xl">
            <input 
              className="flex-1 text-sm outline-none" 
              placeholder="Type a message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="text-teal-600 hover:text-teal-800"><Send size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatWidget;