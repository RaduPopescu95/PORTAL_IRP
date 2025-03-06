"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { FaBiohazard } from "react-icons/fa";

const SevesoCallout = ({ marker, name }) => {
  // Funcția getHidrantType este inclusă pentru compatibilitate,
  // dar în acest callout nu este utilizată direct.
  const getHidrantType = (hidrant) => {
    let types = [];
    for (let key in hidrant) {
      if (hidrant[key] === "X" || hidrant[key] === "x") {
        types.push(key);
      }
    }
    return types.join(", ");
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: 1,
        borderRadius: 1,
        width: 300,
      }}
    >
      {name === "fire-hydrant" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "grey.300",
            width: "90%",
            mb: 1,
          }}
        >
          <FaBiohazard size={24} color="black" style={{ marginRight: 8 }} />
          <Typography variant="body1">
            {marker.title ? marker.title : ""}
          </Typography>
        </Box>
      )}
      <Typography variant="body2">
        Adresa: {marker.adresa ? marker.adresa : "-"}
      </Typography>
      <Typography variant="body2">
        Longitude:{" "}
        {marker.coordinates && marker.coordinates.longitude
          ? marker.coordinates.longitude
          : "-"}
      </Typography>
      <Typography variant="body2">
        Latitude:{" "}
        {marker.coordinates && marker.coordinates.latitude
          ? marker.coordinates.latitude
          : "-"}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography
        variant="body2"
        sx={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      >
        Apasă pentru mai multe informatii
      </Typography>
    </Box>
  );
};

export default SevesoCallout;
