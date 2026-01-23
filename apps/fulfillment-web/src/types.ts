export interface ProductCategory {
  id?: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  sku?: string;
  in_stock: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  items: OrderItem[];
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  citizen_id_url?: string;
  payment_slip_url?: string;
  notes?: string;
  sales_rep_id?: string;
  sales_rep_name?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface User {
  id?: string;
  name: string;
  username?: string;
  pin?: string;
  role: 'admin' | 'staff' | 'accounting';
  email?: string;
  avatar_url?: string;
  createdAt?: any;
  updatedAt?: any;
}
