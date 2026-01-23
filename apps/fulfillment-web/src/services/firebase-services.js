import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
// Generic CRUD operations
export class FirebaseService {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  // Get all documents
  async getAll(constraints = []) {
    try {
      const collectionRef = collection(db, this.collectionName);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get document by ID
  async getById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Create new document
  async create(data) {
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
  async update(id, data) {
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
  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query with filters
  async queryDocuments(constraints) {
    return this.getAll(constraints);
  }
}

// Product Category Service
export const productCategoryService = new FirebaseService('productCategories');
export const productService = new FirebaseService('products');
export const orderService = new FirebaseService('orders');

// User Service
export const userService = new FirebaseService('users');

// Helper functions for specific queries

// Get products by category
export const getProductsByCategory = async categoryId => {
  return productService.queryDocuments([where('category_id', '==', categoryId)]);
};

// Get orders by status
export const getOrdersByStatus = async status => {
  return orderService.queryDocuments([where('status', '==', status), orderBy('createdAt', 'desc')]);
};

// Get orders by sales rep
export const getOrdersBySalesRep = async salesRepId => {
  return orderService.queryDocuments([where('sales_rep_id', '==', salesRepId), orderBy('createdAt', 'desc')]);
};