"use client";

import React from "react";
import { Circle, Marker } from "@react-google-maps/api";

const RezerveBleve = ({ c, index }) => {
  const lat = parseFloat(c.rezerveBleve.latitude);
  const lng = parseFloat(c.rezerveBleve.longitude);

  return (
    <>
      {/* Zona I */}
      <Circle
        center={{ lat, lng }}
        radius={180.5} // raza în metri
        options={{
          fillColor: "rgba(255, 0, 0, 0.4)",
          strokeColor: "rgba(255, 0, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0, lng: lng - 0.0 }}
        label={{
          text: "180.5m - Zona I",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-22`}
      />

      {/* Zona II */}
      <Circle
        center={{ lat, lng }}
        radius={581}
        options={{
          fillColor: "rgba(255, 140, 0, 0.4)",
          strokeColor: "rgba(255, 140, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.002, lng: lng - 0.002 }}
        label={{
          text: "581m - Zona II",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-31`}
      />

      {/* Zona III */}
      <Circle
        center={{ lat, lng }}
        radius={778}
        options={{
          fillColor: "rgba(255, 255, 0, 0.4)",
          strokeColor: "rgba(255, 255, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0045, lng: lng - 0.0045 }}
        label={{
          text: "778m - Zona III",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-69`}
      />

      {/* Zona IV */}
      <Circle
        center={{ lat, lng }}
        radius={984}
        options={{
          fillColor: "rgba(255, 255, 153, 0.4)",
          strokeColor: "rgba(255, 255, 153, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.007, lng: lng - 0.007 }}
        label={{
          text: "984m - Zona IV",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-100`}
      />
    </>
  );
};

export default RezerveBleve;
