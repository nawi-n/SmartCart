import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer Agent Interfaces
export interface CustomerPersona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  shopping_preferences: string[];
  budget_consciousness: string;
  brand_affinity: string;
  decision_making_style: string;
  mood?: string;
  psychographic_traits: string[];
  behavioral_patterns: string[];
}

// Product Agent Interfaces
export interface ProductProfile {
  id: string;
  name: string;
  brand: string;
  category: string;
  features: string[];
  target_audience: string[];
  price_point: string;
  unique_selling_points: string[];
  quality_level: string;
  mood_tags: string[];
  story: string;
  psychographic_match_score?: number;
  created_at?: string;
  updated_at?: string;
}

// Recommendation Agent Interfaces
export interface Recommendation {
  product_id: string;
  score: number;
  explanation: string;
  mood_match?: number;
  psychographic_match?: number;
  behavioral_match?: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

// Customer Agent APIs
export const generateCustomerPersona = async (customerData: any): Promise<ApiResponse<CustomerPersona>> => {
  const response = await api.post('/customer/persona', customerData);
  return response.data;
};

export const updateCustomerMood = async (customerId: string, mood: string): Promise<ApiResponse<CustomerPersona>> => {
  const response = await api.post(`/customer/${customerId}/mood`, { mood });
  return response.data;
};

// Product Agent APIs
export const generateProductProfile = async (productData: any): Promise<ApiResponse<ProductProfile>> => {
  const response = await api.post('/product/profile', productData);
  return response.data;
};

export const generateProductStory = async (productId: string): Promise<ApiResponse<{ story: string }>> => {
  const response = await api.post('/product/story', { product_id: productId });
  return response.data;
};

// Recommendation Agent APIs
export const getRecommendations = async (
  customerId: string,
  mood?: string
): Promise<ApiResponse<Recommendation[]>> => {
  const response = await api.post('/recommendations', { 
    customer_id: customerId,
    mood: mood 
  });
  return response.data;
};

export const getRecommendationExplanation = async (
  customerId: string, 
  productId: string
): Promise<ApiResponse<{ 
  explanation: string;
  psychographic_match: number;
  mood_match?: number;
}>> => {
  const response = await api.post('/recommendations/explain', {
    customer_id: customerId,
    product_id: productId,
  });
  return response.data;
};

export const submitRecommendationFeedback = async (
  customerId: string,
  productId: string,
  feedback: {
    liked: boolean;
    mood_accurate?: boolean;
    explanation_helpful?: boolean;
  }
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await api.post('/recommendations/feedback', {
    customer_id: customerId,
    product_id: productId,
    ...feedback,
  });
  return response.data;
};

// Chat Assistant APIs
export const getChatResponse = async (
  customerId: string,
  message: string
): Promise<ApiResponse<{
  response: string;
  recommendations?: ProductProfile[];
}>> => {
  const response = await api.post('/chat/message', {
    customer_id: customerId,
    message: message,
  });
  return response.data;
}; 