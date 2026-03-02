import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const defaultParams = {
  keyword: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  condition: '',
  location: '',
  sortBy: 'newest'
};

const fallbackCategories = ['Badminton', 'Cricket', 'Tennis', 'Football', 'Gym', 'Cycling'];

const AdvancedSearch = ({ onSearch, variant = 'panel', initialParams }) => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useState(defaultParams);

  const containerClassName = useMemo(() => {
    if (variant === 'sidebar') return 'filter-sidebar advanced-search';
    return 'advanced-search';
  }, [variant]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/api/categories');
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setCategories(list.map((c) => c?.name).filter(Boolean));
      } catch {
        if (!isMounted) return;
        setCategories([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialParams) return;
    setSearchParams((prev) => ({ ...prev, ...initialParams }));
  }, [initialParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleReset = () => {
    const resetParams = { ...defaultParams };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  return (
    <div className={containerClassName}>
      <h3>{variant === 'sidebar' ? 'Search Filters' : 'Advanced Search'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="keyword">Keyword:</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            value={searchParams.keyword}
            onChange={handleInputChange}
            placeholder="Search by title or description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={searchParams.category}
            onChange={handleInputChange}
          >
            <option value="">All Categories</option>
            {(categories.length > 0 ? categories : fallbackCategories).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="price-range">
          <div className="form-group">
            <label htmlFor="minPrice">Min Daily Rate (₹):</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={searchParams.minPrice}
              onChange={handleInputChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxPrice">Max Daily Rate (₹):</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={searchParams.maxPrice}
              onChange={handleInputChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="condition">Condition:</label>
          <select
            id="condition"
            name="condition"
            value={searchParams.condition}
            onChange={handleInputChange}
          >
            <option value="">Any Condition</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            placeholder="City / state / pincode"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            name="sortBy"
            value={searchParams.sortBy}
            onChange={handleInputChange}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;