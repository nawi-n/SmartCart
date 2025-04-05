import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCustomerPersona, CustomerPersona } from '../api/client';

const CustomerProfile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerPersona | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    interests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const customerData = {
        ...formData,
        age: parseInt(formData.age),
        interests: formData.interests.split(',').map(i => i.trim()),
      };

      const response = await generateCustomerPersona(customerData);
      setCustomer(response.data);
      navigate('/products'); // Navigate to products page to start behavior tracking
    } catch (err) {
      console.error('Failed to generate customer persona:', err);
      setError('Failed to generate customer persona. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to SmartCart</h1>
          <p className="mt-4 text-lg text-gray-600">
            Tell us a bit about yourself, and our AI will personalize your shopping experience.
            We'll analyze your browsing patterns to understand your preferences better.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              id="age"
              required
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              id="occupation"
              required
              value={formData.occupation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
              Interests (comma-separated)
            </label>
            <textarea
              name="interests"
              id="interests"
              required
              value={formData.interests}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., technology, fashion, sports, cooking"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Profile...' : 'Start Shopping'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-600">
          <h2 className="font-medium text-gray-900 mb-2">How it works:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Our AI analyzes your browsing patterns and interactions</li>
            <li>We automatically detect your shopping preferences and style</li>
            <li>Product recommendations adapt to your behavior in real-time</li>
            <li>Your mood and context are considered for better suggestions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile; 