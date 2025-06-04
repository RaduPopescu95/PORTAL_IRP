"use client";

import { useState } from "react";
import DeleteDialog from "@/components/common/dialogs/DeleteDialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import { deleteFirestoreItem } from "@/utils/firestoreUtils";

const TableData = ({ oferte, an, onRefresh }) => {
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
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      console.log("Deleting accreditation item with ID:", selectedItem.id);

      // Șterge documentul din colecția Acreditari
      await deleteFirestoreItem("Acreditari", selectedItem.id);

      setShowModal(false);
      
      // Reîmprospătează lista
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting accreditation item:", error);
      alert("Eroare la ștergerea acreditării!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!oferte || oferte.length === 0) {
    return <p>Nu există acreditari pentru anul {an}.</p>;
  }

  const theadContent = isMobile
    ? ["Număr", "Data", "Linkuri"]
    : ["Număr", "Data", "Titlu", "Linkuri", "Copiază conținut", "Șterge"];

  const tbodyContent = oferte.map((item) => (
    <tr key={item.id}>
      {/* Număr */}
      <td>{item.numar}</td>

      {/* Data */}
      <td>{item.data}</td>

      {/* Titlu (doar pe desktop) */}
      {!isMobile && (
        <td>
          {item.links.map((link, index) => (
            <div key={index}>
              <strong>{link.title}</strong>
            </div>
          ))}
        </td>
      )}

      {/* Linkuri */}
      <td>
        {item.links.map((link, index) => (
          <div key={index} style={{ marginBottom: "5px" }}>
            {/* Link pentru descărcare Word */}
            <a href={link.wordLink} target="_blank" rel="noopener noreferrer">
              📄 {link.title} (Word)
            </a>

            {/* Link pentru descărcare PDF, doar dacă există */}
            {link.pdfLink && (
              <div>
                <a
                  href={link.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {link.title} (PDF)
                </a>
              </div>
            )}
          </div>
        ))}
      </td>

      {/* Copiere conținut */}
      {!isMobile && (
        <td>
          <ul>
            <li>
              <button onClick={() => copyToClipboard(item.numar)}>
                Copiază număr
              </button>
            </li>
            <li>
              <button onClick={() => copyToClipboard(item.data)}>
                Copiază data
              </button>
            </li>
          </ul>
        </td>
      )}

      {/* Buton de ștergere */}
      {!isMobile && (
        <td>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteClick(item)}
            title="Șterge acreditare"
          >
            🗑️ Șterge
          </button>
        </td>
      )}
    </tr>
  ));

  return (
    <>
      <table className="table">
        <thead className="thead-light">
          <tr>
            {theadContent.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
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

// "use client";

// import { useState } from "react";
// import DeleteDialog from "@/components/common/dialogs/DeleteDialog";
// import { useIsMobile } from "@/hooks/useIsMobile";

// const TableData = ({ oferte, an }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const isMobile = useIsMobile();

//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       alert("Textul a fost copiat: " + text);
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//     }
//   };

//   const handleDeleteClick = (item) => {
//     setSelectedItem(item); // Salvează elementul selectat
//     setShowModal(true); // Afișează modalul
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleConfirmDelete = async () => {
//     setIsLoading(true);
//     try {
//       // Logica pentru ștergerea unui document din Firestore, dacă este cazul
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!oferte || oferte.length === 0) {
//     return <p>Nu există acreditari pentru anul {an}.</p>;
//   }

//   const theadContent = isMobile
//     ? ["Număr", "Data", "Linkuri"]
//     : ["Număr", "Data", "Titlu", "Linkuri", "Copiază conținut"];

//   const tbodyContent = oferte.map((item) => (
//     <tr key={item.id}>
//       {/* Număr */}
//       <td>{item.numar}</td>

//       {/* Data */}
//       <td>{item.data}</td>

//       {/* Titlu (doar pe desktop) */}
//       {!isMobile && (
//         <td>
//           {item.links.map((link, index) => (
//             <div key={index}>
//               <strong>{link.title}</strong>
//             </div>
//           ))}
//         </td>
//       )}

//       {/* Linkuri */}
//       <td>
//         {item.links.map((link, index) => (
//           <div key={index}>
//             <a href={link.wordLink} target="_blank" rel="noopener noreferrer">
//               {link.title}
//             </a>
//           </div>
//         ))}
//       </td>

//       {/* Copiere conținut */}
//       {!isMobile && (
//         <td>
//           <ul>
//             <li>
//               <button onClick={() => copyToClipboard(item.numar)}>
//                 Copiază număr
//               </button>
//             </li>
//             <li>
//               <button onClick={() => copyToClipboard(item.data)}>
//                 Copiază data
//               </button>
//             </li>
//           </ul>
//         </td>
//       )}
//     </tr>
//   ));

//   return (
//     <>
//       <table className="table">
//         <thead className="thead-light">
//           <tr>
//             {theadContent.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>{tbodyContent}</tbody>
//       </table>

//       {showModal && (
//         <DeleteDialog
//           handleConfirmDelete={handleConfirmDelete}
//           handleCloseModal={handleCloseModal}
//           isLoading={isLoading}
//         />
//       )}
//     </>
//   );
// };

// export default TableData;
