import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const alertClasses = `alert alert-${type}`;

  return (
    <div className={alertClasses}>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;