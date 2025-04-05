import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';
import {
  getRecommendations,
  getRecommendationExplanation,
  submitRecommendationFeedback,
  Recommendation,
  ProductProfile,
} from '../api/client';
import ProductCard from '../components/ProductCard';

interface RecommendationWithProduct extends Recommendation {
  product: ProductProfile;
}

const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationWithProduct[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const fetchRecommendations = useCallback(async () => {
    if (!customer) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getRecommendations(customer.id);
      const recommendationsWithProducts = response.data.map(rec => ({
        ...rec,
        product: {
          id: rec.product_id,
          name: 'Loading...',
          brand: '',
          category: '',
          features: [],
          target_audience: [],
          price_point: '',
          unique_selling_points: [],
          quality_level: '',
          mood_tags: [],
          story: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }));
      setRecommendations(recommendationsWithProducts);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (!customer) {
      navigate('/customer');
      return;
    }

    fetchRecommendations();
  }, [customer, navigate, fetchRecommendations]);

  const handleGetExplanation = async (productId: string) => {
    if (!customer) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getRecommendationExplanation(customer.id, productId);
      setExplanations(prev => ({
        ...prev,
        [productId]: response.data.explanation,
      }));
    } catch (err) {
      setError('Failed to get recommendation explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (productId: string, liked: boolean) => {
    if (!customer) return;

    try {
      await submitRecommendationFeedback(customer.id, productId, {
        liked,
        mood_accurate: true,
        explanation_helpful: true,
      });
      await fetchRecommendations();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Personalized Recommendations
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Shopping as: {customer.name}
          </span>
          <span className="text-sm text-gray-600">
            Mood: {customer.mood || 'Not specified'}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map(recommendation => (
          <div key={recommendation.product_id} className="space-y-4">
            <ProductCard 
              product={recommendation.product}
              showPsychographicMatch={true}
            />
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Recommendation Score: {(recommendation.score * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {recommendation.explanation}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFeedback(recommendation.product_id, true)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    👍 Like
                  </button>
                  <button
                    onClick={() => handleFeedback(recommendation.product_id, false)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>

              {!explanations[recommendation.product_id] ? (
                <button
                  onClick={() => handleGetExplanation(recommendation.product_id)}
                  disabled={loading}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Get Detailed Explanation
                </button>
              ) : (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    Detailed Explanation:
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {explanations[recommendation.product_id]}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && recommendations.length === 0 && (
        <p className="text-center text-gray-600 py-8">
          No recommendations available. Try updating your profile or mood.
        </p>
      )}
    </div>
  );
};

export default Recommendations; 