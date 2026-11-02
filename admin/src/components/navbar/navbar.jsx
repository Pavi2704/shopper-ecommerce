import React from 'react';
import './navbar.css';
import logo from '../../assets/logo.png';
import navProfile from '../../assets/nav-profile.svg';
import { useAdmin } from '../../context/AdminContext';

const Navbar = () => {
  const { serverStatus, checkServerStatus, stats } = useAdmin();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="nav-brand">
          <div className="logo-wrapper">
            <img src={logo} alt="Shopper Logo" className="nav-logo" />
          </div>
          <div className="brand-text">
            <h2>SHOPPER</h2>
            <span className="admin-tag">ADMIN PORTAL</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {/* Backend Server Status Badge */}
        <div 
          className={`server-status-pill status-${serverStatus}`}
          title="Click to re-check backend connection"
          onClick={checkServerStatus}
        >
          <span className="status-dot"></span>
          <span className="status-label">
            {serverStatus === 'online' ? 'Backend Online (Port 4000)' : serverStatus === 'checking' ? 'Connecting...' : 'Backend Offline'}
          </span>
          <span className="status-refresh" title="Ping Server">↻</span>
        </div>

        {/* Quick metrics summary */}
        {stats && (
          <div className="nav-quick-stats">
            <div className="stat-pill">
              <span className="stat-num">{stats.totalProducts || 0}</span>
              <span className="stat-name">Products</span>
            </div>
            <div className="stat-pill">
              <span className="stat-num">{stats.totalOrders || 0}</span>
              <span className="stat-name">Orders</span>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="nav-profile-card">
          <img src={navProfile} alt="Admin Profile" className="nav-profile-img" />
          <div className="profile-details">
            <span className="profile-name">Pavithira</span>
            <span className="profile-role">Store Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
