import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCustomerPersona, updateCustomerMood, CustomerPersona } from '../api/client';

const MOOD_OPTIONS = [
  'Happy', 'Relaxed', 'Energetic', 'Professional', 'Casual', 'Adventurous'
];

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
    shopping_preferences: '',
    budget_consciousness: 'moderate',
    brand_affinity: 'moderate',
    decision_making_style: 'balanced',
    current_mood: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        shopping_preferences: formData.shopping_preferences.split(',').map(p => p.trim()),
        mood: formData.current_mood,
      };

      const response = await generateCustomerPersona(customerData);
      setCustomer(response.data);
      navigate('/recommendations');
    } catch (err) {
      console.error('Failed to generate customer persona:', err);
      setError('Failed to generate customer persona. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodUpdate = async (mood: string) => {
    if (!customer) return;

    try {
      const response = await updateCustomerMood(customer.id, mood);
      setCustomer(response.data);
    } catch (err) {
      setError('Failed to update mood. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Customer Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
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
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
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

            {/* Preferences and Behaviors */}
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

            <div>
              <label htmlFor="shopping_preferences" className="block text-sm font-medium text-gray-700">
                Shopping Preferences (comma-separated)
              </label>
              <textarea
                name="shopping_preferences"
                id="shopping_preferences"
                required
                value={formData.shopping_preferences}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., online shopping, in-store browsing, quick decisions"
              />
            </div>

            {/* Shopping Behavior */}
            <div>
              <label htmlFor="budget_consciousness" className="block text-sm font-medium text-gray-700">
                Budget Consciousness
              </label>
              <select
                name="budget_consciousness"
                id="budget_consciousness"
                required
                value={formData.budget_consciousness}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="value_oriented">Value Oriented</option>
                <option value="moderate">Moderate</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label htmlFor="brand_affinity" className="block text-sm font-medium text-gray-700">
                Brand Affinity
              </label>
              <select
                name="brand_affinity"
                id="brand_affinity"
                required
                value={formData.brand_affinity}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="brand_loyal">Brand Loyal</option>
                <option value="moderate">Moderate</option>
                <option value="brand_flexible">Brand Flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="decision_making_style" className="block text-sm font-medium text-gray-700">
                Decision Making Style
              </label>
              <select
                name="decision_making_style"
                id="decision_making_style"
                required
                value={formData.decision_making_style}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="impulsive">Impulsive</option>
                <option value="balanced">Balanced</option>
                <option value="analytical">Analytical</option>
              </select>
            </div>

            {/* Current Mood */}
            <div>
              <label htmlFor="current_mood" className="block text-sm font-medium text-gray-700">
                Current Shopping Mood
              </label>
              <select
                name="current_mood"
                id="current_mood"
                required
                value={formData.current_mood}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a mood...</option>
                {MOOD_OPTIONS.map(mood => (
                  <option key={mood} value={mood.toLowerCase()}>{mood}</option>
                ))}
              </select>
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
                {loading ? 'Generating Profile...' : 'Generate Profile'}
              </button>
            </div>
          </form>
        </div>

        {customer && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generated Customer Persona</h3>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.age}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Occupation</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.occupation}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Interests</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.interests.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Shopping Preferences</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.shopping_preferences.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget Consciousness</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.budget_consciousness}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Brand Affinity</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.brand_affinity}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Decision Making Style</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.decision_making_style}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Mood</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.mood || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Psychographic Traits</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.psychographic_traits?.join(', ') || 'No traits specified'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Behavioral Patterns</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.behavioral_patterns?.join(', ') || 'No patterns specified'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile; 