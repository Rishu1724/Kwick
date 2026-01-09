import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ReviewForm from './ReviewForm';
import Rating from './Rating';
import './Reviews.css';

const ReviewList = ({ productId, sellerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reviews/product/${productId}`);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reviews');
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await api.post('/api/reviews', {
        productId,
        ...reviewData
      });
      
      setReviews([response.data, ...reviews]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="review-list">
      <div className="review-header">
        <h3>Reviews ({reviews.length})</h3>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write Review'}
        </button>
      </div>
      
      {showForm && (
        <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setShowForm(false)} />
      )}
      
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="reviews">
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.buyerId.name}</span>
                  <Rating value={review.rating} />
                </div>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <div className="review-comment">
                  {review.comment}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;