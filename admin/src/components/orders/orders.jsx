import React, { useState, useMemo } from 'react';
import './orders.css';
import { useAdmin } from '../../context/AdminContext';

const Orders = () => {
  const { backendUrl, orders, fetchOrders, showToast, fetchStats, loading } = useAdmin();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Status values
  const statuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderId?.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.customerEmail?.toLowerCase().includes(q) ||
        order.address?.city?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Update Status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${backendUrl}/updateorderstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} updated to "${newStatus}"`, 'success');
        fetchOrders();
        fetchStats();
      } else {
        showToast(data.message || 'Failed to update order', 'error');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      showToast('Could not reach backend', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Remove Order
  const handleRemoveOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
      const res = await fetch(`${backendUrl}/removeorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} deleted`, 'info');
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      showToast('Could not delete order', 'error');
    }
  };

  return (
    <div className="orders-container fade-in">
      {/* Header */}
      <div className="orders-header">
        <div>
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">Track customer orders, manage shipping states, and handle fulfillment.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline btn-sm" onClick={fetchOrders} disabled={loading}>
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="orders-control-card admin-card">
        {/* Status Tabs */}
        <div className="order-status-tabs">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'Order Placed', label: 'Order Placed' },
            { key: 'Processing', label: 'Processing' },
            { key: 'Shipped', label: 'Shipped' },
            { key: 'Delivered', label: 'Delivered' },
            { key: 'Cancelled', label: 'Cancelled' }
          ].map((tab) => {
            const count =
              tab.key === 'all'
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;

            return (
              <button
                key={tab.key}
                type="button"
                className={`order-tab-btn ${statusFilter === tab.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab.key)}
              >
                <span>{tab.label}</span>
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="orders-search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="orders-search-input"
            placeholder="Search by Order ID, customer name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="admin-card empty-orders-card">
          <div className="empty-icon">🛍️</div>
          <h3>No orders match your filter</h3>
          <p>Orders placed on the storefront will appear here with live updates.</p>
        </div>
      ) : (
        <div className="orders-cards-grid">
          {filteredOrders.map((order) => (
            <div key={order._id || order.orderId} className="admin-card order-card">
              {/* Order Card Header */}
              <div className="order-card-header">
                <div className="order-id-group">
                  <span className="order-id-badge">{order.orderId}</span>
                  <span className="order-date-text">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="order-status-controller">
                  <label className="status-label-small">Status:</label>
                  <select
                    className={`order-status-select status-${(order.status || '').toLowerCase().replace(' ', '-')}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    disabled={updatingOrderId === order.orderId}
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="order-card-body">
                {/* Customer Information */}
                <div className="order-section customer-section">
                  <div className="section-title">Customer Details</div>
                  <div className="customer-info-box">
                    <div className="customer-avatar-initial">
                      {(order.customerName || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-text-meta">
                      <strong className="customer-name">{order.customerName}</strong>
                      <span className="customer-sub">{order.customerEmail}</span>
                      {order.customerPhone && (
                        <span className="customer-sub">{order.customerPhone}</span>
                      )}
                    </div>
                  </div>

                  {order.address && (
                    <div className="shipping-address-box">
                      <span className="address-label">📍 Delivery Address:</span>
                      <p className="address-content">
                        {order.address.street && `${order.address.street}, `}
                        {order.address.city && `${order.address.city}, `}
                        {order.address.state && `${order.address.state} `}
                        {order.address.zipCode && `${order.address.zipCode}, `}
                        {order.address.country || 'USA'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Ordered Items Preview */}
                <div className="order-section items-section">
                  <div className="section-title">
                    Order Items ({order.items?.length || 0})
                  </div>
                  <div className="items-list">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <div className="item-thumb-box">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="item-thumb-img" />
                          ) : (
                            <div className="item-thumb-placeholder">🛍️</div>
                          )}
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-category">{item.category}</span>
                        </div>
                        <div className="item-price-qty">
                          <span className="item-qty">x{item.quantity || 1}</span>
                          <span className="item-price">₹{Number(item.new_price || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary & Payment */}
                <div className="order-section payment-section">
                  <div className="section-title">Payment & Total</div>
                  <div className="payment-meta-box">
                    <div className="meta-row">
                      <span>Method:</span>
                      <strong>{order.paymentMethod || 'Cash on Delivery'}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Payment Status:</span>
                      <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                        {order.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                    <div className="meta-row total-row">
                      <span>Total Amount:</span>
                      <span className="order-grand-total">₹{Number(order.amount).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm delete-order-btn"
                    onClick={() => handleRemoveOrder(order.orderId)}
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
