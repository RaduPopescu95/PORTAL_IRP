import dynamic from "next/dynamic";
import MyProperties from "@/components/dashboard/my-properties-acreditari";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const metadata = {
  title: "Portal IRP - Lista Acreditări",
  description: "Lista Acreditărilor de presă",
};

const fetchItems = async () => {
  try {
    console.log("Fetching Acreditari items from Firestore...");
    const collectionPath = "Acreditari";
    const ref = collection(db, collectionPath);

    // Interogare pentru ordonare descrescătoare după "numar"
    const pageQuery = query(ref, orderBy("numar", "desc"));

    // Force fresh data from server, bypass cache
    const documentSnapshots = await getDocs(pageQuery, { source: 'server' });
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Fetched ${newItems.length} Acreditari items`);
    
    if (newItems.length === 0) {
      console.log("No Acreditari items found");
      return {};
    }

    // Grupare pe ani cu handling mai sigur
    const groupedByYear = newItems.reduce((acc, item) => {
      // Verifică dacă item.data există și are formatul corect
      if (item.data && typeof item.data === 'string' && item.data.includes('/')) {
        const dateParts = item.data.split("/");
        if (dateParts.length >= 3) {
          const year = dateParts[2]; // Extrage anul din "data"
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(item);
        }
      } else {
        console.warn("Acreditare item with invalid date format:", item);
      }
      return acc;
    }, {});

    Object.keys(groupedByYear).forEach(year => {
      console.log(`Year ${year}: ${groupedByYear[year]?.length} acreditari`);
    });

    return groupedByYear;
  } catch (e) {
    console.error("Error fetching documents from Firestore:", e);
    return {};
  }
};

const ListaAcreditariPage = async () => {
  noStore();
  
  try {
    console.log("Loading Lista Acreditari page...");
    const oferte = await fetchItems();

    return (
      <>
        <MyProperties oferte={oferte[2025] || []} an={"2025"} />
        {/* <MyProperties oferte={oferte[2024] || []} an={"2024"} /> */}
      </>
    );
  } catch (error) {
    console.error("Error loading Lista Acreditari page:", error);
    return (
      <div className="container">
        <div className="alert alert-danger">
          Eroare la încărcarea listei de acreditări. Te rog încearcă din nou.
        </div>
      </div>
    );
  }
};

export default dynamic(() => Promise.resolve(ListaAcreditariPage), { ssr: false });
