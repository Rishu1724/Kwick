import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "../components/Profile";
import AddEquipmentForm from "../components/AddEquipmentForm";
import MyEquipment from "../components/MyEquipment";
import BookingRequests from "../components/BookingRequests";
import OwnerAnalytics from "../components/OwnerAnalytics";
import ConversationsPage from "./ConversationsPage";
import EquipmentList from "./EquipmentList";
import "./OwnerDashboardPage.css";

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);

  // Protect Route
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Handle modal close on background click
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowAddForm(false);
    }
  };

  // Tab configuration (cleaner structure)
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "browse", label: "Browse", icon: "🏸" },
    { id: "equipment", label: "My Equipment", icon: "📦" },
    { id: "requests", label: "Bookings", icon: "📋" },
    { id: "analytics", label: "Earnings", icon: "💰" },
    { id: "messages", label: "Messages", icon: "💬" },
  ];

  return (
    <div className="owner-dashboard">
      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="dashboard-title">Equipment Owner Dashboard</h1>
            <p className="welcome-text">
              Welcome back,{" "}
              <span className="user-name">{user?.name}</span>
            </p>
            <span className="owner-badge">Owner Mode</span>
          </div>

          <button
            className="btn-add-equipment"
            onClick={() => setShowAddForm(true)}
          >
            <span className="btn-icon">+</span>
            Add Equipment
          </button>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <div className="dashboard-navigation">
        <nav className="tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="dashboard-main">
        <div className="content-container">
          {activeTab === "overview" && (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Dashboard Overview</h2>
                <p className="section-subtitle">
                  Track your equipment performance and earnings
                </p>
              </div>
              <OwnerAnalytics overview={true} />
            </div>
          )}

          {activeTab === "browse" && (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Browse Equipment</h2>
                <p className="section-subtitle">
                  Discover sports equipment for rent
                </p>
              </div>
              <EquipmentList />
            </div>
          )}

          {activeTab === "equipment" && (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Equipment Inventory</h2>
                <p className="section-subtitle">
                  Manage your listed equipment
                </p>
              </div>
              <MyEquipment />
            </div>
          )}

          {activeTab === "requests" && (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Booking Requests</h2>
                <p className="section-subtitle">
                  Review and manage booking requests
                </p>
              </div>
              <BookingRequests />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Earnings Analytics</h2>
                <p className="section-subtitle">
                  View your revenue and performance metrics
                </p>
              </div>
              <OwnerAnalytics />
            </div>
          )}

          {activeTab === "messages" && (
            <div className="content-section full-height">
              <div className="section-header">
                <h2 className="section-title">Messages</h2>
                <p className="section-subtitle">
                  Communicate with renters
                </p>
              </div>
              <div className="messages-wrapper">
                <ConversationsPage />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD EQUIPMENT MODAL ================= */}
      {showAddForm && (
        <div
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
          <AddEquipmentForm
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default OwnerDashboardPage;
