"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const callNumber = (phone) => {
  if (/^\d+$/.test(phone)) {
    window.open(`tel:${phone}`, "_self");
  } else {
    console.warn("Provided phone number is invalid");
  }
};

const PrimariiDialog = ({ visible, setData, calloutData }) => {
  const hideDialog = () => setData({});

  return (
    <Dialog open={visible} onClose={hideDialog}>
      <DialogTitle>{calloutData.title || "-"}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {calloutData.numarPrimar ? (
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Primar {calloutData.numePrimar || "-"}:{" "}
              </Typography>
              <Button variant="text" color="primary" onClick={() => callNumber(calloutData.numarPrimar)}>
                {calloutData.numarPrimar}
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: "grey" }}>
              Primar: -
            </Typography>
          )}
          {calloutData.numarVicePrimar ? (
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Viceprimar {calloutData.numeViceprimar || "-"}:{" "}
              </Typography>
              <Button variant="text" color="primary" onClick={() => callNumber(calloutData.numarVicePrimar)}>
                {calloutData.numarVicePrimar}
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: "grey" }}>
              Viceprimar: -
            </Typography>
          )}
          {calloutData.numarSVSU ? (
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Șef SVSU {calloutData.numeSefSVSU || "-"}:{" "}
              </Typography>
              <Button variant="text" color="primary" onClick={() => callNumber(calloutData.numarSVSU)}>
                {calloutData.numarSVSU}
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: "grey" }}>
              Șef SVSU: -
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrimariiDialog;
