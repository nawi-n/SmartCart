import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';
import { ProductProfile } from '../../api/client';

const mockProduct: ProductProfile = {
  id: '1',
  name: 'Test Product',
  brand: 'Test Brand',
  category: 'Test Category',
  description: 'Test Description',
  price: 99.99,
  features: ['Feature 1', 'Feature 2'],
  unique_selling_points: ['USP 1', 'USP 2'],
  price_point: 'premium',
  quality_level: 'high',
  mood_tags: ['happy', 'excited'],
  story: 'Test Story',
  image_url: 'https://example.com/image.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    // Check basic information
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`₹${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    
    // Check features
    mockProduct.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    
    // Check mood tags
    mockProduct.mood_tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('displays the product image', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText(mockProduct.name);
    expect(image).toHaveAttribute('src', mockProduct.image_url);
  });

  it('handles missing optional fields gracefully', () => {
    const minimalProduct: ProductProfile = {
      ...mockProduct,
      features: [],
      unique_selling_points: [],
      mood_tags: [],
      story: '',
      image_url: ''
    };
    
    render(<ProductCard product={minimalProduct} />);
    
    // Basic information should still be visible
    expect(screen.getByText(minimalProduct.name)).toBeInTheDocument();
    expect(screen.getByText(minimalProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(minimalProduct.description)).toBeInTheDocument();
  });

  it('formats price correctly in Indian Rupees', () => {
    const productWithDecimal = { ...mockProduct, price: 99.99 };
    const productWithoutDecimal = { ...mockProduct, price: 100 };
    
    render(<ProductCard product={productWithDecimal} />);
    expect(screen.getByText('₹99.99')).toBeInTheDocument();
    
    render(<ProductCard product={productWithoutDecimal} />);
    expect(screen.getByText('₹100.00')).toBeInTheDocument();
  });
}); 