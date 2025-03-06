export const filterMarkersByZoom = (latitudeDelta, reg) => {
  // Calculează nivelul de zoom pe baza delta de latitudine
  const zoomLevel = Math.round(Math.log(360 / latitudeDelta) / Math.LN2);
  console.log("zoomLevel...", zoomLevel);

  // Determină frecvența de filtrare a markerilor în funcție de nivelul de zoom
  let filterFrequency;
  if (zoomLevel <= 8) {
    filterFrequency = 70;
  } else if (zoomLevel <= 9) {
    filterFrequency = 30;
  } else if (zoomLevel <= 10) {
    filterFrequency = 25;
  } else if (zoomLevel <= 11) {
    filterFrequency = 20;
  } else if (zoomLevel <= 12) {
    filterFrequency = 15;
  } else if (zoomLevel <= 13) {
    filterFrequency = 3;
  } else if (zoomLevel <= 14) {
    filterFrequency = 1;
  } else if (zoomLevel <= 15) {
    filterFrequency = 1;
  } else if (zoomLevel <= 16) {
    filterFrequency = 1;
  } else if (zoomLevel <= 17) {
    filterFrequency = 1;
  } else {
    filterFrequency = 1; // La niveluri de zoom mari, arată toți markerii
  }
  let filteredMarkersFinal;
  let filteredMarkersVersio2;
  let viewSize = 2;
  // Filtrarea markerilor pe baza frecvenței calculate
  const filtered = hidranti.filter((_, index) => index % filterFrequency === 0);
  const filteredMarkers = filtered.filter((hidrant, index) => {
    return isVisible(hidrant, 2, reg);
  });

  let isHeightDemand = filteredMarkers.length > 80;

  if (isHeightDemand) {
    console.log("is high demand....", filteredMarkers.length);
    let freq = 2;

    filteredMarkersVersio2 = hidranti.filter((_, index) => index % freq === 0);

    viewSize = 2.2;
    filteredMarkersFinal = filteredMarkersVersio2.filter((hidrant, index) => {
      return isVisible(hidrant, viewSize, reg);
    });
    console.log(
      "length of hight demand second...",
      filteredMarkersFinal.length
    );
  } else {
    console.log("is not high demand....", filteredMarkers.length);

    filteredMarkersFinal = filteredMarkers;
  }

  return { filteredMarkersFinal, zoomLevel };
};
