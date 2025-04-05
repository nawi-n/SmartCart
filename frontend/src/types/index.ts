export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  preferences: string[];
  purchase_history: string[];
  customer_segment: string;
  avg_order_value: number;
  total_orders: number;
  last_purchase_date: string;
}

export interface Recommendation {
  product_id: string;
  score: number;
  reason: string;
} 