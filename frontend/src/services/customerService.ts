import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const customerService = {
  async getCustomerProfile() {
    const response = await axios.get(`${API_URL}/api/customers/profile`);
    return response.data;
  },

  async updateCustomerProfile(profileData: any) {
    const response = await axios.put(`${API_URL}/api/customers/profile`, profileData);
    return response.data;
  },

  async updateCustomerMood(mood: string) {
    const response = await axios.put(`${API_URL}/api/customers/mood`, { mood });
    return response.data;
  },

  async getCustomerPreferences() {
    const response = await axios.get(`${API_URL}/api/customers/preferences`);
    return response.data;
  },

  async updateCustomerPreferences(preferences: any) {
    const response = await axios.put(`${API_URL}/api/customers/preferences`, preferences);
    return response.data;
  },

  async getPersona(customerId: string) {
    const response = await axios.get(`${API_URL}/api/customers/${customerId}/persona`);
    return response.data;
  }
}; 