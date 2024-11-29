'use client'; // Force new build

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    
    // Add user message to chat display
    const userChatMessage: ChatMessage = { sender: 'user', text: userMessage };
    setMessages(prev => [...prev, userChatMessage]);
    
    // Add user message to conversation history
    const userHistoryMessage: Message = { role: 'user', content: userMessage };
    const updatedHistory = [...conversationHistory, userHistoryMessage];
    setConversationHistory(updatedHistory);
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to get response');
      }

      const data = await response.json();
      
      // Add assistant response to chat display
      const botMessage: ChatMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
      
      // Add assistant response to conversation history
      const assistantHistoryMessage: Message = { role: 'assistant', content: data.reply };
      setConversationHistory(prev => [...prev, assistantHistoryMessage]);
      
      // Log token usage if available
      if (data.usage) {
        console.log('Token usage:', data.usage);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = { 
        sender: 'bot', 
        text: `Error: ${error instanceof Error ? error.message : 'An unexpected error occurred'}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Emma - Spiritual Guide</h1>
          <p className="text-sm text-gray-600 mt-1">Your companion on the journey of spiritual awakening</p>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900'
                } shadow`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 rounded-lg px-4 py-2 shadow">
                Emma is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Emma about your spiritual journey..."

            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </main>
    </div>
  );
}
