"use client";

import { useAuth } from "@/context/AuthContext";
import { handleUploadFirestoreSubcollection } from "@/utils/firestoreUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateList = ({ oferta, utilizator }) => {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [pretIntreg, setPretIntreg] = useState(oferta?.pretIntreg || "");
  const [pretRedus, setPretRedus] = useState(oferta?.pretRedus || "");
  const [procentReducere, setProcentReducere] = useState(
    oferta?.procentReducere || ""
  );
  const [pretFinal, setPretFinal] = useState("");
  const [noPretFinal, setNoPretFinal] = useState(false);
  const [titluOferta, setTitluOferta] = useState(oferta?.titluOferta || "");
  const [descriereOferta, setDescriereOferta] = useState(
    oferta?.descriereOferta || ""
  );
  const [gradeFidelitate, setGradeFidelitate] = useState(
    oferta?.gradeFidelitate || []
  );
  const [fidelitySilver, setFidelitySilver] = useState(
    oferta?.gradeFidelitate?.includes("Silver") ? true : false
  );
  const [fidelityGold, setFidelityGold] = useState(
    oferta?.gradeFidelitate?.includes("Gold") ? true : false
  );
  const [fidelityPlatinum, setFidelityPlatinum] = useState(
    oferta?.gradeFidelitate?.includes("Platinum") ? true : false
  );

  const [tipOferta, setTipOferta] = useState(oferta?.tipOferta || "");
  const [dataActivare, setDataActivare] = useState(oferta?.dataActivare || "");
  const [dataDezactivare, setDataDezactivare] = useState(
    oferta?.dataDezactivare || ""
  );

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Funcție pentru a afișa alerta
  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
      router.push("/lista-BICP");
    }, 3000); // Alerta va dispărea după 3 secunde
  };

  const handleFidelityChange = (event) => {
    const { id, checked } = event.target;
    switch (id) {
      case "Silver":
        setFidelitySilver(checked);
        break;
      case "Gold":
        setFidelityGold(checked);
        break;
      case "Platinum":
        setFidelityPlatinum(checked);
        break;
    }
    setGradeFidelitate((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((gradeId) => gradeId !== id);
      }
    });
  };

  // upload image
  const uploadProfile = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (pretIntreg && pretRedus) {
      const discount = ((pretIntreg - pretRedus) / pretIntreg) * 100;
      setProcentReducere(discount.toFixed(2)); // Afișează procentul cu două zecimale
    }
  }, [pretIntreg, pretRedus]); // Recalculează la schimbarea prețului întreg sau a celui redus

  const handleAddOffer = async () => {
    console.log("currentUser?...", currentUser?.uid);
    console.log("userData?...", userData);
    if (pretFinal.length === 0) {
      showAlert("Adauga pret final!", "danger");
      setNoPretFinal(true);
      return;
    }
    setNoPretFinal(false);
    let data = {
      idOferta: oferta.documentId,
      idUtilizator: utilizator?.user_uid,
      utilizator,
      oferta,
      numePartener: userData?.denumireBrand,
      status: "Neconfirmata",
      imagineBonFactura: {},
      pretFinal,
    };

    try {
      let actionText = `${userData?.denumireBrand} a verificat tranzactia pentru oferta ${oferta?.titluOferta} accesata de catre ${utilizator?.numeUtilizator}`;
      await handleUploadFirestoreSubcollection(
        data,
        `Users/${currentUser?.uid}/OferteInregistrate`,
        currentUser?.uid,
        actionText
      );

      showAlert("Oferta înregistrată cu succes!", "success");
    } catch (error) {
      console.error("Eroare la înregistrarea ofertei: ", error);
      showAlert("Eroare la înregistrarea ofertei.", "danger");
    }
  };

  return (
    <>
      <div className="col-lg-12"></div>
      {/* End .col */}
      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="propertyTitle">Titlu oferta</label>
          <input
            type="text"
            className="form-control"
            id="propertyTitle"
            value={titluOferta}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea">
          <label htmlFor="propertyDescription">Nume Doctor</label>
          <input
            type="text"
            className="form-control"
            id="numeUtilizator"
            value={utilizator?.numeUtilizator}
            readOnly
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Tip oferta</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={tipOferta}
            onChange={(e) => setTipOferta(e.target.value)}
            disabled
          >
            <option data-tokens="Status1">Selecteaza tip oferta</option>
            <option data-tokens="Oferta cu discount procentual general">
              Oferta cu discount procentual general
            </option>
            <option data-tokens="Oferta specifică">Oferta specifică</option>
          </select>
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Type</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="type1">Type1</option>
            <option data-tokens="Type2">Type2</option>
            <option data-tokens="Type3">Type3</option>
            <option data-tokens="Type4">Type4</option>
            <option data-tokens="Type5">Type5</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-lg-12 col-xl-12">
        <div className="my_profile_setting_input form-group">
          <label>Valabilă pentru următoarele grade de fidelitate</label>
          <div className="row mt-2">
            <div className="col-sm-auto">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Silver"
                  id="Silver"
                  checked={fidelitySilver}
                  onChange={handleFidelityChange}
                  disabled
                />
                <label className="form-check-label" for="fidelityGradeSilver">
                  Silver
                </label>
              </div>
            </div>
            <div className="col-sm-auto">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Gold"
                  id="Gold"
                  checked={fidelityGold}
                  onChange={handleFidelityChange}
                  disabled
                />
                <label className="form-check-label" for="fidelityGradeGold">
                  Gold
                </label>
              </div>
            </div>
            <div className="col-sm-auto">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="Platinum"
                  id="Platinum"
                  checked={fidelityPlatinum}
                  onChange={handleFidelityChange}
                  disabled
                />
                <label className="form-check-label" for="fidelityGradePlatinum">
                  Platinum
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExamplePrice">Procent</label>
          <input
            type="number"
            className="form-control"
            id="formGroupExamplePrice"
          />
        </div>
      </div> */}
      {tipOferta === "Oferta specifică" ? (
        <>
          <div className="col-lg-4 col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="pretIntreg">Preț întreg</label>
              <input
                type="number"
                className="form-control"
                id="pretIntreg"
                value={pretIntreg}
                onChange={(e) => setPretIntreg(e.target.value)}
                placeholder="Introdu prețul întreg"
                readOnly
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-4 col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="pretRedus">Preț redus</label>
              <input
                type="number"
                className="form-control"
                id="pretRedus"
                value={pretRedus}
                onChange={(e) => setPretRedus(e.target.value)}
                placeholder="Introdu prețul redus"
                readOnly
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-4 col-xl-4">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="procentReducere">Procent reducere</label>
              <input
                type="text"
                className="form-control"
                id="procentReducere"
                value={procentReducere + "%"}
                readOnly
              />
            </div>
          </div>
        </>
      ) : (
        <div className="col-lg-4 col-xl-4">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="procentReducere">Procent reducere</label>
            <input
              type="text"
              className="form-control"
              id="procentReducere"
              value={procentReducere + "%"}
              readOnly
            />
          </div>
        </div>
      )}

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="pretFinal">Pret final (RON)</label>
          <input
            type="text"
            className={`form-control ${noPretFinal && "border-danger"}`}
            id="pretFinal"
            value={pretFinal}
            onChange={(e) => setPretFinal(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      {tipOferta === "Oferta specifică" && (
        <>
          <div className="col-lg-6 col-xl-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="activationDate">Data de activare</label>
              <input
                type="date"
                className="form-control"
                id="activationDate"
                value={dataActivare}
                onChange={(e) => setDataActivare(e.target.value)}
                readOnly
              />
            </div>
          </div>
          {/* End .col */}

          <div className="col-lg-6 col-xl-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="deactivationDate">Data de dezactivare</label>
              <input
                type="date"
                className="form-control"
                id="deactivationDate"
                value={dataDezactivare}
                onChange={(e) => setDataDezactivare(e.target.value)}
                readOnly
              />
            </div>
          </div>
          {/* End .col */}
        </>
      )}
      {/* End .col */}
      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleArea">Area</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleArea"
          />
        </div>
      </div> */}
      {/* End .col */}

      {/* <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Rooms</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
          >
            <option data-tokens="Status1">1</option>
            <option data-tokens="Status2">2</option>
            <option data-tokens="Status3">3</option>
            <option data-tokens="Status4">4</option>
            <option data-tokens="Status5">5</option>
            <option data-tokens="Status6">Other</option>
          </select>
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          {alert.show && (
            <div className={`alert alert-${alert.type} mb-0`}>
              {alert.message}
            </div>
          )}

          <button onClick={handleAddOffer} className="btn btn2 float-end">
            Înregistrare în sistem
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateList;
