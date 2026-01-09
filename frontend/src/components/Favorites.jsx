import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/api/favorites');
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch favorites');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (productId) => {
    try {
      await api.delete(`/api/favorites/${productId}`);
      setFavorites(favorites.filter(fav => fav.productId._id !== productId));
    } catch (err) {
      setError('Failed to remove favorite');
    }
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="favorites">
      <h2>My Favorites</h2>
      {favorites.length === 0 ? (
        <p>You haven't favorited any products yet.</p>
      ) : (
        <div className="product-grid">
          {favorites.map((favorite) => (
            <div key={favorite.productId._id} className="favorite-item">
              <ProductCard product={favorite.productId} />
              <button 
                className="remove-favorite" 
                onClick={() => removeFavorite(favorite.productId._id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;