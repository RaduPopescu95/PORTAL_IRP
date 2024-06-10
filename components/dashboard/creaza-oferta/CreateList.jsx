"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestoreItem, setFirestoreItem } from "@/utils/firestoreUtils";
import LogoUpload from "../my-profile/LogoUpload";
import CommonLoader from "@/components/common/CommonLoader";
import { AlertModal } from "@/components/common/AlertModal";

const CreateList = ({ oferta }) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("");
  const [titlu, setTitlu] = useState("");
  const [dataCurenta, setDataCurenta] = useState("");
  const [comunicat, setComunicat] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [numar, setNumar] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [wordLink, setWordLink] = useState("");
  const [editLink, setEditLink] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const apis = [
    {
      url: "https://google-document-created-from-template.p.rapidapi.com/AKfycbx7BECj1W_HDq9mRatoRvPYVc4Fd63bqCP0Mrh9f1SNZgs7xA_krCXZQ4--tcT7sd_O2w/exec",
      api: "d249d3abe2mshf90f82ef3c9aa89p13ef66jsnba5bc2845bb5",
    },
    {
      url: "https://google-document-created-from-template.p.rapidapi.com/AKfycbx7BECj1W_HDq9mRatoRvPYVc4Fd63bqCP0Mrh9f1SNZgs7xA_krCXZQ4--tcT7sd_O2w/exec",
      api: "fdb30fac7dmshee22c632d48569ap1d9819jsna577a39fffd6",
    },
    {
      url: "https://google-document-created-from-template.p.rapidapi.com/AKfycbx7BECj1W_HDq9mRatoRvPYVc4Fd63bqCP0Mrh9f1SNZgs7xA_krCXZQ4--tcT7sd_O2w/exec",
      api: "967c04d7a2msh1448d177d088f99p1d9125jsn9f559a1eb68c",
    },
  ];

  const [apiKey, setApiKey] = useState(apis[0].api);
  const [urlKey, setUrlKey] = useState(apis[0].url);

  const selectApi = (api, url) => {
    console.log(api);
    console.log(url);
    setApiKey(api);
    setUrlKey(url);
    setMenuVisible(false); // Închide meniul după selectare
  };

  const shareLink = async (link, type) => {
    try {
      await Share.share({
        message: `Link descarcare ${type} pentru numar ${
          type === "PDF" ? numar : numar - 1
        }: ${link}`,
      });
    } catch (error) {
      console.error("Eroare la partajarea linkului", error);
    }
  };

  const handleSend = async () => {
    const wordId = "12jLztiQvtEf46RKXZ1N3hCI-b_O4ko2hJ2xVZPkUYAk";
    const pdfId = "133cptKf460XezNPl-Q54hjtIZ3dWCLdEIOcLoAZfEFs";
    let apiIndex = 0;
    let apiKey = apis[apiIndex].api;
    let urlKey = apis[apiIndex].url;

    try {
      console.log("Test...");
      setLoading(true);
      let resultWordLink = "";
      let resultPdfLink = "";

      // Function to send POST request
      const sendRequest = async (docId) => {
        const options = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host":
              "google-document-created-from-template.p.rapidapi.com",
          },
          body: JSON.stringify({
            template: docId,
            tz: "Europe/Paris",
            dateFormat: "yyyy.MM.dd",
            data: {
              numar: numar,
              data: dataCurenta,
              nume: selectedItem,
              titlu: titlu,
              comunicat: comunicat,
            },
          }),
        };
        const response = await fetch(urlKey, options);
        const result = await response.json(); // Transformă răspunsul în JSON
        return result;
      };

      // Function to handle API key change
      const changeApiKey = () => {
        apiIndex++;
        if (apiIndex < apis.length) {
          apiKey = apis[apiIndex].api;
          urlKey = apis[apiIndex].url;
        } else {
          showAlert(`Toate cheile API au fost folosite azi`, "danger");
          throw new Error(`Toate cheile API au fost folosite azi`);
        }
      };

      let resultWord = await sendRequest(wordId);
      if (resultWord.message && resultWord.message.length > 0) {
        changeApiKey();
        resultWord = await sendRequest(wordId);
      }
      resultWordLink = resultWord.wordLink; // Presupunând că răspunsul JSON are un câmp 'wordLink'
      setWordLink(resultWordLink);

      let resultPdf = await sendRequest(pdfId);
      if (resultPdf.message && resultPdf.message.length > 0) {
        changeApiKey();
        resultPdf = await sendRequest(pdfId);
      }
      resultPdfLink = resultPdf.pdfLink; // Presupunând că răspunsul JSON are un câmp 'pdfLink'
      setPdfLink(resultPdfLink);
      setEditLink(resultPdf.Link); // Presupunând că răspunsul JSON are un câmp 'editLink'

      setLoading(false);
      const nextNumar = parseInt(numar, 10) + 1; // Incrementați numărul
      setNumar(nextNumar.toString()); // Actualizați starea
      const t = `${selectedItem} - ${titlu}`;
      const documentData = {
        numar: nextNumar,
        data: dataCurenta,
        nume: selectedItem,
        titlu: titlu,
        comunicat: comunicat,
        pdfLink: resultPdfLink,
        wordLink: resultWordLink,
        numeAfisare: t,
      };
      console.log("documentdata..", documentData);
      // Salvați documentul în Firestore în colecția "Comunicate"
      await setFirestoreItem(
        "Comunicate",
        `${selectedItem}-${nextNumar}`,
        documentData
      );

      await setFirestoreItem("numere", "ultimulNumar", { numar: nextNumar }); // Salvați noul număr
      showAlert(`Documente create cu succes!`, "succes");
    } catch (error) {
      setLoading(false);
      showAlert(`Error at POST REQUEST! ${error.message}`, "error");
      // Gestionează erorile, cum ar fi afișarea unui mesaj de eroare
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
        const storedNumar = await getFirestoreItem("numere", "ultimulNumar");
        let nextNumar;
        if (!storedNumar) {
          // Verificați dacă storedNumar este null
          nextNumar = 0; // Setează numarul la 0 dacă este prima dată
        } else {
          nextNumar = storedNumar.numar; // Altfel, incrementați numărul
        }
        setNumar(nextNumar.toString()); // Actualizați starea
        await setFirestoreItem("numere", "ultimulNumar", { numar: nextNumar }); // Salvați noul număr
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
      nume: "BULETIN INFORMATIV",
    },
    {
      pentru: "",
      functia: "INSPECTOR ȘEF",
      grad: "Locotenent-colonel",
      nume: "COMUNICAT DE PRESĂ",
    },
  ];

  return (
    <>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Numar</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={numar}
            readOnly
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
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Tip document</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option data-tokens="Status1">Selecteaza tip document</option>
            <option data-tokens="Buletin Informati">Buletin Informativ</option>
            <option data-tokens="Comunicat de Presa">Comunicat de Presa</option>
          </select>
        </div>
      </div>
      {/* End .col */}

      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Titlu</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={titlu}
            onChange={(e) => setTitlu(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Text</label>
          <textarea
            className="form-control"
            id="propertyDescription"
            rows="7"
            value={comunicat}
            onChange={(e) => setComunicat(e.target.value)}
          ></textarea>
        </div>
      </div>

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
