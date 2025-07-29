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

const TableData = ({ oferte, onRefresh }) => {
  console.log("TableData oferte:", oferte); // Check what is received exactly

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isMobile = useIsMobile();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Textul a fost copiat: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item); // Salvează ID-ul elementului selectat
    setShowModal(true); // Afișează modalul
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logica de ștergere a elementului din Firestore
  const handleConfirmDelete = async () => {
    setIsLoading(true);

    try {
      console.log("Deleting BICP item with ID:", selectedItem.id);

      // Șterge documentul din colecția Comunicate
      await deleteFirestoreItem("Comunicate", selectedItem.id);

      setShowModal(false); // Închide modalul după ștergere
      
      // Reîmprospătează lista
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting BICP item:", error);
      alert("Eroare la ștergerea documentului!");
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
    <div key={item.id} className="bicp-card">
      <div className="card-header">
        <div className="document-type">
          <span className="type-badge">{item.numeAfisare}</span>
        </div>
        <div className="document-number">
          <span className="number-text">#{item.numar}</span>
          <span className="date-text">{item.data}</span>
        </div>
      </div>
      
      <div className="card-body">
        <h4 className="document-title">{item.numar}-{item.numeAfisare}-{item.titlu}</h4>
        
        <div className="card-actions">
          <div className="download-section">
            <h6><FaDownload /> Descarcă:</h6>
            <div className="action-buttons">
              <a href={item.wordLink} target="_blank" rel="noopener noreferrer" className="download-btn word-btn">
                <FaFileWord /> WORD
              </a>
              <a href={item.pdfLink} target="_blank" rel="noopener noreferrer" className="download-btn pdf-btn">
                <FaFilePdf /> PDF
              </a>
            </div>
          </div>
          
          <div className="copy-section">
            <h6><FaClipboard /> Copiază:</h6>
            <div className="copy-buttons">
              <button onClick={() => copyToClipboard(item.titlu)} className="copy-btn">
                <FaCopy /> Titlu
              </button>
              <button onClick={() => copyToClipboard(item.comunicat)} className="copy-btn">
                <FaCopy /> Conținut
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <button 
          className="delete-btn"
          onClick={() => handleDeleteClick(item)}
          title="Șterge document"
        >
          <FaTrashAlt /> Șterge Document
        </button>
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
