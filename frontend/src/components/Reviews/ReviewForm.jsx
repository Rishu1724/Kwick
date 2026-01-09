import React, { useState } from 'react';
import Rating from './Rating';
import './Reviews.css';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    onSubmit({ rating, comment });
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      
      <div className="form-group">
        <label>Rating:</label>
        <Rating 
          value={rating} 
          onChange={setRating} 
          editable={true} 
        />
        {error && rating === 0 && <div className="error">{error}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          maxLength="500"
        />
        <div className="char-count">
          {comment.length}/500
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;