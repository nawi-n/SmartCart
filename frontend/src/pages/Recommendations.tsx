import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getRecommendations,
  getRecommendationExplanation,
  submitRecommendationFeedback,
  ProductProfile,
} from '../api/client';
import ProductCard from '../components/ProductCard';

interface RecommendationWithProduct {
  id: string;
  product: ProductProfile;
  score: number;
  explanation: string;
}

const Recommendations: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [recommendations, setRecommendations] = useState<RecommendationWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!customerId) return;

      try {
        const response = await getRecommendations(customerId);
        const recommendationsWithProducts = response.data.map(product => ({
          id: product.id,
          product,
          score: product.psychographic_match || 0,
          explanation: '',
        }));
        setRecommendations(recommendationsWithProducts);
      } catch (err) {
        setError('Failed to fetch recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [customerId]);

  const handleGetExplanation = async (productId: string) => {
    if (!customerId) return;

    try {
      const response = await getRecommendationExplanation(customerId, productId);
      setExplanations(prev => ({
        ...prev,
        [productId]: response.data.explanation,
      }));
    } catch (err) {
      console.error('Failed to get explanation:', err);
    }
  };

  const handleFeedback = async (productId: string, helpful: boolean) => {
    if (!customerId) return;

    try {
      await submitRecommendationFeedback(customerId, productId, {
        helpful,
        reason: helpful ? 'Matches my preferences' : 'Not what I was looking for',
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recommended Products</h1>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map(recommendation => (
          <div key={recommendation.id} className="space-y-4">
            <ProductCard
              product={recommendation.product}
              showPsychographicMatch={true}
            />

            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Match Score: {(recommendation.score * 100).toFixed(1)}%
                  </p>
                  {recommendation.explanation && (
                    <p className="text-sm text-gray-600 mt-1">
                      {recommendation.explanation}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFeedback(recommendation.id, true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Helpful
                  </button>
                  <button
                    onClick={() => handleFeedback(recommendation.id, false)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Not Helpful
                  </button>
                </div>

                {!explanations[recommendation.id] ? (
                  <button
                    onClick={() => handleGetExplanation(recommendation.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Get Explanation
                  </button>
                ) : (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Why we recommend this
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {explanations[recommendation.id]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations; 