import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteToggle from './FavoriteToggle';

const ProductCard = ({ product }) => {
  // For now, we'll assume the product is not favorited
  // In a real app, you would check if the product is in the user's favorites
  const handleFavoriteToggle = (isFavorited) => {
    // Handle favorite toggle
    console.log(`Product ${product._id} is now ${isFavorited ? 'favorited' : 'unfavorited'}`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300'} 
          alt={product.title} 
        />
        <FavoriteToggle 
          productId={product._id} 
          isFavorited={false} 
          onToggle={handleFavoriteToggle} 
        />
      </div>
      <div className="product-info">
        <h3>
          <Link to={`/product/${product._id}`}>{product.title}</Link>
        </h3>
        <p className="price">${product.price}</p>
        <p className="location">{product.location?.city || 'Location not specified'}</p>
        <p className="condition">{product.condition}</p>
      </div>
    </div>
  );
};

export default ProductCard;