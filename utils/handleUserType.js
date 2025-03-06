import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";


export const handleUserType = async (email, userType) => {


    try{
 
    

    // Add a new document in collection "cities"
await setDoc(doc(db, "UserTypes", `${email}`), {
    email,
    userType,



});
    }catch(err){
      console.log("error at handleUserType", err)      
    }
  }
