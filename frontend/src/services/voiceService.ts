import axios from 'axios';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const voiceService = {
  async startListening(): Promise<void> {
    // Initialize browser's Web Speech API
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.start();
  },

  async stopListening(): Promise<void> {
    // Stop browser's Web Speech API
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.stop();
  },

  async speechToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    const response = await axios.post(`${API_URL}/api/voice/speech-to-text`, formData);
    return response.data.text;
  },

  async textToSpeech(text: string): Promise<Blob> {
    const response = await axios.post(
      `${API_URL}/api/voice/text-to-speech`,
      { text },
      { responseType: 'blob' }
    );
    return response.data;
  }
}; 