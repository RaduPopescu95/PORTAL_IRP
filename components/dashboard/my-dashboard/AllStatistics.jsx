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
      timer: "121",
      name: "Comunicate/Buletine totale",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: "24",
      name: "Comunicate/Buletine ultima luna",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: "12",
      name: "Solicitari verbale ultima luna",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: "18",
      name: "Solicitari scrise ultima luna",
    },
  ];

  const interventiiSapt = [
    {
      id: 1,
      blockStyle: "",
      timer: "121",
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: "24",
      name: "Incendii vegetatie",
    },
    {
      id: 6,
      blockStyle: "style2",
      timer: "24",
      name: "Suprafete (ha)",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: "12",
      name: "Accidente rutiere",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: "18",
      name: "SMURD",
    },
    {
      id: 5,
      blockStyle: "style4",
      timer: "18",
      name: "Alte interventii",
    },
  ];
  const interventiiLuna = [
    {
      id: 1,
      blockStyle: "",
      timer: "121",
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: "24",
      name: "Incendii vegetatie",
    },
    {
      id: 6,
      blockStyle: "style2",
      timer: "24",
      name: "Suprafete (ha)",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: "12",
      name: "Accidente rutiere",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: "18",
      name: "SMURD",
    },
    {
      id: 5,
      blockStyle: "style4",
      timer: "18",
      name: "Alte interventii",
    },
  ];
  const interventiiTreiLuni = [
    {
      id: 1,
      blockStyle: "",
      timer: "121",
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: "24",
      name: "Incendii vegetatie",
    },
    {
      id: 6,
      blockStyle: "style2",
      timer: "24",
      name: "Suprafete (ha)",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: "12",
      name: "Accidente rutiere",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: "18",
      name: "SMURD",
    },
    {
      id: 5,
      blockStyle: "style4",
      timer: "18",
      name: "Alte interventii",
    },
  ];
  const interventiiAnual = [
    {
      id: 1,
      blockStyle: "",
      timer: "121",
      name: "Incendii",
    },
    {
      id: 2,
      blockStyle: "style2",
      timer: "24",
      name: "Incendii vegetatie",
    },
    {
      id: 6,
      blockStyle: "style2",
      timer: "24",
      name: "Suprafete (ha)",
    },
    {
      id: 3,
      blockStyle: "style3",
      timer: "12",
      name: "Accidente rutiere",
    },
    {
      id: 4,
      blockStyle: "style4",
      timer: "18",
      name: "SMURD",
    },
    {
      id: 5,
      blockStyle: "style4",
      timer: "18",
      name: "Alte interventii",
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
      {interventiiSapt.map((item) => (
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
      {interventiiLuna.map((item) => (
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
      {interventiiTreiLuni.map((item) => (
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
      {interventiiAnual.map((item) => (
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
