import React from "react";
import Link from "next/link";
import Image from "next/image";
import { toUrlSlug } from "@/utils/commonUtils"; // Ensure this util is correctly imported for slugification

const FeaturedProperty = ({ item, isGridOrList }) => {
  return (
    <div
      className={`feat_property home7 style4 ${
        isGridOrList ? "d-flex align-items-center" : undefined
      }`}
    >
      <div
        className="thumb"
        style={{ backgroundImage: item?.gradient?.gradientSelected }}
      >
        <Image
          width={342}
          height={220}
          className="img-whp w-100 h-100 cover"
          src={item?.images?.imgs[0]?.finalUri}
          alt="fp1.jpg"
        />
        <div className="thmb_cntnt">
          <div
            style={{
              position: "absolute",
              top: "1px",
              left: "10px",
              zIndex: 10,
            }}
          >
            <Image
              src={item?.logo?.finalUri}
              alt="Logo"
              width={50}
              height={50}
              className="logo"
            />
          </div>

          <Link
            href={`/partener/${item?.id}-${toUrlSlug(item?.denumireBrand)}`}
            className="fp_price"
          >
            {item?.denumireBrand}
          </Link>
        </div>
      </div>
      <div className="details">
        <div className="tc_content">
          <p className="text-thm">{item?.type}</p>
          <p>
            <span className="flaticon-placeholder"></span>
            {item?.adresaSediu}
          </p>
          {item?.distanta && <p>{item?.distanta} metri</p>}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperty;
