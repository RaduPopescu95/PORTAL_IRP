import dynamic from "next/dynamic";
import MyProperties from "@/components/dashboard/my-properties-acreditari";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db } from "@/firebase";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { query } from "firebase/database";

export const metadata = {
  title: "Portal || Portal",
  description: "Portal",
};

const fetchItems = async () => {
  try {
    const collectionPath = `Acreditari`; // Numele colecției
    const ref = collection(db, collectionPath);

    // Interogare pentru ordonare descrescătoare după "numar"
    const pageQuery = query(ref, orderBy("numar", "desc"));

    const documentSnapshots = await getDocs(pageQuery);
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Grupare pe ani
    const groupedByYear = newItems.reduce((acc, item) => {
      const year = item.data.split("/")[2]; // Extrage anul din "data"
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});

    return groupedByYear;
  } catch (e) {
    console.error("Error fetching documents from Firestore:", e);
    return [];
  }
};

const index = async () => {
  noStore();
  console.log("authentication....", authentication.currentUser);
  let oferte = await fetchItems();

  return (
    <>
      <MyProperties oferte={oferte[2025]} an={"2025"} />
      {/* <MyProperties oferte={oferte[2024]} an={"2024"} /> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
