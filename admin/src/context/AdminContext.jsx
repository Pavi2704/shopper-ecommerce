import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

export const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const backendUrl = 'http://localhost:4000';
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  const checkServerStatus = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/`, { method: 'GET' });
      if (res.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch {
      setServerStatus('offline');
    }
  }, [backendUrl]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/admin/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  }, [backendUrl]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/allproducts`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Could not connect to backend server', 'error');
    } finally {
      setLoading(false);
    }
  }, [backendUrl, showToast]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/allorders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/allusers`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  // Initial check
  useEffect(() => {
    checkServerStatus();
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchUsers();

    // Check heartbeat every 30s
    const timer = setInterval(() => {
      checkServerStatus();
    }, 30000);
    return () => clearInterval(timer);
  }, [checkServerStatus, fetchStats, fetchProducts, fetchOrders, fetchUsers]);

  const value = {
    backendUrl,
    toast,
    showToast,
    serverStatus,
    checkServerStatus,
    stats,
    fetchStats,
    products,
    fetchProducts,
    orders,
    fetchOrders,
    users,
    fetchUsers,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
      {/* Global Toast Container */}
      {toast.visible && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ'}
            {toast.type === 'warning' && '⚠'}
          </div>
          <span className="toast-text">{toast.message}</span>
        </div>
      )}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
