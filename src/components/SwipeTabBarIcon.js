import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../constants/colors";

const componentName = ({ focused }) => (
  <FontAwesome
    name="paw"
    size={26}
    style={{ marginBottom: -3 }}
    color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
  />
);

const styles = StyleSheet.create({});
export default componentName;
