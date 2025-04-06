/// <reference types="jest" />
import '@testing-library/jest-dom';
import { retryRequest, createRetryInterceptor } from '../../src/utils/retry';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Retry Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('retryRequest', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue({ data: 'success' });
      
      const result = await retryRequest(mockFn);
      
      expect(result).toEqual({ data: 'success' });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on network error', async () => {
      const networkError = new Error('Network Error');
      const mockFn = jest.fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ data: 'success' });
      
      const result = await retryRequest(mockFn, { maxRetries: 3 });
      
      expect(result).toEqual({ data: 'success' });
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should retry on 500 error', async () => {
      const serverError = { response: { status: 500 } };
      const mockFn = jest.fn()
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce({ data: 'success' });
      
      const result = await retryRequest(mockFn, { maxRetries: 3 });
      
      expect(result).toEqual({ data: 'success' });
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries', async () => {
      const networkError = new Error('Network Error');
      const mockFn = jest.fn().mockRejectedValue(networkError);
      
      await expect(retryRequest(mockFn, { maxRetries: 3 }))
        .rejects.toThrow('Network Error');
      expect(mockFn).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });

    it('should respect retry delay', async () => {
      const networkError = new Error('Network Error');
      const mockFn = jest.fn()
        .mockRejectedValueOnce(networkError)
        .mockResolvedValueOnce({ data: 'success' });
      
      const retryPromise = retryRequest(mockFn, { maxRetries: 3, retryDelay: 1000 });
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      const result = await retryPromise;
      expect(result).toEqual({ data: 'success' });
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('createRetryInterceptor', () => {
    it('should create axios interceptor', () => {
      const interceptor = createRetryInterceptor();
      
      expect(interceptor).toHaveProperty('onError');
      expect(typeof interceptor.onError).toBe('function');
    });

    it('should retry failed requests', async () => {
      const interceptor = createRetryInterceptor({ maxRetries: 3 });
      const error = { config: {}, response: { status: 500 } };
      
      mockedAxios.request.mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ data: 'success' });
      
      const result = await interceptor.onError(error);
      
      expect(result).toEqual({ data: 'success' });
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
    });

    it('should not retry on client errors', async () => {
      const interceptor = createRetryInterceptor();
      const error = { config: {}, response: { status: 400 } };
      
      await expect(interceptor.onError(error)).rejects.toEqual(error);
      expect(mockedAxios.request).not.toHaveBeenCalled();
    });
  });
}); 