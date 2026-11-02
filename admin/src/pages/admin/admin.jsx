import React from 'react';
import './admin.css';
import Sidebar from '../../components/sidebar/sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../components/dashboard/dashboard';
import AddProduct from '../../components/addproduct/addproduct';
import ListProduct from '../../components/listproduct/listproduct';
import Orders from '../../components/orders/orders';
import Customers from '../../components/customers/customers';

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <main className="admin-content-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/listproduct" element={<ListProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
