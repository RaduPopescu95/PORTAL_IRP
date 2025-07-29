"use client";

import { useState, useEffect } from "react";

// Hook personalizat pentru gestionarea datelor în tabele cu paginare și căutare
export function useDataWithPaginationAndSearch(
  data,
  searchField,
  itemsPerPage = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Verifică dacă data este un array valid
    if (!Array.isArray(data)) {
      console.warn("useDataWithPaginationAndSearch: data is not an array", data);
      setCurrentData([]);
      setTotalPages(0);
      return;
    }

    // Aplică filtrarea folosind câmpul specificat
    const filteredData = data.filter((item) => {
      // Verifică dacă item și searchField există
      if (!item || typeof item !== 'object' || !item[searchField]) {
        return false;
      }
      
      // Convertește la string pentru a evita errori
      const itemValue = String(item[searchField]).toLowerCase();
      const searchValue = String(searchTerm).toLowerCase();
      
      return itemValue.includes(searchValue);
    });

    // Calculează totalul de pagini
    const newTotalPages = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(newTotalPages);

    // Resetează la pagina 1 dacă pagina curentă este mai mare decât totalul
    const validCurrentPage = currentPage > newTotalPages ? 1 : currentPage;
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }

    // Setează datele curente pentru pagina activă
    const indexOfLastItem = validCurrentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentData(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [data, currentPage, itemsPerPage, searchTerm, searchField]);

  // Resetează la pagina 1 când se schimbă termenul de căutare
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm,
    currentPage,
  };
}
