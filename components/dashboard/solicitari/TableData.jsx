import Image from "next/image";
import properties from "../../../data/properties";
import { useState } from "react";
import oferte from "@/data/oferte";
import GradeFidelitate from "./GradeFidelitate";
import Link from "next/link";
import {
  handleDeleteFirestoreSubcollectionData,
  handleUpdateFirestoreSubcollection,
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

const TableData = ({ oferte }) => {
  console.log("TableData oferte:", oferte); // Check what is received exactly

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const isMobile = useIsMobile();

  const handleDeleteClick = (item) => {
    setSelectedItem(item); // Salvează ID-ul elementului selectat
    setShowModal(true); // Afișează modalul
  };

  // Închide modalul fără a șterge
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Logica de ștergere a elementului

  const handleConfirmDelete = async () => {
    setIsLoading(true);

    try {
      console.log("Deleting item with ID:", selectedItem);

      await handleDeleteFirestoreSubcollectionData(
        `Users/${selectedItem.collectionId}/Oferte/${selectedItem.documentId}`,
        true,
        `Users/${selectedItem.collectionId}/Oferte`,
        selectedItem
      );

      if (selectedItem.imagineOferta) {
        await deleteImage("PozeOferte", selectedItem.imagineOferta.fileName);
      }

      // Aici adaugi logica pentru a șterge elementul din sursa ta de date
      setShowModal(false); // Închide modalul după ștergere

      // Dacă dorești să aștepți până când router-ul se reîmprospătează înainte de a seta loading-ul la false
    } catch (error) {
      console.error("Error deleting item:", error);
      // Aici poți adăuga logica de afișare a unui mesaj de eroare pentru utilizator, dacă este cazul
    } finally {
      window.location.reload();
      setIsLoading(false); // Setează isLoading la false indiferent dacă ștergerea a reușit sau a eșuat
    }
  };

  const isSameOrAfter = (date1, date2) => {
    return date1.setHours(0, 0, 0, 0) >= date2.setHours(0, 0, 0, 0);
  };

  const isSameOrBefore = (date1, date2) => {
    return date1.setHours(0, 0, 0, 0) <= date2.setHours(0, 0, 0, 0);
  };

  if (!oferte || oferte.length === 0) {
    return <p>Nu exista solicitari.</p>; // Show a message if no data
  }

  let theadConent = [];

  if (isMobile) {
    theadConent = ["Cine Solicita", "Ce solicita"];
  } else {
    theadConent = ["Cine Solicita", "Ce solicita", "Data"];
  }

  let tbodyContent = oferte?.map((item) => (
    <tr key={item.id}>
      <td scope="row">
        <div className="feat_property list favorite_page style2">
          <div className="details d-flex justify-content-center">
            <div className="tc_content d-flex align-items-center justify-content-center">
              <h4>{item.titlu}</h4>
            </div>
          </div>
        </div>
      </td>
      {/* End td */}

      {!isMobile && <td>{item.comunicat}</td>}
      {/* End td */}
      {!isMobile && <td>{item.data}</td>}

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
