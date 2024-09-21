"use client";

import { useState } from "react";

const PropertyDescriptions = ({ partener }) => {
  const [click, setClick] = useState(true);
  const handleClick = () => setClick(!click);

  return (
    <>
      <p className="mt10 mb10">{partener?.descriere}</p>
    </>
  );
};

export default PropertyDescriptions;
