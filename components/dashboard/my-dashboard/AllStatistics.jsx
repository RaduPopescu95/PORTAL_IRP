"use client";

import { useAuth } from "@/context/AuthContext";
import { getFirestoreCollectionLength } from "@/utils/firestoreUtils";

const AllStatistics = async () => {
  const { userData } = useAuth();
  const numarOferte = await getFirestoreCollectionLength(
    `Users/${userData?.user_uid}/Oferte`
  );
  const allStatistics = [
    {
      id: 1,
      blockStyle: "",
      icon: "flaticon-profit",
      timer: "121",
    },
    {
      id: 2,
      blockStyle: "style2",
      icon: "flaticon-high-five",
      timer: "24",
      name: "Solcitari verbale",
    },
    {
      id: 3,
      blockStyle: "style3",
      icon: "flaticon-chat",
      timer: "12",
      name: "Incendii",
    },
    {
      id: 4,
      blockStyle: "style4",
      icon: "flaticon-heart",
      timer: "18",
      name: "Incendii vegetatie",
    },
  ];

  return (
    <>
      {allStatistics.map((item) => (
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-3" key={item.id}>
          <div className={`ff_one ${item.blockStyle}`}>
            <div className="detais">
              <div className="timer">{numarOferte}</div>
              <p>{item.name}</p>
            </div>
            <div className="icon">
              <span className={item.icon}></span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AllStatistics;
