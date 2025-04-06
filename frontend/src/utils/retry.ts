import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  shouldRetry: (error: any) => boolean;
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error) => {
    // Retry on network errors or 5xx server errors
    return !error.response || error.response.status >= 500;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const { maxRetries, retryDelay, shouldRetry } = { ...defaultConfig, ...config };
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export const createRetryInterceptor = (config: Partial<RetryConfig> = {}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  return async (error: any) => {
    if (!mergedConfig.shouldRetry(error)) {
      return Promise.reject(error);
    }

    try {
      return await retryRequest(() => axios(error.config), mergedConfig);
    } catch (retryError) {
      return Promise.reject(retryError);
    }
  };
}; 