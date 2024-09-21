"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getFirestoreItem,
  handleUploadFirestore,
  setFirestoreItem,
} from "@/utils/firestoreUtils";
import LogoUpload from "../my-profile/LogoUpload";
import CommonLoader from "@/components/common/CommonLoader";
import { AlertModal } from "@/components/common/AlertModal";

const CreateList = ({ oferta }) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const [incendii, setIncendii] = useState(0);
  const [incendiiDeVegetatie, setIncendiiDeVegetatie] = useState(0);
  const [evenimentRutier, setEvenimentRutier] = useState(0); // Modificat conform instrucțiunilor
  const [asistentaPersoane, setAsistentaPersoane] = useState(0);
  const [deblocareUsa, setDeblocareUsa] = useState(0);
  const [salvareAnimal, setSalvareAnimal] = useState(0);
  const [alteSU, setAlteSU] = useState(0);
  const [pirotehnic, setPirotehnic] = useState(0);
  const [inundatii, setInundatii] = useState(0);
  const [explozie, setExplozie] = useState(0);
  const [alarmaFalsa, setAlarmaFalsa] = useState(0);
  const [descarcerare, setDescarcerare] = useState(0);
  const [smurd, setSmurd] = useState(0);
  const [recunoasteri, setRecunoasteri] = useState(0);
  const [exercitii, setExercitii] = useState(0);
  const [informare, setInformare] = useState(0);
  const [nrMP, setNrMP] = useState(0);
  const [verificareATI, setVerificareATI] = useState(0);
  const [comunicat, setComunicat] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [dataCurenta, setDataCurenta] = useState("");

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
    try {
      console.log("Test...");
      setLoading(true);

      const documentData = {
        data: dataCurenta,
        incendii: incendii,
        incendiiDeVegetatie: incendiiDeVegetatie,
        nrMP,
        evenimentRutier: evenimentRutier,
        asistentaPersoane: asistentaPersoane,
        deblocareUsa: deblocareUsa,
        salvareAnimal: salvareAnimal,
        alteSU: alteSU,
        pirotehnic: pirotehnic,
        inundatii: inundatii,
        explozie: explozie,
        alarmaFalsa: alarmaFalsa,
        descarcerare: descarcerare,
        smurd: smurd,
        recunoasteri: recunoasteri,
        exercitii: exercitii,
        informare: informare,
        verificareATI: verificareATI,
      };

      console.log("documentdata..", documentData);
      // Salvați documentul în Firestore în colecția "Comunicate"
      await handleUploadFirestore(documentData, "Interventii");

      showAlert(`Solicitare adaugata cu succes!`, "success");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showAlert(`Error at adaugare solciitare! ${error.message}`, "error");
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
          <label htmlFor="propertyTitle">Data</label>
          <input
            type="date"
            className="form-control"
            id="propertyTitle"
            value={dataCurenta}
            onChange={(e) => setDataCurenta(e.target.value)}
          />
        </div>
      </div>

      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="incendiiInput">Incendii</label>
          <input
            type="number"
            className="form-control"
            id="incendiiInput"
            value={incendii}
            onChange={(e) => setIncendii(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="incendiiDeVegetatieInput">
            Incendii de vegetație
          </label>
          <input
            type="number"
            className="form-control"
            id="incendiiDeVegetatieInput"
            value={incendiiDeVegetatie}
            onChange={(e) => setIncendiiDeVegetatie(e.target.value)}
          />
        </div>
      </div>
      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="incendiiDeVegetatieInput">Nr metri patrati</label>
          <input
            type="number"
            className="form-control"
            id="incendiiDeVegetatieInput"
            value={nrMP}
            onChange={(e) => setNrMP(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="evenimentRutierInput">Eveniment rutier</label>
          <input
            type="number"
            className="form-control"
            id="evenimentRutierInput"
            value={evenimentRutier}
            onChange={(e) => setEvenimentRutier(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="asistentaPersoaneInput">Asistență persoane</label>
          <input
            type="number"
            className="form-control"
            id="asistentaPersoaneInput"
            value={asistentaPersoane}
            onChange={(e) => setAsistentaPersoane(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="deblocareUsaInput">Deblocare ușă</label>
          <input
            type="number"
            className="form-control"
            id="deblocareUsaInput"
            value={deblocareUsa}
            onChange={(e) => setDeblocareUsa(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="salvareAnimalInput">Salvare animal</label>
          <input
            type="number"
            className="form-control"
            id="salvareAnimalInput"
            value={salvareAnimal}
            onChange={(e) => setSalvareAnimal(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="alteSUInput">Alte SU</label>
          <input
            type="number"
            className="form-control"
            id="alteSUInput"
            value={alteSU}
            onChange={(e) => setAlteSU(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="pirotehnicInput">Pirotehnic</label>
          <input
            type="number"
            className="form-control"
            id="pirotehnicInput"
            value={pirotehnic}
            onChange={(e) => setPirotehnic(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="inundatiiInput">Inundații</label>
          <input
            type="number"
            className="form-control"
            id="inundatiiInput"
            value={inundatii}
            onChange={(e) => setInundatii(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="explozieInput">Explozie</label>
          <input
            type="number"
            className="form-control"
            id="explozieInput"
            value={explozie}
            onChange={(e) => setExplozie(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="alarmaFalsaInput">Alarma falsă</label>
          <input
            type="number"
            className="form-control"
            id="alarmaFalsaInput"
            value={alarmaFalsa}
            onChange={(e) => setAlarmaFalsa(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="descarcerareInput">Descarcerare</label>
          <input
            type="number"
            className="form-control"
            id="descarcerareInput"
            value={descarcerare}
            onChange={(e) => setDescarcerare(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="smurdInput">SMURD</label>
          <input
            type="number"
            className="form-control"
            id="smurdInput"
            value={smurd}
            onChange={(e) => setSmurd(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="recunoasteriInput">Recunoașteri</label>
          <input
            type="number"
            className="form-control"
            id="recunoasteriInput"
            value={recunoasteri}
            onChange={(e) => setRecunoasteri(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="exercitiiInput">Exerciții</label>
          <input
            type="number"
            className="form-control"
            id="exercitiiInput"
            value={exercitii}
            onChange={(e) => setExercitii(e.target.value)}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="informareInput">Informare</label>
          <input
            type="number"
            className="form-control"
            id="informareInput"
            value={informare}
            onChange={(e) => setInformare(e.target.value)}
          />
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
