// Filter markers based on the visible region
export const getFilteredMarkers = (reg, hidranti) => {
  const MIN_ZOOM_LEVEL = 0.03; // Adjust this value as needed

  const filteredMarkers = hidranti.filter((hidrant) => {
    const withinLatitudeRange =
      hidrant.latitude >= reg.latitude - reg.latitudeDelta / 1.5 &&
      hidrant.latitude <= reg.latitude + reg.latitudeDelta / 1.5;

    const withinLongitudeRange =
      hidrant.longitude >= reg.longitude - reg.longitudeDelta / 1.5 &&
      hidrant.longitude <= reg.longitude + reg.longitudeDelta / 1.5;

    console.log("works");
    console.log(reg.longitude);
    console.log(reg.latitude);
    console.log(reg.latitudeDelta);
    const isZoomedIn = reg.latitudeDelta < MIN_ZOOM_LEVEL;

    return withinLatitudeRange && withinLongitudeRange && isZoomedIn;
  });

  console.log(filteredMarkers);

  return filteredMarkers;
};
