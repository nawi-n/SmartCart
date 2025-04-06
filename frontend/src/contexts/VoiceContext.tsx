import React, { createContext, useContext, useState, useCallback } from 'react';
import { voiceService } from '../services/voiceService';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  clearTranscript: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(async () => {
    try {
      await voiceService.startListening();
      setIsListening(true);
    } catch (err) {
      console.error('Error starting voice recognition:', err);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await voiceService.stopListening();
      setIsListening(false);
    } catch (err) {
      console.error('Error stopping voice recognition:', err);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        startListening,
        stopListening,
        clearTranscript,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}; 