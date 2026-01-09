import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import AdminReportsPage from './AdminReportsPage';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user is admin (in a real app, you would have a specific admin role)
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'dashboard' ? <AdminPanel /> : <AdminReportsPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;