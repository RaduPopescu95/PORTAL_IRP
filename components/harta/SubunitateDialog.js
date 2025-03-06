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

const SubunitateDialog = ({ visible, setData, calloutData }) => {
  const hideDialog = () => setData({});

  return (
    <Dialog open={visible} onClose={hideDialog}>
      <DialogTitle>{calloutData.title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {calloutData.nrComandant && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body1">
                Număr telefon Comandant:&nbsp;
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => callNumber(calloutData.nrComandant)}
              >
                {calloutData.nrComandant}
              </Button>
            </Box>
          )}
          {calloutData.nrGis && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">
                Număr telefon GIS:&nbsp;
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => callNumber(calloutData.nrGis)}
              >
                {calloutData.nrGis}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubunitateDialog;
