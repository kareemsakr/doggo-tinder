import React, { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { ListItem } from "react-native-elements";

import FirebaseSDK from "../services/Firebase";

const MatchesScreen = ({ navigation }) => {
  const { navigate } = navigation;

  let [matches, setMatches] = useState([]);

  useEffect(() => {
    FirebaseSDK.getMatches(result => {
      setMatches(result);
    });
  }, []);

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      leftAvatar={{ source: { uri: item.profile_picture } }}
      bottomDivider
      chevron
      onPress={() => navigate("ChatScreen", item)}
    />
  );
  return (
    <FlatList
      keyExtractor={item => item.id}
      data={matches}
      renderItem={renderItem}
    />
  );
};

export default MatchesScreen;
