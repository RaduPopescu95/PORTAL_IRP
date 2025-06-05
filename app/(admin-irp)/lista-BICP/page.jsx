import dynamicImport from "next/dynamic";
import MyProperties from "@/components/dashboard/my-properties";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db, FORCE_SERVER_OPTIONS } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const metadata = {
  title: "Portal IRP - Lista BICP",
  description: "Lista Buletin Informativ și Comunicate de Presă",
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
    
    console.log(`[${timestamp}] Fetching BICP items from Firestore - NO CACHE - ID: ${uniqueId}`);
    
    const collectionPath = "Comunicate";
    const ref = collection(db, collectionPath);

    // Creează o interogare pentru a ordona documentele descrescător după "numar"
    const pageQuery = query(ref, orderBy("numar", "desc"));

    // FORCE server data - absolutely no cache
    const forceServerOptions = {
      ...FORCE_SERVER_OPTIONS,
      timestamp: timestamp,
      bypassCache: true,
      _uniqueId: uniqueId
    };
    
    console.log(`[${timestamp}] Executing query with force server options:`, forceServerOptions);
    
    const documentSnapshots = await getDocs(pageQuery, forceServerOptions);
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      _timestamp: timestamp,
      _uniqueId: uniqueId,
      _serverFetch: true
    }));
    
    console.log(`[${timestamp}] Fetched ${newItems.length} BICP items directly from server`);
    
    if (newItems.length === 0) {
      console.log(`[${timestamp}] No BICP items found in server response`);
      return {};
    }

    console.log(`[${timestamp}] Sample item from server:`, newItems[0]);
    
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
        console.warn(`[${timestamp}] Item with invalid date format:`, item);
      }
      return acc;
    }, {});
    
    Object.keys(groupedByYear).forEach(year => {
      console.log(`[${timestamp}] Year ${year}: ${groupedByYear[year]?.length} items`);
    });

    return groupedByYear;
  } catch (e) {
    console.error(`[${Date.now()}] Eroare la preluarea comunicatelor:`, e);
    return {};
  }
};

const ListaBICPPage = async () => {
  // Force no caching at Next.js level
  noStore();
  
  // Add response headers to prevent any caching
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  
  try {
    const timestamp = Date.now();
    console.log(`[${timestamp}] Loading Lista BICP page with NO CACHE...`);
    
    const oferte = await fetchItems();

    return (
      <>
        <div 
          style={{ display: 'none' }} 
          data-cache-buster={timestamp}
          data-no-cache="true"
          data-server-fetch="true"
        />
        <MyProperties oferte={oferte[2025] || []} an={"2025"} />
        <MyProperties oferte={oferte[2024] || []} an={"2024"} />
      </>
    );
  } catch (error) {
    const timestamp = Date.now();
    console.error(`[${timestamp}] Error loading Lista BICP page:`, error);
    
    return (
      <div className="container">
        <div className="alert alert-danger">
          Eroare la încărcarea listei BICP. Te rog încearcă din nou.
          <br />
          <small>Toate cache-urile sunt dezactivate - datele vin direct de la server.</small>
          <button 
            className="btn btn-sm btn-primary ms-2"
            onClick={() => {
              if (typeof window !== 'undefined') {
                // Add timestamp to force fresh load
                const url = new URL(window.location);
                url.searchParams.set('_t', Date.now().toString());
                url.searchParams.set('_nocache', 'true');
                window.location.href = url.toString();
              }
            }}
          >
            Force Reload
          </button>
        </div>
      </div>
    );
  }
};

export default dynamicImport(() => Promise.resolve(ListaBICPPage), { ssr: false });
