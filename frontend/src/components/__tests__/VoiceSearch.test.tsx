import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VoiceSearch from '../VoiceSearch';
import { voiceSearch } from '../../api/client';

// Mock the API client
jest.mock('../../api/client', () => ({
  voiceSearch: jest.fn()
}));

// Mock the SpeechRecognition API
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
  onresult: jest.fn(),
  onerror: jest.fn(),
  onend: jest.fn()
};

// @ts-ignore
window.SpeechRecognition = jest.fn(() => mockSpeechRecognition);
// @ts-ignore
window.SpeechRecognition.prototype = mockSpeechRecognition;

describe('VoiceSearch', () => {
  const mockOnResults = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the voice search button', () => {
    render(<VoiceSearch onResults={mockOnResults} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('starts listening when button is clicked', () => {
    render(<VoiceSearch onResults={mockOnResults} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    expect(mockSpeechRecognition.start).toHaveBeenCalled();
    expect(screen.getByText('Listening...')).toBeInTheDocument();
  });

  it('stops listening when button is clicked again', () => {
    render(<VoiceSearch onResults={mockOnResults} />);
    const button = screen.getByRole('button');
    
    // Start listening
    fireEvent.click(button);
    // Stop listening
    fireEvent.click(button);
    
    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
  });

  it('handles speech recognition results', async () => {
    const mockResults = [
      { transcript: 'test product', confidence: 0.9 }
    ];
    const mockApiResponse = [
      { id: '1', name: 'Test Product', price: 99.99 }
    ];

    (voiceSearch as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    render(<VoiceSearch onResults={mockOnResults} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    // Simulate speech recognition result
    mockSpeechRecognition.onresult({
      results: [[mockResults[0]]],
      resultIndex: 0
    });

    await waitFor(() => {
      expect(voiceSearch).toHaveBeenCalledWith('test product');
      expect(mockOnResults).toHaveBeenCalledWith(mockApiResponse);
    });
  });

  it('displays error message when speech recognition fails', () => {
    render(<VoiceSearch onResults={mockOnResults} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    // Simulate speech recognition error
    mockSpeechRecognition.onerror({
      error: 'no-speech'
    });

    expect(screen.getByText('Error: No speech detected')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to search products';
    (voiceSearch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<VoiceSearch onResults={mockOnResults} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    
    // Simulate speech recognition result
    mockSpeechRecognition.onresult({
      results: [[{ transcript: 'test product', confidence: 0.9 }]],
      resultIndex: 0
    });

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('stops listening when component unmounts', () => {
    const { unmount } = render(<VoiceSearch onResults={mockOnResults} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    unmount();
    
    expect(mockSpeechRecognition.abort).toHaveBeenCalled();
  });
}); 