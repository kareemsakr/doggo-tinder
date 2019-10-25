import firebase from "firebase";
import { RNS3 } from "react-native-s3-upload";

import uuid from "uuid";
import {
  API_KEY,
  AUTH_DOMAIN,
  DB_URL,
  PROJ_ID,
  STORE_BUCKET,
  SENDER_ID,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY
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

  signUp = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(resp => {
        firebase
          .database()
          .ref("users/" + resp.user.uid)
          .set({
            name: "",
            bio: "",
            profile_picture:
              "https://doggo-tinder-photos.s3.ca-central-1.amazonaws.com/uploads/loadingdog.png",
            id: resp.user.uid,
            likes: {}
          });
        success_callback(resp);
      }, failed_callback);
  };

  logOut = async () => {
    await firebase.auth().signOut();
  };

  getLoggedInUser = cb => {
    firebase.auth().onAuthStateChanged(cb);
  };

  uploadImage = async uri => {
    try {
      const file = {
        uri,
        name: "hello ketteh" + ".png",
        type: "image/png"
      };
      const options = {
        keyPrefix: "uploads/",
        bucket: "doggo-tinder-photos",
        region: "ca-central-1",
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET_KEY,
        successActionStatus: 201
      };

      RNS3.put(file, options).progress(e => console.log(e.loaded / e.total));
      // RNS3.put(file, options).then(response => {

      //   if (response.status !== 201)
      //     throw new Error("Failed to upload image to S3");
      //   //console.log(response);
      //   /**
      //    * {
      //    *   postResponse: {
      //    *     bucket: "your-bucket",
      //    *     etag : "9f620878e06d28774406017480a59fd4",
      //    *     key: "uploads/image.png",
      //    *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
      //    *   }
      //    * }
      //    */
      // });
      //console.log(response);
      //return response.body.postResponse.location;
    } catch (err) {
      console.log("uploadImage try/catch error: " + err.message);
    }
  };

  getUserProfile = async cb => {
    var userRef = firebase.auth().currentUser;
    if (userRef != null) {
      firebase
        .database()
        .ref("users/" + userRef.uid)
        .on("value", cb);
    }
  };

  getUserProfileOnce = async () => {
    var userRef = firebase.auth().currentUser;
    if (userRef != null) {
      const response = await firebase
        .database()
        .ref("users/" + userRef.uid)
        .once("value");
      return response.val();
    }
  };

  getLoggedInUserId = () => {
    return firebase.auth().currentUser.uid;
  };

  getProfilesForSwiping = cb => {
    var userRef = firebase.auth().currentUser;
    if (userRef != null) {
      firebase
        .database()
        .ref("users/")
        .once("value", cb);
    }
  };

  //does this id like logged in user
  doesLike = async id => {
    const snapshot = await firebase
      .database()
      .ref("users/" + id)
      .once("value");
    return this.getLoggedInUserId() in (snapshot.val().likes || {});
  };

  addLike = async id => {
    var userRef = firebase.auth().currentUser;

    if (userRef) {
      if (await this.doesLike(id)) {
        console.log("match");
      }

      firebase
        .database()
        .ref("users/" + userRef.uid)
        .once("value")
        .then(function(snapshot) {
          firebase
            .database()
            .ref("users/" + userRef.uid)
            .update({ likes: { ...snapshot.val().likes, [id]: true } });
        });
    }
  };

  updateUserProfile = async (userProf, success_callback, failed_callback) => {
    let storageURL = "";
    if (userProf.imageURL) {
      //storageURL = await this.uploadImage(userProf.imageURL);
      const file = {
        uri: userProf.imageURL,
        name: uuid.v4() + ".png",
        type: "image/png"
      };
      const options = {
        keyPrefix: "uploads/",
        bucket: "doggo-tinder-photos",
        region: "ca-central-1",
        accessKey: AWS_ACCESS_KEY,
        secretKey: AWS_SECRET_KEY,
        successActionStatus: 201
      };

      const response = await RNS3.put(file, options);
      storageURL = response.body.postResponse.location;
    }

    var userRef = firebase.auth().currentUser;
    if (userRef != null) {
      firebase
        .database()
        .ref("users/" + userRef.uid)
        .set({
          name: userProf.name,
          bio: userProf.bio,
          profile_picture: storageURL,
          id: userRef.uid
        })
        .then(success_callback)
        .catch(failed_callback);
    }
  };
}
const firebaseSDK = new FirebaseSDK();

export default firebaseSDK;
