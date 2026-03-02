import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import EquipmentCard from '../components/EquipmentCard';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';

const CategoryPage = () => {
  const { category } = useParams();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Set initial filters based on category
    const initialFilters = {
      category: category || '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: ''
    };
    
    setFilters(initialFilters);
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        const limit = 20;
        queryParams.append('page', String(currentPage));
        queryParams.append('limit', String(limit));

        if (filters.category) queryParams.append('category', filters.category);
        if (filters.condition) queryParams.append('condition', filters.condition);
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.minPrice) queryParams.append('dailyRate[gte]', filters.minPrice);
        if (filters.maxPrice) queryParams.append('dailyRate[lte]', filters.maxPrice);

        if (sortBy === 'price-asc') queryParams.append('sort', 'dailyRate');
        else if (sortBy === 'price-desc') queryParams.append('sort', '-dailyRate');
        else if (sortBy === 'popularity') queryParams.append('sort', '-views');
        else queryParams.append('sort', '-createdAt');

        const response = await api.get(`/api/equipment?${queryParams.toString()}`);
        setEquipment(response.data.data || []);
        setTotalPages(Math.max(1, Math.ceil((response.data.count || 0) / limit)));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch equipment');
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

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>{category} Equipment</h1>
        <p>Browse listings in this category</p>
      </div>
      
      <div className="equipment-content">
        <FilterSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="equipment-main">
          <div className="equipment-controls">
            <div className="results-info">
              Showing {equipment.length} results
            </div>
            <SortDropdown 
              currentSort={sortBy} 
              onSortChange={handleSortChange} 
            />
          </div>
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <p>Loading equipment...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              <div className="alert-message">{error}</div>
            </div>
          ) : equipment.length === 0 ? (
            <div className="no-equipment">
              <h3>No equipment found</h3>
              <p>No equipment found in this category.</p>
            </div>
          ) : (
            <>
              <div className="equipment-grid">
                {equipment.map((item) => (
                  <EquipmentCard key={item._id} equipment={item} />
                ))}
              </div>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;