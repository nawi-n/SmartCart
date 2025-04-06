import axios from 'axios';
import { cache, withCache } from '../utils/cache';
import { createRetryInterceptor } from '../utils/retry';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add retry interceptor
apiClient.interceptors.response.use(undefined, createRetryInterceptor());

export interface ProductProfile {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  features: string[];
  unique_selling_points: string[];
  price_point: string;
  quality_level: string;
  mood_tags: string[];
  story: string;
  image_url: string;
  psychographic_match?: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerPersona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  psychographic_traits?: string[];
  behavioral_patterns?: string[];
  created_at: string;
  updated_at: string;
}

export interface CustomerBehavior {
  viewed_products: string[];
  time_spent: Record<string, number>;
  search_history: string[];
  category_interests: Record<string, number>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const generateCustomerPersona = async (customerId: string) => {
  const response = await axios.post(`${API_BASE_URL}/generate_persona`, {
    customer_id: customerId
  });
  return response.data;
};

export const getProducts = async () => {
  return withCache('products', async () => {
    const response = await apiClient.get('/products');
    return response.data;
  });
};

export const updateCustomerBehavior = async (data: CustomerBehavior) => {
  const response = await apiClient.post<ApiResponse<CustomerBehavior>>('/customer/behavior', data);
  return response.data;
};

export const getRecommendations = async (customerId: string, mood?: string) => {
  const cacheKey = `recommendations:${customerId}:${mood || 'default'}`;
  return withCache(cacheKey, async () => {
    const response = await apiClient.get(`/recommendations/${customerId}`, {
      params: { mood },
    });
    return response.data;
  });
};

export const getProduct = async (productId: string) => {
  const cacheKey = `product:${productId}`;
  return withCache(cacheKey, async () => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  });
};

export const generateProductProfile = async (productData: Partial<ProductProfile>) => {
  const response = await apiClient.post<ApiResponse<ProductProfile>>('/product/profile', productData);
  return response.data;
};

export const generateProductStory = async (productId: string) => {
  const response = await apiClient.post<ApiResponse<{ story: string }>>('/product/story', { product_id: productId });
  return response.data;
};

export const getRecommendationExplanation = async (customerId: string, productId: string) => {
  const response = await apiClient.get<ApiResponse<{
    explanation: string;
    psychographic_match?: number;
    behavioral_match?: number;
    mood_match?: number;
  }>>(`/recommendations/${customerId}/explain/${productId}`);
  return response.data;
};

export const submitRecommendationFeedback = async (
  customerId: string,
  productId: string,
  feedback: {
    helpful: boolean;
    reason?: string;
  }
) => {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>('/recommendations/feedback', {
    customer_id: customerId,
    product_id: productId,
    ...feedback,
  });
  return response.data;
};

export const getChatResponse = async (
  customerId: string,
  message: string,
  context?: {
    products?: ProductProfile[];
    recommendations?: ProductProfile[];
  }
) => {
  const response = await apiClient.post<ApiResponse<{
    response: string;
    recommendations?: ProductProfile[];
  }>>('/chat/message', {
    customer_id: customerId,
    message,
    context,
  });
  return response.data;
};

export const voiceSearch = async (query: string) => {
  const response = await apiClient.post<ApiResponse<ProductProfile[]>>('/voice/search', {
    query,
  });
  return response.data;
};

export const trackMood = async (customerId: string, mood: string) => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>('/mood/track', {
    customer_id: customerId,
    mood,
  });
  return response.data;
};

export const sendChatMessage = async (customerId: string, message: string) => {
  const response = await axios.post(`${API_BASE_URL}/chat/message`, {
    customer_id: customerId,
    message
  });
  return response.data;
}; 