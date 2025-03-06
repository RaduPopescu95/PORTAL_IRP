"use client";

import React from "react";
import { Circle, Marker } from "@react-google-maps/api";

export default function SituatiaUnu({ c, index }) {
  const lat = parseFloat(c.zonaUnu.latitude);
  const lng = parseFloat(c.zonaUnu.longitude);

  return (
    <>
      {/* Zona I */}
      <Circle
        center={{ lat, lng }}
        radius={22} // raza în metri
        options={{
          fillColor: "rgba(255, 0, 0, 0.4)",
          strokeColor: "rgba(255, 0, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat, lng }}
        label={{
          text: "22m - Zona I",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-22`}
      />

      {/* Zona II */}
      <Circle
        center={{ lat, lng }}
        radius={31} // raza în metri
        options={{
          fillColor: "rgba(255, 140, 0, 0.4)",
          strokeColor: "rgba(255, 140, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0002, lng: lng - 0.0002 }}
        label={{
          text: "31m - Zona II",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-31`}
      />

      {/* Zona III */}
      <Circle
        center={{ lat, lng }}
        radius={69} // raza în metri
        options={{
          fillColor: "rgba(255, 255, 0, 0.4)",
          strokeColor: "rgba(255, 255, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0004, lng: lng - 0.0004 }}
        label={{
          text: "69m - Zona III",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-69`}
      />

      {/* Zona IV */}
      <Circle
        center={{ lat, lng }}
        radius={100} // raza în metri
        options={{
          fillColor: "rgba(255, 255, 153, 0.4)",
          strokeColor: "rgba(255, 255, 153, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0006, lng: lng - 0.0006 }}
        label={{
          text: "100m - Zona IV",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-100`}
      />
    </>
  );
}
