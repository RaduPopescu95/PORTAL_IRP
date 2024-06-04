import dynamic from "next/dynamic";
import Signin from "@/components/signin";

export const metadata = {
  title: "PORTAL IRP",
  description: "PORTAL IRP",
};

const index = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
