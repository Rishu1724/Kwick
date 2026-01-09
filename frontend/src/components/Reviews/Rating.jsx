import React from 'react';

const Rating = ({ value, onChange, editable = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleClick = (ratingValue) => {
    if (editable && onChange) {
      onChange(ratingValue);
    }
  };

  return (
    <div className={`rating ${sizeClasses[size]} ${editable ? 'editable' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'filled' : 'empty'} ${editable ? 'cursor-pointer' : ''}`}
          onClick={() => handleClick(star)}
        >
          {star <= value ? '★' : '☆'}
        </span>
      ))}
      <span className="rating-text">({value.toFixed(1)})</span>
    </div>
  );
};

export default Rating;