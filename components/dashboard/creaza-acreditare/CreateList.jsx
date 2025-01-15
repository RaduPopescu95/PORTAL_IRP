"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestoreItem, setFirestoreItem } from "@/utils/firestoreUtils";
import LogoUpload from "../my-profile/LogoUpload";
import CommonLoader from "@/components/common/CommonLoader";
import { AlertModal } from "@/components/common/AlertModal";

const CreateList = ({ oferta }) => {
  const [semnatar, setSemnatar] = useState({});
  const [titlu, setTitlu] = useState("");
  const [dataCurenta, setDataCurenta] = useState("");
  const [comunicat, setComunicat] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [numar, setNumar] = useState("");

  const [numeRedactie, setNumeRedactie] = useState("");
  const [adresaRedactie, setAdresaRedactie] = useState("");
  const [numeJurnalistAdresa, setNumeJurnalistAdresa] = useState("");
  const [numeJurnalistAcreditare, setNumeJurnalistAcreditare] = useState("");
  const [email, setEmail] = useState("");
  const [numarLegitimatie, setNumarLegitimatie] = useState("");

  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const handleSend = async () => {
    const templateIdAdresaAcreditare =
      "1t8rI82DJ12OFTec3MnPd2I8LcNkW8Bu9Wgj1yX-c3nk";
    const templateIdAcreditare = "1E5a3HYexg3pqvPVUWmY1ajMQDUwkwhCE_nYQ7zlFC0Q";

    const documents = [
      {
        templateId: templateIdAdresaAcreditare,
        variables: {
          numar,
          data: dataCurenta,
          numeRedactie: numeRedactie,
          adresaRedactie: adresaRedactie,
          numeAcreditareDinAdresa: numeJurnalistAdresa,
          email: email,
        },
        newTitle: `Adresa Acreditare ${numeJurnalistAcreditare}`,
      },
      {
        templateId: templateIdAcreditare,
        variables: {
          numar,
          data: dataCurenta,
          numeAcreditare: numeJurnalistAcreditare,
          numarLegitimatie: numarLegitimatie,
          numeRedactie: numeRedactie,
        },
        newTitle: `Acreditare ${numeJurnalistAcreditare}`,
      },
    ];

    try {
      console.log("Starting document generation...");
      console.log("Documents to be sent:", documents);

      setLoading(true);
      const response = await fetch("/api/generateAcreditari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents }),
      });

      console.log("API call response received.");

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("Documents generated successfully:", data.links);
        showAlert("Documente generate cu succes!", "success");

        await setFirestoreItem("Acreditari", `Acreditare-${numar}`, {
          numar,
          data: dataCurenta,
          links: data.links,
        });
        console.log("Document metadata saved in Firestore.");
      } else {
        console.error("Error from API:", data.error);
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error generating documents:", error.message);
      showAlert(`Eroare la generare documente: ${error.message}`, "danger");
    } finally {
      console.log("Document generation process finished.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // luna începe de la 0
    const year = today.getFullYear();
    setDataCurenta(`${day}/${month}/${year}`); // setează formatul dorit aici

    // Restul codului din useEffect...
  }, []);

  useEffect(() => {
    const fetchNumar = async () => {
      try {
        const storedNumar = await getFirestoreItem(
          "numere",
          "ultimulNumarAcreditare"
        );

        let nextNumar;

        if (!storedNumar) {
          // Verificați dacă storedNumar este null
          nextNumar = 0; // Setează numarul la 0 dacă este prima dată
        } else {
          nextNumar = storedNumar.numar; // Altfel, incrementați numărul
        }

        setNumar(nextNumar.toString()); // Actualizați starea
        await setFirestoreItem("numere", "ultimulNumarAcreditare", {
          numar: nextNumar,
        }); // Salvați noul număr
      } catch (e) {
        console.error("Eroare la citirea numărului din Firestore", e);
      }
    };

    fetchNumar();
  }, []);

  const array = [
    {
      pentru: "p.INSPECTOR ȘEF",
      functia: "PRIM-ADJUNCT INSPECTOR ȘEF",
      grad: "Colonel",
      numeSemnatar: "HANTĂR Alfred",
    },
    {
      pentru: "",
      functia: "INSPECTOR ȘEF",
      grad: "Locotenent-colonel",
      numeSemnatar: "ing. FLOREA Cristian-Claudiu",
    },
  ];

  return (
    <>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Numar Inregistrare Acreditare</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={numar}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Data</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={dataCurenta}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Semnatar</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={semnatar?.numeSemnatar || ""}
            onChange={(e) => {
              const selectedSemnatar = array.find(
                (semn) => semn.numeSemnatar === e.target.value
              );
              setSemnatar(selectedSemnatar || {}); // Actualizează întregul obiect 'semnatar'
            }}
          >
            <option data-tokens={"semnatar"}>Selecteaza semnatar</option>
            {array.map((semn, i) => (
              <option key={i} data-tokens={semn.numeSemnatar}>
                {semn.numeSemnatar}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Nume Redactie</label>
          <input
            type="text"
            className="form-control"
            id="propertyRedactie"
            value={numeRedactie}
            onChange={(e) => setNumeRedactie(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Adresa Redactie</label>
          <input
            type="text"
            className="form-control"
            id="propertyRedactieAdresa"
            value={adresaRedactie}
            onChange={(e) => setAdresaRedactie(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">
            Nume jurnalist (doamnei/domnului) ADRESA INAINTARE
          </label>
          <input
            type="text"
            className="form-control"
            id="propertyNume"
            value={numeJurnalistAdresa}
            onChange={(e) => setNumeJurnalistAdresa(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyJurnalist">Nume jurnalist ACREDITARE</label>
          <input
            type="text"
            className="form-control"
            id="propertyNumeAcreditare"
            value={numeJurnalistAcreditare}
            onChange={(e) => setNumeJurnalistAcreditare(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">E-mail</label>
          <input
            type="text"
            className="form-control"
            id="propertyEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">
            Nr legitimatie (/ DATA daca exista )
          </label>
          <input
            type="text"
            className="form-control"
            id="propertyEmail"
            value={numarLegitimatie}
            onChange={(e) => setNumarLegitimatie(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-0`}>
              {alert.message}
            </div>
          )}
          {oferta?.titluOferta?.length > 0 ? (
            <button onClick={handleSend} className="btn btn2 float-end">
              {isLoading ? <CommonLoader /> : "Actualizeaza"}
            </button>
          ) : (
            <button onClick={handleSend} className="btn btn2 float-end">
              {isLoading ? <CommonLoader /> : "Adauga"}
            </button>
          )}
        </div>
      </div>

      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </>
  );
};

export default CreateList;
