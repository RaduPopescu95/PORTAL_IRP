"use client";
import CreateListing from "@/components/dashboard/creaza-oferta";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// export const metadata = {
//   title: "Creaza discount || ExclusivMD",
//   description: "nume portal",
// };

const index = () => {
  return (
    <ProtectedRoute>
      <CreateListing />
    </ProtectedRoute>
  );
};

export default index;
