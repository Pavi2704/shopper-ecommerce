import React, { useState, useMemo } from 'react';
import './customers.css';
import { useAdmin } from '../../context/AdminContext';

const Customers = () => {
  const { backendUrl, users, fetchUsers, showToast, loading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery]);

  const handleRemoveUser = async (id, name) => {
    try {
      const res = await fetch(`${backendUrl}/removeuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Customer "${name}" removed`, 'info');
        fetchUsers();
      } else {
        showToast(data.message || 'Failed to remove user', 'error');
      }
    } catch (err) {
      showToast('Could not reach backend', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="customers-container fade-in">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1 className="page-title">Customers Directory</h1>
          <p className="page-subtitle">View and manage all registered customer accounts and order history.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline btn-sm" onClick={fetchUsers} disabled={loading}>
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span> Refresh
          </button>
        </div>
      </div>

      {/* Customer Quick Stats */}
      <div className="customer-stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Registered</span>
          </div>
          <div className="stat-card-value">{users.length}</div>
          <div className="stat-card-footer">
            <span className="stat-growth positive">Active</span>
            <span className="stat-context">customer accounts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Verified Buyers</span>
          </div>
          <div className="stat-card-value">
            {users.filter((u) => (u.orderCount || 0) > 0).length}
          </div>
          <div className="stat-card-footer">
            <span className="stat-growth positive">With Orders</span>
            <span className="stat-context">placed purchases</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card customers-search-card">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search customers by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </div>

      {/* Customers Table Card */}
      <div className="admin-card table-card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No customers found</h3>
            <p>Customers will appear here when they register on the storefront.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Orders Placed</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="customer-name-wrapper">
                        <div className="avatar-circle">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="name-bold">{u.name}</span>
                      </div>
                    </td>
                    <td className="email-text">{u.email}</td>
                    <td>
                      <span className="badge badge-purple">
                        {u.role || 'customer'}
                      </span>
                    </td>
                    <td>
                      <span className="order-count-pill">
                        {u.orderCount || 0} order(s)
                      </span>
                    </td>
                    <td className="text-muted">
                      {new Date(u.date).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {deletingId === u._id ? (
                        <div className="confirm-delete-box" style={{ justifyContent: 'flex-end' }}>
                          <span className="confirm-text">Remove?</span>
                          <button
                            className="btn btn-danger btn-sm confirm-btn"
                            onClick={() => handleRemoveUser(u._id, u.name)}
                          >
                            Yes
                          </button>
                          <button
                            className="btn btn-secondary btn-sm cancel-btn"
                            onClick={() => setDeletingId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setDeletingId(u._id)}
                        >
                          Remove
                        </button>
                      )}
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

export default Customers;
