import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import SwipableCard from "../components/SwipableCard";
import { FlatList } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const toRadians = angle => angle * (Math.PI / 180);
const rotatedWidth =
  SCREEN_WIDTH * Math.sin(toRadians(90 - 15)) +
  SCREEN_HEIGHT * Math.sin(toRadians(15));

const { event } = Animated;

const dogStack = [
  {
    name: "Sammy",
    age: 3,
    bio: "",
    pic: require("../../assets/dog1.jpeg")
  },
  {
    name: "Rover",
    age: 4,
    bio: "",
    pic: require("../../assets/dog2.jpeg")
  },
  {
    name: "Prince",
    age: 3,
    bio: "",
    pic: require("../../assets/dog3.jpeg")
  },
  {
    name: "Edgar",
    age: 3,
    bio: "",
    pic: require("../../assets/dog4.jpeg")
  },
  {
    name: "Maya",
    age: 3,
    bio: "",
    pic: require("../../assets/dog5.jpeg")
  },
  {
    name: "King",
    age: 3,
    bio: "",
    pic: require("../../assets/dog6.jpeg")
  },
  {
    name: "Doge",
    age: 3,
    bio: "",
    pic: require("../../assets/dog7.jpeg")
  },
  {
    name: "Doggo",
    age: 3,
    bio: "",
    pic: require("../../assets/dog8.jpeg")
  }
];

export default class SwipeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: dogStack
    };
  }

  swipped = ([translationX]) => {
    console.log({ likes: translationX > 0 });
  };

  render() {
    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <FlatList
          data={this.state.profiles}
          renderItem={({ item }) => (
            <SwipableCard profile={item} swipped={this.swipped} />
          )}
          keyExtractor={item => item.name}
          CellRendererComponent={({ children, index, style, ...props }) => {
            const cellStyle = [style, { zIndex: -index }];
            return (
              <View style={cellStyle} index={index} {...props}>
                {children}
              </View>
            );
          }}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40
  }
});
