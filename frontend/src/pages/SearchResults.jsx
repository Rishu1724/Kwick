import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import EquipmentCard from '../components/EquipmentCard';
import AdvancedSearch from '../components/AdvancedSearch';

const SearchResults = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('q');

  useEffect(() => {
    // Initialize search params with query parameter
    const initialParams = {
      keyword: searchTerm || '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      sortBy: 'newest'
    };
    
    setSearchParams(initialParams);
    fetchSearchResults(initialParams);
  }, [searchTerm]);

  const fetchSearchResults = async (params) => {
    try {
      setLoading(true);
      const apiParams = new URLSearchParams();
      
      // Add non-empty parameters to the query
      Object.keys(params).forEach(key => {
        if (params[key]) {
          apiParams.append(key, params[key]);
        }
      });
      
      // Map the legacy "products" search fields to equipment query params.
      // Backend supports keyword search via title regex by using query param `title`.
      // Also supports Mongo operators via bracket notation.
      const mapped = new URLSearchParams();

      if (params.keyword) mapped.append('keyword', params.keyword);
      if (params.category) mapped.append('category', params.category);
      if (params.condition) mapped.append('condition', params.condition);
      if (params.location) mapped.append('location', params.location);
      // price range maps to dailyRate range
      if (params.minPrice) mapped.append('dailyRate[gte]', params.minPrice);
      if (params.maxPrice) mapped.append('dailyRate[lte]', params.maxPrice);

      // sortBy mapping
      if (params.sortBy === 'price-asc') mapped.append('sort', 'dailyRate');
      else if (params.sortBy === 'price-desc') mapped.append('sort', '-dailyRate');
      else mapped.append('sort', '-createdAt');

      const response = await api.get(`/api/equipment?${mapped.toString()}`);
      setEquipment(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch search results');
      setLoading(false);
    }
  };

  const handleAdvancedSearch = (params) => {
    setSearchParams(params);
    fetchSearchResults(params);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Searching...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results equipment-list-page">
        <div className="alert alert-danger">
          <div className="alert-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results equipment-list-page">
      <div className="page-header">
        <h1>Search Results</h1>
        <p>{searchTerm ? `Results for "${searchTerm}"` : 'Browse all available equipment'}</p>
      </div>

      <div className="equipment-content">
        <AdvancedSearch
          variant="sidebar"
          initialParams={searchParams}
          onSearch={handleAdvancedSearch}
        />

        <div className="equipment-main">
          <div className="equipment-controls">
            <div className="results-info">Showing {equipment.length} results</div>
          </div>

          {equipment.length === 0 ? (
            <div className="no-equipment">
              <h3>No equipment found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="equipment-grid">
              {equipment.map((item) => (
                <EquipmentCard key={item._id} equipment={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;