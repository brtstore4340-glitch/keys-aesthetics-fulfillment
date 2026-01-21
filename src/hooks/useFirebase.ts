import { useState, useEffect } from 'react';
import { where } from 'firebase/firestore';
import { 
  productCategoryService, 
  productService, 
  orderService,
  userService
} from '../services/firebase.service';
import { ProductCategory, Product, Order, User } from '../types';

export const useProductCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await productCategoryService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (data: Omit<ProductCategory, 'id'>) => {
    const id = await productCategoryService.create(data);
    await fetchCategories();
    return id;
  };

  const updateCategory = async (id: string, data: Partial<ProductCategory>) => {
    await productCategoryService.update(id, data);
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    await productCategoryService.delete(id);
    await fetchCategories();
  };

  return { categories, loading, error, refetch: fetchCategories, createCategory, updateCategory, deleteCategory };
};

export const useProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = categoryId 
        ? await productService.query([where('category_id', '==', categoryId)])
        : await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const createProduct = async (data: Omit<Product, 'id'>) => {
    const id = await productService.create(data);
    await fetchProducts();
    return id;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    await productService.update(id, data);
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await productService.delete(id);
    await fetchProducts();
  };

  return { products, loading, error, refetch: fetchProducts, createProduct, updateProduct, deleteProduct };
};

export const useOrders = (status?: string, salesRepId?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data: Order[];
      
      if (status && salesRepId) {
        data = await orderService.query([
          where('status', '==', status),
          where('sales_rep_id', '==', salesRepId)
        ]);
      } else if (status) {
        data = await orderService.query([where('status', '==', status)]);
      } else if (salesRepId) {
        data = await orderService.query([where('sales_rep_id', '==', salesRepId)]);
      } else {
        data = await orderService.getAll();
      }
      
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, salesRepId]);

  const createOrder = async (data: Omit<Order, 'id'>) => {
    const id = await orderService.create(data);
    await fetchOrders();
    return id;
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    await orderService.update(id, data);
    await fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    await orderService.delete(id);
    await fetchOrders();
  };

  return { orders, loading, error, refetch: fetchOrders, createOrder, updateOrder, deleteOrder };
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};
