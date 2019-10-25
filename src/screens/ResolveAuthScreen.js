import React, { useEffect } from "react";
import FirebaseSDK from "../services/Firebase";

export default function ResolveAuthScreen({ navigation }) {
  useEffect(() => {
    FirebaseSDK.getLoggedInUser(currentUser => {
      if (currentUser) {
        console.log("user Is Logged In");
        navigation.navigate("mainFlow");
      } else {
        console.log("user is not logged in ");
        navigation.navigate("LoginFlow");
      }
    });
  }, []);
  return null;
}
