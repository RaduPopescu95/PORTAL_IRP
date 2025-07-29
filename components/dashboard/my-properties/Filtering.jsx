"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  FaFilter, 
  FaSort, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaFileAlt,
  FaUserTie,
  FaCalendarAlt,
  FaHashtag,
  FaRedoAlt,
  FaBolt,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaAdjust,
  FaTimes
} from 'react-icons/fa';

const Filtering = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    tipDocument: "",
    dataStart: "",
    dataEnd: "",
    numarMin: "",
    numarMax: "",
    semnatar: "",
    sortBy: "numar",
    sortOrder: "desc"
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Verifică dacă sunt filtre active (altele decât sortarea implicită)
  const checkActiveFilters = useCallback((currentFilters) => {
    const hasFilters = currentFilters.tipDocument !== "" ||
                      currentFilters.dataStart !== "" ||
                      currentFilters.dataEnd !== "" ||
                      currentFilters.numarMin !== "" ||
                      currentFilters.numarMax !== "" ||
                      currentFilters.semnatar !== "" ||
                      (currentFilters.sortBy !== "numar" || currentFilters.sortOrder !== "desc");
    setHasActiveFilters(hasFilters);
  }, []);

  // Effect pentru aplicarea filtrelor implicite la prima încărcare
  useEffect(() => {
    if (onFilterChange && typeof onFilterChange === 'function') {
      onFilterChange(filters);
    }
    checkActiveFilters(filters);
  }, []); // Rulează doar la mount
  
  // Effect separat pentru verificarea filtrelor active
  useEffect(() => {
    checkActiveFilters(filters);
  }, [filters, checkActiveFilters]);

  const handleFilterChange = useCallback((field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    checkActiveFilters(newFilters);
    if (onFilterChange && typeof onFilterChange === 'function') {
      onFilterChange(newFilters);
    }
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      tipDocument: "",
      dataStart: "",
      dataEnd: "",
      numarMin: "",
      numarMax: "",
      semnatar: "",
      sortBy: "numar",
      sortOrder: "desc"
    };
    setFilters(defaultFilters);
    checkActiveFilters(defaultFilters);
    if (onFilterChange && typeof onFilterChange === 'function') {
      onFilterChange(defaultFilters);
    }
  }, [onFilterChange, checkActiveFilters]);

  return (
    <div >
    {/* <div className="modern-filter-container"> */}
      {/* Buton Toggle pentru Filtrare Avansată */}
      <div className="filter-toggle-header">
        <button 
          className={`filter-toggle-btn ${isAdvancedOpen ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <div className="toggle-content">
            <div className="toggle-left">
              <FaAdjust className="toggle-icon" />
              <span className="toggle-text">
                Filtrare & Sortare Avansată
                {hasActiveFilters && <span className="active-indicator">●</span>}
              </span>
            </div>
            <div className="toggle-right">
              {hasActiveFilters && (
                <button 
                  className="quick-reset-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                  title="Resetează filtrele"
                >
                  <FaTimes />
                </button>
              )}
              {isAdvancedOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
        </button>
      </div>

      {/* Secțiunea de Filtre Avansate (pliabilă) */}
      {isAdvancedOpen && (
        <div className="filter-advanced-section">
          <div className="filter-header">
            <div className="filter-title">
              <h3><FaFilter /> Opțiuni Avansate de Filtrare</h3>
              <p>Personalizează afișarea documentelor BICP</p>
            </div>
            <button 
              className="reset-filters-btn"
              onClick={clearFilters}
              title="Resetează toate filtrele"
            >
              <FaRedoAlt /> Resetează Tot
            </button>
          </div>

          <div className="filter-sections">
            {/* Secțiune Filtrare Rapidă */}
            <div className="filter-section quick-filters">
              <h4><FaBolt /> Filtrare Rapidă</h4>
              <div className="filter-row">
                <div className="filter-group">
                  <label><FaFileAlt /> Tip Document</label>
                  <div className="custom-select">
                    <select 
                      className="form-control"
                      value={filters.tipDocument}
                      onChange={(e) => handleFilterChange('tipDocument', e.target.value)}
                    >
                      <option value="">🔷 Toate tipurile</option>
                      <option value="Buletin Informativ">📋 Buletin Informativ</option>
                      <option value="Comunicat de Presă">📢 Comunicat de Presă</option>
                      <option value="Știre">📰 Știre</option>
                      <option value="Declarație de presă">📝 Declarație de presă</option>
                      <option value="Conferință de presă">🎤 Conferință de presă</option>
                    </select>
                  </div>
                </div>

                <div className="filter-group">
                  <label><FaUserTie /> Semnatar</label>
                  <div className="custom-select">
                    <select 
                      className="form-control"
                      value={filters.semnatar}
                      onChange={(e) => handleFilterChange('semnatar', e.target.value)}
                    >
                      <option value="">👤 Toți semnătorii</option>
                      <option value="IGSU">🏛️ IGSU</option>
                      <option value="Inspector Șef">👨‍💼 Inspector Șef</option>
                      <option value="Purtător de cuvânt">📢 Purtător de cuvânt</option>
                      <option value="Șef serviciu">👩‍💼 Șef serviciu</option>
                      <option value="Ofițer presă">📰 Ofițer presă</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Secțiune Date */}
            <div className="filter-section date-filters">
              <h4><FaCalendarAlt /> Intervalul de Date</h4>
              <div className="filter-row">
                <div className="filter-group">
                  <label><FaCalendarAlt /> Data început</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.dataStart}
                    onChange={(e) => handleFilterChange('dataStart', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label><FaCalendarAlt /> Data sfârșit</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={filters.dataEnd}
                    onChange={(e) => handleFilterChange('dataEnd', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Secțiune Numere */}
            <div className="filter-section number-filters">
              <h4><FaHashtag /> Intervalul Numerelor</h4>
              <div className="filter-row">
                <div className="filter-group">
                  <label><FaHashtag /> Număr minim</label>
                  <input 
                    type="number"
                    className="form-control"
                    placeholder="ex: 1"
                    value={filters.numarMin}
                    onChange={(e) => handleFilterChange('numarMin', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label><FaHashtag /> Număr maxim</label>
                  <input 
                    type="number"
                    className="form-control"
                    placeholder="ex: 200"
                    value={filters.numarMax}
                    onChange={(e) => handleFilterChange('numarMax', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Secțiune Sortare */}
            <div className="filter-section sort-filters">
              <h4><FaSort /> Sortare</h4>
              <div className="filter-row">
                <div className="filter-group">
                  <label><FaChartLine /> Sortează după</label>
                  <div className="custom-select">
                    <select 
                      className="form-control"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="numar">🔢 Număr înregistrare</option>
                      <option value="data">📅 Data</option>
                      <option value="numarComunicat">📋 Număr comunicat</option>
                      <option value="titlu">📝 Titlu</option>
                      <option value="nume">📄 Tip document</option>
                    </select>
                  </div>
                </div>

                <div className="filter-group">
                  <label><FaSort /> Ordine</label>
                  <div className="sort-toggle">
                    <button 
                      className={`sort-btn ${filters.sortOrder === 'desc' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('sortOrder', 'desc')}
                    >
                      <FaSortAmountDown /> Descrescător
                    </button>
                    <button 
                      className={`sort-btn ${filters.sortOrder === 'asc' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('sortOrder', 'asc')}
                    >
                      <FaSortAmountUp /> Crescător
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filtering;
