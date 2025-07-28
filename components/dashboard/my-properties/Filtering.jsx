"use client";

import { useState, useEffect } from "react";
import { 
  FaSearch, 
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
  FaClock,
  FaChartLine
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

  // Effect pentru aplicarea filtrelor implicite la prima încărcare
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, []); // Rulează doar la prima încărcare

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
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
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  return (
    <div className="modern-filter-container">
      <div className="filter-header">
        <div className="filter-title">
          <h3><FaFilter /> Filtrare & Sortare Avansată</h3>
          <p>Personalizează afișarea documentelor BICP</p>
        </div>
        <button 
          className="reset-filters-btn"
          onClick={clearFilters}
          title="Resetează toate filtrele"
        >
          <FaRedoAlt /> Reset
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
                  <option value="Invitație">✉️ Invitație</option>
                  <option value="Interviu">🎙️ Interviu</option>
                  <option value="Anunț">📣 Anunț</option>
                  <option value="Eveniment de presă">🎪 Eveniment de presă</option>
                  <option value="Drept la replică">⚖️ Drept la replică</option>
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
                  <option value="">👥 Toți semnatorii</option>
                  <option value="HANTĂR Alfred">👤 HANTĂR Alfred</option>
                  <option value="ing. FLOREA Cristian-Claudiu">👤 ing. FLOREA Cristian-Claudiu</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Secțiune Intervalul de Date */}
                 <div className="filter-section date-filters">
           <h4><FaCalendarAlt /> Intervalul de Date</h4>
           <div className="filter-row">
             <div className="filter-group">
               <label><FaClock /> Data de la</label>
              <input
                type="date"
                className="form-control date-input"
                value={filters.dataStart}
                onChange={(e) => handleFilterChange('dataStart', e.target.value)}
              />
            </div>
            <div className="filter-separator">→</div>
                         <div className="filter-group">
               <label><FaClock /> Data până la</label>
              <input
                type="date"
                className="form-control date-input"
                value={filters.dataEnd}
                onChange={(e) => handleFilterChange('dataEnd', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Secțiune Interval Numere */}
                 <div className="filter-section number-filters">
           <h4><FaHashtag /> Intervalul Numerelor</h4>
           <div className="filter-row">
             <div className="filter-group">
               <label><FaHashtag /> Număr minim</label>
              <input
                type="number"
                className="form-control number-input"
                placeholder="1"
                value={filters.numarMin}
                onChange={(e) => handleFilterChange('numarMin', e.target.value)}
              />
            </div>
            <div className="filter-separator">→</div>
                         <div className="filter-group">
               <label><FaHashtag /> Număr maxim</label>
              <input
                type="number"
                className="form-control number-input"
                placeholder="999999"
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
  );
};

export default Filtering;
