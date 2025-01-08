import dynamic from "next/dynamic";
import Interventie from "@/components/dashboard/interventie";

// export const metadata = {
//   title: "Creaza discount || ExclusivMD",
//   description: "nume portal",
// };

const index = () => {
  return (
    <>
      <Interventie />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
