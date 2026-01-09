import React from 'react';

const Pagination = ({ pages, page, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="pagination">
      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          className={x + 1 === page ? 'active' : ''}
          onClick={() => onPageChange(x + 1)}
        >
          {x + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;