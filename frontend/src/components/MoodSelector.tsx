import React, { useState } from 'react';
import { trackMood } from '../api/client';
import './MoodSelector.css';

interface MoodSelectorProps {
  customerId: string;
  onMoodChange: (mood: string) => Promise<void>;
}

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😍', label: 'Excited' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😌', label: 'Relaxed' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({ customerId, onMoodChange }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMoodSelect = async (mood: string) => {
    try {
      await trackMood(customerId, mood);
      setSelectedMood(mood);
      setError(null);
      await onMoodChange(mood);
    } catch (err) {
      console.error('Failed to track mood:', err);
      setError('Failed to update mood. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">How are you feeling today?</h3>
      <div className="flex flex-wrap gap-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleMoodSelect(mood.label)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
              selectedMood === mood.label
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default MoodSelector; 