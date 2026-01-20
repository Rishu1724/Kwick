import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    messages: 0,
    adViews: 0,
    clicks: 0,
    leads: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user's products
        const productsResponse = await api.get(`/api/products?sellerId=${user._id}`);
        const products = productsResponse.data.products || [];
        
        // Count total and active ads
        const totalAds = products.length;
        const activeAds = products.filter(product => product.status === 'active').length;
        
        // Fetch conversations for message count
        const conversationsResponse = await api.get('/api/chats/conversations');
        const conversations = conversationsResponse.data || [];
        const messages = conversations.length;
        
        // Calculate analytics (using product views - this would come from a proper analytics system)
        const adViews = products.reduce((sum, product) => sum + (product.views || 0), 0);
        const clicks = Math.floor(adViews * 0.25); // Simulated click-through rate
        const leads = Math.floor(clicks * 0.15); // Simulated lead conversion rate
        
        setStats({
          totalAds,
          activeAds,
          messages,
          adViews,
          clicks,
          leads
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Ads</h3>
          <span>Loading...</span>
        </div>
        <div className="stat-card">
          <h3>Active Ads</h3>
          <span>Loading...</span>
        </div>
        <div className="stat-card">
          <h3>Messages</h3>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Total Ads</h3>
        <span>{stats.totalAds}</span>
      </div>
      <div className="stat-card">
        <h3>Active Ads</h3>
        <span>{stats.activeAds}</span>
      </div>
      <div className="stat-card">
        <h3>Messages</h3>
        <span>{stats.messages}</span>
      </div>
    </div>
  );
};

export default DashboardStats;