import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products?featured=true&pageNumber=1');
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load featured products');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading featured products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="featured-products">
      <h2>Featured Products</h2>
      {products.length === 0 ? (
        <p>No featured products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;