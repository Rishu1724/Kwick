import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "../components/Profile";
import Wishlist from "../components/Wishlist";
import MyBookings from "../components/MyBookings";
import ConversationsPage from "./ConversationsPage";
import EquipmentList from "./EquipmentList";
import "./RenterDashboardPage.css";

const TABS = [
  { id: "bookings",   label: "My Rentals",       icon: "📅" },
  { id: "equipment",  label: "Browse Equipment",  icon: "🏸" },
  { id: "wishlist",   label: "Wish List",          icon: "❤️" },
  { id: "messages",   label: "Messages",           icon: "💬" },
  { id: "profile",    label: "My Profile",         icon: "👤" },
];

const RenterDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  if (!user) return <Navigate to="/login" />;

  const renderContent = () => {
    switch (activeTab) {
      case "bookings":   return <MyBookings />;
      case "equipment":  return <EquipmentList />;
      case "wishlist":   return <Wishlist />;
      case "messages":   return <ConversationsPage />;
      case "profile":    return <Profile />;
      default:           return null;
    }
  };

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <div className="rd-root">
      {/* Sidebar */}
      <aside className="rd-sidebar">
        <div className="rd-brand">
          <span className="rd-brand-icon">K</span>
          <span className="rd-brand-name">Kwick</span>
        </div>

        <div className="rd-user-card">
          <div className="rd-avatar">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="rd-user-name">{user.name}</p>
            <p className="rd-user-role">Renter</p>
          </div>
        </div>

        <nav className="rd-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`rd-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="rd-nav-icon">{tab.icon}</span>
              <span className="rd-nav-label">{tab.label}</span>
              {activeTab === tab.id && <span className="rd-nav-indicator" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="rd-main">
        <header className="rd-topbar">
          <div>
            <h1 className="rd-page-title">
              {activeTabData.icon} {activeTabData.label}
            </h1>
            <p className="rd-page-sub">Welcome back, <strong>{user.name}</strong></p>
          </div>
        </header>

        <div className="rd-content">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default RenterDashboardPage;