import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import AdvancedSearch from '../components/AdvancedSearch';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
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
      
      const response = await api.get(`/api/products?${apiParams}`);
      setProducts(response.data.products || []);
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
      
      {products.length === 0 ? (
        <p>No products found matching your search.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;