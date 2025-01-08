"use client";

import {
  addKeyword,
  addLocation,
} from "../../features/properties/propertiesSlice";
import PricingRangeSlider from "./PricingRangeSlider";
import CheckBoxFilter from "./CheckBoxFilter";
import GlobalSelectBox from "./GlobalSelectBox";
import { useRouter } from "next/navigation";
import { jd } from "@/data/judeteLocalitati";
import {
  handleQueryFirestoreSubcollection,
  uploadJudete,
} from "@/utils/firestoreUtils";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const GlobalFilter = ({ className = "" }) => {
  const router = useRouter();
  const { judete, setSearchQueryPateneri, searchQueryParteneri } = useAuth();
  const [selectedJudet, setSelectedJudet] = useState("");
  const [selectedLocalitate, setSelectedLocalitate] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [localitati, setLocalitati] = useState([]);
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);

  // Handler pentru schimbarea selectiei de judete
  const handleJudetChange = async (e) => {
    const judetSelectedName = e.target.value; // Numele județului selectat, un string

    setSelectedJudet(judetSelectedName);
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

  const handleLocalitateChange = (e) => {
    // Acesta ar trebui să arate numele localității ca string
    setSelectedLocalitate(e.target.value);
    setIsLocalitateSelected(!!e.target.value);
  };
  const handleCategorieChange = (e) => {
    setSelectedCategorie(e.target.value);
    setIsCategorieSelected(!!e.target.value);
  };

  // submit handler
  const submitHandler = () => {
    if (!selectedCategorie && !selectedLocalitate && !selectedJudet) {
      router.push(`/parteneri`);
      return;
    }

    if (selectedJudet && selectedCategorie) {
      router.push(
        `/${selectedCategorie.toLocaleLowerCase()}/${selectedCategorie.toLocaleLowerCase()}-${selectedJudet.toLocaleLowerCase()}`
      );
      return;
    }

    if (selectedJudet && !selectedLocalitate) {
      // setIsLocalitateSelected(!!selectedLocalitate);
      // return;
      router.push(`/parteneri/parteneri-${selectedJudet.toLocaleLowerCase()}`);
      return;
    }

    if (selectedLocalitate && selectedCategorie) {
      router.push(
        `/${selectedCategorie.toLocaleLowerCase()}/${selectedCategorie.toLocaleLowerCase()}-${selectedLocalitate.toLocaleLowerCase()}`
      );
      return;
    }

    if (selectedLocalitate) {
      router.push(
        `/parteneri/parteneri-${selectedLocalitate.toLocaleLowerCase()}`
      );
      return;
    }

    if (selectedCategorie) {
      router.push(`/${selectedCategorie.toLocaleLowerCase()}`);
      return;
    }
  };

  return (
    <div className={`home1-advnc-search ${className}`}>
      <ul className="h1ads_1st_list mb0">
        <li className="list-inline-item">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Cauta dupa cuvant..."
              value={searchQueryParteneri}
              onChange={(e) => setSearchQueryPateneri(e.target.value)}
            />
          </div>
        </li>
        {/* End li */}

        <li className="list-inline-item">
          <div className="search_option_two">
            <div className="candidate_revew_select">
              <select
                className={`selectpicker w100 form-select show-tick ${
                  !isCateogireSelected ? "border-danger" : ""
                }`}
                onChange={handleCategorieChange}
                value={selectedCategorie}
              >
                <option value="">Categorie</option>
                <option data-tokens="Autovehicule">Autovehicule</option>
                <option data-tokens="Servicii">Servicii</option>
                <option data-tokens="Cafenele">Cafenele</option>
                <option data-tokens="Restaurante">Restaurante</option>
                <option data-tokens="Hoteluri">Hoteluri</option>
                <option data-tokens="Altele">Altele</option>
              </select>
            </div>
          </div>
        </li>
        {/* End li */}

        <li className="list-inline-item">
          <div className="search_option_two">
            <div className="candidate_revew_select">
              <select
                className={`selectpicker w100 form-select show-tick ${
                  !isJudetSelected ? "border-danger" : ""
                }`}
                onChange={handleJudetChange}
                value={selectedJudet}
              >
                <option value="">Judete</option>
                {judete &&
                  judete.map((judet, index) => (
                    <option key={index} value={judet.judet}>
                      {judet.judet}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </li>
        {/* End li */}
        {selectedJudet === "Bucuresti" && (
          <li className="list-inline-item">
            <div className="search_option_two">
              <div className="candidate_revew_select">
                <select
                  className={`selectpicker w100 form-select show-tick ${
                    !isLocalitateSelected ? "border-danger" : ""
                  }`}
                  onChange={handleLocalitateChange}
                  value={selectedLocalitate}
                >
                  <option value="">Sector</option>
                  {localitati.map((location, index) => (
                    <option key={index} value={location.localitate}>
                      {location.localitate}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </li>
        )}
        {/* End li */}

        {/* <li className="list-inline-item">
          <div className="small_dropdown2">
            <div
              id="prncgs"
              className="btn dd_btn"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              <span>Price</span>
              <label htmlFor="InputEmail2">
                <span className="fa fa-angle-down"></span>
              </label>
            </div>
            <div className="dd_content2 dropdown-menu">
              <div className="pricing_acontent">
                <PricingRangeSlider />
              </div>
            </div>
          </div>
        </li> */}
        {/* End li */}

        {/* <li className="custome_fields_520 list-inline-item">
          <div className="navbered">
            <div className="mega-dropdown ">
              <span
                className="dropbtn"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                Advanced <i className="flaticon-more pl10 flr-520"></i>
              </span>

              <div className="dropdown-content dropdown-menu ">
                <div className="row p15">
                  <div className="col-lg-12">
                    <h4 className="text-thm3 mb-4">Amenities</h4>
                  </div>

                  <CheckBoxFilter />
                </div>
            

                <div className="row p15 pt0-xsd">
                  <div className="col-lg-12 col-xl-12">
                    <ul className="apeartment_area_list mb0">
                      <GlobalSelectBox />
                    </ul>
                  </div>
                </div>
           
              </div>
    
            </div>
          </div>
        </li> */}
        {/* End li */}

        <li className="list-inline-item">
          <div className="search_option_button">
            <button
              onClick={submitHandler}
              type="submit"
              className="btn btn-thm"
            >
              Cauta
            </button>
          </div>
        </li>
        {/* End li */}
      </ul>
    </div>
  );
};

export default GlobalFilter;
