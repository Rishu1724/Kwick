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

  if (loading) return <p>Searching...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-results">
      <h1>Search Results for "{searchTerm}"</h1>
      
      <AdvancedSearch onSearch={handleAdvancedSearch} />
      
      {equipment.length === 0 ? (
        <p>No equipment found matching your search.</p>
      ) : (
        <div className="product-grid">
          {equipment.map((item) => (
            <EquipmentCard key={item._id} equipment={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;