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
import { useEffect, useState, useMemo } from "react";
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
import { FaRedoAlt, FaTh, FaTable, FaMobile, FaDesktop, FaTrashAlt, FaCheckSquare, FaSquare } from 'react-icons/fa';

const index = ({ 
  // Props noi din hook-ul de Firestore
  data = [],
  loading = false,
  error = null,
  totalItems = 0,
  totalPages = 0,
  currentPage = 1,
  itemsPerPage = 10,
  searchTerm = "",
  filters = {},
  handleSearch,
  handleFilterChange,
  handlePageChange,
  deleteItem,
  deleteMultipleItems,
  handleTestJournal,
  copyToClipboard,
  // Props vechi pentru compatibilitate
  oferte = [],
  an = "2025"
}) => {
  // Memoizez isNewDataSystem pentru a evita re-render infinit
  const isNewDataSystem = useMemo(() => {
    return typeof handleSearch === 'function' && typeof handleFilterChange === 'function';
  }, [handleSearch, handleFilterChange]);
  
  const dataSource = isNewDataSystem ? data : oferte;
  
  const [originalData, setOriginalData] = useState(dataSource || []);
  const [filteredData, setFilteredData] = useState(dataSource || []);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [currentFilters, setCurrentFilters] = useState(filters || {});
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [viewMode, setViewMode] = useState(() => {
    // Încarcă preferința din localStorage sau defaultează la "cards"
    if (typeof window !== "undefined") {
      return localStorage.getItem("bicpViewMode") || "cards";
    }
    return "cards";
  }); // "cards" sau "table"

  // Stare pentru selecția multiplă
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Funcții pentru selecția multiplă
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedItems(new Set()); // Curăță selecția când ieși din modul selecție
    }
  };

  const toggleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    const allIds = new Set(finalCurrentData.map(item => item.id));
    setSelectedItems(allIds);
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.size === 0) {
      alert("Nu sunt elemente selectate pentru ștergere.");
      return;
    }

    if (!window.confirm(`Sigur doriți să ștergeți ${selectedItems.size} documente selectate?`)) {
      return;
    }

    try {
      if (deleteMultipleItems) {
        // Folosește funcția optimizată din hook
        await deleteMultipleItems(Array.from(selectedItems));
      } else {
        // Fallback pentru sistemul vechi
        const deletePromises = Array.from(selectedItems).map(itemId => 
          finalDeleteItem ? finalDeleteItem(itemId) : Promise.resolve()
        );
        await Promise.all(deletePromises);
      }
      
      setSelectedItems(new Set());
      setIsSelectMode(false);
      alert(`${selectedItems.size} documente au fost șterse cu succes!`);
    } catch (error) {
      console.error("Error deleting multiple items:", error);
      alert("Eroare la ștergerea documentelor. Verificați consola pentru detalii.");
    }
  };

  // Salvează preferința în localStorage când se schimbă view mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bicpViewMode", viewMode);
    }
  }, [viewMode]);

  // Hook pentru paginația locală (folosit când nu avem sistemul nou)
  const {
    currentData,
    setCurrentPage: setLocalCurrentPage,
    totalPages: localTotalPages,
    setSearchTerm: setPaginationSearchTerm,
    currentPage: localCurrentPage,
  } = useDataWithPaginationAndSearch(filteredData, "titlu");

  // Determină care paginație să folosim
  const finalCurrentData = isNewDataSystem ? data : currentData;
  const finalTotalPages = isNewDataSystem ? totalPages : localTotalPages;
  const finalCurrentPage = isNewDataSystem ? currentPage : localCurrentPage;
  const finalSetCurrentPage = isNewDataSystem ? handlePageChange : setLocalCurrentPage;

  // Funcție pentru copierea textului în clipboard (fallback dacă nu e pasată)
  const finalCopyToClipboard = copyToClipboard || (async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Textul a fost copiat: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

  // Funcție pentru descărcarea documentelor (fallback dacă nu e pasată)
  const finalHandleTestJournal = handleTestJournal || ((itemId, format) => {
    const item = finalCurrentData.find(item => item.id === itemId);
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

  // Funcție pentru ștergerea documentelor (fallback dacă nu e pasată)
  const finalDeleteItem = deleteItem || ((itemId) => {
    alert("Funcția de ștergere nu este disponibilă în modul actual.");
  });

  // Actualizează datele când se schimbă props-urile
  useEffect(() => {
    if (isNewDataSystem) {
      setOriginalData(data);
      setFilteredData(data);
    } else {
      setOriginalData(oferte || []);
      setFilteredData(oferte || []);
    }
  }, [data, oferte, isNewDataSystem]);

  // Gestionează căutarea
  const handleSearchChange = (newSearchTerm) => {
    setLocalSearchTerm(newSearchTerm);
    if (isNewDataSystem && handleSearch) {
      handleSearch(newSearchTerm);
    } else {
      setPaginationSearchTerm(newSearchTerm);
    }
  };

  // Gestionează filtrele
  const handleLocalFilterChange = (newFilters) => {
    setCurrentFilters(newFilters);
    if (isNewDataSystem && handleFilterChange) {
      handleFilterChange(newFilters);
    } else {
      // Aplică filtrele local pentru sistemul vechi
      applyFilters(newFilters);
    }
  };

  // Aplică filtrele pe datele locale (pentru sistemul vechi)
  const applyFilters = (filters) => {
    if (!originalData || !Array.isArray(originalData)) {
      setFilteredData([]);
      return;
    }

    let filtered = [...originalData];

    // Aplică filtrele unul câte unul
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value && value !== "") {
        switch (key) {
          case "tipDocument":
            if (value !== "toate") {
              filtered = filtered.filter(item => item.numeAfisare === value);
            }
            break;
          case "semnatar":
            if (value !== "toti") {
              filtered = filtered.filter(item => item.semnatar === value);
            }
            break;
          case "dataInceput":
          case "dataStart": // Compatibilitate cu numele din Filtering.jsx
            if (value) {
              filtered = filtered.filter(item => {
                const itemDate = new Date(item.data.split('/').reverse().join('-'));
                const filterDate = new Date(value);
                return itemDate >= filterDate;
              });
            }
            break;
          case "dataSfarsit":
          case "dataEnd": // Compatibilitate cu numele din Filtering.jsx
            if (value) {
              filtered = filtered.filter(item => {
                const itemDate = new Date(item.data.split('/').reverse().join('-'));
                const filterDate = new Date(value);
                return itemDate <= filterDate;
              });
            }
            break;
          case "numarMin":
            if (value) {
              filtered = filtered.filter(item => Number(item.numar) >= Number(value));
            }
            break;
          case "numarMax":
            if (value) {
              filtered = filtered.filter(item => Number(item.numar) <= Number(value));
            }
            break;
        }
      }
    });

    setFilteredData(filtered);
  };

  // Forțează reîmprospătarea datelor
  const forceRefresh = () => {
    setLastRefresh(Date.now());
  };

  // Afișează loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Se încarcă...</span>
        </div>
      </div>
    );
  }

  // Afișează eroarea
  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          Eroare la încărcarea datelor: {error.message || error}
        </div>
      </div>
    );
  }

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
                    <p>Total: {isNewDataSystem ? totalItems : filteredData.length} documente</p>
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
                  <Filtering onFilterChange={handleLocalFilterChange} />
                </div>
                {/* End Filtering */}

                {/* Search Section */}
                <div className="col-lg-12 mb-4">
                  <SearchBox onSearch={handleSearchChange} />
                </div>
                {/* End Search */}

                {/* View Mode Toggle */}
                <div className="col-lg-12 mb-3">
                  <div className="view-mode-toggle">
                    <div className="btn-group" role="group" aria-label="Mod de vizualizare">
                      <button
                        type="button"
                        className={`btn ${viewMode === "cards" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setViewMode("cards")}
                        title="Vizualizare carduri (Mobile friendly)"
                      >
                        <FaTh className="me-1" />
                        <FaMobile className="me-1" />
                        <span className="d-none d-sm-inline">Carduri</span>
                      </button>
                      <button
                        type="button"
                        className={`btn ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setViewMode("table")}
                        title="Vizualizare tabel (Desktop)"
                      >
                        <FaTable className="me-1" />
                        <FaDesktop className="me-1" />
                        <span className="d-none d-sm-inline">Tabel</span>
                      </button>
                    </div>
                    
                    {/* Selecție multiplă */}
                    <div className="btn-group ms-3" role="group" aria-label="Selecție multiplă">
                      <button
                        type="button"
                        className={`btn ${isSelectMode ? "btn-warning" : "btn-outline-secondary"}`}
                        onClick={toggleSelectMode}
                        title={isSelectMode ? "Ieși din modul selecție" : "Activează selecție multiplă"}
                      >
                        {isSelectMode ? <FaCheckSquare className="me-1" /> : <FaSquare className="me-1" />}
                        <span className="d-none d-sm-inline">
                          {isSelectMode ? "Selecție ON" : "Selecție OFF"}
                        </span>
                      </button>
                      
                      {isSelectMode && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-info"
                            onClick={selectedItems.size === finalCurrentData.length ? deselectAllItems : selectAllItems}
                            disabled={finalCurrentData.length === 0}
                            title={selectedItems.size === finalCurrentData.length ? "Deselectează toate din pagina curentă" : "Selectează toate din pagina curentă"}
                          >
                            {selectedItems.size === finalCurrentData.length ? "Deselect. pag." : "Select. pag."}
                          </button>
                          
                          {selectedItems.size > 0 && (
                            <span className="btn btn-outline-secondary" style={{cursor: 'default'}}>
                              {selectedItems.size} selectate
                              {selectedItems.size > finalCurrentData.length && 
                                ` (${selectedItems.size - finalCurrentData.length} din alte pagini)`
                              }
                            </span>
                          )}
                          
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={deleteSelectedItems}
                            disabled={selectedItems.size === 0}
                            title={`Șterge ${selectedItems.size} elemente selectate`}
                          >
                            <FaTrashAlt className="me-1" />
                            <span className="d-none d-sm-inline">
                              Șterge ({selectedItems.size})
                            </span>
                            <span className="d-sm-none">
                              {selectedItems.size}
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* End View Mode Toggle */}

                <div className="col-lg-12">
                  {viewMode === "cards" ? (
                    <div className="cards-container">
                      <TableData 
                        oferte={finalCurrentData} 
                        an={an}
                        handleTestJournal={finalHandleTestJournal}
                        deleteItem={finalDeleteItem}
                        copyToClipboard={finalCopyToClipboard}
                        isSelectMode={isSelectMode}
                        selectedItems={selectedItems}
                        onToggleSelect={toggleSelectItem}
                      />
                    </div>
                  ) : (
                    <div className="table-container">
                      <div className="table-responsive">
                        <TableView 
                          oferte={finalCurrentData}
                          handleTestJournal={finalHandleTestJournal}
                          deleteItem={finalDeleteItem}
                          copyToClipboard={finalCopyToClipboard}
                          isSelectMode={isSelectMode}
                          selectedItems={selectedItems}
                          onToggleSelect={toggleSelectItem}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pagination-container">
                        <Pagination
                          currentPage={finalCurrentPage}
                          totalPages={finalTotalPages}
                          setCurrentPage={finalSetCurrentPage}
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
