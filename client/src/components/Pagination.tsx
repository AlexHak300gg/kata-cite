import React from 'react';
import { Pagination as PaginationType } from '../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { current, total, totalItems } = pagination;
  
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (total <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
      >
        Previous
      </button>
      
      {getVisiblePages().map((page, index) => (
        page === '...' ? (
          <span key={`dots-${index}`} style={{ padding: '0 5px' }}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={current === page ? 'active' : ''}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
      >
        Next
      </button>
      
      <span className="pagination-info">
        {totalItems} total items
      </span>
    </div>
  );
};

export default Pagination;