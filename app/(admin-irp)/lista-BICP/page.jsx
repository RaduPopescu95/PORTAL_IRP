import dynamic from "next/dynamic";
import MyProperties from "@/components/dashboard/my-properties";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const metadata = {
  title: "Portal IRP - Lista BICP",
  description: "Lista Buletin Informativ și Comunicate de Presă",
};

const fetchItems = async () => {
  try {
    console.log("Fetching BICP items from Firestore...");
    const collectionPath = "Comunicate";
    const ref = collection(db, collectionPath);

    // Creează o interogare pentru a ordona documentele descrescător după "numar"
    const pageQuery = query(ref, orderBy("numar", "desc"));

    // Obține documentele din interogare - force fresh data from server
    const documentSnapshots = await getDocs(pageQuery, { source: 'server' });
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    console.log(`Fetched ${newItems.length} BICP items`);
    
    if (newItems.length === 0) {
      console.log("No BICP items found");
      return {};
    }

    console.log("Sample item:", newItems[0]);
    
    // Grupare pe ani cu handling mai sigur
    const groupedByYear = newItems.reduce((acc, item) => {
      // Verifică dacă item.data există și are formatul corect
      if (item.data && typeof item.data === 'string' && item.data.includes('/')) {
        const dateParts = item.data.split("/");
        if (dateParts.length >= 3) {
          const year = dateParts[2];
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(item);
        }
      } else {
        console.warn("Item with invalid date format:", item);
      }
      return acc;
    }, {});
    
    Object.keys(groupedByYear).forEach(year => {
      console.log(`Year ${year}: ${groupedByYear[year]?.length} items`);
    });

    return groupedByYear;
  } catch (e) {
    console.error("Eroare la preluarea comunicatelor:", e);
    return {};
  }
};

const ListaBICPPage = async () => {
  noStore();
  
  try {
    console.log("Loading Lista BICP page...");
    const oferte = await fetchItems();

    return (
      <>
        <MyProperties oferte={oferte[2025] || []} an={"2025"} />
        <MyProperties oferte={oferte[2024] || []} an={"2024"} />
      </>
    );
  } catch (error) {
    console.error("Error loading Lista BICP page:", error);
    return (
      <div className="container">
        <div className="alert alert-danger">
          Eroare la încărcarea listei BICP. Te rog încearcă din nou.
        </div>
      </div>
    );
  }
};

export default dynamic(() => Promise.resolve(ListaBICPPage), { ssr: false });
