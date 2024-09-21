"use client";

import { useAuth } from "@/context/AuthContext";

const AllStatistics = () => {
  const { userData } = useAuth();
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-user-1",
      timer: "SILVER",
      name: "Grad fidelitate",
    },
    {
      id: 2,
      blockStyle: "style2",
      icon: "flaticon-money-bag",
      timer: "9.987",
      name: "RON",
    },
    // {
    //   id: 3,
    //   blockStyle: "style3",
    //   icon: "flaticon-chat",
    //   timer: "12",
    //   name: "Total Visitor Reviews",
    // },
    // {
    //   id: 4,
    //   blockStyle: "style4",
    //   icon: "flaticon-heart",
    //   timer: "18",
    //   name: "Total Favorites",
    // },
  ];

  return (
    <>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
        <div className={`ff_one`}>
          <div className="detais">
            <div className="timer">{userData?.gradFidelitate}</div>
            <p>Grad de fidelitate</p>
          </div>
          <div className="icon">
            <span className="flaticon-user-1"></span>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3">
        <div className={`ff_one style2`}>
          <div className="detais">
            <div className="timer">{userData?.rulajCont}</div>
            <p>Rulaj Cont</p>
          </div>
          <div className="icon">
            <span className="flaticon-money-bag"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllStatistics;
