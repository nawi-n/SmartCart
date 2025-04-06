import React, { useState, useEffect } from 'react';
import { voiceSearch, ProductProfile } from '../api/client';
import './VoiceSearch.css';

interface VoiceSearchProps {
  onResults: (results: ProductProfile[]) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onResults }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      setIsListening(false);
      setError(`Error: ${event.error}`);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      
      try {
        const response = await voiceSearch(transcript);
        onResults(response.data);
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Failed to search products'}`);
      }
    };

    return () => {
      recognition.abort();
    };
  }, [onResults]);

  const toggleListening = () => {
    if (isListening) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.stop();
    } else {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.start();
    }
  };

  return (
    <div className="voice-search">
      <button
        onClick={toggleListening}
        className={`voice-search-button ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? 'Listening...' : '🎤'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default VoiceSearch; 