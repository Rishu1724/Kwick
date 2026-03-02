import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import EquipmentCard from '../components/EquipmentCard';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import './EquipmentList.css';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
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
      location: '',
      status: 'available'
    };
    
    setFilters(initialFilters);
  }, [location.search]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        // Pagination (backend expects `page` and `limit`)
        const limit = 20;
        queryParams.append('page', String(currentPage));
        queryParams.append('limit', String(limit));

        // Filters (map legacy fields to equipment fields)
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.condition) queryParams.append('condition', filters.condition);
        if (filters.status) queryParams.append('status', filters.status);

        // Location: try to filter by location.city (backend supports regex)
        if (filters.location) queryParams.append('location', filters.location);

        // Price range → dailyRate range
        if (filters.minPrice) queryParams.append('dailyRate[gte]', filters.minPrice);
        if (filters.maxPrice) queryParams.append('dailyRate[lte]', filters.maxPrice);

        // Sorting (backend expects `sort`)
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
      fetchEquipment();
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

  if (loading) return <div className="loading">Loading equipment...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="equipment-list-page">
      <div className="page-header">
        <h1>Sports Equipment for Rent</h1>
        <p>Find the perfect gear for your next adventure</p>
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

          {equipment.length === 0 ? (
            <div className="no-equipment">
              <h3>No equipment found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <>
              <div className="equipment-grid">
                {equipment.map((item) => (
                  <EquipmentCard key={item._id} equipment={item} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;