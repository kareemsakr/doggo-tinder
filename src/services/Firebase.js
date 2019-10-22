import firebase from "firebase";
import {
  API_KEY,
  AUTH_DOMAIN,
  DB_URL,
  PROJ_ID,
  STORE_BUCKET,
  SENDER_ID
} from "react-native-dotenv";

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        databaseURL: DB_URL,
        projectId: PROJ_ID,
        storageBucket: STORE_BUCKET,
        messagingSenderId: SENDER_ID
      });
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
