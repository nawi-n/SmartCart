import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductProfile } from '../api/client';
import { recommendationService } from '../services/recommendationService';
import { useAuth } from './AuthContext';

interface RecommendationContextType {
  recommendations: ProductProfile[];
  loading: boolean;
  error: string | null;
  refreshRecommendations: () => Promise<void>;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<ProductProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await recommendationService.getRecommendations(user.id);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        loading,
        error,
        refreshRecommendations: fetchRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
}; 