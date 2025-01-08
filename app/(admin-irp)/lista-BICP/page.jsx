import dynamic from "next/dynamic";
import MyProperties from "@/components/dashboard/my-properties";
import { unstable_noStore as noStore } from "next/cache";
import { authentication, db } from "@/firebase";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { query } from "firebase/database";

export const metadata = {
  title: "Portal || Portal",
  description: "Portal",
};

const fetchItems = async (page) => {
  try {
    const collectionPath = `Comunicate`; // Replace with your actual path if needed
    const ref = collection(db, collectionPath);

    // Creează o interogare pentru a ordona documentele descrescător după "numar"
    const pageQuery = query(ref, orderBy("numar", "desc"));

    if (!pageQuery) return [];

    // Obține documentele din interogare
    const documentSnapshots = await getDocs(pageQuery);
    const newItems = documentSnapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("newItems....", newItems[0].data);
    const groupedByYear = newItems.reduce((acc, item) => {
      const year = item.data.split("/")[2];
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(item);
      return acc;
    }, {});
    console.log("groupedByYear....", groupedByYear[2025].length);

    return groupedByYear;
  } catch (e) {
    console.log("error...la preluarea coumincatelor...", e);
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
      <MyProperties oferte={oferte[2024]} an={"2024"} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
