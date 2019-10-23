import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "./spacer";
import NavLink from "./navLink";

export default function AuthForm({
  onSubmit,
  formTitle,
  navigateTo,
  linkTitle,
  errorMessage
}) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  return (
    <>
      <Spacer>
        <Text h3>{formTitle}</Text>
      </Spacer>
      <Spacer>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Spacer />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </Spacer>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={formTitle}
          onPress={() => onSubmit({ email, password })}
        />
        <NavLink title={linkTitle} navigateTo={navigateTo} />
      </Spacer>
    </>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15
  },
  link: {
    marginTop: 35,
    fontSize: 16,
    color: "blue",
    justifyContent: "center",
    alignSelf: "center"
  }
});
