import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle authentication if needed
client.interceptors.request.use(
  (config) => {
    // You can add authentication token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          break;
        case 403:
          // Handle forbidden access
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
          break;
      }
    }
    return Promise.reject(error);
  }
);

export const getRecommendations = async (customerId: string) => {
  const response = await client.get(`/recommendations/${customerId}`);
  return response.data;
};

export const getProducts = async () => {
  const response = await client.get('/products');
  return response.data;
};

export const getProduct = async (productId: string) => {
  const response = await client.get(`/products/${productId}`);
  return response.data;
};

export const getCustomer = async (customerId: string) => {
  const response = await client.get(`/customers/${customerId}`);
  return response.data;
};

export default client; 