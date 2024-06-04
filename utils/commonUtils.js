export const toUrlSlug = (string) => {
  console.log("test tourlstring....", string);
  return string
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

export function validateEmail(email) {
  const re =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function generateRandomGradient() {
  // Alege un unghi aleator pentru direcția gradientului
  const angle = Math.floor(Math.random() * 360);

  // Generează o culoare de bază aleatorie
  const baseHue = Math.floor(Math.random() * 360);

  // Utilizează o culoare complementară sau o culoare apropiată pe roata culorilor pentru un efect armonios
  const complementaryHue = (baseHue + 30) % 360; // Ajustează acest număr pentru a schimba variația de culori

  // Ajustează saturația și luminozitatea pentru a obține un aspect mai sofisticat și mai puțin saturat
  const saturation = 70; // Procent de saturație (mai mic pentru culori mai subtile)
  const lightness1 = 65; // Luminozitate mai mare pentru prima culoare
  const lightness2 = 50; // Luminozitate mai mică pentru a doua culoare, pentru contrast

  // Creează șirurile de culoare HSL pentru ambele culori ale gradientului
  const color1 = `hsl(${baseHue}, ${saturation}%, ${lightness1}%)`;
  const color2 = `hsl(${complementaryHue}, ${saturation}%, ${lightness2}%)`;

  // Construiește și returnează șirul de gradient liniar
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

export function updateSelectBackground(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  selectElement.style.backgroundImage = selectedOption.style.backgroundImage;
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  console.log(lat1);
  console.log(lon1);
  console.log(lat2);
  console.log(lon2);
  const R = 6371e3; // Raza Pământului în metri
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ în radiani
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distanța în metri
};

// Funcția pentru a închide modalul
export const closeSignupModal = (modalId) => {
  const modalElement = document.getElementById(modalId); // Înlocuiește cu ID-ul real al modalului tău
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
};

export const filtrareParteneri = (parteneriFiltrati, searchQueryParteneri) => {
  // Împărțim query-ul de căutare în cuvinte individuale
  const searchTerms = searchQueryParteneri
    .split(/\s+/)
    .map((term) => term.toLowerCase());

  // Funcție care verifică dacă toate cuvintele de căutare apar în text
  const matchesSearch = (text) => {
    const lowercasedText = text.toLowerCase();
    return searchTerms.every((term) => lowercasedText.includes(term));
  };

  // Filtrăm partenerii pe baza denumirii brandului, categoriilor, adresei, descrierii, telefonului și emailului
  const parteneriFiltratiGasiti = parteneriFiltrati.filter(
    (partener) =>
      matchesSearch(partener.denumireBrand) ||
      matchesSearch(partener.categorie) ||
      matchesSearch(partener.adresaSediu) ||
      matchesSearch(partener.descriere) ||
      matchesSearch(partener.telefonContact) ||
      matchesSearch(partener.email)
  );

  return parteneriFiltratiGasiti;
};

export const verifyCurrentUser = async (partenerId, userData, loading) => {
  if (partenerId) {
    console.log("is partener id...");
    if (
      (!loading && userData?.userType != "Partener") ||
      (!loading && userData.user_uid != partenerId)
    ) {
      console.log("not first...");
      return false;
    } else {
      console.log("is first...");
      return true;
    }
  } else {
    if (!loading && userData?.userType != "Partener") {
      console.log("not second...");
      return false;
    } else {
      console.log("is second...");
      return true;
    }
  }
};
