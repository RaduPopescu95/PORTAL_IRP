export const getAddress = async (lat, lon) => {
  const url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${lat}&lon=${lon}&accept-language=en&polygon_threshold=0.0`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "fdb30fac7dmshee22c632d48569ap1d9819jsna577a39fffd6",
      "X-RapidAPI-Host": "forward-reverse-geocoding.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("error on getAddress....", error);
  }
};
