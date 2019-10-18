import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/colors";

const ProfileTabBarIcon = ({ focused }) => (
  <MaterialCommunityIcons
    name="dog"
    size={28}
    style={{ marginBottom: -3 }}
    color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
  />
);

const styles = StyleSheet.create({});
export default ProfileTabBarIcon;
