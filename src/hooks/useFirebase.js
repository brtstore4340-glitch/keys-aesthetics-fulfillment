import { useState, useEffect } from 'react';
import { where } from 'firebase/firestore';
import { productCategoryService, productService, orderService, userService } from '../services/firebase-services';
export const useProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await productCategoryService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const createCategory = async data => {
    const id = await productCategoryService.create(data);
    await fetchCategories();
    return id;
  };
  const updateCategory = async (id, data) => {
    await productCategoryService.update(id, data);
    await fetchCategories();
  };
  const deleteCategory = async id => {
    await productCategoryService.delete(id);
    await fetchCategories();
  };
  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
export const useProducts = categoryId => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = categoryId ? await productService.queryDocuments([where('category_id', '==', categoryId)]) : await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [categoryId]);
  const createProduct = async data => {
    const id = await productService.create(data);
    await fetchProducts();
    return id;
  };
  const updateProduct = async (id, data) => {
    await productService.update(id, data);
    await fetchProducts();
  };
  const deleteProduct = async id => {
    await productService.delete(id);
    await fetchProducts();
  };
  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
export const useOrders = (status, salesRepId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data;
      if (status && salesRepId) {
        data = await orderService.queryDocuments([where('status', '==', status), where('sales_rep_id', '==', salesRepId)]);
      } else if (status) {
        data = await orderService.queryDocuments([where('status', '==', status)]);
      } else if (salesRepId) {
        data = await orderService.queryDocuments([where('sales_rep_id', '==', salesRepId)]);
      } else {
        data = await orderService.getAll();
      }
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [status, salesRepId]);
  const createOrder = async data => {
    const id = await orderService.create(data);
    await fetchOrders();
    return id;
  };
  const updateOrder = async (id, data) => {
    await orderService.update(id, data);
    await fetchOrders();
  };
  const deleteOrder = async id => {
    await orderService.delete(id);
    await fetchOrders();
  };
  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder
  };
};
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
};