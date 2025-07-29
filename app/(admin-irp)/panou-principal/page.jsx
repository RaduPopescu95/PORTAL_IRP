"use client";
import MyDashboard from "@/components/dashboard/my-dashboard";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// export const metadata = {
//   title: "Dashboard || ExclusivMD",
//   description: "Nume Portal",
// };

const index = () => {
  return (
    <ProtectedRoute>
      <MyDashboard />
    </ProtectedRoute>
  );
};

export default index;
