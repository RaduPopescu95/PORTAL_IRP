"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getFirestoreItem, setFirestoreItem } from "@/utils/firestoreUtils";
import LogoUpload from "../my-profile/LogoUpload";
import CommonLoader from "@/components/common/CommonLoader";
import { AlertModal } from "@/components/common/AlertModal";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

const CreateList = ({ oferta }) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const { isMobile, keyboardOpen, getMobileStyles, scrollToElement } = useMobileOptimization();
  
  // Refs pentru optimizare mobile
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const formRef = useRef(null);
  
  const [selectedItem, setSelectedItem] = useState("");
  const [semnatar, setSemnatar] = useState({});
  const [titlu, setTitlu] = useState("");
  const [dataCurenta, setDataCurenta] = useState("");
  const [comunicat, setComunicat] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [numar, setNumar] = useState("");
  const [numarComunicat, setNumarComunicat] = useState("");
  // const [pdfLink, setPdfLink] = useState("");
  // const [wordLink, setWordLink] = useState("");
  // const [editLink, setEditLink] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const [menuVisible, setMenuVisible] = useState(false);

  const mobileStyles = getMobileStyles();

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

  const handleSendApi = async (templateId, type) => {
    try {
      let firstTitlePart;
      if (selectedItem === "Buletin Informativ") {
        firstTitlePart = "BI";
      } else if (selectedItem === "Comunicat de Presă") {
        firstTitlePart = "CP";
      } else if (selectedItem === "Declarație de presă") {
        firstTitlePart = "Declarație";
      } else if (selectedItem === "Conferință de presă") {
        firstTitlePart = "Conferință";
      } else {
        firstTitlePart = selectedItem;
      }
      const t = `${firstTitlePart} - ${titlu}`;
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: templateId,
          newTitle: titlu,
          variables: {
            data: dataCurenta,
            numar: numar,
            titlu: titlu,
            nume: selectedItem,
            comunicat: comunicat,
            pentru: semnatar.pentru,
            functia: semnatar.functia,
            grad: semnatar.grad,
            numeSemnatar: semnatar.numeSemnatar,
          },
        }),
      });
      const data = await response.json();
      if (type === "PDF") {
        return data.pdfLink;
      } else {
        return data.wordLink;
      }
    } catch (error) {
      showAlert(`Eroare: ${error.message}`, "danger");
    }
  };

  const handleSend = async () => {
    // Scroll to top pe mobile pentru feedback vizual
    if (isMobile) {
      scrollToElement(formRef.current, 20);
    }

    const templateIdPdf = "1pWOmI_JNf__PkE3r7G68TmJshxblaEUT383xhhNdois";
    const templateIdWord = "12jLztiQvtEf46RKXZ1N3hCI-b_O4ko2hJ2xVZPkUYAk";

    try {
      console.log("Test...");
      setLoading(true);

      // Apel pentru PDF
      const pdfLink = await handleSendApi(templateIdPdf, "PDF");

      // Apel pentru Word
      const wordLink = await handleSendApi(templateIdWord, "Word");
      // Function to send POST request

      setLoading(false);
      const nextNumar = parseInt(numar, 10) + 1; // Incrementați numărul
      setNumar(nextNumar.toString()); // Actualizați starea
      const nextNumarComunicat = parseInt(numarComunicat, 10) + 1; // Incrementați numărul
      setNumarComunicat(nextNumarComunicat.toString()); // Actualizați starea
      let firstTitlePart;
      if (selectedItem === "Buletin Informativ") {
        firstTitlePart = "BI";
      } else if (selectedItem === "Comunicat de Presă") {
        firstTitlePart = "CP";
      } else if (selectedItem === "Declarație de presă") {
        firstTitlePart = "Declarație";
      } else if (selectedItem === "Conferință de presă") {
        firstTitlePart = "Conferință";
      } else {
        firstTitlePart = selectedItem;
      }
      const t = `${numarComunicat} - ${firstTitlePart} - ${titlu}`;
      const documentData = {
        numar: numar,
        numarComunicat: numarComunicat,
        data: dataCurenta,
        nume: selectedItem,
        titlu: titlu,
        comunicat: comunicat,
        pdfLink: pdfLink,
        wordLink: wordLink,
        numeAfisare: t,
        pentru: semnatar.pentru,
        functia: semnatar.functia,
        grad: semnatar.grad,
        numeSemnatar: semnatar.numeSemnatar,
      };
      console.log("documentdata..", documentData);
      // Salvați documentul în Firestore în colecția "Comunicate"
      await setFirestoreItem(
        "Comunicate",
        `${selectedItem}-${numar}`,
        documentData
      );

      await setFirestoreItem("numere", "ultimulNumar", { numar: nextNumar }); // Salvați noul număr
      await setFirestoreItem("NumarComunicat", "ComunicatNumar", {
        numarComunicat: nextNumarComunicat,
      }); // Salvați noul număr      
      showAlert(`Documente create cu succes!`, "success");
    } catch (error) {
      setLoading(false);
      showAlert(`Error at POST REQUEST! ${error.message}`, "error");
      // Gestionează erorile, cum ar fi afișarea unui mesaj de eroare
    }
  };

  // Handle input focus pe mobile
  const handleInputFocus = (ref) => {
    if (isMobile && ref.current) {
      setTimeout(() => {
        scrollToElement(ref.current, 100);
      }, 300);
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
        const storedNumarComunicat = await getFirestoreItem(
          "NumarComunicat",
          "ComunicatNumar"
        );
        let nextNumar;
        let nextNumarComuniicat;
        if (!storedNumar) {
          // Verificați dacă storedNumar este null
          nextNumar = 0; // Setează numarul la 0 dacă este prima dată
        } else {
          nextNumar = storedNumar.numar; // Altfel, incrementați numărul
        }
        if (!storedNumarComunicat) {
          // Verificați dacă storedNumarComunicat este null
          nextNumarComuniicat = 0; // Setează numarul la 0 dacă este prima dată
        } else {
          nextNumarComuniicat = storedNumarComunicat.numarComunicat; // Altfel, incrementați numărul
        }
        setNumar(nextNumar.toString()); // Actualizați starea
        setNumarComunicat(nextNumarComuniicat.toString()); // Actualizați starea
        await setFirestoreItem("numere", "ultimulNumar", { numar: nextNumar }); // Salvați noul număr
        await setFirestoreItem("NumarComunicat", "ComunicatNumar", {
          numarComunicat: nextNumarComuniicat,
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
    <div ref={formRef} style={mobileStyles.keyboardPadding}>
      <div className="row" style={mobileStyles.mobileForm}>
        {/* Numar Comunicat */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="numarComunicat" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Numar Comunicat
            </label>
            <input
              ref={titleRef}
              type="text"
              className="form-control"
              id="numarComunicat"
              value={numarComunicat}
              onChange={(e) => setNumarComunicat(e.target.value)}
              onFocus={() => handleInputFocus(titleRef)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px', // Previne zoom pe iOS
              }}
              placeholder="Introduceți numărul comunicatului"
            />
          </div>
        </div>

        {/* Numar Inregistrare */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="numarInregistrare" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Numar Inregistrare
            </label>
            <input
              type="text"
              className="form-control"
              id="numarInregistrare"
              value={numar}
              onChange={(e) => setNumar(e.target.value)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
              }}
              placeholder="Introduceți numărul de înregistrare"
            />
          </div>
        </div>

        {/* Data */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="data" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Data
            </label>
            <input
              type="text"
              className="form-control"
              id="data"
              value={dataCurenta}
              readOnly
              style={{
                ...mobileStyles.mobileInput,
                backgroundColor: '#f8f9fa',
                cursor: 'not-allowed',
              }}
            />
          </div>
        </div>

        {/* Tip document */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Tip document
            </label>
            <select
              className="selectpicker form-select"
              data-live-search="true"
              data-width="100%"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
                backgroundColor: 'white',
              }}
            >
              <option value="">Selectează tip document</option>
              <option value="Buletin Informativ">Buletin Informativ</option>
              <option value="Comunicat de Presă">Comunicat de Presă</option>
              <option value="Știre">Știre</option>
              <option value="Declarație de presă">Declarație de presă</option>
              <option value="Conferință de presă">Conferință de presă</option>
              <option value="Invitație">Invitație</option>
              <option value="Interviu">Interviu</option>
              <option value="Anunț">Anunț</option>
              <option value="Eveniment de presă">Eveniment de presă</option>
              <option value="Drept la replică">Drept la replică</option>
            </select>
          </div>
        </div>

        {/* Semnatar */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Semnatar
            </label>
            <select
              className="selectpicker form-select"
              data-live-search="true"
              data-width="100%"
              value={semnatar?.numeSemnatar || ""}
              onChange={(e) => {
                const selectedSemnatar = array.find(
                  (semn) => semn.numeSemnatar === e.target.value
                );
                setSemnatar(selectedSemnatar || {});
              }}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
                backgroundColor: 'white',
              }}
            >
              <option value="">Selectează semnatar</option>
              {array.map((semn, i) => (
                <option key={i} value={semn.numeSemnatar}>
                  {semn.numeSemnatar}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Titlu */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="titlu" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Titlu
            </label>
            <input
              type="text"
              className="form-control"
              id="titlu"
              value={titlu}
              onChange={(e) => setTitlu(e.target.value)}
              onFocus={() => handleInputFocus(titleRef)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
              }}
              placeholder="Introduceți titlul documentului"
            />
          </div>
        </div>

        {/* Text/Comunicat */}
        <div className="col-lg-12">
          <div className="my_profile_setting_textarea">
            <label htmlFor="comunicat" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Text
            </label>
            <textarea
              ref={contentRef}
              className="form-control"
              id="comunicat"
              rows={isMobile ? "5" : "7"}
              value={comunicat}
              onChange={(e) => setComunicat(e.target.value)}
              onFocus={() => handleInputFocus(contentRef)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
                minHeight: isMobile ? '120px' : '160px',
                resize: 'vertical',
              }}
              placeholder="Introduceți conținutul documentului..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-xl-12">
          <div className="my_profile_setting_input" style={{ marginTop: '20px' }}>
            {alert.message && (
              <div className={`alert alert-${alert.type} mb-3`} style={{
                borderRadius: '8px',
                fontSize: isMobile ? '14px' : '16px'
              }}>
                {alert.message}
              </div>
            )}
            
            <button 
              onClick={handleSend} 
              disabled={isLoading || !selectedItem || !titlu.trim() || !comunicat.trim()}
              style={{
                ...mobileStyles.mobileButton,
                backgroundColor: isLoading || !selectedItem || !titlu.trim() || !comunicat.trim() 
                  ? '#6c757d' 
                  : '#007bff',
                color: 'white',
                border: 'none',
                marginTop: isMobile ? '16px' : '0',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              className={`btn ${isMobile ? 'w-100' : 'float-end'}`}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CommonLoader />
                  <span>Se procesează...</span>
                </div>
              ) : oferta?.titluOferta?.length > 0 ? (
                "Actualizează"
              ) : (
                "📄 Creează Document"
              )}
            </button>
          </div>
        </div>
      </div>

      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .form-group {
            margin-bottom: 20px;
          }
          
          label {
            margin-bottom: 8px;
            display: block;
            color: #495057;
          }
          
          .alert {
            font-size: 14px;
            padding: 12px;
          }
          
          /* Prevent zoom on input focus */
          input, select, textarea {
            font-size: 16px !important;
          }
          
          /* Better touch targets */
          select, input, textarea, button {
            min-height: 48px;
          }
          
          /* Improved select styling */
          select {
            appearance: menulist;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 12px center;
            background-repeat: no-repeat;
            background-size: 16px;
            padding-right: 40px;
          }
        }
        
        /* Loading animation improvements */
        button:disabled {
          cursor: not-allowed;
        }
        
        /* Touch feedback */
        @media (hover: none) and (pointer: coarse) {
          button:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateList;
