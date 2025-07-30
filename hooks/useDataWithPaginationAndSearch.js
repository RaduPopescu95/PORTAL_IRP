"use client";

import { useState, useEffect, useMemo } from "react";

// Hook personalizat pentru gestionarea datelor în tabele cu paginare și căutare
export function useDataWithPaginationAndSearch(
  data,
  searchField,
  itemsPerPage = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Resetează la pagina 1 când se schimbă termenul de căutare
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculează datele filtrate folosind useMemo pentru performance
  const filteredData = useMemo(() => {
    // Verifică dacă data este un array valid
    if (!Array.isArray(data)) {
      console.warn("useDataWithPaginationAndSearch: data is not an array", data);
      return [];
    }

    // Aplică filtrarea folosind câmpul specificat
    return data.filter((item) => {
      // Verifică dacă item și searchField există
      if (!item || typeof item !== 'object' || !item[searchField]) {
        return false;
      }
      
      // Convertește la string pentru a evita errori
      const itemValue = String(item[searchField]).toLowerCase();
      const searchValue = String(searchTerm).toLowerCase();
      
      return itemValue.includes(searchValue);
    });
  }, [data, searchField, searchTerm]);

  // Calculează totalul de pagini
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData.length, itemsPerPage]);

  // Validează și ajustează currentPage dacă e necesar
  const validCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    if (currentPage > totalPages) return 1;
    return currentPage;
  }, [currentPage, totalPages]);

  // Calculează datele pentru pagina curentă
  const currentData = useMemo(() => {
    const indexOfLastItem = validCurrentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, validCurrentPage, itemsPerPage]);

  // Actualizează currentPage doar dacă e diferit de validCurrentPage
  useEffect(() => {
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
  }, [validCurrentPage, currentPage]);

  return {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm,
    currentPage: validCurrentPage,
  };
}
