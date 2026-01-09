import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ContactSeller from '../components/ContactSeller';
import ReportAd from '../components/ReportAd';
import ReviewList from '../components/Reviews/ReviewList';
import PriceNegotiation from '../components/PriceNegotiation';
import SocialShare from '../components/SocialShare';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        {product.images && product.images.map((image, index) => (
          <img key={index} src={image} alt={`${product.title} ${index + 1}`} />
        ))}
      </div>
      
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">${product.price}</p>
        <p className="description">{product.description}</p>
        
        <div className="product-meta">
          <p>Category: {product.category}</p>
          <p>Condition: {product.condition}</p>
          <p>Seller: {product.sellerId?.name || 'Unknown'}</p>
          <p>Location: {product.location?.city || 'Not specified'}</p>
          {product.averageRating > 0 && (
            <p>Rating: {product.averageRating.toFixed(1)}/5.0</p>
          )}
        </div>
        
        <div className="product-actions">
          <ContactSeller sellerId={product.sellerId?._id} productId={product._id} />
          <PriceNegotiation productId={product._id} currentPrice={product.price} />
          <ReportAd productId={product._id} />
        </div>
      </div>
      
      <div className="product-reviews">
        <ReviewList productId={product._id} sellerId={product.sellerId?._id} />
      </div>
      
      <div className="product-share">
        <SocialShare 
          url={window.location.href} 
          title={product.title} 
        />
      </div>
    </div>
  );
};

export default ProductDetail;