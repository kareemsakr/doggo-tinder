import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationEvents } from "react-navigation";
//import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/authForm";

export default function SignUp({ navigation }) {
  //const { state, signUp, clearErrorMessage } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      {/* <NavigationEvents onWillBlur={clearErrorMessage} /> */}
      <AuthForm
        // onSubmit={signUp}
        formTitle="Sign Up"
        navigateTo="Login"
        linkTitle="Login Instead ?"
        // errorMessage={state.errorMessage}
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
