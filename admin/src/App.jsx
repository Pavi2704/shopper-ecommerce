import React from 'react';
import Navbar from './components/navbar/navbar';
import Admin from './pages/admin/admin';
import { AdminProvider } from './context/AdminContext';

const App = () => {
  return (
    <AdminProvider>
      <div className="app-container">
        <Navbar />
        <Admin />
      </div>
    </AdminProvider>
  );
};

export default App;
