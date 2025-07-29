"use client";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const handleClick = (page, event) => {
    event.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculează paginile care trebuie afișate
  const getVisiblePages = () => {
    const delta = 2; // Numărul de pagini de fiecare parte a paginii curente
    const range = [];
    const rangeWithDots = [];

    // Calculează range-ul centrat pe pagina curentă
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Adaugă prima pagină
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Adaugă range-ul din mijloc (doar dacă nu include prima sau ultima pagină)
    range.forEach(page => {
      if (page !== 1 && page !== totalPages) {
        rangeWithDots.push(page);
      }
    });

    // Adaugă ultima pagină
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null; // Nu afișa paginația dacă există doar o pagină
  }

  const visiblePages = getVisiblePages();

  return (
    <div className="modern-pagination-wrapper">
      {/* Info despre pagină (vizibil doar pe desktop) */}
      <div className="pagination-info d-none d-md-block">
        Pagina {currentPage} din {totalPages}
      </div>

      {/* Paginația actuală */}
      <nav aria-label="Navigare prin pagini" className="modern-pagination">
        <ul className="pagination-list">
          {/* Buton Previous */}
          <li className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="pagination-button pagination-nav"
              onClick={(e) => handleClick(currentPage - 1, e)}
              disabled={currentPage === 1}
              aria-label="Pagina anterioară"
            >
              <FaChevronLeft />
              <span className="d-none d-sm-inline">Anterior</span>
            </button>
          </li>

          {/* Numerele paginilor */}
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <li key={`dots-${index}`} className="pagination-item pagination-dots">
                  <span className="pagination-ellipsis">
                    <FaEllipsisH />
                  </span>
                </li>
              );
            }

            return (
              <li
                key={page}
                className={`pagination-item ${page === currentPage ? "active" : ""}`}
              >
                <button
                  className="pagination-button pagination-number"
                  onClick={(e) => handleClick(page, e)}
                  aria-label={`Pagina ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              </li>
            );
          })}

          {/* Buton Next */}
          <li className={`pagination-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="pagination-button pagination-nav"
              onClick={(e) => handleClick(currentPage + 1, e)}
              disabled={currentPage === totalPages}
              aria-label="Pagina următoare"
            >
              <span className="d-none d-sm-inline">Următorul</span>
              <FaChevronRight />
            </button>
          </li>
        </ul>
      </nav>

      {/* Info compactă pentru mobile */}
      <div className="pagination-mobile-info d-block d-md-none">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
