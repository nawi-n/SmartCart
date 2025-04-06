import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  private saveUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  addListener(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const user: User = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        token: response.data.token
      };
      
      this.saveUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  logout(): void {
    this.saveUser(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getAuthHeader(): { Authorization: string } | {} {
    return this.currentUser
      ? { Authorization: `Bearer ${this.currentUser.token}` }
      : {};
  }
}

export const authService = new AuthService(); 