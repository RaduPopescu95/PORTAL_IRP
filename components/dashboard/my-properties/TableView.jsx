"use client";

import React from "react";
import { FaFileWord, FaFilePdf, FaCopy, FaTrashAlt, FaDownload, FaClipboard, FaFileAlt, FaExclamationTriangle } from "react-icons/fa";

const TableView = ({ 
  oferte = [], 
  handleTestJournal, 
  deleteItem, 
  copyToClipboard 
}) => {
  
  const tbodyContent = oferte?.map((item) => (
    <tr key={item.id}>
      <td className="vam">
        <span className="document-type">
          {item.numeAfisare}
          {/* {item.numar}-{item.numeAfisare}-{item.titlu} */}
          {/* {item.numar}-{item.numeAfisare}-{item.titlu} */}
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
            title="Descarcă WORD"
          >
            <FaFileWord />
          </button>
          <button
            className="btn btn-sm btn-outline-danger me-2"
            onClick={() => handleTestJournal(item.id, "PDF")}
            title="Descarcă PDF"
          >
            <FaFilePdf />
          </button>
          <button
            className="btn btn-sm btn-outline-info me-2"
            onClick={() => copyToClipboard(item.titlu)}
            title="Copiază titlul"
          >
            <FaCopy />
          </button>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => copyToClipboard(item.comunicat)}
            title="Copiază conținutul"
          >
            <FaClipboard />
          </button>
        </div>
      </td>
      <td className="vam">
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => deleteItem(item.id)}
          title="Șterge documentul"
        >
          <FaTrashAlt />
        </button>
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
              <th scope="col">
                <FaTrashAlt className="me-2" />
                Șterge
              </th>
            </tr>
          </thead>
          <tbody className="table-tbody">{tbodyContent}</tbody>
        </table>
      )}
    </div>
  );
};

export default TableView; 