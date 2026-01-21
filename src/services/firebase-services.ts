import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Generic CRUD operations
export class FirebaseService<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Get all documents
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(\Error getting \:\, error);
      throw error;
    }
  }

  // Get document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }
      return null;
    } catch (error) {
      console.error(\Error getting \ by ID:\, error);
      throw error;
    }
  }

  // Create new document
  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const collectionRef = collection(db, this.collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error(\Error creating \:\, error);
      throw error;
    }
  }

  // Update document
  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(\Error updating \:\, error);
      throw error;
    }
  }

  // Delete document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(\Error deleting \:\, error);
      throw error;
    }
  }

  // Query with filters
  async queryDocuments(constraints: QueryConstraint[]): Promise<T[]> {
    return this.getAll(constraints);
  }
}

// Product Category Service
export interface ProductCategory {
  id?: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  createdAt?: any;
  updatedAt?: any;
}

export const productCategoryService = new FirebaseService<ProductCategory>('productCategories');

// Product Service
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

export const productService = new FirebaseService<Product>('products');

// Order Service
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

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export const orderService = new FirebaseService<Order>('orders');

// Helper functions for specific queries

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return productService.queryDocuments([
    where('category_id', '==', categoryId)
  ]);
};

// Get orders by status
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  return orderService.queryDocuments([
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  ]);
};

// Get orders by sales rep
export const getOrdersBySalesRep = async (salesRepId: string): Promise<Order[]> => {
  return orderService.queryDocuments([
    where('sales_rep_id', '==', salesRepId),
    orderBy('createdAt', 'desc')
  ]);
};
