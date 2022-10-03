import { db } from '../Firebase-config'
import { setDoc, doc } from "firebase/firestore"; 

async function setAvatarInFB(avatar,UID){
    try {
        await setDoc(doc(db, "users", `${UID}`), {
            avatar: `${avatar}`
          });

      } catch (e) {
        console.error("Error adding document: ", e);
      }



}

export default setAvatarInFB;