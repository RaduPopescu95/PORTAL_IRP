"use client";

import { useState, useEffect } from "react";

// Hook personalizat pentru gestionarea datelor în tabele cu paginare și căutare
export function useDataWithPaginationAndSearchAcreditari(
  data,
  searchField,
  itemsPerPage = 6
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) {
      setCurrentData([]);
      setTotalPages(0);
      return;
    }

    // Aplică filtrarea folosind câmpul specificat
    const filteredData = data.filter((item) => {
      const searchInField = (field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLinks = item.links?.some((link) =>
        searchInField(link.title)
      );

      return (
        searchInField(item[searchField] || "") || // Filtrare pe câmpul principal
        searchInField(item.numar || "") || // Filtrare pe câmpul `numar`
        searchInField(item.data || "") || // Filtrare pe câmpul `data`
        matchesLinks // Filtrare pe titlurile din `links`
      );
    });

    // Calculează totalul de pagini
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));

    // Setează datele curente pentru pagina activă
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentData(filteredData.slice(indexOfFirstItem, indexOfLastItem));
  }, [data, currentPage, itemsPerPage, searchTerm, searchField]);

  return {
    currentData,
    setCurrentPage,
    totalPages,
    setSearchTerm,
    currentPage,
  };
}
