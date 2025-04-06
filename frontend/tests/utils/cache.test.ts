import '@testing-library/jest-dom';
import { cache } from '../../src/utils/cache';
import type { Cache } from '../../src/utils/cache';

describe('Cache', () => {
  let testCache: typeof cache;

  beforeEach(() => {
    testCache = Object.create(cache);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set and get cache entries', () => {
    const key = 'test-key';
    const data = { foo: 'bar' };
    
    testCache.set(key, data);
    expect(testCache.get(key)).toEqual(data);
  });

  it('should return null for non-existent entries', () => {
    expect(testCache.get('non-existent')).toBeNull();
  });

  it('should respect TTL for cache entries', () => {
    const key = 'test-key';
    const data = { foo: 'bar' };
    const ttl = 1000; // 1 second
    
    testCache.set(key, data, ttl);
    expect(testCache.get(key)).toEqual(data);
    
    // Advance time by TTL + 1ms
    jest.advanceTimersByTime(ttl + 1);
    expect(testCache.get(key)).toBeNull();
  });

  it('should delete cache entries', () => {
    const key = 'test-key';
    const data = { foo: 'bar' };
    
    testCache.set(key, data);
    expect(testCache.get(key)).toEqual(data);
    
    testCache.delete(key);
    expect(testCache.get(key)).toBeNull();
  });

  it('should clear all cache entries', () => {
    testCache.set('key1', 'value1');
    testCache.set('key2', 'value2');
    
    testCache.clear();
    
    expect(testCache.get('key1')).toBeNull();
    expect(testCache.get('key2')).toBeNull();
  });

  describe('withCache', () => {
    it('should cache API responses', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });
      const key = 'api-key';
      
      const result1 = await testCache.withCache(key, mockFetch);
      const result2 = await testCache.withCache(key, mockFetch);
      
      expect(result1).toEqual({ data: 'test' });
      expect(result2).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should refetch when cache expires', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });
      const key = 'api-key';
      const ttl = 1000;
      
      const result1 = await testCache.withCache(key, mockFetch, ttl);
      jest.advanceTimersByTime(ttl + 1);
      const result2 = await testCache.withCache(key, mockFetch, ttl);
      
      expect(result1).toEqual({ data: 'test' });
      expect(result2).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('API Error');
      const mockFetch = jest.fn().mockRejectedValue(error);
      const key = 'api-key';
      
      await expect(testCache.withCache(key, mockFetch)).rejects.toThrow(error);
      expect(testCache.get(key)).toBeNull();
    });
  });
}); 