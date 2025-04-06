import axios from 'axios';
import { ProductProfile } from '../api/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const recommendationService = {
  async getRecommendations(customerId: string): Promise<ProductProfile[]> {
    const response = await axios.get(`${API_URL}/api/recommendations/${customerId}`);
    return response.data;
  },

  async getRecommendationExplanation(customerId: string, productId: string): Promise<string> {
    const response = await axios.get(
      `${API_URL}/api/recommendations/${customerId}/explain/${productId}`
    );
    return response.data.explanation;
  },

  async submitFeedback(
    customerId: string,
    productId: string,
    feedback: { helpful: boolean; reason: string }
  ): Promise<void> {
    await axios.post(`${API_URL}/api/recommendations/${customerId}/feedback/${productId}`, feedback);
  }
}; 