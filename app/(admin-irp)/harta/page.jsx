"use client";

import React, { useEffect, useState } from "react";
import dataHidranti from "../../../data/hidranti.json";
import { MdLocalFireDepartment, MdMyLocation, MdFireHydrantAlt, MdFireTruck, MdLocationCity } from "react-icons/md";
import { FaTownHall, FaBiohazard, FaFireExtinguisher } from "react-icons/fa";
import MyMapView from "@/components/harta/MapView";
import MultiSelectDialog from "@/components/harta/MultiSelectDialog";
import SubunitateDialog from "@/components/harta/SubunitateDialog";
import PrimariiDialog from "@/components/harta/PrimariiDialog";
import SevesoDialog from "@/components/harta/SevesoDialog";
import HidrantiCallout from "@/components/harta/HidrantCallout";
import { subunitatiMarkers } from "@/data/subunitati";
import { sevesoMarkers } from "@/data/seveso";
import SubunitatiCallout from "@/components/harta/SubunitatiCallout";
import CustomMarker from "@/components/harta/CustomMarker";
import NavigationDialog from "@/components/harta/NavigationDialog";

// Exemplu: importă coordonatele pentru raionul Gaești și alte raioane
import { gaestiCoordinates } from "@/data/gaesti";
import { moreniCoordinates } from "@/data/moreni";
import { targovisteCoordinates } from "@/data/targoviste";
import { pucioasaCoordinates } from "@/data/pucioasa";
import { tituCoordinates } from "@/data/titu";
import { coordonateVoinesti } from "@/data/voinesti";
import { coordonateCornesti } from "@/data/cornesti";
import { coordonateVisina } from "@/data/visina";
import { coordonateRacari } from "@/data/racari";
import { primariiMarkers } from "@/data/primarii";
import { FiHome } from "react-icons/fi";
// Helper: Calculul distanței (formula haversine)
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // raza Pământului în km
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // distanța în km
  return d;
};


// Indicator de încărcare simplu
const LoadingIndicator = () => <div>Loading...</div>;

export default function MapContainer() {
  const [location, setLocation] = useState("");
  const [zoomLevels, setZoomLevels] = useState("");
  const [closestHidrant, setClosestHidrant] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [visible, setVisible] = useState(false);
  const [wasPressed, setWasPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingHidranti, setLoadingHidranti] = useState(true);
  const [loadingMapPress, setLoadingMapPress] = useState(false);
  const [calloutData, setData] = useState({});
  const [primarieData, setPrimarieData] = useState({});
  const [sevesoData, setSevesoData] = useState({});
  const [situatieSeveso, setSituatie] = useState("");

  const [region, setRegion] = useState({
    latitude: 44.929,
    longitude: 25.4254,
    latitudeDelta: 0.4922,
    longitudeDelta: 0.4421,
  });

  const [filters, setFilters] = useState({
    raioane: false,
    hidranti: false,
    primarii: false,
    seveso: false,
    svsu: false,
    spsu: false,
    subunitati: false,
  });

  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const [raionText, setRaionText] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [place, setPlace] = useState("");
  const [hidranti, setHidranti] = useState(dataHidranti);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [displayedMarkers, setDisplayedMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const transformCoordinates = (coords) =>
    coords.map(({ latitude, longitude }) => ({
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    }));
  

  // Stiluri inline pentru containere
  const containerStyle = {
    width: "100vw",
    height: "100vh",
    position: "relative",
  };

  const polygonOptions = {
    fillColor: "rgba(141, 211, 199, 0.4)",
    fillOpacity: 0.4,
    strokeColor: "rgba(141, 211, 199, 0.8)",
    strokeOpacity: 0.8,
    strokeWeight: 2,
  };

  const overlayStyle = {
    marginTop: 0,
  };

  const mapWrapperStyle = {
    width: "100%",
    height: "100%",
  };

  const textContainerStyle = {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontSize: "16px",
    color: "black",
  };

  // Funcția ce verifică dacă un marker este vizibil în regiunea curentă
// Modifică isVisible astfel:
const isVisible = (hidrant, viewSize, reg) => {
  const { Latitudine, Longitudine } = hidrant.Localizare;
  return (
    parseFloat(Latitudine) >= reg.latitude - reg.latitudeDelta / viewSize &&
    parseFloat(Latitudine) <= reg.latitude + reg.latitudeDelta / viewSize &&
    parseFloat(Longitudine) >= reg.longitude - reg.longitudeDelta / viewSize &&
    parseFloat(Longitudine) <= reg.longitude + reg.longitudeDelta / viewSize
  );
};

// și apoi folosește un viewSize mai mic pentru zonă mai mare (de exemplu 0.5 sau 0.6):
const filterMarkersByZoom = (latitudeDelta, reg) => {
  const zoomLevel = Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
  setZoomLevels(zoomLevel);

  let filteredMarkers = [];

  if (zoomLevel >= 13) {
    // Zoom mare: Afișează toți hidranții vizibili în zona curentă
    filteredMarkers = hidranti.filter((hidrant) =>
      isVisible(hidrant, 0.3, reg)
    );
  } else if (zoomLevel >= 15){
    filteredMarkers = hidranti.filter((hidrant) =>
      isVisible(hidrant, 0, reg)
    );
  }else {
    // Zoom mic (hartă îndepărtată): afișează un număr redus de hidranți pentru performanță
    const sparseMarkers = hidranti.filter((_, index) => index % 15 === 0);
    filteredMarkers = sparseMarkers.filter((hidrant) =>
      isVisible(hidrant, 0.5, reg)
    );
  }

  console.log(`Markers displayed at zoom ${zoomLevel}:`, filteredMarkers.length);

  return filteredMarkers;
};



  const handleFilters = (selectedFilters) => {
    console.log("filters...", filters, selectedFilters);
    setFilters(selectedFilters);
  };

  const handleMarkerPress = (marker) => {
    setWasPressed(true);
    let latitude, longitude, title;
  
    // Pentru hidranți (din hidranti.json)
    if (marker.Localizare) {
      latitude = parseFloat(marker.Localizare.Latitudine);
      longitude = parseFloat(marker.Localizare.Longitudine);
      // Construiește un titlu bazat pe informații suplimentare, dacă există
      title =
        marker.title ||
        `${marker.Localitate ? marker.Localitate + " - " : ""}${
          marker.Stradă ? marker.Stradă + " " : ""
        }${marker["NumărAdministrativ"] || ""}`.trim();
    }
    // Pentru markerii care vin din alte fișiere (subunități, Seveso, primării)
    else if (marker.coordinates) {
      latitude = marker.coordinates.latitude;
      longitude = marker.coordinates.longitude;
      // Folosește marker.title dacă există, altfel încearcă alte proprietăți specifice
      title = marker.title || marker.numePrimar || marker.nrGis || "Markerul selectat";
    }
    // Fallback: dacă markerul are deja proprietăți latitude și longitude
    else {
      latitude = marker.latitude;
      longitude = marker.longitude;
      title = marker.title || "Markerul selectat";
    }
  
    setSelectedMarker({
      ...marker,
      latitude,
      longitude,
      title,
    });
  };
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Setează regiunea cu un delta prestabilit
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          // Setează locația utilizatorului
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          setErrorMsg("Permission to access location was denied");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setErrorMsg("Geolocation is not supported by this browser.");
    }
  }, []);
  
  const handleGetLocation = () => {
    alert(`Începem să preluăm locația...`);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Setăm regiunea cu valorile primite
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
  
          // Setăm locația utilizatorului în state
          setUserLocation({ latitude, longitude });
  
          // Afișăm alerta
          alert(`Locație preluată cu succes!
  Latitude: ${latitude},
  Longitude: ${longitude}`);
        },
        (error) => {
          // Alerta cu detalii despre eroare
          alert(`Eroare la obținerea locației: ${error.code} - ${error.message}`);
          setErrorMsg("Permisiunea de a accesa locația a fost refuzată.");
          console.error("Eroare la obținerea locației:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setErrorMsg("Geolocația nu este suportată de browserul actual.");
      alert("Geolocația nu este suportată de browserul actual.");
    }
  };
  
  
  
  // Funcție pentru a obține coordonatele dintr-un loc (adaptată pentru web)
  const getCoordsFromName = async (loc, details) => {
    const data = {
      title: details?.structured_formatting?.main_text || "",
      coordinates: loc,
      place: details,
    };
    console.log("Test...", data);
    writeData(data, "Primarii");
    const regionObj = {
      latitude: loc.lat,
      longitude: loc.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    };
    setRegion(regionObj);
    setMarkerCoordinates(regionObj);
    const isInPolygon = checkIfInPolygon(regionObj);
    let raion = "";
    switch (isInPolygon) {
      case "targoviste":
        raion = "Raion Targoviste";
        break;
      case "gaesti":
        raion = "Raion Gaesti";
        break;
      case "moreni":
        raion = "Raion Moreni";
        break;
      case "pucioasa":
        raion = "Raion Pucioasa";
        break;
      case "titu":
        raion = "Raion Titu";
        break;
      default:
        raion = "";
        break;
    }
    setRaionText(raion);
  };

  const onMapRegionChange = (reg) => {
    setRegion(reg);
  };

  const onMapRegionChangeComplete = (reg) => {
    if (filters.hidranti){
      setRegion(reg); // Actualizează starea pentru a menține noua poziție a hărții
      setLoadingHidranti(true);
      console.log("Region change completed:", reg);
      const result = filterMarkersByZoom(reg.latitudeDelta, reg);
      setDisplayedMarkers(result);
      setLoadingHidranti(false);

    }
  };
  

  // Funcție pentru a verifica dacă un punct se află într-un poligon
  const checkIfInPolygon = ({ latitude, longitude }) => {
    const point = { latitude, longitude };
    const polygons = {
      gaesti: gaestiCoordinates,
      targoviste: targovisteCoordinates,
      moreni: moreniCoordinates,
      pucioasa: pucioasaCoordinates,
      titu: tituCoordinates,
      voinesti: coordonateVoinesti,
      cornesti: coordonateCornesti,
      visina: coordonateVisina,
      racari: coordonateRacari,
    };

    const pointInPolygon = (point, polygon) => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude;
        const yi = polygon[i].longitude;
        const xj = polygon[j].latitude;
        const yj = polygon[j].longitude;
        const intersect =
          yi > point.longitude !== yj > point.longitude &&
          point.latitude < ((xj - xi) * (point.longitude - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };

    for (const [key, polygon] of Object.entries(polygons)) {
      if (pointInPolygon(point, polygon)) return key;
    }
    return "";
  };

  const handleGetDirections = () => {
    if (selectedMarker) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.latitude},${selectedMarker.longitude}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  // Funcționalitate de "map press" pentru web
  const handleMapPress = async (event) => {
    setLoadingMapPress(true);
    setAddressValue("");
    setRaionText("");
    setMarkerCoordinates(null);
    setLocation("");
    if (wasPressed) {
      setAddressValue("");
      setRaionText("");
      setMarkerCoordinates(null);
      setLocation("");
      setWasPressed(false);
      setLoadingMapPress(false);
      setMarkerCoordinates(null);
    } else {
      setWasPressed(true);
      const { lat, lng } = event;
      const coordinate = { latitude: lat, longitude: lng };
      const isInPolygon = checkIfInPolygon(coordinate);
      console.log("Map press...", coordinate);
      const result = await getAddress(lat, lng);
      console.log(result.display_name);
      setLocation(result.display_name);
      const regionObj = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(regionObj);
      setMarkerCoordinates(regionObj);
      let raion = "";
      switch (isInPolygon) {
        case "targoviste":
          raion = "Raion Targoviste";
          break;
        case "gaesti":
          raion = "Raion Gaesti";
          break;
        case "moreni":
          raion = "Raion Moreni";
          break;
        case "pucioasa":
          raion = "Raion Pucioasa";
          break;
        case "titu":
          raion = "Raion Titu";
          break;
        case "voinesti":
          raion = "Raion Voinesti";
          break;
        case "cornesti":
          raion = "Raion Cornesti";
          break;
        case "racari":
          raion = "Raion Racari";
          break;
        case "visina":
          raion = "Raion Visina";
          break;
        default:
          raion = "";
          break;
      }
      setRaionText(raion);
      console.log("Coordinate:", coordinate, "Polygon:", isInPolygon);
      setLoadingMapPress(false);
    }
    setLoadingMapPress(false);
  };

  const handleLocationPress = () => {
    if (closestHidrant) {
      const { latitude, longitude } = closestHidrant.hidrant;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const handleZonaUrgenta = (sit) => {
    console.log("situatie...", sit);
    setSituatie(sit === situatieSeveso ? "" : sit);
  };

   


    // Funcția ce caută cel mai apropiat hidrant față de locația utilizatorului
    const goToNearestHydrant = () => {
      if (!userLocation) return;
      let nearestHydrant = null;
      let minDistance = Infinity;
      dataHidranti.forEach((hidrant) => {
        const hydrantCoords = {
          latitude: parseFloat(hidrant.Localizare.Latitudine),
          longitude: parseFloat(hidrant.Localizare.Longitudine),
        };
        const distance = haversineDistance(userLocation, hydrantCoords);
        if (distance < minDistance) {
          minDistance = distance;
          nearestHydrant = hidrant; // Folosește "hidrant", nu "hydrant"
        }
      });
      
  
      if (nearestHydrant) {
        // Deschide navigarea către hidrantul cel mai apropiat
        const lat = parseFloat(nearestHydrant.Localizare.Latitudine);
        const lng = parseFloat(nearestHydrant.Localizare.Longitudine);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
        window.open(url, "_blank");
      }
    };
  return (
    <div style={containerStyle}>
      <div style={overlayStyle}>
        {/* Dacă ai o variantă pentru MapInput, o poți include aici */}
      </div>

      <div style={mapWrapperStyle}>
        <MyMapView
          region={region}
          onRegionChangeComplete={onMapRegionChangeComplete}
          handleMapPress={handleMapPress}
          setVisible={setVisible}
          visible={visible}
          zoomLevel={zoomLevels}
          goToNearestHydrant={goToNearestHydrant}
          filters={filters}  // <-- Asigură-te că filtrele sunt transmise aici
          handleFilters={handleFilters}
          userLocation={userLocation}
          open={Boolean(selectedMarker)}
          marker={selectedMarker}
          onClose={() => setSelectedMarker(null)}
          onConfirm={handleGetDirections}
          handleGetLocation={handleGetLocation}
        >
          {filters.raioane && (
            <>
              {/* Exemplu: desenează poligoane pe hartă */}
            </>
          )}

          {filters.hidranti &&
            displayedMarkers.length > 0 &&
            displayedMarkers.map((c, index) => (
              <CustomMarker
              key={`hidranti-${index}`}
              position={{
                lat: c.Localizare.Latitudine,
                lng: c.Localizare.Longitudine,
              }}
              onClick={() => handleMarkerPress(c)}
            >
        
                <MdFireHydrantAlt size={24} color="blue" />
            </CustomMarker>
            ))}
          {filters.primarii &&
            primariiMarkers.length > 0  &&
            primariiMarkers.map((c, index) => (
              <CustomMarker
              key={`primarie-${index}`}
              position={{
                lat: c.coordinates.latitude,
                lng:  c.coordinates.longitude,
              }}
              onClick={() => handleMarkerPress(c)}
            >
        
        <MdLocationCity size={24} color="black" />
            </CustomMarker>
            ))}

          

{filters.seveso &&
  sevesoMarkers.length > 0 &&
  sevesoMarkers.map((c, index) => (
    <CustomMarker
      key={`seveso-${index}`}
      position={{
        lat: c.coordinates.latitude,
        lng: c.coordinates.longitude,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Icon-ul ce declanșează handleMarkerPress */}
        <div onClick={() => handleMarkerPress(c)}>
          <FaBiohazard size={40} color="orange" />
        </div>
        {/* Callout-ul ce declanșează setSevesoData; stopPropagation previne declanșarea onClick-ului părintelui */}
        {/* <div onClick={(e) => { e.stopPropagation(); setSevesoData(c); }}>
          <SevesoCallout marker={c} name="fire-hydrant" />
        </div> */}
        {/* Condiționale pentru situații */}
        {situatieSeveso === "Situatia 2" && c.zonaDoi && (
          <SituatiaDoi c={c} index={index} />
        )}
        {situatieSeveso === "Situatia 1" && c.zonaUnu && (
          <SituatiaUnu c={c} index={index} />
        )}
        {situatieSeveso === "RezerveBleve" && c.rezerveBleve && (
          <RezerveBleve c={c} index={index} />
        )}
      </div>
    </CustomMarker>
  ))}


          {/* {filters.svsu &&
            primariiMarkers.length > 0 &&
            primariiMarkers.map((c, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div onClick={() => handleMarkerPress(c)}>
                  <FaFireExtinguisher size={40} color="black" />
                </div>
                <div>
                  <p>Custom Callout for svsu</p>
                </div>
              </div>
            ))} */}

          {/* {filters.spsu &&
            primariiMarkers.length > 0 &&
            primariiMarkers.map((c, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div onClick={() => handleMarkerPress(c)}>
                  <img src="/spsu.png" alt="spsu" style={{ height: 30, width: 30 }} />
                </div>
                <div>
                  <p>Custom Callout for spsu</p>
                </div>
              </div>
            ))} */}

          {filters.subunitati &&
            subunitatiMarkers.map((c, index) => (

              <CustomMarker
              key={`subunitati-${index}`}
              position={{
                lat: c.coordinates.latitude,
                lng: c.coordinates.longitude,
              }}
              onClick={() => handleMarkerPress(c)}
            >
        
                  <MdFireTruck size={40} color="red" />
             
         
            
              </CustomMarker>
            ))}

          {markerCoordinates && (
            <div style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
              <p>
                Marker at: {markerCoordinates.latitude}, {markerCoordinates.longitude}
              </p>
            </div>
          )}

{/* { userLocation && userLocation.latitude && userLocation.longitude && (
  <CustomMarker position={{ lat: userLocation.latitude, lng: userLocation.longitude }}>
    <MdMyLocation size={30} color="green" />
  </CustomMarker>
)} */}

        </MyMapView>
      </div>

      {(raionText || loadingMapPress) && (
        <div style={{ ...textContainerStyle, bottom: "120px" }}>
          {loadingMapPress ? <LoadingIndicator /> : <p>{raionText}</p>}
        </div>
      )}

      {(location || loadingMapPress) && (
        <div style={{ ...textContainerStyle, bottom: "60px" }}>
          {loadingMapPress ? <LoadingIndicator /> : <p>{location}</p>}
        </div>
      )}

      {/* <MultiSelectDialog setVisible={setVisible} visible={visible} handleFilters={handleFilters} /> */}
      {/* <SubunitateDialog setData={setData} visible={Boolean(calloutData.title)} calloutData={calloutData} />
      <PrimariiDialog setData={setPrimarieData} visible={Boolean(primarieData.title)} calloutData={primarieData} />
      <SevesoDialog
        setData={setSevesoData}
        visible={Boolean(sevesoData.title)}
        calloutData={sevesoData}
        handleZonaUrgenta={handleZonaUrgenta}
        situatieSeveso={situatieSeveso}
      /> */}
          {/* Dialogul de navigare */}
          {/* <NavigationDialog
        open={Boolean(selectedMarker)}
        marker={selectedMarker}
        onClose={() => setSelectedMarker(null)}
        onConfirm={handleGetDirections}
      /> */}

 

    </div>
  );
}
