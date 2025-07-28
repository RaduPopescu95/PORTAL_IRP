"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getFirestoreItem, setFirestoreItem, getFirestoreItemWithRetry, setFirestoreItemWithRetry, getFirestoreNumberUltraAggressive, setFirestoreDocumentSafe } from "@/utils/firestoreUtils";
import LogoUpload from "../my-profile/LogoUpload";
import CommonLoader from "@/components/common/CommonLoader";
import { AlertModal } from "@/components/common/AlertModal";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { useFirestoreDebug } from "@/hooks/useFirestoreDebug";
import dynamic from "next/dynamic";

// Dynamic import pentru React Quill (nu funcționează cu SSR)
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div style={{ height: '160px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Se încarcă editorul...</div>
});

// Import CSS pentru Quill
import 'react-quill/dist/quill.snow.css';

const CreateList = ({ oferta }) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const { isMobile, keyboardOpen, getMobileStyles, scrollToElement } = useMobileOptimization();
  const debugInfo = useFirestoreDebug();
  
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
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [purtatorCuvant, setPurtatorCuvant] = useState('Locotenent Popescu Radu');

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  // Funcție pentru conversie dată din YYYY-MM-DD la DD/MM/YYYY
  const convertDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
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
            data: convertDateForDisplay(dataCurenta),
            numar: numar,
            titlu: titlu,
            nume: selectedItem,
            comunicat: comunicat,
            pentru: semnatar.pentru,
            functia: semnatar.functia,
            grad: semnatar.grad,
            numeSemnatar: semnatar.numeSemnatar,
            "purtator-cuvant": purtatorCuvant,
          },
        }),
      });
      
      const data = await response.json();
      console.log(`API response for ${type}:`, data);
      
      // Verifică dacă response-ul este valid
      if (!response.ok) {
        throw new Error(`API error: ${data.error || response.statusText}`);
      }
      
      if (type === "PDF") {
        return data.pdfLink || null;
      } else {
        return data.wordLink || null;
      }
    } catch (error) {
      console.error(`Eroare la generarea ${type}:`, error);
      showAlert(`Eroare la generarea ${type}: ${error.message}`, "danger");
      return null; // Returnează null în loc de undefined
    }
  };

  // Funcție helper pentru verificarea conținutului Quill
  const hasValidQuillContent = (htmlContent) => {
    if (!htmlContent || htmlContent.trim() === '') return false;
    
    // Creează un element temporar pentru a extrage textul
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    
    // Verifică dacă există text real (nu doar spații, <br>, <p></p>, etc.)
    const cleanText = textContent.replace(/\s+/g, ' ').trim();
    
    // Consideră valid dacă are cel puțin 1 caracter real
    return cleanText.length > 0;
  };

  const handleSend = async () => {
    // Scroll to top pe mobile pentru feedback vizual
    if (isMobile) {
      scrollToElement(formRef.current, 20);
    }

    // Validări înainte de a începe procesul
    if (!selectedItem) {
      showAlert("Te rog selectează tipul de document.", "warning");
      return;
    }
    
    if (!titlu.trim()) {
      showAlert("Te rog completează titlul documentului.", "warning");
      return;
    }
    
    // Validare pentru Quill content - folosește funcția helper
    if (!hasValidQuillContent(comunicat)) {
      showAlert("Te rog completează conținutul documentului.", "warning");
      return;
    }
    
    if (!semnatar.numeSemnatar) {
      showAlert("Te rog selectează un semnatar.", "warning");
      return;
    }
    
    if (!numar || !numarComunicat) {
      showAlert("Numerele de înregistrare nu sunt disponibile. Te rog încearcă din nou.", "warning");
      return;
    }

    if (!purtatorCuvant.trim()) {
      showAlert("Te rog selectează purtătorul de cuvânt.", "warning");
      return;
    }

    const templateIdPdf = "1pWOmI_JNf__PkE3r7G68TmJshxblaEUT383xhhNdois";
    const templateIdWord = "12jLztiQvtEf46RKXZ1N3hCI-b_O4ko2hJ2xVZPkUYAk";

    try {
      console.log("Începe generarea documentelor...");
      console.log("Date pentru generare:", {
        selectedItem,
        titlu: titlu.substring(0, 50) + "...",
        semnatar: semnatar.numeSemnatar,
        numar,
        numarComunicat,
        comunicatLength: comunicat.length,
        comunicatPreview: comunicat.substring(0, 100) + "..."
      });
      
      setLoading(true);

      // Apel pentru PDF
      console.log("Generare PDF...");
      const pdfLink = await handleSendApi(templateIdPdf, "PDF");

      // Apel pentru Word
      console.log("Generare Word...");
      const wordLink = await handleSendApi(templateIdWord, "Word");

      console.log("Link-uri generate:", { pdfLink, wordLink });

      // Verifică dacă cel puțin un link a fost generat cu succes
      if (!pdfLink && !wordLink) {
        throw new Error("Nu s-a putut genera niciun document. Verifică conexiunea și încearcă din nou.");
      }

      const nextNumar = parseInt(numar, 10) + 1;
      setNumar(nextNumar.toString());
      const nextNumarComunicat = parseInt(numarComunicat, 10) + 1;
      setNumarComunicat(nextNumarComunicat.toString());
      
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
      
      // Creează documentData cu conținutul HTML din Quill (EXACT ca înainte)
      const documentData = {
        numar: numar,
        numarComunicat: numarComunicat,
        data: convertDateForDisplay(dataCurenta),
        nume: selectedItem,
        titlu: titlu,
        comunicat: comunicat, // Conținutul HTML din Quill
        numeAfisare: t,
        pentru: semnatar.pentru || "",
        functia: semnatar.functia || "",
        grad: semnatar.grad || "",
        numeSemnatar: semnatar.numeSemnatar || "",
        "purtator-cuvant": purtatorCuvant || "",
      };

      // Adaugă linkurile doar dacă sunt valide
      if (pdfLink) {
        documentData.pdfLink = pdfLink;
      }
      if (wordLink) {
        documentData.wordLink = wordLink;
      }

      console.log("Salvare document în Firestore:", documentData);
      
      // Salvați documentul în Firestore în colecția "Comunicate" cu validare anti-undefined
      await setFirestoreDocumentSafe(
        "Comunicate",
        `${selectedItem}-${numar}`,
        documentData
      );

      await setFirestoreItem("numere", "ultimulNumar", { numar: nextNumar });
      await setFirestoreItem("NumarComunicat", "ComunicatNumar", {
        numarComunicat: nextNumarComunicat,
      });
      
      setLoading(false);
      
      let successMessage = "Document salvat cu succes!";
      if (pdfLink && wordLink) {
        successMessage = "Documente PDF și Word create cu succes!";
      } else if (pdfLink) {
        successMessage = "Document PDF creat cu succes! (Word nu a putut fi generat)";
      } else if (wordLink) {
        successMessage = "Document Word creat cu succes! (PDF nu a putut fi generat)";
      }
      
      showAlert(successMessage, "success");
    } catch (error) {
      setLoading(false);
      console.error("Eroare completă:", error);
      showAlert(`Eroare la generarea documentului: ${error.message}`, "error");
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
    setDataCurenta(`${year}-${month}-${day}`); // Format YYYY-MM-DD pentru input date

    // Restul codului din useEffect...
  }, []);

  useEffect(() => {
    const fetchNumar = async () => {
      try {
        console.log("=== STARTING NUMBER FETCH (ULTRA-AGGRESSIVE) ===");
        console.log("Environment check:", {
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
          isProduction: process.env.NODE_ENV === 'production'
        });
        
        // Folosește funcția ultra-agresivă pentru obținerea numerelor
        const storedNumar = await getFirestoreNumberUltraAggressive("numere", "ultimulNumar");
        const storedNumarComunicat = await getFirestoreNumberUltraAggressive(
          "NumarComunicat",
          "ComunicatNumar"
        );
        
        let nextNumar = storedNumar?.numar || 1;
        let nextNumarComuniicat = storedNumarComunicat?.numarComunicat || 1;
        
        console.log("Retrieved numbers:", { nextNumar, nextNumarComuniicat });
        
        setNumar(nextNumar.toString());
        setNumarComunicat(nextNumarComuniicat.toString());
        
        // Salvează numerele actualizate
        try {
          await setFirestoreItemWithRetry("numere", "ultimulNumar", { numar: nextNumar });
          await setFirestoreItemWithRetry("NumarComunicat", "ComunicatNumar", {
          numarComunicat: nextNumarComuniicat,
          });
          console.log("Numbers successfully saved to Firestore");
        } catch (saveError) {
          console.warn("Failed to save numbers, but continuing with retrieved values:", saveError);
        }
        
        console.log("=== NUMBER FETCH COMPLETED SUCCESSFULLY ===");
      } catch (e) {
        console.error("=== NUMBER FETCH FAILED COMPLETELY ===", e);
        // Ultimate fallback
        console.log("Using ultimate fallback values");
        setNumar("1");
        setNumarComunicat("1");
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

  // Log debugging info when component mounts
  useEffect(() => {
    console.log('CreateList BICP mounted with debug info:', debugInfo);
    console.log('Current environment details:', {
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });
  }, [debugInfo]);

  // Funcție de debugging pentru testarea conexiunii Firestore
  const testFirestoreConnection = async () => {
    console.log("=== MANUAL FIRESTORE TEST ===");
    setAlert({ message: "Testează conexiunea Firestore...", type: "info" });
    
    try {
      const testStart = Date.now();
      
      // Test 1: Citire numere
      const testNumar = await getFirestoreNumberUltraAggressive("numere", "ultimulNumar");
      const testComunicat = await getFirestoreNumberUltraAggressive("NumarComunicat", "ComunicatNumar");
      
      const testEnd = Date.now();
      const duration = testEnd - testStart;
      
      console.log("Test Results:", { testNumar, testComunicat, duration });
      
      setAlert({ 
        message: `Test reușit! Numar: ${testNumar?.numar || 'N/A'}, Comunicat: ${testComunicat?.numarComunicat || 'N/A'} (${duration}ms)`, 
        type: "success" 
      });
      
      // Actualizează UI cu valorile citite
      setNumar((testNumar?.numar || 1).toString());
      setNumarComunicat((testComunicat?.numarComunicat || 1).toString());
      
    } catch (error) {
      console.error("Manual test failed:", error);
      setAlert({ message: `Test eșuat: ${error.message}`, type: "error" });
    }
  };

  // Funcție de test pentru API fără salvare în Firestore
  const testApiGeneration = async () => {
    // Validare pentru Quill content cu funcția helper
    if (!selectedItem || !titlu.trim() || !hasValidQuillContent(comunicat) || !semnatar.numeSemnatar) {
      showAlert("Te rog completează toate câmpurile pentru test.", "warning");
      return;
    }

    console.log("=== API TEST MODE ===");
    setAlert({ message: "Testează API-ul de generare...", type: "info" });

    try {
      const templateIdWord = "12jLztiQvtEf46RKXZ1N3hCI-b_O4ko2hJ2xVZPkUYAk";
      const testStart = Date.now();
      
      const wordLink = await handleSendApi(templateIdWord, "Word");
      const testEnd = Date.now();
      
      if (wordLink) {
        setAlert({ 
          message: `API test reușit! Link generat în ${testEnd - testStart}ms. Nu s-a salvat în baza de date.`, 
          type: "success" 
        });
        console.log("Test successful, generated link:", wordLink);
      } else {
        setAlert({ message: "API test eșuat - nu s-a generat niciun link.", type: "error" });
      }
    } catch (error) {
      setAlert({ message: `API test eșuat: ${error.message}`, type: "error" });
    }
  };

  // Validare pentru submit button - validare mai permisivă pentru Quill
  const isFormValid = () => {
    if (!selectedItem || !titlu.trim() || !semnatar.numeSemnatar) {
      return false;
    }
    
    // Verifică conținutul Quill cu funcția helper
    return hasValidQuillContent(comunicat);
  };

  return (
    <div ref={formRef} style={mobileStyles.keyboardPadding}>
      <div className="row form-style1" style={mobileStyles.mobileForm}>
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
              type="date"
            className="form-control"
              id="data"
            value={dataCurenta}
              onChange={(e) => setDataCurenta(e.target.value)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
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
            className="form-control"
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
            className="form-control"
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

        {/* Purtator de cuvant */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="purtatorCuvant" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Purtător de cuvânt
            </label>
            <select
              className="form-control"
              id="purtatorCuvant"
              value={purtatorCuvant}
              onChange={e => setPurtatorCuvant(e.target.value)}
              style={{
                ...mobileStyles.mobileInput,
                fontSize: '16px',
                backgroundColor: 'white',
              }}
            >
              <option value="Locotenent Popescu Radu">Locotenent Popescu Radu</option>
              <option value="plt.adj. Oprea Ovidiu">plt.adj. Oprea Ovidiu</option>
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

        {/* Text/Comunicat cu textarea simplu */}
      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
            <label htmlFor="comunicat" style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>
              Conținut Document
            </label>
            <textarea
              id="comunicat"
              className="form-control"
              value={comunicat}
              onChange={e => setComunicat(e.target.value)}
              placeholder="Introduceți conținutul documentului..."
              style={{
                backgroundColor: 'white',
                borderRadius: '4px',
                fontSize: '16px',
                minHeight: isMobile ? '120px' : '160px',
                padding: '12px 15px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* Debug Button - doar în development sau pentru debugging */}
        {(process.env.NODE_ENV === 'development' || debugInfo.environment === 'production') && (
          <div className="col-lg-12 mb-3">
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button" 
                onClick={testFirestoreConnection}
                className="btn-modern-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                🔧 Test Firestore
              </button>
              <button
                type="button" 
                onClick={testApiGeneration}
                className="btn-modern-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                🧪 Test API
              </button>
            </div>
            {debugInfo && (
              <div style={{ fontSize: '11px', marginTop: '5px', color: '#666' }}>
                Environment: {debugInfo.environment} | 
                Success: {debugInfo.success ? '✅' : '❌'} | 
                Duration: {debugInfo.duration}ms
              </div>
            )}
      </div>
        )}

        {/* Submit Button */}
      <div className="col-xl-12">
          <div className="my_profile_setting_input" style={{ marginTop: '20px' }}>
            <button 
              onClick={handleSend} 
              disabled={isLoading || !isFormValid()}
              style={{
                ...mobileStyles.mobileButton,
                backgroundColor: isLoading || !isFormValid() 
                  ? '#6c757d' 
                  : '#2563eb',
                color: 'white',
                border: 'none',
                marginTop: isMobile ? '16px' : '0',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              className={`btn-modern-primary ${isMobile ? 'w-100' : 'float-end'}`}
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

      {/* Mobile-specific styles + Quill customization */}
      <style jsx global>{`
        /* React Quill Customization */
        .ql-editor {
          min-height: ${isMobile ? '120px' : '160px'} !important;
          font-size: 16px !important;
          line-height: 1.5;
          padding: 12px 15px;
        }
        
        .ql-toolbar {
          border-top: 1px solid #ccc !important;
          border-left: 1px solid #ccc !important;
          border-right: 1px solid #ccc !important;
          border-bottom: none !important;
          border-radius: 4px 4px 0 0 !important;
          background-color: #f8f9fa;
        }
        
        .ql-container {
          border-left: 1px solid #ccc !important;
          border-right: 1px solid #ccc !important;
          border-bottom: 1px solid #ccc !important;
          border-top: none !important;
          border-radius: 0 0 4px 4px !important;
          font-size: 16px !important;
        }
        
        .ql-editor::before {
          color: #6c757d;
          font-style: italic;
        }
        
        /* Mobile optimizations */
        @media (max-width: 767px) {
          .ql-toolbar {
            padding: 8px 6px !important;
          }
          
          .ql-toolbar .ql-formats {
            margin-right: 8px !important;
          }
          
          .ql-toolbar button {
            padding: 4px !important;
            margin: 1px !important;
          }
          
          .ql-editor {
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 120px !important;
          }
          
          /* Better touch targets */
          .ql-toolbar button,
          .ql-toolbar .ql-picker {
            min-height: 36px !important;
            min-width: 36px !important;
          }
          
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
        
        /* Focus styles for better accessibility */
        .ql-editor:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default CreateList;
