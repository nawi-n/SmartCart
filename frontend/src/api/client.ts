import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

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

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateCustomerPersona = async (data: Partial<CustomerPersona>) => {
  const response = await client.post<ApiResponse<CustomerPersona>>('/customer/persona', data);
  return response.data;
};

export const getProducts = async () => {
  const response = await client.get<ApiResponse<ProductProfile[]>>('/products');
  return response.data;
};

export const updateCustomerBehavior = async (data: CustomerBehavior) => {
  const response = await client.post<ApiResponse<CustomerBehavior>>('/customer/behavior', data);
  return response.data;
};

export const getRecommendations = async (customerId: string) => {
  const response = await client.get<ApiResponse<ProductProfile[]>>(`/recommendations/${customerId}`);
  return response.data;
};

export const getProductDetails = async (productId: string) => {
  const response = await client.get<ApiResponse<ProductProfile>>(`/products/${productId}`);
  return response.data;
};

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
export const generateProductProfile = async (productData: any): Promise<ApiResponse<ProductProfile>> => {
  const response = await client.post('/product/profile', productData);
  return response.data;
};

export const generateProductStory = async (productId: string): Promise<ApiResponse<{ story: string }>> => {
  const response = await client.post('/product/story', { product_id: productId });
  return response.data;
};

// Recommendation Agent Interfaces
export const getRecommendationExplanation = async (
  customerId: string, 
  productId: string
): Promise<ApiResponse<{ 
  explanation: string;
  psychographic_match: number;
  mood_match?: number;
}>> => {
  const response = await client.post('/recommendations/explain', {
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
  const response = await client.post('/recommendations/feedback', {
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
  const response = await client.post('/chat/message', {
    customer_id: customerId,
    message: message,
  });
  return response.data;
}; 