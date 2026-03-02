import React from "react";
import Categories from "../components/Categories";
import FeaturedEquipment from "../components/FeaturedEquipment";
import RecentEquipment from "../components/RecentEquipment";

const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section with Cricket & Badminton Background */}
      <section
        className="relative text-white py-24 px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Rent Cricket & Badminton Gear Near You
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Cricket bats, badminton rackets, kits and more — affordable rentals from trusted local owners.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row justify-center bg-white rounded-lg overflow-hidden max-w-2xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search cricket bat, badminton racket..."
              className="flex-1 px-4 py-3 text-gray-700 outline-none"
            />
            <button className="bg-green-600 text-white px-8 py-3">
              Search
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-green-600 px-8 py-3 rounded-lg font-semibold">
              Browse Equipment
            </button>
            <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold">
              Become an Owner
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Browse by Category
        </h2>
        <Categories />
      </section>

      {/* Featured Equipment */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Featured Equipment
          </h2>
          <FeaturedEquipment />
        </div>
      </section>

      {/* Recent Equipment */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Recently Added
          </h2>
          <RecentEquipment />
        </div>
      </section>
    </div>
  );
};

export default Home;