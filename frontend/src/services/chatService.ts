import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const chatService = {
  async sendMessage(message: string): Promise<string> {
    const response = await axios.post(`${API_URL}/api/chat/message`, { message });
    return response.data.response;
  },

  async getChatHistory(): Promise<any[]> {
    const response = await axios.get(`${API_URL}/api/chat/history`);
    return response.data;
  },

  async clearChatHistory(): Promise<void> {
    await axios.delete(`${API_URL}/api/chat/history`);
  },
}; 