"use client";

import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon, OverlayView } from "@react-google-maps/api";
import { MdFilterList, MdFireHydrantAlt, MdFullscreen, MdMap, MdOutlineHome, MdOutlineLogout, MdSatellite, MdMyLocation } from "react-icons/md";

// Importă coordonatele din folderul de date
import { gaestiCoordinates } from "@/data/gaesti";
import { moreniCoordinates } from "@/data/moreni";
import { targovisteCoordinates } from "@/data/targoviste";
import { pucioasaCoordinates } from "@/data/pucioasa";
import { tituCoordinates } from "@/data/titu";
import { coordonateVoinesti } from "@/data/voinesti";
import { coordonateCornesti } from "@/data/cornesti";
import { coordonateVisina } from "@/data/visina";
import { coordonateRacari } from "@/data/racari";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleLogout } from "@/utils/authUtils";
import MultiSelectDialog from "./MultiSelectDialog";
import NavigationDialog from "./NavigationDialog";

// Componenta PulsingMarker adăugată (nu am eliminat alt cod sau comentarii)
const PulsingMarker = ({ position, onClick }) => {
  const markerStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    backgroundColor: "#0047AB",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
  };

  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div onClick={onClick} style={markerStyle} className="pulse-marker" />
    </OverlayView>
  );
};

/* 
  Adaugă următoarele stiluri CSS în fișierul tău global sau modulul CSS:
  
  .pulse-marker {
    animation: pulsate 1.5s ease-out infinite;
  }
  
  @keyframes pulsate {
    0% {
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.9);
      opacity: 1;
    }
  }
*/

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const MyMapView = ({
  region,
  handleMapPress,
  onRegionChangeComplete,
  setVisible,
  visible,
  zoomLevel,
  children,
  filters,
  goToNearestHydrant,
  userLocation,
  open,
  marker,
  onClose,
  onConfirm,
  handleFilters
}) => {
  const [mapType, setMapType] = useState("standard");
  const [mapInstance, setMapInstance] = useState(null);
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAX3rTsopgsc4EvDoA0yT_3nXes6sD8uM0", // Înlocuiește cu cheia ta
  });
  const { currentUser, userData, loading, isAdmin, isPowerAdmin } = useAuth();

  const toggleMapType = () =>
    setMapType((current) => (current === "standard" ? "satellite" : "standard"));

  const center = { lat: region.latitude, lng: region.longitude };

  const onLoad = (map) => setMapInstance(map);

  const onIdle = () => {
    if (!mapInstance) return;
    const newCenter = mapInstance.getCenter();
    const newZoom = mapInstance.getZoom();
    onRegionChangeComplete &&
      onRegionChangeComplete({
        latitude: newCenter.lat(),
        longitude: newCenter.lng(),
        latitudeDelta: 360 / Math.pow(2, newZoom),
        longitudeDelta: 360 / Math.pow(2, newZoom),
      });
  };

  // Funcție pentru a transforma coordonatele din { latitude, longitude } în { lat, lng }
  const transformCoordinates = (coords) =>
    coords.map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude }));

  // Opțiuni pentru poligoane pentru fiecare raion
  const gaestiPolygonOptions = {
    fillColor: "rgba(0,150,136,0.4)",      // Teal
    fillOpacity: 0.4,
    strokeColor: "rgba(0,150,136,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const moreniPolygonOptions = {
    fillColor: "rgba(255,235,59,0.4)",      // Galben intens
    fillOpacity: 0.4,
    strokeColor: "rgba(255,235,59,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const targovistePolygonOptions = {
    fillColor: "rgba(244,67,54,0.4)",       // Roșu intens
    fillOpacity: 0.4,
    strokeColor: "rgba(244,67,54,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const pucioasaPolygonOptions = {
    fillColor: "rgba(156,39,176,0.4)",      // Mov
    fillOpacity: 0.4,
    strokeColor: "rgba(156,39,176,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const tituPolygonOptions = {
    fillColor: "rgba(33,150,243,0.4)",      // Albastru intens
    fillOpacity: 0.4,
    strokeColor: "rgba(33,150,243,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const voinestiPolygonOptions = {
    fillColor: "rgba(76,175,80,0.4)",       // Verde
    fillOpacity: 0.4,
    strokeColor: "rgba(76,175,80,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const cornestiPolygonOptions = {
    fillColor: "rgba(255,152,0,0.4)",        // Portocaliu
    fillOpacity: 0.4,
    strokeColor: "rgba(255,152,0,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const visinaPolygonOptions = {
    fillColor: "rgba(121,85,72,0.4)",        // Maro
    fillOpacity: 0.4,
    strokeColor: "rgba(121,85,72,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };
  
  const racariPolygonOptions = {
    fillColor: "rgba(233,30,99,0.4)",         // Roz intens
    fillOpacity: 0.4,
    strokeColor: "rgba(233,30,99,1)",
    strokeOpacity: 1,
    strokeWeight: 2,
  };

  // Dacă se face click pe hartă, recalculează și re-centrează
  const onMapClick = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    onRegionChangeComplete({
      latitude: newLat,
      longitude: newLng,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    });
    if (mapInstance) {
      mapInstance.panTo({ lat: newLat, lng: newLng });
    }
    // handleMapPress && handleMapPress({ lat: newLat, lng: newLng });
  };

  function toggleFullscreen() {
    const mapDiv = document.getElementById("mapContainer");
    if (!document.fullscreenElement) {
      mapDiv.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  if (loadError)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Eroare la îcărcarea hărții...contactați administratorul
      </div>
    );
  if (!isLoaded)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Se incarca harta...
      </div>
    );

  return (
    <div id="mapContainer" style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={Math.round(Math.log2(360 / region.latitudeDelta))}
        onIdle={onIdle}
        onLoad={onLoad}
        onClick={onMapClick}
        mapTypeId={mapType === "standard" ? "roadmap" : "satellite"}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",
          fullscreenControl: false,
        }}
      >
        {/* Dacă filtrul pentru raioane este activ, afișează poligoanele */}
        {filters && filters.raioane && (
          <>
            <Polygon
              paths={transformCoordinates(gaestiCoordinates)}
              options={gaestiPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(moreniCoordinates)}
              options={moreniPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(targovisteCoordinates)}
              options={targovistePolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(pucioasaCoordinates)}
              options={pucioasaPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(tituCoordinates)}
              options={tituPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(coordonateVoinesti)}
              options={voinestiPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(coordonateCornesti)}
              options={cornestiPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(coordonateVisina)}
              options={visinaPolygonOptions}
            />
            <Polygon
              paths={transformCoordinates(coordonateRacari)}
              options={racariPolygonOptions}
            />
          </>
        )}

        {children}
        
        {/* Markerul de locație cu efect de pulsare adăugat */}
        {userLocation && userLocation.latitude && userLocation.longitude && (
          <PulsingMarker
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            onClick={() => {
              if (mapInstance) {
                mapInstance.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
              }
            }}
          />
        )}
        
        {/* Dacă doriți să păstrați și markerul implicit, nu eliminați codul de mai jos.
            Comentați blocul de mai jos pentru a afișa doar markerul pulsator. */}
        {/*
        { userLocation && userLocation.latitude && userLocation.longitude && (
          <CustomMarker position={{ lat: userLocation.latitude, lng: userLocation.longitude }}>
            <MdMyLocation size={30} color="green" />
          </CustomMarker>
        )}
        */}
      </GoogleMap>

      {/* Indicatorul nivelului de zoom */}
      <div
        style={{
          position: "absolute",
          top: "1%",
          right: "1%",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "8px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <span>{zoomLevel}</span>
      </div>

 


      {/* Butonul pentru deschiderea filtrelor */}
      <button
        onClick={toggleFullscreen}
        style={{
          position: "absolute",
          bottom: "90%",
          left: "10px",
          padding: "12px",
          backgroundColor: "#ffffff", // Fundal alb
          border: "none",
          borderRadius: "50%", // Formă circulară
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <MdFullscreen size={30} />
      </button>

      {/* Butonul pentru deschiderea filtrelor */}
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: "absolute",
          bottom: "80%",
          left: "10px",
          padding: "12px",
          backgroundColor: "#ffffff", // Fundal alb
          border: "none",
          borderRadius: "50%", // Formă circulară
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <MdFilterList size={30} />
      </button>

      {/* Butonul pentru schimbarea tipului de hartă */}
      <button
        onClick={toggleMapType}
        style={{
          position: "absolute",
          bottom: "70%",
          left: "10px",
          padding: "12px",
          backgroundColor: "#ffffff", // Fundal alb
          border: "none",
          borderRadius: "50%", // Formă circulară
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        {mapType === "standard" ? (
          <MdSatellite size={30} color="#0000ff" />
        ) : (
          <MdMap size={30} color="#0000ff" />
        )}
      </button>


      {/* Buton pentru filtrul de hidranți (ex: cel mai apropiat) */}
      {region && userLocation && (
        <button
          onClick={goToNearestHydrant}
          style={{
            position: "absolute",
            bottom: "60%",
            left: "10px",
            padding: "12px",
            backgroundColor: "#4caf50", // Fundal verde
            border: "none",
            borderRadius: "50%", // Formă circulară
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <MdFireHydrantAlt size={24} color="white" />
        </button>
      )}

      {/* Butonul pentru deschiderea paginii de administrare sau de deconectare */}


<button
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
            router.push("/signin");
          }}
          style={{
            position: "absolute",
            bottom: "50%",
            left: "10px",
            padding: "12px",
            backgroundColor: "#ffffff", // Fundal alb
            border: "none",
            borderRadius: "50%", // Formă circulară
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <MdOutlineLogout size={30} />
        </button>

           {/* Butonul pentru re-centrarea hărții la locația utilizatorului */}
           {userLocation && (
        <button
          onClick={() => {
            if (mapInstance) {
              mapInstance.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
            }
          }}
          style={{
            position: "absolute",
            bottom: "40%",
            left: "10px",
            padding: "12px",
            backgroundColor: "#ffffff", // Fundal alb
            border: "none",
            borderRadius: "50%", // Formă circulară
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <MdMyLocation size={30} color="#0047AB" />
        </button>
      )}

{isAdmin  ? (
        <button
          onClick={() => router.push("/panou-principal")}
          style={{
            position: "absolute",
            bottom: "30%",
            left: "10px",
            padding: "12px",
            backgroundColor: "#ffffff", // Fundal alb
            border: "none",
            borderRadius: "50%", // Formă circulară
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          <MdOutlineHome size={30} />
        </button>
      ) : (
        null
      )}
      <MultiSelectDialog setVisible={setVisible} visible={visible} handleFilters={handleFilters} />
      <NavigationDialog
        open={Boolean(open)}
        marker={marker}
        onClose={() => onClose(null)}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default MyMapView;
