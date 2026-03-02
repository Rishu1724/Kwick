import React from 'react';

const SortDropdown = ({ currentSort, sortBy, onSortChange }) => {
  const selected = currentSort ?? sortBy ?? 'newest';
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Popularity' }
  ];

  return (
    <div className="sort-dropdown">
      <label>Sort by:</label>
      <select value={selected} onChange={(e) => onSortChange(e.target.value)}>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;