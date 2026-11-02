import React from 'react';
import './sidebar.css';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import addProductIcon from '../../assets/Product_Cart.svg';
import listProductIcon from '../../assets/Product_list_icon.svg';

const Sidebar = () => {
  const { products, orders, users } = useAdmin();

  return (
    <aside className="sidebar">
      <div className="sidebar-section-title">MAIN NAVIGATION</div>

      <nav className="sidebar-menu">
        {/* Dashboard */}
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
          </div>
          <span className="sidebar-text">Dashboard</span>
        </NavLink>

        {/* Add Product */}
        <NavLink 
          to="/addproduct" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-icon-box">
            <img src={addProductIcon} alt="Add Product" className="sidebar-svg-icon" />
          </div>
          <span className="sidebar-text">Add Product</span>
          <span className="sidebar-badge-add">+New</span>
        </NavLink>

        {/* Product List */}
        <NavLink 
          to="/listproduct" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-icon-box">
            <img src={listProductIcon} alt="Product List" className="sidebar-svg-icon" />
          </div>
          <span className="sidebar-text">Product List</span>
          {products.length > 0 && (
            <span className="sidebar-count-badge">{products.length}</span>
          )}
        </NavLink>

        {/* Orders */}
        <NavLink 
          to="/orders" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <span className="sidebar-text">Orders</span>
          {orders.length > 0 && (
            <span className="sidebar-count-badge badge-pulse">{orders.length}</span>
          )}
        </NavLink>

        {/* Customers */}
        <NavLink 
          to="/customers" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <div className="sidebar-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="sidebar-text">Customers</span>
          {users.length > 0 && (
            <span className="sidebar-count-badge">{users.length}</span>
          )}
        </NavLink>
      </nav>

      {/* System Status Mini Widget */}
      <div className="sidebar-footer">
        <div className="system-card">
          <div className="system-card-top">
            <span className="system-dot"></span>
            <span className="system-title">API Engine</span>
          </div>
          <p className="system-desc">MERN Full Stack v2.0</p>
          <span className="system-port">PORT: 4000</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
