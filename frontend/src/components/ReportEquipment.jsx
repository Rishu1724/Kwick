import React from 'react';

const ReportEquipment = ({ equipmentId }) => {
  const handleReport = () => {
    alert('Reporting feature coming soon!');
  };

  return (
    <button className="btn-report" onClick={handleReport}>
      Report Equipment
    </button>
  );
};

export default ReportEquipment;