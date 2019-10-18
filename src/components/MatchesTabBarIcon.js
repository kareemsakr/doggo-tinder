import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import Colors from "../constants/colors";

const MatchesTabBarIcon = ({ focused }) => (
  <Entypo
    name="chat"
    size={26}
    style={{ marginBottom: -6.5 }}
    color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
  />
);

const styles = StyleSheet.create({});
export default MatchesTabBarIcon;
