import { ProductProfile } from '../api/client';

export const sampleProducts: ProductProfile[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    brand: 'SoundMaster',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    features: ['Noise Cancellation', 'Bluetooth 5.0', '30-hour battery'],
    unique_selling_points: ['Premium sound quality', 'Comfortable fit'],
    price_point: 'premium',
    quality_level: 'high',
    mood_tags: ['focused', 'relaxed'],
    story: 'Engineered for audiophiles who demand the best',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Organic Cotton T-shirt',
    brand: 'EcoWear',
    category: 'Fashion',
    description: 'Sustainable and comfortable everyday t-shirt',
    price: 29.99,
    features: ['100% Organic Cotton', 'Fair Trade Certified'],
    unique_selling_points: ['Eco-friendly', 'Soft and durable'],
    price_point: 'mid-range',
    quality_level: 'high',
    mood_tags: ['casual', 'eco-conscious'],
    story: 'Made with love for the planet and your comfort',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Smart Fitness Tracker',
    brand: 'FitTech',
    category: 'Fitness',
    description: 'Advanced fitness tracker with heart rate monitoring',
    price: 149.99,
    features: ['Heart Rate Monitor', 'Sleep Tracking', 'Water Resistant'],
    unique_selling_points: ['Comprehensive health metrics', 'Long battery life'],
    price_point: 'mid-range',
    quality_level: 'high',
    mood_tags: ['active', 'health-conscious'],
    story: 'Your personal health companion for a better lifestyle',
    image_url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]; 