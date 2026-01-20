import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Profile from "../components/Profile";
import AddEquipmentForm from "../components/AddEquipmentForm";
import MyEquipment from "../components/MyEquipment";
import BookingRequests from "../components/BookingRequests";
import OwnerAnalytics from "../components/OwnerAnalytics";
import ConversationsPage from "./ConversationsPage";

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);

  // Protect route
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <p>Welcome, <strong>{user.name}</strong> 👋</p>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add New Equipment
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          My Equipment
        </button>
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Booking Requests
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="tab-section">
            <h2>Dashboard Overview</h2>
            <OwnerAnalytics overview={true} />
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="tab-section">
            <h2>My Equipment</h2>
            {showAddForm ? (
              <AddEquipmentForm onClose={() => setShowAddForm(false)} />
            ) : null}
            <MyEquipment />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="tab-section">
            <h2>Booking Requests</h2>
            <BookingRequests />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-section">
            <h2>Earnings Analytics</h2>
            <OwnerAnalytics />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="tab-section messages-section">
            <h2>Messages</h2>
            <ConversationsPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;