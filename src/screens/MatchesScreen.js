import React from "react";
import { Text, View, FlatList } from "react-native";
import { ListItem } from "react-native-elements";

const list = [
  {
    name: "Sad Doggo",
    avatar_url:
      "https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277416_1280.jpg",
    messages: [
      { message: "Hello woof woof" },
      { message: "Sniff sniff how's it going?" }
    ]
  },
  {
    name: "McCutness",
    avatar_url:
      "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg",
    messages: [
      { message: "Hello woof woof" },
      { message: "Sniff sniff how's it going?" }
    ]
  }
];

const MatchesScreen = ({ navigation }) => {
  const { navigate } = navigation;
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      leftAvatar={{ source: { uri: item.avatar_url } }}
      bottomDivider
      chevron
      onPress={() => navigate("ChatScreen", item)}
    />
  );
  return (
    <FlatList keyExtractor={keyExtractor} data={list} renderItem={renderItem} />
  );
};

export default MatchesScreen;
