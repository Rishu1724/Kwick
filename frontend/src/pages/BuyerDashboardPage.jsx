import React from 'react';
import { useAuth } from '../context/AuthContext';
import Profile from '../components/Profile';
import Favorites from '../components/Favorites';
import ConversationsPage from './ConversationsPage';

const BuyerDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="buyer-dashboard">
      <h1>Buyer Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      
      <div className="dashboard-sections">
        <div className="section">
          <h2>My Profile</h2>
          <Profile />
        </div>
        
        <div className="section">
          <h2>My Favorites</h2>
          <Favorites />
        </div>
        
        <div className="section">
          <h2>Recent Searches</h2>
          <p>Your recent searches will appear here.</p>
        </div>
        
        <div className="section">
          <h2>Messages</h2>
          <ConversationsPage />
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardPage;