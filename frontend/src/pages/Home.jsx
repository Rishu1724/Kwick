import React from 'react';
import Categories from '../components/Categories';
import FeaturedEquipment from '../components/FeaturedEquipment';
import RecentEquipment from '../components/RecentEquipment';

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <h1>SportRent - GearShare</h1>
        <p>Rent premium sports equipment from trusted owners in your community</p>
        <div className="hero-buttons">
          <button className="btn-primary hero-btn">Browse Equipment</button>
          <button className="btn-secondary hero-btn">Become an Owner</button>
        </div>
      </header>
      
      <Categories />
      
      <FeaturedEquipment />
      
      <RecentEquipment />
    </div>
  );
};

export default Home;