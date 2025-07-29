"use client";

import React from "react";
import { FaFileWord, FaFilePdf, FaCopy, FaTrashAlt, FaDownload, FaClipboard, FaFileAlt, FaExclamationTriangle } from "react-icons/fa";

const TableView = ({ 
  oferte = [], 
  handleTestJournal, 
  deleteItem, 
  copyToClipboard,
  isSelectMode = false,
  selectedItems = new Set(),
  onToggleSelect
}) => {
  
  const tbodyContent = oferte?.map((item) => (
    <tr key={item.id} className={isSelectMode && selectedItems.has(item.id) ? 'table-row-selected' : ''}>
      {/* Checkbox pentru selecție multiplă */}
      {isSelectMode && (
        <td className="vam text-center">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selectedItems.has(item.id)}
            onChange={() => onToggleSelect && onToggleSelect(item.id)}
            id={`table-select-${item.id}`}
          />
        </td>
      )}
      
      <td className="vam">
        <span className="document-type">
         {item.numeAfisare}
        </span>
      </td>
      <td className="vam">
        <span className="status-badge">{item.numar}</span>
      </td>
      <td className="vam">{item.data}</td>
      <td className="vam">
        <div className="table-actions">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => handleTestJournal(item.id, "DOCX")}
            disabled={!item.wordLink}
            title="Descarcă DOCX"
          >
            <FaFileWord />
          </button>
          <button
            className="btn btn-sm btn-outline-danger me-2"
            onClick={() => handleTestJournal(item.id, "PDF")}
            disabled={!item.pdfLink}
            title="Descarcă PDF"
          >
            <FaFilePdf />
          </button>
          <button
            className="btn btn-sm btn-outline-info me-2"
            onClick={() => copyToClipboard(item.comunicat)}
            title="Copiază conținutul"
          >
            <FaCopy />
          </button>
          {!isSelectMode && ( // Ascunde butonul de ștergere individuală în modul selecție
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => deleteItem(item.id)}
              title="Șterge document"
            >
              <FaTrashAlt />
            </button>
          )}
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="table-responsive">
      {tbodyContent?.length === 0 ? (
        <div className="empty-state">
          <FaExclamationTriangle className="empty-icon" />
          <h4>Nu există documente</h4>
          <p>Nu au fost găsite documente care să corespundă criteriilor de căutare.</p>
        </div>
      ) : (
        <table className="table table-modern">
          <thead>
            <tr>
              {/* Checkbox header pentru selecție multiplă */}
              {isSelectMode && (
                <th scope="col" className="text-center" style={{width: '50px'}}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={oferte.length > 0 && selectedItems.size === oferte.length}
                    onChange={() => {
                      if (selectedItems.size === oferte.length) {
                        // Deselect all
                        oferte.forEach(item => {
                          if (selectedItems.has(item.id)) {
                            onToggleSelect && onToggleSelect(item.id);
                          }
                        });
                      } else {
                        // Select all
                        oferte.forEach(item => {
                          if (!selectedItems.has(item.id)) {
                            onToggleSelect && onToggleSelect(item.id);
                          }
                        });
                      }
                    }}
                    title={selectedItems.size === oferte.length ? "Deselectează toate" : "Selectează toate"}
                  />
                </th>
              )}
              
              <th scope="col">
                <FaFileAlt className="me-2" />
                Document
              </th>
              <th scope="col">
                <span>Număr</span>
              </th>
              <th scope="col">
                <span>Data</span>
              </th>
              <th scope="col">
                <FaDownload className="me-2" />
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody>
            {tbodyContent}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableView; 