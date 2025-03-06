"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const SevesoDialog = ({
  visible,
  setData,
  calloutData,
  handleZonaUrgenta,
  situatieSeveso,
}) => {
  const hideDialog = () => setData({});

  const openPDFInBrowser = () => {
    const url = calloutData.pdfUri;
    if (url) {
      window.open(url, "_blank");
    } else {
      console.log(`Nu se poate deschide acest URL: ${url}`);
    }
  };

  const handleCheckboxPress = (situatie) => {
    handleZonaUrgenta(situatie);
  };

  return (
    <Dialog open={visible} onClose={hideDialog}>
      <DialogTitle>{calloutData.title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography
          onClick={openPDFInBrowser}
          sx={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            mb: 2,
          }}
        >
          Deschide PDF
        </Typography>
        {calloutData.title ===
          "VIBRANTZ PERFORMANCE PIGMENTS ROMANIA S.R.L. DIN DOICESTI" && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Checkbox
                checked={situatieSeveso === "Situatia 1"}
                onChange={() => handleCheckboxPress("Situatia 1")}
              />
              <Typography>
                Incendiu la depozitul de bicromat de sodiu și eliberare oxizi de crom
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Checkbox
                checked={situatieSeveso === "Situatia 2"}
                onChange={() => handleCheckboxPress("Situatia 2")}
              />
              <Typography>
                Deversare apă amoniacală și dispersie vapori de amoniac la Hala anticorozivi
              </Typography>
            </Box>
          </>
        )}

        {calloutData.title === "BUTANGAS ROMANIA S.A. - Sucursala Contesti" && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Checkbox
              checked={situatieSeveso === "RezerveBleve"}
              onChange={() => handleCheckboxPress("RezerveBleve")}
            />
            <Typography>Scenariul Explozie rezervor BLEVE</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SevesoDialog;
