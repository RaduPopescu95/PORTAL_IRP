import dynamic from "next/dynamic";
import MySavedSearch from "@/components/dashboard-master/mesaje";
import {
  handleGetFirestore,
  handleGetSubcollections,
} from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";

export const metadata = {
  title: "Lista oferte || ExclusivMD",
  description: "Porta",
};

const index = async () => {
  noStore();
  let mesajeInregistrare = await handleGetFirestore(
    "Mesaje",
    "firstUploadDate"
  );
  return (
    <>
      <MySavedSearch mesajeInregistrare={mesajeInregistrare} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
