import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductProfile } from '../api/client';
import ProductCard from '../components/ProductCard';
import ChatAssistant from '../components/ChatAssistant';
import VoiceSearch from '../components/VoiceSearch';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChatAssistant, setShowChatAssistant] = useState(false);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/products');
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError('Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVoiceSearch = (transcript: string) => {
    setSearchTerm(transcript);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shop Products</h1>
        <button
          onClick={() => setShowChatAssistant(!showChatAssistant)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {showChatAssistant ? 'Hide Assistant' : 'Shopping Assistant'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <VoiceSearch onTranscript={handleVoiceSearch} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-100" />
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showPsychographicMatch={true}
                />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <p className="text-center text-gray-600 py-8">
              No products found. Try adjusting your search or filters.
            </p>
          )}
        </div>

        {/* Chat Assistant Sidebar */}
        {showChatAssistant && (
          <div className="w-full md:w-1/4">
            <ChatAssistant customerId="current-user" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 