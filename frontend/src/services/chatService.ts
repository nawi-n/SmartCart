import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ChatResponse {
  content: string;
  timestamp: string;
  messageId: string;
}

export const chatService = {
  async sendMessage(customerId: string, content: string): Promise<ChatResponse> {
    const response = await axios.post(`${API_URL}/api/chat/messages`, {
      customerId,
      content,
    });
    return response.data;
  },

  async getHistory(customerId: string): Promise<ChatResponse[]> {
    const response = await axios.get(`${API_URL}/api/chat/history/${customerId}`);
    return response.data;
  },

  async clearHistory(customerId: string): Promise<void> {
    await axios.delete(`${API_URL}/api/chat/history/${customerId}`);
  }
}; 