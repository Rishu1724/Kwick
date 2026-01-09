import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FilterSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: ''
  });
  
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    
    // Set initial filters based on URL parameters
    if (category) {
      const initialFilters = {
        ...filters,
        category: category
      };
      setFilters(initialFilters);
      onFilterChange(initialFilters);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label>Category:</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="vehicles">Vehicles</option>
          <option value="real-estate">Real Estate</option>
          <option value="clothing">Clothing</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>Price Range:</label>
        <div className="price-range">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label>Condition:</label>
        <select name="condition" value={filters.condition} onChange={handleChange}>
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>Location:</label>
        <input
          type="text"
          name="location"
          placeholder="City or State"
          value={filters.location}
          onChange={handleChange}
        />
      </div>
      
      <button className="btn-secondary" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;