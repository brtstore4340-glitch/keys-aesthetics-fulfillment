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
import type { Order, Product, ProductCategory, User } from '../types';

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
      console.error(`Error getting ${this.collectionName}:`, error);
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
      console.error(`Error getting ${this.collectionName} by ID:`, error);
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
      console.error(`Error creating ${this.collectionName}:`, error);
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
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query with filters
  async queryDocuments(constraints: QueryConstraint[]): Promise<T[]> {
    return this.getAll(constraints);
  }
}

// Product Category Service
export const productCategoryService = new FirebaseService<ProductCategory>('productCategories');

export const productService = new FirebaseService<Product>('products');

export const orderService = new FirebaseService<Order>('orders');

// User Service
export const userService = new FirebaseService<User>('users');

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
