'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: formatTimestamp(new Date().toISOString()),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    console.log('Messages updated:', messages);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageText = inputMessage.trim();
    if (!messageText) return;

    // Add user message using the current state
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: formatTimestamp(new Date().toISOString()),
    };

    // Update messages with user message
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Clear input after adding message
    setInputMessage('');

    // Add bot response using the updated state
    setTimeout(() => {
      setMessages((prevMessages) => {
        const botMessage: Message = {
          id: prevMessages.length + 1,
          text: "I'm a demo chatbot. I'll be replaced with real responses soon!",
          sender: 'bot',
          timestamp: formatTimestamp(new Date().toISOString()),
        };
        return [...prevMessages, botMessage];
      });
    }, 1000);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="bg-blue-600 p-4">
              <h1 className="text-xl font-semibold text-white">
                Customer Support
              </h1>
            </div>

            <div className="h-[500px] space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border p-2 focus:border-blue-500 focus:outline-none"
                  aria-label="Type your message"
                />
                <button
                  type="submit"
                  className={`rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 ${
                    !inputMessage.trim() && 'cursor-not-allowed opacity-50'
                  }`}
                  disabled={!inputMessage.trim()}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
