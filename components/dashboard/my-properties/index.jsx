"use client";

import TopNavbar from "../../common/header/dashboard/TopNavbar";
import Filtering from "./Filtering";
import Pagination from "./Pagination";
import TableData from "./TableData";
import TableView from "./TableView";
import SearchBox from "./SearchBox";
import { handleGetFirestore } from "@/utils/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import CacheBuster from "@/components/common/CacheBuster";
import "../../modern-dashboard.css";


import { db } from "@/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  endAt,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useCollectionPagination } from "@/hooks/useCollectionPagination";
import { useDataWithPaginationAndSearch } from "@/hooks/useDataWithPaginationAndSearch";
import { FaRedoAlt, FaTh, FaTable, FaMobile, FaDesktop } from 'react-icons/fa';

const index = ({ oferte, an }) => {
  console.log("oferte....", oferte);
  const [originalData, setOriginalData] = useState(oferte || []);
  const [filteredData, setFilteredData] = useState(oferte || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState({});
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [viewMode, setViewMode] = useState(() => {
    // Încarcă preferința din localStorage sau defaultează la "cards"
    if (typeof window !== "undefined") {
      return localStorage.getItem("bicpViewMode") || "cards";
    }
    return "cards";
  }); // "cards" sau "table"

  // Salvează preferința în localStorage când se schimbă view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bicpViewMode", viewMode);
    }
  }, [viewMode]);

  const {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm: setPaginationSearchTerm,
    currentPage,
  } = useDataWithPaginationAndSearch(filteredData, "titlu");

  // Funcție pentru copierea textului în clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Textul a fost copiat: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Funcție pentru descărcarea documentelor
  const handleTestJournal = (itemId, format) => {
    const item = currentData.find(item => item.id === itemId);
    if (item) {
      if (format === "DOCX" && item.wordLink) {
        window.open(item.wordLink, '_blank');
      } else if (format === "PDF" && item.pdfLink) {
        window.open(item.pdfLink, '_blank');
      } else {
        alert(`Link-ul pentru ${format} nu este disponibil.`);
      }
    }
  };

  // Funcție pentru ștergerea documentelor
  const deleteItem = async (itemId) => {
    if (window.confirm("Sigur doriți să ștergeți acest document?")) {
      try {
        console.log("Deleting BICP item with ID:", itemId);
        
        const { deleteFirestoreItem } = await import("@/utils/firestoreUtils");
        await deleteFirestoreItem("Comunicate", itemId);
        
        // Actualizează datele după ștergere
        handleRefresh();
      } catch (error) {
        console.error("Error deleting BICP item:", error);
        alert("Eroare la ștergerea documentului!");
      }
    }
  };

  // Funcție pentru refresh forțat fără cache
  const forceRefresh = () => {
    setLastRefresh(Date.now());
    // Force page reload to get fresh data from server
    window.location.reload();
  };

  // Funcție pentru aplicarea filtrelor
  const applyFilters = (data, filters, search) => {
    let filtered = [...data];

    // Aplicare search
    if (search) {
      filtered = filtered.filter(item => 
        item.titlu?.toLowerCase().includes(search.toLowerCase()) ||
        item.comunicat?.toLowerCase().includes(search.toLowerCase()) ||
        item.numeAfisare?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicare filtru tip document
    if (filters.tipDocument) {
      filtered = filtered.filter(item => item.nume === filters.tipDocument);
    }

    // Aplicare filtru semnatar
    if (filters.semnatar) {
      filtered = filtered.filter(item => item.numeSemnatar === filters.semnatar);
    }

    // Aplicare filtru data start
    if (filters.dataStart) {
      filtered = filtered.filter(item => {
        const itemDate = convertDateFormat(item.data);
        return itemDate >= filters.dataStart;
      });
    }

    // Aplicare filtru data end
    if (filters.dataEnd) {
      filtered = filtered.filter(item => {
        const itemDate = convertDateFormat(item.data);
        return itemDate <= filters.dataEnd;
      });
    }

    // Aplicare filtru număr minim
    if (filters.numarMin) {
      filtered = filtered.filter(item => 
        Number(item.numar) >= Number(filters.numarMin)
      );
    }

    // Aplicare filtru număr maxim
    if (filters.numarMax) {
      filtered = filtered.filter(item => 
        Number(item.numar) <= Number(filters.numarMax)
      );
    }

    // Aplicare sortare
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (filters.sortBy) {
          case 'data':
            aVal = convertDateFormat(a.data);
            bVal = convertDateFormat(b.data);
            break;
          case 'numar':
            aVal = Number(a.numar) || 0;
            bVal = Number(b.numar) || 0;
            break;
          case 'numarComunicat':
            aVal = Number(a.numarComunicat) || 0;
            bVal = Number(b.numarComunicat) || 0;
            break;
          case 'titlu':
            aVal = a.titlu?.toLowerCase() || '';
            bVal = b.titlu?.toLowerCase() || '';
            break;
          case 'nume':
            aVal = a.nume?.toLowerCase() || '';
            bVal = b.nume?.toLowerCase() || '';
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  };

  // Funcție pentru convertirea datei din formatul "dd/mm/yyyy" în "yyyy-mm-dd"
  const convertDateFormat = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Effect pentru aplicarea filtrelor când se schimbă filtrele sau search-ul
  useEffect(() => {
    const filtered = applyFilters(originalData, currentFilters, searchTerm);
    setFilteredData(filtered);
    setPaginationSearchTerm(''); // Reset pagination search when filters change
    setCurrentPage(1); // Reset to first page
  }, [originalData, currentFilters, searchTerm]);

  // Handler pentru schimbarea filtrelor
  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
  };

  // Handler pentru search
  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  return (
    <>
      {/* <CacheBuster /> */}
      {/* Top Navigation */}
              {/* Top & Bottom Navigation */}
        <TopNavbar />

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f7 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">{/* End Dashboard Navigation */}

                <div className="col-lg-12 mb10">
                  <div className="breadcrumb_content style2 mb30-991">
                    <h2 className="breadcrumb_title">Lista BI/CP {an}</h2>
                    <p>Total: {filteredData.length} documente</p>
                    <button 
                      onClick={forceRefresh}
                      className="btn btn-sm btn-outline-primary mt-2"
                      title="Reîmprospătează datele"
                    >
                      <FaRedoAlt /> Actualizează
                    </button>
                  </div>
                </div>
                {/* End .col */}



                {/* Filtering Section */}
                <div className="col-lg-12 mb-4">
                  <Filtering onFilterChange={handleFilterChange} />
                </div>
                {/* End Filtering */}

                {/* Search Section */}
                <div className="col-lg-12 mb-4">
                  <SearchBox onSearch={handleSearchChange} />
                </div>
                {/* End Search */}

                {/* View Mode Toggle */}
                <div className="col-lg-12 mb-4">
                  <div className="view-toggle-container">
                    <div className="view-toggle-wrapper">
                      <span className="toggle-label">Mod afișare:</span>
                      <div className="view-toggle-buttons">
                        <button
                          className={`view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                          onClick={() => setViewMode("cards")}
                          title="Afișare Cards (optimizat mobile)"
                        >
                          <FaTh /> Cards
                        </button>
                        <button
                          className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
                          onClick={() => setViewMode("table")}
                          title="Afișare Tabel (desktop)"
                        >
                          <FaTable /> Tabel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End View Mode Toggle */}

                <div className="col-lg-12">
                  {viewMode === "cards" ? (
                    <div className="cards-container">
                      <TableData oferte={currentData} an={an} />
                    </div>
                  ) : (
                    <div className="my_dashboard_review mb40">
                      <div className="property_table">
                        <div className="table-responsive mt0">
                          <TableView 
                            oferte={currentData}
                            handleTestJournal={handleTestJournal}
                            deleteItem={deleteItem}
                            copyToClipboard={copyToClipboard}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pagination-container">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </div>
                {/* End .col */}
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
