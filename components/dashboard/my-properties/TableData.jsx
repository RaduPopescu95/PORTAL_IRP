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
    return <p>Nu exista comunicate.</p>; // Show a message if no data
  }

  let theadConent = [];

  if (isMobile) {
    theadConent = ["Nume", "Actiune"];
  } else {
    theadConent = [
      "Nume",
      "Titlu",
      "Numar",
      "Data",
      "Actiune",
      "Copiaza continut",
      "Șterge",
    ];
  }

  let tbodyContent = oferte?.map((item) => (
    <tr key={item.id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details d-flex justify-content-center">
            <div className="tc_content d-flex align-items-center justify-content-center">
              <h4>{item.numeAfisare}</h4>
            </div>
          </div>
        </div>
      </td>
      {/* End td */}

      {!isMobile && <td>{item.titlu}</td>}
      {/* End td */}

      {!isMobile && <td>{item.numar}</td>}

      {/* End td */}

      {!isMobile && <td>{item.data}</td>}

      {/* End td */}

      <td>
        <ul className="">
          <li title="Download Word">
            <a href={item.wordLink} target="_blank" rel="noopener noreferrer">WORD</a>
          </li>
          <li title="Download PDF">
            <a href={item.pdfLink} target="_blank" rel="noopener noreferrer">PDF</a>
          </li>
        </ul>
      </td>
      {/* End td */}
      
      {!isMobile && (
        <td>
          <ul className="">
            <li title="Copy Title">
              <button onClick={() => copyToClipboard(item.titlu)}>
                Copiaza titlu
              </button>
            </li>
            <li title="Copy Content">
              <button onClick={() => copyToClipboard(item.comunicat)}>
                Copiaza continut
              </button>
            </li>
          </ul>
        </td>
      )}
      {/* End td */}

      {!isMobile && (
        <td>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteClick(item)}
            title="Șterge document"
          >
            🗑️ Șterge
          </button>
        </td>
      )}
      {/* End td */}
    </tr>
  ));

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadConent.map((value, i) => (
              <th scope="col" key={i}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        {/* End theaad */}

        <tbody>{tbodyContent}</tbody>
      </table>

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
