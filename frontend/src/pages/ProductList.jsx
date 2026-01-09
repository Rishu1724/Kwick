import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import LocationBasedSearch from '../components/LocationBasedSearch';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    
    // Set initial filters based on URL parameters
    const initialFilters = {
      category: category || '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: ''
    };
    
    setFilters(initialFilters);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...filters,
          sortBy,
          pageNumber: currentPage
        });
        
        const response = await api.get(`/api/products?${queryParams}`);
        setProducts(response.data.products || []);
        setTotalPages(response.data.pages || 1);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    if (Object.keys(filters).length > 0) {
      fetchProducts();
    }
  }, [filters, sortBy, currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLocationChange = (location) => {
    handleFilterChange({ ...filters, location });
  };

  return (
    <div className="product-list">
      <h1>All Products</h1>
      
      <LocationBasedSearch onLocationChange={handleLocationChange} />
      
      <div className="product-list-content">
        <div className="product-filters">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        
        <div className="product-grid-container">
          <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>{error}</p>
          ) : products.length === 0 ? (
            <p>No products found matching your criteria.</p>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination 
                pages={totalPages} 
                page={currentPage} 
                onPageChange={handlePageChange} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;