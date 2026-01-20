import React from 'react';

const OwnerAnalytics = ({ overview = false }) => {
  return (
    <div className="owner-analytics">
      <h2>{overview ? 'Dashboard Overview' : 'Earnings Analytics'}</h2>
      <div className="analytics-placeholder">
        <p>Analytics dashboard coming soon!</p>
        <p>Track your equipment performance and earnings here.</p>
      </div>
    </div>
  );
};

export default OwnerAnalytics;