import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { navigate } from "../navigationRef";

export default ({ title, navigateTo }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigate(navigateTo);
      }}
    >
      <Text style={styles.link}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    marginTop: 35,
    fontSize: 16,
    color: "blue",
    justifyContent: "center",
    alignSelf: "center"
  }
});
