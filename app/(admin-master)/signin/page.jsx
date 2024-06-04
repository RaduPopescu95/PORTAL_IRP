import dynamic from "next/dynamic";
import Signin from "@/components/signin";

export const metadata = {
  title: "ExclusivMD",
  description: "ExclusivMD",
};

const index = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
