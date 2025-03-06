// NavigationDialog.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NavigationDialog = ({ open, marker, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Direcții de navigare</DialogTitle>
      <DialogContent>
        <Typography>
          Dorești să primești direcții către{" "}
          <strong>{marker?.title || "locația selectată"}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anulează</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Da, navighează
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NavigationDialog;
