import { hidranti } from "../data/hidranti";

export const getClosestDistance = (currentLocation) => {
  if (currentLocation) {
    let closestDistance = Infinity;
    let distance;
    hidranti.forEach((hidrant) => {
      distance = calculateDistance(currentLocation, hidrant);
      if (distance.distance < closestDistance) {
        closestDistance = distance.distance;
      }
    });
    return { distance: closestDistance.toFixed(2), hidrant: distance.hidrant }; // Round to 2 decimal places
  }
  return null;
};

const calculateDistance = (point1, point2) => {
  const lat1 = point1.latitude;
  const lon1 = point1.longitude;
  const lat2 = point2.latitude;
  const lon2 = point2.longitude;

  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Convert to meters
  return { distance, hidrant: point2 };
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
