"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const useFirestoreData = ({
  collectionName,
  searchFields = [],
  itemsPerPage = 10,
  sortBy = "numar",
  sortOrder = "desc",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [allData, setAllData] = useState([]); // Store all data for client-side filtering

  // Fetch data from Firestore
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const collectionRef = collection(db, collectionName);
      // Nu mai aplicăm sortarea în Firestore - o vom face client-side pentru sortare numerică corectă
      const dataQuery = query(collectionRef);

      const snapshot = await getDocs(dataQuery);
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllData(fetchedData);
    } catch (err) {
      console.error("Error fetching Firestore data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]); // Eliminat sortBy și sortOrder din dependencies

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate filtered and sorted data using useMemo to prevent infinite loops
  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(allData) || allData.length === 0) {
      return [];
    }

    let filteredData = [...allData];

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      filteredData = filteredData.filter((item) =>
        searchFields.some((field) => {
          const fieldValue = item[field];
          if (fieldValue != null) {
            return String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );
    }

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value && value !== "" && value !== "toate" && value !== "toti") {
        switch (key) {
          case "tipDocument":
            filteredData = filteredData.filter((item) => item.numeAfisare === value);
            break;
          case "semnatar":
            filteredData = filteredData.filter((item) => item.semnatar === value);
            break;
          case "dataInceput":
          case "dataStart":
            if (value) {
              filteredData = filteredData.filter((item) => {
                if (!item.data) return false;
                try {
                  const itemDate = new Date(item.data.split('/').reverse().join('-'));
                  const filterDate = new Date(value);
                  return itemDate >= filterDate;
                } catch {
                  return false;
                }
              });
            }
            break;
          case "dataSfarsit":
          case "dataEnd":
            if (value) {
              filteredData = filteredData.filter((item) => {
                if (!item.data) return false;
                try {
                  const itemDate = new Date(item.data.split('/').reverse().join('-'));
                  const filterDate = new Date(value);
                  return itemDate <= filterDate;
                } catch {
                  return false;
                }
              });
            }
            break;
          case "numarMin":
            if (value) {
              const numValue = Number(value);
              filteredData = filteredData.filter((item) => {
                const itemNum = Number(item.numar);
                return itemNum >= numValue;
              });
            }
            break;
          case "numarMax":
            if (value) {
              const numValue = Number(value);
              filteredData = filteredData.filter((item) => {
                const itemNum = Number(item.numar);
                return itemNum <= numValue;
              });
            }
            break;
        }
      }
    });

    // Apply sorting - ÎNTOTDEAUNA client-side pentru sortare corectă (numerică pentru "numar")
    const sortField = filters.sortBy || sortBy;
    const sortDirection = filters.sortOrder || sortOrder;
    
    filteredData.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortField) {
        case "data":
          aVal = a.data ? new Date(a.data.split('/').reverse().join('-')) : new Date(0);
          bVal = b.data ? new Date(b.data.split('/').reverse().join('-')) : new Date(0);
          break;
        case "numar":
          aVal = Number(a.numar) || 0;
          bVal = Number(b.numar) || 0;
          break;
        case "titlu":
          aVal = (a.titlu || "").toLowerCase();
          bVal = (b.titlu || "").toLowerCase();
          break;
        default:
          return 0;
      }

      const order = sortDirection === "asc" ? 1 : -1;
      if (aVal > bVal) return order;
      if (aVal < bVal) return -order;
      return 0;
    });

    return filteredData;
  }, [allData, searchTerm, filters, sortBy, searchFields]);

  // Calculate paginated data using useMemo
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  // Calculate totalItems directly from filtered data
  const totalItems = filteredAndSortedData.length;
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 when search or filters change (using useEffect without setState conflicts)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, JSON.stringify(filters)]);

  // Handle search
  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }, [totalPages]);

  // Delete item
  const deleteItem = useCallback(async (itemId) => {
    if (window.confirm("Sigur doriți să ștergeți acest document?")) {
      try {
        await deleteDoc(doc(db, collectionName, itemId));
        // Refresh data after deletion
        await fetchData();
        alert("Document șters cu succes!");
      } catch (err) {
        console.error("Error deleting document:", err);
        alert("Eroare la ștergerea documentului!");
      }
    }
  }, [collectionName, fetchData]);

  // Delete multiple items
  const deleteMultipleItems = useCallback(async (itemIds) => {
    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return;
    }

    try {
      // Ștergere în paralel pentru performanță
      const deletePromises = itemIds.map(itemId => 
        deleteDoc(doc(db, collectionName, itemId))
      );
      
      await Promise.all(deletePromises);
      
      // Refresh data after deletion
      await fetchData();
      
      return true; // Succes
    } catch (err) {
      console.error("Error deleting multiple documents:", err);
      throw err; // Re-throw pentru gestionare upstream
    }
  }, [collectionName, fetchData]);

  // Handle test journal (document download)
  const handleTestJournal = useCallback((itemId, format) => {
    const item = allData.find((item) => item.id === itemId);
    if (item) {
      if (format === "DOCX" && item.wordLink) {
        window.open(item.wordLink, "_blank");
      } else if (format === "PDF" && item.pdfLink) {
        window.open(item.pdfLink, "_blank");
      } else {
        alert(`Link-ul pentru ${format} nu este disponibil.`);
      }
    }
  }, [allData]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Textul a fost copiat: " + text);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Eroare la copierea textului.");
    }
  }, []);

  return {
    data: paginatedData,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    searchTerm,
    filters,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    deleteItem,
    deleteMultipleItems,
    handleTestJournal,
    copyToClipboard,
    refetch: fetchData,
  };
}; 