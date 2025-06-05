import dynamic from "next/dynamic";
import MyProperties from "@/components/dashboard/my-properties-acreditari";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db, FORCE_SERVER_OPTIONS } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const metadata = {
  title: "Portal IRP - Lista Acreditări",
  description: "Lista Acreditări Jurnaliști",
};

// Force absolutely no caching at all levels
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

const fetchItems = async () => {
  try {
    // Add unique timestamp to bypass any potential caches
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(7);
    
    console.log(`[${timestamp}] Fetching Acreditari items from Firestore - NO CACHE - ID: ${uniqueId}`);
    
    const collectionPath = "Acreditari";
    const ref = collection(db, collectionPath);

    // Creează o interogare pentru a ordona documentele descrescător după "numarInregistrareAcreditare"
    const pageQuery = query(ref, orderBy("numarInregistrareAcreditare", "desc"));

    // FORCE server data - absolutely no cache
    const forceServerOptions = {
      ...FORCE_SERVER_OPTIONS,
      timestamp: timestamp,
      bypassCache: true,
      _uniqueId: uniqueId
    };
    
    console.log(`[${timestamp}] Executing acreditari query with force server options:`, forceServerOptions);
    
    const documentSnapshots = await getDocs(pageQuery, forceServerOptions);
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      _timestamp: timestamp,
      _uniqueId: uniqueId,
      _serverFetch: true
    }));
    
    console.log(`[${timestamp}] Fetched ${newItems.length} Acreditari items directly from server`);
    
    if (newItems.length === 0) {
      console.log(`[${timestamp}] No Acreditari items found in server response`);
      return {};
    }

    console.log(`[${timestamp}] Sample acreditari item from server:`, newItems[0]);
    
    // Grupare pe ani
    const groupedByYear = newItems.reduce((acc, item) => {
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
        console.warn(`[${timestamp}] Acreditari item with invalid date format:`, item);
      }
      return acc;
    }, {});
    
    Object.keys(groupedByYear).forEach(year => {
      console.log(`[${timestamp}] Acreditari Year ${year}: ${groupedByYear[year]?.length} items`);
    });

    return groupedByYear;
  } catch (e) {
    console.error(`[${Date.now()}] Eroare la preluarea acreditarilor:`, e);
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
