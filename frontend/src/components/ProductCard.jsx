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

  // Calculate discount percentage for display (this could be calculated based on original vs current price)
  const discountPercentage = Math.floor(Math.random() * 40) + 10; // Random discount for demo
  const isSpecialOffer = Math.random() > 0.7; // Random special offer for demo

  return (
    <Link to={`/product/${product._id}`} className="product-card-link-enhanced">
      <div className="product-card-enhanced">
        <div className="product-image-container-enhanced">
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
        <div className="product-info-enhanced">
          <h3 className="product-title-enhanced">
            {product.title}
          </h3>
          {isSpecialOffer && (
            <p className="special-offer-tag">Special offer</p>
          )}
          <p className="discount-text">Min. {discountPercentage}% Off</p>
          <p className="price-enhanced">${product.price}</p>
          <p className="location-enhanced">{product.location?.city || 'Location not specified'}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;