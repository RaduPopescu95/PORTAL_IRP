import Wrapper from "@/components/layout/Wrapper";
import HomeMain from "./(homes)/home-4/page";
import ListaBICP from "./(admin-irp)/lista-BICP/page";
import { AuthProvider } from "@/context/AuthContext";
import MapContainer from "./(admin-irp)/harta/page";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// export const metadata = {
//   title: "ExclusivMD - Oferte Exclusive pentru cadre medicale",
//   description:
//     "Descoperă cele mai bune oferte și beneficii de la hoteluri, restaurante și alți parteneri economici dedicate exclusiv cadrelor medicale. Accesează acum portalul ExclusivMD pentru avantaje unice!",
// };

export default function Home() {
  return (
    <Wrapper>
      <ProtectedRoute>
        <ListaBICP />
      </ProtectedRoute>
      {/* <MapContainer/> */}
    </Wrapper>
  );
}
