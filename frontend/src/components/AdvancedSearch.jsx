import React, { useState } from 'react';

const AdvancedSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: '',
    sortBy: 'newest'
  });

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
    const resetParams = {
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      sortBy: 'newest'
    };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  return (
    <div className="advanced-search">
      <h3>Advanced Search</h3>
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
            <option value="Badminton">Badminton</option>
            <option value="Cricket">Cricket</option>
            <option value="Tennis">Tennis</option>
            <option value="Football">Football</option>
            <option value="Gym">Gym</option>
            <option value="Cycling">Cycling</option>
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