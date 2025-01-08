import dynamic from "next/dynamic";
import MySavedSearch from "@/components/dashboard-master/lista-tranzactii";
import { handleGetSubcollections } from "@/utils/firestoreUtils";
import { unstable_noStore as noStore } from "next/cache";

export const metadata = {
  title: "Lista oferte || ExclusivMD",
  description: "Porta",
};

const index = async () => {
  noStore();
  let oferteInregistrate = await handleGetSubcollections(
    "OferteInregistrate",
    "firstUploadDate"
  );
  return (
    <>
      <MySavedSearch oferteInregistrate={oferteInregistrate} />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
