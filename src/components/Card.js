import React from "react";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import Animated from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const componentName = ({ profile, likeOpacity, nopeOpacity }) => (
  <View style={styles.card}>
    <Image style={styles.image} source={profile.pic} resizeMode="cover" />
    <View style={styles.overlay}>
      <View style={styles.header}>
        <Animated.View style={[styles.like, { opacity: likeOpacity }]}>
          <Text style={styles.likeLabel}>&#128525;</Text>
        </Animated.View>
        <Animated.View style={[styles.nope, { opacity: nopeOpacity }]}>
          <Text style={styles.nopeLabel}>&#128532;</Text>
        </Animated.View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.name}>{profile.name}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
    marginHorizontal: 12,
    borderRadius: 20
  },
  header: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footer: {
    flexDirection: "row"
  },
  name: {
    color: "white",
    fontSize: 32
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16
  },
  like: {
    // borderWidth: 4,
    // borderRadius: 5,
    padding: 8,
    borderColor: "#6ee3b4",
    transform: [{ rotate: "330deg" }]
  },
  likeLabel: {
    fontSize: 60,
    color: "#6ee3b4",
    fontWeight: "bold"
  },
  nope: {
    // borderWidth: 4,
    // borderRadius: 5,
    padding: 8,
    borderColor: "#ec5288",
    transform: [{ rotate: "30deg" }]
  },
  nopeLabel: {
    fontSize: 60,
    color: "#ec5288",
    fontWeight: "bold"
  }
});
export default componentName;
