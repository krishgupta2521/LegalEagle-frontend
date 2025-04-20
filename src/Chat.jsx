import React, { useState } from 'react';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'lawyer', text: 'Hello, how can I assist you today?' }
    ]);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([
                ...messages,
                { sender: 'user', text: message }
            ]);
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <div className="p-10">
                <div className="bg-gray-100 p-6 rounded-lg shadow-xl">
                    <h1 className="text-2xl font-bold">Chat with your Lawyer</h1>
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 rounded-lg ${msg.sender === 'user' ? 'bg-[#0B0B5C] text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <input
                            className="border px-4 py-2 rounded w-full"
                            placeholder="Type your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-[#0B0B5C] text-white px-6 py-2 rounded font-semibold"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
