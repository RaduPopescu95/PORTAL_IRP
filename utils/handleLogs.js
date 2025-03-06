import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";


export const handleLogs = async (action) => {
    const auth = getAuth()

    try{
    const user = auth.currentUser;
    const email = user.email;
    let currentDate = new Date();
    

    console.log("handle....logs....")
    console.log(email)
    console.log(currentDate)
    let finalAction = `${action} ${email} la ${currentDate}`
    console.log(finalAction)
    // Add a new document in collection "cities"
await setDoc(doc(db, "Logs", ` ${email} ${currentDate}`), {
    email,
    date: currentDate,
  action : finalAction

});
    }catch(err){
      console.log("error at handle logs", err)      
    }
  }
