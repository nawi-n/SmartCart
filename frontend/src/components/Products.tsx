import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendations, trackMood } from '../api/client';
import ProductCard from './ProductCard';
import ChatAssistant from './ChatAssistant';
import VoiceSearch from './VoiceSearch';
import MoodSelector from './MoodSelector';
import { ProductProfile } from '../api/client';
import { sampleProducts } from '../data/mockData';

const Products: React.FC = () => {
  const { customerId, persona } = useAuth();
  const [products, setProducts] = useState<ProductProfile[]>(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (mood: string | null = null) => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getRecommendations(customerId, mood);
      setProducts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      // Fallback to sample products
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchRecommendations(currentMood);
  }, [fetchRecommendations, currentMood]);

  const handleMoodChange = async (mood: string) => {
    if (!customerId) return;

    try {
      setCurrentMood(mood);
      await trackMood(customerId, mood);
      await fetchRecommendations(mood);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mood');
    }
  };

  const handleVoiceSearch = (results: ProductProfile[]) => {
    setProducts(results);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <VoiceSearch onResults={handleVoiceSearch} />
        </div>
        <MoodSelector onMoodChange={handleMoodChange} />
      </div>

      <div className="category-filters">
        <button
          className={!selectedCategory ? 'active' : ''}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {Array.from(new Set(products.map(p => p.category))).map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <ChatAssistant customerId={customerId || ''} />
    </div>
  );
};

export default Products; 