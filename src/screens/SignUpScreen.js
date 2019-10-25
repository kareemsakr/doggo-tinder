import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import AuthForm from "../components/authForm";
import FirebaseSDK from "../services/Firebase";

export default function SignUp({ navigation }) {
  const [error, setError] = useState("");
  const signUp = async user => {
    FirebaseSDK.signUp(user, success, failed);
  };

  const success = () => {
    navigation.navigate("UpdateProfileScreen");
  };

  const failed = res => {
    setError(res.message);
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillBlur={() => setError("")} />
      <AuthForm
        onSubmit={signUp}
        formTitle="Sign Up"
        navigateTo="Login"
        linkTitle="Login Instead ?"
        errorMessage={error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200
  }
});
