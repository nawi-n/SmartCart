/// <reference types="jest" />
import '@testing-library/jest-dom';
import axios from 'axios';
import { cache } from '../../src/utils/cache';
import {
  getRecommendations,
  getProducts,
  getProduct,
  trackMood,
  sendChatMessage,
  voiceSearch
} from '../../src/api/client';

jest.mock('axios');
jest.mock('../../src/utils/cache');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCache = cache as jest.Mocked<typeof cache>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    it('should fetch recommendations with cache', async () => {
      const mockData = { recommendations: [{ id: '1', name: 'Product 1' }] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      mockedCache.withCache.mockImplementationOnce((key, fn) => fn());

      const result = await getRecommendations('user1', 'happy');

      expect(result).toEqual(mockData);
      expect(mockedCache.withCache).toHaveBeenCalled();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/recommendations'),
        expect.objectContaining({
          params: { customer_id: 'user1', mood: 'happy' }
        })
      );
    });
  });

  describe('getProducts', () => {
    it('should fetch products with cache', async () => {
      const mockData = { products: [{ id: '1', name: 'Product 1' }] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      mockedCache.withCache.mockImplementationOnce((key, fn) => fn());

      const result = await getProducts();

      expect(result).toEqual(mockData);
      expect(mockedCache.withCache).toHaveBeenCalled();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products')
      );
    });
  });

  describe('getProduct', () => {
    it('should fetch single product with cache', async () => {
      const mockData = { id: '1', name: 'Product 1' };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });
      mockedCache.withCache.mockImplementationOnce((key, fn) => fn());

      const result = await getProduct('1');

      expect(result).toEqual(mockData);
      expect(mockedCache.withCache).toHaveBeenCalled();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/products/1')
      );
    });
  });

  describe('trackMood', () => {
    it('should send mood tracking data', async () => {
      const mockData = { success: true };
      mockedAxios.post.mockResolvedValueOnce({ data: mockData });

      const result = await trackMood('user1', 'happy');

      expect(result).toEqual(mockData);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/mood'),
        { customer_id: 'user1', mood: 'happy' }
      );
    });
  });

  describe('sendChatMessage', () => {
    it('should send chat message and receive response', async () => {
      const mockData = { response: 'Hello!' };
      mockedAxios.post.mockResolvedValueOnce({ data: mockData });

      const result = await sendChatMessage('user1', 'Hi');

      expect(result).toEqual(mockData);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat'),
        { customer_id: 'user1', message: 'Hi' }
      );
    });
  });

  describe('voiceSearch', () => {
    it('should send voice search request', async () => {
      const mockData = { products: [{ id: '1', name: 'Product 1' }] };
      const mockAudioBlob = new Blob(['test'], { type: 'audio/wav' });
      mockedAxios.post.mockResolvedValueOnce({ data: mockData });

      const result = await voiceSearch(mockAudioBlob);

      expect(result).toEqual(mockData);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/voice-search'),
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(networkError);
      mockedCache.withCache.mockImplementationOnce((key, fn) => fn());

      await expect(getProducts()).rejects.toThrow('Network Error');
    });

    it('should handle API errors', async () => {
      const apiError = {
        response: {
          status: 400,
          data: { error: 'Bad Request' }
        }
      };
      mockedAxios.get.mockRejectedValueOnce(apiError);
      mockedCache.withCache.mockImplementationOnce((key, fn) => fn());

      await expect(getProducts()).rejects.toEqual(apiError);
    });
  });
}); 