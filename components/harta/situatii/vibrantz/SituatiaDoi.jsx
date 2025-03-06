"use client";

import React from "react";
import { Circle, Marker } from "@react-google-maps/api";

export default function SituatiaDoi({ c, index }) {
  const lat = parseFloat(c.zonaDoi.latitude);
  const lng = parseFloat(c.zonaDoi.longitude);

  return (
    <>
      {/* Zona I */}
      <Circle
        center={{ lat, lng }}
        radius={26} // raza în metri
        options={{
          fillColor: "rgba(255, 0, 0, 0.4)",
          strokeColor: "rgba(255, 0, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat, lng: lng }}
        label={{
          text: "26m - Zona I - Mortalitate ridicata",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-22`}
      />

      {/* Zona II */}
      <Circle
        center={{ lat, lng }}
        radius={70} // raza în metri
        options={{
          fillColor: "rgba(255, 140, 0, 0.4)",
          strokeColor: "rgba(255, 140, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0003, lng: lng - 0.0003 }}
        label={{
          text: "70m - Zona II - Prag de Mortalitate",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-31`}
      />

      {/* Zona III */}
      <Circle
        center={{ lat, lng }}
        radius={169} // raza în metri
        options={{
          fillColor: "rgba(255, 255, 0, 0.4)",
          strokeColor: "rgba(255, 255, 0, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0008, lng: lng - 0.0008 }}
        label={{
          text: "169m - Zona III - Vatamari ireversibile",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-69`}
      />

      {/* Zona IV */}
      <Circle
        center={{ lat, lng }}
        radius={200} // raza în metri
        options={{
          fillColor: "rgba(255, 255, 153, 0.4)",
          strokeColor: "rgba(255, 255, 153, 0.4)",
          strokeWeight: 2,
        }}
      />
      <Marker
        position={{ lat: lat + 0.0014, lng: lng - 0.0014 }}
        label={{
          text: "200m - Zona IV - Vatamari reversibile",
          color: "black",
          fontWeight: "bold",
          fontSize: "12px",
        }}
        key={`${index}-text-100`}
      />
    </>
  );
}
