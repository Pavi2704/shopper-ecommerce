import React from 'react';
import './dashboard.css';
import { useAdmin } from '../../context/AdminContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { stats, fetchStats, products, orders, loading } = useAdmin();

  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || orders.length || 0;
  const totalProducts = stats?.totalProducts || products.length || 0;
  const totalUsers = stats?.totalUsers || 0;

  const categoryCounts = stats?.categoryCounts || { women: 0, men: 0, kids: 0 };
  const totalCatSum = (categoryCounts.women + categoryCounts.men + categoryCounts.kids) || 1;
  const womenPercent = Math.round((categoryCounts.women / totalCatSum) * 100);
  const menPercent = Math.round((categoryCounts.men / totalCatSum) * 100);
  const kidsPercent = Math.round((categoryCounts.kids / totalCatSum) * 100);

  const statusCounts = stats?.orderStatusCounts || {
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  const recentOrders = stats?.recentOrders || orders.slice(0, 5);

  return (
    <div className="dashboard-container fade-in">
      {/* Top Banner */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Store Overview</h1>
          <p className="dashboard-subtitle">Real-time performance, inventory metrics, and recent orders.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline btn-sm" onClick={fetchStats} disabled={loading}>
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span> Refresh Data
          </button>
          <Link to="/addproduct" className="btn btn-primary btn-sm">
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        {/* Revenue */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Revenue</span>
            <div className="stat-icon-wrapper revenue-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">₹{totalRevenue.toLocaleString()}</div>
          <div className="stat-card-footer">
            <span className="stat-growth positive">↑ Active Sales</span>
            <span className="stat-context">from all orders</span>
          </div>
        </div>

        {/* Orders */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Orders</span>
            <div className="stat-icon-wrapper orders-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{totalOrders}</div>
          <div className="stat-card-footer">
            <span className="stat-growth neutral">{statusCounts.processing} in progress</span>
            <span className="stat-context">tracked in system</span>
          </div>
        </div>

        {/* Products */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Products</span>
            <div className="stat-icon-wrapper products-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{totalProducts}</div>
          <div className="stat-card-footer">
            <span className="stat-growth positive">3 Categories</span>
            <span className="stat-context">live in catalog</span>
          </div>
        </div>

        {/* Customers */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Customers</span>
            <div className="stat-icon-wrapper users-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{totalUsers}</div>
          <div className="stat-card-footer">
            <span className="stat-growth positive">Verified</span>
            <span className="stat-context">registered accounts</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown + Order Status Breakdown */}
      <div className="dashboard-grid-2">
        {/* Category Breakdown Card */}
        <div className="admin-card breakdown-card">
          <div className="card-top">
            <h3>Inventory by Category</h3>
            <span className="badge badge-purple">{totalProducts} Items</span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-segment segment-women" style={{ width: `${womenPercent}%` }} title={`Women: ${womenPercent}%`}></div>
            <div className="progress-segment segment-men" style={{ width: `${menPercent}%` }} title={`Men: ${menPercent}%`}></div>
            <div className="progress-segment segment-kids" style={{ width: `${kidsPercent}%` }} title={`Kids: ${kidsPercent}%`}></div>
          </div>

          <div className="category-legend">
            <div className="legend-item">
              <span className="legend-dot dot-women"></span>
              <span className="legend-name">Women</span>
              <span className="legend-count">{categoryCounts.women} items</span>
              <span className="legend-percent">{womenPercent}%</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-men"></span>
              <span className="legend-name">Men</span>
              <span className="legend-count">{categoryCounts.men} items</span>
              <span className="legend-percent">{menPercent}%</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-kids"></span>
              <span className="legend-name">Kids</span>
              <span className="legend-count">{categoryCounts.kids} items</span>
              <span className="legend-percent">{kidsPercent}%</span>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown Card */}
        <div className="admin-card status-breakdown-card">
          <div className="card-top">
            <h3>Order Status Summary</h3>
            <Link to="/orders" className="card-link">View All →</Link>
          </div>

          <div className="status-chips-grid">
            <div className="status-chip chip-placed">
              <span className="chip-count">{statusCounts.placed}</span>
              <span className="chip-label">Placed</span>
            </div>
            <div className="status-chip chip-processing">
              <span className="chip-count">{statusCounts.processing}</span>
              <span className="chip-label">Processing</span>
            </div>
            <div className="status-chip chip-shipped">
              <span className="chip-count">{statusCounts.shipped}</span>
              <span className="chip-label">Shipped</span>
            </div>
            <div className="status-chip chip-delivered">
              <span className="chip-count">{statusCounts.delivered}</span>
              <span className="chip-label">Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="admin-card recent-orders-card">
        <div className="card-top">
          <div>
            <h3>Recent Orders</h3>
            <p className="card-desc">Latest purchases made across the store</p>
          </div>
          <Link to="/orders" className="btn btn-outline btn-sm">
            Manage Orders
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <p>No orders recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord._id || ord.orderId}>
                    <td className="font-semibold text-primary">{ord.orderId}</td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{ord.customerName}</span>
                        <span className="customer-email">{ord.customerEmail}</span>
                      </div>
                    </td>
                    <td>{ord.items?.length || 1} product(s)</td>
                    <td className="font-bold">₹{ord.amount}</td>
                    <td>
                      <span className={`badge ${
                        ord.status === 'Delivered' ? 'badge-success' :
                        ord.status === 'Processing' ? 'badge-warning' :
                        ord.status === 'Shipped' ? 'badge-info' :
                        ord.status === 'Cancelled' ? 'badge-danger' : 'badge-purple'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="text-muted">
                      {new Date(ord.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
