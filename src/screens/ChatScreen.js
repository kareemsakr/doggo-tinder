import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/colors";
import { Avatar } from "react-native-elements";

const ChatScreen = ({ item }) => (
  <View>
    <Text>ChatScreen</Text>
  </View>
);
ChatScreen.navigationOptions = ({ navigation }) => {
  const name = navigation.getParam("name", "N/A");
  const uri = navigation.getParam("avatar_url", "N/A");
  return {
    headerTitle: (
      <View style={headerStyles.container}>
        <Avatar rounded source={{ uri }} />
        <Text style={headerStyles.text}>{name}</Text>
      </View>
    ),
    headerTintColor: Colors.tintColor
  };
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {},
  text: {
    marginLeft: 5,
    color: Colors.tintColor
  }
});

export default ChatScreen;
