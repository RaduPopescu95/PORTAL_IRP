"use client";

import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api";
import { MdFilterList, MdMap, MdSatellite } from "react-icons/md";

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

const containerStyle = {
  width: "100%",
  height: "100%",
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
}) => {
  const [mapType, setMapType] = useState("standard");
  const [mapInstance, setMapInstance] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAX3rTsopgsc4EvDoA0yT_3nXes6sD8uM0", // Înlocuiește cu cheia ta
  });

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
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={Math.round(Math.log2(360 / region.latitudeDelta))}
        onIdle={onIdle}
        onLoad={onLoad}
        mapTypeId={mapType === "standard" ? "roadmap" : "satellite"}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
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
      </GoogleMap>

      {/* Indicatorul nivelului de zoom */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "60px",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "8px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <span>{zoomLevel}</span>
      </div>

      {/* Butonul pentru deschiderea filtrelor */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={() => setVisible(!visible)}
          style={{
            border: "none",
            background: "none",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <MdFilterList size={30} />
        </button>
      </div>

      {/* Butonul pentru schimbarea tipului de hartă */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: "10px",
          backgroundColor: "#fff",
          borderRadius: "50%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={toggleMapType}
          style={{
            border: "none",
            background: "none",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {mapType === "standard" ? (
            <MdSatellite size={30} color="#0000ff" />
          ) : (
            <MdMap size={30} color="#0000ff" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MyMapView;
