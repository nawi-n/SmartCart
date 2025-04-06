import React from 'react';
import { Product } from '../services/productService';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <Link href={`/products/${product.id}`} className="hover:text-indigo-600">
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Category:</span> {product.category}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Price:</span> ${product.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Rating:</span> {product.rating}/5
        </p>
      </div>

      <div className="mt-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded"
        />
      </div>
    </div>
  );
}; 