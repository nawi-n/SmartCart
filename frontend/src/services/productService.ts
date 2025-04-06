import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Product {
  id: number;
  product_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string | null;
  brand: string | null;
  image_url: string | null;
  rating: number | null;
  stock: number | null;
  story: string | null;
  product_metadata: any | null;
  average_rating_similar_products: number | null;
  product_rating: number | null;
  customer_review_sentiment_score: number | null;
  holiday: string | null;
  season: string | null;
  geographical_location: string | null;
  similar_product_list: any | null;
  probability_of_recommendation: number | null;
  created_at: string;
  updated_at: string;
}

// Mock data for when the backend is unavailable
const mockProducts: Product[] = [
  {
    id: 1,
    product_id: 'PROD001',
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 999.99,
    category: 'Electronics',
    subcategory: 'Phones',
    brand: 'TechCo',
    image_url: 'https://via.placeholder.com/150',
    rating: 4.5,
    stock: 100,
    story: 'A revolutionary smartphone',
    product_metadata: { tags: ['phone', 'smartphone'] },
    average_rating_similar_products: 4.3,
    product_rating: 4.5,
    customer_review_sentiment_score: 0.8,
    holiday: 'None',
    season: 'Spring',
    geographical_location: 'Global',
    similar_product_list: { products: ['PROD002', 'PROD003'] },
    probability_of_recommendation: 0.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    product_id: 'PROD002',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    price: 299.99,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundMaster',
    image_url: 'https://via.placeholder.com/150',
    rating: 4.8,
    stock: 50,
    story: 'Experience the best sound',
    product_metadata: { features: ['noise-cancelling', 'wireless'] },
    average_rating_similar_products: 4.7,
    product_rating: 4.8,
    customer_review_sentiment_score: 0.9,
    holiday: 'Christmas',
    season: 'Winter',
    geographical_location: 'US',
    similar_product_list: { products: ['PROD001', 'PROD003'] },
    probability_of_recommendation: 0.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    product_id: 'PROD003',
    name: 'Smart Watch',
    description: 'Fitness tracker and smart notifications',
    price: 199.99,
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'TechCo',
    image_url: 'https://via.placeholder.com/150',
    rating: 4.2,
    stock: 75,
    story: 'Track your health effortlessly',
    product_metadata: { compatibility: ['iOS', 'Android'] },
    average_rating_similar_products: 4.1,
    product_rating: 4.2,
    customer_review_sentiment_score: 0.7,
    holiday: 'None',
    season: 'Spring',
    geographical_location: 'Global',
    similar_product_list: { products: ['PROD001', 'PROD002'] },
    probability_of_recommendation: 0.7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return mock data when backend is unavailable
      return mockProducts;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${API_URL}/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      // Return mock product if available
      return mockProducts.find(p => p.product_id === id) || null;
    }
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/category/${category}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      // Return filtered mock data
      return mockProducts.filter(p => p.category === category);
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_URL}/products/search/?q=${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products:`, error);
      // Return filtered mock data
      const searchLower = query.toLowerCase();
      return mockProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }
  }
}; 