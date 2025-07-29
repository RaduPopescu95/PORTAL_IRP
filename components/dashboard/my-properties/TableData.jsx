import Image from "next/image";
import properties from "../../../data/properties";
import { useState } from "react";
import oferte from "@/data/oferte";
import GradeFidelitate from "./GradeFidelitate";
import Link from "next/link";
import {
  handleDeleteFirestoreSubcollectionData,
  handleUpdateFirestoreSubcollection,
  deleteFirestoreItem,
} from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import DeleteDialog from "@/components/common/dialogs/DeleteDialog";
import { deleteImage } from "@/utils/storageUtils";
import { useCollectionPagination } from "@/hooks/useCollectionPagination";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { 
  FaFileWord, 
  FaFilePdf, 
  FaCopy, 
  FaTrashAlt, 
  FaDownload,
  FaClipboard,
  FaFileAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

// CSS in JS pentru simbolurile tick și close
const styles = {
  tick: {
    color: "green", // Verde pentru tick
  },
  close: {
    color: "red", // Roșu pentru close
  },
};

const TableData = ({ 
  oferte, 
  onRefresh,
  handleTestJournal,
  deleteItem,
  copyToClipboard,
  isSelectMode = false,
  selectedItems = new Set(),
  onToggleSelect
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isMobile = useIsMobile();

  // Fallback functions dacă nu sunt trimise ca props
  const finalCopyToClipboard = copyToClipboard || (async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Textul a fost copiat: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

  const finalHandleTestJournal = handleTestJournal || ((itemId, format) => {
    const item = oferte.find(item => item.id === itemId);
    if (item) {
      if (format === "DOCX" && item.wordLink) {
        window.open(item.wordLink, '_blank');
      } else if (format === "PDF" && item.pdfLink) {
        window.open(item.pdfLink, '_blank');
      } else {
        alert(`Link-ul pentru ${format} nu este disponibil.`);
      }
    }
  });

  const finalDeleteItem = deleteItem || (async (itemId) => {
    try {
      await deleteFirestoreItem("Comunicate", itemId);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting BICP item:", error);
      alert("Eroare la ștergerea documentului!");
    }
  });

  const handleDeleteClick = (item) => {
    setSelectedItem(item); // Salvează elementul selectat
    setShowModal(true); // Afișează modalul
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logica de ștergere a elementului din Firestore
  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsLoading(true);
    try {
      await finalDeleteItem(selectedItem.id);
      setShowModal(false); // Închide modalul după ștergere
    } catch (error) {
      console.error("Error in delete confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSameOrAfter = (date1, date2) => {
    return date1.setHours(0, 0, 0, 0) >= date2.setHours(0, 0, 0, 0);
  };

  const isSameOrBefore = (date1, date2) => {
    return date1.setHours(0, 0, 0, 0) <= date2.setHours(0, 0, 0, 0);
  };

  if (!oferte || oferte.length === 0) {
    return (
      <div className="no-data-message">
        <div className="empty-state">
          <h4><FaFileAlt /> Nu există comunicate</h4>
          <p>Nu au fost găsite documente BICP pentru perioada selectată.</p>
        </div>
      </div>
    );
  }

  let cardContent = oferte?.map((item) => (
    <div key={item.id} className={`bicp-card ${isSelectMode && selectedItems.has(item.id) ? 'selected' : ''}`}>
      {/* Checkbox pentru selecție multiplă */}
      {isSelectMode && (
        <div className="card-select-checkbox">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selectedItems.has(item.id)}
            onChange={() => onToggleSelect && onToggleSelect(item.id)}
            id={`select-${item.id}`}
          />
          <label htmlFor={`select-${item.id}`} className="form-check-label sr-only">
            Selectează documentul {item.numar}
          </label>
        </div>
      )}
      
      <div className="card-header">
        <div className="document-type">
          <span className="type-badge">{item.numeAfisare}</span>
        </div>

      </div>
      
      <div className="card-body">
        <h4 className="document-title">{item.titlu}</h4>
        
        <div className="card-actions">
          <div className="download-section">
            <h6><FaDownload /> Descarcă:</h6>
            <div className="action-buttons">
              <button 
                onClick={() => finalHandleTestJournal(item.id, "DOCX")} 
                className="download-btn word-btn"
                disabled={!item.wordLink}
              >
                <FaFileWord /> WORD
              </button>
              <button 
                onClick={() => finalHandleTestJournal(item.id, "PDF")} 
                className="download-btn pdf-btn"
                disabled={!item.pdfLink}
              >
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>
          
          <div className="copy-section">
            <h6><FaClipboard /> Copiază:</h6>
            <div className="copy-buttons">
              <button onClick={() => finalCopyToClipboard(item.titlu)} className="copy-btn">
                <FaCopy /> Titlu
              </button>
              <button onClick={() => finalCopyToClipboard(item.comunicat)} className="copy-btn">
                <FaCopy /> Conținut
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        {!isSelectMode && ( // Ascunde butonul de ștergere individuală în modul selecție
          <button 
            className="delete-btn"
            onClick={() => handleDeleteClick(item)}
            title="Șterge document"
          >
            <FaTrashAlt /> Șterge Document
          </button>
        )}
      </div>
    </div>
  ));

  return (
    <>
      <div className="bicp-cards-container">
        {cardContent}
      </div>

      {showModal && (
        <DeleteDialog
          handleConfirmDelete={handleConfirmDelete}
          handleCloseModal={handleCloseModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default TableData;
