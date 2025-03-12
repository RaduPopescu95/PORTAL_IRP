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
      <DialogTitle>
        <strong>{marker?.title || "Locația selectată"}</strong>
      </DialogTitle>
      <DialogContent dividers>
        {/* Marker de tip Hidrant */}
        {marker?.Localizare && (
          <>
            <Typography variant="body2" color="textSecondary">
              Tip:{" "}
              {marker.TipHidrant &&
                Object.entries(marker.TipHidrant).map(
                  ([key, value], index, arr) => (
                    <span key={key}>
                      {key}
                      {index < arr.length - 1 ? ", " : ""}
                    </span>
                  )
                )}
            </Typography>
            {marker.Localitate && (
              <Typography variant="body2">
                Localitate: {marker.Localitate}
              </Typography>
            )}
            {marker.Stradă && (
              <Typography variant="body2">
                Stradă: {marker.Stradă}
              </Typography>
            )}
            {marker["NumărAdministrativ"] && (
              <Typography variant="body2">
                Număr: {marker["NumărAdministrativ"]}
              </Typography>
            )}
            {marker.Reper && (
              <Typography variant="body2">
                Reper: {marker.Reper}
              </Typography>
            )}
          </>
        )}

        {/* Marker de tip Subunitate */}
        {marker?.nrGis && (
          <>
            <Typography variant="body2" color="textSecondary">
              Tip: Subunitate
            </Typography>
            <Typography variant="body2">
              Nr. GIS: {marker.nrGis}
            </Typography>
            {marker.nrComandant && (
              <Typography variant="body2">
                Nr. Comandant:{" "}
                <a
                  href={`tel:${marker.nrComandant}`}
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {marker.nrComandant}
                </a>
              </Typography>
            )}
          </>
        )}

        {/* Marker de tip Seveso */}
        {marker?.telefon && (
          <>
            <Typography variant="body2" color="textSecondary">
              Tip: Seveso
            </Typography>
            {marker.adresa && (
              <Typography variant="body2">
                Adresă: {marker.adresa}
              </Typography>
            )}
            <Typography variant="body2">
              Telefon:{" "}
              <a
                href={`tel:${marker.telefon}`}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {marker.telefon}
              </a>
            </Typography>
            {marker.pdfUri && (
              <Typography variant="body2">
                Document:{" "}
                <a href={marker.pdfUri} target="_blank" rel="noreferrer">
                  PDF
                </a>
              </Typography>
            )}
          </>
        )}

        {/* Marker de tip Primării */}
        {marker?.numePrimar && (
          <>
            <Typography variant="body2" color="textSecondary">
              Tip: Primării
            </Typography>
            <Typography variant="body2">
              Primar: {marker.numePrimar}{" "}
              {marker.numarPrimar && (
                <>
                  (
                  <a
                    href={`tel:${marker.numarPrimar}`}
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    {marker.numarPrimar}
                  </a>
                  )
                </>
              )}
            </Typography>
            {marker.numeViceprimar && (
              <Typography variant="body2">
                Viceprimar: {marker.numeViceprimar}{" "}
                {marker.numarVicePrimar && (
                  <>
                    (
                    <a
                      href={`tel:${marker.numarVicePrimar}`}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {marker.numarVicePrimar}
                    </a>
                    )
                  </>
                )}
              </Typography>
            )}
            {marker.numeSefSVSU && (
              <Typography variant="body2">
                Șef SVSU: {marker.numeSefSVSU}{" "}
                {marker.numarSVSU && (
                  <>
                    (
                    <a
                      href={`tel:${marker.numarSVSU}`}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {marker.numarSVSU}
                    </a>
                    )
                  </>
                )}
              </Typography>
            )}
          </>
        )}

        <Typography variant="body1" style={{ marginTop: 16 }}>
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
