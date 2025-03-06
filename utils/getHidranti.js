import {
    getDatabase,
    ref,
    set,
    onValue,
    get,
    child,
    remove,
  } from "firebase/database";

  export const handleGetHidranti = async () => {
    const dbRef = ref(getDatabase());
  
    // Return the promise chain
    return get(child(dbRef, `hidranti/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const hidranti = [];
  
          snapshot.forEach((childSnapshot) => {
            hidranti.push(childSnapshot.val());
          });
  
          console.log("calendar....");
          console.log(hidranti);
          return hidranti; // This will be the resolved value of the promise
        } else {
          console.log("No data available");
          return []; // This will also be a resolved value
        }
      })
      .catch((error) => {
        console.error(error);
        throw error; // Rethrow the error so it can be caught by the caller
      });
  };
  