import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Profile from "../components/Profile";
import Wishlist from "../components/Wishlist";
import MyBookings from "../components/MyBookings";
import ConversationsPage from "./ConversationsPage";
import EquipmentList from "./EquipmentList";
import './RenterDashboardPage.css';

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
        <h1>Equipment Renter Dashboard</h1>
        <p>Welcome, <strong>{user.name}</strong> 👋 | Renter Mode Active</p>
        <p className="dashboard-subtitle">Manage your rentals, bookings, and wishlists</p>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 My Rentals
        </button>
        <button 
          className={`tab-button ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          🏸 Browse Equipment
        </button>
        <button 
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          ❤️ Wish List
        </button>
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 My Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'bookings' && (
          <div className="tab-section">
            <h2>📅 My Rental Bookings</h2>
            <MyBookings />
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="tab-section">
            <h2>🏸 Browse Sports Equipment</h2>
            <EquipmentList />
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="tab-section">
            <h2>❤️ My Wish List</h2>
            <Wishlist />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="tab-section">
            <h2>👤 My Profile</h2>
            <Profile />
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="tab-section messages-section">
            <h2>💬 My Messages</h2>
            <ConversationsPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default RenterDashboardPage;