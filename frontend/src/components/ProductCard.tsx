import React from 'react';
import { ProductProfile } from '../api/client';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: ProductProfile;
  showPsychographicMatch?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showPsychographicMatch = false 
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link to={`/products/${product.id}`} className="hover:text-indigo-600">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>
        {showPsychographicMatch && product.psychographic_match !== undefined && (
          <div className="flex items-start">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {Math.round(product.psychographic_match * 100)}% Match
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Category:</span> {product.category}
        </p>
        {product.features && product.features.length > 0 && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Features:</span> {product.features.join(', ')}
          </p>
        )}
        {product.unique_selling_points && product.unique_selling_points.length > 0 && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Unique Points:</span> {product.unique_selling_points.join(', ')}
          </p>
        )}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price Point:</span> {product.price_point}
        </p>
        {product.quality_level && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Quality:</span> {product.quality_level}
          </p>
        )}
      </div>

      {product.mood_tags && product.mood_tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {product.mood_tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {product.story && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-3">{product.story}</p>
          <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
            Read full story
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard; 