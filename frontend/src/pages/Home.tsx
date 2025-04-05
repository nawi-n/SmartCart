import React from 'react';
import { Link } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';

const Home: React.FC = () => {
  const { customer } = useCustomer();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to SmartCart
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Your intelligent shopping companion powered by AI. Get personalized product
        recommendations based on your unique profile and preferences.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {!customer ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Create Your Profile
            </h2>
            <p className="text-gray-600 mb-6">
              Start by creating your customer profile to get personalized
              recommendations tailored just for you.
            </p>
            <Link
              to="/customer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Profile
            </Link>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              View Recommendations
            </h2>
            <p className="text-gray-600 mb-6">
              Check out your personalized product recommendations based on your
              profile.
            </p>
            <Link
              to="/recommendations"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              See Recommendations
            </Link>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Browse Products
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our catalog of products with detailed AI-generated profiles and
            stories.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 