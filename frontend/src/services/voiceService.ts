import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const voiceService = {
  async speechToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    const response = await axios.post(`${API_URL}/api/voice/speech-to-text`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.text;
  },

  async textToSpeech(text: string): Promise<Blob> {
    const response = await axios.post(
      `${API_URL}/api/voice/text-to-speech`,
      { text },
      { responseType: 'blob' }
    );

    return response.data;
  },
}; 