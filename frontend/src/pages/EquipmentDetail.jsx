import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ContactOwner from "../components/ContactOwner";
import ReportEquipment from "../components/ReportEquipment";
import ReviewList from "../components/Reviews/ReviewList";
import BookingCalendar from "../components/BookingCalendar";
import SocialShare from "../components/SocialShare";
import "./EquipmentDetail.css";

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await api.get(`/api/equipment/${id}`);
        setEquipment(response.data.data);
      } catch (err) {
        setError("Failed to fetch equipment details");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  if (loading)
    return <div className="status-message">Loading equipment details...</div>;

  if (error) return <div className="status-message error">{error}</div>;

  if (!equipment)
    return <div className="status-message">Equipment not found</div>;

  const dailyRate = equipment.dailyRate || equipment.price;
  const hourlyRate = equipment.hourlyRate || Math.round(dailyRate / 8);
  const weeklyRate = equipment.weeklyRate || dailyRate * 6;

  return (
    <div className="equipment-detail-page">
      <div className="detail-container">

        {/* LEFT SIDE */}
        <div className="left-section">

          {/* IMAGE GALLERY */}
          <div className="equipment-gallery">
            {equipment.images?.length > 0 ? (
              equipment.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${equipment.title} ${index + 1}`}
                  className="equipment-image"
                />
              ))
            ) : (
              <div className="no-image">No Images Available</div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="description-card">
            <h2>Description</h2>
            <p>{equipment.description}</p>
          </div>

          {/* REVIEWS */}
          <div className="review-section">
            <ReviewList
              equipmentId={equipment._id}
              ownerId={equipment.ownerId?._id}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <div className="info-card">
            <h1>{equipment.title}</h1>

            {/* Pricing */}
            <div className="pricing-box">
              <div>
                <span className="price">₹{hourlyRate}</span>
                <small>/hour</small>
              </div>
              <div>
                <span className="price">₹{dailyRate}</span>
                <small>/day</small>
              </div>
              <div>
                <span className="price">₹{weeklyRate}</span>
                <small>/week</small>
              </div>
            </div>

            {/* Specs */}
            <div className="specs">
              <p><strong>Sport:</strong> {equipment.category}</p>
              <p><strong>Condition:</strong> {equipment.condition}</p>
              <p><strong>Owner:</strong> {equipment.ownerId?.name}</p>
              <p><strong>Location:</strong> {equipment.location?.city}</p>
              <p>
                <strong>Status:</strong>{" "}
                {equipment.status === "available" ? "✅ Available" : "❌ Rented"}
              </p>
              {equipment.averageRating > 0 && (
                <p>
                  <strong>Rating:</strong> ⭐{" "}
                  {equipment.averageRating.toFixed(1)}
                </p>
              )}
            </div>

            {/* Booking */}
            <div className="booking-card">
              <h3>Book Now</h3>
              <BookingCalendar
                equipmentId={equipment._id}
                ownerId={equipment.ownerId?._id}
                hourlyRate={hourlyRate}
                dailyRate={dailyRate}
              />
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <ContactOwner
                ownerId={equipment.ownerId?._id}
                equipmentId={equipment._id}
              />
              <ReportEquipment equipmentId={equipment._id} />
            </div>

            <div className="share-box">
              <SocialShare
                url={window.location.href}
                title={equipment.title}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EquipmentDetail;
