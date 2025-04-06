import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatAssistant from '../ChatAssistant';
import { sendChatMessage } from '../../api/client';

// Mock the API client
jest.mock('../../api/client', () => ({
  sendChatMessage: jest.fn()
}));

describe('ChatAssistant', () => {
  const mockCustomerId = 'test-customer-123';
  const mockMessage = 'Hello, I need help finding a product';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the chat interface correctly', () => {
    render(<ChatAssistant customerId={mockCustomerId} />);
    
    expect(screen.getByText('Chat Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('sends a message when the send button is clicked', async () => {
    (sendChatMessage as jest.Mock).mockResolvedValueOnce({
      response: 'How can I help you today?',
      context: { type: 'greeting' }
    });

    render(<ChatAssistant customerId={mockCustomerId} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: mockMessage } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalledWith(mockCustomerId, mockMessage);
      expect(screen.getByText(mockMessage)).toBeInTheDocument();
      expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
    });
  });

  it('sends a message when Enter key is pressed', async () => {
    (sendChatMessage as jest.Mock).mockResolvedValueOnce({
      response: 'How can I help you today?',
      context: { type: 'greeting' }
    });

    render(<ChatAssistant customerId={mockCustomerId} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: mockMessage } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(sendChatMessage).toHaveBeenCalledWith(mockCustomerId, mockMessage);
    });
  });

  it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to send message';
    (sendChatMessage as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    render(<ChatAssistant customerId={mockCustomerId} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: mockMessage } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to send message')).toBeInTheDocument();
    });
  });

  it('clears input after sending a message', async () => {
    (sendChatMessage as jest.Mock).mockResolvedValueOnce({
      response: 'How can I help you today?',
      context: { type: 'greeting' }
    });

    render(<ChatAssistant customerId={mockCustomerId} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: mockMessage } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('does not send empty messages', () => {
    render(<ChatAssistant customerId={mockCustomerId} />);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendButton);

    expect(sendChatMessage).not.toHaveBeenCalled();
  });
}); 