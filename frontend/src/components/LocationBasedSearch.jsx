import React, { useState } from 'react';

const LocationBasedSearch = ({ onLocationChange }) => {
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLocationChange(location);
  };

  return (
    <div className="location-search">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="location">Search by Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city or zip code"
          />
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
};

export default LocationBasedSearch;