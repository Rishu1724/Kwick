import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Profile from "../components/Profile";
import Wishlist from "../components/Wishlist";
import MyBookings from "../components/MyBookings";
import ConversationsPage from "./ConversationsPage";

const RenterDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  // Protect route
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="renter-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Renter Dashboard</h1>
        <p>Welcome, <strong>{user.name}</strong> 👋</p>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
        </button>
        <button 
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
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
        {activeTab === 'bookings' && (
          <div className="tab-section">
            <h2>My Bookings</h2>
            <MyBookings />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="tab-section">
            <h2>My Wishlist</h2>
            <Wishlist />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-section">
            <h2>My Profile</h2>
            <Profile />
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

export default RenterDashboardPage;