import React from "react";
import { SafeAreaView, StyleSheet, Platform, Dimensions } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Tile } from "react-native-elements";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const BOTTOM_BAR_HEIGHT = !Platform.isPad ? 29 : 49; // found from https://stackoverflow.com/a/50318831/6141587

const HomeScreenPics = [
  {
    title: "Sammy",
    age: 3,
    caption: "1 mile away.",
    pic: require("../../assets/dog1.jpeg")
  },
  {
    title: "Rover",
    age: 4,
    bio: "",
    pic: require("../../assets/dog2.jpeg")
  },
  {
    title: "Prince",
    age: 3,
    bio: "",
    pic: require("../../assets/dog3.jpeg")
  },
  {
    title: "Edgar",
    age: 3,
    bio: "",
    pic: require("../../assets/dog4.jpeg")
  },
  {
    title: "Maya",
    age: 3,
    bio: "",
    pic: require("../../assets/dog5.jpeg")
  },
  {
    title: "King",
    age: 3,
    bio: "",
    pic: require("../../assets/dog6.jpeg")
  },
  {
    title: "Doge",
    age: 3,
    bio: "",
    pic: require("../../assets/dog7.jpeg")
  },
  {
    title: "Doggo",
    age: 3,
    caption: "5 miles away.",
    pic: require("../../assets/dog8.jpeg")
  }
];

export const Card = ({ pic, title, caption }) => (
  <Tile
    imageSrc={pic}
    imageContainerStyle={styles.imageContainer}
    activeOpacity={1}
    title={title}
    titleStyle={styles.title}
    caption={caption}
    captionStyle={styles.caption}
    containerStyle={styles.container}
    featured
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  imageContainer: {
    width: SCREEN_WIDTH - 30,
    height: SCREEN_HEIGHT - BOTTOM_BAR_HEIGHT * 6,
    borderRadius: 20,
    overflow: "hidden" // this does magic
  },
  title: {
    position: "absolute",
    left: 10,
    bottom: 30
  },
  caption: {
    position: "absolute",
    left: 10,
    bottom: 10
  }
});

class HomeScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={swiperStyles.container}>
        <Swiper
          cards={HomeScreenPics}
          renderCard={Card}
          infinite
          backgroundColor="white"
          cardHorizontalMargin={0}
          stackSize={2}
        />
      </SafeAreaView>
    );
  }
}

const swiperStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  }
});

export default HomeScreen;
