import dynamic from "next/dynamic";
import Solicitari from "@/components/dashboard/solicitari";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db } from "@/firebase";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { query } from "firebase/database";

export const metadata = {
  title: "Portal || Portal",
  description: "Portal",
};

const fetchItems = async (page) => {
  const collectionPath = `SolcitariVerbale`; // Replace with your actual path if needed
  const ref = collection(db, collectionPath);

  // Creează o interogare pentru a ordona documentele descrescător după "numar"
  const pageQuery = query(ref, orderBy("id", "desc"));

  if (!pageQuery) return [];

  // Obține documentele din interogare
  const documentSnapshots = await getDocs(pageQuery);
  const newItems = documentSnapshots.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("newItems....", newItems);
  return newItems;
};

const index = async () => {
  noStore();
  console.log("authentication....", authentication.currentUser);
  let oferte = await fetchItems();
  return (
    <>
      <Solicitari oferte={oferte} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
