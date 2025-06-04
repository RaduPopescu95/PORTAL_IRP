"use client";

import { useState } from "react";

const Filtering = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    dataStart: "",
    dataEnd: "",
    numarMin: "",
    numarMax: "",
    sortBy: "data",
    sortOrder: "desc"
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const defaultFilters = {
      dataStart: "",
      dataEnd: "",
      numarMin: "",
      numarMax: "",
      sortBy: "data",
      sortOrder: "desc"
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  return (
    <div className="filtering-container p-3 border rounded">
      <h5>Filtre și Sortare Acreditări</h5>
      
      <div className="row">
        {/* Data Start */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Data de la</label>
          <input
            type="date"
            className="form-control"
            value={filters.dataStart}
            onChange={(e) => handleFilterChange('dataStart', e.target.value)}
          />
        </div>

        {/* Data End */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Data până la</label>
          <input
            type="date"
            className="form-control"
            value={filters.dataEnd}
            onChange={(e) => handleFilterChange('dataEnd', e.target.value)}
          />
        </div>

        {/* Numar Min */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Număr minim</label>
          <input
            type="number"
            className="form-control"
            placeholder="Ex: 1"
            value={filters.numarMin}
            onChange={(e) => handleFilterChange('numarMin', e.target.value)}
          />
        </div>

        {/* Numar Max */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Număr maxim</label>
          <input
            type="number"
            className="form-control"
            placeholder="Ex: 100"
            value={filters.numarMax}
            onChange={(e) => handleFilterChange('numarMax', e.target.value)}
          />
        </div>

        {/* Sort By */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Sortează după</label>
          <select 
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="data">Data</option>
            <option value="numar">Număr înregistrare</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Ordine</label>
          <select 
            className="form-select"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="desc">Descrescător</option>
            <option value="asc">Crescător</option>
          </select>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={clearFilters}
        >
          Resetează filtrele
        </button>
      </div>
    </div>
  );
};

export default Filtering;
