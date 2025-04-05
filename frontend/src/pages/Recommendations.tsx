import { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

const Recommendations = () => {
  const [customerId, setCustomerId] = useState('1'); // Default to customer ID 1 for demo
  const { data: recommendations, isLoading, error } = useRecommendations(customerId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error loading recommendations</h2>
        <p className="mt-2 text-gray-600">
          Please try refreshing the page or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h1>
        <div className="flex items-center gap-4">
          <label htmlFor="customerId" className="text-sm font-medium text-gray-700">
            Customer ID:
          </label>
          <input
            type="text"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="input w-32"
          />
        </div>
      </div>

      {recommendations?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">No recommendations found</h2>
          <p className="mt-2 text-gray-600">
            We couldn't find any personalized recommendations for this customer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recommendations?.map((product: Product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              category={product.category}
              imageUrl={product.image_url}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations; 