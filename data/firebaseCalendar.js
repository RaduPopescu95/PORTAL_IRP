import { getDatabase, ref, set, onValue, get, child , update   } from "firebase/database";

// const database = getDatabase();

export const  writeEventData = (title, raspunde, description, startDate, time, id) => {
    const db = getDatabase()
// console.log(currentTimeMilliseconds);

  set(ref(db, 'Events/' + id), {
    id,
    title,
    raspunde,
    description,
    startDate,
    time
  });
}

export const getCalendar = () => {
  const dbRef = ref(getDatabase());

  get(child(dbRef, `Events/`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const eventArray = [];

        snapshot.forEach((childSnapshot) => {
          // Get the object inside the snapshot and push it into the array
          eventArray.push(childSnapshot.val());
        });

        console.log(eventArray);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const writeEditEvent = (title, raspunde, description, startDate, time, id) => {
            // Get a reference to the database
            const db = getDatabase();

            // Specify the path to the data you want to update
            const dataRef = ref(db, 'Events/' + id);


                        // Define the updates you want to make
            const updates = {
                id,
                title,
                raspunde,
                description,
                startDate,
                time
              };

            // Use the update method to update the data
            update(dataRef, updates)
            .then(() => {
            console.log('Data updated successfully');
            })
            .catch((error) => {
            console.error('Error updating data: ', error);
            });
  }

