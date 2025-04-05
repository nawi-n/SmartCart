import React, { useState } from 'react';
import { getChatResponse, ProductProfile } from '../api/client';
import ProductCard from './ProductCard';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  recommendations?: ProductProfile[];
}

interface ChatAssistantProps {
  customerId: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ customerId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setError(null);

    // Add user message immediately
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const response = await getChatResponse(customerId, userMessage);
      setMessages(prev => [
        ...prev,
        {
          type: 'assistant',
          content: response.data.response,
          recommendations: response.data.recommendations,
        },
      ]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {message.recommendations.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about products or get recommendations..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatAssistant; 