import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import EquipmentCard from '../components/EquipmentCard';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';

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
      availability: 'available'
    };
    
    setFilters(initialFilters);
  }, [location.search]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...filters,
          sortBy,
          pageNumber: currentPage
        });
        
        const response = await api.get(`/api/equipment?${queryParams}`);
        setEquipment(response.data.equipment || []);
        setTotalPages(response.data.pages || 1);
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