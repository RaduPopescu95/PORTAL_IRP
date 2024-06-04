"use client";

import { AlertModal } from "@/components/common/AlertModal";
import CommonLoader from "@/components/common/CommonLoader";
import { useAuth } from "@/context/AuthContext";
import useDataNasterii from "@/hooks/useDataNasterii";
import {
  handleQueryFirestoreSubcollection,
  handleUpdateFirestore,
} from "@/utils/firestoreUtils";
import { emailWithoutSpace } from "@/utils/strintText";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

const ProfileInfo = () => {
  const [initialData, setInitialData] = useState({});
  const { userData, currentUser, setCurrentUser, setUserData, judete } =
    useAuth();
  const {
    dataNasterii,
    handleDayChange,
    handleMonthChange,
    handleYearChange,
    setDataNasterii,
  } = useDataNasterii(userData?.dataNasterii || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [numeUtilizator, setNumeUtilizator] = useState(
    userData?.numeUtilizator || ""
  );
  const [isNoCuimCifCodParafa, setIsNoCuimCifCodParafa] = useState(false);
  const [telefon, setTelefon] = useState(userData?.telefon || "");

  const [judet, setJudet] = useState(userData?.judet || "");
  const [localitate, setLocalitate] = useState(userData?.localitate || "");
  const [titulatura, setTitulatura] = useState(userData?.titulatura || "");
  const [specializare, setSpecializare] = useState(
    userData?.specializare || ""
  );
  const [cuim, setCuim] = useState(userData?.cuim || "");
  const [cif, setCIF] = useState(userData?.cif || "");
  const [tipEnitate, setTipEnitate] = useState(userData?.tipEnitate || "");
  const [codParafa, setCodParafa] = useState(userData?.codParafa || "");
  const [localitati, setLocalitati] = useState([]);
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Setează starea inițială
  useEffect(() => {
    setInitialData({
      email: userData?.email || "",
      numeUtilizator: userData?.numeUtilizator || "",
      telefon: userData?.telefon || "",
      dataNasterii: userData?.dataNasterii || "",
      judet: userData?.judet || "",
      localitate: userData?.localitate || "",
      titulatura: userData?.titulatura || "",
      specializare: userData?.specializare || "",
      cuim: userData?.cuim || "",
    });
  }, [userData]);

  const describeChanges = () => {
    let changes = [];
    Object.entries(initialData).forEach(([key, value]) => {
      let currentValue = eval(key);
      if (value !== currentValue) {
        changes.push(`${key} de la '${value}' la '${currentValue}'`);
      }
    });
    if (changes.length > 0) {
      return `${userData.numeUtilizator} a actualizat: ${changes.join(", ")}`;
    }
    return null;
  };

  const [alert, setAlert] = useState({ message: "", type: "" });

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "" });
  };

  const handleUpdateProfile = async (event) => {
    setButtonPressed(true);
    setIsLoading(true);
    event.preventDefault();
    const emailNew = emailWithoutSpace(email);
    // Verifică dacă parola este confirmată corect și apoi creează utilizatorul
    if (titulatura === "Asistent Medical") {
      setSpecializare("");
    }
    try {
      let user_uid = currentUser.uid;
      let data = {
        ...userData,
        cuim,
        cif,
        codParafa,
        specializare,
        titulatura,
        localitate,
        judet,
        dataNasterii,
        email: emailNew,
        telefon,
        user_uid,
        userType: "Doctor",
        numeUtilizator,
        tipEnitate,
      };
      if (
        !email ||
        !numeUtilizator ||
        !titulatura ||
        titulatura === "Titulatura" ||
        !telefon ||
        !judet ||
        !localitate ||
        !dataNasterii ||
        !tipEnitate ||
        tipEnitate === "Tip de entitate"
      ) {
        setIsLoading(false);
        return;
      }
      if (!cuim && !cif && !codParafa) {
        console.log("noo...", cuim);
        console.log("noo...", cif);
        console.log("noo...", codParafa);
        showAlert("Introduceti cuim/cif/cod parafa!", "danger");
        setIsLoading(false);
        setIsNoCuimCifCodParafa(true);
        return;
      } else {
        setIsNoCuimCifCodParafa(false);
      }
      setUserData(data);

      const actionText = describeChanges();

      await handleUpdateFirestore(`Users/${user_uid}`, data, actionText).then(
        () => {
          console.log("update succesfully....");
          setIsLoading(false);
          showAlert("Actualizare cu succes!", "success");
        }
      );
    } catch (error) {
      showAlert(`Eroare la Actualizare: ${error.message}`, "danger");
      setIsLoading(false);
      console.error("Error signing up: ", error);
    }
  };

  const handleJudetChange = async (e) => {
    const judetSelectedName = e.target.value; // Numele județului selectat, un string
    console.log("judetSelectedName...", judetSelectedName);
    setJudet(judetSelectedName);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

    if (judetSelected) {
      try {
        // Utilizăm judet pentru a interoga Firestore
        const localitatiFromFirestore = await handleQueryFirestoreSubcollection(
          "Localitati",
          "judet",
          judetSelected.judet
        );
        // Presupunem că localitatiFromFirestore este array-ul corect al localităților
        setLocalitati(localitatiFromFirestore);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocalitati([]); // Resetează localitățile în caz de eroare
      }
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
    }
  };
  const handleGetLocalitatiJudet = async () => {
    const judetSelectedName = judet; // Numele județului selectat, un string
    console.log("judetSelectedName...", judetSelectedName);
    setJudet(judetSelectedName);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `judet`
    const judetSelected = judete.find(
      (judet) => judet.judet === judetSelectedName
    );

    if (judetSelected) {
      try {
        // Utilizăm judet pentru a interoga Firestore
        const localitatiFromFirestore = await handleQueryFirestoreSubcollection(
          "Localitati",
          "judet",
          judetSelected.judet
        );
        // Presupunem că localitatiFromFirestore este array-ul corect al localităților
        setLocalitati(localitatiFromFirestore);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocalitati([]); // Resetează localitățile în caz de eroare
      }
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
    }
  };

  useEffect(() => {
    if (judet.length > 0) {
      handleGetLocalitatiJudet();
    }
  }, []);

  return (
    <div className="row">
      {/* <div className="col-lg-12">
                <div className="wrap-custom-file">
                    <input
                        type="file"
                        id="image1"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={uploadProfile}
                    />
                    <label
                        style={
                            profile !== null
                                ? {
                                      backgroundImage: `url(${URL.createObjectURL(
                                          profile
                                      )})`,
                                  }
                                : undefined
                        }
                        htmlFor="image1"
                    >
                        <span>
                            <i className="flaticon-download"></i> Upload Photo{" "}
                        </span>
                    </label>
                </div>
                <p>*minimum 260px x 260px</p>
            </div> */}
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput1">Nume utilizator</label>
          <input
            type="text"
            className={`form-control ${
              !numeUtilizator && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput1"
            placeholder="Nume Utilizator"
            value={numeUtilizator}
            onChange={(e) => setNumeUtilizator(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleEmail">Email</label>
          <input
            type="email"
            className={`form-control ${
              !email && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput3">Nume</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput3"
            placeholder="Nume"
            value={numeUtilizator}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div> */}
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Titulatura</label>
          <select
            className={`selectpicker form-select ${
              (!titulatura && buttonPressed) ||
              (titulatura === "Titulatura" && buttonPressed)
                ? "border-danger"
                : null
            }`}
            data-live-search="true"
            data-width="100%"
            value={titulatura}
            onChange={(e) => setTitulatura(e.target.value)}
          >
            <option data-tokens="SelectRole">Titulatura</option>
            <option data-tokens="Agent/Agency">Asistent Medical</option>
            <option data-tokens="Agent/Agency">Biolog</option>
            <option data-tokens="Agent/Agency">Biochimist</option>
            <option data-tokens="Agent/Agency">Chimist</option>
            <option data-tokens="Agent/Agency">Farmacist</option>
            <option data-tokens="Agent/Agency">Medic</option>
            <option data-tokens="Agent/Agency">Medic Generalist</option>
            <option data-tokens="Agent/Agency">Medic Primar</option>
            <option data-tokens="Agent/Agency">Medic Rezident</option>
            <option data-tokens="Agent/Agency">Medic Specialist</option>

            <option data-tokens="SingleUser">Altele</option>
          </select>
        </div>
      </div>
      {/* End .col */}

      {titulatura !== "Asistent Medical" ? (
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Specializare</label>
            <select
              className={`selectpicker form-select ${
                (!specializare && buttonPressed) ||
                (specializare === "Specializare" && buttonPressed)
                  ? "border-danger"
                  : null
              }`}
              data-live-search="true"
              data-width="100%"
              value={specializare}
              onChange={(e) => setSpecializare(e.target.value)}
            >
              <option data-tokens="SelectRole">Specializare</option>
              <option data-tokens="Agent/Agency">
                Alergologie si imunologie
              </option>
              <option data-tokens="SingleUser">Anatomie Patologica</option>
              <option data-tokens="SingleUser">
                Anestezie si terapie intensiva (ATI)
              </option>
              <option data-tokens="SingleUser">Bacteriologice</option>
              <option data-tokens="SingleUser">Biochimie medicala</option>
              <option data-tokens="SingleUser">Boli Infectioase</option>
              <option data-tokens="SingleUser">Cardiologie</option>
              <option data-tokens="SingleUser">Cardiologie pediatrica</option>
              <option data-tokens="SingleUser">
                Chirurgie cardiovasculara
              </option>
              <option data-tokens="SingleUser">Chirurgie generala</option>
              <option data-tokens="SingleUser">
                Chirurgie orala si maxilofaciala
              </option>
              <option data-tokens="SingleUser">Chirurgie pediatrica</option>
              <option data-tokens="SingleUser">
                Chirurgie plastica, reconstructiva si microchirurgie
              </option>
              <option data-tokens="SingleUser">Chirurgie toracica</option>
              <option data-tokens="SingleUser">Chirurgie vasculara</option>
              <option data-tokens="SingleUser">Dermatovenerologie</option>
              <option data-tokens="SingleUser">
                Diabet zaharat, nutritie si boli metabolice
              </option>
              <option data-tokens="SingleUser">Endocrinologie</option>
              <option data-tokens="SingleUser">Epidemiologie</option>
              <option data-tokens="SingleUser">Expertiza medicala</option>
              <option data-tokens="SingleUser">Farmacist</option>
              <option data-tokens="SingleUser">Farmacologie clinica</option>
              <option data-tokens="SingleUser">Gastroenterologie</option>
              <option data-tokens="SingleUser">
                Gastroenterologie Pediatrica
              </option>
              <option data-tokens="SingleUser">Genetica medicala</option>
              <option data-tokens="SingleUser">
                Geriatrie si gerontologie
              </option>
              <option data-tokens="SingleUser">Hematologie</option>
              <option data-tokens="SingleUser">Hemostaza</option>
              <option data-tokens="SingleUser">Igiena</option>
              <option data-tokens="SingleUser">Imunologie medicala</option>
              <option data-tokens="SingleUser">Medicina de familie</option>
              <option data-tokens="SingleUser">Medicina de laborator</option>
              <option data-tokens="SingleUser">Medicina de urgenta</option>
              <option data-tokens="SingleUser">
                Medicina fizica si balneologie
              </option>
              <option data-tokens="SingleUser">Medicina generala</option>
              <option data-tokens="SingleUser">Medicina interna</option>
              <option data-tokens="SingleUser">Medicina legala</option>
              <option data-tokens="SingleUser">Medicina muncii</option>
              <option data-tokens="SingleUser">Medicina nucleara</option>
              <option data-tokens="SingleUser">Medicina sportiva</option>
              <option data-tokens="SingleUser">Microbiologie medicala</option>
              <option data-tokens="SingleUser">Nefrologie</option>
              <option data-tokens="SingleUser">Nefrologie pediatrica</option>
              <option data-tokens="SingleUser">Neonatologie</option>
              <option data-tokens="SingleUser">Neurochirurgie</option>
              <option data-tokens="SingleUser">Neurologie</option>
              <option data-tokens="SingleUser">Neurologie pediatrica</option>
              <option data-tokens="SingleUser">Obstetrica ginecologie</option>
              <option data-tokens="SingleUser">Oftalmologie</option>
              <option data-tokens="SingleUser">Oncologie medicala</option>
              <option data-tokens="SingleUser">Oncologie pediatrica</option>
              <option data-tokens="SingleUser">Oncologie si hematologie</option>
              <option data-tokens="SingleUser">
                Oncologie si traumatologie
              </option>
              <option data-tokens="SingleUser">Otorinolaringologie ORL</option>
              <option data-tokens="SingleUser">Pediatrie</option>
              <option data-tokens="SingleUser">Pneumologie</option>
              <option data-tokens="SingleUser">Pneumologie pediatrica</option>
              <option data-tokens="SingleUser">Psihiatrie</option>
              <option data-tokens="SingleUser">Psihiatrie pediatrica</option>
              <option data-tokens="SingleUser">
                Radiologie si Imagistica medicala
              </option>
              <option data-tokens="SingleUser">Radioterapie</option>
              <option data-tokens="SingleUser">Reumatologie</option>
              <option data-tokens="SingleUser">
                Sanatate publica si management
              </option>
              <option data-tokens="SingleUser">Urologie</option>
              <option data-tokens="SingleUser">Altele</option>
            </select>
          </div>
        </div>
      ) : null}

      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Judet</label>
          <select
            className={`selectpicker form-select ${
              (!judet && buttonPressed) || (judet === "Judet" && buttonPressed)
                ? "border-danger"
                : null
            }`}
            data-live-search="true"
            data-width="100%"
            value={judet}
            onChange={handleJudetChange}
          >
            <option data-tokens="SelectRole">Judet</option>
            {judete &&
              judete.map((judet, index) => (
                <option key={index} value={judet.judet}>
                  {judet.judet}
                </option>
              ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Localitate</label>
          <select
            className={`selectpicker form-select ${
              (!localitate && buttonPressed) ||
              (localitate === "Localitate" && buttonPressed)
                ? "border-danger"
                : null
            }`}
            data-live-search="true"
            data-width="100%"
            value={localitate}
            onChange={(e) => setLocalitate(e.target.value)}
          >
            {localitati.map((location, index) => (
              <option key={index} value={location.localitate}>
                {location.localitate}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput5">Telefon</label>
          <input
            type="text"
            className={`form-control ${
              !telefon && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput5"
            placeholder="Telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput7">Data nașterii</label>
          {/* <input
            type="text"
            className={`form-control ${
              !dataNasterii && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput7"
            placeholder="Data Nasterii"
            value={dataNasterii}
            readOnly
          /> */}
          <div
            className={`form-control d-flex align-items-center ${
              !telefon && buttonPressed && "border-danger"
            }`}
          >
            <select
              value={new Date(dataNasterii).getDate()}
              onChange={handleDayChange}
            >
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              value={new Date(dataNasterii).getMonth()}
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              value={new Date(dataNasterii).getFullYear()}
              onChange={handleYearChange}
            >
              {Array.from({ length: 120 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Titulatura</label>
          <select
            className={`selectpicker form-select ${
              (!tipEnitate && buttonPressed) ||
              (tipEnitate === "Tip de entitate" && buttonPressed)
                ? "border-danger"
                : null
            }`}
            data-live-search="true"
            data-width="100%"
            value={tipEnitate}
            onChange={(e) => setTipEnitate(e.target.value)}
          >
            <option data-tokens="SelectRole">Tip de entitate</option>
            <option data-tokens="Agent/Agency">PFA</option>
            <option data-tokens="Agent/Agency">PFI</option>
          </select>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">CUIM</label>
          <input
            type="text"
            className={`form-control ${
              isNoCuimCifCodParafa && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput9"
            placeholder="CUIM"
            value={cuim}
            onChange={(e) => setCuim(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">CIF</label>
          <input
            type="text"
            className={`form-control ${
              isNoCuimCifCodParafa && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput9"
            placeholder="CIF"
            value={cif}
            onChange={(e) => setCIF(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="formGroupExampleInput9">Cod Parafa</label>
          <input
            type="text"
            className={`form-control ${
              isNoCuimCifCodParafa && buttonPressed && "border-danger"
            }`}
            id="formGroupExampleInput9"
            placeholder="Cod Parafa"
            value={codParafa}
            onChange={(e) => setCodParafa(e.target.value)}
          />
        </div>
      </div>
      {/* End .col */}

      {/* <div className="col-xl-12">
                <div className="my_profile_setting_input form-group">
                    <label htmlFor="formGroupExampleInput13">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="formGroupExampleInput13"
                    />
                </div>
            </div> */}
      {/* End .col */}

      {/* <div className="col-xl-12">
                <div className="my_profile_setting_textarea">
                    <label htmlFor="exampleFormControlTextarea1">
                        About me
                    </label>
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="7"
                    ></textarea>
                </div>
            </div> */}
      {/* End .col */}

      <div className="col-xl-12 text-right">
        <div className="my_profile_setting_input">
          {/* <button className="btn btn1">View Public Profile</button> */}
          <button className="btn btn2" onClick={handleUpdateProfile}>
            {isLoading ? <CommonLoader /> : "Actualizeaza Profil"}
          </button>
        </div>
      </div>
      {/* End .col */}
      <AlertModal
        message={alert.message}
        type={alert.type}
        onClose={closeAlert}
      />
    </div>
  );
};

export default ProfileInfo;
