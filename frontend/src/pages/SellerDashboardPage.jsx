import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Profile from "../components/Profile";
import PostAdForm from "../components/PostAdForm";
import MyAds from "../components/MyAds";
import ConversationsPage from "./ConversationsPage";
import DashboardStats from "../components/DashboardStats";
import DashboardAnalytics from "../components/DashboardAnalytics";

// import "../styles/sellerDashboard.css";

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);

  // Protect route
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Welcome, <strong>{user.name}</strong> 👋</p>
      </div>

      {/* Quick Stats */}
      <DashboardStats />

      {/* Sections */}
      <div className="dashboard-sections">
        
        {/* Profile */}
        <div className="section">
          <h2>My Profile</h2>
          <Profile />
        </div>

        {/* Post Ad */}
        <div className="section">
          <h2>Post New Ad</h2>

          {showPostForm ? (
            <PostAdForm onClose={() => setShowPostForm(false)} />
          ) : (
            <button
              className="btn-primary"
              onClick={() => setShowPostForm(true)}
            >
              ➕ Create New Ad
            </button>
          )}
        </div>

        {/* My Ads */}
        <div className="section">
          <h2>My Ads</h2>
          <MyAds />
        </div>

        {/* Analytics */}
        <div className="section">
          <h2>Analytics</h2>
          <DashboardAnalytics />
        </div>

        {/* Messages */}
        <div className="section messages">
          <h2>Messages</h2>
          <ConversationsPage />
        </div>

      </div>
    </div>
  );
};

export default SellerDashboardPage;
