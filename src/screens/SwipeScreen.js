import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
import Card from "../components/Card";

const {
  event,
  set,
  eq,
  cond,
  clockRunning,
  Clock,
  Value,
  stopClock,
  startClock,
  spring,
  debug,
  lessThan,
  defined,
  add,
  multiply,
  sub,
  and,
  neq,
  call,
  concat,
  interpolate,
  Extrapolate
} = Animated;

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

function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  // const config = {
  //   damping: 12,
  //   mass: 1,
  //   stiffness: 121.6,
  //   overshootClamping: false,
  //   restSpeedThreshold: 0.001,
  //   restDisplacementThreshold: 0.001,
  //   toValue: new Value(0)
  // };

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0)
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
}

export default class SwipeScreen extends Component {
  constructor(props) {
    super(props);
    const TOSS_SEC = 0.2;

    const dragX = new Value(0);
    const dragY = new Value(0);

    const gestureState = new Value(State.UNDETERMINED);
    const dragVX = new Value(0);
    const dragVY = new Value(0);

    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: dragX,
          velocityX: dragVX,
          translationY: dragY,
          velocityY: dragVY,
          state: gestureState
        }
      }
    ]);

    const transX = new Value();
    const prevDragX = new Value(0);

    const transY = new Value();
    const prevDragY = new Value(0);

    const clockX = new Clock();
    const clockY = new Clock();

    // If transX has not yet been defined we stay in the center (value is 0).
    // When transX is defined, it means drag has already occured. In such a case
    // we want to snap to -100 if the final position of the block is below 0
    // and to 100 otherwise.
    // We also take into account gesture velocity at the moment of release. To
    // do that we calculate final position of the block as if it was moving for
    // TOSS_SEC seconds with a constant speed the block had when released (dragVX).
    // So the formula for the final position is:
    //   finalX = transX + TOSS_SEC * dragVelocityX
    //
    // const snapPoint = cond(
    //   lessThan(add(transX, multiply(TOSS_SEC, dragVX)), 0),
    //   -100,
    //   100
    // );
    const snapPoint = 0;

    this._transX = cond(
      eq(gestureState, State.ACTIVE),
      [
        stopClock(clockX),
        set(transX, add(transX, sub(dragX, prevDragX))),
        set(prevDragX, dragX),
        transX
      ],
      [
        set(prevDragX, 0),
        set(
          transX,
          cond(
            defined(transX),
            runSpring(clockX, transX, dragVX + dragVY, snapPoint),
            0
          )
        )
      ]
    );

    this._transY = cond(
      eq(gestureState, State.ACTIVE),
      [
        stopClock(clockY),
        set(transY, add(transY, sub(dragY, prevDragY))),
        set(prevDragY, dragY),
        transY
      ],
      [
        set(prevDragY, 0),
        set(
          transY,
          cond(
            defined(transY),
            runSpring(clockY, transY, dragVX + dragVY, snapPoint),
            0
          )
        )
      ]
    );

    //   this._transY = cond(
    //     eq(gestureState, State.END),
    //     [
    //       set(dragY, runSpring(clockY, dragY, dragVY, 0)),
    //       set(prevDragY, dragY),
    //       dragY
    //     ],
    //     cond(eq(gestureState, State.BEGAN), [stopClock(clockY), dragY], dragY)
    //   );
    //   this._transX = cond(
    //     eq(gestureState, State.END),
    //     [
    //       set(dragX, runSpring(clockX, dragX, dragVX, snapPoint)),
    //       set([prevDragY], dragX),
    //       cond(and(eq(clockRunning(clockX), 0), neq(dragX, 0)), [call([dragX])]),
    //       dragX
    //     ],
    //     cond(eq(gestureState, State.BEGAN), [stopClock(clockX), dragX], dragX)
    //   );
  }
  static defaultProps = {
    likeOpacity: 1,
    nopeOpacity: 1
  };
  render() {
    const rotateZ = concat(
      interpolate(this._transX, {
        inputRange: [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP
      }),
      "deg"
    );
    const likeOpacity = interpolate(this._transX, {
      inputRange: [0, SCREEN_WIDTH / 4],
      outputRange: [0, 1]
    });
    const nopeOpacity = interpolate(this._transX, {
      inputRange: [-SCREEN_WIDTH / 4, 0],
      outputRange: [1, 0]
    });
    const { onGestureEvent } = this;
    return (
      <View style={styles.container}>
        <PanGestureHandler
          // onGestureEvent={this.onGestureEvent}
          {...{ onGestureEvent }}
          onHandlerStateChange={this.onGestureEvent}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [
                  { translateX: this._transX },
                  { translateY: this._transY },
                  { rotateZ }
                ]
              }
            ]}
          >
            {dogStack
              .map(d => (
                <Card
                  key={d.name}
                  profile={d}
                  likeOpacity={likeOpacity}
                  nopeOpacity={nopeOpacity}
                />
              ))
              .reverse()}
          </Animated.View>
        </PanGestureHandler>
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
