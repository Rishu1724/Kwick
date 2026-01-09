import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Profile from '../components/Profile';
import PostAdForm from '../components/PostAdForm';
import MyAds from '../components/MyAds';
import ConversationsPage from './ConversationsPage';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <div className="seller-dashboard">
      <h1>Seller Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      
      <div className="dashboard-sections">
        <div className="section">
          <h2>My Profile</h2>
          <Profile />
        </div>
        
        <div className="section">
          <h2>Post New Ad</h2>
          {showPostForm ? (
            <PostAdForm />
          ) : (
            <button className="btn-primary" onClick={() => setShowPostForm(true)}>
              Create New Ad
            </button>
          )}
        </div>
        
        <div className="section">
          <h2>My Ads</h2>
          <MyAds />
        </div>
        
        <div className="section">
          <h2>Analytics</h2>
          <p>View statistics about your ads here.</p>
        </div>
        
        <div className="section">
          <h2>Messages</h2>
          <ConversationsPage />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;