"use client";
import { authentication, db, FORCE_SERVER_OPTIONS } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import MyProperties from "@/components/dashboard/my-properties";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useFirestoreData } from "@/hooks/useFirestoreData";

export default function ListaBICP() {
  const {
    data,
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
  } = useFirestoreData({
    collectionName: "Comunicate",
    searchFields: ["titlu", "numar", "data", "semnatar"],
    itemsPerPage: 10,
    sortBy: "numar",
    sortOrder: "desc",
  });

  return (
    <ProtectedRoute>
      <MyProperties
        data={data}
        loading={loading}
        error={error}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        filters={filters}
        handleSearch={handleSearch}
        handleFilterChange={handleFilterChange}
        handlePageChange={handlePageChange}
        deleteItem={deleteItem}
        deleteMultipleItems={deleteMultipleItems}
        handleTestJournal={handleTestJournal}
        copyToClipboard={copyToClipboard}
      />
    </ProtectedRoute>
  );
}
