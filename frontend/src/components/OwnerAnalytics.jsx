import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './OwnerAnalytics.css';

const OwnerAnalytics = ({ overview = false }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalEquipment: 0,
    revenueByMonth: [],
    topEquipment: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch bookings for the owner
        const bookingsResponse = await api.get('/api/bookings');
        const ownerBookings = bookingsResponse.data.data.filter(booking => 
          booking.ownerId._id === user._id || booking.ownerId === user._id
        );

        // Calculate stats
        const totalEarnings = ownerBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
        const totalBookings = ownerBookings.length;
        const activeBookings = ownerBookings.filter(booking => 
          ['pending', 'confirmed', 'active'].includes(booking.status)
        ).length;

        // Fetch owner's equipment
        const equipmentResponse = await api.get('/api/equipment/my');
        const totalEquipment = equipmentResponse.data.data.length;

        setStats({
          totalEarnings,
          totalBookings,
          activeBookings,
          totalEquipment,
          revenueByMonth: [],
          topEquipment: []
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div className="owner-analytics">
      <h2>{overview ? 'Dashboard Overview' : 'Earnings Analytics'}</h2>
      
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>₹{stats.totalEarnings.toLocaleString()}</h3>
          <p>Total Earnings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalBookings}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeBookings}</h3>
          <p>Active Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalEquipment}</h3>
          <p>Total Equipment</p>
        </div>
      </div>
      
      {overview && (
        <div className="quick-stats">
          <h3>Recent Activity</h3>
          <p>Track your equipment performance and rental income trends.</p>
        </div>
      )}
      
      {!overview && (
        <div className="detailed-analytics">
          <h3>Revenue Trends</h3>
          <p>More detailed analytics coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default OwnerAnalytics;