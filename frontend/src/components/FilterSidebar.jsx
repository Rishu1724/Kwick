import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

const FilterSidebar = ({ filters: controlledFilters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: '',
    status: ''
  });
  
  const location = useLocation();

  // Load categories for the category dropdown
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/api/categories');
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setCategories(list);
      } catch {
        // If categories fail to load, keep a safe empty list.
        if (!isMounted) return;
        setCategories([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync from parent-controlled filters (EquipmentList/CategoryPage)
  useEffect(() => {
    if (!controlledFilters) return;
    setFilters((prev) => ({ ...prev, ...controlledFilters }));
  }, [controlledFilters]);

  useEffect(() => {
    // Parse query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    
    // Set initial filters based on URL parameters
    if (!category) return;

    setFilters((prev) => {
      const next = { ...prev, category };
      onFilterChange(next);
      return next;
    });
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
      location: '',
      status: ''
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
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label>Daily Rate Range (₹):</label>
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
          <option value="excellent">Excellent</option>
          <option value="very-good">Very Good</option>
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

      <div className="filter-group">
        <label>Status:</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">Any</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>
      
      <button className="btn-secondary" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  );
};

export default FilterSidebar;