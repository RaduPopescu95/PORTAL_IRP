"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

const MultiSelectDialog = ({ visible, setVisible, handleFilters }) => {
  const [checkedItems, setCheckedItems] = useState({
    raioane: false,
    hidranti: false,
    primarii: false,
    seveso: false,
    svsu: false,
    spsu: false,
    subunitati: false,
  });

  const hideDialog = () => setVisible(false);

  const toggleItem = (item) => {
    setCheckedItems({ ...checkedItems, [item]: !checkedItems[item] });
  };

  const handleChangeFilter = () => {
    hideDialog();
    handleFilters(checkedItems);
    console.log("Selected items:", checkedItems);
  };

  return (
    <Dialog open={visible} onClose={hideDialog}>
      <DialogTitle>Selectează filtre</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.subunitati}
              onChange={() => toggleItem("subunitati")}
            />
          }
          label="Subunitati"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.hidranti}
              onChange={() => toggleItem("hidranti")}
            />
          }
          label="Hidranti"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.primarii}
              onChange={() => toggleItem("primarii")}
            />
          }
          label="Primarii"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.raioane}
              onChange={() => toggleItem("raioane")}
            />
          }
          label="Raioane"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.seveso}
              onChange={() => toggleItem("seveso")}
            />
          }
          label="Seveso"
        />
        {/* <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.svsu}
              onChange={() => toggleItem("svsu")}
            />
          }
          label="SVSU"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.spsu}
              onChange={() => toggleItem("spsu")}
            />
          }
          label="SPSU"
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>Cancel</Button>
        <Button onClick={handleChangeFilter}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MultiSelectDialog;
