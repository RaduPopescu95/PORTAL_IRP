"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { MdLocalFireDepartment } from "react-icons/md";

const HidrantiCallout = ({ marker, name }) => {
  // Funcția pentru extragerea tipurilor de hidrant marcate cu "X" sau "x"
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
            pb: 0.5,
            mb: 1,
          }}
        >
       
                     <MdLocalFireDepartment size={24} color="blue" />
          <Typography variant="body1">Hidrant </Typography>
          {marker.Localitate && (
            <Typography variant="body1" sx={{ ml: 0.5 }}>
              {marker.Localitate}
            </Typography>
          )}
        </Box>
      )}
      <Typography variant="body2">
        Strada: {marker["Stradă"] ? marker["Stradă"] : "-"}
      </Typography>
      <Typography variant="body2">
        Longitude:{" "}
        {marker.Localizare && marker.Localizare.Longitudine
          ? marker.Localizare.Longitudine
          : "-"}
      </Typography>
      <Typography variant="body2">
        Latitude:{" "}
        {marker.Localizare && marker.Localizare.Latitudine
          ? marker.Localizare.Latitudine
          : "-"}
      </Typography>
      <Typography variant="body2">
        Tip Hidrant: {marker.TipHidrant ? getHidrantType(marker.TipHidrant) : "-"}
      </Typography>
      <Typography variant="body2">
        Localizare: {marker.Reper ? marker.Reper : "-"}
      </Typography>
      {/* Butonul pentru a obține direcții – aici poți adăuga un handler onClick */}
      <Box sx={{ mt: 1, backgroundColor: "blue", borderRadius: 1, p: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            color: "white",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Get Directions
        </Typography>
      </Box>
    </Box>
  );
};

export default HidrantiCallout;
