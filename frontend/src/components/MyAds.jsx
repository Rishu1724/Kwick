import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProductCard from './ProductCard';

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Fetch only products created by the current user
        const response = await api.get(`/api/products?sellerId=${user._id}`);
        setAds(response.data.products || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your ads');
        setLoading(false);
      }
    };

    if (user) {
      fetchAds();
    }
  }, [user]);

  const deleteAd = async (adId) => {
    try {
      await api.delete(`/api/products/${adId}`);
      setAds(ads.filter(ad => ad._id !== adId));
    } catch (err) {
      setError('Failed to delete ad');
    }
  };

  const updateAdStatus = async (adId, status) => {
    try {
      const response = await api.put(`/api/products/${adId}`, { status });
      setAds(ads.map(ad => ad._id === adId ? response.data : ad));
    } catch (err) {
      setError('Failed to update ad status');
    }
  };

  if (loading) return <p>Loading your ads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="my-ads">
      <h2>My Ads</h2>
      {ads.length === 0 ? (
        <p>You haven't posted any ads yet.</p>
      ) : (
        <div className="product-grid">
          {ads.map((ad) => (
            <div key={ad._id} className="ad-item">
              <ProductCard product={ad} />
              <div className="ad-actions">
                <button 
                  className="btn-primary"
                  onClick={() => updateAdStatus(ad._id, ad.status === 'active' ? 'inactive' : 'active')}
                >
                  {ad.status === 'active' ? 'Mark Inactive' : 'Mark Active'}
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => deleteAd(ad._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAds;