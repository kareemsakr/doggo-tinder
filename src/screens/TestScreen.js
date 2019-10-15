import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const { set, cond, block, eq, add, Value, event, concat, multiply } = Animated;

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.X = new Value(0);
    this.Y = new Value(0);
    const offsetX = new Value(0);
    const offsetY = new Value(0);

    this.handlePan = event([
      {
        nativeEvent: ({ translationX: x, translationY: y, state }) =>
          block([
            set(this.X, add(x, offsetX)),
            set(this.Y, add(y, offsetY)),
            cond(eq(state, State.END), [
              set(offsetX, add(offsetX, x)),
              set(offsetY, add(offsetY, y))
            ])
          ])
      }
    ]);
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={this.handlePan}
          onHandlerStateChange={this.handlePan}
        >
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ translateX: this.X }, { translateY: this.Y }]
              }
            ]}
          >
            <Animated.Image
              resizeMode="contain"
              source={require("./react-hexagon.png")}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE
  }
});
