import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import firebaseSDK from "../services/Firebase";
import AuthForm from "../components/authForm";

export default function Login({ navigation }) {
  const [error, SetError] = useState("");
  const login = async ({ email, password }) => {
    const user = {
      email,
      password
    };
    const response = firebaseSDK.login(user, loginSuccess, loginFailed);
  };

  const loginSuccess = () => {
    navigation.navigate("mainFlow");
  };

  const loginFailed = res => {
    SetError(res.message);
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onWillBlur={() => SetError("")} />
      <AuthForm
        onSubmit={login}
        formTitle="Login"
        navigateTo="Signup"
        linkTitle="Sign Up Instead ?"
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
