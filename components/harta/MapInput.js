"use client";

import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { IoIosSearch } from "react-icons/io";

const MapInput = ({ setPlace, notifyChange, setAddressValue, addressValue }) => {
  const handleSelect = (place) => {
    console.log("Selected place:", place);
    // Actualizează valorile din componenta părinte:
    setPlace(place);
    setAddressValue(place.label);
    // Dacă ai nevoie de detalii suplimentare (ex. geometrie), poți integra un apel la Google Places Details API.
    if (place.value && place.value.place_id) {
      notifyChange(place.value);
    }
  };

  return (
    <div style={styles.inputContainer}>
      <div style={styles.iconContainer}>
        <IoIosSearch size={20} color="gray" />
      </div>
      <GooglePlacesAutocomplete
        apiKey="AIzaSyB4zVjD4zGNdjXw90cMudPB74mE-FHRXkE"
        debounce={300}
        selectProps={{
          placeholder: "Caută adresă...",
          value: addressValue,
          onChange: handleSelect,
          styles: {
            input: (provided) => ({
              ...provided,
              fontSize: 16,
              color: "#333",
              paddingLeft: 8,
            }),
          },
        }}
      />
    </div>
  );
};

const styles = {
  inputContainer: {
    backgroundColor: "white",
    padding: "0 12px",
    margin: "0 10px",
    display: "flex",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
  },
};

export default MapInput;
