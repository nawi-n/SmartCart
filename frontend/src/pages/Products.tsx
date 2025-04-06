import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductProfile } from '../api/client';
import ProductCard from '../components/ProductCard';
import ChatAssistant from '../components/ChatAssistant';
import VoiceSearch from '../components/VoiceSearch';
import { getProducts, updateCustomerBehavior } from '../api/client';
import debounce from 'lodash/debounce';
import MoodSelector from '../components/MoodSelector';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChatAssistant, setShowChatAssistant] = useState(false);
  const [behaviorData, setBehaviorData] = useState({
    viewedProducts: [] as string[],
    timeSpentOnProducts: {} as Record<string, number>,
    searchHistory: [] as string[],
    categoryInterests: {} as Record<string, number>,
    lastProductView: Date.now(),
  });
  const [customerId] = useState('1'); // In a real app, this would come from auth context

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Track product views and time spent
  const trackProductView = useCallback((productId: string) => {
    setBehaviorData(prev => {
      const now = Date.now();
      const timeSpent = prev.timeSpentOnProducts[productId] || 0;
      const timeDiff = now - prev.lastProductView;
      
      // Update time spent on previous product if applicable
      const updatedTimeSpent = { ...prev.timeSpentOnProducts };
      if (prev.viewedProducts.length > 0) {
        const lastViewedProduct = prev.viewedProducts[prev.viewedProducts.length - 1];
        if (lastViewedProduct) {
          updatedTimeSpent[lastViewedProduct] = (updatedTimeSpent[lastViewedProduct] || 0) + timeDiff;
        }
      }

      return {
        ...prev,
        viewedProducts: [...prev.viewedProducts, productId],
        timeSpentOnProducts: updatedTimeSpent,
        lastProductView: now,
      };
    });
  }, []);

  // Track category interactions
  const trackCategoryInteraction = useCallback((category: string) => {
    setBehaviorData(prev => ({
      ...prev,
      categoryInterests: {
        ...prev.categoryInterests,
        [category]: (prev.categoryInterests[category] || 0) + 1,
      },
    }));
  }, []);

  // Track search behavior
  const trackSearch = useCallback((term: string) => {
    setBehaviorData(prev => ({
      ...prev,
      searchHistory: [...prev.searchHistory, term],
    }));
  }, []);

  // Debounced behavior update to backend
  const updateBehavior = useCallback(
    debounce(async (behavior: typeof behaviorData) => {
      try {
        await updateCustomerBehavior({
          viewed_products: behavior.viewedProducts,
          time_spent: behavior.timeSpentOnProducts,
          search_history: behavior.searchHistory,
          category_interests: behavior.categoryInterests,
        });
      } catch (err) {
        console.error('Failed to update behavior:', err);
      }
    }, 5000),
    []
  );

  // Update backend when behavior changes
  useEffect(() => {
    updateBehavior(behaviorData);
  }, [behaviorData, updateBehavior]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    trackSearch(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category !== 'all') {
      trackCategoryInteraction(category);
    }
  };

  const handleVoiceSearch = (transcript: string) => {
    setSearchTerm(transcript);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

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

      <MoodSelector customerId={customerId} />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <VoiceSearch onTranscript={handleVoiceSearch} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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
                <div
                  key={product.id}
                  onClick={() => trackProductView(product.id)}
                  className="cursor-pointer"
                >
                  <ProductCard product={product} />
                </div>
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
            <ChatAssistant customerId={customerId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 