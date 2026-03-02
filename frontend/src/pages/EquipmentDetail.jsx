import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import ContactOwner from "../components/ContactOwner";
import ReportEquipment from "../components/ReportEquipment";
import ReviewList from "../components/Reviews/ReviewList";
import BookingCalendar from "../components/BookingCalendar";
import SocialShare from "../components/SocialShare";
import FavoriteToggle from "../components/FavoriteToggle";
import "./EquipmentDetail.css";

const EquipmentDetail = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  useEffect(() => {
    setActiveImageIndex(0);
  }, [equipment?._id]);

  if (loading)
    return <div className="status-message">Loading equipment details...</div>;

  if (error) return <div className="status-message error">{error}</div>;

  if (!equipment)
    return <div className="status-message">Equipment not found</div>;

  const dailyRate = equipment.dailyRate || equipment.price;
  const hourlyRate = equipment.hourlyRate || Math.round(dailyRate / 8);
  const weeklyRate = equipment.weeklyRate || dailyRate * 6;
  const images = Array.isArray(equipment.images) ? equipment.images.filter(Boolean) : [];
  const activeImageSrc = images[activeImageIndex] || images[0] || 'https://via.placeholder.com/1200x800';

  return (
    <div className="equipment-detail-page">
      <div className="detail-container">
        <div className="detail-top">
          <Link className="detail-back" to="/equipment">← Back to Equipment</Link>
        </div>

        <div className="detail-grid">
          <div className="detail-left">
            <div className="detail-image-wrap">
              <img
                src={activeImageSrc}
                alt={equipment.title}
              />
            </div>

            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.map((src, idx) => (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    className={`detail-thumb ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}

            <div className="detail-info-card">
              <h2>Description</h2>
              <p className="detail-desc">{equipment.description}</p>

              <div className="detail-spec-grid">
                <div className="detail-spec">
                  <div className="detail-spec-label">Condition</div>
                  <div className="detail-spec-value">{equipment.condition || '—'}</div>
                </div>
                <div className="detail-spec">
                  <div className="detail-spec-label">Category</div>
                  <div className="detail-spec-value">{equipment.category || '—'}</div>
                </div>
                <div className="detail-spec">
                  <div className="detail-spec-label">Location</div>
                  <div className="detail-spec-value">
                    {equipment.location?.city ? `${equipment.location.city}${equipment.location?.state ? `, ${equipment.location.state}` : ''}` : '—'}
                  </div>
                </div>
                <div className="detail-spec">
                  <div className="detail-spec-label">Availability</div>
                  <div className={`detail-availability ${equipment.status === 'available' ? 'ok' : 'no'}`}>
                    {equipment.status === 'available' ? '✓ Available' : '✕ Rented'}
                  </div>
                </div>
              </div>
            </div>

            <div className="review-section">
              <ReviewList equipmentId={equipment._id} ownerId={equipment.ownerId?._id} />
            </div>
          </div>

          <aside className="detail-right">
            <div className="booking-panel">
              <div className="booking-panel-header">
                <h1 className="detail-title">{equipment.title}</h1>
                <div className="detail-subrow">
                  <span className="detail-rating">★ {equipment.averageRating > 0 ? equipment.averageRating.toFixed(1) : 'New'}</span>
                  <span className="detail-dot">•</span>
                  <span className="detail-reviews">{equipment.numReviews ? `${equipment.numReviews} reviews` : 'No reviews yet'}</span>
                  <span className="detail-dot">•</span>
                  <span className="detail-loc">{equipment.location?.city ? `${equipment.location.city}${equipment.location?.state ? `, ${equipment.location.state}` : ''}` : 'Location not specified'}</span>
                </div>
              </div>

              <div className="booking-price-row">
                <div className="booking-price">₹{dailyRate}<span>/day</span></div>
                <div className="booking-week">₹{weeklyRate}/week</div>
              </div>

              <div className="booking-calendar-wrap">
                <BookingCalendar
                  equipmentId={equipment._id}
                  ownerId={equipment.ownerId?._id}
                  hourlyRate={hourlyRate}
                  dailyRate={dailyRate}
                  variant="compact"
                />
              </div>

              <div className="detail-actions">
                <ContactOwner ownerId={equipment.ownerId?._id} equipmentId={equipment._id} />
                <FavoriteToggle productId={equipment._id} isFavorited={false} onToggle={() => {}} variant="heart" />
              </div>

              <div className="detail-guarantee">
                <span className="detail-guarantee-icon">🛡</span>
                Your booking is protected by Kwick’s rental guarantee
              </div>

              <div className="detail-owner-card">
                <div className="detail-owner-avatar">{equipment.ownerId?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div>
                  <div className="detail-owner-name">{equipment.ownerId?.name || 'Owner'}</div>
                  <div className="detail-owner-role">Equipment Owner</div>
                </div>
              </div>

              <div className="detail-bottom-row">
                <ReportEquipment equipmentId={equipment._id} />
              </div>
            </div>

            <div className="share-box">
              <SocialShare url={window.location.href} title={equipment.title} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
